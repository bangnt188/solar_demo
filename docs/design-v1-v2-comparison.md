# Đối chiếu design.md và design-v2.md

Ngày scan: 2026-10-01. “v1” là [v1 đã lưu lịch sử](../design-v1.md) hiện có; “v2” là [design-v2.md](../design-v2.md) mới. Hai bảng dưới giữ kết quả scan trước migration. Theo yêu cầu áp dụng đề xuất, [DESIGN.md](../DESIGN.md) hiện là visual canonical; v1/v2 chỉ là đầu vào lịch sử. Không đổi code hay PRODUCT.md. Working tree đã có nhiều thay đổi trước lượt này; những thay đổi đó chỉ là đầu vào scan, không được quy cho lượt document này.

## Bảng 1 — Cấu trúc, phạm vi và khả năng sử dụng

| Tiêu chí | v1 — design.md | v2 — design-v2.md | Ý nghĩa khi phân tích |
| --- | --- | --- | --- |
| Mục tiêu | Ownership và composition Atomic Design | Hệ thống visual rút từ source | Hai góc nhìn bổ sung; v2 không thay thế toàn bộ v1 |
| Phạm vi | Atoms → routes, content và behavior | Website Solar + package UI đang được dùng | Không nhầm toàn bộ library với theme của website |
| Cấu trúc | Goal, Layer contract, Component map, Content, Motion, Verification | 8 section chuẩn Overview → Do's and Don'ts | v2 dễ tra theo vai trò visual |
| Machine-readable | Không có YAML token layer | Colors, typography, rounded, spacing, components | Dễ đối chiếu token; chưa là runtime theme |
| Kiến trúc component | Bảng module và contract rõ | Dẫn tới v1 và docs architecture | Nên giữ kiến trúc làm tài liệu riêng nếu sau này chọn v2 |
| Identity | Brand được truyền qua props, ảnh chuẩn component | Mô tả palette, typography, shape quan sát được | Creative North Star và tên brand cho màu chưa được duyệt |
| Responsive | Mô tả một số behavior/nghiệm thu | Ghi container, grid, breakpoint và cascade cụ thể | Số đo là từ CSS, không phải browser PASS |
| State | Contract behavior chung | Hover/focus/invalid/disabled/loading theo CSS và React | Preview static không thay state tests |
| Preview data | Không có sidecar visual | Ban đầu là JSON v2 riêng, schemaVersion 2; hiện đã gộp vào `.impeccable/design.json` | Chỉ còn một sidecar canonical cho panel |
| Evidence | Có kết quả verification từ đợt refactor trước | Có đường dẫn source và giới hạn của scan này | Không chuyển PASS cũ thành chứng nhận working tree hiện tại |
| Authority | Tài liệu đang tồn tại | Bản phân tích mới | Chưa có quyết định promote hay migration |

## Bảng 2 — Quy tắc, khác biệt và bằng chứng hiện tại

