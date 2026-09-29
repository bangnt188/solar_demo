import type { Metadata } from "next";
import { isDemoSite, siteUrl } from "@/config/site";

export const siteName = "Lúa Xanh Đồng Bằng";
export const searchIndexable = process.env.SEO_INDEXABLE === "true";

if (searchIndexable && isDemoSite) {
  throw new Error("The GitHub Pages demo must remain noindex. Set NEXT_PUBLIC_SITE_URL to the verified production URL before enabling SEO_INDEXABLE.");
}

// Record implemented public routes; `indexable` controls indexing and sitemap membership.
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
  "/dich-vu/": {
    title: "Tổng thầu EPC và dịch vụ điện mặt trời",
    description: "Quy trình dịch vụ điện mặt trời áp mái từ khảo sát, mô phỏng và báo giá đến thi công, giám sát sau bàn giao.",
    label: "Dịch vụ",
    type: "WebPage",
    indexable: false,
  },
  "/khao-sat/": {
    title: "Chuẩn bị yêu cầu khảo sát điện mặt trời",
    description: "Điền thông tin công trình để tạo bản nháp email yêu cầu khảo sát điện mặt trời. Website không tự gửi email hoặc lưu thông tin khảo sát.",
    label: "Khảo sát",
    type: "WebPage",
    indexable: false,
  },
  "/giai-phap/ho-gia-dinh/": {
    title: "Giải pháp điện mặt trời cho hộ gia đình",
    description: "Các yếu tố cần xem xét khi đánh giá phương án điện mặt trời cho hộ gia đình.",
    label: "Giải pháp hộ gia đình",
    type: "WebPage",
    indexable: false,
  },
  "/giai-phap/ho-kinh-doanh/": {
    title: "Giải pháp điện mặt trời cho hộ kinh doanh vừa và nhỏ",
    description: "Thông tin sơ bộ về đánh giá phương án điện mặt trời cho hộ kinh doanh vừa và nhỏ.",
    label: "Giải pháp hộ kinh doanh",
    type: "WebPage",
    indexable: false,
  },
  "/giai-phap/doanh-nghiep/": {
    title: "Giải pháp điện mặt trời cho doanh nghiệp và công nghiệp",
    description: "Thông tin sơ bộ về khảo sát và xem xét phương án điện mặt trời cho doanh nghiệp.",
    label: "Giải pháp doanh nghiệp",
    type: "WebPage",
    indexable: false,
  },
  "/dich-vu/epc-tron-goi/": {
    title: "Dịch vụ EPC điện mặt trời trọn gói",
    description: "Thông tin sơ bộ về dịch vụ tư vấn, khảo sát, thiết kế, thi công và bàn giao hệ thống điện mặt trời.",
    label: "EPC trọn gói",
    type: "WebPage",
    indexable: false,
  },
  "/dich-vu/cung-ung-thiet-bi/": {
    title: "Dịch vụ phân phối và cung ứng thiết bị điện mặt trời",
    description: "Thông tin sơ bộ về cung ứng tấm pin, biến tần, hệ khung và phụ kiện cho hệ thống điện mặt trời.",
    label: "Cung ứng thiết bị",
    type: "WebPage",
    indexable: false,
  },
  "/dich-vu/mo-hinh-tai-chinh/": {
    title: "Tư vấn mô hình tài chính và đầu tư điện mặt trời",
    description: "Thông tin sơ bộ về các mô hình tự đầu tư, cho thuê thiết bị và mua bán điện trực tiếp.",
    label: "Mô hình tài chính/đầu tư",
    type: "WebPage",
    indexable: false,
  },
} as const;

export type SearchPath = keyof typeof searchPages;

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.replace(/^\//, "")}`;
}

export function pageMetadata(path: SearchPath, overrides: { title?: string; description?: string; indexable?: boolean; image?: string } = {}): Metadata {
  const page = { ...searchPages[path], ...overrides };
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
      ...(overrides.image ? { images: [{ url: overrides.image }] } : {}),
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

export function pageStructuredData(path: SearchPath, overrides: { title?: string; description?: string } = {}) {
  const page = { ...searchPages[path], ...overrides };
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
