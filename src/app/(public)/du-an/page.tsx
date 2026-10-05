import { ProjectsTabs } from "@/features/catalog/projects-tabs";
import Link from "next/link";
import { getProjectPage } from "@/services/public-content";
import { catalogInput, type SearchParameters } from "@/services/catalog-input";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/du-an/");

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParameters }) {
  const input = await catalogInput(searchParams);
  const page = await getProjectPage(input);

  return (
    <>
      <JsonLd data={pageStructuredData("/du-an/")} />
      <Breadcrumbs items={pageBreadcrumbs("/du-an/")} />
      <section className="page-heading">
        <div className="container" data-motion="left">
          <h1>Dự án thực tế</h1>
          <p>Chọn nhóm khách hàng để xem các dự án theo loại hình công trình.</p>
        </div>
      </section>
      <section className="section container projects-section" aria-label="Dự án theo nhóm công trình">
        <ProjectsTabs projects={page.items} />
        {page.nextCursor && <Link href={`/du-an/?limit=${input.limit}&cursor=${encodeURIComponent(page.nextCursor)}`} className="button">Xem tiếp dự án</Link>}
      </section>
    </>
  );
}
