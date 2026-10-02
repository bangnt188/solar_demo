import { ProcessStep } from "@/components/molecules/process-step";
import { SectionHeading } from "@/components/molecules/section-heading";

type Step = { title: string; description: string };

type ProcessTimelineSectionProps = {
  title: string;
  steps: readonly Step[];
};

export function ProcessTimelineSection({ title, steps }: ProcessTimelineSectionProps) {
  return (
    <section className="section process-section" id="quy-trinh" aria-labelledby="process-heading">
      <div className="container">
        <SectionHeading title={title} id="process-heading" />
        <ol className="process-grid">
          {steps.map((step, index) => <ProcessStep key={step.title} number={String(index + 1).padStart(2, "0")} title={step.title} description={step.description} />)}
        </ol>
      </div>
    </section>
  );
}
