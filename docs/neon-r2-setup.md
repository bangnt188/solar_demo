# Hướng dẫn kết nối Neon và Cloudflare R2 cho Solar MVP

Ngày kiểm tra tài liệu nguồn: 27/09/2026. **Runbook cho thao tác tài khoản; chưa tạo tài nguyên hoặc kiểm chứng kết nối cloud.** Code kết nối, migration và smoke đã có trong [backend-core.md](backend-core.md).

Tài liệu chính: [kế hoạch MVP](mvp-implementation-plan.md). Quyết định/trade-off: [ADR-0001](adr/0001-serverless-mvp.md). Thực hiện theo thứ tự: hiểu tài nguyên → thiết kế môi trường → validate quyền/bảo mật → triển khai và nghiệm thu.

Schema nội dung đã được chuẩn bị tại [thiết kế DB landing](landing-database-design.md): apply qua migration runner vào schema trống ở sandbox trước; chưa apply lên Neon. Media dùng thêm namespace `landing/<revision-uuid>/<media-uuid>.webp`; cleanup kiểm references của cả landing revisions và catalog. Không coi bộ SQL này là toàn bộ schema auth/survey MVP.

## 1. Hiểu: cần chuẩn bị gì

Owner chuẩn bị tài khoản tổ chức cho Neon, Cloudflare và Vercel; bật MFA, có người phụ trách billing/recovery. Domain trong brief là `luaxanhdongbang.com`; code email khảo sát hiện dùng `.vn`, cần xác minh trước cấu hình. Không gửi credentials vào chat, issue, screenshot hay tài liệu này.

| Tài nguyên | Production | Sandbox dùng local/preview |
| --- | --- | --- |
| Neon | Project `solar-lxdb-prod`, database `solar` | Project `solar-lxdb-sandbox`, database `solar` |
| DB role | `solar_app` và `solar_migrator`, password riêng | Cùng tên được, credentials khác |
| R2 bucket | `solar-lxdb-media-prod` | `solar-lxdb-media-sandbox` |
| R2 S3 token | Object Read & Write, chỉ bucket prod | Token khác, chỉ bucket sandbox |
| App | Vercel Production, branch `main` | Vercel Preview của `dev` hoặc local runtime |
| Media domain | `media.luaxanhdongbang.com` | Subdomain sandbox riêng nếu cần browser smoke |
| Sheet/OAuth/Turnstile | Resources/credentials production | Resources/credentials test riêng |

Tên trên là quy ước đề xuất, chưa phải resource đang tồn tại. Hai Neon projects giúp sandbox không vô tình copy PII/password từ production branch. Không clone production có dữ liệu thật sang preview. Không thêm Git branch staging; database resources không phải Git branches.

Ghi vào hồ sơ bàn giao: owner, project/bucket IDs, region, URL dashboard, environment scope, credential label/ngày rotate, backup window và budget threshold. Không ghi secret value hay connection string đầy đủ.

## 2. Thiết kế kết nối Neon

### 2.1 Tạo project và database

1. Neon Console → New Project; tạo **sandbox trước**. Chọn region gần Vercel function region dự kiến; kiểm tra cả hai provider thực sự hỗ trợ region đó. Giữ write runtime cùng vùng, đo RTT trước khi chốt production.
2. Tạo database `solar`; ghi branch/compute ID vào inventory. Chọn autoscaling range và backup/history retention phù hợp gói đang dùng. Không giả định free plan có retention đủ cho production.
3. Lặp lại cho project production sau khi sandbox smoke pass. Chọn region/retention là thao tác có ảnh hưởng dữ liệu/chi phí; owner thực hiện với quyền tài khoản của họ.

### 2.2 Tách role runtime và migration

Tạo login role bằng quy trình bảo mật của Neon/SQL operator; password ngẫu nhiên lưu password manager. Mục tiêu:

| Role | Được phép | Không được phép |
| --- | --- | --- |
| `solar_migrator` | Sở hữu schema/table ứng dụng; migration/index/constraint | Không dùng làm runtime web |
| `solar_app` | CONNECT, schema USAGE, DML các bảng app/auth, sequence cần thiết | Không owner, không CREATE schema/table, không quản trị role/database |

Tách role không thay thế authorization ROOT/ADMIN/USER: đây là quyền ứng dụng, không phải tạo một DB login cho mỗi người dùng.