| Chủ đề | v1 nói gì | v2 ghi nhận gì | Bằng chứng và kết luận |
| --- | --- | --- | --- |
| Primary | Chỉ nói semantic tokens | Xanh primary và hover của app hiện trùng light action package | `src/styles/tokens.css`; `packages/ui/styles/theme.css`: cùng giá trị nhưng khác namespace |
| Accent | Không ghi giá trị | Cam app, canva-orange và ui-accent khác nhau | Hai file token trên: khoảng trống tài liệu v1; chưa kết luận đây là lỗi palette |
| Nền và chữ | App typography theo token | App và package khác surface/text/border | `theme.css`, `tokens.css`, `layout.tsx`: cần quyết định theme mapping nếu muốn thống nhất |
| Font | Không nêu family/loading | Declared Plus Jakarta Sans, fallback Arial; chưa thấy loader | `tokens.css`, `base.css`, `components.css`, package reset; rendered font chưa xác minh |
| CTA/button | Ownership atoms/shared controls | Marketing pill vs shared control radius 0.5rem; API variant khác | `action-link.tsx`, `control.module.css`, `button.tsx`: khác vai trò, không tự đánh lỗi duplicate |
| Inputs | Form adapter dùng shared controls | CSS app vẫn override một số property control | `survey-form.tsx`, `.survey-fields` trong `components.css`: phải phân tích consumer cascade |
| Card | Library và card app trong migration | Package Card dùng radius control; Solar card lớn hơn | `card.module.css`, `components.css`: không lấy một bên làm preset cho toàn hệ thống |
| Hero/reveal timing | 760ms / 520ms | Token hiện là 2000ms / 2000ms và runtime đọc token | `tokens.css`, `motion-runtime.tsx`: drift tài liệu/source xác nhận bằng đọc nguồn |
| Motion distance | Target 32px desktop / 16px mobile | Target thường khớp; hero riêng 48px / 24px | `motion-runtime.tsx`: bổ sung scope, không coi target và hero là một |
| Services timeline | 0/12/24/36%, exit 89–100% | Keyframe cho media/list hiện 0/18/35/100%; không có keyframe exit đó trong stylesheet đã đọc | `services-section.tsx`, `components.css`: drift; không suy ra toàn bộ hành vi chỉ từ prose cũ |
| Mobile stage 2/4 | Giữ tint, radius, shadow | Vẫn giữ theo specificity của nth-child | `components.css` stage base + ≤760px: khớp, dù selector mobile chung đặt transparent/no-shadow |
| Reduced-motion | Có nhánh tĩnh | CSS và runtime vẫn có nhánh tương ứng; thêm data-reveal | `components.css`, `motion-runtime.tsx`, `src/animation/reveal.css`: chưa PASS runtime mọi consumer |
| Survey | Email draft, 5 required fields | Handler UI vẫn mailto, 5 required + note tùy chọn | `survey-form.tsx`: khớp; endpoint mới không chứng minh UI đã tích hợp |
| Dock | Phone/Zalo unavailable | RootLayout chỉ truyền surveyHref | `layout.tsx`, `conversion-dock.tsx`: khớp |
| Home reference | Ảnh controls là chuẩn package | Đã xem ảnh Trang Chủ; hero composition khác CSS hiện tại | `docs/Trang Chủ.png`, `.hero-inner` trong `components.css`: reference không phải current screenshot |
| Verification | Typecheck/build/export/browser đã PASS sau refactor | Lượt này chỉ kiểm định tài liệu, token refs, sidecar và file scope | Không chạy app hay công nhận toàn bộ working tree đã đạt production |

## Architecture Decision — đề xuất để bạn đánh giá

**Lý do:** giữ v1 làm bằng chứng ownership/contracts và dùng v2 để phân tích visual giúp tránh mất thông tin kiến trúc khi chuyển format. V2 chưa có quyền tự thay token hay sửa drift.

**Trade-off:** hai bản dễ lệch nếu cùng được dùng làm authority. Nếu duyệt v2, chọn một tài liệu visual canonical, chuyển phần architecture của v1 sang docs và cập nhật link một lần. Tránh duy trì hai nguồn visual song song lâu dài.

**Validate security / threat model ngắn:** artifact mới chỉ chứa đường dẫn source, token và snippet tĩnh; không nhúng credential, dữ liệu lead hay thực thi input người dùng. Sidecar không có script, event handler hoặc resource bên ngoài. Preview không chứng minh form backend, CSP, dữ liệu cá nhân hay accessibility đã an toàn production; các contract đó cần review riêng khi triển khai thay đổi tương ứng.

**Migration path nếu duyệt:** xác nhận qualitative language → thống nhất scope và theme mapping → xử lý drift tài liệu theo behavior đã quyết định → chọn DESIGN.md canonical cùng `.impeccable/design.json` → lưu v1 làm lịch sử và link architecture → kiểm chứng browser cho các surface liên quan. Phần migration tài liệu đã được áp dụng theo yêu cầu tiếp theo của người dùng; trạng thái và giới hạn bên dưới.

## Kiểm định của lượt document

