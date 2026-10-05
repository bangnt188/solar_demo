# Bàn vận hành — demo UI CMS

User chọn Bàn vận hành, ưu tiên layout demo trước/backend sau.
Artifact hiện tại: `src/app/(cms)/admin` và `src/features/admin`.
Kiến trúc và contracts nghiệp vụ: [CMS design](admin-cms-design.md).

## Xem demo

Next dev: http://localhost:3000/solar_demo/admin/.
URL Pages đích: https://bangnt188.github.io/solar_demo/admin/.
Server target có base path rỗng: `/admin/`. URL đích không tự chứng minh
deployment đã hoàn tất; trạng thái publish theo kết quả CI/deploy.

Các route thật: `/admin/`, `projects/`, `equipment/`, `media/`, `leads/`,
`editors/`, `login/`, `forgot-password/`, `reset-password/` dưới `/admin`.
Catalog có `new/` và `:id/edit/`. Seed được export qua generateStaticParams
(dự án 1–4, thiết bị 1–3); bản ghi mới trong phiên dùng route generic như
`/admin/projects/edit/?id=5` hoặc `/admin/equipment/edit/?id=4`. Reload không
khôi phục record vừa tạo. `/cms-demo/index.html` chỉ redirect tương thích
sang `../admin/`; app.js/styles.css cũ đã bỏ. Static/hash prototype và cách
chạy Python standalone chỉ là lịch sử.

Root layout giữ phần nền tảng chung; `(public)/layout.tsx` compose public
header/footer, announcement, ConversionDock và motion; `(cms)/admin/layout.tsx`
dùng admin shell riêng. Route group không thêm URL segment. Pages chỉ xuất
UI template/path trong allowlist `scripts/demo-admin-routes.mjs`; từ chối
API/admin route ngoài allowlist. Không export auth handler hoặc private data.

## Phạm vi

- Tổng quan: thống kê mẫu theo kỳ, queue/detail, chart phản hồi và hoạt động mẫu.
- Dự án/Thiết bị: bảng, search/filter, form thêm/sửa, chọn ảnh và trạng thái.
- Media: grid, bộ lọc thư mục, search, copy URL, xem trước file local trong bộ nhớ.
- Lead: kỳ và trạng thái, tìm tên/khu vực, xem chi tiết, cập nhật trạng thái/ghi chú mẫu, export CSV theo bộ lọc.
- Editor: danh sách, form lời mời mẫu, trạng thái khóa/mở khóa.
- Login/forgot-password/reset-password: layout và phản hồi mẫu, không xác thực/gửi email/kiểm reset token.
- ADMIN/EDITOR switch là công cụ xem layout theo vai trò; không là security boundary.

Provider context giữ dữ liệu qua client navigation giữa các route admin;
tất cả dữ liệu mới/chỉnh sửa mất sau reload. Không gọi admin API, không ghi DB,
không dùng localStorage, không upload file lên cloud. Email example.test và
liên hệ được gắn nhãn mẫu; không đưa Lead thật vào artifact public. Toàn bộ
seed được ship công khai kể cả record ẩn bởi preview EDITOR. noindex không
là access control.

Excel, quản lý danh mục và tác vụ production chỉ thể hiện vị trí affordance,
chưa triển khai nghiệp vụ đầy đủ. Công cụ upload chỉ kiểm loại MIME khai báo
JPEG/PNG/WebP và giới hạn 3 MiB để xem layout, không chứng nhận validate
binary/media security. Ảnh upload có URL `blob:` trong phiên; URL này không
là tài nguyên public bền vững và không dùng làm ảnh bìa catalog. Clipboard
cần quyền trình duyệt; khi bị từ chối demo thông báo thử trên localhost.

