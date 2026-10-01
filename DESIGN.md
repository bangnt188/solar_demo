---
name: "Lúa Xanh Đồng Bằng"
description: "Hệ thống visual chuẩn cho website Solar và các control package được tích hợp."
colors:
  primary: "#004AAD"
  primary-hover: "#003F94"
  primary-dark: "#003477"
  primary-light: "#EBF2FA"
  secondary: "#E89C25"
  secondary-hover: "#CC7A00"
  secondary-light: "#FFF7ED"
  secondary-subtle: "#fff8ec"
  text-primary: "#1E293B"
  text-secondary: "#64748B"
  border: "#E2E8F0"
  surface: "#F8FAFC"
  background: "#FFFFFF"
  success: "#16A34A"
  success-surface: "#E9F6EE"
  error: "#8a1c13"
  error-surface: "#fcecea"
  canva-orange: "#E68A00"
  ui-accent: "#febb3c"
  ui-surface: "#f2f3ff"
  ui-text-primary: "#131b2e"
  ui-text-secondary: "#434653"
  ui-border: "#c3c6d5"
  ui-error: "#b42318"
  ui-disabled: "#626670"
  ui-disabled-surface: "#e9e9ed"
typography:
  body:
    fontFamily: "\"Plus Jakarta Sans\", Arial, Helvetica, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  display:
    fontFamily: "\"Plus Jakarta Sans\", Arial, Helvetica, sans-serif"
    fontWeight: 900
    lineHeight: 1.16
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "\"Plus Jakarta Sans\", Arial, Helvetica, sans-serif"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "\"Plus Jakarta Sans\", Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
  label:
    fontFamily: "\"Plus Jakarta Sans\", Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
rounded:
  card: "1.125rem"
  control: "0.5rem"
  action-pill: "9999px"
  chip: "999px"
  media: "20px"
  faq: "14px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  action-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.action-pill}"
    padding: "12px 28px"
  action-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.action-pill}"
    padding: "12px 28px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
  button-accent:
    backgroundColor: "{colors.ui-accent}"
    textColor: "{colors.ui-text-primary}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ui-text-primary}"
    rounded: "{rounded.control}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
  button-quiet:
    backgroundColor: "{colors.ui-surface}"
    textColor: "{colors.ui-text-primary}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ui-text-primary}"
    rounded: "{rounded.control}"
  card:
    backgroundColor: "{colors.ui-surface}"
    textColor: "{colors.ui-text-primary}"
    rounded: "{rounded.control}"
    padding: "{spacing.lg}"
---

# Design System: Lúa Xanh Đồng Bằng

## Overview

**Creative North Star: "Năng lượng gần nhà"**

Tài liệu visual canonical, được chọn theo yêu cầu áp dụng đề xuất đối chiếu ngày 2026-10-01. Phạm vi là website Solar ở root và các control `@solar/ui` được tích hợp. Ownership/composition nằm trong [UI composition](docs/ui-composition.md); kiến trúc thư viện nằm trong [UI system architecture](docs/ui-system-architecture.md). [V1](design-v1.md) và [snapshot v2](design-v2.md) chỉ là lịch sử, không phải nguồn visual song song.

Ngôn ngữ visual đã được người dùng chọn: **xanh tin cậy, cam ấm; nền phân lớp và shadow nhẹ; control rõ ràng, dễ thao tác**. Hệ thống hiện có dùng tiêu đề xanh, nền trắng/xám nhạt, điểm nhấn cam, hình ảnh điện mặt trời và card bo góc. Mật độ thay đổi theo nhóm nội dung: hero thoáng hơn, danh sách giải pháp/dự án tập trung hơn. Người dùng đã chọn tinh thần **rõ ràng, tin cậy, gần gũi**. Diễn giải này hướng dẫn cách áp dụng identity hiện có; không thay tagline, logo hay copy sản phẩm. Hình ảnh định hướng “Năng lượng gần nhà” đã được người dùng chọn. Anti-reference chưa chốt; tên token vẫn mô tả vai trò, không tự đặt tên màu thương hiệu.

