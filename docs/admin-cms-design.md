# CMS nội bộ — Architecture Decision và UX contract

Ngày: 2026-10-05. Trạng thái: đã có UI Next `/admin` và export Pages;
chưa triển khai auth/admin API production.
Phạm vi: CMS mới trong solar-lxdb, theo yêu cầu 2.2.1–2.2.6.

## Hiểu

ADMIN quản lý nội dung, khảo sát và tài khoản Editor. EDITOR tạo, sửa,
ẩn/hiện dự án và thiết bị trong phạm vi được cấp. Giao diện tiếng Việt,
ưu tiên desktop cho nhập liệu; mobile hỗ trợ kiểm tra và xử lý nhanh.

Thước đo UX: tìm đúng bản ghi, hiểu trạng thái, hoàn thành cập nhật và
nhận phản hồi rõ ràng; không cần hiểu cấu trúc database.

Hiện trạng đọc từ backend-core.md, mvp-implementation-plan.md và hai ADR
backend: public-read/survey có code và bằng chứng local; auth/admin/upload
HTTP chưa triển khai. Không coi PRODUCT.md mô tả cũ về survey là bằng
chứng current backend. Chưa xác nhận cloud production.

## Thiết kế

### Quyết định kiến trúc

Giữ Next.js runtime serverless, Neon/PostgreSQL và R2 theo ADR-0001.
Business state, session và job state tồn tại ngoài instance; không cần
VPS/process thường trú. Giới hạn provider, connection pool, ngân sách
và khả năng phục hồi vẫn là các ràng buộc phải đo.

API gọi service có authorization và transaction; UI nhận DTO giới hạn
trường theo quyền. Browser không nhận DB/R2 credential. Demo static và
server build giữ boundary hiện có; admin thật chỉ thuộc server target.

Email/password đáp ứng reset qua email thay cho đề xuất Google-only cũ.
Chọn thư viện auth được duy trì, DB-backed session có thể thu hồi;
không tự xây password/session protocol. Version/provider email phải
được đối chiếu trước triển khai. Không public signup.

Trade-off: DB session thêm lượt kiểm tra nhưng cho phép thu hồi quyền
và khóa tài khoản; nhiều provider giảm vận hành máy chủ nhưng tăng yêu
cầu quản lý secret/region/quota/backup.

### Visual authority và bố cục

Kế thừa DESIGN.md và control @solar/ui; không tạo design system thứ hai.
Nền trắng/xám nhạt, hành động xanh, cam chỉ dùng khi có ý nghĩa.
Một font UI, số liệu tabular, label rõ; không dùng motion marketing trong admin.

Ba bố cục đã được trình bày: Bàn vận hành, Hộp thư khảo sát, Sổ nội dung.
User đã xác nhận **Bàn vận hành — việc cần xử lý + panel chi tiết**.
Ưu tiên layout/demo giao diện, backend thực hiện sau. User tiếp tục yêu cầu
Next `/admin`, logo gốc và demo trên dev Pages. UI hiện ở `src/app/(cms)/admin`
và `src/features/admin`; public/cms-demo chỉ còn redirect tương thích.
Public chrome chuyển composition sang `(public)/layout.tsx`; admin layout
dùng shell/provider riêng. Route group không thêm URL segment. Controls
dùng @solar/ui với CSS Module/adapters tại feature, logo dùng asset gốc.
DESIGN.md/.impeccable sidecar giữ authority; không tạo design system mới.

Pages chỉ export UI templates/paths được allowlist trong
`scripts/demo-admin-routes.mjs`; không đưa auth handler/API/private data vào
artifact public. Seed edit routes dùng generateStaticParams; record mới
trong phiên dùng `/admin/projects/edit/?id=...` hoặc equipment tương ứng.
Provider giữ data qua client navigation, reload reset seed. Seam migration
là `useAdminDemo`/screen handlers sang DTO/services có server commit.
Preview ADMIN/EDITOR không là authorization; production thuộc server target.

### Navigation và screen contracts

| Route dự kiến | Job | Hành động chính |
| --- | --- | --- |
| /admin/login | Xác thực tài khoản được mời | Đăng nhập |
| /admin/forgot-password | Yêu cầu email khôi phục | Gửi liên kết |
| /admin/reset-password | Đặt mật khẩu bằng token hợp lệ | Đặt mật khẩu |
| /admin | Xem tổng quan phù hợp quyền | Mở mục cần xử lý |
| /admin/projects | Tìm/quản lý dự án | Thêm dự án |
| /admin/projects/new và /admin/projects/:id/edit | Nhập nội dung theo form | Lưu nháp / Hiển thị |
| /admin/equipment | Tìm/quản lý thiết bị | Thêm thiết bị |
| /admin/equipment/new và /admin/equipment/:id/edit | Sửa mô tả, thông số, ảnh | Lưu nháp / Hiển thị |
| /admin/media | Tìm ảnh và quản lý thư mục | Tải ảnh lên |
| /admin/leads | Lọc và xử lý phản hồi khảo sát | Xuất theo bộ lọc |
| /admin/editors | Quản lý tài khoản và phạm vi Editor | Mời Editor |

