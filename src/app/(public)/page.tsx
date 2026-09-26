import { HomeScreen } from "@/components/screens/home-screen";
import { homeContent } from "@/data/content/home";
import { getEquipment, getProjects } from "@/services/catalog";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      <JsonLd data={pageStructuredData("/")} />
      <HomeScreen content={homeContent} projects={getProjects()} equipment={getEquipment()} />
    </>
  );
}