Kỳ thống kê neo vào dữ liệu mẫu ngày 05/10/2026, không dùng thời gian live.
Count catalog là tổng hiện tại; kỳ áp dụng phản hồi khảo sát. Chart 30 ngày
chỉ vẽ các ngày có phản hồi mẫu. Bảng chỉ có trang 1/1, chưa có pagination
server. Form catalog có kiểm trường bắt buộc native và cảnh báo rời form;
không có validator publish, version conflict, lịch sử audit hoặc workflow
duyệt. CSV mẫu chứa tên/khu vực/ngày/trạng thái, có BOM và xử lý ký tự đầu
formula; Excel chỉ trả feedback về bước backend. Không có đặt mật khẩu
bằng reset token, loading/error network hoặc session thật (route reset chỉ
kiểm input mẫu). Object URL được thu hồi khi provider unmount.

## Design và integration path

Operate; inherit DESIGN.md, xanh/neutral/control bo nhỏ. Button/Input/Select/
Textarea dùng @solar/ui; admin shell/table/queue/detail/badge là composition
và adapters với CSS Module scoped. Không dùng demo này làm auth layer hoặc
nhân đôi defaults vào shared package. Logo gốc là public/images/common/logo.png.

Các cỡ chữ 10/11/12px cho nhãn dữ liệu, 25/28px cho admin title là local
prototype choices; detector báo advisory ngoài ramp của DESIGN.md.
Không sửa canonical DESIGN.md hoặc defaults package vì demo.

Body admin dùng mật độ riêng của surface; màu nhãn cam
`#9a5800` và success `#16723d` là lựa chọn tại surface để tăng độ đọc.
Đây là ordinary extension của identity hiện có, chưa là token chuẩn mới.
Font-family kế thừa hệ thống app; không suy ra font đã render chỉ từ
declaration. [DESIGN.md](../DESIGN.md)
và [.impeccable/design.json](../.impeccable/design.json) giữ nguyên authority.
DESIGN.md đã ghi một quan sát overflow 390px cũ của trang marketing;
demo này không kiểm tra lại hoặc sửa drift/giới hạn có trước của website.

Seam production là `useAdminDemo`/provider và screen handlers: thay seed/
context mutations bằng DTO/service adapter có auth/scope và server commit;
giữ shell/control composition, label, feedback, focus và mobile list/detail.
Bổ sung loading/error/conflict/session. API/auth chỉ thuộc server target,
không xuất Pages. Theo [CMS design](admin-cms-design.md), kiểm lại policy
trực tiếp qua API và consumer CSS/browser sau khi nối backend.

Ảnh shipping được tham chiếu từ public/images/demo có sẵn: proj-1/2/3/4.png,
equip-panel/inverter/battery.png và solar-roof.webp. Không tạo hoặc thay ảnh
nguồn; tên/nội dung bản ghi là minh họa, không xác nhận thông số công trình thật.
Chi tiết nguồn và giới hạn quyền sử dụng: [raster provenance](design-evidence/admin-routes/provenance.md).

## Verification

Bằng chứng hiện tại ở [design-evidence/admin-routes](design-evidence/admin-routes),
gồm capture 1440×1000/390×844 và [browser.json](design-evidence/admin-routes/browser.json).
24 route check đều HTTP 200, không document overflow, logo tải được và
admin không có public header. Flow xác nhận dữ liệu giữ qua navigation,
reload reset seed, EDITOR ẩn Lead menu, legacy redirect/public chrome và
mobile detail focus. Evidence static cũ trong cms-demo chỉ là lịch sử,
không dùng PASS đó làm nghiệm thu React routes.

Vòng đầu ghi public CTA background 404 vì thiếu basePath, và nhầm YouTube
telemetry `/api/stats` từ website public vào apiRequests. CTA prefix đã
sửa; harness sau tách admin requests khỏi public/third-party. Các entry
cũ không là admin API call. Chỉ report mới nhất xác nhận kết quả cuối.

Bản build từ đúng source đã stage qua typecheck và 7/7 export-boundary
tests. Reviewer xác nhận PASS cho batch sửa focus ban đầu, label wrapping
và CSS trùng; disposition: ship. Browser report cuối không có errors,
failedResponses, publicFindings hoặc first-party apiRequests. Các kiểm tra
trên không là chứng nhận production/security/a11y trên mọi browser,
viewport hoặc font. Chi tiết: design-evidence/admin-routes/review.md.
