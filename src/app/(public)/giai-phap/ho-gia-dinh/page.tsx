import { DetailPageScreen } from "@/components/screens/detail-page-screen";
import { solutionPages } from "@/data/content/solutions";
import { pageMetadata } from "@/lib/seo";

const path = "/giai-phap/ho-gia-dinh/" as const;

export const metadata = pageMetadata(path);

export default function HouseholdSolutionPage() {
  return <DetailPageScreen path={path} detail={solutionPages.household} />;
}
