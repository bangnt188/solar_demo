# Admin routes — raster provenance

Logo shell/login dùng `public/images/common/logo.png` có sẵn. Catalog,
picker và Media dùng `public/images/demo/proj-1.png` đến `proj-4.png`,
`equip-panel.png`, `equip-inverter.png`, `equip-battery.png`, `solar-roof.webp`.
Code resolve đường dẫn bằng basePath/imagePath.

Không tạo/sửa raster shipping trong tác vụ admin routes. Nguồn xác nhận
là asset repository hiện có; chưa xác minh thêm tác giả/license gốc,
không gán nguồn stock hoặc quyền thương mại. Tên/thông số công trình trong
seed là synthetic, không xác nhận ảnh thuộc công trình được đặt tên.

File chooser chỉ preview ảnh local qua blob trong bộ nhớ. Screenshot QA
là capture route demo, không là nguồn ảnh marketing mới. Evidence static
cũ trong ../cms-demo chỉ là lịch sử.
