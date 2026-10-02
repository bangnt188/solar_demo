"use client";
import Image from "next/image";
import { useId, useState } from "react";

import { ExpandingGallery } from "@solar/ui";
import { contentImageSrc } from "@/config/site";
import type { Project } from "@/types/catalog";

export function ProjectGallery({ projects, label }: { projects: readonly Project[]; label: string }) {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const galleryId = useId();
  return (
    <ExpandingGallery aria-label={label} className="project-gallery" activeRatio={4} collapseOnLeave value={activeProject} onValueChange={setActiveProject}>
      {projects.map((project, index) => (
        <ExpandingGallery.Item key={project.id ?? project.title} value={project.id ?? project.title} role="button" aria-label={project.title} aria-expanded={activeProject === (project.id ?? project.title)} aria-controls={`${galleryId}-${index}`}>
          <ExpandingGallery.Media>
            <Image
              src={contentImageSrc(project.image)}
              alt={project.imageAlt ?? `Công trình ${project.title}`}
              fill
              sizes="(max-width: 720px) 100vw, 70vw"
            />
          </ExpandingGallery.Media>
          <ExpandingGallery.Content>
            <h3 className="project-gallery-title">{project.title}</h3>
            <div className="project-gallery-details" id={`${galleryId}-${index}`} aria-hidden={activeProject !== (project.id ?? project.title)}>
              <small>{project.category} · {project.location}</small>
              <p>{project.description}</p>
              <p>{project.system}</p>
            </div>
          </ExpandingGallery.Content>
        </ExpandingGallery.Item>
      ))}
    </ExpandingGallery>
  );
}
