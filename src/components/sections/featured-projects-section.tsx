import Link from "next/link";
import { ProjectGallery } from "@/features/catalog/project-gallery";
import type { Project } from "@/types/catalog";

type Content = {
  heading: string;
  viewAllLabel: string;
  viewAllHref: string;
  projectTitles: readonly string[];
};

export function FeaturedProjectsSection({ content, projects }: { content: Content; projects: readonly Project[] }) {
  const featuredProjects = content.projectTitles
    .map((title) => projects.find((project) => project.title === title))
    .filter((project): project is Project => Boolean(project));

  return (
    <section className="section projects-section" id="du-an">
      <div className="container projects-header" data-motion="fade">
        <h2 className="projects-title">{content.heading}</h2>
        <Link className="btn-more-projects" href={content.viewAllHref}>
          <span>{content.viewAllLabel}</span>
          <span className="arrow-circle" aria-hidden="true">❯</span>
        </Link>
      </div>
      <ProjectGallery projects={featuredProjects} label={content.heading} />
    </section>
  );
}
