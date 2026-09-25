import { projects, equipment } from "@/data/mock/catalog";
import type { Equipment, Project } from "@/types/catalog";

export function listProjects(): readonly Project[] {
  return projects;
}

export function listEquipment(): readonly Equipment[] {
  return equipment;
}
