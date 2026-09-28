# CSS conventions

Áp dụng cho CSS hiện tại trong `src/styles/` và CSS Modules của package UI. Kiến trúc package, theme contract và ranh giới component nằm tại [UI System Architecture](ui-system-architecture.md); tài liệu này quy định cách viết và review CSS.

## Cấu trúc

- Design token dùng cho màu, nền, chữ, khoảng cách, bo góc, focus và motion dùng chung. Tên token thể hiện ý nghĩa giao diện; thêm token khi có nhiều consumer hoặc đó là giá trị chuẩn của brand/design system. Không tạo token chỉ để thay một literal xuất hiện một lần.
- `tokens.css` giữ semantic custom properties dùng xuyên component. CSS Modules giữ style cục bộ bên cạnh component dùng chung. `base.css`/`components.css` trong app hiện tại là legacy app stylesheet; không mở rộng chúng thành stylesheet chung của package.
- Global theme import chỉ thiết lập token và reset có kiểm soát. Component không thêm inline palette hoặc hệ utility thứ hai. Mỗi style cục bộ có một module CSS và một contract class rõ ràng.
- Class theo vai trò UI, ví dụ `.project-card`, `.mobile-nav`, `.service-stage`. Dùng class riêng cho component; chia sẻ class khi cả cấu trúc lẫn ý nghĩa hiển thị giống nhau. Selector cha chỉ dùng cho quan hệ thật giữa cha/con và trạng thái HTML.

## Quy tắc chống trùng và cascade

1. Một selector có đúng một rule nền. Gộp các khai báo cùng selector ở cùng trạng thái; không khai báo một phần rồi tạo rule phía sau để chép đè một phần khác.
2. Mọi lần ghi đè cùng property phải có lý do nhìn thấy được trong selector hoặc context, ví dụ `:hover`, `[open]`, `prefers-reduced-motion`, hay một breakpoint. Khác giá trị giữa các breakpoint là override có chủ đích; khác giá trị ở cùng breakpoint hoặc base selector là lỗi cần xem lại.
3. Trước khi thêm selector, tìm selector/class đang có bằng `rg`. Nếu hai component có cùng style và semantics, dùng chung rule hoặc modifier rõ nghĩa; không tạo hai tên class đồng nghĩa.
4. Với component mới hoặc component đang được chỉnh sửa, gom responsive overrides sau rule nền, theo thứ tự màn hình rộng đến hẹp. Gộp block breakpoint khi truy được thứ tự cascade; nếu phải chuyển nhiều block legacy, lập diff computed-style riêng trước để không đổi giao diện ngoài dự kiến.
5. Giá trị xuất hiện ở nhiều selector không tự động là duplicate. `display:flex`, cùng màu chữ hay `min-height:44px` là pattern bình thường; chỉ trừu tượng hóa thành class/token nếu các component cần thay đổi cùng nhau.
6. Khi xóa hoặc gộp declaration, giữ nguyên giá trị computed tại desktop/mobile, hover/focus/open và reduced-motion. Rule muộn không được vô tình ghi đè trạng thái responsive.

## Áp dụng vào đợt chuẩn hóa

- Gộp `.site-header`, `.brand`, `.nav-cta`, `.contact-button`, `.partners-inner`, `.solution-card` và `.faq-item summary` về rule nền riêng, giữ nguyên giao diện desktop hiện hành.
- Bỏ các bản khai báo lặp `.brand-mark`, `.nav-cta`, `.solution-card` và `.faq-item summary`.
- Bỏ lần ghi đè `.nav { align-items: center }` ở cuối stylesheet để `align-items: flex-start` tại `max-width: 900px` có hiệu lực khi navigation xuống dòng.

Khi review CSS, báo riêng duplicate thật (cùng selector/context/property), cascade cần thiết (state/breakpoint) và giá trị chỉ giống nhau giữa các component khác nghĩa. Không dùng tổng số lần `display:flex`, màu hoặc số pixel giống nhau như thước đo duplication.

Trong package UI, giữ một selector nền cho mỗi lớp trạng thái trong CSS Module. Các class trạng thái như hover, focus, invalid, disabled, scheme, density và breakpoint được tách khi biểu đạt trạng thái hoặc context thực sự; không dùng selector toàn cục để ràng buộc component package.