Ví dụ contract quyền dưới đây dùng schema riêng `solar_appdata` trong database `solar`. Operator tạo roles trước và chạy phần tạo schema bằng role có quyền; không paste password vào SQL file commit. Runtime hiện dùng `pg` và canonical SQL. Nếu bổ sung ORM **hoặc auth adapter**, cùng dùng schema/table mapping này, không để auth vô tình tạo bảng ở schema khác.

```sql
-- Chạy bởi database owner trên database solar, sau khi roles tồn tại.
CREATE SCHEMA IF NOT EXISTS solar_appdata AUTHORIZATION solar_migrator;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CONNECT ON DATABASE solar TO solar_app, solar_migrator;
GRANT USAGE ON SCHEMA solar_appdata TO solar_app;

-- Chạy bởi solar_migrator; migration cũng phải dùng chính role này.
ALTER DEFAULT PRIVILEGES IN SCHEMA solar_appdata
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO solar_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA solar_appdata
  GRANT USAGE, SELECT ON SEQUENCES TO solar_app;

-- Sau khi migrations tạo bảng:
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA solar_appdata TO solar_app;
GRANT USAGE, SELECT
  ON ALL SEQUENCES IN SCHEMA solar_appdata TO solar_app;
```

Không cấp quyền runtime lên migration journal nếu journal chứa thông tin không cần cho app; đặt journal ở schema migration riêng, không cấp USAGE/DML. Default privileges chỉ áp dụng cho objects do role đặt defaults tạo ra; kiểm tra owner thật sau migration. Kiểm tra các quyền mặc định/role membership của Neon thay vì mặc định mọi role được tạo trong dashboard đều đã least-privilege.

### 2.3 Lấy hai connection strings

Trong Neon → Connect: chọn đúng project/branch/database/role. Sao chép nguyên URI do Console cấp, không tự sửa hostname/password/SSL params.

- Bật **Connection pooling**, chọn `solar_app` → `DATABASE_URL` cho runtime; hostname pooled có `-pooler`.
- Tắt pooling, chọn `solar_migrator` → `DATABASE_URL_DIRECT` cho migration/restore tooling.
- Giữ TLS, xác thực chứng thư theo driver/URI được Neon hỗ trợ; không dùng `rejectUnauthorized: false`, không bỏ TLS để chữa lỗi kết nối.