Sidebar có Tổng quan, Dự án, Thiết bị, Media, Khảo sát/Lead, Tài khoản.
Nhóm không có quyền bị loại khỏi navigation và DTO, đồng thời API từ chối.
EDITOR có tổng quan riêng, không nhận Lead hoặc thống kê Lead.
ROOT nếu giữ lại chỉ thuộc operator bootstrap/recovery, không có menu quản lý ROOT.

### Dashboard

ADMIN xem Lead nhận theo ngày/tuần/tháng, Lead chưa xử lý, số dự án và
thiết bị đang hiển thị, hoạt động nội dung mới nhất. Chart phản ánh thời
điểm nhận khảo sát, không tự diễn giải thành doanh thu hoặc conversion.
Khảo sát là nguồn Lead; không đếm hai lần cùng submission.

Ngày tính theo Asia/Ho_Chi_Minh; lưu timestamp UTC. Đề xuất tuần bắt đầu
thứ Hai. Bộ lọc kỳ áp dụng cho chart/Lead; tổng catalog được ghi rõ là
hiện tại, tránh hiểu nhầm là số lượng trong kỳ. Không dựng KPI giả cho DB trống.

### Catalog và form

Bảng dự án: ảnh, tên, danh mục, hiển thị, tiêu biểu, cập nhật, hành động.
Bảng thiết bị: ảnh, tên, danh mục, tình trạng thiết bị, hiển thị, cập nhật.
Tìm kiếm/bộ lọc/phân trang giữ trong URL; kết quả và count cùng scope.
Danh sách mặc định 20 dòng; server giới hạn tối đa 100 theo baseline.

Form trang riêng, có breadcrumb và vùng lưu dễ tìm. Nhóm thông tin,
nội dung, hình ảnh; equipment thêm thông số kiểu tên/giá trị/đơn vị.
Danh mục quản lý inline trong module, tránh thêm menu cấp cao.

Lưu nháp không làm nội dung public. Hiển thị có validator rõ trường thiếu.
Ẩn áp dụng public projection. Xóa là tombstone và chỉ ADMIN; không dùng
xóa cứng cho tác vụ thông thường. Back/đổi module khi dirty phải cảnh báo.
Update mang version; 409 hiển thị người dùng cần tải lại/đối chiếu, không
ghi đè âm thầm. Bản thiết kế không tự thêm rich HTML/WYSIWYG.

Featured/order landing tiếp tục thuộc revision và published pointer theo
ADR-0002. UI cho biết thay đổi lựa chọn đang ở nháp hay đã xuất bản;
không thêm boolean thứ hai cạnh tranh với canonical selection.
Đề xuất quyền thay selection/order landing thuộc ADMIN; EDITOR không
có quyền cấu hình landing chỉ vì có quyền sửa một project.

### Các chiều trạng thái

| Đối tượng | Trạng thái nghiệp vụ/UI | Boundary |
| --- | --- | --- |
| Dự án/Thiết bị | Nháp / Đang hiển thị / Đã ẩn | DRAFT / PUBLISHED / HIDDEN hiện có |
| Thiết bị | Sẵn có / Đang cập nhật | Trường độc lập cần migration |
| Lead | Mới / Đang xử lý / Hoàn tất | Đề xuất cần migration; không dùng sync_status |
| Media | Đang xử lý / Sẵn sàng / Lỗi / Đang gỡ | Lỗi upload cần contract, không tự coi là enum DB hiện có |
| Editor | Đang chờ nhận lời mời / Hoạt động / Đã khóa | Lifecycle auth cần thiết kế |

### Media

Grid/list, bộ lọc thư mục và tìm theo tên. Thư mục là metadata, không đổi
immutable object key khi chuyển thư mục. Chi tiết ảnh có alt text, kích
thước, dung lượng, trạng thái công khai, danh sách nơi dùng.

JPEG/PNG/WebP là input; giữ pipeline encode WebP hiện có. Giới hạn nền
tảng đang là 3 MiB và 20 triệu pixel; hiển thị trước upload. File từng ảnh
có tiến trình/kết quả riêng; chỉ retry ảnh lỗi. Sao chép liên kết chỉ sau
finalize phù hợp quyền; không giả URL thành công khi ảnh còn pending.

EDITOR được chọn/upload ảnh cho nội dung trong scope; không tự có quyền
duyệt ảnh công khai, đổi folder toàn thư viện hoặc xóa ảnh dùng chung.
ADMIN kiểm tra tham chiếu trước khi gỡ. Nếu draft cần private, dùng private
storage/gated preview; public R2 hiện có không đảm bảo tính bí mật của draft.

### Lead và export

Lọc ngày/trạng thái, tìm tên/điện thoại; mở chi tiết khảo sát trong panel
hoặc trang riêng trên mobile. Trạng thái xử lý có lịch sử actor/time;
payload khảo sát gốc giữ nguyên, không sửa dữ liệu người dùng để đổi trạng thái.

