# Plan kiến trúc animation

> Cập nhật authority 2026-10-01: các thông số và kết quả bên dưới là lịch sử của đợt triển khai trước. Visual/motion hiện hành xem [DESIGN.md](../DESIGN.md), ownership xem [UI composition](ui-composition.md), kiểm chứng mới xem [browser evidence](design-browser-evidence.md). Source hiện dùng hero/reveal 2000ms và services media/list 0/18/35/100%; không dùng mô tả 760/520ms hoặc exit 89–100% bên dưới làm baseline hiện tại.

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

**Điểm nhấn:** hero mở đầu bằng chữ từ trái và hình từ phải. Các section vào nhanh, quãng ngắn; “Chúng tôi làm gì” dùng reveal độc lập trên ảnh/chữ khi bước vào viewport, không buộc transform bám theo từng frame cuộn.

Thông số sau là giá trị khởi điểm để nghiệm thu, không phải số đo hiệu năng:

| Token | Giá trị đề xuất | Dùng cho |
| --- | --- | --- |
| `--motion-ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Đi vào, hover lift, kết thúc mềm; không bounce |
| `--motion-fast` | 160ms | Màu sắc/phản hồi nhấn |
| `--motion-medium` | 280ms | Trả về trạng thái nghỉ |
| `--motion-reveal` | 520ms | Reveal theo viewport |
| `--motion-hero` | 760ms | Entrance hero |
| `--motion-distance` | 32px desktop / 16px mobile | Reveal ngắn, giảm độ trễ cảm nhận |
| Stagger delay | 30ms mỗi bậc, tổng tối đa 90ms | Nhóm card cùng xuất hiện |
| `--motion-card-lift` | -10px | Card giải pháp trên thiết bị có hover |
| `--motion-brand-lift` | -5px | Tên/logo đối tác được hover |

Token thêm vào `src/styles/tokens.css`; selector/keyframe đặt theo section trong `src/styles/components.css`. Không tạo hệ token hoặc CSS framework song song.

## 3. Kiến trúc triển khai

Ưu tiên WAAPI + IntersectionObserver cho entrance một lần; CSS view timeline cho chuyển động gắn với scroll. Services dùng view timeline có pha vào/giữ/ra, không cần Framer Motion/GSAP hoặc JS đo layout mỗi frame. Lenis chỉ cho desktop scroll input, tải động theo gate thiết bị.

```text
src/app/(public)/layout.tsx                 # mới: mount runtime chỉ cho public routes
src/components/motion/motion-runtime.tsx   # public lifecycle, reveal, Lenis RAF
src/components/organisms/partners-marquee.tsx # loop đối tác tự pause, không control button
src/components/sections/*                 # giữ server rendering, khai báo reveal target
src/components/molecules/faq-disclosure.tsx # giữ details/summary
src/styles/tokens.css                      # motion + elevation tokens
src/styles/components.css                  # hiệu ứng theo section, media/reduced-motion
```

### Interface và quyền sở hữu

- `<MotionRuntime />` là module phía client không render nội dung hoặc thêm wrapper transform quanh toàn trang. Mount một lần trong layout public, không áp dụng cho admin/API tương lai.
- Section giữ dữ liệu/HTML phía server; runtime tìm các phần tử đã khai báo trong `main`, không biến `HomeScreen` thành Client Component.
- Interface khai báo nhỏ: `data-motion="left|right|up|fade"`, `data-motion-order` cho nhóm có stagger; Services thêm `data-motion-scroll="left|right"` để vào theo từng hàng, lớp `.service-exit` để ra theo timeline chung của `.services`.
- Target thông thường reveal một lần khi vào viewport; observer unobserve sau khi kích hoạt. Services giữ bốn nấc vào trên timeline riêng của từng ảnh/chữ (0/12/24/36%), sau đó đứng yên. Khi cuối cả nhóm dịch vụ gần rời viewport, lớp bọc chuyển động ra qua bốn nấc ở 89/93/97/100% timeline chung; cuộn ngược thì đảo chiều.
- Services không đọc bounding rect, đo progress hoặc ghi style bằng JS trong lúc cuộn. `@supports` bật CSS timeline; trình duyệt chưa hỗ trợ dùng WAAPI entrance dự phòng. Nếu có `view()` nhưng chưa hỗ trợ named view timeline, nội dung vẫn vào và giữ nguyên thay vì biến mất.
- Runtime dọn observer, media listener và WAAPI handles khi đổi route/unmount; Lenis import hoàn tất sau unmount không tạo instance.
- Lenis sở hữu RAF liên tục khi desktop smoothing hoạt động; service CSS timeline không nối vào loop. Reduced-motion tắt timeline; không tạo RAF section song song.
- Không cho entrance và hover cùng ghi đè một `transform`: reveal ngoài/hover trong hoặc tách `translate` và `transform` với quyền sở hữu rõ ràng. Không transform ancestor của header/dock fixed.
- HTML/CSS mặc định đọc được. JS tải chậm, lỗi hoặc bị tắt vẫn thấy nội dung, link và ảnh; chỉ khởi tạo trạng thái reveal cho phần tử còn ngoài viewport. Focus vào vùng đang reveal phải đưa về trạng thái đọc được ngay.

## 4. Plan theo section

### 4.1. Vào trang / Hero

- `.hero-copy`: translateX -48px → 0; `.hero-visual`: +48px → 0, trong khoảng 760ms. Chữ và ảnh vào cùng nhịp; CTA không bị khóa tương tác.
- H1, nội dung quan trọng và ảnh LCP **không bắt đầu ở opacity 0**, không đợi ảnh tải xong hoặc hydration mới hiện. Có thể tăng opacity nhẹ từ .9 → 1; phần phụ đi từ .65 → 1. Hiệu ứng “từ từ hiện ra” không được đổi thành màn hình trống đầu trang.
- Không split từng ký tự, không spinner mở màn, không blur toàn ảnh. `hero-bottom` giữ tĩnh.
- Mobile giữ hai hướng trái/phải nhưng giảm quãng đi còn 24px; giữ cùng duration 760ms để hero vẫn là điểm nhấn nhưng không phải đi từ ngoài toàn viewport.

### 4.2. Đối tác tự cuộn ngang

- Từ phải sang trái, tuyến tính; khởi điểm **28px/giây desktop, 20px/giây mobile**. Tốc độ theo pixel, không đặt một duration cố định cho mọi độ dài danh sách.
- Một nhóm gốc và bản sao trình bày đủ lấp viewport; hai nhóm có chiều rộng bằng nhau, tính đúng cả gap tại mối nối. `ResizeObserver` cập nhật quãng đường/duration khi đổi màn hình hoặc font; không reset về đầu gây giật.
- Chỉ chạy khi đo được chiều rộng, nằm trong viewport và tab đang mở. 0–1 thương hiệu dùng danh sách tĩnh. SSR/no-JS hiển thị danh sách gốc; bản sao không hiện trong fallback.
- Hover vào một thương hiệu: **dừng cả track tại vị trí hiện tại**, thương hiệu đó nâng 5px trong 220ms và tăng độ tương phản/đổi màu sang token thương hiệu. Không dùng glow/filter lớn, không làm màu thật của logo sai khi sau này có asset.
- Rời hover tiếp tục từ đúng vị trí, không khởi động lại. Focus vào link thương hiệu thật cũng dừng nếu sau này có link; không biến text hiện tại thành button giả chỉ để nhận focus.
- Không có nút pause. Mobile không dựa vào hover: chạm/giữ tự dừng tạm thời, pointer up/cancel trả trạng thái; không `preventDefault()` thao tác cuộn dọc.
- Bản sao `aria-hidden`, không có điểm tab/ID trùng; danh sách đọc bởi screen reader chỉ một lần. Với reduced-motion: bỏ autoplay và lift, hiển thị danh sách tĩnh dễ đọc.

### 4.3. “Chúng tôi làm gì” theo tiến trình cuộn

- Mỗi ảnh và khối chữ bắt đầu ngoài viewport ngang khoảng một viewport cộng chiều rộng của phần tử, qua bốn nấc keyframe vào để về giữa ở 36% timeline riêng rồi giữ nguyên. Lớp bọc dùng timeline chung của nhóm dịch vụ, chỉ trượt ra ở 89–100% khi hàng cuối gần rời viewport; cuộn ngược làm lớp bọc hiện lại trước khi hàng tương ứng đảo hiệu ứng vào. Thời lượng thực phụ thuộc tốc độ cuộn.
- Timeline đảo chiều khi cuộn ngược; không unobserve target sau khi vào. Trình duyệt chưa hỗ trợ timeline dùng WAAPI reveal một lần từ hai phía.
- Không đọc layout hoặc ghi CSS variable mỗi frame cuộn; Lenis chỉ xử lý cuộn, không chạy animation section.
- `prefers-reduced-motion` tắt CSS/WAAPI service motion, giữ ảnh/chữ ở vị trí đọc được. `overflow: clip` chỉ giới hạn phần dịch ngang bên trong `.services`, không khóa cuộn trang.

### 4.4. Giải pháp theo nhóm khách hàng

- Giữ và chuẩn hóa shadow sẵn có thành bóng lệch xuống, mềm. Card nghỉ không nhảy; hover nâng **10px trong 420ms**, trở lại trong 280ms.
- Áp dụng với `(hover: hover) and (pointer: fine)`. `focus-within` có tín hiệu tương đương để người dùng bàn phím biết card đang tương tác; không xóa focus outline.
- Shadow có thể đổi nhẹ giữa hai mức cố định trên một card; không tăng blur cực lớn hoặc xếp nhiều lớp bóng. Đo repaint; nếu đắt, crossfade lớp shadow thay vì nội suy blur mỗi frame.
- Entrance card chỉ một lần, từ dưới 32px, tối đa 90ms stagger. Không làm entrance và hover tranh transform.
- Mobile: không lift trên tap và không để sticky-hover; giữ bóng nền nhẹ. Nhấn link phản hồi màu trong 120–160ms, không trì hoãn điều hướng. Không tự biến cả card thành link vì hiện card có CTA riêng.

### 4.5. Các section bên dưới

| Section | Thiết kế đề xuất | Mobile / giới hạn |
| --- | --- | --- |
| Vì sao chọn chúng tôi | Nhóm ảnh reveal 32px một lần; khối chữ fade nhẹ. Không parallax ba ảnh liên tục. | 16px; ảnh `.why-panel` đang ẩn ở màn nhỏ tiếp tục ẩn. Không thêm chuyển động chỉ để bù chỗ trống. |
| Dự án tiêu biểu | Thư viện UI dùng `ExpandingGallery`: ảnh co/mở theo hover, focus và tap; chi tiết dự án hiện trên panel đang chọn. Panel đầu hoạt động ngay khi tải. | Mobile xếp panel theo chiều dọc; giữ tên, địa điểm và thông số đọc được, không yêu cầu hover. |
| Thiết bị/lưu trữ | Fade một lần theo nhóm, không lại bay từ hai bên; tên/thông số giữ yên khi đọc. | Không stagger kéo dài khi danh sách xếp dọc. |
| FAQ | Giữ `<details>/<summary>`. Chuyển màu và biểu tượng 160–200ms; câu trả lời fade ngắn khi mở. | Không làm animation chiều cao custom trong đợt này; native disclosure bảo đảm tap/keyboard/no-JS, không lỗi khi bấm nhanh. |
| Liên hệ cuối trang | Headline/CTA reveal đồng bộ 32px, 520ms; hover CTA đổi màu và icon đi 3px. | Không pulse vô hạn, không animate chiều rộng nút. Reduced-motion chỉ đổi màu. |
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

**Chính sách:** không đặt trần px/giây cứng. Desktop dùng Lenis `smoothWheel: true`, `wheelMultiplier: 0.8` (tăng từ mức 0.5 trước đó), `lerp: 0.1`; mobile/touch giữ cuộn native. Browser không cung cấp nhận diện phần cứng trackpad-vs-wheel đáng tin cậy, vì vậy không suy đoán loại thiết bị từ số delta.

Scroll smoothing chỉ điều chỉnh đầu vào wheel; animation section không đọc/cuộn theo từng frame. Trackpad momentum chưa được đo trên phần cứng thật.

Thiết lập hiện tại:

- Một instance Lenis trên desktop `(min-width: 1024px) and (hover: hover) and (pointer: fine)`, không reduced-motion, với `smoothWheel: true`, `wheelMultiplier: 0.8`, `lerp: 0.1`.
- Giữ `syncTouch: false`, `autoRaf: false` vì runtime tự quản lý RAF/lifecycle. Không điều chỉnh lerp theo heuristic `deltaY`; browser không cung cấp định danh hardware đáng tin cậy.
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
- Các section thông thường dùng IntersectionObserver/WAAPI một lần; Services dùng CSS view timeline native, không tính progress bằng JS mỗi frame. Marquee CSS tự dừng ngoài viewport/tab ẩn.
- Không dùng `overflow-x: hidden` toàn body để che lỗi bố cục. Test đúng phần gây overflow và giới hạn motion ở đó.
- Mobile giữ cuộn dọc/pinch zoom, mục tiêu chạm 44px, không yêu cầu hover mới thấy thông tin hoặc CTA. Kiểm tra orientation, focus form, bàn phím ảo, dock và safe-area.

## 8. Trình tự triển khai và nghiệm thu

### Đợt A — nền an toàn

Sửa dock sizing theo hiện trạng lúc triển khai; thêm motion/elevation tokens; thay reduced-motion rule; điều chỉnh tải sớm hero. Giữ trang đọc được khi chưa có runtime.

### Đợt B — hiệu ứng rời rạc

Runtime reveal + hero; marquee đầy đủ pause/resume và visibility; card lift/shadow. Tái sử dụng section hiện hữu, không thay screen composition.

### Đợt C — scroll và section hỗ trợ

Services ảnh/chữ vào riêng theo bốn nấc và giữ nguyên trong lúc đọc ba hàng; lớp bọc rút ra theo 89–100% timeline của toàn nhóm sau hàng cuối. Tốc độ theo thao tác cuộn; Lenis RAF không điều khiển timeline.

### Đợt D — kiểm chứng end-to-end

- Desktop: wheel nhỏ/lớn, trackpad, đảo chiều liên tục; không tích scroll kéo dài, không pin trang. Đo Performance trace; ngân sách mục tiêu phần JS motion khoảng ≤4ms/frame trên máy kiểm tra, không có long task >50ms do motion. Đây là tiêu chí, chưa phải kết quả.
- Mobile widths: 320, 390, 430, 768; desktop 1024, 1440. Kiểm tra thêm iOS Safari và Android Chrome thực; viewport giả lập không chứng minh quán tính touch/Safari hoạt động.
- Marquee: qua ít nhất hai mối nối không giật; hover nâng 5px đúng brand; hover/touch/visibility pause, resize, reduced-motion; không có nút dừng thủ công.
- Services: ba hàng giữ nguyên khi còn đang đọc; cuối nhóm dịch vụ mới trượt ra theo timeline chung và hiện lại khi cuộn ngược. Kiểm tra từng hàng, liên kết, reduced-motion và mobile overflow; không có JS progress/style mỗi frame.
- Cards: lift 10px chỉ thiết bị hover; rời hover đảo từ vị trí hiện tại; keyboard focus rõ; tap CTA trên mobile đi ngay, không phải tap lần hai.
- Routing: anchor trong trang và từ route khác, Back/Forward, reload giữa trang, nhảy xuống cuối bằng bàn phím. Không tạo observer/RAF/Lenis instance trùng sau nhiều lần chuyển route.
- Ảnh/SEO: cold-cache network cho hero/lazy, một H1, đủ nội dung khi tắt JS, không hydration warning, không mất canonical/schema. So sánh LCP/CLS/INP trước-sau ở production build, không dùng dev timing làm chứng cứ hiệu năng.
- Chạy `typecheck`, build static và export tests hiện có sau khi tích hợp; browser smoke desktop/mobile + reduced-motion + no-JS. Chỉ thêm regression test cho state pause/đảo chiều/lifecycle có nguy cơ thực; không test duration hoặc chuỗi CSS như hợp đồng sản phẩm.

**Đã triển khai:** `MotionRuntime` dùng IntersectionObserver + WAAPI cho reveal thông thường; hero 760ms, section 520ms với quãng dịch 32px desktop/16px mobile. Services dùng timeline riêng cho pha vào mỗi hàng và timeline chung của nhóm cho pha ra; trình duyệt thiếu hỗ trợ dùng WAAPI entrance. Không còn service RAF/per-frame layout writes. Reduced-motion tắt cả hai animation; Lenis RAF chỉ chạy trên desktop.

**Đã kiểm tra sau khi tách pha ra:** `npm run build` đạt. Chromium trên static export: ở vị trí cuộn 1690px hàng hai vẫn còn 253px trong viewport và không bị dịch; ở 2030px hàng cuối còn 261px, cả ba hàng vẫn chưa bắt đầu rút ra. Ở 2140px section chỉ còn 151px trong viewport thì lớp bọc mới dịch; cuộn ngược về 2030px trả lại vị trí ban đầu. 390/320px không tràn ngang; reduced-motion cho animation `none`, translate `none`; liên kết hàng cuối vẫn điều hướng được.

Menu desktop mở bằng hover/focus; mobile mở disclosure lồng nhau. Điều hướng từ dropdown tới trang tổng quan dịch vụ và trang EPC hoạt động. `prefers-reduced-motion` cho animation `none`, opacity `1`, translate `none` (xác nhận lại trên static export sau điều chỉnh). Thời lượng vẫn phụ thuộc tốc độ cuộn; chưa đo trên trackpad/thiết bị thật.

**Giới hạn:** thiết bị iOS/Android thật, trackpad vật lý, cold-cache LCP/CLS/INP production và Performance trace ≤4ms/frame chưa được kiểm chứng. Không áp ngưỡng tốc độ cứng cho mobile; native touch giữ quyền điều khiển quán tính của trình duyệt.

