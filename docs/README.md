# Tài liệu Solar Website

## MVP sau landing page

Bắt đầu với [Core kết nối đã triển khai](backend-core.md): router/lib/core, landing đọc DB, biến môi trường, migration, smoke và bằng chứng kiểm thử.

Tài liệu thiết kế và kế hoạch còn lại:

1. [Kế hoạch triển khai MVP](mvp-implementation-plan.md): hiện trạng source, thiết kế các module, security gates, lịch D0–D7, kiểm thử và rollback.
2. [Hướng dẫn Neon và Cloudflare R2](neon-r2-setup.md): tạo sandbox/production, database roles, bucket/token/domain, env Vercel và nghiệm thu kết nối.
3. [ADR-0001](adr/0001-serverless-mvp.md): lý do chọn kiến trúc, trade-off, threat model và migration path.
4. [Thiết kế DB cấu hình landing](landing-database-design.md): ERD, 11 bảng, SQL có sẵn, seed từ giao diện, JSON Schema và draft/publish; xem [ADR-0002](adr/0002-landing-content-revisions.md).

Trạng thái 27/09/2026: SQL, migration runner, PostgreSQL/R2 adapters, public API và frontend đọc DB đã triển khai, kiểm thử local. Chưa xác minh kết nối tài khoản Neon/R2 hoặc triển khai auth/admin/survey. Các quyết định còn cần chốt nằm ở mục D0 của kế hoạch.

## Design system và bằng chứng

- [DESIGN.md](../DESIGN.md): visual canonical của website Solar.
- [UI composition](ui-composition.md): ownership, Atomic Design và contracts composition.
- [UI system architecture](ui-system-architecture.md): public package/theme/state contracts.
- [CSS conventions](css-conventions.md): quy tắc style/cascade.
- [Đối chiếu v1–v2](design-v1-v2-comparison.md): hai bảng và quyết định migration.
- [Browser evidence](design-browser-evidence.md): kiểm chứng local, giới hạn và vấn đề còn mở.
- [V1 lịch sử](../design-v1.md) / [v2 snapshot](../design-v2.md): đầu vào đối chiếu, không phải visual authority.

## Tài liệu landing page hiện có

- [Animation plan](animation-plan.md)
- [SEO/AEO review](seo-aeo-review.md)
- [Search evidence](search-evidence.md)
