# Review SEO/AEO và cấu trúc xuất bản

## Kết luận

Điểm nghẽn chính không phải tên thư mục: trước thay đổi, 4 trang dùng cùng title, không có canonical/structured data, `robots.txt` và `sitemap.xml` trả 404. Đây vẫn là **demo**, chưa có domain production được xác nhận, danh mục thiết bị là dữ liệu minh họa. Đã sửa đầu ra kỹ thuật; chưa phát hành production hoặc tuyên bố có thứ hạng.

Cơ sở chính sách và nguồn Google/OpenAI/Anthropic: [search-evidence.md](search-evidence.md). Không có cấu hình bảo đảm top Search hoặc được AI trích dẫn.

## Cấu trúc đã áp dụng

```text
src/
  app/
    layout.tsx                  # ngôn ngữ, metadataBase, mặc định noindex an toàn
    robots.ts                   # chính sách crawl; force-static cho Pages
    sitemap.ts                  # URL canonical được phép index; force-static
    (public)/
      page.tsx                  # /
      du-an/page.tsx            # /du-an/
      thiet-bi/page.tsx          # /thiet-bi/
      khao-sat/page.tsx          # /khao-sat/; noindex kể cả khi xuất bản
  config/site.ts                # origin + basePath từ một URL triển khai
  lib/seo.ts                    # danh mục route, metadata, canonical, schema, breadcrumb
  components/
    seo/json-ld.tsx             # serialize JSON-LD, escape ký tự <
    molecules/breadcrumbs.tsx   # breadcrumb HTML dùng cùng dữ liệu với schema
    screens/                   # ghép màn hình hiện hữu
    sections/                  # section hiện hữu, không nhân bản để làm SEO
  data/
    content/                   # nội dung trang và điều hướng hiện hữu
    mock/catalog.ts            # nguồn local hiện tại, không phải CMS production
public/images/demo/             # hai ảnh WebP lossless, vẫn là hình minh họa
```

Giữ nguyên route để không tạo migration URL vô ích. Route group `(public)` không xuất hiện trong URL. Không xóa cấu trúc backend/admin đang dự kiến, không tạo thêm tầng repository hay một CMS giả. Những thư mục chỉ có `.gitkeep` vẫn chưa có chức năng như README đã nêu.

`lib/seo.ts` tập trung các quy tắc dùng chung: URL tuyệt đối gồm prefix một lần, mô tả riêng theo trang, chính sách index, Open Graph/Twitter, `WebSite`/`WebPage`/`CollectionPage`/`BreadcrumbList`. Không khai báo `Product`, `Offer`, rating, địa chỉ doanh nghiệp hoặc số liệu chưa được xác minh. Không thêm `FAQPage` hoặc `llms.txt` vì kỳ vọng có lợi thế xếp hạng.

## Chính sách demo và xuất bản

| Profile | Cấu hình build | Kết quả |
| --- | --- | --- |
| Demo mặc định | Không đặt `NEXT_PUBLIC_SITE_URL`; `SEO_INDEXABLE=false` | URL `https://bangnt188.github.io/solar_demo/`; cả 4 trang noindex; sitemap không có URL; robots không quảng bá sitemap. |
| Preview domain riêng | URL HTTPS preview; `SEO_INDEXABLE=false` | Canonical đúng URL preview, vẫn noindex và sitemap rỗng. |
| Xuất bản nội dung đã duyệt | `NEXT_PUBLIC_SITE_URL` là URL HTTPS chính thức; `SEO_INDEXABLE=true` | Trang chủ/dự án/thiết bị index; khảo sát noindex; sitemap chỉ có 3 URL canonical. |

- URL cấu hình bao gồm prefix nếu có, không chứa query/hash/credentials; thay đổi cần **build lại**. URL domain gốc tự cho `basePath` rỗng, không cần sửa thủ công các link hoặc `imagePath`.
- Không cho bật index trên URL demo mặc định; build sẽ báo lỗi thay vì vô tình đưa bản mẫu lên Search. Workflow Pages cố định URL demo và `SEO_INDEXABLE=false`.
- Form `/khao-sat/` là công cụ tạo email nháp, không phải landing page nội dung; giữ noindex nhưng link vẫn hoạt động. `noindex` không bảo vệ dữ liệu hay ngăn truy cập.
- Robot policy cho phép crawl để bot đọc được `noindex`; không chặn toàn site bằng `Disallow: /`. Chính sách hiện tại `User-agent: * / Allow: /` **không opt-out bot huấn luyện**. Quyền huấn luyện phải được chủ nội dung quyết định riêng.
- **GitHub Pages:** file tại `/solar_demo/robots.txt` không điều khiển crawler của host; crawler đọc `https://bangnt188.github.io/robots.txt`. Muốn điều khiển bot tại host này phải có quyền quản lý root. Meta noindex nằm trực tiếp trong HTML nên không phụ thuộc file robots cấp project, nhưng bot vẫn cần truy cập được HTML.
- Không ghi `lastmod` giả theo ngày build hoặc `priority`/`changefreq`; chưa có lịch sử sửa nội dung đáng tin cậy. Không thêm canonical tới domain tương lai chưa xác nhận.
- Chế độ index là công tắc kỹ thuật, **không phải xác nhận dữ liệu mock đã sẵn sàng**. Phải duyệt nội dung, cập nhật mô tả trong `searchPages`, thay ảnh mẫu và gỡ thông báo demo đúng thực tế trước khi bật.

