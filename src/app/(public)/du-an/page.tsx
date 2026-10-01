import { ProjectsTabs } from "@/features/catalog/projects-tabs";

import { getProjects } from "@/services/catalog";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/du-an/");

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <JsonLd data={pageStructuredData("/du-an/")} />
      <Breadcrumbs items={pageBreadcrumbs("/du-an/")} />
      <section className="page-heading">
        <div className="container" data-motion="left">
          <h1>Dự án thực tế</h1>
          <p>Chọn nhóm khách hàng để xem các dự án theo loại hình công trình.</p>
          <small>Ảnh hiện tại chỉ mang tính minh họa cho bản demo.</small>
        </div>
      </section>
      <section className="section container projects-section" aria-label="Dự án theo nhóm công trình">
        <ProjectsTabs projects={projects} />
      </section>
    </>
  );
}
