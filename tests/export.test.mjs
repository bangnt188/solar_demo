import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bangnt188.github.io/solar_demo/");
const prefix = siteUrl.pathname.replace(/\/+$/, "") + "/";
const solutionRoutes = [
  { route: "giai-phap/ho-gia-dinh/", cardTitle: "Giải pháp hộ gia đình", title: "Giải pháp điện mặt trời cho hộ gia đình" },
  { route: "giai-phap/ho-kinh-doanh/", cardTitle: "Giải pháp hộ kinh doanh vừa & nhỏ", title: "Giải pháp điện mặt trời cho hộ kinh doanh vừa và nhỏ" },
  { route: "giai-phap/doanh-nghiep/", cardTitle: "Giải pháp doanh nghiệp & công nghiệp", title: "Giải pháp điện mặt trời cho doanh nghiệp và công nghiệp" },
];
const serviceRoutes = [
  { route: "dich-vu/epc-tron-goi/", rowTitle: "EPC trọn gói", title: "Dịch vụ EPC điện mặt trời trọn gói" },
  { route: "dich-vu/cung-ung-thiet-bi/", rowTitle: "Phân phối và cung ứng thiết bị điện mặt trời.", title: "Dịch vụ phân phối và cung ứng thiết bị điện mặt trời" },
  { route: "dich-vu/mo-hinh-tai-chinh/", rowTitle: "Các mô hình tài chính/đầu tư", title: "Tư vấn mô hình tài chính và đầu tư điện mặt trời" },
];
const routes = ["", "du-an/", "thiet-bi/", "khao-sat/", "dich-vu/", ...solutionRoutes.map(({ route }) => route), ...serviceRoutes.map(({ route }) => route)];
const sharedRoutes = routes.slice(1, 4);
const indexable = process.env.SEO_INDEXABLE === "true";

// Verify the deployed prefix, including a root-domain production export.
test("exported pages link to working prefixed routes and local assets", () => {
  for (const route of routes) {
    const html = readFileSync(join("out", route, "index.html"), "utf8");
    for (const destination of sharedRoutes) {
      assert.ok(html.includes(`href="${prefix}${destination}"`), `Missing route: ${destination}`);
    }
    for (const [, path] of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
      assert.ok(path.startsWith(prefix), `Unprefixed URL: ${path}`);
      const asset = path.slice(prefix.length);
      if (asset.startsWith("_next/") || asset.startsWith("images/")) {
        assert.ok(existsSync(join("out", asset)), `Missing asset: ${path}`);
      }
    }
  }
  const homeHtml = readFileSync(join("out", "index.html"), "utf8");
  const headerStart = homeHtml.indexOf("<header");
  const headerEnd = homeHtml.indexOf("</header>", headerStart);
  const headerHtml = homeHtml.slice(headerStart, headerEnd + "</header>".length);
  for (const solution of solutionRoutes) {
    const heading = `<h3>${solution.cardTitle.replaceAll("&", "&amp;")}</h3>`;
    const headingIndex = homeHtml.indexOf(heading);
    assert.notEqual(headingIndex, -1, `Missing solution card: ${solution.cardTitle}`);
    const cardEnd = homeHtml.indexOf("</article>", headingIndex);
    assert.ok(cardEnd > headingIndex, `Incomplete solution card: ${solution.cardTitle}`);
    assert.ok(homeHtml.slice(headingIndex, cardEnd).includes(`href="${prefix}${solution.route}"`), `Wrong solution link: ${solution.route}`);
    assert.ok(headerHtml.includes(`href="${prefix}${solution.route}"`), `Missing solution navigation item: ${solution.route}`);
    const detailHtml = readFileSync(join("out", solution.route, "index.html"), "utf8");
    assert.ok(detailHtml.includes(`<h1>${solution.title}</h1>`), `Missing solution title: ${solution.route}`);
    assert.ok(detailHtml.includes(`href="${prefix}khao-sat/"`), `Missing survey CTA: ${solution.route}`);
  }
  for (const service of serviceRoutes) {
    const heading = `<h3>${service.rowTitle.replaceAll("&", "&amp;")}</h3>`;
    const headingIndex = homeHtml.indexOf(heading);
    assert.notEqual(headingIndex, -1, `Missing service row: ${service.rowTitle}`);
    const rowEnd = homeHtml.indexOf("</article>", headingIndex);
    assert.ok(rowEnd > headingIndex, `Incomplete service row: ${service.rowTitle}`);
    assert.ok(homeHtml.slice(headingIndex, rowEnd).includes(`href="${prefix}${service.route}"`), `Wrong service detail link: ${service.route}`);
    assert.ok(headerHtml.includes(`href="${prefix}${service.route}"`), `Missing service navigation item: ${service.route}`);
    const detailHtml = readFileSync(join("out", service.route, "index.html"), "utf8");
    assert.ok(detailHtml.includes(`<h1>${service.title}</h1>`), `Missing service title: ${service.route}`);
    assert.ok(detailHtml.includes(`href="${prefix}khao-sat/"`), `Missing survey CTA: ${service.route}`);
  }
  const serviceOverviewHtml = readFileSync(join("out", "dich-vu/index.html"), "utf8");
  assert.ok(headerHtml.includes(`href="${prefix}dich-vu/"`), "Missing service overview navigation link");
  assert.ok(serviceOverviewHtml.includes("TỔNG THẦU EPC &amp; DỊCH VỤ NĂNG LƯỢNG"), "Missing service overview heading");
  for (const title of [
    "KHẢO SÁT ĐO ĐẠC HIỆN TRẠNG",
    "MÔ PHỎNG 3D &amp; BÁO GIÁ",
    "THI CÔNG HOÀN THIỆN ĐÓNG ĐIỆN",
    "ĐỒNG HÀNH GIÁM SÁT &amp; BẢO HÀNH",
  ]) {
    assert.ok(serviceOverviewHtml.includes(`<h2>${title}</h2>`), `Missing service stage: ${title}`);
  }
});

test("canonical URLs and indexing policy agree with the deployed sitemap", () => {
  const sitemap = readFileSync(join("out", "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedUrls = [];

  for (const route of routes) {
    const html = readFileSync(join("out", route, "index.html"), "utf8");
    const url = `${siteUrl.origin}${prefix}${route}`;
    const shouldIndex = indexable && route !== "khao-sat/" && !route.startsWith("giai-phap/") && !route.startsWith("dich-vu/");
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Wrong canonical: ${route}`);
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1].split(/,\s*/);
    assert.ok(robots?.includes(shouldIndex ? "index" : "noindex"), `Wrong indexing policy: ${route}`);
    if (shouldIndex) expectedUrls.push(url);
  }
  assert.deepEqual(sitemapUrls.sort(), expectedUrls.sort());
  const robots = readFileSync(join("out", "robots.txt"), "utf8");
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, "Crawlers must be able to read noindex");
  if (indexable) assert.ok(robots.includes(`Sitemap: ${siteUrl.origin}${prefix}sitemap.xml`));
  else assert.doesNotMatch(robots, /^Sitemap:/m);
  assert.match(readFileSync(join("out", "404.html"), "utf8"), /<meta name="robots" content="[^"]*noindex/);
});
