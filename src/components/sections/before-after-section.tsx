import type { ReactNode } from "react";

type BeforeAfterSectionProps = {
  title: string;
  description: string;
  before: ReactNode;
  after: ReactNode;
};

export function BeforeAfterSection({ title, description, before, after }: BeforeAfterSectionProps) {
  return (
    <section className="section comparison-section" aria-labelledby="comparison-heading">
      <div className="container">
        <h2 className="section-heading" id="comparison-heading">{title}</h2>
        <p className="section-lead">{description}</p>
        <div className="comparison-grid">{before}{after}</div>
      </div>
    </section>
  );
}
