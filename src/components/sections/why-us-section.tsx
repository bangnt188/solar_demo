import type { HomeContent } from "@/types/home-content";

const whyUsFeatures = [
  {
    icon: "📐",
    title: "Thiết kế theo nhu cầu thực tế",
    desc: "Mỗi công trình được phân tích để tối ưu hiệu quả",
  },
  {
    icon: "🛡️",
    title: "An toàn từ khảo sát đến thi công",
    desc: "Tuân thủ tiêu chuẩn kỹ thuật, đảm bảo an toàn",
  },
  {
    icon: "📜",
    title: "Thiết bị rõ nguồn gốc",
    desc: "Hợp tác với các thương hiệu uy tín, bảo hành chính hãng",
  },
  {
    icon: "🤝",
    title: "Đồng hành sau bàn giao",
    desc: "Bảo trì theo định kỳ và hỗ trợ kỹ thuật nhanh chóng, lâu dài",
  },
];

export function WhyUsSection({ content }: { content: HomeContent["whyUs"] }) {
  return (
    <section className="section container why-us-section" id="ve-chung-toi">
      <h2 className="why-us-title">
        Vì sao <span className="text-primary">chọn Lúa Xanh Đồng Bằng?</span>
      </h2>
      <div className="why-us-canva-grid">
        <div className="why-features-grid" data-motion="up">
          {whyUsFeatures.map((f) => (
            <div className="why-feature-card" key={f.title}>
              <div className="why-feature-icon" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="why-commitment-card" data-motion="fade">
          <p>
            {content.paragraphs[0] ??
              "Chúng tôi cam kết mang đến giải pháp điện mặt trời hiệu quả, an toàn và bền vững, với thiết bị chất lượng, đội ngũ giàu kinh nghiệm và dịch vụ hậu mãi tận tâm."}
          </p>
          <div className="why-commitment-brand">
            <span className="brand-leaf-icon" aria-hidden="true">🌱</span>
            <span>Ươm mầm năng lượng</span>
          </div>
        </div>
      </div>
    </section>
  );
}
