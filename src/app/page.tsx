import Image from "next/image";
import Link from "next/link";
import { imagePath } from "@/config/site";
import { projects, equipment } from "@/data/mock/catalog";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Năng lượng xanh · Tương lai bền vững</span>
            <h1>Giải pháp năng lượng <span>mặt trời</span> toàn diện</h1>
            <p>Khám phá hướng tiếp cận điện mặt trời dành cho gia đình, doanh nghiệp và công trình quy mô lớn.</p>
            <div className="actions">
              <Link className="button" href="/du-an/">Khám phá dự án <span aria-hidden="true">↗</span></Link>
              <Link className="button button-outline" href="/thiet-bi/">Xem thiết bị</Link>
            </div>
          </div>
          <div className="hero-image">
            <Image src={imagePath("solar-farm.png")} alt="Hình minh họa hệ thống điện mặt trời" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
            <span className="image-label">Năng lượng từ ánh sáng mặt trời</span>
          </div>
        </div>
      </section>
      <section className="container intro-section">
        <div><span className="eyebrow">Về chúng tôi</span><h2>Kiến tạo lựa chọn năng lượng xanh</h2></div>
        <p>Lúa Xanh Đồng Bằng hướng tới các giải pháp điện mặt trời phù hợp với nhu cầu sử dụng, từ mái nhà đến công trình thương mại và công nghiệp.</p>
      </section>
      <section className="feature-section">
        <div className="container">
          <div className="section-title"><div><span className="eyebrow">Khám phá</span><h2>Dự án & thiết bị</h2></div><p>Nội dung bên dưới là dữ liệu minh họa cho bản demo.</p></div>
          <div className="feature-grid">
            <Link className="feature-card" href="/du-an/">
              <Image src={imagePath(projects[0].image)} alt="Hình minh họa điện mặt trời áp mái" fill sizes="(max-width: 760px) 100vw, 50vw" />
              <span><small>DỰ ÁN</small><strong>{projects[0].title}</strong><em>Xem dự án ↗</em></span>
            </Link>
            <Link className="feature-card" href="/thiet-bi/">
              <Image src={imagePath(equipment[0].image)} alt="Hình minh họa tấm pin năng lượng mặt trời" fill sizes="(max-width: 760px) 100vw, 50vw" />
              <span><small>THIẾT BỊ</small><strong>{equipment[0].title}</strong><em>Xem thiết bị ↗</em></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
