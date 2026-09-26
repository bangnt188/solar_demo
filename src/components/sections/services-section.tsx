import Image from "next/image";
import { SectionHeading } from "@/components/molecules/section-heading";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function ServicesSection({ content }: { content: HomeContent["services"] }) {
  return (
    <section className="section container" id="dich-vu">
      <div className="services-intro" data-motion="up">
        <SectionHeading title={content.heading} description={content.introduction} />
      </div>
      <div className="services">
        {content.items.map((service) => (
          <article className="service-row" data-motion-scrub="service" key={service.title}>
            <div className="service-image"><Image src={imagePath(service.image)} alt={`Hình minh họa: ${service.title}`} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div className="service-copy"><h3>{service.title}</h3><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></div>
          </article>
        ))}
      </div>
    </section>
  );
}
