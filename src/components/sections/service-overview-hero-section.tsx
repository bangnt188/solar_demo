import Image from "next/image";
import { imagePath } from "@/config/site";
import type { ServiceOverviewContent } from "@/types/service-overview";

export function ServiceOverviewHeroSection({ content }: { content: ServiceOverviewContent }) {
  return (
    <>
      <section className="service-overview-hero" aria-labelledby="service-overview-title">
        <div className="container">
          <h1 id="service-overview-title">{content.title}</h1>
          <p>{content.introduction}</p>
        </div>
      </section>
      <div className="service-overview-image">
        <Image src={imagePath(content.image)} alt={content.imageAlt} fill loading="eager" fetchPriority="high" sizes="100vw" />
      </div>
    </>
  );
}
