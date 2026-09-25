import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lúa Xanh Đồng Bằng | Năng lượng mặt trời",
  description: "Giải pháp điện mặt trời cho gia đình và doanh nghiệp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <header className="site-header">
          <div className="container nav">
            <Link className="brand" href="/" aria-label="Lúa Xanh Đồng Bằng - Trang chủ">
              <span className="brand-mark" aria-hidden="true">☀</span>
              <span className="brand-name">Lúa Xanh<br />Đồng Bằng</span>
            </Link>
            <nav aria-label="Điều hướng chính">
              <Link href="/">Trang Chủ</Link>
              <Link href="/#giai-phap">Giải Pháp</Link>
              <Link href="/#dich-vu">Dịch Vụ</Link>
              <Link href="/thiet-bi/">Sản Phẩm</Link>
              <Link href="/#ve-chung-toi">Về Chúng Tôi</Link>
              <Link className="nav-cta" href="/#lien-he">Khảo Sát</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-columns">
            <div><h2>Giải pháp &amp; Quy trình</h2><p>Tổng quan các hệ thống</p><p>Quy trình tổng thầu EPC</p><p>Hộ gia đình &amp; Biệt thự</p><p>Hộ kinh doanh vừa &amp; nhỏ</p><p>Doanh nghiệp &amp; Công nghiệp</p></div>
            <div><h2>Hệ thống &amp; Dịch vụ</h2><p>Về chúng tôi</p><p><Link href="/thiet-bi/">Sản phẩm chính hãng</Link></p><p>Dịch vụ trọn gói</p><p><Link href="/du-an/">Dự án thực tế</Link></p><p>Liên hệ</p><p>Hỗ trợ khách hàng</p></div>
            <div><h2>Liên hệ &amp; Trụ sở</h2><p>13 Đồng Khởi, Phường Ninh Kiều, TP. Cần Thơ</p><p>0939 xxx xxx</p><p><a href="mailto:lienhe@luaxanhdongbang.vn">lienhe@luaxanhdongbang.vn</a></p><p>Thứ 2 - Thứ 7: 07:30 - 18:00</p></div>
          </div>
          <p className="demo-note container">Bản demo giao diện · Dự án, sản phẩm, đối tác và thông tin liên hệ theo ảnh mẫu; cần xác minh trước khi sử dụng thực tế.</p>
        </footer>
      </body>
    </html>
  );
}
