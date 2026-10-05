import { imagePath } from "@/config/site";
export type DemoRole = "ADMIN" | "EDITOR";
export type LeadStatus = "new" | "processing" | "done";
export type ContentStatus = "draft" | "published" | "hidden";
export type CatalogKind = "projects" | "equipment";
export type DemoLead = {
    id: number;
    name: string;
    initial: string;
    area: string;
    type: string;
    roof: string;
    bill: string;
    phone: string;
    email: string;
    status: LeadStatus;
    date: string;
    time: string;
    note: string;
    comment: string;
};
export type DemoCatalog = {
    id: number;
    name: string;
    category: string;
    area?: string;
    power: string;
    status: ContentStatus;
    featured?: boolean;
    image: string;
    assigned: boolean;
    summary: string;
    availability?: string;
};
export type DemoMedia = {
    name: string;
    image: string;
    folder: string;
    uses: number;
    assigned: boolean;
};
export type DemoEditor = {
    name: string;
    email: string;
    scope: string;
    status: string;
};
export const statusLabels = { new: "Mới", processing: "Đang xử lý", done: "Hoàn tất", draft: "Nháp", published: "Đang hiển thị", hidden: "Đã ẩn" };
export const adminNavigation = [
    { path: "/admin/", label: "Tổng quan", icon: "home" },
    { path: "/admin/projects/", label: "Dự án", icon: "projects" },
    { path: "/admin/equipment/", label: "Thiết bị", icon: "equipment" },
    { path: "/admin/media/", label: "Media", icon: "media" },
    { path: "/admin/leads/", label: "Khảo sát / Lead", icon: "leads", adminOnly: true },
    { path: "/admin/editors/", label: "Tài khoản", icon: "users", adminOnly: true },
];
export const initialLeads: DemoLead[] = [
    { id: 1, name: 'Khách hàng mẫu A', initial: 'KA', area: 'Cần Thơ', type: 'Nhà ở', roof: '120 m²', bill: '2–3 triệu / tháng', phone: 'Số liên hệ mẫu', email: 'demo-a@example.test', status: 'new', date: '2026-10-05', time: '09:40', note: 'Muốn khảo sát mái nhà để lắp hệ thống điện mặt trời. Ưu tiên sử dụng điện vào ban ngày.', comment: '' },
    { id: 2, name: 'Doanh nghiệp mẫu B', initial: 'DB', area: 'Long An', type: 'Nhà xưởng', roof: '850 m²', bill: 'Trên 10 triệu / tháng', phone: 'Số liên hệ mẫu', email: 'demo-b@example.test', status: 'new', date: '2026-10-05', time: '08:15', note: 'Cần tư vấn phương án cho nhà xưởng. Có thể bố trí khảo sát vào buổi sáng.', comment: '' },
    { id: 3, name: 'Khách hàng mẫu C', initial: 'KC', area: 'Đồng Tháp', type: 'Nhà ở', roof: '95 m²', bill: '1–2 triệu / tháng', phone: 'Số liên hệ mẫu', email: 'demo-c@example.test', status: 'processing', date: '2026-10-04', time: '15:30', note: 'Đã trao đổi nhu cầu, đang chờ xác nhận ngày khảo sát.', comment: 'Liên hệ lại để thống nhất lịch.' },
    { id: 4, name: 'Cơ sở mẫu D', initial: 'CD', area: 'Vĩnh Long', type: 'Kinh doanh', roof: '210 m²', bill: '3–5 triệu / tháng', phone: 'Số liên hệ mẫu', email: 'demo-d@example.test', status: 'done', date: '2026-10-03', time: '10:20', note: 'Đã ghi nhận đầy đủ thông tin khảo sát.', comment: '' },
    { id: 5, name: 'Khách hàng mẫu E', initial: 'KE', area: 'An Giang', type: 'Nhà ở', roof: '110 m²', bill: '2–3 triệu / tháng', phone: 'Số liên hệ mẫu', email: 'demo-e@example.test', status: 'processing', date: '2026-09-28', time: '14:10', note: 'Cần kiểm tra hướng và diện tích mái trước khi đề xuất công suất.', comment: '' }
];
export const initialProjects: DemoCatalog[] = [{ id: 1, name: 'Điện mặt trời mái nhà · Cần Thơ', category: 'Nhà ở', area: 'Cần Thơ', power: '8 kWp', status: 'published', featured: true, image: 'proj-1.png', assigned: true, summary: 'Hệ thống điện mặt trời cho mái nhà dân dụng.' }, { id: 2, name: 'Hệ thống nhà xưởng · Long An', category: 'Doanh nghiệp', area: 'Long An', power: '120 kWp', status: 'published', featured: true, image: 'proj-2.png', assigned: false, summary: 'Giải pháp sử dụng điện tại nhà xưởng.' }, { id: 3, name: 'Công trình dân dụng · Đồng Tháp', category: 'Nhà ở', area: 'Đồng Tháp', power: '6 kWp', status: 'draft', featured: false, image: 'proj-3.png', assigned: true, summary: 'Nội dung đang được chuẩn bị để hiển thị.' }, { id: 4, name: 'Hệ thống mái nhà · Vĩnh Long', category: 'Nhà ở', area: 'Vĩnh Long', power: '10 kWp', status: 'hidden', featured: false, image: 'proj-4.png', assigned: true, summary: 'Công trình được lưu trữ để cập nhật hình ảnh.' }];
export const initialEquipment: DemoCatalog[] = [{ id: 1, name: 'Tấm pin năng lượng mặt trời', category: 'Tấm pin', status: 'published', availability: 'Sẵn có', image: 'equip-panel.png', power: '550 W', assigned: true, summary: 'Tấm pin cho hệ thống điện mặt trời mái nhà.' }, { id: 2, name: 'Inverter hòa lưới', category: 'Inverter', status: 'published', availability: 'Sẵn có', image: 'equip-inverter.png', power: '10 kW', assigned: true, summary: 'Bộ chuyển đổi điện dùng trong hệ thống hòa lưới.' }, { id: 3, name: 'Bộ lưu trữ năng lượng', category: 'Lưu trữ', status: 'draft', availability: 'Đang cập nhật', image: 'equip-battery.png', power: '5 kWh', assigned: false, summary: 'Thông tin và thông số đang được cập nhật.' }];
export const initialMedia: DemoMedia[] = [{ name: 'du-an-can-tho.png', image: imagePath('proj-1.png'), folder: 'Dự án', uses: 1, assigned: true }, { name: 'du-an-long-an.png', image: imagePath('proj-2.png'), folder: 'Dự án', uses: 1, assigned: false }, { name: 'tam-pin.png', image: imagePath('equip-panel.png'), folder: 'Thiết bị', uses: 1, assigned: true }, { name: 'inverter.png', image: imagePath('equip-inverter.png'), folder: 'Thiết bị', uses: 1, assigned: true }, { name: 'bo-luu-tru.png', image: imagePath('equip-battery.png'), folder: 'Thiết bị', uses: 1, assigned: false }, { name: 'mai-nha.webp', image: imagePath('solar-roof.webp'), folder: 'Dự án', uses: 0, assigned: true }];
export const initialEditors: DemoEditor[] = [{ name: 'Editor nội dung', email: 'editor@example.test', scope: 'Dự án dân dụng · Thiết bị', status: 'Hoạt động' }, { name: 'Editor dự án', email: 'projects@example.test', scope: 'Dự án doanh nghiệp', status: 'Đang chờ lời mời' }];
