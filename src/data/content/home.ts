import type { HomeContent } from "@/types/home-content";
import { solutionPages } from "@/data/content/solutions";
import { servicePages } from "@/data/content/services";

export const homeContent = {
  hero: {
    title: "ƯƠM MẦM\nNĂNG LƯỢNG",
    tagline: "Tận tâm · Đồng hành · Chất lượng",
    description: "Lúa Xanh Đồng Bằng cung cấp giải pháp điện mặt trời từ khảo sát, thiết kế, thi công đến vận hành và bảo trì dài hạn. Mỗi hệ thống được xây dựng dựa trên nhu cầu sử dụng điện, điều kiện công trình và hiệu quả đầu tư thực tế.",
    primaryAction: { label: "KHẢO SÁT MIỄN PHÍ", href: "/khao-sat/" },
    image: "hero-workers.png",
    imageAlt: "Hình minh họa thi công hệ thống điện mặt trời",
    bottomImage: "solar-farm.webp",
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
  solutions: {
    heading: "GIẢI PHÁP CHUYÊN BIỆT\nCHO TỪNG NHÓM KHÁCH HÀNG",
    introduction: "Chọn nhóm khách hàng phù hợp để xem những thông tin cần cân nhắc trước khi khảo sát.",
    items: [
      { ...solutionPages.household.card, image: solutionPages.household.image, href: solutionPages.household.href, actionLabel: "Xem giải pháp ⟶" },
      { ...solutionPages.smallBusiness.card, image: solutionPages.smallBusiness.image, href: solutionPages.smallBusiness.href, actionLabel: "Xem giải pháp ⟶" },
      { ...solutionPages.enterprise.card, image: solutionPages.enterprise.image, href: solutionPages.enterprise.href, actionLabel: "Xem giải pháp ⟶" },
    ],
  },
  services: {
    heading: "CHÚNG TÔI CÓ THỂ GIÚP\nBẠN NHỮNG GÌ?",
    introduction: "Chúng tôi thiết kế và thi công trọn gói hệ thống điện mặt trời, cung cấp thiết bị, hoặc tư vấn mô hình đầu tư phù hợp.",
    items: [
      { title: servicePages.epc.rowTitle, href: servicePages.epc.href, image: servicePages.epc.image, points: servicePages.epc.points },
      { title: servicePages.equipmentSupply.rowTitle, href: servicePages.equipmentSupply.href, image: servicePages.equipmentSupply.image, points: servicePages.equipmentSupply.points },
      { title: servicePages.investmentModels.rowTitle, href: servicePages.investmentModels.href, image: servicePages.investmentModels.image, points: servicePages.investmentModels.points },
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
      { image: "solar-roof.webp", alt: "Hình minh họa hệ thống điện áp mái" },
      { image: "solar-farm.webp", alt: "Hình minh họa hệ thống điện mặt trời" },
      { image: "solar-farm.webp", alt: "Hình minh họa tấm pin mặt trời" },
    ],
  },
  featuredProjects: { heading: "DỰ ÁN TIÊU BIỂU", viewAllLabel: "XEM THÊM DỰ ÁN ❯", viewAllHref: "/du-an/" },
  testimonials: {
    title: "Chia sẻ từ khách hàng",
    description: "Trải nghiệm thực tế sẽ được cập nhật sau khi có nội dung được khách hàng xác nhận.",
    items: [],
  },
  equipmentOffer: { heading: "THIẾT BỊ ĐIỆN MẶT TRỜI", viewAllLabel: "Xem các nhóm thiết bị ⟶", viewAllHref: "/thiet-bi/" },
  faq: {
    heading: "CÂU HỎI THƯỜNG GẶP",
    introduction: "Giải đáp các băn khoăn phổ biến của chủ nhà và chủ doanh nghiệp trước khi quyết định đầu tư hệ thống điện mặt trời.",
    image: "faq-consult.png",
    imageAlt: "Hình minh họa tư vấn giải pháp điện mặt trời",
    actionLabel: "Tìm Hiểu Thêm",
    actionHref: "/khao-sat/",
    questions: [
      { title: "Hệ thống tấm pin mặt trời có bền không?", text: "Tấm pin thường được nhà sản xuất công bố tuổi thọ khoảng 25–30 năm. Tuổi thọ biến tần và thời hạn bảo hành phụ thuộc từng dòng thiết bị; việc lắp đặt và bảo trì đúng cách giúp hệ thống vận hành ổn định." },
      { title: "Mất bao lâu để hệ thống hoàn vốn?", text: "Thời gian hoàn vốn phụ thuộc vốn đầu tư, sản lượng điện, mức sử dụng điện ban ngày và giá điện. Chúng tôi sẽ ước tính riêng cho công trình sau khi khảo sát hiện trạng." },
      { title: "Có thể lắp đặt trên mái nhà cũ không?", text: "Có thể, nhưng cần kiểm tra kỹ lưỡng kết cấu mái. Chúng tôi sẽ đánh giá độ bền và đề xuất giải pháp phù hợp trong khảo sát miễn phí." },
    ],
  },
  contact: {
    heading: ["Muốn biết nhà bạn có", "phù hợp để lắp đặt không?"],
    description: "Liên hệ với chúng tôi để được tư vấn ngay.",
    actionLabel: "Hẹn lịch khảo sát miễn phí",
    actionHref: "/khao-sat/",
  },
} satisfies HomeContent;
