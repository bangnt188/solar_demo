import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bangnt188.github.io/solar_demo/");
const prefix = siteUrl.pathname.replace(/\/+$/, "") + "/";
const routes = ["", "du-an/", "thiet-bi/", "khao-sat/", "giai-phap/", "dich-vu/"];
const page = (route) => readFileSync(join("out", route, "index.html"), "utf8");

test("demo pages link to working prefixed routes and local assets", () => {
  for (const route of routes) {
    const html = page(route);
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

test("home solution and service links resolve to exported anchors", () => {
  const home = page("");
  for (const [route, anchors] of [
    ["giai-phap/", ["household", "small-business", "enterprise"]],
    ["dich-vu/", ["epc", "equipment-supply", "investment-models"]],
  ]) {
    const destination = page(route);
    for (const anchor of anchors) {
      assert.ok(home.includes(`href="${prefix}${route}#${anchor}"`), `Missing link: ${route}#${anchor}`);
      assert.ok(destination.includes(`id="${anchor}"`), `Missing anchor: ${route}#${anchor}`);
    }
  }
});

test("demo artifact excludes backend routes and environment files", () => {
  for (const serverOnly of ["api", "admin", ".env", ".env.local", ".next"]) {
    assert.equal(existsSync(join("out", serverOnly)), false, `Server-only artifact exported: ${serverOnly}`);
  }
});

test("demo canonical URLs agree with its noindex and empty sitemap policy", () => {
  for (const route of routes) {
    const html = page(route);
    const url = `${siteUrl.origin}${prefix}${route}`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Wrong canonical: ${route}`);
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1].split(/,\s*/);
    assert.ok(robots?.includes("noindex"), `Demo must be noindex: ${route}`);
  }
  const sitemap = readFileSync(join("out", "sitemap.xml"), "utf8");
  assert.doesNotMatch(sitemap, /<loc>/, "Demo sitemap must not advertise indexable pages");
  const robots = readFileSync(join("out", "robots.txt"), "utf8");
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, "Crawlers must be able to read noindex");
  assert.doesNotMatch(robots, /^Sitemap:/m);
  assert.match(readFileSync(join("out", "404.html"), "utf8"), /<meta name="robots" content="[^"]*noindex/);
});
