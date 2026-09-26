import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function SolutionsSection({ content }: { content: HomeContent["solutions"] }) {
  return (
    <section className="section solutions" id="giai-phap">
      <div className="container">
        <SectionHeading title={content.heading} description={content.introduction} />
        <div className="solution-grid" data-motion="up">
          {content.items.map((solution) => (
            <article className="solution-card" key={solution.title}>
              <div className="solution-image"><Image src={imagePath(solution.image)} alt={`Hình minh họa: ${solution.title}`} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
              <span className="solution-icon" aria-hidden="true">{solution.icon}</span>
              <div className="solution-copy"><h3>{solution.title}</h3><p>{solution.text}</p><Link href={content.actionHref}>{solution.actionLabel}</Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
