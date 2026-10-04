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
  const grouped: Record<ProjectTabValue, Project[]> = {
    household: [],
    "small-business": [],
    enterprise: [],
  };

  for (const project of projects) {
    if (!Object.prototype.hasOwnProperty.call(categoryTabs, project.category)) {
      throw new Error(`Map project category to a tab: ${project.category}`);
    }
    grouped[categoryTabs[project.category]].push(project);
  }

  return grouped;
}

export function ProjectsTabs({ projects }: { projects: readonly Project[] }) {
  const groupedProjects = groupProjects(projects);
  const items = projectTabs.map((tab) => {
    const tabProjects = groupedProjects[tab.value];

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
