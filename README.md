# Lúa Xanh Đồng Bằng — Next.js demo

**Nhánh `mvp-dev`: MVP mới là dự định, khách hàng chưa chốt. Mặc định chỉ mock Neon/R2/Google Sheets.** Xem [quyết định và cách chạy mock](docs/mvp-mock.md); dùng `npm run dev:mvp` hoặc `npm run demo:integrations`, không cần credentials.

Đã có [core kết nối Neon/R2 và router public](docs/backend-core.md), cùng [schema cấu hình landing](docs/landing-database-design.md). `npm run build` vẫn xuất demo Pages; `npm run build:server` tạo Next runtime đọc DB. Auth/admin CRUD/upload API/survey sync chưa triển khai, nên đây chưa phải CMS hoàn chỉnh.

Nhánh `dev` là bản demo frontend Next.js static, xuất sang GitHub Pages tại <https://bangnt188.github.io/solar_demo/>. Nhánh `main` dành cho production Vercel sau khi hoàn thiện backend; **không merge bản demo này vào production như một CMS đang hoạt động**.

## Chạy local

Yêu cầu Node.js 22 và npm.

```sh
npm ci
npm run dev
# http://localhost:3000/solar_demo/
```

Kiểm tra bản export: `npm run build && npm run test:export`. Next.js tạo `out/` với các trang `/`, `/du-an/`, `/thiet-bi/`, `/khao-sat/`, ba trang giải pháp `/giai-phap/ho-gia-dinh/`, `/giai-phap/ho-kinh-doanh/`, `/giai-phap/doanh-nghiep/`, trang tổng quan dịch vụ `/dich-vu/` và ba trang chi tiết `/dich-vu/epc-tron-goi/`, `/dich-vu/cung-ung-thiet-bi/`, `/dich-vu/mo-hinh-tai-chinh/` dưới base path `/solar_demo`.

Giải pháp và dịch vụ là nội dung giới thiệu sơ bộ, chưa được đưa vào chỉ mục tìm kiếm. `src/app/(public)/layout.tsx` gắn motion runtime cho các route công khai; header/footer ở `src/components/organisms/`, các section ở `src/components/sections/`, trang chi tiết dùng `src/components/screens/detail-page-screen.tsx`. Màu và motion token dùng CSS trong `src/styles/`. UI đọc dữ liệu qua `src/services/public-content.ts` → `PublicContentRepository` → mock hoặc PostgreSQL theo target; dự án là công trình thực tế theo xác nhận, còn ảnh trong `public/images/demo/` chỉ mang tính minh họa (cần xác nhận quyền sử dụng trước production). Thông tin sản phẩm, đối tác và liên hệ từ ảnh mẫu cần xác minh với khách hàng.

Menu điều hướng ở `src/components/organisms/site-navigation.tsx`: desktop chỉ hiển thị một dropdown khi chuyển giữa Giải pháp/Dịch vụ (ưu tiên mục đang focus bằng bàn phím); mobile dùng `<details>` cho từng nhóm.

Các module server đã có: `src/core`, `src/infrastructure/database`, `src/infrastructure/storage`, `src/features/landing`, hai content repositories và `/api/v1/[resource]`. Bản Pages vẫn không có route API/admin; build demo tạo bản sao tạm chỉ có public routes. `src/app/admin`, auth và survey backend vẫn chưa có chức năng. Xem [hướng dẫn core](docs/backend-core.md) để chạy server và kiểm thử.

## GitHub Pages

1. Tạo/push nhánh `dev` lên `bangnt188/solar_demo`.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Repo admin vào **Settings → Environments → github-pages → Deployment branches/tags** thêm `dev` (giữ `main`); nếu không, workflow bị chặn trước khi build.
3. Push vào `dev` hoặc chạy workflow **Deploy demo to GitHub Pages**. Workflow cài dependency từ lockfile, export static, tải `out/` lên Pages và thêm `.nojekyll` để phục vụ `_next/`.
4. Kiểm tra <https://bangnt188.github.io/solar_demo/> cùng các đường dẫn `/du-an/`, `/thiet-bi/`, `/khao-sat/`, ba trang `/giai-phap/`, trang tổng quan `/dich-vu/` và ba trang chi tiết dịch vụ.