**Key Characteristics:**

- Tiêu đề xanh và các mặt phẳng trung tính phân cấp nội dung.
- CTA marketing bo tròn dạng viên; control dùng chung bo góc nhỏ hơn.
- Grid giảm số cột theo màn hình, navigation chuyển sang disclosure trên mobile.
- Layer nền, border và shadow cùng tạo chiều sâu; không phải hệ thống phẳng hoàn toàn.

**Evidence boundary:** đọc `src/styles/{tokens,base,components}.css`, `src/app/layout.tsx`, component và CSS Modules trong `packages/ui`, `packages/ui/styles/theme.css`, `MotionRuntime` và `SurveyForm`. Đã xem `docs/Trang Chủ.png`; ảnh này là tham chiếu thiết kế, không phải ảnh chụp build hiện tại. Ví dụ hero trong ảnh và hero grid trong code khác composition. Đã đo computed styles và rendered font trong Chromium local; giới hạn và kết quả ở [browser evidence](docs/design-browser-evidence.md). Chưa chứng nhận contrast toàn bộ state/theme hoặc production performance. Frontmatter là baseline visual của tài liệu; CSS là nguồn triển khai. Khi sửa design phải cập nhật cả tài liệu và nguồn có chủ đích, không sinh runtime theme thứ hai. Định dạng dựa trên [DESIGN.md format](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md).

## Colors

Xanh dẫn dắt hành động và tiêu đề; cam nhấn các vai trò hỗ trợ; nền sáng giữ thông tin dễ phân nhóm. Tên dưới đây mô tả vai trò; tên thương hiệu riêng cho màu chưa được chốt. Giá trị chính xác nằm trong frontmatter.

### Primary

- `primary`, `primary-hover`, `primary-dark`: xanh hành động, hover và tiêu đề đậm trên website.
- `primary-light`: nền nhấn nhạt cho hover outline và một số vùng navigation.
- Nút package dùng `--ui-color-action`; light theme hiện trùng giá trị primary/hover của app nhưng là namespace riêng.

### Secondary

- `secondary`, `secondary-hover`, `secondary-light`, `secondary-subtle`: cam và nền cam nhạt trong website.
- `canva-orange`: cam dùng ở icon và liên kết giải pháp; khác `secondary`.
- `ui-accent`: vàng cam của package, khác cam app. Không tự đồng nhất các giá trị này.

### Neutral

- `background`: trắng; `surface`: nền xám xanh rất nhạt; `border`: phân ranh vùng nội dung.
- `text-primary`, `text-secondary`: chữ chính và chữ hỗ trợ trong app.
- `ui-surface`, `ui-text-primary`, `ui-text-secondary`, `ui-border`: light theme riêng của package; tương ứng với Card, field và các control.
- Các surface container trong CSS là những nấc nền trung tính hiện có, không phải toàn bộ một color ramp đã chuẩn hóa.

### Feedback

App và package có token success/error riêng. Frontmatter giữ error app và `ui-error` riêng để phản ánh trạng thái invalid. Màu trạng thái cần đi cùng nhãn/semantics của component; baseline này chưa chứng nhận WCAG contrast toàn bộ state/theme.

### Theme scope đã chọn

Giữ palette hiện có theo vai trò: app Solar sở hữu section/chrome/marketing; package giữ các mặc định light/comfortable của control. Đây là mapping thực tế được tài liệu hóa, chưa triển khai alias màu mới hoặc đổi mặc định library.

| Vai trò | App Solar | Shared UI đang tích hợp | Quyết định |
| --- | --- | --- | --- |
| Action/hover | `primary` / `primary-hover` | `--ui-color-action` / `--ui-color-action-hover` | Hiện trùng giá trị; không đổi namespace |
| Accent | `secondary`, `canva-orange` | `--ui-color-accent` | Giữ khác biệt theo consumer, không map đồng loạt |
| Surface/text/border | Token `--color-*` của app | Token `--ui-color-*` của package | Xác minh cascade tại consumer; form có override app |
| Font | `--font-body` | Control dùng font kế thừa; reset package có `--ui-font-body` | Body app có ưu tiên; font tải thực tế xem Typography |
| Scheme/density | Website chưa công bố dark/compact | Package hỗ trợ light/dark, comfortable/compact | Baseline site này chỉ nghiệm thu light/default density |

