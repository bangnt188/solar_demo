# Kiến trúc bộ UI dùng chung

## Quyết định

Xây dựng một package UI có version cho các dự án React web responsive, gồm landing page và admin/dashboard. Solar là dự án tiêu thụ package. Mỗi sản phẩm tự quản lý nội dung, route, dữ liệu, quyền và nghiệp vụ.

| Phạm vi | Quyết định |
| --- | --- |
| Nền tảng | React web responsive từ điện thoại đến desktop. |
| Primitive | Base UI cho các tương tác phức tạp cần accessibility; dùng HTML semantic khi nền tảng web đã đáp ứng yêu cầu. |
| Style | CSS Modules cho style component; CSS custom properties cho hợp đồng theme giữa các dự án. |
| Form | React Hook Form sở hữu giá trị/trạng thái form; Zod khai báo schema phía client. Server của từng feature luôn xác thực lại request. |
| Composition | Ghép màn hình bằng component và props có kiểu; chưa làm form builder dựng từ JSON. |
| Theme | Light/dark và mật độ thoáng/gọn. Dự án có thể chỉnh màu, font, bo góc và khoảng cách qua theme. |
| Locale | Thông điệp mặc định tiếng Việt/Anh. Dự án cung cấp nội dung, tiền tệ, đơn vị và múi giờ theo locale của mình. |
| Phát hành | Một package có version; mỗi dự án chủ động nâng phiên bản. Thay đổi phá vỡ props, token hoặc hành vi mặc định cần tăng major. |

Tên package và registry riêng là cấu hình phát hành, sẽ điền khi tổ chức chọn nơi lưu package. Mặc định dùng registry riêng để tránh công khai package nội bộ. Tài liệu này không tạo credentials hay phát hành package.

Ảnh nghiệm thu cho thư viện: [UI Components reference](ui-components-reference.png) (1312 × 1199). Đây là ảnh chuẩn cho light/comfortable: Primary `#004AAD`, Accent `#FEBB3C`, success `#005A2B`, error `#8A1C13`, surface `#f2f3ff`, canvas `#faf8ff`. Preview của repo `component-ui` phải dùng chính React exports (không phải ảnh dựng tĩnh); trạng thái keyboard, hover, disabled, busy và popup phải hoạt động, kể cả ở viewport mobile. Các màu chữ/trạng thái phải giữ độ tương phản và dark theme có thể dùng sắc độ khác ảnh để đọc được.

## Quyền sở hữu và chiều phụ thuộc

```text
Route và screen của dự án
        ↓
Feature và schema form ─────────→ Adapter form dùng chung
        ↓                                  ↓
Dữ liệu/API của dự án             Component dùng chung
                                           ↓
                                      Basic component
                                           ↓
                                    Base UI / HTML
                                           ↓
                                     Theme tokens
```

Phụ thuộc hướng về primitive và token. UI dùng chung không import route Solar, kiểu dữ liệu catalog, API client, database, nội dung khách hàng hoặc quyền nghiệp vụ. Feature được ghép component dùng chung; component dùng chung không import ngược feature.

Base UI sở hữu cơ chế tương tác/accessibility của primitive tương ứng, như bàn phím, focus và trạng thái popup. **Basic** bổ sung CSS Module và ánh xạ trạng thái primitive sang class/data attribute. Basic không chứa validation nghiệp vụ, gọi API, hoặc bản sao state giá trị của form.

**Component dùng chung** thêm props và hành vi thực sự được nhiều màn hình cần. Field ghép control với label, mô tả và lỗi là một component dùng chung. Bộ tính toán hiệu quả điện mặt trời thuộc feature Solar vì chứa quy tắc nghiệp vụ.

Atomic Design mô tả độ sâu composition, không bắt buộc mỗi khái niệm phải có một thư mục riêng: control là atom; field là molecule; nhóm tương tác có thể là organism. Section, screen và route thuộc ứng dụng, không export thành UI chung.

## Cấu trúc package