Pages chỉ phục vụ file tĩnh: **không có admin login/CRUD, upload, API, lưu survey hay phân quyền** ở bản demo. Trang `/khao-sat/` tạo bản nháp email từ thông tin người dùng điền; người dùng phải tự xác nhận gửi trong ứng dụng email. Website không tự gửi hoặc lưu dữ liệu khảo sát. Không đưa secret vào frontend hay repository; `.env*` bị ignore trừ `.env.example`.

## SEO/AEO và cấu trúc xuất bản

Xem [review điểm nghẽn, cấu trúc thư mục/URL và bằng chứng kiểm chứng](docs/seo-aeo-review.md), cùng [nguồn chính thức Google/OpenAI/Anthropic](docs/search-evidence.md).

- `src/config/site.ts` nhận `NEXT_PUBLIC_SITE_URL` (URL HTTPS công khai, bao gồm prefix nếu có); mặc định giữ `https://bangnt188.github.io/solar_demo/`. Link Next và ảnh dùng cùng base path.
- `src/lib/seo.ts` quản lý metadata riêng cho các route công khai đã triển khai, canonical, Open Graph/Twitter, schema và breadcrumb. `src/app/robots.ts` xuất robots; sitemap static ở demo, đọc cấu hình SEO đã published tại request-time ở server.
- Mặc định **noindex** cho demo/preview; sitemap không có URL. Workflow Pages cố định `SEO_INDEXABLE=false`. `robots.txt` cho phép crawl để bot đọc noindex; file robots trong `/solar_demo/` không thay thế robots ở root host.
- Chỉ đặt `SEO_INDEXABLE=true` cùng URL chính thức sau khi xác minh nội dung và ảnh. Trang khảo sát vẫn noindex; sitemap xuất bản chỉ chứa trang chủ/dự án/thiết bị. Công tắc này không tự biến dữ liệu mẫu thành nội dung đã được duyệt.
- Không thêm `llms.txt`, FAQ rich-result schema hoặc thông tin giá/đánh giá/doanh nghiệp suy đoán. Hai ảnh minh họa đã chuyển sang WebP lossless; không đổi nội dung hình.
- Sau khi đổi biến môi trường phải build lại; chạy `npm run test:export` với cùng biến như lúc build. Kiểm tra bao gồm prefix/link/ảnh và tính nhất quán canonical/noindex/sitemap.


## Chuyển động giao diện

[Plan và nghiệm thu animation](docs/animation-plan.md): hero vào từ hai phía trong 760ms; các section khác reveal 520ms. “Chúng tôi làm gì” dùng CSS view timeline: ảnh/chữ bắt đầu ngoài màn hình ngang khoảng một viewport cộng chiều rộng phần tử, đi qua bốn nấc keyframe khi vào và ra, vào giữa ở 25%, giữ đến 80% rồi trượt ra khỏi màn hình ở 100%. Cuộn ngược thì chuyển động đảo chiều; tốc độ phụ thuộc thao tác cuộn, không cam kết thời lượng cố định. Không có JS đo layout mỗi frame; trình duyệt thiếu hỗ trợ dùng WAAPI reveal dự phòng. `prefers-reduced-motion` giữ nội dung tĩnh.

Ảnh dưới fold dùng lazy loading mặc định của Next; hero tải sớm (`loading="eager"`, `fetchPriority="high"`). Mọi thay đổi motion cần kiểm tra desktop, 320–768px, keyboard/touch, reduced-motion và export HTML.

## Lộ trình production

Trước khi đưa `main` lên Vercel: cấu hình `NEXT_PUBLIC_SITE_URL` theo URL chính thức (domain gốc tự bỏ prefix Pages), giữ `SEO_INDEXABLE=false` cho preview. Chọn `DEPLOY_TARGET=server` và `npm run build:server` cho runtime; `npm run build:demo` giữ static export cho Pages. Giữ quy ước URL có dấu `/` cuối hoặc chuẩn bị redirect nhất quán trước khi đổi; không tự xóa `trailingSlash` làm lệch canonical. Triển khai server-side authentication/authorization, Neon, R2 upload có kiểm tra quyền/kích thước/MIME/quota, survey lưu Neon trước rồi đồng bộ Google Sheets. Quản lý secret trên Vercel theo `.env.example`; không bật tính năng server trên Pages. Domain cutover chỉ sau khi preview Vercel được duyệt; giữ WordPress cũ để rollback, lập redirect từ URL cũ theo dữ liệu thật và không đổi DNS email.
