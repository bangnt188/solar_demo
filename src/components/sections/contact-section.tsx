import { ActionLink } from "@/components/atoms/action-link";
import type { HomeContent } from "@/types/home-content";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <section className="contact-section" id="lien-he">
      <div className="container" data-motion="up">
        <h2>{content.heading.map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <p>{content.description}</p>
        <div className="contact-actions"><ActionLink className="contact-button" href={content.actionHref}>{content.actionLabel} <span aria-hidden="true">❯</span></ActionLink></div>
      </div>
    </section>
  );
}
