# Browser evidence — DESIGN.md migration

Ngày kiểm tra: 2026-10-01. Kiểm tra server dev local đang chạy từ repo tại `http://127.0.0.1:3000/solar_demo/`, Chromium headless/macOS, hai viewport 1440×900 và 390×900. Không phải production build hoặc thiết bị thật. Hai lượt kiểm tra: đo ban đầu, rồi xác nhận FAQ và trạng thái sau animation/reduced-motion; không sửa UI trong quá trình đo.

## Kết quả

| Kiểm tra | Desktop 1440px | Mobile 390px | Kết luận |
| --- | --- | --- | --- |
| Body / hero | 16px, line-height 24.8px / hero 50px | 16px, line-height 24.8px / hero 32px | Khớp CSS đã đọc |
| Container | 1200px | 358px | Khớp breakpoint/container |
| Motion token served | Hero 2s, reveal 2s | Hero 2s, reveal 2s | Tương đương 2000ms source; drift so với v1 760/520ms |
| Rendered H1 font (CDP) | Arial / Arial-BoldMT | Arial / Arial-BoldMT | Plus Jakarta Sans chưa render trên môi trường kiểm tra |
| Primary | App và package cùng primary | App và package cùng primary | Đúng giá trị light/default |
| Accent | App cam, package vàng cam khác nhau | Cùng khác biệt namespace | Giữ palette theo consumer; chưa map đồng loạt |
| FAQ bàn phím | true → false → true bằng Enter | true → false → true bằng Enter | Toggle được; FAQ đầu mặc định mở |
| Mobile menu | Không áp dụng | Enter mở disclosure | PASS smoke mở menu, chưa kiểm tra mọi submenu/link |
| Even service stage | Nền rgb(248,250,252), radius 14px, shadow | Cùng nền/radius/shadow | Khớp v1, specificity giữ style mobile |
| Tràn ngang sau 2.5s | scrollWidth 1440px | scrollWidth 424px | Mobile chưa PASS responsive |
| Tràn ngang sau FAQ | 1440px | 424px | Vẫn tồn tại sau thay đổi focus/scroll |
| Reduced-motion overflow | 1440px | 390px | Mobile không tràn trong trạng thái giảm chuyển động |
| Reduced-motion animation | scroll auto, services none, 0 active animation khi đo | Cùng kết quả | PASS các chỉ số đã đo, không chứng nhận mọi consumer |

`document.fonts.check('16px "Plus Jakarta Sans"')` trả true nhưng không chứng minh font đã được cung cấp. CDP `CSS.getPlatformFontsForNode` cho H1 là bằng chứng rendered font. Không đưa kết quả fonts.check vào kết luận tải font.

Project tiêu biểu đang render `ProjectGallery`/`ExpandingGallery`, không phải `.project-grid` legacy. Đã bổ sung consumer này vào DESIGN.md sau khi đối chiếu source và screenshot. Toàn bộ gallery interaction chưa được kiểm thử trong lượt document.

## Artifact

- [Raw browser metrics](design-evidence/browser.json)
- [Home desktop](design-evidence/home-desktop.png), [home mobile](design-evidence/home-mobile.png): reduced-motion để chụp trạng thái ổn định.
- [Service desktop](design-evidence/service-desktop.png), [service mobile](design-evidence/service-mobile.png): motion mặc định.

Ảnh thể hiện dev page ở thời điểm đo; video ngoài/iframe và nội dung lazy có thể không hoàn tất trong full-page capture. Ảnh này không thay ảnh nghiệm thu component hoặc visual-regression suite.

## Vấn đề còn mở và giới hạn

- Mobile default-motion có overflow 34px; reduced-motion loại overflow trong lần đo. Có tương quan với trạng thái chuyển động, chưa chứng minh root cause. Cần quyết định scope/layout của animation trước khi sửa; không dùng global overflow clipping làm nghiệm thu.
- H1 hiện dùng Arial fallback. Nếu muốn cam kết Plus Jakarta Sans, cần quyết định nguồn font, tải font, CSP/cache và xác minh trên môi trường deployment; document không tự thêm loader.
- Theme site chỉ được smoke light/default density. Dark/compact, contrast toàn bộ cặp màu/state, invalid/disabled/loading và lifecycle gallery chưa nghiệm thu đầy đủ.
- Chưa chạy build/typecheck/export lại vì migration chỉ sửa tài liệu và preview data. Không dùng các PASS cũ trong v1/animation-plan làm bằng chứng current working tree.
- Chưa đo production LCP/CLS/INP, iOS/Android thật hoặc trackpad. Không thay đổi code, token runtime, endpoint, security policy hay credentials.
