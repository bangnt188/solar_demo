---
status: proposed
date: 2026-09-27
---

# ADR-0002 — Cấu hình landing theo mẫu cố định và bản xuất bản

**Hiểu:** landing có 10 section và chrome dùng dữ liệu local, trong khi schema MVP trước chỉ đề cập catalog/auth/survey/media. Yêu cầu mới là quản trị nội dung và hiển thị landing; không có yêu cầu page builder hay quản trị mọi trang detail.

**Thiết kế:** lưu JSONB có schema cho nội dung nhỏ theo mẫu; ảnh và featured catalog dùng FK thật. Một revision bao gồm chrome/SEO/sections/order/selections; publish seal revision và đổi pointer trong transaction. Bản SEALED bất biến; chỉnh sửa qua clone draft. Catalog và media vẫn có trạng thái sống: hide/delete/thu hồi ảnh được áp dụng lúc đọc, không bị rollback landing làm sống lại.

**Trade-off:** tránh hàng chục bảng cho các dòng chữ nhưng bắt buộc validator JSON Schema + semantic rules tại service. Revision nhân bản nội dung nhỏ để có publish nguyên tử/rollback; không nhân bản binary/catalog. Chưa có CMS tổng quát, custom sections, arbitrary HTML hoặc history dashboard. Dữ liệu `DRAFT` không private hóa được ảnh đã ở public R2 bucket.

**Validate security:** server kiểm ROOT/ADMIN, origin/CSRF; public chỉ đọc published pointer; media FK, content immutability, lock/version chống race; SQL function không thay authorization/JSON validation. Credential runtime không DDL/trigger disable. Preview có auth/no-store; không cung cấp query ID mở draft anonymous.

**Đề xuất/migration:** apply [canonical DDL](../../database/schema/001_landing.sql) qua migration runner lên DB trống; dùng [seed draft](../../database/seeds/001_landing_demo.sql) chỉ sandbox. Nếu đã có catalog/media, introspect rồi ALTER/backfill, không tạo bảng cạnh tranh. Giữ DTO mapping với các consumer hiện tại và thay cách resolve ảnh đồng thời. Thêm form editor cố định và tests trước publish thật; cộng scope/effort vào MVP.

Chi tiết ERD, field mapping, test evidence và giới hạn nằm trong [thiết kế DB landing](../landing-database-design.md). Trạng thái đề xuất áp dụng; SQL đã kiểm tra local, chưa migrate Neon hoặc tích hợp frontend.
