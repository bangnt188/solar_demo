# Plan kiến trúc animation

**Trạng thái: đã triển khai trên các route công khai.** Phần 1 ghi baseline **trước** thay đổi; phần 8 ghi kết quả và giới hạn kiểm chứng. Giữ bố cục, nội dung, URL và kiến trúc Atomic hiện tại. Mode: Persuade. Mục tiêu là dẫn mắt từ thông tin đến hình ảnh mà không bắt khách chờ để đọc hoặc bấm CTA.

## 1. Cơ sở đã kiểm tra trước triển khai

- `HomeScreen` ghép Hero → Partners → Services → Solutions → WhyUs → Projects → Testimonials → Equipment → FAQ → Contact. Testimonials đang rỗng; không tự thêm dữ liệu hoặc carousel.
- `partners-section.tsx` đang hiển thị 9 tên thương hiệu dạng text, chưa có asset logo thật và chưa chạy ngang. Không tự tạo logo hoặc link đối tác.
- `components.css:43` đã có shadow dưới card; sẽ tinh chỉnh shadow hiện hữu, không chồng thêm nhiều lớp.
- `base.css:2` có `scroll-behavior: smooth`: chỉ thị này không giới hạn tốc độ wheel/touch.
- Browser hiện tại có **22 ảnh, 21 ảnh `loading="lazy"`**, hero không lazy. Các ảnh dùng lại hai file; số thẻ lazy không đồng nghĩa tiết kiệm 21 lượt tải ảnh riêng.
- Hero đang dùng `priority`; tài liệu Next 16.3.6 trong repo đánh dấu prop này deprecated. Khi triển khai chuyển sang chính sách tải sớm ở mục 5, không lazy toàn bộ ảnh.
- Đã mở server hiện hữu tại `http://127.0.0.1:3000/solar_demo/`, kiểm tra viewport 320/390/768/1024/1440px: `scrollWidth === innerWidth` ở baseline. Services một cột ở 320/390px, hai cột từ 768px; cần giảm biên độ theo bố cục thực tế, không chỉ gọi chung “mobile”.
- **Lỗi nền quan sát được tại 390×844:** dock liên hệ cao khoảng 237px, SVG khảo sát khoảng 192px, che CTA hero. `conversion-dock.tsx` hiện có SVG không khai báo kích thước; CSS hiện chỉ còn nhóm rule dock cũ và chưa có rule kích thước `.dock-action svg`. Phải sửa sizing/touch targets trước khi animate dock. Đây là ghi nhận tại thời điểm kiểm tra, không ghi đè thay đổi đang làm của người dùng.
- Rule reduced-motion hiện tại ép mọi animation về `.01ms`; phải thay bằng trạng thái giảm chuyển động rõ ràng để marquee không chạy vòng cực nhanh.

## 2. Ngôn ngữ chuyển động

**Điểm nhấn:** hero với chữ từ trái, hình từ phải, cùng giảm tốc để gặp nhau ở bố cục cuối. Services tiếp nối quan hệ chữ–hình bằng tiến độ cuộn có thể đảo ngược. Các section sau yên hơn, không lặp hiệu ứng bay ngang khắp trang.

Thông số sau là giá trị khởi điểm để nghiệm thu, không phải số đo hiệu năng:

