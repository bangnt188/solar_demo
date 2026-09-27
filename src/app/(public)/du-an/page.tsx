import { ProjectCard } from "@/components/ui/catalog-cards";
import { getProjectPage } from "@/services/public-content";
import { catalogInput, type SearchParameters } from "@/services/catalog-input";
import Link from "next/link";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/du-an/");

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParameters }) {
  const page = await getProjectPage(await catalogInput(searchParams));
  return (
    <>
      <JsonLd data={pageStructuredData("/du-an/")} />
      <Breadcrumbs items={pageBreadcrumbs("/du-an/")} />
      <section className="page-heading"><div className="container" data-motion="left"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Dự án thực tế</h1><p>Các công trình điện mặt trời đã triển khai cho nhiều loại hình sử dụng.</p><small>Ảnh hiện tại chỉ mang tính minh họa cho bản demo.</small></div></section>
      <section className="section container projects-section" aria-label="Dự án">
        <div className="project-grid">{page.items.map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.id ?? project.title} />)}</div>
        {page.nextCursor && <Link href={`/du-an/?cursor=${page.nextCursor}`} className="button">Xem tiếp dự án</Link>}
      </section>
    </>
  );
}
