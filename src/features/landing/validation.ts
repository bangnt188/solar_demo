import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import schema from "../../../database/schema/landing-content.schema.json";
import type { LandingDocument } from "@/types/landing";
import { AppError } from "@/core/errors";

const ajv = new Ajv2020({ strict: true, strictTypes: false, strictRequired: false, allErrors: false });
addFormats(ajv);
const validate = ajv.compile<LandingDocument>(schema);
function invalid(): never { throw new AppError("INVALID_INPUT", "Cấu hình landing không hợp lệ."); }
function unique<T>(items: T[], key: (item: T) => unknown) { if (new Set(items.map(key)).size !== items.length) invalid(); }

export function referencedSlots(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(referencedSlots);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => key.endsWith("Slot") && typeof child === "string" ? [child] : referencedSlots(child));
}
function hrefs(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(hrefs);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => /href$/i.test(key) && typeof child === "string" ? [child] : hrefs(child));
}

export function parseLandingDocument(value: unknown): LandingDocument {
  if (!validate(value)) invalid();
  unique(value.sections, item => item.position);
  unique(value.mediaBindings, item => item.slot);
  unique(value.featuredProjects, item => item.projectId);
  unique(value.featuredProjects, item => item.position);
  unique(value.featuredEquipment, item => item.equipmentId);
  unique(value.featuredEquipment, item => item.position);
  const hero = value.sections.find(item => item.key === "hero");
  if (!hero?.enabled || hero.position !== 0) invalid();
  for (const section of value.sections) {
    if (section.key === "services" || section.key === "solutions") {
      unique(section.content.items.map(item => item.key), item => item);
      for (const item of section.content.items) if (item.imageSlot !== `${section.key}.${item.key}.image`) invalid();
    }
    if (section.key === "whyUs") {
      if (section.content.images.map(item => item.key).join() !== "primary,secondary,panel") invalid();
      for (const item of section.content.images) if (item.imageSlot !== `whyUs.${item.key}.image`) invalid();
    }
    if (section.enabled && section.key === "testimonials" && section.content.items.length === 0) invalid();
    if (section.enabled && section.key === "featuredProjects" && !value.featuredProjects.length) invalid();
    if (section.enabled && section.key === "equipmentOffer" && !value.featuredEquipment.length) invalid();
  }
  const slots = new Set(referencedSlots([value.chrome, value.seo, ...value.sections.map(item => item.content)]));
  if (slots.size !== value.mediaBindings.length || value.mediaBindings.some(binding => !slots.has(binding.slot))) invalid();
  const anchorSections: Record<string, string> = { "/#faq": "faq", "/#dich-vu": "services", "/#giai-phap": "solutions", "/#ve-chung-toi": "whyUs" };
  const enabled = new Set(value.sections.filter(item => item.enabled).map(item => item.key as string));
  for (const href of hrefs([value.chrome, ...value.sections.filter(item => item.enabled).map(item => item.content)])) {
    if (anchorSections[href] && !enabled.has(anchorSections[href])) invalid();
  }
  return value;
}
