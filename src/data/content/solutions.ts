import type { DetailPageContent } from "@/types/detail-page";

export type SolutionDetail = DetailPageContent & {
  href: string;
  card: { title: string; text: string; icon: string };
};

export const solutionPages = {
  household: {
    href: "/giai-phap/ho-gia-dinh/",
    title: "Giải pháp điện mặt trời cho hộ gia đình",
    image: "solar-roof.webp",
    card: {
      title: "Giải pháp hộ gia đình",
      text: "Cân đối theo hóa đơn điện, thói quen sử dụng và điều kiện mái nhà.",
      icon: "⌂",
    },
    lead: "Mỗi gia đình có mức sử dụng điện và điều kiện mái khác nhau. Phương án cần bắt đầu từ nhu cầu thực tế, không áp một cấu hình chung cho mọi ngôi nhà.",
    overviewTitle: "Phương án bắt đầu từ nhu cầu thực tế",
    overview: "Điểm khởi đầu là xem gia đình dùng điện vào thời điểm nào, mái nhà có điều kiện ra sao và hệ thống cần đáp ứng mục tiêu gì.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời trên mái nhà",
    note: "Nội dung giới thiệu sơ bộ. Cấu hình, sản lượng, thiết bị, chi phí và tiến độ cần được xác định sau khi khảo sát công trình.",
    considerations: [
      { title: "Nhu cầu sử dụng", text: "Thời điểm gia đình dùng điện và hóa đơn gần đây giúp xác định phụ tải cần xem xét." },
      { title: "Điều kiện mái nhà", text: "Diện tích, hướng mái, vật liệu và hiện trạng kết cấu cần được kiểm tra trước khi thiết kế." },
      { title: "Mục tiêu đầu tư", text: "Nhu cầu tự sử dụng, dự phòng hoặc cân nhắc lưu trữ sẽ ảnh hưởng đến cấu hình được đề xuất." },
    ],
    steps: [
      { title: "Trao đổi nhu cầu", text: "Ghi nhận hóa đơn điện, khung giờ sử dụng và mong muốn của gia đình." },
      { title: "Khảo sát công trình", text: "Đánh giá mái nhà, vị trí lắp đặt và các điều kiện kỹ thuật liên quan." },
      { title: "Đề xuất phương án", text: "Thống nhất cấu hình, thiết bị và chi phí sau khi có đủ dữ liệu khảo sát." },
    ],
  },
  smallBusiness: {
    href: "/giai-phap/ho-kinh-doanh/",
    title: "Giải pháp điện mặt trời cho hộ kinh doanh vừa và nhỏ",
    image: "solar-farm.webp",
    card: {
      title: "Giải pháp hộ kinh doanh vừa & nhỏ",
      text: "Xem xét giờ vận hành, phụ tải ban ngày và diện tích mái trước khi đề xuất hệ thống.",
      icon: "⚙",
    },
    lead: "Với cửa hàng, xưởng nhỏ và cơ sở dịch vụ, thời gian hoạt động ảnh hưởng trực tiếp đến cách xem xét phương án điện mặt trời. Cần đối chiếu giờ vận hành với nhu cầu điện thực tế của cơ sở.",
    overviewTitle: "Đối chiếu giờ vận hành với nhu cầu điện",
    overview: "Việc đối chiếu giờ hoạt động với hồ sơ điện giúp xác định dữ liệu còn thiếu trước khi so sánh phương án cho cơ sở.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời cho cơ sở kinh doanh",
    note: "Nội dung giới thiệu sơ bộ. Quy mô, cấu hình, thiết bị, chi phí và tiến độ cần được xác định sau khi khảo sát cơ sở.",
    considerations: [
      { title: "Khung giờ vận hành", text: "Ngày và ca hoạt động cho biết khi nào cơ sở sử dụng điện và cần đối chiếu với sản lượng dự kiến." },
      { title: "Phụ tải và hóa đơn", text: "Thiết bị đang dùng, công suất vận hành và lịch sử hóa đơn là đầu vào cho bước đánh giá." },
      { title: "Mặt bằng lắp đặt", text: "Diện tích mái, vật cản và hiện trạng công trình được khảo sát trước khi xác định quy mô." },
    ],
    steps: [
      { title: "Thu thập thông tin", text: "Tổng hợp hóa đơn, giờ hoạt động và các thiết bị tiêu thụ điện chính." },
      { title: "Khảo sát mặt bằng", text: "Kiểm tra mái, vị trí thiết bị và điều kiện thi công tại cơ sở." },
      { title: "So sánh phương án", text: "Đối chiếu phương án với nhu cầu vận hành và dữ liệu thực tế trước khi chốt thiết kế." },
    ],
  },
  enterprise: {
    href: "/giai-phap/doanh-nghiep/",
    title: "Giải pháp điện mặt trời cho doanh nghiệp và công nghiệp",
    image: "solar-roof.webp",
    card: {
      title: "Giải pháp doanh nghiệp & công nghiệp",
      text: "Khảo sát phụ tải, mặt bằng, yêu cầu kỹ thuật và quy trình phối hợp của công trình.",
      icon: "▤",
    },
    lead: "Công trình doanh nghiệp cần được xem xét cùng phụ tải, lịch sản xuất, hạ tầng điện và yêu cầu vận hành. Phạm vi thiết kế và triển khai chỉ có thể xác định sau khi rà soát dữ liệu của từng địa điểm.",
    overviewTitle: "Phạm vi kỹ thuật theo từng công trình",
    overview: "Phân tích phụ tải, hiện trạng kết cấu và điều kiện đấu nối là cơ sở để xác định phạm vi kỹ thuật của dự án.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời quy mô doanh nghiệp",
    note: "Nội dung giới thiệu sơ bộ. Phạm vi kỹ thuật, thiết bị, chi phí, tiến độ và yêu cầu tuân thủ cần được xác định theo từng công trình.",
    considerations: [
      { title: "Phụ tải và lịch sản xuất", text: "Dữ liệu tiêu thụ theo thời gian giúp đánh giá mức độ phù hợp với nhu cầu vận hành của nhà máy." },
      { title: "Hạ tầng và mặt bằng", text: "Kết cấu mái, hệ thống điện hiện hữu và điều kiện tiếp cận công trình cần được khảo sát." },
      { title: "Yêu cầu dự án", text: "Phạm vi EPC, hồ sơ kỹ thuật và các yêu cầu đấu nối, an toàn hoặc PCCC cần đối chiếu theo công trình và quy định áp dụng." },
    ],
    steps: [
      { title: "Rà soát dữ liệu", text: "Tiếp nhận hồ sơ phụ tải, lịch sản xuất và thông tin hạ tầng hiện hữu." },
      { title: "Khảo sát kỹ thuật", text: "Đánh giá mặt bằng, kết cấu, hệ thống điện và yêu cầu phối hợp của doanh nghiệp." },
      { title: "Thống nhất phạm vi", text: "Xác định giải pháp kỹ thuật, hồ sơ và tiến độ sau khi hoàn tất bước đánh giá." },
    ],
  },
} satisfies Record<string, SolutionDetail>;
