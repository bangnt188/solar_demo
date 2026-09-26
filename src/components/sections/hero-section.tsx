import Image from "next/image";
import { ActionLink } from "@/components/atoms/action-link";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function HeroSection({ content }: { content: HomeContent["hero"] }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p className="hero-tagline">{content.tagline}</p>
          <p>{content.description}</p>
          <div className="actions">
            <ActionLink href={content.primaryAction.href} variant="primary">{content.primaryAction.label}</ActionLink>
            <ActionLink href={content.secondaryAction.href} variant="outline">{content.secondaryAction.label}</ActionLink>
          </div>
        </div>
        <div className="hero-visual"><Image src={imagePath(content.image)} alt={content.imageAlt} fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 55vw" /></div>
      </div>
      <div className="hero-bottom"><Image src={imagePath(content.bottomImage)} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" /></div>
    </section>
  );
}
