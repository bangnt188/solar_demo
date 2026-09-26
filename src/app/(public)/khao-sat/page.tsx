import { SurveyForm } from "@/features/survey/survey-form";

export default function SurveyPage() {
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <span className="eyebrow">Lúa Xanh Đồng Bằng</span>
          <h1>Khảo sát nhu cầu điện mặt trời</h1>
          <p>Cho chúng tôi biết thông tin công trình để chuẩn bị phương án tư vấn phù hợp.</p>
        </div>
      </section>
      <section className="section container survey-section">
        <div>
          <h2>Bắt đầu từ nhu cầu của bạn</h2>
          <p>Cung cấp thông tin cơ bản; đội ngũ sẽ liên hệ để trao đổi và hẹn lịch khảo sát thực tế.</p>
          <p>Biểu mẫu demo sẽ mở ứng dụng email với nội dung đã điền. Không có dữ liệu nào được lưu trên website này.</p>
        </div>
        <SurveyForm />
      </section>
    </>
  );
}
