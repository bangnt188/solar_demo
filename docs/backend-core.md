# Core kết nối Neon/R2 và public content

**Cập nhật phạm vi:** [mvp-dev chỉ dựng mock trước](mvp-mock.md), bao gồm Google Sheets. `INTEGRATION_MODE=mock` là mặc định; hướng dẫn cloud bên dưới được giữ cho giai đoạn sau khi duyệt scope.

Trạng thái 27/09/2026: đã triển khai code và test local. Chưa cấu hình tài khoản cloud hoặc xác minh credential Neon/R2 thực tế. Đây là phần nền tảng và luồng đọc public; chưa phải toàn bộ MVP admin/auth/survey.

## Hiểu

Repo có landing static và schema nội dung đã thiết kế. Yêu cầu mới là chuẩn bị hệ thống kết nối và tổ chức router/lib/core để tái sử dụng, đồng thời giữ Pages hoạt động. Không có auth provider/session đang chạy, nên không mở mutation/upload endpoint bằng token tạm hay tin role từ client.

## Thiết kế đã triển khai

```text
Next pages/layout/metadata            GET /api/v1/[resource]
          │                                    │
          │                         core/public-router (allowlist)
          │                         core/http (parse/policy/errors)
          └────────── services/public-content ──┘
                                  │
                       PublicContentRepository
                       /                      \
                 mock-content          postgres-content
                    │                    │          │
               local source       landing validator │
                                  + DTO projection  │
                                           database/client
                                                  │
                                            Neon/Postgres

Operator smoke / future authenticated media use case
                   │
       storage/r2: byte validation → WebP → scoped S3 command
                   │
             Cloudflare R2
```

### Module và interface

| Module | Interface và trách nhiệm |
| --- | --- |
| `src/core/http.ts` | `route<Input,Output>()`: thứ tự authorize → parse → execute, JSON envelope, request ID, no-store, lỗi an toàn |
| `src/core/public-router.ts` | Registry cố định `landing/projects/equipment`; resource lạ trả 404, không map URL thành tên bảng |
| `src/core/pagination.ts` | Kiểm limit 1–100, cursor có timestamp giữ microseconds + UUID, từ chối query lạ/trùng |
| `src/config/deployment.ts` | Target demo/server; production Vercel không được chạy nhầm demo |
| `src/config/server.ts` | Validate env ở server; TLS xác thực certificate; R2 endpoint thuộc account; không default credential |
| `src/infrastructure/database/client.ts` | Pool nhỏ tái sử dụng; query parameterized; transaction cùng client, rollback/release; read snapshot REPEATABLE READ |
| `src/repositories/public-content.ts` | Interface thực sự có hai adapter: source local và PostgreSQL |
| `src/repositories/postgres-content.ts` | Published pointer, catalog/status/media filters, keyset pagination; không query từng card |
| `src/features/landing/validation.ts` | JSON Schema + slot/item/order/anchor semantics từ thiết kế DB |
| `src/features/landing/projection.ts` | Resolve media slots và DTO public; loại section disabled, không serialize draft/media state |
| `src/services/public-content.ts` | Composition theo target; React request cache dùng chung snapshot giữa chrome/home/metadata |
| `src/components/screens/home-screen.tsx` | Registry typed key → component, render theo thứ tự DB; không eval/HTML/component name tùy ý |
| `src/infrastructure/storage/r2.ts` | Key hợp lệ; file ≤3 MiB; JPEG/PNG/WebP thật; ≤20 MP; bỏ EXIF/re-encode WebP; PUT có điều kiện không ghi đè |

**Generic nằm ở transport, pagination, transaction, content adapter, media-slot resolver và renderer registry.** SQL identifiers chỉ lấy từ descriptor code đã allowlist. Không có generic endpoint đọc/ghi mọi table hoặc tự sinh quyền từ tên resource. Hai module cần SQL khác nhau vẫn có query cụ thể, không bị ép vào một base repository CRUD.

Chọn `pg` và canonical SQL hiện có, chưa thêm Drizzle để tránh hai schema source cạnh tranh. Nếu bổ sung ORM sau này, import/introspect contract này và giữ migration journal; không chạy hai tool cùng sở hữu DDL. Node runtime phù hợp cả pool transaction và Sharp/S3 SDK. Đây là refinement của lựa chọn `pg + Drizzle` trong plan ban đầu.

Trade-off: đọc snapshot tại request-time giữ hiệu lực publish/hide/thu hồi media, nhưng mỗi request có chi phí DB và cold start. Chưa dùng shared cache vì cần thiết kế invalidation trước; pool max 2 chỉ giới hạn một instance, tổng connection vẫn tăng theo số instance serverless. Chạy gần Neon, dùng pooled runtime URL và đo tải trước go-live. PostgreSQL và R2 là dịch vụ quản lý; application không cần VPS/process thường trú, nhưng vẫn phụ thuộc quota và khả năng phục hồi của provider.

