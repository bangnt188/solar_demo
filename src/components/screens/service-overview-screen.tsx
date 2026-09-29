import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceOverviewHeroSection } from "@/components/sections/service-overview-hero-section";
import { ServiceProcessSection } from "@/components/sections/service-process-section";
import type { ServiceOverviewContent } from "@/types/service-overview";
import { pageBreadcrumbs, pageStructuredData, type SearchPath } from "@/lib/seo";

export function ServiceOverviewScreen({ path, content }: { path: SearchPath; content: ServiceOverviewContent }) {
  return (
    <>
      <JsonLd data={pageStructuredData(path)} />
      <Breadcrumbs items={pageBreadcrumbs(path)} />
      <ServiceOverviewHeroSection content={content} />
      <ServiceProcessSection stages={content.stages} />
    </>
  );
}
