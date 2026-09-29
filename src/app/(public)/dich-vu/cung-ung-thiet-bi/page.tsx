import { DetailPageScreen } from "@/components/screens/detail-page-screen";
import { servicePages } from "@/data/content/services";
import { pageMetadata } from "@/lib/seo";

const path = "/dich-vu/cung-ung-thiet-bi/" as const;

export const metadata = pageMetadata(path);

export default function EquipmentSupplyPage() {
  return <DetailPageScreen path={path} detail={servicePages.equipmentSupply} />;
}
