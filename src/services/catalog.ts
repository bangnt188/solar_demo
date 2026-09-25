import { listEquipment, listProjects } from "@/repositories/catalog";
import type { Equipment, Project } from "@/types/catalog";

export function getProjects(): readonly Project[] {
  return listProjects();
}

export function getEquipment(): readonly Equipment[] {
  return listEquipment();
}