## Điểm nghẽn theo mức ưu tiên

| Mức | Bằng chứng | Tác động / xử lý |
| --- | --- | --- |
| P1 — đã sửa | HTTP baseline: 4 title giống nhau, không canonical; `src/app/layout.tsx` trước đây chỉ có title/description chung | Metadata riêng cho 4 route, canonical và OG URL nhất quán; schema trong HTML ban đầu. |
| P1 — đã sửa | Baseline `robots.txt`, `sitemap.xml`: 404 | Thêm endpoint tĩnh; phân biệt noindex với chặn crawl; không đưa URL demo/khảo sát vào sitemap xuất bản. Giới hạn root robots Pages vẫn cần xử lý ở hosting. |
| P1 — cần chủ nội dung duyệt | `src/data/content/site-chrome.ts:43-51`: địa chỉ, giờ mở cửa, email và cảnh báo cần xác minh; `src/data/content/home.ts:14-36,83`: đối tác, cam kết pháp lý, đến trong 48 giờ | Chưa đủ căn cứ phát hành hồ sơ doanh nghiệp hoặc các cam kết thương mại. Xác nhận pháp nhân, NAP, địa bàn phục vụ, đối tác, thời gian đáp ứng; không tự sửa thành sự thật khác. |
| P1 — thiếu nội dung gốc | `src/data/mock/catalog.ts:4-18`: 6 công trình với thông tin ngắn, 4 nhóm thiết bị mẫu; card chưa có trang chi tiết | Chưa có case study, datasheet/mã model được duyệt hoặc phương pháp đo sản lượng. Không tạo 10 trang mỏng chỉ bằng cách chép card. |
| P1 — đã sửa nhãn; còn thiếu nội dung | `src/data/content/home.ts:41-45` trước đây ghi “Xem chi tiết giải pháp” nhưng đi `/khao-sat/` | Đổi thành “Yêu cầu khảo sát”; điều hướng/danh mục dùng tên nhóm thiết bị, bỏ nhãn “chính hãng” trên link tới dữ liệu mẫu. Chưa tạo trang giải pháp chi tiết khi chưa có nội dung được duyệt. |
| P1 — giới hạn chuyển đổi hiện hữu | README và `/khao-sat/`: chỉ tạo email nháp, không gửi/lưu lead trên server | SEO traffic không đồng nghĩa đã nhận yêu cầu. Production cần quy trình tiếp nhận thật và thông báo bảo mật phù hợp; không coi mailto là thành công gửi lead. Backend chưa thuộc triển khai SEO này. |
| P2 — đã cải thiện | Hai PNG 512×512 tổng 823.786 byte; `next.config.ts` dùng `images.unoptimized` | WebP lossless còn 616.512 byte, giảm 207.274 byte (~25,2%); decoded pixels giống hệt, bỏ PNG cũ và đổi mọi nguồn ảnh. Chưa thể kết luận Core Web Vitals đã tốt. |
| P2 — cần asset thật | Hero/gallery dùng lại hai ảnh minh họa 512×512 | Cần ảnh công trình được phép công bố, đủ độ phân giải và variant responsive; không tăng kích thước ảnh nguồn bằng nội suy để giả chất lượng. Chưa thêm OG image thương hiệu khi chưa có asset được duyệt. |
| P2 — đã bổ sung | Trang danh mục/khảo sát chưa có breadcrumb | Breadcrumb nhìn thấy và schema dùng chung dữ liệu; điều hướng về trang chủ giữ đúng base path. |
| P1 — chưa có dữ liệu triển khai | Chưa truy cập domain production, Search Console, analytics, log CDN/crawler | Không kết luận site đã index, CWV đạt, có traffic hay được AI trích dẫn. Cần đo sau khi phát hành. |

Điểm tốt được giữ: HTML xuất sẵn, một H1 trên mỗi trang, link thật có href, FAQ native details/summary có câu trả lời trong HTML, ảnh có alt; không cần chuyển sang SSR chỉ vì SEO.

## Cấu trúc URL nội dung tiếp theo — chỉ xuất bản khi đủ dữ liệu

Đây là thiết kế thông tin cho lần phát hành nội dung, **không phải các route đã được tạo**:

