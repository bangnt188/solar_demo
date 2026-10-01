import { servicePages } from "@/data/content/services";
import { solutionPages } from "@/data/content/solutions";

export const siteChromeContent = {
  announcement: {
    lead: "Giải pháp điện mặt trời:",
    body: " Tư vấn theo nhu cầu và hiện trạng công trình.",
    actionLabel: "Đặt lịch khảo sát",
    actionHref: "/khao-sat/",
  },
  brand: {
    label: "Lúa Xanh Đồng Bằng - Trang chủ",
    lines: ["LÚA XANH", "ĐỒNG BẰNG"],
    href: "/",
  },
  navigation: {
    label: "Điều hướng chính",
    items: [
      { label: "Trang chủ", href: "/" },
      { label: "Giải pháp", href: "/giai-phap/" },
      { label: "Dịch vụ", href: "/dich-vu/" },
      { label: "Dự án", href: "/du-an/" },
      { label: "Thiết bị", href: "/thiet-bi/" },
    ],
    callToAction: { label: "Khảo sát", href: "/khao-sat/" },
  },
  conversion: { surveyHref: "/khao-sat/" },
  footer: {
    columns: [
      {
        title: "Giải pháp & Quy trình",
        items: [
          { label: "Tổng quan các hệ thống", href: "/giai-phap/" },
          { label: "Quy trình tổng thầu EPC", href: servicePages.epc.href },
          { label: "Hộ gia đình & Biệt thự", href: solutionPages.household.href },
          { label: "Hộ kinh doanh vừa & nhỏ", href: solutionPages.smallBusiness.href },
          { label: "Doanh nghiệp & Công nghiệp", href: solutionPages.enterprise.href },
        ],
      },
      {
        title: "Hệ thống & Dịch vụ",
        items: [
          { label: "Về chúng tôi", href: "/#ve-chung-toi" },
          { label: "Sản phẩm chính hãng", href: "/thiet-bi/" },
          { label: "Dịch vụ trọn gói", href: "/dich-vu/" },
          { label: "Dự án thực tế", href: "/du-an/" },
          { label: "Hỗ trợ khách hàng", href: "/#faq" },
        ],
      },
      {
        title: "Liên hệ & Trụ sở",
        items: [
          { label: "13 Đồng Khởi, Phường Ninh Kiều, TP. Cần Thơ" },
          { label: "0939 xxx xxx", href: "tel:0939000000" },
          { label: "lienhe@luaxanhdongbang.vn", href: "mailto:lienhe@luaxanhdongbang.vn" },
          { label: "Thứ 2 - Thứ 7: 07:30 - 18:00" },
        ],
      },
    ],
    note: "Bản demo giao diện · Lúa Xanh Đồng Bằng",
  },
};
