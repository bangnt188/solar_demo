import { HomeScreen } from "@/components/screens/home-screen";
import { getLanding } from "@/services/public-content";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, pageStructuredData } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = await getLanding();
  return pageMetadata("/", { title: seo.title, description: seo.description, indexable: seo.requestedIndexable, image: seo.ogImage });
}

export default async function Home() {
  const landing = await getLanding();
  return (
    <>
      <JsonLd data={pageStructuredData("/", landing.seo)} />
      <HomeScreen landing={landing} />
    </>
  );
}
