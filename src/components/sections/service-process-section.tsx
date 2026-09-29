import { ServiceStage } from "@/components/molecules/service-stage";
import type { ServiceStageContent } from "@/types/service-overview";

export function ServiceProcessSection({ stages }: { stages: readonly ServiceStageContent[] }) {
  return (
    <section className="service-process" aria-label="Quy trình dịch vụ điện mặt trời">
      <div className="container">
        <ol className="service-process-list">
          {stages.map((stage, index) => <ServiceStage key={stage.title} number={String(index + 1)} stage={stage} />)}
        </ol>
      </div>
    </section>
  );
}