- Frontmatter có đúng nhóm token; component refs resolve; thứ tự 8 section đúng.
- Các giá trị màu/spacing app được đối chiếu với `src/styles/tokens.css`; UI palette được đối chiếu light theme package.
- Sidecar JSON parse được; snippet dùng class `ds-*`, không cần React hoặc Tailwind, các state được đưa vào CSS ở nơi có trong source.
- Tonal ramps trong sidecar là mô phỏng OKLCH phục vụ preview; không phải palette brand được duyệt hay token mới.
- `design.md` giữ nguyên SHA256 `21d8822aec0653303bd2ae264a87568b31027d77d4a5c48583c79fbac322d183`.
- Không chạy build/test ứng dụng vì chỉ thêm tài liệu và preview data; không có browser verification trong lượt này.


## Quyết định đã áp dụng — 2026-10-01

**Hiểu:** v1 chủ yếu mô tả ownership/composition; v2 cung cấp token và visual từ source. Người dùng đã yêu cầu áp dụng đề xuất và chọn tinh thần “rõ ràng, tin cậy, gần gũi”.

**Thiết kế:** `DESIGN.md` là nguồn visual duy nhất; `.impeccable/design.json` là sidecar chính. `docs/ui-composition.md` giữ phần composition của v1 và cập nhật motion theo source. Root `design-v1.md` bảo toàn nguyên byte v1; `design-v2.md` là snapshot lịch sử; dữ liệu sidecar v2 đã được gộp vào `.impeccable/design.json`, bỏ bản JSON riêng. README và docs index đã trỏ tới tài liệu đúng vai trò.

**Theme decision / trade-off:** giữ namespace app/package và palette đang dùng theo consumer. Điều này bảo toàn visual trong đợt document, đồng thời còn chi phí kiểm tra cascade và theme mapping. Thay palette mặc định package sẽ ảnh hưởng sản phẩm khác; nếu cần đồng nhất sau này, map semantic token tại theme Solar theo kiến trúc đã có, rồi nghiệm thu cả scheme/state/portal. Đợt này chỉ chuẩn hóa tài liệu, không triển khai alias hay đổi UI.

**Validate security:** sidecar chỉ có snippet tĩnh có phạm vi class; không có script, event handler, credential hay dữ liệu khách hàng. Không dùng metadata/nội dung CMS để chèn CSS runtime. Contracts validation/quyền vẫn thuộc application/server; không suy ra production readiness từ preview hoặc browser smoke.

**Migration đã thực hiện:** canonical + sidecar → snapshot lịch sử → tách composition → cập nhật link và đánh dấu animation-plan là lịch sử → browser smoke hai viewport, FAQ/navigation/reduced-motion. Ngôn ngữ thương hiệu bổ sung chỉ được chốt theo phản hồi người dùng; không sửa tagline/claim.

**Kết quả và giới hạn:** xem [browser evidence](design-browser-evidence.md). Snapshot v1 có SHA256 không đổi. Chưa chứng nhận toàn bộ light/dark, disabled/invalid/loading, contrast hoặc performance production; các kết quả build/browser cũ trong v1 vẫn là lịch sử.

**Bổ sung sau browser:** H1 render Arial; default-motion mobile 390px có scrollWidth 424px, reduced-motion về 390px. Featured projects hiện dùng ExpandingGallery nên canonical đã phân biệt với project-grid legacy. FAQ toggle bằng Enter đã xác nhận true → false → true. Các kết quả này cập nhật bản canonical/evidence; không viết lại snapshot v2 thành kết quả nghiệm thu.

**Ngôn ngữ đã xác nhận:** tinh thần “rõ ràng, tin cậy, gần gũi”, Creative North Star “Năng lượng gần nhà”. Đây là chỉ dẫn visual, không thay slogan hay nội dung kinh doanh. Người dùng cũng đã chọn “xanh tin cậy, cam ấm; nền phân lớp và shadow nhẹ; control rõ ràng, dễ thao tác”. Tên token vẫn giữ vai trò hiện có; chưa đặt anti-reference mới.

**Hợp nhất sidecar theo yêu cầu:** chỉ giữ `.impeccable/design.json`. Toàn bộ color metadata, typography metadata, shadows, motion, breakpoints và component của JSON v2 được bảo toàn trong bản canonical; giữ narrative đã duyệt, breakpoint gallery và sửa hover border của bản mới. Không tác động `.impeccable/config.local.json`.
