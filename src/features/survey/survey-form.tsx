"use client";

import type { FormEvent } from "react";

export function SurveyForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Họ và tên: ${data.get("name")}`,
      `Số điện thoại: ${data.get("phone")}`,
      `Địa điểm công trình: ${data.get("location")}`,
      `Loại công trình: ${data.get("building")}`,
      `Tiền điện hằng tháng: ${data.get("bill")}`,
      `Ghi chú: ${data.get("note") || "Không có"}`,
    ].join("\r\n");
    window.location.href = `mailto:lienhe@luaxanhdongbang.vn?subject=${encodeURIComponent("Yêu cầu khảo sát điện mặt trời")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <div className="survey-fields">
        <label>Họ và tên <span>*</span><input name="name" autoComplete="name" required placeholder="Nguyễn Văn A" /></label>
        <label>Số điện thoại <span>*</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Số điện thoại liên hệ" /></label>
        <label className="survey-wide">Địa điểm công trình <span>*</span><input name="location" autoComplete="street-address" required placeholder="Địa chỉ hoặc khu vực cần khảo sát" /></label>
        <label>Loại công trình <span>*</span><select name="building" required defaultValue=""><option value="" disabled>Chọn loại công trình</option><option>Hộ gia đình</option><option>Hộ kinh doanh</option><option>Doanh nghiệp / nhà xưởng</option></select></label>
        <label>Tiền điện hằng tháng <span>*</span><select name="bill" required defaultValue=""><option value="" disabled>Chọn khoảng chi phí</option><option>Dưới 2 triệu đồng</option><option>2–5 triệu đồng</option><option>5–20 triệu đồng</option><option>Trên 20 triệu đồng</option><option>Chưa rõ</option></select></label>
        <label className="survey-wide">Nhu cầu khác (nếu có)<textarea name="note" rows={4} placeholder="Ví dụ: diện tích mái, hệ thống lưu trữ, thời gian có thể liên hệ" /></label>
      </div>
      <p className="survey-disclaimer">Khi bấm gửi, ứng dụng email trên thiết bị của bạn sẽ mở bản nháp. Hãy kiểm tra và gửi email để hoàn tất yêu cầu; website không tự gửi hoặc lưu thông tin.</p>
      <button className="button" type="submit">Soạn email yêu cầu khảo sát →</button>
    </form>
  );
}