| Cụm URL | Nội dung tối thiểu trước khi xuất bản | Liên kết cần có |
| --- | --- | --- |
| `/giai-phap/` và `/giai-phap/ho-gia-dinh/`, `/giai-phap/ho-kinh-doanh/`, `/giai-phap/doanh-nghiep/` | Nhu cầu phù hợp/không phù hợp, cấu hình điển hình có giả định, giới hạn, điều kiện mái, giờ sử dụng điện, quy trình khảo sát | Hub → giải pháp → công trình liên quan → khảo sát; không chép một bài và đổi nhóm khách. |
| `/dich-vu/` và trang dịch vụ có nội dung riêng | Phạm vi EPC/O&M thực tế, đầu ra bàn giao, trách nhiệm và điều kiện bảo hành đã xác nhận | Dịch vụ ↔ giải pháp/dự án có liên quan. |
| `/du-an/[slug]/` | Slug ổn định; quyền công bố; ảnh thật; thời điểm; địa điểm phù hợp quyền riêng tư; công suất; thiết bị; bài toán và kết quả có chứng cứ/phương pháp đo | Danh mục → case study → giải pháp phù hợp; breadcrumb cha-con. |
| `/thiet-bi/[slug]/` | Tên/model/hãng thật, thông số có đơn vị, datasheet nguồn, ảnh đúng thiết bị, ngày kiểm tra, bảo hành theo tài liệu; giá/tồn kho chỉ khi có nguồn cập nhật | Nhóm thiết bị → model → ứng dụng/công trình; Product/Offer chỉ khi dữ liệu đủ và chính xác. |
| `/kien-thuc/` và `/kien-thuc/[slug]/` | Bài trả lời vấn đề khách hàng thực sự hỏi; tác giả/người duyệt có thật; nguồn kỹ thuật/pháp lý; ngày cập nhật có nghĩa; bảng tính phải ghi giả định | Bài hướng dẫn → giải pháp/thiết bị liên quan; không tạo hàng loạt bài cho mỗi biến thể từ khóa. |
| `/gioi-thieu/`, `/lien-he/`, `/chinh-sach-bao-mat/` | Pháp nhân, đội ngũ, địa chỉ, cách liên hệ và chính sách xử lý dữ liệu đã duyệt | Điều hướng/footer; hồ sơ doanh nghiệp thống nhất với Google Business Profile khi đủ điều kiện. |

Trong App Router đặt các route này dưới `(public)`, nội dung duy trì ở `data/content` hoặc nguồn xuất bản thực tế sau này. Chỉ dùng `[slug]` với `generateStaticParams()` khi có bản ghi đã duyệt; route không tồn tại phải 404, không render bản mẫu trả 200. Không thêm thư mục rỗng để thể hiện “đã làm SEO”. Khi thay URL WordPress cũ, cần bảng đối chiếu từ sitemap/traffic thật và redirect 301 ở hosting hỗ trợ; chưa có dữ liệu URL cũ để lập bảng chính xác.

## Kiểm chứng đã chạy

- `npm run build` + `npm run test:export`: **đạt cho cả hai profile**, mỗi profile 2 test. Profile domain gốc dùng `https://solar.example` chỉ làm fixture local, không phải domain production đã chọn. `out/` cuối cùng là **bản demo noindex**.
- `npm run typecheck`: đạt. Không cài thêm dependency.
- Static HTTP smoke trên artifact build: 4 trang × Googlebot/OAI-SearchBot/Claude-SearchBot × 2 profile = **24 lượt trang**, status 200, title riêng, canonical/OG/schema khớp, policy index đúng; ảnh tải 200; robots và sitemap đúng profile; route không có trả 404 kèm noindex qua server preview.
- Browser Chromium: 4 trang ở 1280px và 390px, không overflow ngang, một H1/canonical mỗi trang; breadcrumb có current-page và dùng Enter quay về trang chủ; FAQ mở được bằng bàn phím. Screenshot desktop/mobile trang dự án đã xem trực tiếp.
- Tắt JavaScript: trang chủ vẫn có 6 công trình và đủ 3 câu trả lời FAQ. Không dựng nội dung riêng theo User-Agent.
- So sánh raw pixels của PNG/WebP trước khi bỏ PNG: cả hai giống hệt.
- Đây là kiểm tra local, **không phải kết quả Lighthouse/CrUX, Rich Results Test, crawl của bot thật hoặc index trên Google/AI**. Browser có các request HEAD bị hủy khi chuyển trang và request script bị chặn trong kịch bản tắt JavaScript; không dùng kiểm tra này để tuyên bố network hoàn toàn sạch.

## Điều kiện đưa lên tìm kiếm thật

1. Chủ site duyệt domain, dữ liệu, ảnh và nội dung còn gắn nhãn demo; giữ preview noindex. Thiết lập URL build và chỉ bật index sau phê duyệt.
2. Hosting phục vụ HTTPS, redirect chuẩn host/trailing slash, 404 thật, root robots; không chặn bot tìm kiếm bởi WAF/CDN. Chốt chính sách bot huấn luyện riêng.
3. Xác minh Search Console; URL Inspection kiểm tra HTML/canonical/noindex và gửi sitemap. Kiểm tra **Settings → Search generative AI** đang include hoặc kế thừa include. Hướng dẫn chính thức và giới hạn nằm trong [báo cáo nguồn](search-evidence.md).
4. Đo Page Indexing, Search performance theo trang/query, Generative AI impressions, CWV dữ liệu người dùng thật; đối chiếu lead thực sự được tiếp nhận. Chưa có dữ liệu để đặt mục tiêu thứ hạng có căn cứ.
