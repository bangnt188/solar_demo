import Image from "next/image";
import { imagePath } from "@/config/site";
import type { ServiceStageContent } from "@/types/service-overview";

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 5.5v4.8l3.1 1.8" />
    </svg>
  );
}

export function ServiceStage({ number, stage }: { number: string; stage: ServiceStageContent }) {
  return (
    <li className="service-stage">
      <div className="service-stage-copy">
        <span className="service-stage-number" aria-hidden="true">{number}</span>
        <div>
          <h2>{stage.title}</h2>
          <p className="service-stage-turnaround"><ClockIcon />{stage.turnaround}</p>
        </div>
      </div>
      <figure className="service-stage-visual">
        <Image src={imagePath(stage.image)} alt={stage.imageAlt} fill sizes="(max-width: 760px) 76vw, 150px" />
      </figure>
      <ul className="service-stage-details">
        {stage.details.map((detail) => <li key={detail}>{detail}</li>)}
      </ul>
    </li>
  );
}