Nếu thống nhất theme ở một thay đổi tương lai, Solar sẽ map semantic token trong app theme; không đổi palette mặc định package cho mọi sản phẩm. Contract migration/alias/portal xem UI system architecture.

**The Namespace Rule.** Khi mô tả control package, truy về `--ui-*`; khi mô tả section Solar, truy về token app. Không suy ra rằng cùng tên vai trò có nghĩa cùng giá trị.

## Typography

**Declared body font:** Plus Jakarta Sans, sau đó Arial, Helvetica, sans-serif. `base.css` đặt body size/leading; rule body ở `components.css` đổi family sang `--font-body`. Package reset ở CSS layer có family Arial; body app không nằm trong layer nên rule app có ưu tiên cao hơn.

Không tìm thấy `@font-face`, `next/font` hay URL Google Fonts trong nguồn đã quét. Chromium local đã xác nhận H1 dùng platform font Arial-BoldMT ở cả 1440px và 390px. `document.fonts.check()` trả true nhưng không chứng minh font tồn tại; dùng CDP platform-font evidence thay cho kết luận đó. Plus Jakarta Sans là family khai báo, Arial là font render đã quan sát trên máy kiểm tra; không suy ra cùng font trên mọi thiết bị.

### Hierarchy

- **Display:** hero dùng `clamp(34px, 4.2vw, 50px)`, weight 900, leading 1.16; ở ≤700px `.hero h1` xuống 32px. Kích thước fluid được ghi trong prose thay vì ép thành dimension cố định trong YAML.
- **Headline:** section heading dùng `clamp(24px, 3.2vw, 34px)`, weight 800, leading 1.25; ở ≤700px xuống 26px.
- **Title:** service-stage heading dùng token 2xl, weight 800, leading 1.2; xuống token xl ở ≤760px.
- **Body:** mặc định 16px/1.55. Hero description có cỡ fluid 14–15px và leading 1.65; không áp một size cho mọi paragraph.
- **Label:** token sm là nền tảng; package field label dùng md/600 và button dùng font kế thừa/700. Vai trò label không có một weight duy nhất toàn hệ thống.

Các token size sm/md/lg/xl/2xl/3xl là 0.875/1/1.125/1.25/1.5/2rem. Giữ giá trị và consumer hiện có; không suy ra tỷ lệ scale thống nhất cho các literal riêng.

## Layout

Container desktop là `min(1200px, calc(100% - 48px))`. Ở ≤900px là `min(100% - 36px, 700px)`; ≤480px là `calc(100% - 32px)`. Section phổ biến có padding dọc 60px, còn 50px ở ≤700px; các section riêng có ngoại lệ.

Hero dùng grid 1.15fr/1fr, gap 48px; chuyển dọc ở ≤900px. Grid giải pháp dùng 3 cột, gap 26px; xuống 2 cột/gap 20px ở ≤900px và 1 cột ở ≤480px. `.project-grid` legacy có cùng thang cột, nhưng dự án tiêu biểu trang chủ hiện render `ProjectGallery`/`ExpandingGallery`: một hàng panel mở rộng, activeRatio 4, chuyển dọc ở ≤720px với chiều cao 36rem. Không dùng rule grid legacy để mô tả gallery hiện hành. Form khảo sát có 2 cột rồi 1 cột ở ≤480px. Trang dịch vụ dùng bố cục copy–ảnh–details, chuyển thành một cột ở ≤760px.

