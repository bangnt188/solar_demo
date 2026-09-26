# Cơ sở kỹ thuật SEO/AEO cho website Lúa Xanh Đồng Bằng

Đối chiếu nguồn chính thức ngày **26/09/2026**. Đây là cơ sở lựa chọn kỹ thuật, **không phải cam kết được lập chỉ mục, tăng hạng hay được AI trích dẫn**. Các đề xuất bên dưới chưa phải kết quả kiểm định deployment.

## 1. Phạm vi và quyết định đề xuất

Repo hiện là demo Next.js xuất tĩnh trên `https://bangnt188.github.io/solar_demo/`, có các route `/`, `/du-an/`, `/thiet-bi/`, `/khao-sat/`. Thông tin sản phẩm, đối tác, liên hệ còn cần xác minh; ảnh dự án là ảnh minh họa, cần kiểm tra quyền sử dụng. Production Vercel là giai đoạn riêng. Nguồn nội bộ: [README](../README.md), [cấu hình export](../next.config.ts).

- **Demo:** ưu tiên `noindex` trong HTML của từng trang, nhưng không chặn Googlebot đọc trang. Không quảng bá URL demo bằng sitemap dành cho tìm kiếm. Đây là lựa chọn cho trạng thái nội dung chưa được duyệt, không phải chiến thuật tăng hạng. `robots.txt` chặn crawl không thay thế `noindex`; Google phải crawl được trang để đọc chỉ thị. [G3][G4]
- **Production:** chỉ bật index sau khi xác nhận domain, dữ liệu doanh nghiệp, nội dung và ảnh. Dùng URL công khai nhất quán trong canonical, liên kết nội bộ và sitemap; canonical là tín hiệu lựa chọn URL, không phải lệnh bắt buộc Google phải làm theo. [G6][G7][G8]
- **Không đổi route đang hoạt động chỉ để “SEO”.** Các slug hiện tại đã ngắn, có nghĩa và dùng dấu gạch nối. Khuyến nghị của Google là URL đơn giản, mô tả nội dung, dùng ngôn ngữ người đọc; không cần phát sinh hàng loạt trang gần giống nhau để bao phủ biến thể câu hỏi AI. [G8][G2]
- **Không thêm `llms.txt` hoặc FAQ schema chỉ để kỳ vọng tăng hiển thị.** Google không dùng `llms.txt` như một cơ chế tối ưu Search; FAQ rich result đã ngừng hiển thị từ 07/05/2026. Có thể giữ FAQ đọc được nếu thật sự trả lời nhu cầu khách hàng. [G2][G10]

## 2. Google Search và tính năng AI: điều kiện thực tế

| Hạng mục | Yêu cầu hoặc giới hạn chính thức | Áp dụng cho site |
| --- | --- | --- |
| Điều kiện kỹ thuật Search | Googlebot không bị chặn; trang trả HTTP `200`; có nội dung có thể lập chỉ mục. [G1] | Kiểm tra từng URL đã deploy, không chỉ trang chủ; không dùng trang lỗi trả `200` thay nội dung thật. |
| AI Overviews / AI Mode | Trang phải được index và đủ điều kiện hiển thị snippet. Không có schema đặc biệt bắt buộc để vào tính năng AI. [G2][G11] | Nội dung chính phải đọc được; không đặt `noindex` hoặc `nosnippet` lên các trang production muốn tham gia. |
| Quyền tham gia AI Search | Search Console có **Settings → Search generative AI**; mặc định include, property con có thể kế thừa lựa chọn của cha. Google ghi đã triển khai toàn cầu từ 31/08/2026. Exclude ảnh hưởng tính năng AI tương ứng, không phải chỉ thị cấm Search thông thường hoặc huấn luyện. [G12] | Chủ site kiểm tra trạng thái include/inherit khi ra mắt. Đây là thiết lập ngoài repo, chưa được kiểm tra trong đợt nghiên cứu này. |
| Nội dung và liên kết | Nội dung hữu ích, đáng tin, có trải nghiệm riêng; chữ quan trọng có thể đọc được; có liên kết nội bộ; dữ liệu có cấu trúc khớp nội dung hiển thị. [G2][G11] | Ưu tiên dữ liệu dự án được xác nhận, ảnh đúng ngữ cảnh, thông số và câu trả lời có căn cứ; không tạo số liệu tiết kiệm hay bảo hành suy đoán. |
| `llms.txt` | Google nói không cần file AI text/Markdown mới và Search không dùng chúng theo cách đặc biệt; changelog xác nhận không tác động tích cực hoặc tiêu cực tới visibility/ranking. [G2][G10] | Bỏ qua trong phạm vi này. Chỉ cân nhắc khi có một hệ thống tiêu thụ cụ thể yêu cầu, không coi là điều kiện tìm kiếm. |

**Lưu ý thời điểm:** trang “AI features and your website” cũ nói không có yêu cầu kỹ thuật bổ sung; hướng dẫn mới bổ sung kiểm tra quyền tham gia trong Search Console. Cần đọc cùng tài liệu điều khiển hiện hành, không kết luận rằng chỉ cần chỉnh code là đủ. [G11][G2][G12]

