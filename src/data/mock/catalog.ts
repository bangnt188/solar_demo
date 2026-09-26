import type { Equipment, Project } from "@/types/catalog";

// Nội dung local cho bản demo: dự án có thật; ảnh hiển thị chỉ là hình minh họa.
export const projects = [
  { title: "MINI HOUSE THÁI THẢO", category: "Hộ kinh doanh", location: "Khu ĐTM An Bình, TP. Cần Thơ", description: "Công suất lắp đặt: 38 kWp", system: "Hòa lưới lưu trữ", image: "solar-roof.webp" },
  { title: "LE GRANDE CENTRE", category: "Hộ kinh doanh", location: "18 Nguyễn Chí Thanh, Sóc Trăng, TP. Cần Thơ", description: "Công suất lắp đặt: 400 kWp; lưu trữ: 429 kWh", system: "Hòa lưới lưu trữ", image: "solar-farm.webp" },
  { title: "CÔNG TY TNHH NƯỚC ĐÁ HƯNG THỊNH", category: "Cơ sở sản xuất", location: "Quận Ô Môn, TP. Cần Thơ", description: "Công suất lắp đặt: 150 kWp", system: "Hòa lưới bám tải", image: "solar-roof.webp" },
  { title: "NHÀ ANH NGUYỄN", category: "Hộ gia đình", location: "B08 Khu Thủy Dương, Cái Khế, TP. Cần Thơ", description: "Công suất lắp đặt: 36 kWp; lưu trữ: 48 kWh", system: "Hòa lưới lưu trữ", image: "solar-farm.webp" },
  { title: "ĐIỆN MÁY XANH CAO LÃNH", category: "Phòng trưng bày", location: "1 Đường 30/4, Phường Cao Lãnh, Tỉnh Đồng Tháp", description: "Công suất lắp đặt: 300 kWp", system: "Hòa lưới bám tải", image: "solar-roof.webp" },
  { title: "SÀI GÒN BAKERY", category: "Hộ kinh doanh", location: "Phường Ninh Kiều, TP. Cần Thơ", description: "Công suất lắp đặt: 43 kWp", system: "Hòa lưới lưu trữ", image: "solar-farm.webp" },
] as const satisfies readonly Project[];

export const equipment = [
  { title: "Biến tần lai cho hộ gia đình", category: "Biến tần", description: "Giải pháp biến tần kết hợp lưu trữ công suất 1,2–30 kW cho hộ gia đình.", image: "solar-roof.webp" },
  { title: "Biến tần lai cho doanh nghiệp", category: "Biến tần", description: "Dải công suất 29,9–150 kW, điện áp cao và công nghệ bán dẫn SiC.", image: "solar-farm.webp" },
  { title: "Tủ biến tần lai", category: "Tủ biến tần", description: "Tích hợp biến tần và thiết bị hỗ trợ cho hệ thống công suất 125–500 kW.", image: "solar-roof.webp" },
  { title: "Bộ chuyển đổi công suất (PCS)", category: "Lưu trữ", description: "Bộ chuyển đổi công suất 100–235 kW cho hệ thống lưu trữ điện quy mô lớn.", image: "solar-farm.webp" },
] as const satisfies readonly Equipment[];
