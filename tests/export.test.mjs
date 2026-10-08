import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { demoAdminPaths, assertDemoRouteBoundary } from "../scripts/demo-admin-routes.mjs";

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
  for (const serverOnly of ["api", ".env", ".env.local", ".next"]) {
    assert.equal(existsSync(join("out", serverOnly)), false, `Server-only artifact exported: ${serverOnly}`);
  }
});

test("Pages exports every approved admin deep link with the real logo and no public chrome", () => {
  for (const route of demoAdminPaths) {
    const html = page(route.slice(1) + "/");
    assert.ok(html.includes("CMS"), `Missing admin screen: ${route}`);
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    assert.ok(html.includes(`${prefix}images/common/logo.avif`), `Missing AVIF logo: ${route}`);
    assert.doesNotMatch(html, /class="site-header|class="site-footer|conversion-dock/, `Public chrome leaked into ${route}`);
    for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
      assert.ok(url.startsWith(prefix), `Unprefixed admin asset/link: ${url}`);
      const local = url.slice(prefix.length);
      if (local.startsWith("_next/") || local.startsWith("images/")) assert.ok(existsSync(join("out", decodeURIComponent(local))), `Missing admin asset: ${local}`);
    }
  }
  function htmlPaths(dir, path = "/admin") {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? htmlPaths(join(dir, entry.name), `${path}/${entry.name}`) : entry.name === "index.html" ? [path] : []);
  }
  assert.deepEqual(htmlPaths("out/admin").sort(), [...demoAdminPaths].sort(), "Unexpected admin page in Pages artifact");
});

test("demo boundary rejects backend and unapproved admin routes including route groups", () => {
  assert.doesNotThrow(() => assertDemoRouteBoundary(["/(cms)/admin/page", "/(cms)/admin/projects/[id]/edit/page"]));
  for (const route of ["/api/survey/route", "/(private)/api/auth/route", "/(private)/admin/settings/page", "/(cms)/admin/api/auth/route"]) {
    assert.throws(() => assertDemoRouteBoundary([route]), /leaked/);
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
