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
              <span>Lúa Xanh <strong>Đồng Bằng</strong></span>
            </Link>
            <nav aria-label="Điều hướng chính">
              <Link href="/">Trang chủ</Link>
              <Link href="/du-an/">Dự án</Link>
              <Link href="/thiet-bi/">Thiết bị</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-content">
            <div><strong>Lúa Xanh Đồng Bằng</strong><p>Giải pháp năng lượng mặt trời cho tương lai bền vững.</p></div>
            <p>Demo Next.js · Dữ liệu minh họa · Chưa nhận yêu cầu tư vấn trực tuyến</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