## 3. Structured data và FAQ

Google khuyến nghị JSON-LD; nội dung phải đúng, liên quan, cập nhật, hiện diện cho người dùng, đủ thuộc tính bắt buộc của loại rich result tương ứng. Không đánh dấu review giả, thông tin ẩn hoặc dữ liệu gây hiểu nhầm. Trang bị `noindex` hoặc bị chặn không đủ điều kiện rich result. [G9]

**Đề xuất:** chỉ thêm dữ liệu có cấu trúc cho thông tin đã được xác minh và hiển thị trên trang. Chưa xuất `Product`/`Offer`/rating hoặc hồ sơ doanh nghiệp chi tiết dựa trên dữ liệu mẫu. Có schema hợp lệ không đồng nghĩa được ưu tiên xếp hạng hay đủ điều kiện cho mọi loại rich result; phải đối chiếu chính sách của từng loại. [G9][G2]

**FAQ — tránh dùng thông tin cũ:** năm 2023 Google giới hạn FAQ rich result chủ yếu cho website chính phủ và y tế có uy tín. Đến 07/05/2026, tính năng này đã ngừng hiển thị; ngày 15/06/2026 Google gỡ tài liệu FAQ rich result. Vì vậy, “chỉ chính phủ/y tế mới được” không còn là mô tả đầy đủ của trạng thái hiện tại. Giữ câu hỏi/trả lời hữu ích trong HTML, không thêm `FAQPage` vì kỳ vọng có khối FAQ trên Google. [G13][G10]

## 4. Robots, noindex, canonical và sitemap: bốn việc khác nhau

| Cơ chế | Ý nghĩa | Cách dùng đề xuất |
| --- | --- | --- |
| `robots.txt` | Điều khiển crawl, không bảo đảm URL biến mất khỏi Search; không phải bảo mật. [G4] | Không dùng để che thông tin bí mật. Production cho phép crawler tìm kiếm truy cập nội dung công khai; chính sách bot huấn luyện quyết định riêng. |
| Meta `noindex` | Chỉ thị không index cho crawler hỗ trợ; Google phải truy cập được trang để đọc. `noindex` trong `robots.txt` không được Google hỗ trợ. [G3] | Demo xuất `<meta name="robots" content="noindex">` trong HTML; không đồng thời `Disallow` toàn bộ demo đối với Googlebot. |
| `rel="canonical"` | Tín hiệu ưu tiên một URL đại diện cho nội dung trùng hoặc rất giống; Google khuyến nghị URL tuyệt đối, nhất quán. [G6] | Production có canonical riêng cho từng trang, không cho mọi trang trỏ về trang chủ; không trỏ sang domain tương lai chưa được xác nhận. |
| Sitemap | Liệt kê URL muốn thấy trong Search, dùng URL tuyệt đối, ưu tiên canonical. Gửi sitemap chỉ là gợi ý, không bảo đảm được crawl/index. [G7] | Chỉ đưa trang production đủ điều kiện index; bỏ URL demo/noindex/lỗi. Không thêm `priority`/`changefreq` vì Google bỏ qua; chỉ ghi `lastmod` khi có ngày sửa nội dung đáng tin. |

**Bẫy GitHub Pages project site:** crawler đọc robots ở gốc host, tức `https://bangnt188.github.io/robots.txt`, không phải `https://bangnt188.github.io/solar_demo/robots.txt`. File xuất trong project không tự kiểm soát được robots của host. Nếu cần giới hạn bot bằng robots trên demo, chủ host phải quản lý file gốc và phạm vi `/solar_demo/`; thay đổi có thể ảnh hưởng dự án khác trên cùng host. Meta `noindex` là lựa chọn trực tiếp cho các trang HTML demo, nhưng không thay thế chính sách huấn luyện hoặc kiểm soát truy cập. [G5][G3][O1][A1]

## 5. Phân biệt bot tìm kiếm, bot huấn luyện và truy cập theo yêu cầu

