import Image from "next/image";
import Link from "next/link";
import { EquipmentCard, ProjectCard } from "@/components/ui/catalog-cards";
import { imagePath } from "@/config/site";
import { getEquipment, getProjects } from "@/services/catalog";

const services = [
  { title: "EPC trọn gói", image: "solar-roof.png", points: ["Tư Vấn & Khảo Sát Hiện Trạng", "Thiết kế kỹ thuật chuyên sâu", "Thi công & Lắp đặt chuẩn hóa", "Cung Cấp Thiết bị", "Vận Hành & Bảo Trì (O&M)"] },
  { title: "Phân phối và cung ứng thiết bị điện mặt trời.", image: "solar-farm.png", points: ["Tấm pin năng lượng mặt trời", "Bộ biến tần", "Hệ khung & phụ kiện lắp đặt"] },
  { title: "Các mô hình tài chính/đầu tư", image: "solar-roof.png", points: ["Tự sản – tự tiêu", "Cho thuê thiết bị", "DPPA / bán điện trực tiếp"] },
];

const solutions = [
  { title: "Hộ gia đình", text: "Giảm hóa đơn điện hàng tháng, hệ gọn và an toàn cho mái nhà.", image: "solar-roof.png", icon: "⌂" },
  { title: "Hộ kinh doanh vừa & nhỏ", text: "Hiệu quả phụ thuộc vào giờ vận hành. Tính phương án dựa trên hóa đơn điện và khung giờ dùng điện.", image: "solar-farm.png", icon: "⚙" },
  { title: "Doanh nghiệp & công nghiệp", text: "Triển khai theo quy trình EPC, có hồ sơ kỹ thuật và hỗ trợ thủ tục đấu nối, PCCC, đo đếm theo quy định.", image: "solar-roof.png", icon: "▤" },
];

const questions = [
  { title: "Hệ thống tấm pin mặt trời có bền không?", text: "Tấm pin thường được nhà sản xuất công bố tuổi thọ khoảng 25–30 năm. Tuổi thọ biến tần và thời hạn bảo hành phụ thuộc từng dòng thiết bị; việc lắp đặt và bảo trì đúng cách giúp hệ thống vận hành ổn định." },
  { title: "Mất bao lâu để hệ thống hoàn vốn?", text: "Thời gian hoàn vốn phụ thuộc vốn đầu tư, sản lượng điện, mức sử dụng điện ban ngày và giá điện. Chúng tôi sẽ ước tính riêng cho công trình sau khi khảo sát hiện trạng." },
  { title: "Có thể lắp đặt trên mái nhà cũ không?", text: "Có thể, nhưng cần kiểm tra kỹ lưỡng kết cấu mái. Chúng tôi sẽ đánh giá độ bền và đề xuất giải pháp phù hợp trong khảo sát miễn phí." },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1>ƯƠM MẦM<br />NĂNG LƯỢNG</h1>
          <p className="hero-tagline">Tận tâm · Đồng hành · Chất lượng</p>
          <p>Lúa Xanh Đồng Bằng cung cấp giải pháp điện mặt trời từ khảo sát, thiết kế, thi công đến vận hành và bảo trì dài hạn. Mỗi hệ thống được xây dựng dựa trên nhu cầu sử dụng điện, điều kiện công trình và hiệu quả đầu tư thực tế.</p>
          <div className="actions">
            <Link className="button" href="/khao-sat/">KHẢO SÁT MIỄN PHÍ</Link>
            <Link className="button button-outline" href="/du-an/">DỰ ÁN THỰC TẾ</Link>
          </div>
        </div>
        <div className="hero-visual"><Image src={imagePath("solar-roof.png")} alt="Hình minh họa thi công hệ thống điện mặt trời" fill priority sizes="(max-width: 760px) 100vw, 55vw" /></div>
      </div>
      <div className="hero-bottom"><Image src={imagePath("solar-farm.png")} alt="" fill sizes="100vw" /></div>
    </section>
  );
}