```text
packages/ui/           # Git submodule: bangnt188/component-ui, đồng thời là npm workspace @solar/ui
  src/
    tokens/          # tên token, kiểu theme và entry point theme
    basic/           # Button, ButtonGroup, Input/Select/Checkbox/Switch, Qr, Loading
    components/
      layout/        # Stack, Grid, Container, Divider
      fields/        # TextField, PasswordField, TextareaField, SelectField,
                     # ComboboxField, NumberField, DecimalField, DateField,
                     # ColorField, UploadField, CheckboxField, RadioGroupField, SwitchField
      feedback/      # Alert, Toast, LoadingIndicator, EmptyState,
                     # ConfirmDialog, Modal, Drawer, Popover
      navigation/    # Tabs, Breadcrumbs, Pagination, DropdownMenu
      data/          # Badge, Card, Table, Avatar, ProgressBar
    forms/           # adapter React Hook Form
    validation/      # khối Zod thuần, không phụ thuộc React
    i18n/            # thông điệp mặc định tiếng Việt/Anh
  styles/            # theme/reset CSS; CSS Modules đặt cạnh component
  package.json       # export có chủ đích và hợp đồng peer dependencies

src/features/        # tính năng/catalog, schema khảo sát thuộc ứng dụng Solar
```

Package công khai các entry point có chủ đích như `basic`, `components`, `forms`, `validation`, `tokens`, `styles`; consumer không import đường dẫn nội bộ. Adapter phụ thuộc framework để ở ứng dụng; control dùng chung không phụ thuộc Next.js router hay Image.

