import { SurveyForm } from "@/features/survey/survey-form";
import type { SurveyScreenContent } from "@/types/survey-content";

export function SurveyScreen({ content }: { content: SurveyScreenContent }) {
  return (
    <>
      <section className="page-heading">
        <div className="container" data-motion="left">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.introduction}</p>
        </div>
      </section>
      <section className="section container survey-section">
        <div data-motion="fade">
          <h2>{content.formHeading}</h2>
          <p>{content.formDescription}</p>
          <p>{content.form.disclaimer}</p>
        </div>
        <div data-motion="right"><SurveyForm content={content.form} /></div>
      </section>
    </>
  );
}
