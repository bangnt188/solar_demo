import { ProcessStep } from "@/components/molecules/process-step";

type Step = { title: string; description: string };

type ProcessTimelineSectionProps = {
  title: string;
  steps: readonly Step[];
};

export function ProcessTimelineSection({ title, steps }: ProcessTimelineSectionProps) {
  return (
    <section className="section process-section" id="quy-trinh" aria-labelledby="process-heading">
      <div className="container">
        <h2 className="section-heading" id="process-heading">{title}</h2>
        <ol className="process-grid">
          {steps.map((step, index) => <ProcessStep key={step.title} number={String(index + 1).padStart(2, "0")} title={step.title} description={step.description} />)}
        </ol>
      </div>
    </section>
  );
}