### Mở rộng có kiểm soát

- Thêm resource public: định nghĩa DTO và method repository, triển khai cả mock/Postgres, đăng ký parser/handler ở `core/public-router.ts`, rồi kiểm status/media filters và pagination. Không nhận SQL/table/role từ URL.
- Thêm section: cập nhật JSON Schema, union `SectionKey`, validator và renderer registry; thêm migration cho constraint section key nếu là loại mới. Đổi text, thứ tự, enabled hoặc media binding của loại section đã có chỉ cần revision dữ liệu qua service editor trong giai đoạn tiếp theo.
- Thêm use case ghi: hoàn thành session/authorization/CSRF trước; actor lấy từ server session. Dùng transaction và optimistic version ở service, để route chỉ authorize/parse/dispatch. Upload cần reservation/finalize/reconciliation ngoài thao tác ghi R2.

### HTTP contract hiện có

| Endpoint | Kết quả |
| --- | --- |
| `GET /api/v1/landing/` | Cấu hình public đã resolve ảnh, enabled sections và featured catalog |
| `GET /api/v1/projects/?limit=20&cursor=...` | `{items,nextCursor}` chỉ projects hợp lệ |
| `GET /api/v1/equipment/?limit=20&cursor=...` | Tương tự equipment |

Envelope thành công `{data,requestId}`; lỗi `{error:{code,message,requestId}}`. Không có `?revision`, `?table`, `?role`. GET/HEAD public only; HTTP verbs khác bị Next trả 405 (response mặc định của framework, không qua JSON envelope của core). Không bật CORS tùy ý. Cache-Control no-store; không leak provider exception/SQL/secret qua response hoặc route log.

Pool mặc định max 2/instance, connection timeout 5s, statement timeout 5s. Chưa đo capacity production; cần load test đúng region/compute. Cursor dùng `(created_at DESC,id ASC)` và giữ độ chính xác timestamp PostgreSQL, tránh bỏ sót hàng cùng millisecond.

R2 adapter có `put/head/remove/check`; đây là interface **server-side**, chưa có HTTP upload. Caller tương lai phải authorize, reserve PENDING/quota/idempotency, gọi put, finalize metadata và reconciliation theo [thiết kế](landing-database-design.md). Không tự gắn file đã upload thành READY hoặc public-use-approved trong DB. Operator `smoke:cloud -- --write` chỉ dùng ảnh synthetic rồi xóa ở sandbox.

## Validate security

- `server-only` chặn database/storage/env provider bị import vào client component. Demo build dùng environment allowlist và không copy `.env*`.
- DB connection URI không được override TLS bằng query options; runtime remote dùng certificate verification, local plaintext chỉ ngoài NODE_ENV=production.
- Landing đọc một transaction snapshot; catalog hide/soft-delete/media withdrawal được lọc ở mỗi request. Không fallback mock khi server DB lỗi hoặc chưa có published revision.
- Public API trả 503 khi dữ liệu chưa sẵn sàng. Trang HTML dùng Next error boundary với thông báo chung; status còn phụ thuộc thời điểm streaming của Next, không hứa HTML luôn trả 503.
- Protected route factory buộc chạy callback `authorize` trước parse/execute, nhưng đây **chưa phải implementation auth/CSRF**. Chưa đăng ký protected routes khi chưa có session policy thật.
- Upload adapter kiểm bytes trước khi gọi transport; key giới hạn đúng namespaces; credentials/bucket không nhận từ browser. Binary chuẩn hóa không có EXIF; không nhận SVG/HTML/animation.
- Snapshot validator không xác minh lời quảng cáo/quyền ảnh ngoài đời. Seed vẫn DRAFT và media unapproved; publish cần service quản trị có quyền ở phase tiếp theo.

## Đề xuất sử dụng

### Demo Pages

```sh
npm ci
npm run dev
npm run build:demo
npm run test:export
```

`build` cũng trỏ build demo để giữ workflow Pages hiện tại. Script build tạo bản sao tạm từ allowlist source/config/public/schema, bỏ API/admin chỉ trong bản sao; không xóa routes working tree. Dùng webpack cho build tạm để node_modules symlink không phụ thuộc filesystem root của Turbopack. Artifact cuối ở `out/`; branch `dev` workflow cũ tiếp tục dùng được. Demo ép `SEO_INDEXABLE=false`, đánh dấu sitemap static chỉ trong bản sao build, và không truyền cloud secrets. `next dev` không bật export mode; production demo build mới xuất `out/`.

### Server target

Chỉ thực hiện sau khi scope cloud được chốt. Copy `.env.example` thành `.env.local` đã được ignore, rồi chủ động đổi mode sang cloud và cấu hình **sandbox trước**:

