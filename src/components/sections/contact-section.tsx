import Link from "next/link";
import type { HomeContent } from "@/types/home-content";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <div className="container contact-banner-wrapper" id="lien-he">
      <section className="contact-banner" data-motion="up">
        <div className="contact-banner-content">
          <h2>
            {content.heading.map((line) => (
              <span key={line}>{line}<br /></span>
            ))}
          </h2>
          <p>{content.description}</p>
          <div className="contact-actions">
            <Link className="btn-cta-banner" href={content.actionHref}>
              <span>{content.actionLabel}</span>
              <span className="arrow-circle" aria-hidden="true">❯</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
