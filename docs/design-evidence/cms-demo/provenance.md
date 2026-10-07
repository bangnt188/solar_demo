# CMS demo — raster provenance

Phạm vi: ảnh tham chiếu được prototype `public/cms-demo/app.js` dùng trực
tiếp qua đường dẫn tương đối `../images/demo/`. Không có raster shipping
mới, chỉnh sửa ảnh nguồn hoặc tải stock image trong tác vụ này.

| Asset có sẵn trong repository | Nơi sử dụng trong demo |
| --- | --- |
| `public/images/demo/proj-1.png` | Dự án, picker ảnh bìa, Media |
| `public/images/demo/proj-2.png` | Dự án, picker ảnh bìa, Media |
| `public/images/demo/proj-3.png` | Dự án, picker ảnh bìa |
| `public/images/demo/proj-4.png` | Dự án, picker ảnh bìa |
| `public/images/demo/equip-panel.png` | Thiết bị, picker ảnh bìa, Media |
| `public/images/demo/equip-inverter.png` | Thiết bị, picker ảnh bìa, Media |
| `public/images/demo/equip-battery.png` | Thiết bị, picker ảnh bìa, Media |
| `public/images/demo/solar-roof.webp` | Media |

Nguồn xác nhận trong tác vụ là **asset repository có sẵn**. Không có chứng
từ gốc/license được xác minh thêm; không gán tác giả, nguồn stock, quyền
thương mại hoặc quyền chụp công trình khi chưa có bằng chứng. Nội dung
record, địa danh và thông số đi kèm ảnh là synthetic, không xác nhận ảnh
thuộc công trình được đặt tên trong demo.

Ảnh người dùng chọn bằng file chooser chỉ được xem trước qua `blob:` trong
bộ nhớ trình duyệt; không là ảnh shipping hoặc upload server. Screenshot
trong thư mục evidence là capture QA của prototype, không thêm nguồn ảnh
marketing mới. Scope verification và reviewer disposition ở
[admin-cms-demo.md](../../admin-cms-demo.md).
