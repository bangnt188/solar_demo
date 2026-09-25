// Dữ liệu minh họa; thay bằng repository đọc Neon khi triển khai production.
export const projects = [
  {
    title: "Điện mặt trời áp mái nhà xưởng",
    category: "Công nghiệp",
    location: "Miền Nam",
    description: "Mô hình tận dụng mái nhà xưởng để tạo nguồn điện tại chỗ.",
    image: "solar-roof.png",
  },
  {
    title: "Trang trại điện mặt trời",
    category: "Quy mô lớn",
    location: "Đồng bằng sông Cửu Long",
    description: "Phương án khai thác không gian rộng với các dãy pin ngoài trời.",
    image: "solar-farm.png",
  },
] as const;

export const equipment = [
  {
    title: "Tấm pin năng lượng mặt trời",
    category: "Tấm pin",
    description: "Thiết bị chuyển đổi ánh sáng mặt trời thành điện năng.",
    image: "solar-farm.png",
  },
  {
    title: "Giải pháp điện mặt trời áp mái",
    category: "Hệ thống",
    description: "Tổ hợp tấm pin, biến tần và phụ kiện cho công trình áp mái.",
    image: "solar-roof.png",
  },
] as const;
