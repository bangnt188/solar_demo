import Image from "next/image";
import Link from "next/link";
import { FaqDisclosure } from "@/components/molecules/faq-disclosure";
import { SectionHeading } from "@/components/molecules/section-heading";
import { imagePath } from "@/config/site";
import type { HomeContent } from "@/types/home-content";

export function FaqSection({ content }: { content: HomeContent["faq"] }) {
  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <SectionHeading title={content.heading} description={content.introduction} />
        <div className="faq-panel" data-motion="fade">
          <div className="faq-list">
            {content.questions.map((question, index) => (
              <FaqDisclosure key={question.title} number={`0${index + 1}`} question={question.title} initiallyOpen={index === 0}>{question.text}</FaqDisclosure>
            ))}
          </div>
          <div className="faq-visual">
            <div className="faq-image"><Image src={imagePath(content.image)} alt={content.imageAlt} fill sizes="(max-width: 760px) 100vw, 40vw" /></div>
            <Link className="faq-link" href={content.actionHref}>{content.actionLabel} <span aria-hidden="true">❯</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
