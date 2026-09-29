import type { ServiceOverviewContent } from "@/types/service-overview";

export const serviceOverviewContent = {
  title: "TỔNG THẦU EPC & DỊCH VỤ NĂNG LƯỢNG",
  introduction: "Lúa Xanh Đồng Bằng đảm nhận toàn bộ chu trình dự án điện mặt trời mái nhà. Chúng tôi chịu trách nhiệm duy nhất và xuyên suốt về thiết kế kỹ thuật, chất lượng cơ điện và sản lượng phát điện thực tế.",
  image: "solar-roof.webp",
  imageAlt: "Nhân viên kỹ thuật lắp đặt hệ thống pin mặt trời",
  stages: [
    {
      title: "KHẢO SÁT ĐO ĐẠC HIỆN TRẠNG",
      turnaround: "Trong vòng 24 giờ sau khi tiếp nhận yêu cầu",
      image: "solar-farm.webp",
      imageAlt: "Hệ thống tấm pin mặt trời tại công trình",
      details: [
        "Đo góc nghiêng và diện tích khả dụng của mặt bằng mái.",
        "Kiểm tra kết cấu chịu lực.",
        "Ghi nhận hướng nắng, thời lượng giờ nắng và bóng râm.",
        "Phân tích biểu đồ phụ tải và lịch sử 12 tháng của hóa đơn tiền điện EVN gần nhất.",
      ],
    },
    {
      title: "MÔ PHỎNG 3D & BÁO GIÁ",
      turnaround: "1–2 ngày làm việc sau khi khảo sát",
      image: "solar-roof.webp",
      imageAlt: "Kỹ thuật viên làm việc trên hệ thống pin mặt trời",
      details: [
        "Mô phỏng đường đi mặt trời và bóng đổ.",
        "Lựa chọn cấu hình tấm pin và phân bổ số lượng MPPT của biến tần tối ưu.",
        "Thiết kế sơ đồ nguyên lý và phương án bảo vệ chống sét lan truyền.",
        "Lập bảng tính hoàn vốn chi tiết.",
      ],
    },
    {
      title: "THI CÔNG HOÀN THIỆN ĐÓNG ĐIỆN",
      turnaround: "2–5 ngày (hộ gia đình) hoặc 7–15 ngày (doanh nghiệp)",
      image: "solar-farm.webp",
      imageAlt: "Các tấm pin mặt trời trên hệ thống đã lắp đặt",
      details: [
        "Khung nhôm chống ăn mòn, phù hợp môi trường ven sông.",
        "Bộ kẹp và liên kết chuyên dụng, đảm bảo chắc chắn và chống dột mái.",
        "Cáp Solar DC chống cháy, đi trong ống bảo vệ chịu tia UV.",
        "Kiểm tra hệ thống tiếp địa, đảm bảo điện trở < 4Ω cho hệ thống điện và < 10Ω cho chống sét.",
      ],
    },
    {
      title: "ĐỒNG HÀNH GIÁM SÁT & BẢO HÀNH",
      turnaround: "Bàn giao trong 1 ngày, theo dõi đồng hành 25 năm",
      image: "solar-roof.webp",
      imageAlt: "Kỹ thuật viên làm việc trên hệ thống pin mặt trời",
      details: [
        "Cài đặt ứng dụng giám sát thời gian thực trên smartphone.",
        "Nhân sự phụ trách tình huống khẩn cấp và bảo dưỡng tấm pin định kỳ.",
        "Bàn giao đầy đủ hồ sơ hoàn công, catalog thiết bị, chứng thư bảo hành chính hãng.",
        "Định kỳ 6 tháng một lần, kỹ thuật viên đến kiểm tra siết bulong và đo dòng điện.",
      ],
    },
  ],
} satisfies ServiceOverviewContent;