```dotenv
DEPLOY_TARGET=server
INTEGRATION_MODE=cloud
APP_ENV=sandbox
NEXT_PUBLIC_SITE_URL=https://your-preview.example.com
SEO_INDEXABLE=false
DATABASE_URL=<pooled runtime-role URI>
R2_ACCOUNT_ID=<account id>
R2_BUCKET=<sandbox bucket>
R2_ACCESS_KEY_ID=<bucket-scoped key>
R2_SECRET_ACCESS_KEY=<secret>
R2_PUBLIC_BASE_URL=https://media-sandbox.example.com
```

Các dấu `<...>` là placeholder, không phải giá trị dùng được. Domain là HTTPS origin root; không prefix `/solar_demo`. Khi chạy local có thể dùng origin preview cho metadata trong lúc duyệt `http://localhost:3000`; cấu hình này không tạo TLS local. Không index local/preview.

```sh
npm run dev:server
npm run build:server
npm run start:server
```

Server build không truy cập database để prerender nội dung: `connection()` đẩy public data xuống request-time. Missing runtime credentials hoặc schema chưa published sẽ fail closed ở request. Trên Vercel: Build Command `npm run build:server`, `DEPLOY_TARGET=server`, đúng env scopes, output directory mặc định Next (không `out`).

### Migration/seed và smoke

Chỉ operator/release có `DATABASE_URL_DIRECT` của migration role, không đưa vào web runtime. Script đọc `.env.local` khi có, env đã đặt từ process được ưu tiên.

```sh
npm run db:migrate
npm run db:seed:sandbox
npm run smoke:cloud
```

- Migration dùng direct-session advisory lock, journal riêng `solar_migrations`, checksum và transaction. Chạy lại migration đã apply kiểm checksum rồi bỏ qua. DB có bảng tồn tại ngoài journal sẽ báo lỗi, không drop/overwrite.
- Demo seed bắt buộc `APP_ENV=sandbox`; chạy lại trùng ID sẽ rollback, không upsert đè nội dung biên tập.
- `smoke:cloud` mặc định read-only: kết nối/query DB schema và kiểm scoped R2 bucket. Không sửa DNS/resource/cloud billing.
- `npm run smoke:cloud -- --write` yêu cầu sandbox; tạo ảnh synthetic, PUT/HEAD kiểm kích thước, DELETE trong finally. Không kiểm CDN/cache hay end-to-end admin authorization bằng lệnh này.

Script chưa publish seed và không có lệnh tự approve mọi ảnh ngoài sandbox test. Cho đến khi có editor/publication service, DB trống hoặc seed DRAFT không được coi là website server sẵn sàng go-live.

### Kiểm thử và giới hạn bằng chứng

```sh
npm run typecheck
npm run test:core
npm run test:integration
npm run build:demo
npm run test:export
npm run build:server
```

Đã chạy thành công: 12 core/mock tests, PostgreSQL integration, migration chạy lại, seed duplicate, HTTP thật qua Next (API + HTML + phân trang + reject mutation), typecheck, build demo/server và 2 export checks. Server sitemap kiểm đồng thời cờ môi trường và `requestedIndexable` của landing; homepage noindex không xuất hiện trong sitemap dù môi trường đã cho index.

Integration runner dùng PostgreSQL tạm qua Unix socket và loopback cho migration CLI; không đọc runtime DATABASE_URL để chọn DB test. Kiểm migration chạy hai lần, seed duplicate, published projection, phân trang không trùng/bỏ sót, tombstone, transaction rollback và media withdrawal. R2 được test qua SDK transport giả và decoder Sharp thật; **chưa kiểm R2 cloud thực tế**. Chạy cloud smoke bằng credentials sandbox rồi mới xác nhận provider connectivity.

Google Sheets đã có contract và mock adapter, chưa có live transport. Auth/session/ROOT guard, admin CRUD/editor/publish HTTP, survey save/Sheets worker retry, upload reservation/finalize và automated reconciliation vẫn là các mục MVP chưa triển khai. Phần core hiện có không thay thế các gate đó trước production.

## Migration path và rollback

Code giữ demo adapter và dữ liệu nguồn để Pages không lệ thuộc DB. Chuyển server chỉ sau khi runtime env, migrations và reviewed published content sẵn sàng. Nếu rollback về demo, đổi target/deployment về artifact Pages tương ứng; không xóa Neon/R2 hoặc mất dữ liệu đã ghi. Repositories có interface nhỏ nên thay provider DB không đổi routing/renderer; media URL origin nằm ở config, immutable key giữ đường nâng cấp.

Tài liệu API được đối chiếu với guide Next cài trong repo, [node-postgres transactions](https://node-postgres.com/features/transactions), [TLS config](https://node-postgres.com/features/ssl), [Cloudflare R2 SDK](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/), [R2 conditional operations](https://developers.cloudflare.com/r2/api/s3/api/) và [Ajv JSON Schema](https://ajv.js.org/json-schema.html).
