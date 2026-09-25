import { ProjectCard } from "@/components/catalog-cards";
import { projects } from "@/data/mock/catalog";

export default function ProjectsPage() {
  return (
    <>
      <section className="page-heading"><div className="container"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Dự án</h1><p>Các mô hình điện mặt trời phù hợp với nhiều loại công trình.</p><small>Dữ liệu minh họa — chưa phải dự án thực tế.</small></div></section>
      <section className="section container projects-section" aria-label="Dự án">
        <div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}</div>
      </section>
    </>
  );
}
