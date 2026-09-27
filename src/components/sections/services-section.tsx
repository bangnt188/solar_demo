import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { contentImageSrc as imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function ServicesSection({ content }: { content: HomeContent["services"] }) {
  return (
    <section className="section container" id="dich-vu">
      <div className="services-intro" data-motion="up">
        <SectionHeading title={content.heading} description={content.introduction} />
      </div>
      <div className="services">
        {content.items.map((service) => (
          <article className="service-row" key={service.title}>
            <div className="service-image" data-motion="left" data-motion-scroll="left"><Image src={imagePath(service.image)} alt={`Hình minh họa: ${service.title}`} fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
            <div className="service-copy" data-motion="right" data-motion-scroll="right"><h3>{service.title}</h3><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul><Link className="service-detail-link" href={service.href}>Tìm hiểu dịch vụ</Link></div>
          </article>
        ))}
      </div>
    </section>
  );
}
