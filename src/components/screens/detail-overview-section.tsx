import Image from "next/image";
import { ActionLink } from "@/components/atoms/action-link";
import { imagePath } from "@/config/site";
import type { DetailPageContent } from "@/types/detail-page";

export function DetailOverviewSection({ id, detail }: { id: string; detail: DetailPageContent }) {
  return (
    <section id={id} className="section container detail-page" aria-labelledby={`${id}-title`}>
      <div className="detail-overview" data-motion="up">
        <div className="detail-copy">
          <h2 id={`${id}-title`}>{detail.title}</h2>
          <p>{detail.lead}</p>
          <h3>{detail.overviewTitle}</h3>
          <p>{detail.overview}</p>
          <p className="detail-note">{detail.note}</p>
        </div>
        <div className="detail-image">
          <Image src={imagePath(detail.image)} alt={detail.imageAlt} fill sizes="(max-width: 700px) 100vw, 50vw" />
        </div>
      </div>
      <div className="detail-sections">
        <section className="detail-block" aria-labelledby={`${id}-considerations`}>
          <h3 id={`${id}-considerations`}>Các yếu tố cần xem xét</h3>
          <ul>
            {detail.considerations.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}
          </ul>
        </section>
        <section className="detail-block" aria-labelledby={`${id}-steps`}>
          <h3 id={`${id}-steps`}>Các bước đề xuất phương án</h3>
          <ol>
            {detail.steps.map((step) => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}
          </ol>
        </section>
      </div>
      <section className="detail-cta" aria-label="Yêu cầu khảo sát">
        <div><h3>Cần đánh giá cho công trình của bạn?</h3><p>Gửi thông tin cơ bản để bắt đầu trao đổi và chuẩn bị khảo sát.</p></div>
        <ActionLink className="button" href="/khao-sat/">Yêu cầu khảo sát</ActionLink>
      </section>
    </section>
  );
}
