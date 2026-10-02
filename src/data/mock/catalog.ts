import type { Equipment, Project } from "@/types/catalog";

// Nội dung local cho bản demo: dự án và ảnh công trình thật do người dùng cung cấp.
export const projects = [
  { title: "MINI HOUSE THÁI THẢO", category: "Hộ kinh doanh", location: "Khu ĐTM An Bình, TP. Cần Thơ", description: "Công suất lắp đặt: 38 KWP", system: "Hòa lưới lưu trữ", image: "proj-1.png" },
  { title: "LE GRANDE CENTRE", category: "Hộ kinh doanh", location: "18 Nguyễn Chí Thanh, Sóc Trăng, TP. Cần Thơ", description: "Công suất lắp đặt: 400 KWP và 429 KWP lưu trữ", system: "Hòa lưới lưu trữ", image: "proj-2.png" },
  { title: "CÔNG TY TNHH NƯỚC ĐÁ HƯNG THỊNH", category: "Cơ sở sản xuất", location: "Quận Ô Môn, TP. Cần Thơ", description: "Công suất lắp đặt: 150 KWP", system: "Hòa lưới bám tải", image: "proj-3.png" },
  { title: "NHÀ ANH NGUYỄN", category: "Hộ gia đình", location: "B08 Khu Thủy Dương, Cái Khế, TP. Cần Thơ", description: "Công suất lắp đặt: 36 KWP và 48KWP lưu trữ", system: "Hòa lưới lưu trữ", image: "proj-4.png" },
  { title: "ĐIỆN MÁY XANH CAO LÃNH", category: "Showroom", location: "1 Đường 30/4, Phường Cao Lãnh, Tỉnh Đồng Tháp", description: "Công suất lắp đặt: 300 KWP", system: "Hòa lưới bám tải", image: "proj-5.png" },
  { title: "SÀI GÒN BAKERY", category: "Hộ kinh doanh", location: "Phường Ninh Kiều, TP. Cần Thơ", description: "Công suất lắp đặt: 43 KWP", system: "Hòa lưới lưu trữ", image: "proj-6.png" },
] as const satisfies readonly Project[];

export const equipment = [
  { title: "Biến tần Inverter", category: "Biến tần", description: "Các dòng sản phẩm thông minh, hoạt động ổn định và hỗ trợ quản lý dữ liệu trực tuyến.", image: "equip-inverter.png" },
  { title: "Pin lưu trữ Lithium", category: "Pin lưu trữ", description: "Lưu trữ điện năng để sử dụng khi cần, giúp chủ động nguồn điện và tối ưu chi phí.", image: "equip-battery.png" },
  { title: "Tấm pin năng lượng mặt trời", category: "Tấm pin", description: "Tấm pin chuyển đổi ánh sáng mặt trời thành điện năng, đa dạng từ các thương hiệu uy tín thế giới.", image: "equip-panel.png" },
  { title: "Phụ kiện Solar", category: "Phụ kiện", description: "Cung cấp các thiết bị và phụ kiện được lựa chọn cẩn thận, đảm bảo an toàn và độ bền cho hệ thống.", image: "equip-accessories.png" },
] as const satisfies readonly Equipment[];
