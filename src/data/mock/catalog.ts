// Dữ liệu minh họa; thay bằng repository đọc Neon khi triển khai production.
export const projects = [
  { title: "MINI HOUSE THÁI THẢO", category: "Hộ kinh doanh", location: "Khu ĐTM An Bình, TP. Cần Thơ", description: "Công Suất Lắp Đặt: 38 KWP", system: "Hòa lưới lưu trữ", image: "solar-roof.png" },
  { title: "LE GRANDE CENTRE", category: "Hộ kinh doanh", location: "18 Nguyễn Chí Thanh, Sóc Trăng, TP. Cần Thơ", description: "Công Suất Lắp Đặt: 400 KWP và 429 KWP lưu trữ", system: "Hòa lưới lưu trữ", image: "solar-farm.png" },
  { title: "CÔNG TY TNHH NƯỚC ĐÁ HƯNG THỊNH", category: "Cơ sở sản xuất", location: "Quận Ô Môn, TP. Cần Thơ", description: "Công Suất Lắp Đặt: 150 KWP", system: "Hòa lưới bám tải", image: "solar-roof.png" },
  { title: "NHÀ ANH NGUYỄN", category: "Hộ gia đình", location: "B08 Khu Thủy Dương, Cái Khế, TP. Cần Thơ", description: "Công Suất Lắp Đặt: 36 KWP và 48 KWP lưu trữ", system: "Hòa lưới lưu trữ", image: "solar-farm.png" },
  { title: "ĐIỆN MÁY XANH CAO LÃNH", category: "Showroom", location: "1 Đường 30/4, Phường Cao Lãnh, Tỉnh Đồng Tháp", description: "Công Suất Lắp Đặt: 300 KWP", system: "Hòa lưới bám tải", image: "solar-roof.png" },
  { title: "SÀI GÒN BAKERY", category: "Hộ kinh doanh", location: "Phường Ninh Kiều, TP. Cần Thơ", description: "Công Suất Lắp Đặt: 43 KWP", system: "Hòa lưới lưu trữ", image: "solar-farm.png" },
] as const;

export const equipment = [
  { title: "Residential Hybrid Inverter", category: "Biến tần", description: "1.2–30kW flexible & reliable energy storage solution for every home", image: "solar-roof.png" },
  { title: "C&I Hybrid Inverter", category: "Biến tần", description: "29.9–150kW high voltage, Next-Gen full SiC technology", image: "solar-farm.png" },
  { title: "Hybrid Inverter Cabinet", category: "Tủ biến tần", description: "All-in-one 125–500kW hybrid inverter for advanced systems", image: "solar-roof.png" },
  { title: "PCS", category: "Lưu trữ", description: "Well-designed 100–235kW PCS for large-scale energy storage", image: "solar-farm.png" },
] as const;
