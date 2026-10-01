"use client";
import Image from "next/image";

import { ExpandingGallery } from "@solar/ui";
import { contentImageSrc } from "@/config/site";
import type { Project } from "@/types/catalog";

export function ProjectGallery({ projects, label }: { projects: readonly Project[]; label: string }) {
  return (
    <ExpandingGallery aria-label={label} className="project-gallery" activeRatio={4} collapseOnLeave defaultValue={projects[0]?.id ?? projects[0]?.title ?? null}>
      {projects.map((project) => (
        <ExpandingGallery.Item key={project.id ?? project.title} value={project.id ?? project.title} aria-label={project.title}>
          <ExpandingGallery.Media>
            <Image
              src={contentImageSrc(project.image)}
              alt={project.imageAlt ?? `Hình minh họa: ${project.title}`}
              fill
              sizes="(max-width: 720px) 100vw, 70vw"
            />
          </ExpandingGallery.Media>
          <ExpandingGallery.Content>
            <small>{project.category} · {project.location}</small>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>{project.system}</p>
          </ExpandingGallery.Content>
        </ExpandingGallery.Item>
      ))}
    </ExpandingGallery>
  );
}
