import { z } from "zod";

export { formatDecimal, parseDecimalInput } from "./decimal";

export function requiredText(message: string) {
  return z.string().trim().min(1, message);
}

export const optionalText = z.string().optional();

type DecimalParts = { negative: boolean; integer: string; fraction: string };

function decimalParts(value: string): DecimalParts {
  const match = value.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match) throw new RangeError(`Expected a canonical decimal string, received "${value}".`);
  return {
    negative: match[1] === "-",
    integer: match[2].replace(/^0+(?=\d)/, ""),
    fraction: match[3] ?? "",
  };
}

function compareDecimals(left: string, right: string): number {
  const a = decimalParts(left);
  const b = decimalParts(right);
  const aIsZero = /^0*$/.test(a.integer) && /^0*$/.test(a.fraction);
  const bIsZero = /^0*$/.test(b.integer) && /^0*$/.test(b.fraction);
  const aNegative = a.negative && !aIsZero;
  const bNegative = b.negative && !bIsZero;
  if (aNegative !== bNegative) return aNegative ? -1 : 1;

  let magnitude = Math.sign(a.integer.length - b.integer.length);
  if (magnitude === 0 && a.integer !== b.integer) magnitude = a.integer < b.integer ? -1 : 1;
  if (magnitude === 0) {
    const scale = Math.max(a.fraction.length, b.fraction.length);
    const aFraction = a.fraction.padEnd(scale, "0");
    const bFraction = b.fraction.padEnd(scale, "0");
    if (aFraction !== bFraction) magnitude = aFraction < bFraction ? -1 : 1;
  }
  return aNegative ? -magnitude : magnitude;
}

export type DecimalSchemaOptions = {
  requiredMessage?: string;
  invalidMessage?: string;
  min?: { value: string; message?: string };
  max?: { value: string; message?: string };
  maxFractionDigits?: number;
  precisionMessage?: string;
  allowNegative?: boolean;
  negativeMessage?: string;
};

export function decimalSchema(options: DecimalSchemaOptions = {}) {
  if (options.maxFractionDigits !== undefined && (!Number.isSafeInteger(options.maxFractionDigits) || options.maxFractionDigits < 0)) {
    throw new RangeError("maxFractionDigits must be a non-negative integer.");
  }
  if (options.min) decimalParts(options.min.value);
  if (options.max) decimalParts(options.max.value);
  if (options.min && options.max && compareDecimals(options.min.value, options.max.value) > 0) {
    throw new RangeError("Decimal minimum must not exceed its maximum.");
  }

  return z.string().superRefine((value, context) => {
    if (value === "") {
      if (options.requiredMessage) context.addIssue({ code: "custom", message: options.requiredMessage });
      return;
    }
    if (!/^-?\d+(?:\.\d+)?$/.test(value)) {
      context.addIssue({ code: "custom", message: options.invalidMessage ?? "Enter a canonical decimal value." });
      return;
    }

    const parts = decimalParts(value);
    if (options.allowNegative === false && parts.negative) {
      context.addIssue({ code: "custom", message: options.negativeMessage ?? "Negative values are not allowed." });
    }
    if (options.min && compareDecimals(value, options.min.value) < 0) {
      context.addIssue({ code: "custom", message: options.min.message ?? `Value must be at least ${options.min.value}.` });
    }
    if (options.max && compareDecimals(value, options.max.value) > 0) {
      context.addIssue({ code: "custom", message: options.max.message ?? `Value must be at most ${options.max.value}.` });
    }
    if (options.maxFractionDigits !== undefined && parts.fraction.length > options.maxFractionDigits) {
      context.addIssue({ code: "custom", message: options.precisionMessage ?? `Use no more than ${options.maxFractionDigits} decimal places.` });
    }
  });
}
