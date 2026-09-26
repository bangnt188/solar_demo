# Lúa Xanh Đồng Bằng — Next.js demo

Nhánh `dev` là bản demo frontend Next.js static, xuất sang GitHub Pages tại <https://bangnt188.github.io/solar_demo/>. Nhánh `main` dành cho production Vercel sau khi hoàn thiện backend; **không merge bản demo này vào production như một CMS đang hoạt động**.

## Chạy local

Yêu cầu Node.js 22 và npm.

```sh
npm ci
npm run dev
# http://localhost:3000/solar_demo/
```

Kiểm tra bản export: `npm run build && npm run test:export`. Next.js tạo `out/` với các trang `/`, `/du-an/`, `/thiet-bi/`, `/khao-sat/` dưới base path `/solar_demo`. `src/app/(public)/layout.tsx` gắn motion runtime cho các route công khai; header/footer ở `src/components/organisms/`, các section ở `src/components/sections/`, card dùng chung ở `src/components/ui/`. Màu và motion token dùng CSS trong `src/styles/`. UI đọc dữ liệu qua `src/services/catalog.ts` → `src/repositories/catalog.ts` → `src/data/mock/catalog.ts`; dự án là công trình thực tế theo xác nhận, còn ảnh trong `public/images/demo/` chỉ mang tính minh họa (cần xác nhận quyền sử dụng trước production). Thông tin sản phẩm, đối tác và liên hệ từ ảnh mẫu cần xác minh với khách hàng.

Các thư mục còn lại theo SA (`src/app/admin`, `src/app/api`, `src/components/admin`, phần lớn `src/features/*`, `src/infrastructure/*`, `database/*`, `public/icons`, `public/documents`, `docs`, `scripts`…) chỉ có `.gitkeep` để Git lưu cấu trúc. Chúng **chưa có chức năng**; không có route admin/API trên Pages.

## GitHub Pages

1. Tạo/push nhánh `dev` lên `bangnt188/solar_demo`.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Repo admin vào **Settings → Environments → github-pages → Deployment branches/tags** thêm `dev` (giữ `main`); nếu không, workflow bị chặn trước khi build.
3. Push vào `dev` hoặc chạy workflow **Deploy demo to GitHub Pages**. Workflow cài dependency từ lockfile, export static, tải `out/` lên Pages và thêm `.nojekyll` để phục vụ `_next/`.
4. Kiểm tra <https://bangnt188.github.io/solar_demo/> và các đường dẫn `/du-an/`, `/thiet-bi/`, `/khao-sat/`.

Pages chỉ phục vụ file tĩnh: **không có admin login/CRUD, upload, API, lưu survey hay phân quyền** ở bản demo. Trang `/khao-sat/` tạo bản nháp email từ thông tin người dùng điền; người dùng phải tự xác nhận gửi trong ứng dụng email. Website không tự gửi hoặc lưu dữ liệu khảo sát. Không đưa secret vào frontend hay repository; `.env*` bị ignore trừ `.env.example`.

## SEO/AEO và cấu trúc xuất bản

Xem [review điểm nghẽn, cấu trúc thư mục/URL và bằng chứng kiểm chứng](docs/seo-aeo-review.md), cùng [nguồn chính thức Google/OpenAI/Anthropic](docs/search-evidence.md).

- `src/config/site.ts` nhận `NEXT_PUBLIC_SITE_URL` (URL HTTPS công khai, bao gồm prefix nếu có); mặc định giữ `https://bangnt188.github.io/solar_demo/`. Link Next và ảnh dùng cùng base path.
- `src/lib/seo.ts` quản lý metadata riêng cho 4 trang, canonical, Open Graph/Twitter, schema và breadcrumb. `src/app/robots.ts`, `src/app/sitemap.ts` xuất file tĩnh khi build.
- Mặc định **noindex** cho demo/preview; sitemap không có URL. Workflow Pages cố định `SEO_INDEXABLE=false`. `robots.txt` cho phép crawl để bot đọc noindex; file robots trong `/solar_demo/` không thay thế robots ở root host.
- Chỉ đặt `SEO_INDEXABLE=true` cùng URL chính thức sau khi xác minh nội dung và ảnh. Trang khảo sát vẫn noindex; sitemap xuất bản chỉ chứa trang chủ/dự án/thiết bị. Công tắc này không tự biến dữ liệu mẫu thành nội dung đã được duyệt.
- Không thêm `llms.txt`, FAQ rich-result schema hoặc thông tin giá/đánh giá/doanh nghiệp suy đoán. Hai ảnh minh họa đã chuyển sang WebP lossless; không đổi nội dung hình.
- Sau khi đổi biến môi trường phải build lại; chạy `npm run test:export` với cùng biến như lúc build. Kiểm tra bao gồm prefix/link/ảnh và tính nhất quán canonical/noindex/sitemap.


## Chuyển động giao diện

[Plan và nghiệm thu animation](docs/animation-plan.md): các mục `[data-motion]` trượt từ ngoài viewport vào trong khoảng 2 giây; hero đi từ hai mép màn hình và mục “Chúng tôi làm gì” từ dưới màn hình. Các hàng dịch vụ cũng đi từ ngoài mép theo scroll, đảo chiều được. Marquee đối tác tự chạy, tự dừng khi hover/chạm hoặc tab ẩn; không có nút điều khiển. Card giải pháp nâng 10px khi hover. Lenis chỉ nội suy wheel trên desktop không phải macOS (`wheelMultiplier: 0.8`, `lerp: 0.1`); trên macOS wheel giữ native momentum để tránh nội suy hai lần. Mobile/touch vẫn native. `prefers-reduced-motion` tắt chuyển động lớn. Nội dung vẫn đọc được khi tắt JavaScript.

Ảnh dưới fold dùng lazy loading mặc định của Next; hero tải sớm (`loading="eager"`, `fetchPriority="high"`). Mọi thay đổi motion cần kiểm tra desktop, 320–768px, keyboard/touch, reduced-motion và export HTML.

## Lộ trình production

Trước khi đưa `main` lên Vercel: cấu hình `NEXT_PUBLIC_SITE_URL` theo URL chính thức (domain gốc tự bỏ prefix Pages), giữ `SEO_INDEXABLE=false` cho preview. Static export vẫn phù hợp nếu chỉ phục vụ nội dung; chỉ bỏ `output: "export"` khi triển khai chức năng server. Giữ quy ước URL có dấu `/` cuối hoặc chuẩn bị redirect nhất quán trước khi đổi; không tự xóa `trailingSlash` làm lệch canonical. Triển khai server-side authentication/authorization, Neon, R2 upload có kiểm tra quyền/kích thước/MIME/quota, survey lưu Neon trước rồi đồng bộ Google Sheets. Quản lý secret trên Vercel theo `.env.example`; không bật tính năng server trên Pages. Domain cutover chỉ sau khi preview Vercel được duyệt; giữ WordPress cũ để rollback, lập redirect từ URL cũ theo dữ liệu thật và không đổi DNS email.
