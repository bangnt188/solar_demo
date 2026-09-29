import assert from "node:assert/strict";
import { test } from "node:test";
import { decimalSchema, formatDecimal, optionalText, parseDecimalInput, requiredText } from "../src/validation";

test("required text rejects empty and whitespace-only values", () => {
  const schema = requiredText("Required");
  assert.equal(schema.safeParse("").success, false);
  assert.equal(schema.safeParse("   ").success, false);
  assert.equal(schema.safeParse("  Nguyễn An  ").success, true);
});

test("optional text distinguishes omitted values from invalid non-text", () => {
  assert.equal(optionalText.safeParse(undefined).success, true);
  assert.equal(optionalText.safeParse("ghi chú").success, true);
  assert.equal(optionalText.safeParse(42).success, false);
});

test("decimal helpers preserve precision, trailing zeros, and locale separators", () => {
  const precise = "12345678901234567890.00500";
  assert.equal(formatDecimal(precise, "en-US"), "12,345,678,901,234,567,890.00500");
  assert.equal(parseDecimalInput("12,345,678,901,234,567,890.00500", "en-US"), precise);
  assert.equal(formatDecimal("1000.98888", "vi-VN"), "1.000,98888");
  assert.equal(parseDecimalInput("1.000,98888", "vi-VN"), "1000.98888");
});

test("decimal helper retains intermediate input and rejects non-decimal text", () => {
  assert.equal(parseDecimalInput("-", "en-US"), "-");
  assert.equal(parseDecimalInput("1,000.", "en-US"), "1000.");
  assert.equal(formatDecimal("1000.", "en-US"), "1,000.");
  assert.equal(parseDecimalInput("letters", "en-US"), null);
});

test("decimal parsing rejects malformed grouping instead of silently changing values", () => {
  assert.equal(parseDecimalInput("12,34", "en-US"), null);
  assert.equal(parseDecimalInput("1,,000", "en-US"), null);
  assert.equal(parseDecimalInput("1.234,005", "vi-VN"), "1234.005");
  assert.equal(parseDecimalInput("1.234,005", "en-US"), null);
});

test("decimal schema enforces exact range, sign, requiredness, and scale", () => {
  const schema = decimalSchema({
    min: { value: "0.10", message: "Too small" },
    max: { value: "9007199254740993.00", message: "Too large" },
    maxFractionDigits: 2,
    allowNegative: false,
    requiredMessage: "Required",
  });

  assert.equal(schema.safeParse("").success, false);
  assert.equal(schema.safeParse("0.10").success, true);
  assert.equal(schema.safeParse("9007199254740993.00").success, true);
  assert.equal(schema.safeParse("9007199254740992.99").success, true);
  assert.equal(schema.safeParse("0.09").success, false);
  assert.equal(schema.safeParse("-0.01").success, false);
  assert.equal(schema.safeParse("1.001").success, false);
  assert.equal(schema.safeParse("1.0e3").success, false);
  assert.throws(() => decimalSchema({ min: { value: "2" }, max: { value: "1" } }), RangeError);
});
