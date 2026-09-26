import type { SurveyScreenContent } from "@/types/survey-content";

export const surveyContent = {
  eyebrow: "Lúa Xanh Đồng Bằng",
  title: "Khảo sát nhu cầu điện mặt trời",
  introduction: "Cho chúng tôi biết thông tin công trình để chuẩn bị phương án tư vấn phù hợp.",
  formHeading: "Bắt đầu từ nhu cầu của bạn",
  formDescription: "Cung cấp thông tin cơ bản; đội ngũ sẽ liên hệ để trao đổi và hẹn lịch khảo sát thực tế.",
  form: {
    recipient: "lienhe@luaxanhdongbang.vn",
    subject: "Yêu cầu khảo sát điện mặt trời",
    nameLabel: "Họ và tên",
    phoneLabel: "Số điện thoại",
    locationLabel: "Địa điểm công trình",
    buildingLabel: "Loại công trình",
    billLabel: "Tiền điện hằng tháng",
    noteLabel: "Nhu cầu khác (nếu có)",
    namePlaceholder: "Nguyễn Văn A",
    phonePlaceholder: "Số điện thoại liên hệ",
    locationPlaceholder: "Địa chỉ hoặc khu vực cần khảo sát",
    notePlaceholder: "Ví dụ: diện tích mái, hệ thống lưu trữ, thời gian có thể liên hệ",
    buildingOptions: ["Hộ gia đình", "Hộ kinh doanh", "Doanh nghiệp / nhà xưởng"],
    billOptions: ["Dưới 2 triệu đồng", "2–5 triệu đồng", "5–20 triệu đồng", "Trên 20 triệu đồng", "Chưa rõ"],
    disclaimer: "Khi bấm gửi, ứng dụng email trên thiết bị của bạn sẽ mở bản nháp. Hãy kiểm tra và gửi email để hoàn tất yêu cầu; website không tự gửi hoặc lưu thông tin.",
    submitLabel: "Soạn email yêu cầu khảo sát →",
  },
} satisfies SurveyScreenContent;
