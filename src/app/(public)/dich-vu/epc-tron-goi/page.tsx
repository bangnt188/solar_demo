import { DetailPageScreen } from "@/components/screens/detail-page-screen";
import { servicePages } from "@/data/content/services";
import { pageMetadata } from "@/lib/seo";

const path = "/dich-vu/epc-tron-goi/" as const;

export const metadata = pageMetadata(path);

export default function EpcServicePage() {
  return <DetailPageScreen path={path} detail={servicePages.epc} />;
}
