import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bangnt188.github.io/solar_demo/");
const prefix = siteUrl.pathname.replace(/\/+$/, "") + "/";
const solutionRoutes = [
  { anchor: "household", href: "giai-phap/#household", cardTitle: "Giải pháp hộ gia đình" },
  { anchor: "small-business", href: "giai-phap/#small-business", cardTitle: "Giải pháp hộ kinh doanh vừa & nhỏ" },
  { anchor: "enterprise", href: "giai-phap/#enterprise", cardTitle: "Giải pháp doanh nghiệp & công nghiệp" },
];
const serviceRoutes = [
  { anchor: "epc", href: "dich-vu/#epc", rowTitle: "EPC trọn gói", title: "Dịch vụ EPC điện mặt trời trọn gói" },
  { anchor: "equipment-supply", href: "dich-vu/#equipment-supply", rowTitle: "Phân phối và cung ứng thiết bị điện mặt trời.", title: "Dịch vụ phân phối và cung ứng thiết bị điện mặt trời" },
  { anchor: "investment-models", href: "dich-vu/#investment-models", rowTitle: "Các mô hình tài chính/đầu tư", title: "Tư vấn mô hình tài chính và đầu tư điện mặt trời" },
];
const routes = ["", "du-an/", "thiet-bi/", "khao-sat/", "giai-phap/", "dich-vu/"];
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
  const solutionHtml = readFileSync(join("out", "giai-phap/index.html"), "utf8");
  const projectsHtml = readFileSync(join("out", "du-an/index.html"), "utf8");
  const projectsMainStart = projectsHtml.indexOf("<main");
  const projectsMainEnd = projectsHtml.indexOf("</main>", projectsMainStart);
  assert.ok(projectsMainStart >= 0 && projectsMainEnd > projectsMainStart, "Missing projects page main content");
  const projectsMainHtml = projectsHtml.slice(projectsMainStart, projectsMainEnd + "</main>".length);
  assert.equal((projectsMainHtml.match(/role="tab"/g) || []).length, 3, "Expected three project category tabs");
  for (const label of [
    "Hộ gia đình",
    "Hộ kinh doanh vừa và nhỏ",
    "Doanh nghiệp &amp; công nghiệp",
  ]) {
    assert.ok(projectsMainHtml.includes(label), `Missing project tab: ${label}`);
  }
  const householdStart = projectsMainHtml.indexOf('data-project-group="household"');
  assert.ok(householdStart >= 0, "Missing default household project group");
  const householdPanelHtml = projectsMainHtml.slice(householdStart);
  assert.ok(householdPanelHtml.includes('data-project-count="1"'), "Incorrect default household project count");
  assert.ok(householdPanelHtml.includes("NHÀ ANH NGUYỄN"), "Missing default household project");
  assert.ok(headerHtml.includes(`href="${prefix}giai-phap/"`), "Missing top-level solution navigation link");
  const solutionMainStart = solutionHtml.indexOf("<main");
  const solutionMainEnd = solutionHtml.indexOf("</main>", solutionMainStart);
  assert.ok(solutionMainStart >= 0 && solutionMainEnd > solutionMainStart, "Missing solution page main content");
  const solutionMainHtml = solutionHtml.slice(solutionMainStart, solutionMainEnd + "</main>".length);
  assert.ok(solutionMainHtml.includes('class="solution-page-hero"'), "Missing reference solution hero");
  for (const text of [
    "Giải pháp điện mặt trời",
    "Đâu là nhu cầu của gia đình bạn?",
    "Giảm tiền điện hàng tháng",
    "Sử dụng nhiều điện vào buổi tối",
    "Cần điện dự phòng khi mất điện",
    "Công trình có mái lớn và sử dụng nhiều điện",
    "Chưa biết nên lắp bao nhiêu là đủ",
  ]) {
    assert.ok(solutionMainHtml.includes(text), `Missing solution reference copy: ${text}`);
  }
  assert.doesNotMatch(solutionMainHtml, /<img\b/i, "Solution page must not render content images");
  for (const solution of solutionRoutes) {
    const heading = `<h3>${solution.cardTitle.replaceAll("&", "&amp;")}</h3>`;
    const headingIndex = homeHtml.indexOf(heading);
    assert.notEqual(headingIndex, -1, `Missing solution card: ${solution.cardTitle}`);
    const cardStart = homeHtml.lastIndexOf(`<a class="solution-card-link" href="${prefix}${solution.href}"`, headingIndex);
    const cardEnd = homeHtml.indexOf("</a>", headingIndex);
    assert.ok(cardStart >= 0 && cardEnd > headingIndex, `Incomplete solution card: ${solution.cardTitle}`);
    assert.ok(solutionMainHtml.includes(`id="${solution.anchor}"`), `Missing solution anchor: ${solution.anchor}`);
  }
  for (const text of [
    "Giải pháp phù hợp với từng nhu cầu",
    "Hệ hòa lưới bám tải",
    "Hệ hòa lưới lưu trữ",
    "Hệ thống kết hợp pin lưu trữ dự phòng",
    "Có thể áp dụng cho nhiều loại công trình",
    "Quy trình tư vấn &amp; triển khai",
    "Mô hình hợp tác đầu tư",
    "Sẵn sàng tìm giải pháp cho công trình của bạn",
  ]) {
    assert.ok(solutionMainHtml.includes(text), `Missing solution reference section: ${text}`);
  }
  assert.equal((solutionMainHtml.match(/class="solution-system-card"/g) || []).length, 3, "Expected three solution system cards");
  assert.equal((solutionMainHtml.match(/class="solution-building-card"/g) || []).length, 4, "Expected four building type cards");
  assert.equal((solutionMainHtml.match(/class="solution-process-step(?:\s|")/g) || []).length, 4, "Expected four process steps");
  assert.equal((solutionMainHtml.match(/class="solution-investment-card(?:\s|")/g) || []).length, 3, "Expected three investment models");
  assert.ok(solutionMainHtml.includes(`href="${prefix}khao-sat/"`), "Missing final survey action");
  const serviceOverviewHtml = readFileSync(join("out", "dich-vu/index.html"), "utf8");
  assert.ok(headerHtml.includes(`href="${prefix}dich-vu/"`), "Missing service overview navigation link");
  assert.ok(serviceOverviewHtml.includes("TỔNG THẦU EPC &amp; DỊCH VỤ NĂNG LƯỢNG"), "Missing service overview heading");
  for (const service of serviceRoutes) {
    const heading = `<h3>${service.rowTitle.replaceAll("&", "&amp;")}</h3>`;
    const headingIndex = homeHtml.indexOf(heading);
    assert.notEqual(headingIndex, -1, `Missing service row: ${service.rowTitle}`);
    const rowEnd = homeHtml.indexOf("</article>", headingIndex);
    assert.ok(rowEnd > headingIndex, `Incomplete service row: ${service.rowTitle}`);
    assert.ok(homeHtml.slice(headingIndex, rowEnd).includes(`href="${prefix}${service.href}"`), `Wrong service anchor: ${service.href}`);
    assert.ok(serviceOverviewHtml.includes(`<section id="${service.anchor}"`), `Missing service section: ${service.anchor}`);
    assert.ok(serviceOverviewHtml.includes(`<h2 id="${service.anchor}-title">${service.title}</h2>`), `Missing service: ${service.title}`);
  }
  for (const obsolete of [
    "giai-phap/ho-gia-dinh/index.html",
    "giai-phap/ho-kinh-doanh/index.html",
    "giai-phap/doanh-nghiep/index.html",
    "dich-vu/epc-tron-goi/index.html",
    "dich-vu/cung-ung-thiet-bi/index.html",
    "dich-vu/mo-hinh-tai-chinh/index.html",
  ]) {
    assert.equal(existsSync(join("out", obsolete)), false, `Obsolete nested route still exported: ${obsolete}`);
  }
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
    const shouldIndex = indexable && route !== "khao-sat/" && route !== "giai-phap/" && route !== "dich-vu/";
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
