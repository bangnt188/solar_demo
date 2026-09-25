import Image from "next/image";
import { imagePath } from "@/config/site";
import type { equipment, projects } from "@/data/mock/catalog";

type Project = (typeof projects)[number];
type Equipment = (typeof equipment)[number];

export function ProjectCard({ project, accent = false }: { project: Project; accent?: boolean }) {
  return (
    <article className={`project-card ${accent ? "project-accent" : ""}`}>
      <div className="project-image"><Image src={imagePath(project.image)} alt={`Hình minh họa: ${project.title}`} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
      <div className="project-copy"><h3>{project.title}</h3><p className="project-location">{project.location}</p><p>{project.description}</p><div className="project-tags"><span>{project.category}</span><span>{project.system}</span></div></div>
    </article>
  );
}

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="offer-card"><div><h3>{item.title}</h3><p>{item.description}</p></div><div className="offer-image"><Image src={imagePath(item.image)} alt={`Hình minh họa: ${item.title}`} fill sizes="(max-width: 760px) 40vw, 16vw" /></div></article>
  );
}
