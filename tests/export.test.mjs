import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bangnt188.github.io/solar_demo/");
const prefix = siteUrl.pathname.replace(/\/+$/, "") + "/";
const routes = ["", "du-an/", "thiet-bi/", "khao-sat/"];
const indexable = process.env.SEO_INDEXABLE === "true";

// Verify the deployed prefix, including a root-domain production export.
test("exported pages link to working prefixed routes and local assets", () => {
  for (const route of routes) {
    const html = readFileSync(join("out", route, "index.html"), "utf8");
    for (const destination of routes.slice(1)) {
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
});

test("canonical URLs and indexing policy agree with the deployed sitemap", () => {
  const sitemap = readFileSync(join("out", "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedUrls = [];

  for (const route of routes) {
    const html = readFileSync(join("out", route, "index.html"), "utf8");
    const url = `${siteUrl.origin}${prefix}${route}`;
    const shouldIndex = indexable && route !== "khao-sat/";
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
