import Link from "next/link";
import { Video } from "@solar/ui";
import { SectionHeading } from "@/components/molecules/section-heading";
import type { HomeContent } from "@/types/home-content";

const serviceIcons = ["👷", "⚡", "📊"];
const serviceCanvaDescs = [
  "Từ khảo sát, thiết kế, thi công đến vận hành và bảo trì.",
  "Tấm pin, inverter, pin lưu trữ, khung và phụ kiện",
  "Tư vấn mô hình phù hợp với nhu cầu.",
];

export function ServicesSection({ content }: { content: HomeContent["services"] }) {
  return (
    <section className="section services-section bg-slate-50" id="dich-vu">
      <div className="container">
        <SectionHeading title={content.heading} description={content.introduction} />
        <div className="services-canva-grid">
          <Video
            src="https://www.youtube.com/watch?v=I-nslTMUxCs"
            title="Video giới thiệu Lúa Xanh Đồng Bằng"
            className="services-media"
            data-motion="left"
            data-motion-scroll="left"
          />
          <div className="services-list" data-motion="right" data-motion-scroll="right">
            {content.items.map((service, index) => {
              const isHighlight = index === 1;
              return (
                <article
                  className={`service-row service-card-item ${isHighlight ? "highlight" : ""}`}
                  key={service.title}
                  data-motion="right"
                  data-motion-order={index + 1}
                >
                  <div className="service-card-icon" aria-hidden="true">
                    {serviceIcons[index] ?? "⚡"}
                  </div>
                  <div className="service-card-body">
                    <h3>{service.title}</h3>
                    <p>{serviceCanvaDescs[index] ?? service.points.join(", ")}</p>
                    <Link className="service-detail-link" href={service.href}>
                      Xem dịch vụ ⟶
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