| Nhà cung cấp / tác nhân | Mục đích và điều khiển | Hệ quả cần biết |
| --- | --- | --- |
| Googlebot | Crawl phục vụ Google Search, gồm nội dung cho tính năng AI Search. [G11] | Chặn Googlebot có thể làm mất khả năng truy cập nội dung phục vụ Search. Kiểm tra cả hosting/CDN, không chỉ file robots. [G1][G11] |
| Google-Extended | Lựa chọn giới hạn huấn luyện AI tách khỏi Search generative AI control. [G12] | Không dùng trạng thái của bot này để suy ra site đã được include/exclude trong AI Search. [G12] |
| OAI-SearchBot | Crawl cho kết quả tìm kiếm ChatGPT; dùng robots và cho phép dải IP được OpenAI công bố nếu có bộ lọc mạng. [O1] | Có thể allow bot này đồng thời disallow GPTBot. Opt-out không loại trừ khả năng còn xuất hiện dưới dạng liên kết điều hướng. [O1] |
| GPTBot | Crawl nội dung có thể dùng huấn luyện mô hình nền tảng OpenAI; `Disallow` thể hiện lựa chọn không cho dùng nội dung để huấn luyện. [O1] | Quyết định độc lập với OAI-SearchBot; không cần mở GPTBot chỉ vì muốn xuất hiện trong ChatGPT Search. [O1] |
| ChatGPT-User | Truy cập do người dùng yêu cầu, không phải crawl web tự động hoặc tác nhân quyết định Search eligibility. [O1] | OpenAI nói robots có thể không áp dụng cho những hành động do người dùng khởi tạo; không hứa robots chặn mọi truy cập kiểu này. [O1] |
| Claude-SearchBot | Thu thập phục vụ chất lượng kết quả tìm kiếm. [A1] | Chặn bot này ngăn hệ thống index nội dung phục vụ tìm kiếm của Anthropic và có thể giảm khả năng xuất hiện. [A1] |
| ClaudeBot | Thu thập nội dung có thể đóng góp vào huấn luyện mô hình Anthropic. [A1] | Có thể chặn riêng, không cần chặn Claude-SearchBot. [A1] |
| Claude-User | Truy cập theo yêu cầu của người dùng Claude. [A1] | Anthropic nói các bot của họ tôn trọng robots; chặn Claude-User ngăn lấy nội dung để trả lời yêu cầu đó. Không áp dụng ngoại lệ của ChatGPT-User cho Claude-User. [A1] |

**Đề xuất chính sách production:** cho phép các bot tìm kiếm nếu mục tiêu là được tìm thấy; quyền huấn luyện do chủ nội dung quyết định riêng. Chưa có quyết định thì không tự tuyên bố đã từ chối hoặc đồng ý thay chủ site. Chỉ sửa robots ở host thực sự kiểm soát được và kiểm tra quy tắc có hiệu lực; robots không phải lớp bảo mật. [O1][A1][G4][G5]

## 6. Yêu cầu thực dụng cho Next.js static và ra mắt

Next.js `output: "export"` sinh HTML cho từng route khi build, Server Components chạy ở thời điểm build. Vì vậy không cần chuyển sang SSR chỉ để có nội dung HTML ban đầu. Dynamic route cần danh sách `generateStaticParams()`; redirects/headers động qua Next config không được static export hỗ trợ. Nguồn đang mô tả phiên bản 16.3.6. [N1]

Đề xuất triển khai, không phải xác nhận đã hoàn tất:

1. **Giữ route hiện hữu**, tập trung đầu ra HTML: title/mô tả đúng trang, nội dung chính có chữ, liên kết rõ ràng, canonical nhất quán. Nếu cần trang chi tiết sau này, chỉ thêm khi có nội dung riêng đã xác minh; không tạo hàng loạt trang mỏng cho mỗi tỉnh hoặc biến thể từ khóa. [G2][G6][G8]
2. **Kiểm tra đúng artifact xuất tĩnh:** HTML có `noindex` cho demo; đường dẫn ảnh/link không mất hoặc lặp `/solar_demo`; trang thật trả `200`, trang không tồn tại trả lỗi phù hợp. Đối chiếu file export và HTTP khi đã deploy, không coi việc build thành công là bằng chứng đã index. [N1][G1][G3]
3. **Trước production:** xác nhận origin chính thức, canonical, sitemap, root robots, dữ liệu thương mại và ảnh; kiểm tra không mang `noindex` demo sang các trang được duyệt. Giữ chính sách URL ổn định; nếu thực sự thay URL, chuẩn bị redirect ở hosting hỗ trợ thay vì dựa vào Next redirects trong static export. [G6][G7][G9][N1]
4. **Sau production:** chủ site xác minh Search Console, kiểm tra URL Inspection/Page Indexing, gửi sitemap và kiểm tra Search generative AI control. Báo cáo Generative AI performance hiện có dữ liệu impressions cho AI Overviews/AI Mode; không suy diễn thành số lead hoặc doanh thu. [G3][G7][G12][G14]

Chưa có quyền Search Console, dữ liệu crawl/log hoặc dữ liệu chuyển đổi trong phạm vi nghiên cứu; không kết luận site hiện đã được Google/ChatGPT/Claude index hay đang xếp hạng như thế nào.

## Nguồn chính thức

[G1]: https://developers.google.com/search/docs/essentials/technical
[G2]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[G3]: https://developers.google.com/search/docs/crawling-indexing/block-indexing
[G4]: https://developers.google.com/search/docs/crawling-indexing/robots/intro
[G5]: https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
[G6]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
[G7]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
[G8]: https://developers.google.com/search/docs/crawling-indexing/url-structure
[G9]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
[G10]: https://developers.google.com/search/updates#removing-faq-rich-result
[G11]: https://developers.google.com/search/docs/appearance/ai-features
[G12]: https://support.google.com/webmasters/answer/16908024
[G13]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
[G14]: https://support.google.com/webmasters/answer/16984139
[O1]: https://developers.openai.com/api/docs/bots
[A1]: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[N1]: https://nextjs.org/docs/app/guides/static-exports
