import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CheckboxField, ComboboxField, DecimalField, NumberField, Pagination, RadioGroupField, TextField, Toast } from "@solar/ui";

test("TextField associates label, caller description, helper text, and error", () => {
  const html = renderToStaticMarkup(createElement(TextField, {
    id: "email",
    name: "email",
    label: "Email",
    description: "Used for updates",
    error: "Required",
    "aria-describedby": "external-help",
  }));

  assert.match(html, /<label[^>]*for="email"/);
  assert.match(html, /aria-describedby="external-help email-description email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /id="email-description"/);
  assert.match(html, /id="email-error" role="alert"/);
});

test("CheckboxField links caller, helper, and server-error descriptions without duplicates", () => {
  const html = renderToStaticMarkup(createElement(CheckboxField, {
    id: "consent",
    label: "Consent",
    description: "Required to continue",
    error: "Consent is required",
    checked: false,
    "aria-describedby": "external-help consent-description",
    "aria-invalid": false,
  }));

  assert.match(html, /aria-describedby="external-help consent-description consent-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /id="consent-error" role="alert"/);
});

test("RadioGroupField describes its group and server-error message", () => {
  const html = renderToStaticMarkup(createElement(RadioGroupField, {
    id: "plan",
    name: "plan",
    label: "Plan",
    description: "Select one",
    error: "Choose a plan",
    options: [{ value: "basic", label: "Basic", disabled: true }, { value: "plus", label: "Plus" }],
    "aria-describedby": "server-help plan-description",
    "aria-invalid": false,
  }));

  assert.match(html, /<fieldset[^>]*aria-describedby="server-help plan-description plan-error"[^>]*aria-invalid="true"/);
  assert.match(html, /id="plan-1"[^>]*aria-invalid="true"[^>]*aria-describedby="server-help plan-description plan-error"/);
  assert.match(html, /id="plan-error" role="alert"/);
});

test("ComboboxField preserves caller descriptions and read-only semantics", () => {
  const html = renderToStaticMarkup(createElement(ComboboxField, {
    id: "building",
    label: "Building type",
    options: [{ value: "home", label: "Home" }],
    value: "home",
    emptyLabel: "No matches",
    openLabel: "Open choices",
    description: "Choose a building",
    error: "Selection required",
    readOnly: true,
    "aria-describedby": "external-help",
  }));

  assert.match(html, /aria-describedby="external-help building-description building-error"/);
  assert.match(html, /readOnly=""/);
  assert.match(html, /<button[^>]*disabled=""[^>]*aria-label="Open choices"/);
});

test("DecimalField formats locale display without changing decimal precision", () => {
  const html = renderToStaticMarkup(createElement(DecimalField, {
    id: "amount",
    label: "Amount",
    value: "1000.00098800",
    locale: "vi-VN",
  }));

  assert.match(html, /value="1\.000,00098800"/);
});

test("NumberField formats locale display while the named form value stays numeric", () => {
  const html = renderToStaticMarkup(createElement(NumberField, {
    id: "amount-number",
    name: "amount",
    label: "Amount",
    value: 1234.5,
    locale: "vi-VN",
    min: 0,
    max: 2000,
    step: 0.5,
  }));

  assert.match(html, /id="amount-number"[^>]*value="1\.234,5"/);
  assert.match(html, /<input(?=[^>]*type="number")(?=[^>]*name="amount")(?=[^>]*value="1234\.5")(?=[^>]*min="0")(?=[^>]*max="2000")(?=[^>]*step="0\.5")[^>]*>/);
});

test("Pagination disables invalid boundaries and reports the empty state", () => {
  const html = renderToStaticMarkup(createElement(Pagination, {
    page: 1,
    pageCount: 0,
    onPageChange: () => {},
    previousLabel: "Previous",
    nextLabel: "Next",
    label: "Pages",
  }));

  assert.equal((html.match(/disabled=""/g) ?? []).length, 2);
  assert.match(html, /0 \/ 0/);
});

test("Toast exposes a dismiss action with the supplied accessible name", () => {
  const html = renderToStaticMarkup(createElement(Toast, {
    tone: "error",
    text: "Save failed",
    onDismiss: () => {},
    closeLabel: "Close message",
    duration: 1000,
  }));

  assert.match(html, /role="alert"/);
  assert.match(html, /aria-label="Close message"/);
  assert.match(html, /Save failed/);
});
