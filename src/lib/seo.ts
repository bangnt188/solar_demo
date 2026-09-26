import type { Metadata } from "next";
import { isDemoSite, siteUrl } from "@/config/site";

export const siteName = "Lúa Xanh Đồng Bằng";
export const searchIndexable = process.env.SEO_INDEXABLE === "true";

if (searchIndexable && isDemoSite) {
  throw new Error("The GitHub Pages demo must remain noindex. Set NEXT_PUBLIC_SITE_URL to the verified production URL before enabling SEO_INDEXABLE.");
}

// Only published routes belong here. Do not add planned or empty landing pages.
export const searchPages = {
  "/": {
    title: "Giải pháp điện mặt trời cho gia đình và doanh nghiệp",
    description: "Tìm hiểu giải pháp điện mặt trời của Lúa Xanh Đồng Bằng: khảo sát, thiết kế, thi công, vận hành và các công trình đã triển khai.",
    label: "Trang chủ",
    type: "WebPage",
    indexable: true,
  },
  "/du-an/": {
    title: "Dự án điện mặt trời đã triển khai",
    description: "Các dự án điện mặt trời của Lúa Xanh Đồng Bằng tại Cần Thơ và Đồng Tháp: địa điểm, công suất lắp đặt và loại hệ thống. Ảnh đang dùng là minh họa.",
    label: "Dự án thực tế",
    type: "CollectionPage",
    indexable: true,
  },
  "/thiet-bi/": {
    title: "Thiết bị điện mặt trời và lưu trữ",
    description: "Tìm hiểu các nhóm biến tần và bộ chuyển đổi công suất cho hệ thống điện mặt trời. Danh mục hiện là dữ liệu minh họa, chưa phải sản phẩm thực tế.",
    label: "Thiết bị",
    type: "CollectionPage",
    indexable: true,
  },
  "/khao-sat/": {
    title: "Chuẩn bị yêu cầu khảo sát điện mặt trời",
    description: "Điền thông tin công trình để tạo bản nháp email yêu cầu khảo sát điện mặt trời. Website không tự gửi email hoặc lưu thông tin khảo sát.",
    label: "Khảo sát",
    type: "WebPage",
    indexable: false,
  },
} as const;

export type SearchPath = keyof typeof searchPages;

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.replace(/^\//, "")}`;
}

export function pageMetadata(path: SearchPath): Metadata {
  const page = searchPages[path];
  const title = `${page.title} | ${siteName}`;
  const url = absoluteUrl(path);

  return {
    title,
    description: page.description,
    alternates: { canonical: url },
    robots: { index: searchIndexable && page.indexable, follow: true },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName,
      title,
      description: page.description,
      url,
    },
    twitter: { card: "summary", title, description: page.description },
  };
}

export function pageBreadcrumbs(path: SearchPath) {
  return path === "/" ? [] : [
    { label: searchPages["/"].label, href: "/" },
    { label: searchPages[path].label, href: path },
  ];
}

export function pageStructuredData(path: SearchPath) {
  const page = searchPages[path];
  const url = absoluteUrl(path);
  const breadcrumbs = pageBreadcrumbs(path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": page.type,
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "vi-VN",
      isPartOf: { "@id": `${siteUrl}#website` },
      ...(breadcrumbs.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
  ];

  if (path === "/") {
    graph.push({ "@type": "WebSite", "@id": `${siteUrl}#website`, url: siteUrl, name: siteName, inLanguage: "vi-VN" });
  }
  if (breadcrumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.label, item: absoluteUrl(item.href),
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
