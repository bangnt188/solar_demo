import { ServiceOverviewScreen } from "@/components/screens/service-overview-screen";
import { serviceOverviewContent } from "@/data/content/service-overview";
import { servicePages } from "@/data/content/services";
import { pageMetadata } from "@/lib/seo";

const path = "/dich-vu/" as const;

export const metadata = pageMetadata(path);

export default function ServiceOverviewPage() {
  return <ServiceOverviewScreen path={path} content={serviceOverviewContent} details={Object.values(servicePages)} />;
}
