"use client";

import { Tabs } from "@solar/ui";
import { ProjectCard } from "@/features/catalog/catalog-cards";
import type { Project } from "@/types/catalog";

const projectTabs = [
  { value: "household", label: "Hộ gia đình" },
  { value: "small-business", label: "Hộ kinh doanh vừa và nhỏ" },
  { value: "enterprise", label: "Doanh nghiệp & công nghiệp" },
] as const;

type ProjectTabValue = (typeof projectTabs)[number]["value"];

const categoryTabs: Record<string, ProjectTabValue> = {
  "Hộ gia đình": "household",
  "Hộ kinh doanh": "small-business",
  "Cơ sở sản xuất": "enterprise",
  Showroom: "enterprise",
};

function groupProjects(projects: readonly Project[]) {
  const groups = new Map<string, { value: string; label: string; projects: Project[] }>(
    projectTabs.map(tab => [tab.value, { ...tab, projects: [] }]),
  );
  for (const project of projects) {
    const mapped = Object.hasOwn(categoryTabs, project.category) ? categoryTabs[project.category] : undefined;
    const value = mapped ?? `category:${project.category}`;
    let group = groups.get(value);
    if (!group) {
      group = { value, label: project.category, projects: [] };
      groups.set(value, group);
    }
    group.projects.push(project);
  }
  return [...groups.values()];
}

export function ProjectsTabs({ projects }: { projects: readonly Project[] }) {
  const items = groupProjects(projects).map((tab) => {
    const tabProjects = tab.projects;

    return {
      value: tab.value,
      label: tab.label,
      count: tabProjects.length,
      content: (
        <div className="projects-tab-panel" data-project-group={tab.value} data-project-count={tabProjects.length}>
          <div className="projects-tab-heading">
            <h2>{tab.label}</h2>
            <span className="projects-tab-total">{tabProjects.length} dự án</span>
          </div>
          {tabProjects.length > 0 ? (
            <div className={`project-grid projects-tab-grid${tabProjects.length === 1 ? " projects-tab-grid--spotlight" : ""}`}>
              {tabProjects.map((project, index) => (
                <ProjectCard
                  project={project}
                  accent={tabProjects.length > 1 && index % 2 === 0}
                  key={project.id ?? project.title}
                />
              ))}
            </div>
          ) : (
            <p className="projects-tab-empty">Chưa có dự án nào được cập nhật cho nhóm này.</p>
          )}
        </div>
      ),
    };
  });

  return (
    <div className="projects-tabs">
      <Tabs
        label="Nhóm dự án"
        variant="pill"
        size="md"
        scrollable
        defaultValue="household"
        items={items}
      />
    </div>
  );
}