export function Partners() {
  return (
    <section className="partners">
      <div className="container partners-inner">
        <h2>Đối Tác<br />Chiến Lược</h2>
        <div aria-label="Đối tác trong mẫu thiết kế">AIKO <strong>BYD</strong> HUAWEI <strong>solis</strong> SMA <strong>LONGi</strong> CanadianSolar SUNGROW AESOLAR</div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="section container" id="dich-vu">
      <h2 className="section-heading">CHÚNG TÔI LÀM GÌ</h2>
      <p className="section-lead">Công ty TNHH Lúa Xanh Đồng Bằng được thành lập với định vị là đối tác thực thi toàn diện trong lĩnh vực điện mặt trời áp mái. Lúa Xanh Đồng Bằng không chỉ là nhà thầu EPC, chúng tôi cung cấp giải pháp tư vấn pháp lý trọn gói. Đội ngũ chuyên trách của chúng tôi am hiểu sâu sắc quy định của EVN, sẵn sàng đại diện chủ đầu tư xử lý toàn bộ các thủ tục phức tạp.</p>
      <div className="services">
        {services.map((service) => (
          <article className="service-row" key={service.title}>
            <div className="service-image"><Image src={imagePath(service.image)} alt={`Hình minh họa: ${service.title}`} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div className="service-copy"><h3>{service.title}</h3><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Solutions() {
  return (
    <section className="section solutions" id="giai-phap">
      <div className="container">
        <h2 className="section-heading">GIẢI PHÁP CHUYÊN BIỆT<br />CHO TỪNG NHÓM KHÁCH HÀNG</h2>
        <p className="section-lead">Mỗi giải pháp đều được thiết kế riêng theo nhu cầu thực tế của từng khách hàng. Hãy cho Lúa Xanh Đồng Bằng biết bạn là ai và điều bạn cần. Chúng tôi sẽ giúp bạn tìm ra phương án phù hợp nhất.</p>
        <div className="solution-grid">
          {solutions.map((solution) => (
            <article className="solution-card" key={solution.title}>
              <div className="solution-image"><Image src={imagePath(solution.image)} alt={`Hình minh họa: ${solution.title}`} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
              <span className="solution-icon" aria-hidden="true">{solution.icon}</span>
              <div className="solution-copy"><h3>{solution.title}</h3><p>{solution.text}</p><span>Xem chi tiết giải pháp ⟶</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="section container" id="ve-chung-toi">
      <h2 className="section-heading">VÌ SAO CHỌN LÚA XANH ĐỒNG BẰNG</h2>
      <div className="why-grid">
        <div className="why-gallery">
          <div className="why-image"><Image src={imagePath("solar-roof.png")} alt="Hình minh họa hệ thống điện áp mái" fill sizes="(max-width: 760px) 100vw, 40vw" /><span>GIẢI PHÁP PHÙ HỢP &nbsp; VẬN HÀNH BỀN VỮNG &nbsp; GIÁ TRỊ DÀI HẠN</span></div>
          <div className="why-image why-small"><Image src={imagePath("solar-farm.png")} alt="Hình minh họa hệ thống điện mặt trời" fill sizes="(max-width: 760px) 80vw, 25vw" /></div>
        </div>
        <div className="why-copy">
          <p><strong>Lúa Xanh Đồng Bằng</strong> lấy an toàn kỹ thuật, chất lượng triển khai và hiệu quả sử dụng thực tế làm nền tảng cho mỗi công trình. Chúng tôi không áp dụng một cấu hình cố định, mà cân nhắc đặc điểm sử dụng điện, điều kiện công trình và mục tiêu của từng khách hàng.</p>
          <p>Thông qua quy trình làm việc rõ ràng, thiết bị phù hợp và hỗ trợ sau bàn giao, Lúa Xanh Đồng Bằng hướng đến những hệ thống vận hành ổn định, dễ quản lý và mang lại giá trị lâu dài.</p>
          <div className="why-image why-panel"><Image src={imagePath("solar-farm.png")} alt="Hình minh họa tấm pin mặt trời" fill sizes="(max-width: 760px) 100vw, 35vw" /></div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  return (
    <section className="section container projects-section">
      <div className="heading-row"><h2 className="section-heading">DỰ ÁN TIÊU BIỂU</h2><Link href="/du-an/">XEM TẤT CẢ CÁC DỰ ÁN ⟶</Link></div>
      <div className="project-grid">
        {getProjects().map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}
      </div>
    </section>
  );
}

export function EquipmentOffer() {
  return (
    <section className="section container">
      <div className="offer"><h2>THIẾT BỊ &amp; GIẢI PHÁP LƯU TRỮ</h2><div className="offer-grid">
        {getEquipment().map((item) => <EquipmentCard item={item} key={item.title} />)}
      </div><Link href="/thiet-bi/">Xem tất cả sản phẩm ⟶</Link></div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section faq-section">
      <div className="container">
        <h2 className="section-heading">CÂU HỎI THƯỜNG GẶP</h2>
        <p className="section-lead">Giải đáp các băn khoăn phổ biến của chủ nhà và chủ doanh nghiệp trước khi quyết định đầu tư hệ thống điện mặt trời.</p>
        <div className="faq-panel"><div className="faq-list">{questions.map((question, index) => (
          <article className="faq-item" key={question.title}><span>0{index + 1}</span><div><h3>{question.title}</h3><p>{question.text}</p></div></article>
        ))}</div><div className="faq-visual"><div className="faq-image"><Image src={imagePath("solar-farm.png")} alt="Hình minh họa trang trại điện mặt trời" fill sizes="(max-width: 760px) 100vw, 40vw" /></div><Link className="faq-link" href="/khao-sat/">Tìm hiểu khảo sát <span aria-hidden="true">❯</span></Link></div></div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact-section" id="lien-he">
      <div className="container"><h2>MUỐN BIẾT NHÀ BẠN CÓ PHÙ HỢP<br />ĐỂ LẮP ĐẶT KHÔNG?</h2><p>Liên hệ với chúng tôi hôm nay. Đội kỹ thuật sẽ đến tận nơi trong 48 giờ.</p><div className="contact-actions"><Link className="contact-button" href="/khao-sat/">Hẹn lịch khảo sát miễn phí <span aria-hidden="true">❯</span></Link></div></div>
    </section>
  );
}