| Token | Giá trị đề xuất | Dùng cho |
| --- | --- | --- |
| `--motion-ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Đi vào, hover lift, kết thúc mềm; không bounce |
| `--motion-fast` | 160ms | Màu sắc/phản hồi nhấn |
| `--motion-medium` | 280ms | Trả về trạng thái nghỉ |
| `--motion-reveal` | 2s | Các reveal theo scroll |
| `--motion-hero` | 2s | Entrance hero từ hai mép viewport |
| `--motion-distance` | Cả viewport + kích thước phần tử | Reveal bắt đầu ngoài màn hình |
| `--motion-stagger` | 70ms, tổng delay tối đa 210ms | Chỉ nhóm card cùng xuất hiện |
| `--motion-card-lift` | -10px | Card giải pháp trên thiết bị có hover |
| `--motion-brand-lift` | -5px | Tên/logo đối tác được hover |

Token thêm vào `src/styles/tokens.css`; selector/keyframe đặt theo section trong `src/styles/components.css`. Không tạo hệ token hoặc CSS framework song song.

## 3. Kiến trúc triển khai

Ưu tiên **CSS transitions/keyframes + IntersectionObserver + một bộ cập nhật scroll dùng requestAnimationFrame**. Không cần Framer Motion/GSAP cho bộ hiệu ứng này. Nếu duyệt làm mượt wheel desktop, chỉ thêm `lenis`, tải động đúng thiết bị; không tự viết một scroll engine.

```text
src/app/(public)/layout.tsx                 # mới: mount runtime chỉ cho public routes
src/components/motion/motion-runtime.tsx   # mới: client lifecycle, reveal, services scrub, scroll driver
src/components/organisms/partners-marquee.tsx # mới: vòng chạy đối tác + nút dừng/chạy
src/components/sections/*                 # giữ server rendering, thêm điểm gắn motion
src/components/molecules/faq-disclosure.tsx # giữ details/summary
src/styles/tokens.css                      # motion + elevation tokens
src/styles/components.css                  # hiệu ứng theo section, media/reduced-motion
```

### Interface và quyền sở hữu

- `<MotionRuntime />` là module phía client không render nội dung hoặc thêm wrapper transform quanh toàn trang. Mount một lần trong layout public, không áp dụng cho admin/API tương lai.
- Section giữ dữ liệu/HTML phía server; runtime tìm các phần tử đã khai báo trong `main`, không biến `HomeScreen` thành Client Component.
- Interface khai báo nhỏ: `data-motion="left|right|up|fade"`, `data-motion-order` cho nhóm có stagger; `data-motion-scrub="service"` cho **wrapper hàng không transform**. Child ảnh/chữ có vai trò riêng để áp transform. Không thiết kế một DSL timeline, registry plugin hoặc EventBus.
- Reveal là one-shot cho mỗi lần mount route. Sau khi hoàn tất bỏ observer cho phần tử. Khi Back/Forward/anchor đưa một phần tử thẳng vào viewport, hiển thị ngay thay vì làm nó biến mất rồi phát lại.
- Services dùng tọa độ wrapper tĩnh, không đo vị trí của child đang transform, tránh vòng phản hồi làm rung. Một phép đọc layout cho mỗi hàng đang hoạt động; gom đọc trước, ghi CSS variables sau. Không `setState` theo từng frame.
- Runtime sở hữu listener scroll/resize/media-query, observer và animation handles. Dọn sạch khi đổi route/unmount; hủy inertia cũ trước điều hướng. Async import hoàn thành sau unmount không được tạo instance.
- Một scheduler JS: desktop gọi `lenis.raf(time)` và cập nhật services trong cùng vòng nếu bật smoothing; native path chỉ lên lịch khi scroll/resize. Khi không có việc, không để vòng dịch vụ chạy vô hạn; tab ẩn dừng work. Marquee dùng CSS animation, không tạo RAF riêng.
- Không cho entrance và hover cùng ghi đè một `transform`: reveal ngoài/hover trong hoặc tách `translate` và `transform` với quyền sở hữu rõ ràng. Không transform ancestor của header/dock fixed.
- HTML/CSS mặc định đọc được. JS tải chậm, lỗi hoặc bị tắt vẫn thấy nội dung, link và ảnh; chỉ khởi tạo trạng thái reveal cho phần tử còn ngoài viewport. Focus vào vùng đang reveal phải đưa về trạng thái đọc được ngay.

## 4. Plan theo section

### 4.1. Vào trang / Hero

- `.hero-copy`: translateX -40px → 0; `.hero-visual`: +48px → 0, trong khoảng 760ms. Chữ và ảnh vào cùng nhịp; CTA chậm hơn tối đa 100ms, không khóa tương tác.
- H1, nội dung quan trọng và ảnh LCP **không bắt đầu ở opacity 0**, không đợi ảnh tải xong hoặc hydration mới hiện. Có thể tăng opacity nhẹ từ .9 → 1; phần phụ đi từ .65 → 1. Hiệu ứng “từ từ hiện ra” không được đổi thành màn hình trống đầu trang.
- Không split từng ký tự, không spinner mở màn, không blur toàn ảnh. `hero-bottom` giữ tĩnh.
- Mobile bố cục dọc: vẫn giữ hướng trái/phải nhưng chỉ 12–16px, 420–500ms, không kéo hình ra ngoài màn hình. Không làm hero chạy lại khi đổi orientation hoặc quay về lịch sử.

### 4.2. Đối tác tự cuộn ngang

- Từ phải sang trái, tuyến tính; khởi điểm **28px/giây desktop, 20px/giây mobile**. Tốc độ theo pixel, không đặt một duration cố định cho mọi độ dài danh sách.
- Một nhóm gốc và bản sao trình bày đủ lấp viewport; hai nhóm có chiều rộng bằng nhau, tính đúng cả gap tại mối nối. `ResizeObserver` cập nhật quãng đường/duration khi đổi màn hình hoặc font; không reset về đầu gây giật.
- Chỉ chạy khi đo được chiều rộng, nằm trong viewport và tab đang mở. 0–1 thương hiệu dùng danh sách tĩnh. SSR/no-JS hiển thị danh sách gốc; bản sao không hiện trong fallback.
- Hover vào một thương hiệu: **dừng cả track tại vị trí hiện tại**, thương hiệu đó nâng 5px trong 220ms và tăng độ tương phản/đổi màu sang token thương hiệu. Không dùng glow/filter lớn, không làm màu thật của logo sai khi sau này có asset.
- Rời hover tiếp tục từ đúng vị trí, không khởi động lại. Focus vào link thương hiệu thật cũng dừng nếu sau này có link; không biến text hiện tại thành button giả chỉ để nhận focus.
- Có nút **Dừng chuyển động / Tiếp tục** dùng được bằng bàn phím và touch. Dừng thủ công có ưu tiên hơn hover/visibility; ra vào viewport không tự bật lại.
- Mobile không dựa vào hover: chạm/giữ tạm dừng, kết thúc/cancel trả đúng trạng thái trước đó; nút pause cho phép dừng lâu dài. Không `preventDefault()` thao tác cuộn dọc, không tự chế drag gesture khi chưa cần.
- Bản sao `aria-hidden`, không có điểm tab/ID trùng; danh sách đọc bởi screen reader chỉ một lần. Với reduced-motion: bỏ autoplay và lift, hiển thị danh sách tĩnh dễ đọc.

### 4.3. “Chúng tôi làm gì” theo scroll, có đảo chiều

**Cách hiểu trong plan:** cuộn xuống thì ảnh/chữ xuất hiện **từ hai bên vào vị trí bố cục**; cuộn lên qua cùng đoạn thì quay trở lại hai bên. Không hiểu là đẩy nội dung đang đọc bay khỏi màn hình khi người dùng tiếp tục cuộn xuống.

- Mỗi `.service-row` có tiến độ độc lập. Gọi `t` là tọa độ top của wrapper hàng và `H` là chiều cao viewport: `p = clamp((0.90H - t) / (0.90H - 0.45H), 0, 1)`.
- Ảnh: `x = -56 × (1 - p)` px; chữ: `x = +56 × (1 - p)` px. Từ mốc top hàng ở 90% viewport tới 45%, hai phía đi về 0; qua đó giữ yên để đọc.
- Scroll lên đảo tự nhiên qua cùng hàm `p`, không dùng boolean “scrollUp/scrollDown” bật/tắt animation gây giật khi đổi hướng nhỏ.
- Opacity chỉ từ .7 → 1, không giấu chữ hoàn toàn; không pin section, không kéo dài trang bằng spacer, không scale cả hàng. Không thêm CSS transition vào giá trị transform được scrub mỗi frame.
- Mobile một cột: giữ scrub đảo chiều nhưng ±12–16px; hai cột hẹp khoảng 768px giới hạn ±24px. Reduced-motion trả về `x=0`, opacity 1.
- Đảm bảo phần translate không tạo thanh cuộn ngang; clip tại vùng trang trí của section, không cắt outline/CTA hoặc shadow cần thấy.

### 4.4. Giải pháp theo nhóm khách hàng

- Giữ và chuẩn hóa shadow sẵn có thành bóng lệch xuống, mềm. Card nghỉ không nhảy; hover nâng **10px trong 420ms**, trở lại trong 280ms.
- Áp dụng với `(hover: hover) and (pointer: fine)`. `focus-within` có tín hiệu tương đương để người dùng bàn phím biết card đang tương tác; không xóa focus outline.
- Shadow có thể đổi nhẹ giữa hai mức cố định trên một card; không tăng blur cực lớn hoặc xếp nhiều lớp bóng. Đo repaint; nếu đắt, crossfade lớp shadow thay vì nội suy blur mỗi frame.
- Entrance card chỉ một lần, từ dưới 20px; stagger tối đa 210ms cho cả nhóm. Không làm entrance và hover tranh transform.
- Mobile: không lift trên tap và không để sticky-hover; giữ bóng nền nhẹ. Nhấn link phản hồi màu trong 120–160ms, không trì hoãn điều hướng. Không tự biến cả card thành link vì hiện card có CTA riêng.

### 4.5. Các section bên dưới

| Section | Thiết kế đề xuất | Mobile / giới hạn |
| --- | --- | --- |
| Vì sao chọn chúng tôi | Nhóm ảnh reveal 24px một lần; khối chữ fade nhẹ. Không parallax ba ảnh liên tục vì đã có scrub ở Services. | 12px; ảnh `.why-panel` đang ẩn ở màn nhỏ tiếp tục ẩn. Không thêm chuyển động chỉ để bù chỗ trống. |
| Dự án tiêu biểu | Card xuất hiện theo nhóm hàng, 50–70ms lệch nhau, tổng tối đa 210ms. Ảnh có thể scale 1 → 1.02 khi hover trong crop. | Không zoom trên touch; không lift cả card vì hiện card không phải link. Tránh tạo cảm giác bấm được khi không có trang chi tiết. |
| Thiết bị/lưu trữ | Fade một lần theo nhóm, không lại bay từ hai bên; tên/thông số giữ yên khi đọc. | Không stagger kéo dài khi danh sách xếp dọc. |
| FAQ | Giữ `<details>/<summary>`. Chuyển màu và biểu tượng 160–200ms; câu trả lời fade ngắn khi mở. | Không làm animation chiều cao custom trong đợt này; native disclosure bảo đảm tap/keyboard/no-JS, không lỗi khi bấm nhanh. |
| Liên hệ cuối trang | Headline/CTA reveal đồng bộ 16px, 500–600ms; hover CTA đổi màu và icon đi 3px. | Không pulse vô hạn, không animate chiều rộng nút. Reduced-motion chỉ đổi màu. |
| Footer | Giữ tĩnh để kết thúc trang rõ ràng; phản hồi link nhẹ. | Không che nội dung bằng một entrance muộn. |
| Dock liên hệ | Sau khi sửa kích thước: xuất hiện nhẹ 8px, 240ms một lần; không bounce/pulse, không đổi kích thước khi hover. | Icon 20–24px trong hit area tối thiểu 44×44px; kiểm tra safe-area, bàn phím ảo và nội dung không bị che. Disabled không có hiệu ứng mời bấm. |
| Testimonials / calculator / comparison / process | Không đưa vào trang hoặc thêm dữ liệu chỉ để có animation. | Chỉ thiết kế riêng khi các section này thực sự được bật bằng nội dung đã duyệt. |

## 5. Lazy loading ảnh

- Tái sử dụng `next/image`; ảnh dưới fold giữ native `loading="lazy"`, không viết observer thay `src`, không mount ảnh sau khi vào viewport. Native loader phải có cơ hội tải trước khi reveal bắt đầu.
- Hero chuyển `priority` deprecated sang **`loading="eager"` + `fetchPriority="high"`** cho một ảnh hero dùng chung. Không đồng thời thêm `preload`; nếu đo LCP cho thấy preload phù hợp hơn thì dùng riêng chiến lược preload theo tài liệu Next.
- Giữ kích thước container/ratio cho `fill`; điều chỉnh `sizes` theo breakpoint thật 480/700/900 khi cần. Với export `images.unoptimized`, `sizes` một mình không tạo variant nhỏ hơn hay giảm byte ảnh.
- Không delay H1/CTA để chờ ảnh. Lỗi tải ảnh không giữ cả section ở opacity 0. Không tạo blurDataURL giả hoặc yêu cầu ảnh mới trong tác vụ motion.
- Kiểm chứng bằng request thực tế/cache tắt; không lấy số thẻ `loading="lazy"` làm bằng chứng đã giảm dung lượng.

## 6. Cuộn toàn trang: yêu cầu và đề xuất an toàn

**Chính sách:** không đặt trần px/giây cứng. Trên macOS để tất cả wheel native, tránh nội suy chồng lên momentum của trackpad/Magic Mouse. Trên desktop khác làm mượt wheel bằng Lenis; mobile/touch dùng native. Trình duyệt không cung cấp nhận diện phần cứng trackpad-vs-wheel đáng tin cậy; không suy đoán từ delta nguyên/lẻ vì hai thiết bị có thể phát cả hai dạng. Hệ quả: chuột cơ học cắm vào Mac cũng sẽ dùng native scroll.

Hard-cap làm wheel lớn tích hàng đợi, cản người muốn đi nhanh, xung đột quán tính touch/trackpad và dễ làm anchor, Find-in-page, PageDown/End hoặc focus cảm giác sai. Trên macOS giữ wheel native bảo toàn momentum tự nhiên; trên hệ desktop khác Lenis làm mượt wheel. Không tuyên bố phân loại từng thiết bị vật lý.

Phương án đề xuất:

- Một instance Lenis trên desktop `(min-width: 1024px) and (hover: hover) and (pointer: fine)`, không reduced-motion.
- macOS nhận `smoothWheel: false` (mọi wheel native); nền tảng khác nhận `smoothWheel: true`, `wheelMultiplier: 0.8`, `lerp: 0.1`. Giữ `syncTouch: false`, `autoRaf: false` vì runtime tự quản lý RAF/lifecycle. Không điều chỉnh `lenis.options.lerp` theo heuristic `deltaY`; Lenis nhận WheelEvent nhưng không có trường định danh trackpad.
- Scroll thật vẫn ở window; không biến toàn page thành container translateY. Khi Lenis đang active, bỏ xung đột với `html { scroll-behavior: smooth }`.
- Anchor cùng trang chỉ có một chủ điều khiển; preserve hash/history/focus, tính offset header thật. Link Next sang route khác để Next xử lý rồi dừng inertia cũ. Kiểm tra `/#giai-phap`, `/#dich-vu`, Back/Forward và scroll restoration.
- Không can thiệp touch, pinch zoom, phím điều hướng, scroll bên trong form/menu. Dùng vùng `data-lenis-prevent` cho phần tử nested cần cuộn, không quét mọi ancestor tùy tiện mỗi frame.
- Resize sang mobile hoặc bật reduced-motion trong lúc đang chạy: destroy instance, dọn loop, giữ vị trí cuộn hiện tại; không gọi `stop()` rồi để trang kẹt.
- Nếu yêu cầu cuối cùng vẫn là **hard-cap trên cả mobile**, phải duyệt lại UX này trước triển khai; plan hiện không mặc định chọn hành vi rủi ro đó. Có thể bỏ Lenis hoàn toàn mà hero/marquee/services/card vẫn chạy vì không phụ thuộc engine cuộn.

API tham khảo: [Lenis README — settings/lifecycle/limitations](https://github.com/darkroomengineering/lenis). Cần pin phiên bản đã kiểm tra khi cài, không dựa vào README tương lai.

## 7. Accessibility, mobile và hiệu năng

- `prefers-reduced-motion`: hero/reveal/services ở vị trí cuối; marquee tĩnh; không smooth-wheel; hover chỉ màu/outline. Bỏ global `.01ms` thay bằng rule theo hiệu ứng. Thay đổi preference khi trang đang mở cũng có tác dụng.
- Motion không tạo nội dung riêng cho crawler. Metadata/schema/HTML server và FAQ giữ nguyên; không trì hoãn link/ảnh bằng JavaScript.
- Không animate `top/left/margin/width/height` theo scroll; không full-screen blur/filter, không `will-change` trên tất cả card. Chỉ dùng layer promotion trong khoảng thực sự chạy rồi bỏ.
- Chỉ Services đọc tiến độ liên tục; còn lại event/observer/CSS. Marquee ngoài viewport và tab ẩn không chạy.
- Không dùng `overflow-x: hidden` toàn body để che lỗi bố cục. Test đúng phần gây overflow và giới hạn motion ở đó.
- Mobile giữ cuộn dọc/pinch zoom, mục tiêu chạm 44px, không yêu cầu hover mới thấy thông tin hoặc CTA. Kiểm tra orientation, focus form, bàn phím ảo, dock và safe-area.

## 8. Trình tự triển khai và nghiệm thu

### Đợt A — nền an toàn

Sửa dock sizing theo hiện trạng lúc triển khai; thêm motion/elevation tokens; thay reduced-motion rule; điều chỉnh tải sớm hero. Giữ trang đọc được khi chưa có runtime.

### Đợt B — hiệu ứng rời rạc

Runtime reveal + hero; marquee đầy đủ pause/resume và visibility; card lift/shadow. Tái sử dụng section hiện hữu, không thay screen composition.

### Đợt C — scroll và section hỗ trợ

Services scrub đảo chiều trên cả desktop/mobile; các hiệu ứng nhẹ phía dưới. Thêm Lenis desktop **theo phương án cuộn đã được duyệt**, độc lập với services native scroll path.

### Đợt D — kiểm chứng end-to-end

- Desktop: wheel nhỏ/lớn, trackpad, đảo chiều liên tục; không tích scroll kéo dài, không pin trang. Đo Performance trace; ngân sách mục tiêu phần JS motion khoảng ≤4ms/frame trên máy kiểm tra, không có long task >50ms do motion. Đây là tiêu chí, chưa phải kết quả.
- Mobile widths: 320, 390, 430, 768; desktop 1024, 1440. Kiểm tra thêm iOS Safari và Android Chrome thực; viewport giả lập không chứng minh quán tính touch/Safari hoạt động.
- Marquee: qua ít nhất hai mối nối không giật; hover nâng 5px đúng brand; hover/touch/visibility pause, resize, reduced-motion; không có nút dừng thủ công.
- Services: kiểm tra đầu/giữa/cuối tiến độ; kéo xuống rồi lên đến cùng tọa độ cho cùng transform; ảnh/chữ không rung, không sinh overflow, không che nội dung khi đứng đọc.
- Cards: lift 10px chỉ thiết bị hover; rời hover đảo từ vị trí hiện tại; keyboard focus rõ; tap CTA trên mobile đi ngay, không phải tap lần hai.
- Routing: anchor trong trang và từ route khác, Back/Forward, reload giữa trang, nhảy xuống cuối bằng bàn phím. Không tạo observer/RAF/Lenis instance trùng sau nhiều lần chuyển route.
- Ảnh/SEO: cold-cache network cho hero/lazy, một H1, đủ nội dung khi tắt JS, không hydration warning, không mất canonical/schema. So sánh LCP/CLS/INP trước-sau ở production build, không dùng dev timing làm chứng cứ hiệu năng.
- Chạy `typecheck`, build static và export tests hiện có sau khi tích hợp; browser smoke desktop/mobile + reduced-motion + no-JS. Chỉ thêm regression test cho state pause/đảo chiều/lifecycle có nguy cơ thực; không test duration hoặc chuỗi CSS như hợp đồng sản phẩm.

**Đã triển khai:** `lenis@1.3.26` khóa version trong lockfile; `MotionRuntime` gắn tại public layout, dùng WAAPI/IntersectionObserver cho hero và reveal, scroll RAF cho dịch vụ. Hero và mọi reveal bắt đầu ngoài viewport, kéo dài 2 giây; dịch vụ đi vào từ ngoài mép và đảo chiều theo scroll. Lenis chỉ làm mượt wheel desktop không phải macOS (`wheelMultiplier: 0.8`, `lerp: 0.1`); macOS giữ native wheel, mobile/touch native. `PartnersMarquee` có danh sách SSR/clone sau hydration, pause hover/touch/visibility/reduced-motion, không có nút điều khiển. Hero dùng ảnh `loading="eager"`/`fetchPriority="high"`; ảnh còn lại giữ lazy mặc định. Lỗi dock ở baseline đã chỉnh: tại 390px dock cao 176px, không che CTA hero.

**Đã kiểm tra:** `npm run build`, `npm run typecheck`, `npm run test:export` đều đạt. Chromium xác nhận hero entrance 2000ms từ ngoài màn hình (desktop bắt đầu ở ±1975/2059px, mobile ở ±748px); mục “Chúng tôi làm gì” bắt đầu từ dưới viewport; ở 390px không tràn ngang. Marquee dừng khi hover, brand nâng 5px; không còn nút điều khiển. `prefers-reduced-motion` bỏ Lenis và giữ danh sách đối tác tĩnh. Với user-agent Linux giả lập, wheel bị Lenis xử lý; với user-agent macOS giả lập, wheel event không bị preventDefault và native scroll chạy. Chưa thử trên phần cứng trackpad/Magic Mouse thật.

**Giới hạn:** thiết bị iOS/Android thật, trackpad vật lý, cold-cache LCP/CLS/INP production và Performance trace ≤4ms/frame chưa được kiểm chứng. Không áp ngưỡng tốc độ cứng cho mobile; native touch giữ quyền điều khiển quán tính của trình duyệt.