Repo [component-ui](https://github.com/bangnt188/component-ui) sở hữu source, tests, build và lockfile riêng. App Solar giữ workspace/lockfile consumer, pin commit bằng gitlink ở `packages/ui`; muốn nâng package phải cập nhật commit submodule và kiểm tra lại build của app.

Không tạo song song `atoms/` và `ui/` cùng chứa một loại control. Mỗi trách nhiệm có một tên công khai và một implementation. Không bọc primitive bằng component chuyển tiếp props đơn thuần; chỉ tạo Basic khi nó tạo được seam ổn định cho style, accessibility hoặc tương thích.

Những primitive phổ biến từ checklist tham chiếu đã thiếu (Avatar, ButtonGroup, ProgressBar, Modal, Drawer, Popover, DropdownMenu, PasswordField) có implementation React trong package. Ảnh nghiệm thu bổ sung QR thực từ chuỗi dữ liệu, loading spinner/trạng thái bất đồng bộ, DateField, ColorField và UploadField với selection/removal thực. Các widget mang nghiệp vụ hoặc nặng phụ thuộc (office/PDF viewer, rich editor, branch/worklist, tree combo) không được nhân bản từ package Svelte tham chiếu. File/date/time dùng native `Input` khi đủ semantics; `Badge` là nhãn hiển thị, không thay thế state của tag editor.

## Hợp đồng token và theme

Token có ba tầng:

1. **Giá trị nền:** thang màu, khoảng cách, bo góc, cỡ/chữ, elevation và motion.
2. **Token ngữ nghĩa:** mục đích như nền trang, surface, chữ chính/phụ, border, action, focus, success, warning, error và disabled.
3. **Token component:** chỉ thêm khi component có quy tắc giao diện độc lập; luôn tham chiếu token ngữ nghĩa thay vì lặp mã màu/giá trị thô.

Component dùng token ngữ nghĩa, không nhúng màu thương hiệu của dự án hoặc tạo palette cục bộ. Màu thương hiệu dịch vụ bên ngoài như Zalo có token nhận diện riêng, không tự đổi theo màu primary của dự án.

Đặt tên token theo nhóm `--ui-{category}-{role}-{scale/state}`. Ví dụ: `--ui-color-action`, `--ui-color-action-hover`, `--ui-color-canvas`, `--ui-color-surface`, `--ui-color-text-primary`, `--ui-color-border`, `--ui-color-focus`, `--ui-space-md`, `--ui-radius-control`, `--ui-font-body`, `--ui-shadow-overlay`, `--ui-motion-fast`. Palette thương hiệu riêng của app được định nghĩa trong theme app; token ngữ nghĩa package trỏ tới palette đó. CSS Module chỉ dùng token ngữ nghĩa/component, không dùng palette thô.

Ánh xạ khởi đầu từ `src/styles/tokens.css` hiện tại:

| Token Solar hiện tại | Token package đích | Ghi chú |
| --- | --- | --- |
| `--color-primary`, `--color-primary-hover` | `--ui-color-action`, `--ui-color-action-hover` | Màu nhận diện được map sang vai trò action. |
| `--color-primary-dark`, `--color-text-primary` | `--ui-color-text-primary`, `--ui-color-heading` | Tách chữ nội dung và heading nếu thiết kế thật sự cần khác nhau. |
| `--color-background`, `--color-surface`, `--card-bg` | `--ui-color-canvas`, `--ui-color-surface`, `--ui-color-surface-raised` | Ba vai trò riêng, không gộp chỉ vì giá trị hiện tại gần giống nhau. |
| `--color-border`, `--focus-color` | `--ui-color-border`, `--ui-color-focus` | Focus phải nhìn thấy ở mọi theme. |
| `--button-*`, `--link-*` | Component dùng semantic action/link tokens | Xóa alias chỉ chuyển tiếp khi consumer đã được chuyển. |
| `--space-*`, `--radius-*`, `--font-size-*`, `--font-body` | `--ui-space-*`, `--ui-radius-*`, `--ui-font-size-*`, `--ui-font-body` | Chuyển theo vai trò, giữ thang giá trị thống nhất. |
| `--motion-*`, `--shadow-solution-*` | `--ui-motion-*`, `--ui-shadow-*` | Đưa shadow riêng Solar khỏi gói theme chung nếu không dùng được ở dự án khác. |

Không xóa/đổi tên token Solar trong cùng một thay đổi với việc khai báo token đích. Migration giữ alias tương thích trong một khoảng chuyển tiếp; chỉ xóa alias sau khi tìm và chuyển hết consumer. Giá trị cũ là baseline tham chiếu, không phải bộ màu bắt buộc cho dự án tiếp theo.

Hợp đồng theme gồm light/dark và comfortable/compact. Density chỉ thay đổi khoảng cách/kích thước control, không thay đổi ý nghĩa nội dung hoặc validation. Cặp foreground/background phải đủ tương phản trong mọi scheme. Dự án thay token trong theme file, không vá selector của component.

Mỗi ứng dụng import `@solar/ui/styles` một lần. Chọn scheme/mật độ trên vùng UI bằng `data-ui-scheme="light|dark"` và `data-ui-density="comfortable|compact"`; gắn `data-ui-root` lên container chung nhỏ nhất để reset của package không ảnh hưởng phần còn lại của trang. `:root` cung cấp token mặc định light/comfortable.

Portal của dialog/drawer/popover/menu/combobox mặc định đặt trong `<body>`. Nếu scheme/density chỉ gắn lên một vùng con, truyền `portalContainer` (DOM element hoặc React ref tới element đó) để popup kế thừa token của vùng đó; nếu không, đặt scheme/density lên `<body>`.

Theme khai báo ở build time là cấu hình tin cậy. Nội dung runtime từ CMS/database không được biến thành CSS tùy ý, class hoặc URL chưa kiểm tra. Nếu sau này cho phép chỉnh theme runtime, phải validate theo schema token giới hạn và allowlist giá trị trước khi áp dụng.

## Hợp đồng props của component

Basic forward props, ref và semantics được primitive công bố. `className` của control áp vào element control. Component nhiều phần tử phải công bố slot class riêng; không để `className` lúc vào wrapper, lúc vào input tùy component.

Props dùng chung có một ý nghĩa:

- `variant` chọn kiểu hiển thị; `size` chọn kích thước có tên.
- `orientation` áp dụng cho nhóm radio/checkbox và chỉ hướng hàng/cột.
- `labelPlacement` áp dụng cho một field (`top` hoặc `start`); mặc định `top`, tự chuyển lên trên khi breakpoint không đủ rộng.
- `disabled` chặn tương tác và không đưa giá trị vào submit; `readOnly` cho phép đọc/focus nhưng không sửa.
- `required`, `description`, `error`, `name`, `id` và native constraint giữ nghĩa chuẩn của chúng.

Với field có label phía trên, nội dung grid được căn đầu; thông báo lỗi vẫn nằm trong flow và không làm input/select của field bên cạnh lệch trục dọc khi cùng hàng.

Hợp đồng minh họa (tên TypeScript export chính xác được hoàn thiện khi triển khai):

```ts
type FieldPresentation = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  labelPlacement?: "top" | "start";
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
};

type TextFieldProps = FieldPresentation &
  Omit<React.ComponentProps<typeof BasicInput>, "id" | "className"> & {
    controlClassName?: string;
  };
```

Mỗi field liên kết label, trợ giúp và lỗi với control. `aria-describedby` ghép ID của nội dung trợ giúp/lỗi, không xóa ID do caller truyền. Lỗi phải có chữ và được thông báo; không chỉ dùng màu để thể hiện validity. Control native/custom dùng cách trình bày trạng thái invalid thống nhất.

Control có thể nhận `value`/`onValueChange` hoặc `defaultValue`; một instance không đổi mode sau khi mount. Adapter form nối state hiện tại của form vào control, không giữ thêm một bản state giá trị trong field.

`NumberField` nhận `number` hữu hạn hoặc `null`; Base UI định dạng theo `locale`, giữ `min`/`max`/`step` và serialize số canonical qua input native ẩn. Chỉnh số ngoài biên được chuẩn hóa khi blur; dùng `DecimalField` nếu cần giữ chính xác chữ số/trailing zero. `DecimalField` bảo toàn chuỗi thập phân chính xác; giá trị đang gõ có thể chưa hoàn chỉnh, còn giá trị submit chuẩn dùng dấu chấm thập phân, không có dấu phân nhóm. Parsing/formatting decimal nằm ở một module dùng chung với validation, không chuyển qua floating point JavaScript rồi âm thầm làm tròn. Empty, số âm, min/max, precision và locale phải thành props hoặc schema constraint tường minh.

`@solar/ui/validation` cung cấp `decimalSchema({ min: { value }, max: { value }, maxFractionDigits, allowNegative, requiredMessage })`. Min/max là chuỗi thập phân canonical và được so sánh chính xác, không qua `Number`; chuỗi rỗng được chấp nhận nếu không truyền `requiredMessage`.

Table cơ bản lo cấu trúc truy cập được, định nghĩa cột và render hàng. Sort, filter, pagination, selection, query server là state/callback được kiểm soát hoặc do adapter ứng dụng sở hữu. Table dùng chung không tự fetch hoặc suy đoán quyền.

## State form và validation

Trong form ghép, React Hook Form sở hữu giá trị, dirty/touched, trạng thái submit và lỗi đã map. Primitive độc lập chỉ giữ state tương tác cần cho accessibility của chính nó. State điều khiển từ ngoài không được sao chép vào React state cục bộ.

`Modal`, `Drawer`, `Popover`, `DropdownMenu` chuyển thẳng `open`/`defaultOpen`/`onOpenChange` cho Base UI; Base UI giữ open state khi không controlled, keyboard navigation, focus trap và trả focus. `PasswordField` chỉ giữ visibility boolean, không sao chép giá trị input; `ProgressBar` nhận tiến trình (hoặc `null` indeterminate), không giả lập upload; `Avatar` dùng fallback khi ảnh không tải được. Form adapter truyền disabled của caller vào RHF để giá trị disabled không được submit.

Zod schema nằm cạnh feature sở hữu form; package có thể export helper validation thuần dùng lại. Field chỉ hiển thị kết quả validation, không quyết định quy tắc sản phẩm. Chính sách mặc định:

1. Chưa hiện lỗi trước khi field được tương tác hoặc form được submit.
2. Validate khi blur; sau khi lỗi hiện, validate lại khi change để gỡ lỗi sớm.
3. Submit validate cả form, focus control lỗi đầu tiên, và chờ các async check bắt buộc.
4. Lỗi server theo field được gắn lại field; lỗi tổng thể hiện ở cấp form.
5. Server kiểm tra lại quyền, allowlist, định dạng, giới hạn, consent và bất biến nghiệp vụ. Client validation hỗ trợ trải nghiệm, không phải security control.

Async validation cần hủy được hoặc bỏ qua kết quả cũ. Kết quả pending không được coi là hợp lệ hoặc cho submit trùng. Native constraint có thể dùng cùng schema nếu semantics khớp; không duy trì hai bộ điều kiện mâu thuẫn.

## Accessibility, bảo mật và runtime

Dùng HTML semantic khi đáp ứng yêu cầu tương tác. Widget tổ hợp giữ keyboard navigation, focus rõ ràng, accessible name, thông báo trạng thái và reduced-motion. Dialog định danh title/description; trợ giúp và lỗi field được liên kết; density compact vẫn có target cảm ứng dễ thao tác.

Kiểm tra URL ngoài tại ranh giới ứng dụng. Render nội dung người dùng dưới dạng text, trừ khi có yêu cầu rich-text renderer được review riêng. Package không chứa secret hoặc quyền truy cập dữ liệu đặc quyền. API authorization và lọc output thuộc server của từng dự án.

Package phát hành CSS Modules và theme variables cùng hướng dẫn import theme toàn cục. Giới hạn client entry point ở control tương tác để screen server-rendered không kéo toàn bộ controls vào client bundle. Consumer Next.js tuân theo tài liệu phiên bản Next đã cài về CSS import và client boundary.

## Threat model và trade-off

| Rủi ro | Biện pháp trong thiết kế |
| --- | --- |
| Kẻ tấn công sửa nội dung DB để chèn CSS/URL độc hại | Không nhận CSS/class tùy ý; validate URL và theme theo allowlist ở server/application boundary. |
| Người dùng bỏ qua client validation hoặc sửa request | Server kiểm tra lại xác thực, quyền, whitelist, consent, giới hạn và business invariant. |
| Package bị thay đổi ngoài ý muốn giữa dự án | Phát hành immutable version, pin version, changelog; consumer chủ động nâng cấp. |
| Sai khác màu làm giảm tương phản | Test mọi scheme/state; theme chỉ thay token ngữ nghĩa có cặp foreground/background. |

Base UI giảm phần tự triển khai keyboard/accessibility nhưng vẫn yêu cầu kiểm chứng composite behavior ở sản phẩm. CSS Modules tăng file style colocated để tránh rò CSS; token riêng đảm bảo đổi theme không cần sửa từng file module. Một package có version cần quy trình phát hành, đổi lại các dự án nâng cấp có kiểm soát. React Hook Form/Zod thêm dependencies; validation server vẫn lặp một phần rule có chủ đích vì server là nơi thực thi tin cậy.

## Versioning và migration

Phát hành version bất biến lên private npm-compatible registry sau khi tổ chức chọn registry và package scope. Consumer pin version tương thích và nâng cấp có chủ đích; mỗi version có changelog.

| Thay đổi | Version |
| --- | --- |
| Sửa lỗi, không đổi contract public hoặc hiển thị dự kiến | Patch |
| Thêm prop/component/token tùy chọn tương thích ngược | Minor |
| Bỏ/đổi tên prop/token; đổi default behavior, nghĩa dữ liệu hoặc peer requirement | Major |

Migration theo lát cắt: kiểm kê consumer và hành vi Solar; ánh xạ giá trị hiện tại sang semantic token; thêm package/theme import; chuyển button và field; nối form adapter; chuyển feedback/navigation/table; giữ composition Solar trong feature; chỉ xóa implementation cũ sau khi hết consumer. Site hoạt động qua từng lát cắt; thay đổi hình ảnh có chủ đích phải được ghi nhận để review.

Nếu package không còn phù hợp, giữ nguyên contract props/token để có thể thay Basic layer bằng adapter mới; migration sau đó cập nhật implementation một lần tại package thay vì sửa mọi feature consumer.

## Tiêu chí nghiệm thu

- Consumer sạch cài một version và dùng public exports đã tài liệu hóa, không import internal path.
- Theme thứ hai đổi màu brand, font, radius, spacing, scheme và density chỉ qua token; không sửa component stylesheet.
- Mỗi Basic forward props/ref của native/primitive, có class contract ổn định, đạt kiểm tra keyboard/accessibility name.
- Field hiển thị thống nhất label, description, required, disabled, read-only, invalid, helper, server error; screen reader nhận đủ ID mô tả/lỗi.
- Kiểm thử form bao phủ untouched/touched/submit/revalidate, race async, focus lỗi đầu, server field errors, reset, pending và chống submit trùng.
- Kiểm thử NumberField/DecimalField bao phủ giá trị trung gian khi gõ, chính sách làm tròn, locale, canonical submit, giới hạn, empty/negative và caret.
- Kiểm tra responsive trên điện thoại/desktop, hai scheme/density, keyboard, high contrast và reduced motion.
- Package không import Solar, secret, API nghiệp vụ hay quy tắc phân quyền theo sản phẩm.

## Quản lý quyết định

Đây là baseline thiết kế đã được duyệt. Khi triển khai có thể hoàn thiện tên TypeScript/export path, miễn giữ nguyên contract. Thay đổi phạm vi platform, state ownership, số chiều theme, thời điểm validation, cách bảo toàn decimal hoặc chiều dependency cần cập nhật quyết định kiến trúc.
