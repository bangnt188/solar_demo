import { Catalog } from "@/components/catalog";
import { projects } from "@/data/mock/catalog";

export default function ProjectsPage() {
  return <Catalog title="Dự án" intro="Các mô hình điện mặt trời phù hợp với nhiều loại công trình." entries={projects} />;
}
