import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

// GitHub Pages hosts this export under /solar_demo/, not at the domain root.
test("exported pages link to working prefixed routes and local assets", () => {
  for (const route of ["", "du-an/", "thiet-bi/", "khao-sat/"]) {
    const html = readFileSync(join("out", route, "index.html"), "utf8");
    assert.match(html, /href="\/solar_demo\/du-an\/"/);
    assert.match(html, /href="\/solar_demo\/thiet-bi\/"/);
    assert.match(html, /href="\/solar_demo\/khao-sat\/"/);
    for (const [, path] of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
      assert.ok(path.startsWith("/solar_demo/"), `Unprefixed URL: ${path}`);
      const asset = path.slice("/solar_demo/".length);
      if (asset.startsWith("_next/") || asset.startsWith("images/")) {
        assert.ok(existsSync(join("out", asset)), `Missing asset: ${path}`);
      }
    }
  }
});
