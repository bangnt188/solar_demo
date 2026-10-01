import { SolutionsOverviewScreen } from "@/components/screens/solutions-overview-screen";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/giai-phap/");

export default function SolutionsPage() {
  return <SolutionsOverviewScreen />;
}
