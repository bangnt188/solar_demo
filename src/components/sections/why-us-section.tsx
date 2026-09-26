import Image from "next/image";
import { SectionHeading } from "@/components/molecules/section-heading";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function WhyUsSection({ content }: { content: HomeContent["whyUs"] }) {
  return (
    <section className="section container" id="ve-chung-toi">
      <SectionHeading title={content.heading} />
      <div className="why-grid">
        <div className="why-gallery" data-motion="up">
          <div className="why-image"><Image src={imagePath(content.images[0].image)} alt={content.images[0].alt} fill sizes="(max-width: 760px) 100vw, 40vw" /><span>{content.banner}</span></div>
          <div className="why-image why-small"><Image src={imagePath(content.images[1].image)} alt={content.images[1].alt} fill sizes="(max-width: 760px) 80vw, 25vw" /></div>
        </div>
        <div className="why-copy" data-motion="fade">
          {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="why-image why-panel"><Image src={imagePath(content.images[2].image)} alt={content.images[2].alt} fill sizes="(max-width: 760px) 100vw, 35vw" /></div>
        </div>
      </div>
    </section>
  );
}
