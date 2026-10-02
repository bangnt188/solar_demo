import type { ReactNode } from "react";
import { SectionHeading } from "@/components/molecules/section-heading";

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
        <SectionHeading title={title} description={description} id="comparison-heading" />
        <div className="comparison-grid">{before}{after}</div>
      </div>
    </section>
  );
}
