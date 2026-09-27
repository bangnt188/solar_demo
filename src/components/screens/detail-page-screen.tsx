import Image from "next/image";
import { ActionLink } from "@/components/atoms/action-link";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { imagePath } from "@/config/site";
import type { DetailPageContent } from "@/types/detail-page";
import { pageBreadcrumbs, pageStructuredData, type SearchPath } from "@/lib/seo";

export function DetailPageScreen({ path, detail }: { path: SearchPath; detail: DetailPageContent }) {
  return (
    <>
      <JsonLd data={pageStructuredData(path)} />
      <Breadcrumbs items={pageBreadcrumbs(path)} />
      <section className="page-heading detail-heading">
        <div className="container" data-motion="left">
          <h1>{detail.title}</h1>
          <p>{detail.lead}</p>
        </div>
      </section>
      <section className="section container detail-page" aria-label={detail.title}>
        <div className="detail-overview" data-motion="up">
          <div className="detail-copy">
            <h2>{detail.overviewTitle}</h2>
            <p>{detail.overview}</p>
            <p className="detail-note">{detail.note}</p>
          </div>
          <div className="detail-image">
            <Image src={imagePath(detail.image)} alt={detail.imageAlt} fill sizes="(max-width: 700px) 100vw, 50vw" />
          </div>
        </div>
        <div className="detail-sections">
          <section className="detail-block" aria-labelledby="detail-considerations">
            <h2 id="detail-considerations">Các yếu tố cần xem xét</h2>
            <ul>
              {detail.considerations.map((item) => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}
            </ul>
          </section>
          <section className="detail-block" aria-labelledby="detail-steps">
            <h2 id="detail-steps">Các bước đề xuất phương án</h2>
            <ol>
              {detail.steps.map((step) => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}
            </ol>
          </section>
        </div>
        <section className="detail-cta" aria-label="Yêu cầu khảo sát">
          <div><h2>Cần đánh giá cho công trình của bạn?</h2><p>Gửi thông tin cơ bản để bắt đầu trao đổi và chuẩn bị khảo sát.</p></div>
          <ActionLink className="button" href="/khao-sat/">Yêu cầu khảo sát</ActionLink>
        </section>
      </section>
    </>
  );
}
