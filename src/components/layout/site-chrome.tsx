import Link from "next/link";

export function SiteHeader() {
  return (
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
          <Link className="nav-cta" href="/khao-sat/">Khảo Sát</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-columns">
        <div><h2>Giải pháp &amp; Quy trình</h2><p>Tổng quan các hệ thống</p><p>Quy trình tổng thầu EPC</p><p>Hộ gia đình &amp; Biệt thự</p><p>Hộ kinh doanh vừa &amp; nhỏ</p><p>Doanh nghiệp &amp; Công nghiệp</p></div>
        <div><h2>Hệ thống &amp; Dịch vụ</h2><p>Về chúng tôi</p><p><Link href="/thiet-bi/">Sản phẩm chính hãng</Link></p><p>Dịch vụ trọn gói</p><p><Link href="/du-an/">Dự án thực tế</Link></p><p>Liên hệ</p><p>Hỗ trợ khách hàng</p></div>
        <div><h2>Liên hệ &amp; Trụ sở</h2><p>13 Đồng Khởi, Phường Ninh Kiều, TP. Cần Thơ</p><p><a href="mailto:lienhe@luaxanhdongbang.vn">lienhe@luaxanhdongbang.vn</a></p><p>Thứ 2 - Thứ 7: 07:30 - 18:00</p></div>
      </div>
      <p className="demo-note container">Bản demo giao diện · Ảnh dự án, sản phẩm, đối tác và thông tin liên hệ cần xác minh trước khi sử dụng thực tế.</p>
    </footer>
  );
}