Neon dùng PgBouncer transaction pooling; direct connection dành cho tác vụ cần session semantics và migrations. [Neon connection pooling](https://neon.com/docs/connect/connection-pooling).

### 2.4 Lưu và dùng secrets

Local server target: `.env.local` ở workspace, chỉ sandbox; kiểm tra `.gitignore` trước. Không `source .env.local` như shell script; để Next/config loader đọc env. Production runtime: Vercel Project → Settings → Environment Variables → scope **Production**. Preview: credentials sandbox ở scope **Preview**, tuyệt đối không tick production values sang mọi environment.

`DATABASE_URL_DIRECT` chỉ nằm trong protected release environment/secret store của migration operator. Không đưa credential DDL vào Vercel web runtime hay GitHub Pages workflow. Vercel build không tự chạy migrations.

### 2.5 Kết nối trong application

1. Đã có env validation, database client `server-only`, `pg` pool và PostgreSQL content adapter; canonical SQL là nguồn DDL duy nhất, chưa dùng Drizzle. Không khởi tạo DB khi build target demo; production missing env phải fail rõ, không chuyển sang mock.
2. Tạo pool nhỏ tái sử dụng trong process instance; mặc định đề xuất max 2, connection timeout 5 giây, statement timeout 5 giây. Đây là giá trị khởi đầu cần đo, không SLO của Neon.
3. Migration runner đã có checksum/journal và dùng direct URL; chạy synthetic seed **chỉ sandbox**. Bootstrap ROOT tách khỏi migration và không hard-code password/email cá nhân trong source.
4. Thực hiện query với schema-qualified table names; không dựa vào session `search_path` thay đổi ở một request rồi dùng lại qua pooler.
5. Đọc hướng dẫn Next cục bộ về auth/route handlers/server-only trước khi implement: bản repo này có quy ước Next khác các ví dụ cũ.

### 2.6 Nghiệm thu Neon

Chạy từ sandbox runtime thực tế, không chỉ từ SQL Console:

```sql
SELECT 1 AS ok, current_database(), current_user;
SELECT has_schema_privilege(current_user, 'solar_appdata', 'USAGE') AS can_use_schema;
SELECT has_schema_privilege(current_user, 'solar_appdata', 'CREATE') AS can_create_in_app_schema;
```

Kỳ vọng role runtime đúng và `can_create_in_app_schema = false`. Kèm negative test tạo table trong transaction phải bị permission denied. Kiểm tra membership/ownership để bảo đảm không thể lấy quyền owner qua role khác; query một quyền schema chưa chứng minh toàn bộ least privilege.

Tiếp theo: insert/read/update/delete record synthetic qua service và rollback transaction test; thử unique slug/FK; đo latency cold/warm và pool saturation. Deploy preview rồi lặp lại kiểm tra runtime. Log chỉ test ID + status; redact query params chứa PII/credentials. Bằng chứng phải ghi deployment ID và môi trường.

## 3. Thiết kế kết nối Cloudflare R2

### 3.1 Tạo bucket

1. Cloudflare dashboard → R2 Object Storage; kiểm tra/enable billing theo account hiện tại. Tạo bucket sandbox trước, sau đó production.
2. Chọn location hint/jurisdiction theo yêu cầu dữ liệu thực tế. Nếu có yêu cầu jurisdiction, dùng endpoint tương ứng do Cloudflare công bố; không ép endpoint mặc định cho bucket bị ràng buộc jurisdiction.
3. Ban đầu để bucket private khi provisioning. Chỉ gắn public domain sau khi xác nhận bucket chỉ chứa ảnh marketing đủ quyền công khai. Không upload tài liệu khách hàng để “test”.
4. Giữ static logo/icon/background trong `public/`; R2 dành cho admin-uploaded media. Không tạo thư mục gallery thủ công; key do backend sinh.

### 3.2 Tạo S3 API credential tối thiểu

R2 Overview → Account Details → API Tokens → Manage. Tạo account-owned token nếu quyền tổ chức cho phép; token gắn user cá nhân có rủi ro mất hiệu lực khi user rời tổ chức. Chọn **Object Read & Write**, scope **chỉ bucket của môi trường tương ứng**; không Admin Read & Write hoặc All buckets.

Lưu `Access Key ID`, `Secret Access Key` vào secret store ngay khi tạo; secret không hiển thị lại. Account ID lấy từ dashboard. Không dùng Global API Key thay S3 credentials. [Cloudflare R2 authentication](https://developers.cloudflare.com/r2/api/tokens/).

Contract storage client:

```text
SDK:       @aws-sdk/client-s3
region:    auto
endpoint:  https://<ACCOUNT_ID>.r2.cloudflarestorage.com
bucket:    R2_BUCKET
accessKey: R2_ACCESS_KEY_ID
secretKey: R2_SECRET_ACCESS_KEY
```

Bucket có jurisdiction phải cấu hình `R2_ENDPOINT` theo endpoint chính thức; endpoint là server config, không nhận từ request. [AWS SDK v3 với R2](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/).

### 3.3 Gắn domain ảnh

1. Zone `luaxanhdongbang.com` phải ở Cloudflare account phù hợp với bucket. Nếu cần chuyển nameserver, inventory toàn bộ DNS và chuẩn bị rollback trước; giữ MX/SPF/DKIM/DMARC của email.
2. R2 → bucket production → Settings → Custom Domains → Add → `media.luaxanhdongbang.com` → kiểm tra DNS record rồi Connect Domain.
3. Chờ trạng thái Active và TLS hợp lệ. Đặt `R2_PUBLIC_BASE_URL=https://media.luaxanhdongbang.com` trong server env.
4. Giữ **Public Development URL (`r2.dev`) disabled**. Không CNAME media domain tới `r2.dev` và không dùng S3 endpoint làm URL ảnh public.
5. Sandbox dùng domain riêng nếu cần test ảnh qua browser; chỉ chứa dữ liệu synthetic. Không reuse media domain production cho preview.

Mỗi image key bất biến, có thể dùng `Cache-Control: public, max-age=31536000, immutable`. Đổi ảnh phải sinh key mới. Xóa ảnh khẩn cấp cần DeleteObject + purge CDN; “hide project” chỉ ẩn catalog. [R2 custom domains và public access](https://developers.cloudflare.com/r2/buckets/public-buckets/).

### 3.4 CORS và đường upload

MVP upload qua Next.js API cùng origin, API gọi R2 server-to-server. **Không cần mở CORS upload cho browser** và không tạo CORS `*` để chữa lỗi server credential. `<img>` hiển thị ảnh public thông thường không cần quyền browser PUT.

Nếu sau này dùng presigned URLs, phải có ADR riêng cho quarantine/finalize; cấu hình CORS chỉ các origin/method/header thật sự dùng. Presign là quyền tạm thời, CORS không thay thế authorization. [Cloudflare R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/).

### 3.5 Việc dev cần thực hiện trong adapter

- Dùng operations PutObject/HeadObject/GetObject/DeleteObject cần thiết; không yêu cầu ListBuckets toàn account cho smoke test.
- Validate JPEG/PNG/WebP thật, ≤ 3 MiB input/output và ≤ 20 megapixel; decode/re-encode bỏ metadata trước PutObject. Một request một ảnh. Lưu `Content-Type` từ output thật và key do server sinh.
- Dùng state PENDING/READY/DELETE_PENDING và idempotency contract trong [MVP plan](mvp-implementation-plan.md); R2 write success không tự có nghĩa metadata DB đã commit.
- URL public chỉ dẫn xuất từ base URL đã allowlist và key đã chuẩn hóa, không fetch URL tùy ý do client gửi. Không accept bucket/endpoint tùy ý qua API.
- Retry SDK bounded và timeout, luôn phân biệt permission error, network error và object-not-found; không retry vô hạn.

### 3.6 Nghiệm thu R2 từ sandbox

Repo đã có `smoke:cloud`: mặc định query DB + HeadBucket; `--write` chỉ cho sandbox, PUT/HEAD kiểm MIME/size rồi DELETE ảnh synthetic. Các bước GetObject/checksum, kiểm delete tại origin, token cross-bucket và admin end-to-end dưới đây vẫn là nghiệm thu bổ sung, chưa được tự động hóa:

1. Sinh một ảnh synthetic nhỏ, key `landing/<synthetic-owner-uuid>/<asset-uuid>.webp` trong bucket sandbox; script dùng namespace đã allowlist của storage adapter.
2. PutObject → HeadObject kiểm MIME/size → GetObject kiểm SHA-256 bytes; sau đó DeleteObject → HeadObject xác nhận not found. Không cần log binary, token hoặc signed URL.
3. Dùng sandbox token truy cập bucket prod phải bị từ chối; không thử đọc object khách hàng để chứng minh permission.
4. Lặp lại smoke từ Vercel Preview. Khi test public domain, fetch ảnh lúc chưa xóa, kiểm HTTPS/Content-Type; tránh cached GET làm hiểu sai kết quả delete. S3 HeadObject là kiểm tra origin; kiểm CDN purge riêng.
5. Upload qua màn hình admin phải tạo READY metadata/gallery đúng entity. Gọi trực tiếp API với USER/anonymous bị từ chối trước R2 write.

R2 không có transaction với Neon. Chạy fault tests và maintenance dry-run trước production. Không bật lifecycle “xóa mọi object sau N ngày” cho bucket media vì sẽ phá ảnh đang tham chiếu. Chỉ cleanup dựa trên trạng thái DB và thời gian an toàn; giữ phương án backup object nếu yêu cầu phục hồi cả khi bị xóa nhầm/credential bị chiếm.

## 4. Cấu hình Vercel và ma trận biến môi trường

Vercel import cùng repository, Production Branch=`main`, Next.js preset. Dev phải hoàn thành `build:server` trước khi cấu hình Build Command đó; output dùng Next mặc định, **không đặt Output Directory=`out`**. Giữ `dev` → Pages workflow bằng demo command riêng.

Bảng dưới là env contract đề xuất cần bổ sung vào `.env.example` khi implement; lượt tài liệu này không thay file cấu hình. Biến public không phải secret, nhưng không vì vậy mà public được role/password/token.

| Biến | Mục đích | Nơi lưu |
| --- | --- | --- |
| `DEPLOY_TARGET` | `demo` hoặc `server`, kiểm tra ở build | CI/Vercel/local, không secret |
| `NEXT_PUBLIC_SITE_URL` | Canonical app origin; Pages có `/solar_demo/`, server production không prefix | Từng target; build lại khi đổi |
| `SEO_INDEXABLE` | false cho demo/preview và trước go-live | Build environment |
| `DATABASE_URL` | Pooled runtime `solar_app` | Vercel runtime scope riêng / local sandbox |
| `DATABASE_URL_DIRECT` | Direct `solar_migrator` | Protected release job/operator, không web runtime |
| `R2_ACCOUNT_ID` | Account chứa bucket | Server config |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | S3 token theo bucket | Server secret |
| `R2_BUCKET` | Bucket đúng môi trường | Server config |
| `R2_ENDPOINT` | Override chỉ khi bucket jurisdiction yêu cầu | Server config allowlist |
| `R2_PUBLIC_BASE_URL` | Custom media domain | Server config; URL ảnh được gửi client |
| `AUTH_SECRET` | Map vào secret option của auth library | Server secret, khác sandbox/prod |
| `AUTH_BASE_URL` | Origin auth HTTPS cố định | Server config, không tin Host tùy ý |
| `AUTH_GOOGLE_CLIENT_ID`, `AUTH_GOOGLE_CLIENT_SECRET` | Chỉ khi quyết định Google OIDC được chốt | Server config/secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public challenge key, được phép prefix public | Build env |
| `TURNSTILE_SECRET_KEY` | Server-side verify token | Server secret |
| `ABUSE_KEY_SECRET` | HMAC khóa IP rate-limit, tránh raw IP log | Server secret |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Google Sheets service identity | Server secret; giữ newline PEM chính xác |
| `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB` | Tab tích hợp, mặc định `Raw_Submissions` | Server config, tách sandbox/prod |
| `CRON_SECRET` | Xác thực endpoint survey sync | Server secret, không query string/client |

Auth variable names là contract application; dev phải map tường minh vào library, không giả định thư viện tự đọc mọi tên này. Với local server, dùng local HTTPS hoặc điều chỉnh validator chỉ cho HTTP loopback ở development; `src/config/site.ts` hiện chỉ chấp nhận HTTPS. Không nới HTTPS validation cho production. Callback OAuth cần khớp chính xác origin/path do auth adapter cung cấp và được đăng ký tại provider.

Generate secret bằng công cụ/password manager tin cậy, entropy đủ theo yêu cầu thư viện. Không đưa secret value vào command line history, CI output hay build artifact. Không commit `.env.local`; `.env.example` chỉ tên biến/chú thích.

### 4.1 Google Sheets để hoàn thành toàn bộ MVP

Neon/R2 kết nối thành công chưa hoàn thành MVP. Google Cloud project cần bật Sheets API, có service account riêng, key quản lý theo lifecycle và Sheet share Editor chỉ với identity cần ghi. Không public link Sheet, không cấp Drive-wide access không cần thiết. Trong Google Sheet tạo tab raw header cố định và bảo vệ cấu trúc row; sales xem bằng filter view/tab vận hành. Ghi `valueInputOption=RAW` để input không bị hiểu thành công thức. [Sheets values guide](https://developers.google.com/workspace/sheets/api/guides/values).

Production scheduler gọi worker mỗi 5 phút với bearer secret; kiểm tra Vercel plan đáp ứng lịch. Worker phải validate authorization header trước claim data. Preview không được chạy job với Google production secrets. Mất Google access phải tạo alert và backlog ở Neon, không làm submission mất hoặc trả thành công giả. [Vercel cron security/management](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

### 4.2 Kiểm soát DNS và origin

MVP dùng Cloudflare DNS cho app domain, cấu hình record chính xác theo Vercel dashboard. Đề xuất app record DNS-only ở giai đoạn đầu để Vercel phục vụ TLS/routing rõ ràng; domain R2 cấu hình qua R2 Custom Domains. Khi bật proxy Cloudflare cho app cần kiểm tra lại TLS/cache/cookie/redirect, tuyệt đối không cache `/admin`, `/api`, auth callbacks hoặc responses có session. Không lấy việc có Cloudflare DNS làm bằng chứng WAF đang bảo vệ origin Vercel.

## 5. Validate security trước go-live

| Kiểm tra | Kỳ vọng |
| --- | --- |
| Role runtime / migration | Runtime không DDL/owner; direct migration secret không xuất hiện trong web env |
| Môi trường | Preview dùng DB/R2/Sheet sandbox, synthetic data; Pages không có cloud secrets |
| Bucket/token | R2 token không có bucket admin/all-buckets; không file PII trong public bucket |
| Browser bundle | Không connection string, S3 secret, auth secret, private key; public site key Turnstile được phép |
| ROOT / session | Direct-ID attacks và auth library endpoints không bypass ROOT protection; revoke có hiệu lực |
| Upload | Unauthorized/sai MIME/quá byte/quá pixel bị chặn; pending reconciliation không xóa ảnh active |
| Survey | COMMIT Neon trước receipt; Sheet timeout không mất dữ liệu; retry không thêm hàng trùng |
| Monitoring | Alert cho DB errors/pool saturation, R2 errors/storage budget, sync FAILED/oldest pending > 15 phút |
| Recovery | Có backup retention thật, restore drill, credentials rotation và người vận hành nhận trách nhiệm |
| Nội dung/PII | Domain/email, quyền ảnh, retention và danh sách nhận Sheet được duyệt |

Đây là checklist cần thực thi, chưa mục nào được đánh dấu PASS từ tài khoản thực tế. Chốt ngưỡng chi phí bằng ngân sách owner trên từng provider; không ghi giá cố định trong kế hoạch vì phụ thuộc plan/region/lưu lượng. Giới hạn storage/object count/request cần được theo dõi cùng quota trong ứng dụng.

## 6. Đề xuất trình tự thực hiện và xử lý lỗi

Thứ tự: sandbox resources → credential scope → migration/schema → runtime DB smoke → R2 SDK smoke → admin end-to-end → survey retry tests → preview UAT → production resources/migration → release smoke → domain cutover. Với mỗi bước, lưu test ID, môi trường, kết quả và thời điểm trong release checklist; không lưu credentials.

| Triệu chứng | Kiểm tra đúng | Không làm |
| --- | --- | --- |
| Neon auth/TLS fail | Đúng project/role/password encoded, URI Console, SSL config driver | Tắt TLS, dùng owner để che lỗi permission |
| Neon timeout | Region, cold start, pool waiting, statement/query plan, connection leaks | Tăng max pool vô hạn hoặc retry tất cả mutation |
| Migration fail | Direct URL, object owner, migration lock/journal, schema mapping | Chạy migration tự động ở mọi request/build |
| R2 403 / signature mismatch | Token bucket scope, account/endpoint/jurisdiction, signing config | Mở public bucket hoặc CORS `*` để chữa S3 auth |
| R2 PUT pass nhưng ảnh không hiện | Custom domain Active/TLS, key/content type, URL adapter, browser/network | Ghép S3 endpoint vào public image URL |
| Upload 413 | 3 MiB app limit, raw body size, một ảnh/request | Tăng Next limit rồi bỏ qua cap Vercel |
| Ảnh vẫn hiện sau delete | CDN cache, purge path; kiểm S3 origin riêng | Kết luận DeleteObject thất bại chỉ từ cached URL |
| Pages build lỗi cookies/API | Demo packaging có bỏ đúng server routes/dependencies không | Tắt kiểm tra auth để static export build được |
| Google 403 / backlog | Sheet sharing, API enablement, credential, tab/range, cron auth/plan | Đổi frontend gọi Sheet hoặc bỏ submission Neon |

### 6.1 Rotation và rollback

R2: tạo token mới cùng scope → cập nhật env → redeploy/smoke → revoke token cũ; khi có lộ secret thì revoke khẩn cấp theo incident severity, chấp nhận gián đoạn cần thiết. DB: dùng role/credential thay thế theo quy trình operator → grant tối thiểu → deploy smoke → revoke cũ. Auth secret rotation có thể kết thúc sessions, phải thông báo vận hành. Google key cũ xóa sau verify key mới và ghi ngày rotation.

Backup DB không sao lưu binary R2. Có thể phục hồi metadata mà object đã mất; vì vậy immutable keys, deferred delete và backup object theo mục tiêu phục hồi là ba việc riêng. Trước go-live, owner phải xác nhận recovery point/time mong muốn và chạy thử, không chỉ bật một checkbox backup.

Rollback ứng dụng giữ schema backward compatible và dữ liệu mới đã nhận. Nếu quay lại landing page/mailto, ngừng intake server rõ ràng và đối soát lead còn pending; không xóa bucket/database để “quay về ban đầu”. Xem quy trình chi tiết trong [release/rollback plan](mvp-implementation-plan.md#45-release-và-rollback).
