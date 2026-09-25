# Lúa Xanh Đồng Bằng — Next.js demo

Nhánh `dev` là bản demo frontend Next.js static, xuất sang GitHub Pages tại <https://bangnt188.github.io/solar_demo/>. Nhánh `main` dành cho production Vercel sau khi hoàn thiện backend; **không merge bản demo này vào production như một CMS đang hoạt động**.

## Chạy local

Yêu cầu Node.js 22 và npm.

```sh
npm ci
npm run dev
# http://localhost:3000/solar_demo/
```

Kiểm tra bản export: `npm run build && npm run test:export`. Next.js tạo `out/` với các trang `/`, `/du-an/`, `/thiet-bi/` dưới base path `/solar_demo`. `src/app/` chỉ ghép route/layout; header/footer ở `src/components/site-chrome.tsx`, các section ở `src/components/home-sections.tsx`, card dùng chung trang chủ và trang danh sách ở `src/components/catalog-cards.tsx`. Màu dùng token CSS trong `src/app/globals.css`. Dữ liệu ví dụ nằm ở `src/data/mock/catalog.ts`, ảnh demo trong `public/images/demo/` (được lưu từ giao diện demo ban đầu; cần xác nhận quyền sử dụng trước khi public production). Tên dự án, công suất, đối tác và thông tin liên hệ từ ảnh mẫu cần xác minh với khách hàng trước khi công bố là dữ liệu thực tế.

## GitHub Pages

1. Tạo/push nhánh `dev` lên `bangnt188/solar_demo`.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions** (cần quyền quản trị repo).
3. Push vào `dev` hoặc chạy workflow **Deploy demo to GitHub Pages**. Workflow cài dependency từ lockfile, export static, tải `out/` lên Pages và thêm `.nojekyll` để phục vụ `_next/`.
4. Kiểm tra <https://bangnt188.github.io/solar_demo/> và hai đường dẫn `/du-an/`, `/thiet-bi/`.

Pages chỉ phục vụ file tĩnh: **không có admin login/CRUD, upload, API, lưu survey hay phân quyền** ở bản demo; không thu thập dữ liệu khách hàng. Nút đặt lịch mở ứng dụng email thay vì giả lập gửi khảo sát. Không đưa secret vào frontend hay repository; `.env*` bị ignore trừ `.env.example`.

## Lộ trình production

Trước khi đưa `main` lên Vercel: bỏ `output: "export"`, `basePath`, `assetPrefix`, `trailingSlash` cho Pages trong `next.config.ts`; bỏ prefix ở `src/config/site.ts`. Triển khai server-side authentication/authorization, Neon, R2 upload có kiểm tra quyền/kích thước/MIME/quota, survey lưu Neon trước rồi đồng bộ Google Sheets. Quản lý secret trên Vercel theo `.env.example`; không bật tính năng server trên Pages. Domain cutover chỉ sau khi preview Vercel được duyệt; giữ WordPress cũ để rollback và không đổi DNS email.
