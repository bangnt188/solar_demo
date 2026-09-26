import { ProjectCard } from "@/components/ui/catalog-cards";
import { getProjects } from "@/services/catalog";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/du-an/");

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={pageStructuredData("/du-an/")} />
      <Breadcrumbs items={pageBreadcrumbs("/du-an/")} />
      <section className="page-heading"><div className="container" data-motion="left"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Dự án thực tế</h1><p>Các công trình điện mặt trời đã triển khai cho nhiều loại hình sử dụng.</p><small>Ảnh hiện tại chỉ mang tính minh họa cho bản demo.</small></div></section>
      <section className="section container projects-section" aria-label="Dự án">
        <div className="project-grid">{getProjects().map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}</div>
      </section>
    </>
  );
}