Trang `/du-an` nhóm thẻ theo ba tab có số dự án: hộ gia đình, hộ kinh doanh vừa và nhỏ, doanh nghiệp & công nghiệp. Các danh mục nguồn được ánh xạ tường minh; cơ sở sản xuất và showroom thuộc nhóm doanh nghiệp & công nghiệp. Lưới có ba cột desktop, hai cột ở ≤900px và một cột ở ≤700px; nhóm chỉ có một dự án dùng bố cục ngang rồi xếp dọc trên mobile.

Spacing frontmatter giữ thang xs/sm/md/lg/xl của app. Code hiện tại còn các khoảng cách riêng như 20/26/34/60/70px; không mô tả toàn hệ thống là strict 8px grid. Breakpoint 720px của gallery, 42rem của package field và 1024px của desktop scrolling có vai trò riêng, không đồng nghĩa breakpoint navigation.

**Giới hạn responsive đã quan sát:** ở 390px, trang chủ có scrollWidth 424px cả sau khi đợi 2.5 giây; reduced-motion cho scrollWidth 390px. Desktop 1440px không tràn trong các lần đo. Chưa xác định root cause; không coi đây là mobile PASS và không áp `overflow-x: hidden` để che vấn đề. Evidence ghi kết quả để xử lý bằng một quyết định animation/layout riêng.

## Elevation & Depth

Hệ thống kết hợp nền phân tầng, border và shadow. Card giải pháp/dự án có shadow nghỉ; hover của một số card tăng shadow và dịch chuyển. Navigation overlay có shadow, mobile thêm nền pha màu và blur. Đây là mô tả hiệu ứng đang có, không phải chính sách mới áp cho mọi component.

### Shadow Vocabulary

- **Solution rest:** `0 6px 20px rgba(0, 0, 0, 0.05)`.
- **Solution active:** `0 16px 32px rgba(0, 74, 173, 0.12)`.
- **Package overlay/raised card:** `0 0.25rem 1rem rgb(15 23 42 / 0.12)`.
- **Even service stage:** `0 8px 22px #131b2e12`.

### Motion attached to depth

`MotionRuntime` đọc hero/reveal duration từ token, hiện đều 2000ms. Target thường dịch 32px desktop/16px ở ≤700px; hero có khoảng dịch riêng 48px/24px. Hover card dùng 420ms với ease `cubic-bezier(.16, 1, .3, 1)`; fine-pointer hover có lift -10px cho các selector tương ứng. Một số hover legacy khác vẫn tồn tại; không coi -10px là invariant mọi input/card.

Có thêm hệ `data-reveal` trong `src/animation`, được import vào globals và có timing riêng. Không trộn duration của hai hệ. Reduced-motion trên trang chủ local đã cho scroll-behavior auto, services animation none và không có animation đang chạy tại thời điểm đo; chưa kiểm thử mọi consumer. Với dịch vụ trang chủ, keyframe hiện tại ở 0/18/35/100%, khác mô tả 0/12/24/36% và exit 89–100% của v1.

## Shapes

Card app phổ biến bo theo token card; control package và app dùng token control; CTA marketing dạng viên. Media hero bo 20px, FAQ bo 14px, Badge package dạng pill. Đây là nhiều vai trò hình dạng có chủ đích, không phải một radius duy nhất cho tất cả.

Bước dịch vụ chẵn giữ nền, radius và shadow cả mobile: selector `.service-stage:nth-child(even)` có specificity cao hơn `.service-stage` trong media query. Rule mobile đặt transparent/zero-radius/no-shadow cho selector chung không tự xóa style của bước chẵn.

## Components

### Buttons

**CTA marketing:** `ActionLink` có primary/outline/plain. Primary/outline có border 2px, height tối thiểu 48px, padding 12px 28px, weight 800, cỡ 14.5px, dạng viên. Hover đổi nền và lift -1px. Ở ≤480px `.button` đổi padding 9px 13px/cỡ sm; hero có rule width riêng.

