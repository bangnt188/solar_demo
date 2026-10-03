import { Tabs } from "@solar/ui";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectCard } from "@/features/catalog/catalog-cards";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";
import { getProjects } from "@/services/catalog";
import type { Project } from "@/types/catalog";

export const metadata = pageMetadata("/du-an/");

function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const projects = getProjects();
  const categories = [...new Set(projects.map((project) => project.category))];
  const tabItems = [
    {
      value: "all",
      label: "Tất cả",
      count: projects.length,
      content: <ProjectGrid projects={projects} />,
    },
    ...categories.map((category, index) => {
      const categoryProjects = projects.filter((project) => project.category === category);

      return {
        value: `category-${index + 1}`,
        label: category,
        count: categoryProjects.length,
        content: <ProjectGrid projects={categoryProjects} />,
      };
    }),
  ];

  return (
    <>
      <JsonLd data={pageStructuredData("/du-an/")} />
      <Breadcrumbs items={pageBreadcrumbs("/du-an/")} />
      <section className="page-heading">
        <div className="container" data-motion="left">
          <span className="eyebrow">Lúa Xanh Đồng Bằng</span>
          <h1>Dự án thực tế</h1>
          <p>Các công trình điện mặt trời đã triển khai cho nhiều loại hình sử dụng.</p>
          <small>Ảnh hiện tại chỉ mang tính minh họa cho bản demo.</small>
        </div>
      </section>
      <section className="section container projects-section" aria-label="Dự án">
        <Tabs
          label="Lọc dự án theo nhóm khách hàng"
          variant="pill"
          size="md"
          scrollable
          items={tabItems}
        />
      </section>
    </>
  );
}
