# Lúa Xanh Đồng Bằng — Next.js demo

Nhánh `dev` tích hợp backend giai đoạn 1 và giữ hai build target: demo static chạy trên Cloudflare Workers tại <https://lxdb.captain-solution.tech/>, server Next.js đọc public content từ PostgreSQL. Nhánh `main` dành cho production Vercel; **backend core không đồng nghĩa CMS/auth/admin đã hoàn thành hoặc cloud đã được nghiệm thu**. Xem [backend core](docs/backend-core.md).

## Chạy local

Yêu cầu Node.js 22 và npm.

```sh
git submodule update --init --recursive
npm ci
npm run dev
# http://localhost:3000/solar_demo/
```

Chạy `npm run pull` để cập nhật các submodule theo nhánh trong `.gitmodules`
(backend `main`, UI `main`). Lệnh dừng nếu submodule có thay đổi chưa commit.
Sau khi pull, review rồi commit gitlink mới ở repo Solar để ghim các phiên bản
đã chọn. Do các repo submodule đang private, cần đăng nhập GitHub CLI bằng
`gh auth login` hoặc cấu hình Git credential có quyền đọc cả hai repo.

Kiểm tra bản export: `npm run build && npm run test:export`. `@solar/ui` ở `packages/ui/` là npm workspace **và Git submodule** trỏ tới [component-ui](https://github.com/bangnt188/component-ui). Clone mới dùng `git clone --recurse-submodules`, hoặc chạy `git submodule update --init --recursive` trước `npm ci`. Package công khai các entry point `@solar/ui`, `@solar/ui/basic`, `@solar/ui/components`, `@solar/ui/forms`, `@solar/ui/validation`, `@solar/ui/i18n`, `@solar/ui/tokens`, `@solar/ui/styles`; theme import trong `src/app/layout.tsx`. `src/features/catalog/` giữ card cần kiểu dữ liệu và ảnh riêng Solar; `src/features/survey/` giữ schema/form nghiệp vụ, dùng adapter RHF của package. Sections, screens và chrome còn lại trong `src/components/` vẫn là composition của app Solar, không export từ package.

`src/app/layout.tsx` import theme của package và gắn `data-ui-root` lên `<body>` để reset được giới hạn trong app. Chạy `npm run test:ui` để kiểm tra package; `npm run build && npm run test:export` xác minh app tiêu thụ UI và static export.

Thay đổi UI chung phải commit và push trong `component-ui` trước, rồi cập nhật gitlink bằng `git submodule update --remote packages/ui` và commit con trỏ mới ở Solar. Không sửa UI chung trực tiếp ở repo Solar mà quên push submodule.

Package có các control phổ biến `Avatar`, `ButtonGroup`, `ProgressBar`, `Modal`, `Drawer`, `Popover`, `DropdownMenu`, `PasswordField` và adapter `FormPasswordField` bên cạnh bộ field/navigation đã có. Popup/menu nhận `open`/`defaultOpen`/`onOpenChange`, không giữ hai bản open state; app tiếp tục sở hữu dữ liệu, quyền và hành động nghiệp vụ. `NumberField` định dạng số hữu hạn theo locale và dùng hidden native input cho form; `DecimalField` giữ chuỗi canonical chính xác. Xem [hợp đồng component/state](docs/ui-system-architecture.md).

Visual canonical: [DESIGN.md](DESIGN.md); kiến trúc composition và ảnh nghiệm thu component nằm ở [UI composition](docs/ui-composition.md) và [docs/ui-components-reference.png](docs/ui-components-reference.png). Chạy `npm run preview:ui --workspace=@solar/ui` để xem các component thật và thử trạng thái trong thư viện độc lập; bản preview này không thay trang sản phẩm của Solar.

Server target có public API `GET /api/v1/{landing,projects,equipment}/`, published-content repositories, migration Neon/PostgreSQL và adapter ảnh R2. `POST /api/survey/` có DB intake, idempotency và shared rate limit nhưng mặc định tắt; chưa bật production. Auth/authorization/admin nghiệp vụ và HTTP upload chưa triển khai. `/admin/` hiện là **demo giao diện với dữ liệu mẫu**, dùng route Next.js và shared UI. Demo packaging bỏ API và admin server-only trong bản sao build, chỉ cho phép các trang CMS demo đã liệt kê trong `scripts/demo-admin-routes.mjs`.

## Cloudflare Workers (static demo)

- Public URL: <https://lxdb.captain-solution.tech/>. Worker: `lxdb-solar-worker`.
- Push lên `dev` kích hoạt GitHub Actions [Publish LXDB demo for Cloudflare Workers](.github/workflows/deploy-cloudflare-pages.yml). Actions checkout các submodule private, Node 22, `npm ci`, `npm run typecheck`, `npm run build:demo`, `npm run test:export` với `NEXT_PUBLIC_SITE_URL=https://lxdb.captain-solution.tech/` và `SEO_INDEXABLE=false`.
- Workflow xuất **chỉ file tĩnh** trong `out/` sang nhánh `cf-pages` (tên nhánh triển khai, **không phải GitHub Pages hosting**). Cloudflare **Workers Builds** theo dõi nhánh này và deploy lên `lxdb-solar-worker`.
- Worker build command sao chép file từ nhánh artifact sang `/tmp/lxdb-public-assets` bằng glob không gồm dotfiles; deploy command dùng `wrangler@4.148.0` với `--assets /tmp/lxdb-public-assets`, không upload `.git` và thư mục build tạm. Chi tiết ở [deployment runbook](docs/deployment-runbook.md).
- Job GitHub Actions hiện vẫn dùng Environment `github-pages` **chỉ để lấy secret đọc private submodule** (`COMPONENT_UI_READ_TOKEN` hoặc `SUBMODULE_READ_TOKEN`). Tên environment là di sản, không kích hoạt GitHub Pages. Có thể di chuyển token sang environment mới rồi cập nhật job sau.
- Cloudflare Pages `lxdb-solar-demo` không còn giữ custom domain; chỉ giữ `pages.dev` dự phòng. Không đưa backend/API lên static Worker; `main` không bị thay đổi.

CMS demo: <https://lxdb.captain-solution.tech/admin/>. Các route `/admin/projects/`, `/admin/equipment/`, `/admin/media/`, `/admin/leads/`, `/admin/editors/` và `/admin/login/` có HTML riêng, hỗ trợ mở trực tiếp/reload; form sửa bản ghi mẫu dùng `/admin/projects/1/edit/`. Logo dùng asset gốc của website. Xem [hướng dẫn CMS](docs/admin-cms-demo.md).

Worker demo chỉ phục vụ file tĩnh: CMS mô phỏng chỉnh sửa/lời mời/upload-preview trong bộ nhớ, **không có đăng nhập/authorization, CRUD bền vững, upload cloud hoặc API thật**. Dữ liệu và vai trò xem trước reset sau reload. Trang `/khao-sat/` mô phỏng gửi thử phía client, không gửi/lưu thông tin. Server intake chỉ bật sau khi có sandbox credentials, Turnstile và phê duyệt privacy/retention; không đưa secret vào frontend hay repository. `.env*` bị ignore trừ `.env.example`.

Form `/khao-sat/` dùng `SurveyForm` (import thành `SurveyFormShell`) và `useSurveySubmission` từ `@solar/ui/forms` với `mode: "demo"` tường minh ở cả hai build target. Package sở hữu mô phỏng chờ 700 ms với xác suất thành công/lỗi 50/50, trạng thái gửi, đồng bộ storage và countdown; wrapper luôn hiển thị thông báo demo, dùng Toast hệ thống mặc định không hứa đã nhận yêu cầu hoặc sẽ liên hệ. Mặc định 3 lần thành công trong cửa sổ 5 phút sẽ chặn thêm 5 phút; lỗi không tính vào giới hạn. Chỉ lưu mốc thời gian/cooldown qua key `solar:survey-rate-limit:v1` (localStorage mặc định), không lưu thông tin form; loại storage và giới hạn cấu hình được qua hook. Đây là giới hạn UX phía client, không thay thế rate limit bảo mật ở server. Solar giữ schema zod/RHF, nhãn và bố cục field, consent chưa tick sẵn, nội dung nút/cooldown; chỉ reset RHF sau kết quả `success`, giữ dữ liệu khi lỗi hoặc bị chặn. Muốn gửi thật phải chuyển sang `mode: "live"` và cung cấp async `onSubmit` xác nhận API thành công; chỉ có endpoint hoặc server build không tự nối form vào backend.

## SEO/AEO và cấu trúc xuất bản

Xem [review điểm nghẽn, cấu trúc thư mục/URL và bằng chứng kiểm chứng](docs/seo-aeo-review.md), cùng [nguồn chính thức Google/OpenAI/Anthropic](docs/search-evidence.md).

- `src/config/site.ts` nhận `NEXT_PUBLIC_SITE_URL` (URL HTTPS công khai, bao gồm prefix nếu có); mặc định giữ `https://bangnt188.github.io/solar_demo/`. Link Next và ảnh dùng cùng base path.
- `src/lib/seo.ts` quản lý metadata riêng cho trang chủ, danh mục, khảo sát và bảy trang giải pháp/dịch vụ; canonical, Open Graph/Twitter, schema và breadcrumb. `src/app/robots.ts`, `src/app/sitemap.ts` xuất file tĩnh khi build.
- Mặc định **noindex** cho demo/preview; sitemap không có URL. Workflow Workers cố định `SEO_INDEXABLE=false`. `robots.txt` tại root cho phép crawl để bot đọc noindex.
- Chỉ đặt `SEO_INDEXABLE=true` cùng URL chính thức sau khi xác minh nội dung và ảnh. Trang khảo sát vẫn noindex; sitemap xuất bản chỉ chứa trang chủ/dự án/thiết bị. Công tắc này không tự biến dữ liệu mẫu thành nội dung đã được duyệt.
- Không thêm `llms.txt`, FAQ rich-result schema hoặc thông tin giá/đánh giá/doanh nghiệp suy đoán. Hai ảnh minh họa đã chuyển sang WebP lossless; không đổi nội dung hình.
- Sau khi đổi biến môi trường phải build lại; chạy `npm run test:export` với cùng biến như lúc build. Kiểm tra bao gồm prefix/link/ảnh và tính nhất quán canonical/noindex/sitemap.


## Chuyển động giao diện

[Plan và nghiệm thu animation](docs/animation-plan.md): các mục `[data-motion]` trượt từ ngoài viewport vào trong khoảng 2 giây; hero đi từ hai mép màn hình và mục “Chúng tôi làm gì” từ dưới màn hình. Các hàng dịch vụ cũng đi từ ngoài mép theo scroll, đảo chiều được. Marquee đối tác tự chạy, tự dừng khi hover/chạm hoặc tab ẩn; không có nút điều khiển. Card giải pháp nâng 10px khi hover. Lenis chỉ nội suy wheel trên desktop không phải macOS (`wheelMultiplier: 0.8`, `lerp: 0.1`); trên macOS wheel giữ native momentum để tránh nội suy hai lần. Mobile/touch vẫn native. `prefers-reduced-motion` tắt chuyển động lớn. Nội dung vẫn đọc được khi tắt JavaScript.

Ảnh dưới fold dùng lazy loading mặc định của Next; hero tải sớm (`loading="eager"`, `fetchPriority="high"`). Mọi thay đổi motion cần kiểm tra desktop, 320–768px, keyboard/touch, reduced-motion và export HTML.

## Lộ trình production

Backend giai đoạn 1 đã được tích hợp riêng từ `mvp-dev`, không kéo UI cũ hoặc mock Sheets/MVP runner vào `dev`. `npm run build:demo` tạo `out/` không cần cloud secrets; `npm run build:server` tạo runtime Next.js, yêu cầu `NEXT_PUBLIC_SITE_URL` là HTTPS origin không có prefix. Giữ `SEO_INDEXABLE=false` cho preview. Trước khi đưa `main` lên production: cấu hình sandbox và kiểm chứng Neon/R2 theo [runbook](docs/neon-r2-setup.md), hoàn thành auth/authorization/admin/publish/upload và duyệt nội dung/quyền ảnh. Không tự publish seed DRAFT hoặc bật intake production.

Kiểm chứng backend local: `npm run typecheck`, `npm run test:core`, `npm run test:integration`. Integration runner dùng PostgreSQL tạm, kiểm migration rollback/journal, published projection, survey commit/idempotency/rate limits và HTTP Next thật; không dùng dữ liệu cloud. Migration operator: `npm run db:migrate`; seed sandbox: `npm run db:seed:sandbox`. Chi tiết contract và giới hạn bằng chứng trong [backend-core.md](docs/backend-core.md).

Quy ước CSS về selector, cascade, token và breakpoint: [docs/css-conventions.md](docs/css-conventions.md).

Thiết kế bộ UI React dùng chung, theme, component/form contracts và migration: [docs/ui-system-architecture.md](docs/ui-system-architecture.md).
