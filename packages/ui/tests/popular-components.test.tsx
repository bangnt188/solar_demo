import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Avatar, Button, ButtonGroup, Drawer, DropdownMenu, Modal, PasswordField, Popover, ProgressBar } from "@solar/ui";

test("Avatar fallback carries a single accessible name without an image source", () => {
  const html = renderToStaticMarkup(createElement(Avatar, { name: "Nguyễn An", fallback: "NA" }));
  assert.match(html, /role="img" aria-label="Nguyễn An"/);
  assert.match(html, /aria-hidden="true"[^>]*>NA</);
  assert.doesNotMatch(html, /<img/);
});

test("ProgressBar exposes determinate range and indeterminate status", () => {
  const known = renderToStaticMarkup(createElement(ProgressBar, { label: "Download", value: 25, min: 0, max: 50 }));
  const pending = renderToStaticMarkup(createElement(ProgressBar, { label: "Upload", value: null, locale: "vi-VN" }));
  assert.match(known, /aria-valuemax="50" aria-valuemin="0" aria-valuenow="25"/);
  assert.match(known, /role="progressbar"/);
  assert.match(known, />Download</);
  assert.match(pending, /data-indeterminate=""/);
  assert.doesNotMatch(pending, /aria-valuenow=/);
  assert.match(pending, /aria-valuetext="Đang tải…"/);
});

test("ButtonGroup labels its related controls while retaining button semantics", () => {
  const html = renderToStaticMarkup(createElement(ButtonGroup, { label: "Actions" },
    createElement(Button, null, "Save"), createElement(Button, null, "Cancel")));
  assert.match(html, /role="group" aria-label="Actions"/);
  assert.equal((html.match(/type="button"/g) ?? []).length, 2);
});

test("PasswordField keeps its value hidden by default and disables its toggle with the field", () => {
  const html = renderToStaticMarkup(createElement(PasswordField, {
    id: "password", label: "Password", showLabel: "Show", hideLabel: "Hide", value: "secret", disabled: true,
  }));
  assert.match(html, /type="password"/);
  assert.match(html, /aria-label="Show" aria-pressed="false"/);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 2);
});

test("Overlay and menu triggers expose their target type and accessible text", () => {
  const modal = renderToStaticMarkup(createElement(Modal, {
    title: "Details", description: "Record details", triggerLabel: "Open details", closeLabel: "Close",
    children: "Body",
  }));
  const drawer = renderToStaticMarkup(createElement(Drawer, {
    title: "Filters", description: "Filter records", triggerLabel: "Open filters", closeLabel: "Close",
    children: "Body",
  }));
  const popover = renderToStaticMarkup(createElement(Popover, {
    title: "Help", triggerLabel: "Open help", closeLabel: "Close", children: "Instructions",
  }));
  const menu = renderToStaticMarkup(createElement(DropdownMenu, {
    label: "Actions", items: [{ value: "save", label: "Save", onSelect: () => {} }],
  }));
  for (const [html, trigger] of [[modal, "Open details"], [drawer, "Open filters"], [popover, "Open help"], [menu, "Actions"]]) {
    assert.match(html, new RegExp(trigger));
    assert.match(html, /aria-haspopup=/);
  }
});
