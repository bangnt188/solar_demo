import { ProjectCard } from "@/components/ui/catalog-cards";
import { getProjects } from "@/services/catalog";

export default function ProjectsPage() {
  return (
    <>
      <section className="page-heading"><div className="container"><span className="eyebrow">Lúa Xanh Đồng Bằng</span><h1>Dự án thực tế</h1><p>Các công trình điện mặt trời đã triển khai cho nhiều loại hình sử dụng.</p><small>Ảnh hiện tại chỉ mang tính minh họa cho bản demo.</small></div></section>
      <section className="section container projects-section" aria-label="Dự án">
        <div className="project-grid">{getProjects().map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}</div>
      </section>
    </>
  );
}
