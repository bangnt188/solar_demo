import Image from "next/image";
import Link from "next/link";
import { contentImageSrc as imagePath } from "@/config/site";
import type { Equipment, Project } from "@/types/catalog";

export function ProjectCard({ project, accent = false }: { project: Project; accent?: boolean }) {
  return (
    <article className={`project-card ${accent ? "project-accent" : "project-white"}`} data-motion="up">
      <div className="project-image">
        <Image
          src={imagePath(project.image)}
          alt={project.imageAlt ?? `Công trình ${project.title}`}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
      </div>
      <div className="project-copy">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-location">{project.location}</p>
        <p className="project-spec">{project.description}</p>
        <div className="project-tags">
          {accent ? (
            <>
              <span className="tag-pill tag-white">{project.category}</span>
              <span className="tag-pill tag-white">{project.system}</span>
            </>
          ) : (
            <>
              <span className="tag-pill tag-blue-outline">{project.category}</span>
              <span className="tag-pill tag-orange-solid">{project.system}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="offer-card" data-motion="fade">
      <div className="offer-copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <Link className="offer-link" href="/thiet-bi/">
          Xem chi tiết giải pháp ⟶
        </Link>
      </div>
      <div className="offer-image">
        <Image
          src={imagePath(item.image)}
          alt={item.imageAlt ?? `Hình minh họa: ${item.title}`}
          fill
          sizes="(max-width: 760px) 40vw, 16vw"
          className="offer-img"
        />
      </div>
    </article>
  );
}
