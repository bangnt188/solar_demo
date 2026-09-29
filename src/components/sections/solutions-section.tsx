import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { contentImageSrc as imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function SolutionsSection({ content }: { content: HomeContent["solutions"] }) {
  return (
    <section className="section solutions" id="giai-phap">
      <div className="container">
        <SectionHeading title={content.heading} description={content.introduction} />
        <div className="solution-grid" data-motion="up">
          {content.items.map((solution) => (
            <Link className="solution-card-link" href={solution.href} key={solution.title}>
              <article className="solution-card">
                <div className="solution-image">
                  <Image src={imagePath(solution.image)} alt={`Giải pháp: ${solution.title}`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                  <div className="solution-icon" aria-hidden="true">{solution.icon}</div>
                </div>
                <div className="solution-copy">
                  <h3>{solution.title}</h3>
                  <p>{solution.text}</p>
                  <span className="solution-card-action">{solution.actionLabel}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
