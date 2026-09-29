import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Pagination, Tabs } from "@solar/ui";

test("Tabs selects the first enabled item on the server when uncontrolled", () => {
  const html = renderToStaticMarkup(createElement(Tabs, {
    label: "Sections",
    items: [
      { value: "unavailable", label: "Unavailable", content: "Unavailable panel", disabled: true },
      { value: "available", label: "Available", content: "Available panel" },
    ],
  }));
  const tabs = html.match(/<button[^>]*role="tab"[^>]*>/g) ?? [];

  assert.equal(tabs.length, 2);
  assert.match(tabs[0], /aria-selected="false"/);
  assert.match(tabs[1], /aria-selected="true"/);
  assert.match(html, /Available panel/);
});

test("Pagination clamps stale controlled pages to reachable boundaries", () => {
  const props = {
    pageCount: 3,
    onPageChange: () => {},
    previousLabel: "Previous",
    nextLabel: "Next",
    label: "Pages",
  };
  const beyondLast = renderToStaticMarkup(createElement(Pagination, { ...props, page: 8 }));
  const beforeFirst = renderToStaticMarkup(createElement(Pagination, { ...props, page: 0 }));

  assert.match(beyondLast, /3 \/ 3/);
  assert.match(beyondLast, /disabled=""[^>]*>Next<\/button>/);
  assert.match(beforeFirst, /1 \/ 3/);
  assert.match(beforeFirst, /disabled=""[^>]*>Previous<\/button>/);
});
