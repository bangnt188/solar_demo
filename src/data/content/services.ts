import type { DetailPageContent } from "@/types/detail-page";

export type ServiceDetail = DetailPageContent & {
  href: string;
  rowTitle: string;
  points: string[];
};

export const servicePages = {
  epc: {
    href: "/dich-vu/epc-tron-goi/",
    rowTitle: "EPC trọn gói",
    title: "Dịch vụ EPC điện mặt trời trọn gói",
    lead: "Tư vấn, khảo sát, thiết kế, thi công và bàn giao được xem xét theo nhu cầu sử dụng điện cùng điều kiện thực tế của từng công trình.",
    overviewTitle: "Phạm vi EPC được xác định theo công trình",
    overview: "Trước khi xác định cấu hình hoặc chi phí, cần làm rõ mục tiêu sử dụng điện, hiện trạng mái, hạ tầng điện và phạm vi công việc mong muốn.",
    image: "solar-roof.webp",
    imageAlt: "Hình minh họa hệ thống điện mặt trời trên mái nhà",
    note: "Nội dung giới thiệu tạm. Phạm vi, thiết bị, tiến độ, chi phí và trách nhiệm từng bên cần được xác nhận theo khảo sát và thỏa thuận cụ thể.",
    points: ["Tư Vấn & Khảo Sát Hiện Trạng", "Thiết kế kỹ thuật chuyên sâu", "Thi công & Lắp đặt chuẩn hóa", "Cung Cấp Thiết bị", "Vận Hành & Bảo Trì (O&M)"],
    considerations: [
      { title: "Nhu cầu sử dụng điện", text: "Hóa đơn, phụ tải và thời điểm sử dụng điện là đầu vào để xem xét quy mô hệ thống." },
      { title: "Điều kiện công trình", text: "Mái, kết cấu, vị trí lắp đặt và hạ tầng điện cần được khảo sát trước khi chốt thiết kế." },
      { title: "Phạm vi triển khai", text: "Các hạng mục thiết kế, cung ứng, thi công, nghiệm thu và hỗ trợ sau bàn giao cần được thống nhất rõ." },
    ],
    steps: [
      { title: "Trao đổi và thu thập dữ liệu", text: "Ghi nhận mục tiêu, hóa đơn điện, hiện trạng và yêu cầu của chủ đầu tư." },
      { title: "Khảo sát và đề xuất", text: "Đánh giá điều kiện kỹ thuật rồi lập phương án cùng phạm vi dự kiến." },
      { title: "Thống nhất triển khai", text: "Xác nhận thiết kế, thiết bị, tiến độ và điều khoản trước khi thực hiện." },
    ],
  },
  equipmentSupply: {
    href: "/dich-vu/cung-ung-thiet-bi/",
    rowTitle: "Phân phối và cung ứng thiết bị điện mặt trời.",
    title: "Dịch vụ phân phối và cung ứng thiết bị điện mặt trời",
    lead: "Danh mục và cấu hình thiết bị cần được lựa chọn theo yêu cầu kỹ thuật, công trình và khả năng cung ứng tại thời điểm xác nhận.",
    overviewTitle: "Thiết bị phù hợp với cấu hình đã được xác nhận",
    overview: "Việc lựa chọn tấm pin, biến tần, hệ khung và phụ kiện cần dựa trên thiết kế, điều kiện lắp đặt và yêu cầu vận hành của hệ thống.",
    image: "solar-farm.webp",
    imageAlt: "Hình minh họa hệ thống điện mặt trời quy mô lớn",
    note: "Ảnh và danh mục chỉ mang tính minh họa. Mã hàng, thương hiệu, xuất xứ, tồn kho, giá và điều kiện bảo hành cần xác nhận tại thời điểm báo giá.",
    points: ["Tấm pin năng lượng mặt trời", "Bộ biến tần", "Hệ khung & phụ kiện lắp đặt"],
    considerations: [
      { title: "Thông số kỹ thuật", text: "Công suất, điện áp và khả năng tương thích cần đối chiếu với thiết kế hệ thống." },
      { title: "Điều kiện công trình", text: "Môi trường lắp đặt và phương án kết cấu ảnh hưởng đến lựa chọn thiết bị, khung và phụ kiện." },
      { title: "Tình trạng cung ứng", text: "Mã hàng, xuất xứ, tồn kho, giá và bảo hành cần được xác nhận trước khi đặt hàng." },
    ],
    steps: [
      { title: "Tiếp nhận yêu cầu", text: "Làm rõ chủng loại, số lượng, thông số và thời điểm cần thiết bị." },
      { title: "Đối chiếu cấu hình", text: "Kiểm tra tính phù hợp với thiết kế và các thiết bị khác trong hệ thống." },
      { title: "Xác nhận báo giá", text: "Thống nhất mã hàng, khả năng cung ứng, giá và điều kiện giao nhận." },
    ],
  },
  investmentModels: {
    href: "/dich-vu/mo-hinh-tai-chinh/",
    rowTitle: "Các mô hình tài chính/đầu tư",
    title: "Tư vấn mô hình tài chính và đầu tư điện mặt trời",
    lead: "Các hình thức tự đầu tư, cho thuê thiết bị hoặc mua bán điện cần được so sánh theo mục tiêu, dữ liệu tiêu thụ và điều kiện áp dụng của từng dự án.",
    overviewTitle: "So sánh mô hình trên dữ liệu dự án",
    overview: "Đánh giá ban đầu cần dùng dữ liệu phụ tải, lịch vận hành, chi phí dự kiến và cơ sở pháp lý liên quan; kết quả không thể suy ra từ một mô hình chung.",
    image: "solar-roof.webp",
    imageAlt: "Hình minh họa hệ thống điện mặt trời trên mái công trình",
    note: "Nội dung giới thiệu tạm, không phải cam kết lợi nhuận hay tư vấn pháp lý. Tính khả thi, chi phí, hợp đồng và điều kiện áp dụng cần được thẩm định theo dự án.",
    points: ["Tự sản – tự tiêu", "Cho thuê thiết bị", "DPPA / bán điện trực tiếp"],
    considerations: [
      { title: "Dữ liệu tiêu thụ", text: "Phụ tải, lịch sử hóa đơn và khung giờ vận hành là cơ sở để so sánh các phương án." },
      { title: "Nguồn vốn và phân bổ chi phí", text: "Khả năng đầu tư, chi phí vận hành và trách nhiệm giữa các bên cần được làm rõ." },
      { title: "Điều kiện hợp đồng và pháp lý", text: "Mô hình hợp tác, mua bán điện và hồ sơ áp dụng cần được rà soát theo quy định hiện hành." },
    ],
    steps: [
      { title: "Thu thập dữ liệu dự án", text: "Tổng hợp phụ tải, mục tiêu đầu tư, hiện trạng và các giả định chi phí." },
      { title: "So sánh lựa chọn", text: "Đối chiếu mô hình theo quyền sở hữu, phân bổ chi phí, rủi ro và trách nhiệm vận hành." },
      { title: "Rà soát điều kiện áp dụng", text: "Xác nhận tính khả thi và các nội dung cần chuyên gia pháp lý, tài chính thẩm định." },
    ],
  },
} satisfies Record<string, ServiceDetail>;
