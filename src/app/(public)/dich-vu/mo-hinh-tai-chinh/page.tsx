import { DetailPageScreen } from "@/components/screens/detail-page-screen";
import { servicePages } from "@/data/content/services";
import { pageMetadata } from "@/lib/seo";

const path = "/dich-vu/mo-hinh-tai-chinh/" as const;

export const metadata = pageMetadata(path);

export default function InvestmentModelsPage() {
  return <DetailPageScreen path={path} detail={servicePages.investmentModels} />;
}
