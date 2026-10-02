import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "@/components/atoms/action-link";
import { contentImageSrc as imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function HeroSection({ content }: { content: HomeContent["hero"] }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p className="hero-tagline">{content.tagline}</p>
          <p className="hero-desc">{content.description}</p>
          <div className="actions hero-actions">
            <ActionLink href={content.primaryAction.href} variant="primary" className="hero-btn-primary">{content.primaryAction.label}</ActionLink>
            <ActionLink href={content.secondaryAction.href} variant="outline" className="hero-btn-outline">{content.secondaryAction.label}</ActionLink>
          </div>
          <Link className="hero-solutions-link" href="/#giai-phap">Chọn giải pháp phù hợp với nhu cầu của bạn ↓</Link>
        </div>
        <div className="hero-visual">
          <Image src={imagePath(content.image)} alt={content.imageAlt} fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 55vw" className="hero-img" />
        </div>
      </div>
      <div className="hero-bottom" aria-hidden="true">
        <Image src={imagePath(content.bottomImage)} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" />
      </div>
    </section>
  );
}
