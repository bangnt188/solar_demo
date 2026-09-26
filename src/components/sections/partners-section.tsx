import type { HomeContent } from "@/types/home-content";
import { PartnersMarquee } from "@/components/organisms/partners-marquee";

export function PartnersSection({ content }: { content: HomeContent["partners"] }) {
  return (
    <section className="partners">
      <div className="container partners-inner">
        <h2>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <PartnersMarquee brands={content.brands} label={content.brandsLabel} />
      </div>
    </section>
  );
}
