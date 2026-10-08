import { homeContent } from "@/data/content/home";
import { siteChromeContent } from "@/data/content/site-chrome";
import { projects, equipment } from "@/data/mock/catalog";
import type { PublicContentRepository } from "./public-content";
import type { RenderedSection } from "@/types/landing";
import { AppError } from "@/core/errors";

export function createMockContent(basePath: string): PublicContentRepository {
  return {
    async landing() {
      return {
        chrome: { ...siteChromeContent, announcement: { ...siteChromeContent.announcement, enabled: true }, brand: { ...siteChromeContent.brand, logo: `${basePath}/images/common/logo.avif` }, conversion: { ...siteChromeContent.conversion } },
        seo: { title: "Giải pháp điện mặt trời cho gia đình và doanh nghiệp", description: "Tìm hiểu giải pháp điện mặt trời của Lúa Xanh Đồng Bằng: khảo sát, thiết kế, thi công, vận hành và các công trình đã triển khai.", requestedIndexable: true },
        sections: Object.entries(homeContent).filter(([key]) => key !== "testimonials" || homeContent.testimonials.items.length > 0)
          .map(([key, content], position) => ({ key, content, position })) as RenderedSection[],
        projects, equipment,
      };
    },
    async projects(input) { if (input.cursor) throw new AppError("INVALID_INPUT", "Demo không dùng cursor database."); return { items: projects.slice(0, input.limit), nextCursor: null }; },
    async equipment(input) { if (input.cursor) throw new AppError("INVALID_INPUT", "Demo không dùng cursor database."); return { items: equipment.slice(0, input.limit), nextCursor: null }; },
  };
}