Xuất Excel/CSV theo toàn bộ bộ lọc hiện tại, không chỉ trang đang xem.
Trước xuất hiển thị số bản ghi và kỳ. File giữ điện thoại ở kiểu text,
không tạo formula từ input. CSV có xử lý formula injection và encoding
tiếng Việt. Export nhỏ có giới hạn; export lớn dùng job lưu bền vững,
download private có hạn dùng và kiểm quyền lại. Ghi audit export.

### RBAC

| Capability | ADMIN | EDITOR |
| --- | --- | --- |
| Catalog create/read/update/hide/show | Toàn bộ | Theo scope |
| Catalog delete/restore | Có | Không |
| Category management | Có | Không, được chọn danh mục |
| Media select/upload | Có | Theo scope/nội dung được cấp |
| Media shared delete/public approval | Có | Không |
| Landing featured/order publication | Có | Không |
| Lead list/detail/status/export | Có | Không |
| Editor invite/scope/lock | Có | Không |
| System config/ROOT management | Không thuộc yêu cầu màn hình này | Không |

Scope lưu phía server theo module/entity, không nhận scope/role từ client.
Menu, API, search/count, picker, bulk action và export dùng cùng policy.
Khóa Editor thu hồi phiên; lời mời không cho phép tự nâng role ADMIN.

### States và responsive

Loading giữ cấu trúc bằng skeleton. Empty phân biệt chưa có dữ liệu với
không khớp bộ lọc; nút tạo mới chỉ hiện khi có quyền. Error giữ nội dung
đã nhập và đưa đường retry. Toast không là nơi duy nhất thông báo lỗi form.
Lưu thành công phải dựa vào server commit. Session hết hạn không gửi tiếp
write; tránh lưu PII/token vào localStorage để giữ form.

Desktop đủ rộng dùng list/detail cạnh nhau nếu chọn hướng tương ứng;
mobile chuyển sang màn hình chi tiết với đường quay về giữ bộ lọc.
Sidebar thành drawer; focus visible, keyboard navigation, label đầy đủ,
status có text, reduced-motion và touch target phù hợp.

## Validate security

Assets: session, Lead PII, nội dung public, media và cloud credentials.
Actors: anonymous/bot, Editor vượt quyền, tài khoản Admin bị chiếm,
operator. Boundaries: browser/API, API/DB/storage/email, worker/export.

Controls thiết kế: deny-by-default; actor/target/scope check mỗi request;
DB session có revocation; cookie Secure/HttpOnly/SameSite; CSRF/origin;
login/reset rate limit; reset token một lần/hết hạn và phản hồi không
tiết lộ tài khoản; MFA cho ADMIN trước production; log không chứa PII/token.

Upload kiểm binary/size/pixel, re-encode, object key do server sinh; upload
không đồng nghĩa phê duyệt public. Export private/no-store; kiểm quyền khi
tạo job và tải file. Audit tài khoản, scope, publish, hide/delete, export.

Đây là validation ở mức design, không phải security test hoặc chứng nhận
tuân thủ. Retention, quyền xử lý PII và recovery procedure cần chủ hệ thống
xác định trước rollout.

Tham chiếu kiểm tra trong phiên thiết kế trước:
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

## Đề xuất và migration path

1. Đã chốt Bàn vận hành; UI reviewable trên Next `/admin`, logo gốc,
   export Pages qua allowlist. Static prototype cũ chỉ là lịch sử.
2. Cập nhật ADR auth/RBAC và phạm vi Media/Lead so với MVP cũ.
3. Introspect schema triển khai thật, additive migration/backfill; không
   tạo bảng cạnh tranh với 001_landing.sql và survey schema hiện có.
4. Auth/session/policy trước admin API; shell riêng và @solar/ui đã có ở UI
   demo. Thay context mutations bằng service adapters; không kéo public
   chrome/marketing motion hoặc private DTO vào Pages.
5. Nối catalog, media, Lead và account flow; test phân quyền trực tiếp qua
   API, thu hồi session, ID ngoài scope, count/search, version conflict,
   upload giả MIME, export và backup/restore.
6. Sandbox UAT rồi server deployment. Static demo không chứa admin/auth
   endpoint hoặc secret. Rollback app về bản tương thích schema, giữ dữ liệu.

Thay DB bằng PostgreSQL khác qua migration/dump-restore; thay storage giữ
object key và đổi origin; thay auth provider cần mapping identity có chứng
minh và revoke session. Không tự liên kết identity chỉ bằng email.

## Trạng thái deliverable

- Hoàn tất contract chung độc lập với bố cục.
- Chốt Bàn vận hành; Next `/admin` có controls @solar/ui và tương tác synthetic
  trong provider; public/cms-demo chỉ redirect tương thích.
- Backend/auth/RBAC/upload cloud/email/Excel thật chưa triển khai theo ưu tiên của user.
- Bằng chứng giao diện và giới hạn nằm trong admin-cms-demo.md.
