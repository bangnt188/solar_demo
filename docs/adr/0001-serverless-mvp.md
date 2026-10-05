---
status: proposed
date: 2026-09-27
---

# ADR-0001 — Backend MVP serverless với Neon và Cloudflare R2

Landing page hiện tại là Next.js static export trên GitHub Pages. Backend MVP cần dữ liệu bền vững, admin và survey, trong khi `dev` phải tiếp tục chạy Pages. Đề xuất giữ một Next.js application, hai build target, runtime production trên Vercel, dữ liệu PostgreSQL ở Neon và ảnh marketing ở R2. Kế hoạch và trạng thái thực hiện nằm trong [MVP plan](../mvp-implementation-plan.md); thao tác tài khoản nằm trong [runbook](../neon-r2-setup.md).

## Hiểu

Không có backend đang chạy để di chuyển. Cần chuyển mock catalog và mailto sang các luồng thật, giữ các consumer landing page. Không yêu cầu VPS hay process thường trú. Serverless vẫn phụ thuộc quota, region, chi phí và khả năng phục hồi của provider; không đồng nghĩa scale vô hạn.

## Thiết kế và lý do chọn

1. **Neon/PostgreSQL + pooled runtime, direct migration.** Giữ SQL/transaction/FK và đường di chuyển bằng công cụ Postgres chuẩn. Role ứng dụng không DDL; worker state lưu DB để sống qua restart. Không dùng Google Sheet làm database hoặc filesystem Vercel làm state.
2. **R2 qua API có giới hạn 3 MiB/ảnh.** Đúng flow baseline, validate binary trước khi publish, đủ ảnh website MVP. R2 giữ immutable key, Neon giữ metadata/reference. Dùng custom domain cho ảnh public, tắt `r2.dev` production.
3. **Hai build target cùng source.** Demo build từ source copy tạm chỉ có public routes/mock; server build từ source đầy đủ. Chỉ thay config không loại route động khỏi Pages nên không đủ. Không duy trì hai app hay hai implementation nghiệp vụ.
4. **Google Sheets là projection có retry.** Submission được commit trước; scheduler claim DB row có lease, ghi deterministic row trên tab tích hợp để retry không append trùng.
5. **Managed identity + DB sessions.** Đề xuất Better Auth/Google OIDC allowlist cho đội nội bộ; quyền thuộc DB ứng dụng, kiểm tra actor/target tại service. Auth provider cần xác nhận tại D0; không tự dựng password protocol.

## Trade-off và phương án đã cân nhắc

| Chọn | Chi phí/chấp nhận | Phương án khác và điều kiện chuyển |
| --- | --- | --- |
| Vercel + Neon + R2 | Nhiều provider, cần env inventory/region gần nhau/monitoring | VPS tăng vận hành; chưa có yêu cầu cần process riêng |
| Public bucket chỉ ảnh marketing | Ảnh draft/hidden có thể truy cập bằng URL; hide không thu hồi cache | Private bucket + gated delivery nếu có yêu cầu bảo mật nội dung |
| Proxy upload 3 MiB | Tốn function bandwidth/CPU; giới hạn ảnh admin | Presigned private quarantine khi có nhu cầu file lớn hoặc tải upload cao |
| Demo packaging script | Cần CI kiểm tra route/artifact và chống lệch build | Bỏ Pages chỉ khi chủ dự án đổi yêu cầu; không âm thầm thay bằng Vercel |
| Plain text content | Không WYSIWYG/HTML tự do | Rich text cần schema/sanitization và scope riêng |
| DB-backed sync | Có lease/retry fields và maintenance | Queue managed khi backlog/load đo được vượt khả năng batch DB |
| Google OIDC | Phụ thuộc identity provider, không quản lý password local | Password login cần thêm reset email/MFA/recovery và thời gian triển khai |

## Validate security — threat model ngắn

Assets: ROOT/session, survey PII, DB/R2 credentials, nội dung xuất bản. Actors: anonymous/spam bot, USER, ADMIN bị chiếm quyền, operator cloud. Trust boundaries: browser → API; API → Neon/R2; scheduler → sync endpoint; sync → Google Sheet; CI → production.

Controls bắt buộc: server authorization với cả actor và target ROOT; session revocation; origin/CSRF; upload byte/type/pixel limits và quota; no public signup; runtime least privilege; preview isolation; idempotency/lease; Sheet private; log redaction; backup/restore. DB/R2 không có distributed transaction nên phải có trạng thái reconciliation. CORS/noindex/ẩn menu không phải authorization.

Không lưu dữ liệu cá nhân trong bucket public; token R2 chỉ có Object Read & Write ở đúng bucket. Không tuyên bố tuân thủ pháp lý khi retention và phạm vi xử lý dữ liệu chưa được người phụ trách xác nhận.

## Đề xuất và migration path

Thực hiện D0–D7 trong MVP plan, bắt đầu bằng build boundary và sandbox. Chuyển catalog sang async DTO nhưng giữ trường mà UI đang dùng; đổi URL ảnh đồng thời ở card; chuyển survey copy cùng API thật. Dùng migration additive và giữ deployment rollback tương thích. Chỉ cutover DNS sau UAT/security/restore test.

Thay Neon sau này: dump/restore Postgres + đổi connection, kiểm tra extension/transaction compatibility. Thay R2: copy objects giữ key, kiểm checksum rồi đổi media origin; không rewrite nội dung trong mọi entity. Thay scheduler: giữ claim/lease và idempotent Sheet contract. Thay auth provider: migration identity mapping có kiểm chứng subject, revoke sessions; không tự ghép account bằng email không xác minh.

**Trạng thái:** provider topology theo baseline; các chi tiết auth, quota, public-media policy và SLA ở đây là đề xuất chưa được phê duyệt. Chưa có code hoặc cloud deployment tương ứng.