**Shared controls:** `@solar/ui` Button có primary/secondary/accent/outline/quiet và sm/md/lg. Mặc định md cao tối thiểu 2.75rem, padding ngang md, weight 700; không phải CTA viên. sm cao 2.25rem, lg 3rem; pointer coarse nâng min-size theo rule package. Focus ring 3px/offset 2px; disabled và loading có semantics riêng. `secondary` của package là nền trắng, `accent` mới là vàng cam.

### Cards / Containers

Card package mặc định nền `ui-surface`, padding lg, radius control và border `ui-border`; variant raised dùng surface-raised và overlay shadow. Card giải pháp/dự án thuộc composition Solar có radius lớn hơn và media riêng. Không mô tả package Card bằng style card app.

### Inputs / Fields

Package field có label, mô tả/error và control CSS Module; min-size theo control token, padding sm/md, focus ring 3px/offset 2px, invalid đổi border sang error. Form Solar thêm selector `.survey-fields input/select/textarea` có specificity cao hơn class control cho một số property, gồm padding 12px 14px, margin-top 8px, border/nền/chữ app. Phải xem cascade consumer để quyết định field thực tế; preview primitive không đại diện toàn bộ form.

Form đang dùng shared form adapters và nút package. Handler hiện vẫn mở `mailto:`; việc có endpoint trong working tree không chứng minh form UI đã nối endpoint.

### Chips

Badge package cao tối thiểu 1.5rem, padding ngang md, weight 600, cỡ sm, bo pill; action/success/warning/error dùng nền pha từ tone. Badge hiển thị trạng thái, không tự suy ra là bộ lọc tương tác.

### Navigation

Header sticky, desktop có submenu mở khi hover/focus, đóng theo trạng thái scroll. Ở ≤900px chuyển sang native disclosure; link mobile cao tối thiểu 44px, submenu 40px. CTA navigation dạng viên. Mobile overlay giới hạn chiều cao và scroll; giữ trạng thái keyboard focus hữu hình.

### Featured project gallery

Home hiện dùng `ProjectGallery` composition + `@solar/ui` ExpandingGallery, default active item đầu tiên, activeRatio 4 và collapseOnLeave. Panel có media cover, lớp gradient và caption của item active; gallery radius theo control token. Package style dùng duration expand 600ms, caption 440ms, media transform 760ms; reduced-motion loại transition/zoom. Đây là pattern đã thấy trong source và screenshot, chưa kiểm thử toàn bộ API tương tác/keyboard của gallery.

### FAQ, conversion dock and service stages

FAQ dùng details/summary, ký hiệu +/− và nền nhạt. Dock có action Zalo/phone/survey; RootLayout hiện chỉ truyền surveyHref nên hai destination còn lại unavailable. Timeline dịch vụ là pattern riêng của trang; đường timeline chuyển từ giữa sang gutter mobile, không áp thành layout toàn site.

## Do's and Don'ts

### Do:

- **Do** truy token từ đúng namespace và xác minh CSS của consumer khi sử dụng package.
- **Do** giữ phân biệt CTA marketing dạng viên và button/control package.
- **Do** đối chiếu desktop/mobile và hover/focus/invalid/disabled trước khi xác nhận style; các kết quả local đã đo không thay nghiệm thu đầy đủ.
- **Do** giữ reduced-motion, disclosure native và nhãn trường trong tài liệu component.
- **Do** dùng [UI composition](docs/ui-composition.md), [UI architecture](docs/ui-system-architecture.md) và [CSS conventions](docs/css-conventions.md) để tra ownership và contracts.

### Don't:

- **Don't** coi font-family khai báo là bằng chứng font đã tải.
- **Don't** biến snapshot working tree hoặc ảnh tham chiếu thành kết quả nghiệm thu trình duyệt.
- **Don't** mở rộng literal hoặc hiệu ứng của một section thành token chuẩn toàn hệ thống.
- **Don't** tự tạo testimonial, destination liên hệ hoặc thông báo gửi form thành công khi chưa có bằng chứng.
- **Don't** dùng HTML/CSS preview để suy ra contract React, theme tối, security hoặc accessibility đã kiểm thử.
