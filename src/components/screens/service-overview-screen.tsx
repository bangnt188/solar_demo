import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { DetailOverviewSection } from "@/components/screens/detail-overview-section";
import { ServiceOverviewHeroSection } from "@/components/sections/service-overview-hero-section";
import { ServiceProcessSection } from "@/components/sections/service-process-section";
import type { ServiceDetail } from "@/data/content/services";
import type { ServiceOverviewContent } from "@/types/service-overview";
import { pageBreadcrumbs, pageStructuredData, type SearchPath } from "@/lib/seo";

export function ServiceOverviewScreen({ path, content, details }: { path: SearchPath; content: ServiceOverviewContent; details: readonly ServiceDetail[] }) {
  return (
    <>
      <JsonLd data={pageStructuredData(path)} />
      <Breadcrumbs items={pageBreadcrumbs(path)} />
      <ServiceOverviewHeroSection content={content} />
      <ServiceProcessSection stages={content.stages} />
      {details.map((detail) => (
        <DetailOverviewSection key={detail.anchor} id={detail.anchor} detail={detail} />
      ))}
    </>
  );
}
