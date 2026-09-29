import Link from "next/link";
import { ProjectCard } from "@/features/catalog/catalog-cards";
import { SectionHeading } from "@/components/molecules/section-heading";
import type { Project } from "@/types/catalog";

type Content = { heading: string; viewAllLabel: string; viewAllHref: string };

export function FeaturedProjectsSection({ content, projects }: { content: Content; projects: readonly Project[] }) {
  return (
    <section className="section container projects-section" id="du-an">
      <div className="projects-header" data-motion="fade">
        <h2 className="projects-title">{content.heading}</h2>
        <Link className="btn-more-projects" href={content.viewAllHref}>
          <span>{content.viewAllLabel}</span>
          <span className="arrow-circle" aria-hidden="true">❯</span>
        </Link>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />
        ))}
      </div>
    </section>
  );
}
