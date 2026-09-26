import type { HomeContent } from "@/types/home-content";

export const homeContent = {
  hero: {
    title: "ƯƠM MẦM\nNĂNG LƯỢNG",
    tagline: "Tận tâm · Đồng hành · Chất lượng",
    description: "Lúa Xanh Đồng Bằng cung cấp giải pháp điện mặt trời từ khảo sát, thiết kế, thi công đến vận hành và bảo trì dài hạn. Mỗi hệ thống được xây dựng dựa trên nhu cầu sử dụng điện, điều kiện công trình và hiệu quả đầu tư thực tế.",
    primaryAction: { label: "KHẢO SÁT MIỄN PHÍ", href: "/khao-sat/" },
    secondaryAction: { label: "DỰ ÁN THỰC TẾ", href: "/du-an/" },
    image: "solar-roof.png",
    imageAlt: "Hình minh họa thi công hệ thống điện mặt trời",
    bottomImage: "solar-farm.png",
  },
  partners: {
    title: "Đối Tác\nChiến Lược",
    brandsLabel: "Đối tác trong mẫu thiết kế",
    brands: [
      { name: "AIKO", emphasis: false },
      { name: "BYD", emphasis: true },
      { name: "HUAWEI", emphasis: false },
      { name: "solis", emphasis: true },
      { name: "SMA", emphasis: false },
      { name: "LONGi", emphasis: true },
      { name: "CanadianSolar", emphasis: false },
      { name: "SUNGROW", emphasis: false },
      { name: "AESOLAR", emphasis: false },
    ],
  },
  services: {
    heading: "CHÚNG TÔI LÀM GÌ",
    introduction: "Công ty TNHH Lúa Xanh Đồng Bằng được thành lập với định vị là đối tác thực thi toàn diện trong lĩnh vực điện mặt trời áp mái. Lúa Xanh Đồng Bằng không chỉ là nhà thầu EPC, chúng tôi cung cấp giải pháp tư vấn pháp lý trọn gói. Đội ngũ chuyên trách của chúng tôi am hiểu sâu sắc quy định của EVN, sẵn sàng đại diện chủ đầu tư xử lý toàn bộ các thủ tục phức tạp.",
    items: [
      { title: "EPC trọn gói", image: "solar-roof.png", points: ["Tư Vấn & Khảo Sát Hiện Trạng", "Thiết kế kỹ thuật chuyên sâu", "Thi công & Lắp đặt chuẩn hóa", "Cung Cấp Thiết bị", "Vận Hành & Bảo Trì (O&M)"] },
      { title: "Phân phối và cung ứng thiết bị điện mặt trời.", image: "solar-farm.png", points: ["Tấm pin năng lượng mặt trời", "Bộ biến tần", "Hệ khung & phụ kiện lắp đặt"] },
      { title: "Các mô hình tài chính/đầu tư", image: "solar-roof.png", points: ["Tự sản – tự tiêu", "Cho thuê thiết bị", "DPPA / bán điện trực tiếp"] },
    ],
  },
  solutions: {
    heading: "GIẢI PHÁP CHUYÊN BIỆT\nCHO TỪNG NHÓM KHÁCH HÀNG",
    introduction: "Mỗi giải pháp đều được thiết kế riêng theo nhu cầu thực tế của từng khách hàng. Hãy cho Lúa Xanh Đồng Bằng biết bạn là ai và điều bạn cần. Chúng tôi sẽ giúp bạn tìm ra phương án phù hợp nhất.",
    items: [
      { title: "Hộ gia đình", text: "Giảm hóa đơn điện hàng tháng, hệ gọn và an toàn cho mái nhà.", image: "solar-roof.png", icon: "⌂", actionLabel: "Xem chi tiết giải pháp ⟶" },
      { title: "Hộ kinh doanh vừa & nhỏ", text: "Hiệu quả phụ thuộc vào giờ vận hành. Tính phương án dựa trên hóa đơn điện và khung giờ dùng điện.", image: "solar-farm.png", icon: "⚙", actionLabel: "Xem chi tiết giải pháp ⟶" },
      { title: "Doanh nghiệp & công nghiệp", text: "Triển khai theo quy trình EPC, có hồ sơ kỹ thuật và hỗ trợ thủ tục đấu nối, PCCC, đo đếm theo quy định.", image: "solar-roof.png", icon: "▤", actionLabel: "Xem chi tiết giải pháp ⟶" },
    ],
  },
  whyUs: {
    heading: "VÌ SAO CHỌN LÚA XANH ĐỒNG BẰNG",
    banner: "GIẢI PHÁP PHÙ HỢP · VẬN HÀNH BỀN VỮNG · GIÁ TRỊ DÀI HẠN",
    paragraphs: [
      "Lúa Xanh Đồng Bằng lấy an toàn kỹ thuật, chất lượng triển khai và hiệu quả sử dụng thực tế làm nền tảng cho mỗi công trình. Chúng tôi không áp dụng một cấu hình cố định, mà cân nhắc đặc điểm sử dụng điện, điều kiện công trình và mục tiêu của từng khách hàng.",
      "Thông qua quy trình làm việc rõ ràng, thiết bị phù hợp và hỗ trợ sau bàn giao, Lúa Xanh Đồng Bằng hướng đến những hệ thống vận hành ổn định, dễ quản lý và mang lại giá trị lâu dài.",
    ],
    images: [
      { image: "solar-roof.png", alt: "Hình minh họa hệ thống điện áp mái" },
      { image: "solar-farm.png", alt: "Hình minh họa hệ thống điện mặt trời" },
      { image: "solar-farm.png", alt: "Hình minh họa tấm pin mặt trời" },
    ],
  },
  featuredProjects: { heading: "DỰ ÁN TIÊU BIỂU", viewAllLabel: "XEM TẤT CẢ CÁC DỰ ÁN ⟶", viewAllHref: "/du-an/" },
  equipmentOffer: { heading: "THIẾT BỊ & GIẢI PHÁP LƯU TRỮ", viewAllLabel: "Xem tất cả sản phẩm ⟶", viewAllHref: "/thiet-bi/" },
  faq: {
    heading: "CÂU HỎI THƯỜNG GẶP",
    introduction: "Giải đáp các băn khoăn phổ biến của chủ nhà và chủ doanh nghiệp trước khi quyết định đầu tư hệ thống điện mặt trời.",
    image: "solar-farm.png",
    imageAlt: "Hình minh họa trang trại điện mặt trời",
    actionLabel: "Tìm hiểu khảo sát",
    actionHref: "/khao-sat/",
    questions: [
      { title: "Hệ thống tấm pin mặt trời có bền không?", text: "Tấm pin thường được nhà sản xuất công bố tuổi thọ khoảng 25–30 năm. Tuổi thọ biến tần và thời hạn bảo hành phụ thuộc từng dòng thiết bị; việc lắp đặt và bảo trì đúng cách giúp hệ thống vận hành ổn định." },
      { title: "Mất bao lâu để hệ thống hoàn vốn?", text: "Thời gian hoàn vốn phụ thuộc vốn đầu tư, sản lượng điện, mức sử dụng điện ban ngày và giá điện. Chúng tôi sẽ ước tính riêng cho công trình sau khi khảo sát hiện trạng." },
      { title: "Có thể lắp đặt trên mái nhà cũ không?", text: "Có thể, nhưng cần kiểm tra kỹ lưỡng kết cấu mái. Chúng tôi sẽ đánh giá độ bền và đề xuất giải pháp phù hợp trong khảo sát miễn phí." },
    ],
  },
  contact: {
    heading: ["MUỐN BIẾT NHÀ BẠN CÓ PHÙ HỢP", "ĐỂ LẮP ĐẶT KHÔNG?"],
    description: "Liên hệ với chúng tôi hôm nay. Đội kỹ thuật sẽ đến tận nơi trong 48 giờ.",
    actionLabel: "Hẹn lịch khảo sát miễn phí",
    actionHref: "/khao-sat/",
  },
} satisfies HomeContent;
