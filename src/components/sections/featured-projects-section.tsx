import Link from "next/link";
import { ProjectCard } from "@/components/ui/catalog-cards";
import { SectionHeading } from "@/components/molecules/section-heading";
import type { Project } from "@/types/catalog";

type Content = { heading: string; viewAllLabel: string; viewAllHref: string };

export function FeaturedProjectsSection({ content, projects }: { content: Content; projects: readonly Project[] }) {
  return (
    <section className="section container projects-section">
      <div className="heading-row" data-motion="fade"><SectionHeading title={content.heading} /><Link href={content.viewAllHref}>{content.viewAllLabel}</Link></div>
      <div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} accent={index % 2 === 0} key={project.title} />)}</div>
    </section>
  );
}
