type DecimalSymbols = { decimal: string; group: string; digits: readonly string[]; primaryGroupSize: number; secondaryGroupSize: number };

const decimalSymbolsByLocale = new Map<string, DecimalSymbols>();

function decimalSymbols(locale: string): DecimalSymbols {
  const cached = decimalSymbolsByLocale.get(locale);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(123456789012345);
  const decimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).formatToParts(1.1).find((part) => part.type === "decimal")?.value ?? ".";
  const groups = parts.filter((part) => part.type === "integer").map((part) => part.value);
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = Array.from({ length: 10 }, (_, digit) => digitFormatter.format(digit));
  const symbols = {
    decimal,
    group: parts.find((part) => part.type === "group")?.value ?? "",
    digits,
    primaryGroupSize: groups.at(-1)?.length ?? 3,
    secondaryGroupSize: groups.at(-2)?.length ?? groups.at(-1)?.length ?? 3,
  };
  decimalSymbolsByLocale.set(locale, symbols);
  return symbols;
}

export function parseDecimalInput(input: string, locale: string): string | null {
  const symbols = decimalSymbols(locale);
  let localized = input.trim();
  for (let digit = 0; digit < symbols.digits.length; digit += 1) {
    const localizedDigit = symbols.digits[digit];
    if (localizedDigit !== String(digit)) localized = localized.replaceAll(localizedDigit, String(digit));
  }

  const decimalIndex = localized.indexOf(symbols.decimal);
  if (decimalIndex !== -1 && localized.indexOf(symbols.decimal, decimalIndex + symbols.decimal.length) !== -1) return null;
  const hasDecimal = decimalIndex !== -1;
  const integerPart = hasDecimal ? localized.slice(0, decimalIndex) : localized;
  const fraction = hasDecimal ? localized.slice(decimalIndex + symbols.decimal.length) : "";
  const negative = integerPart.startsWith("-");
  const unsignedInteger = negative ? integerPart.slice(1) : integerPart;
  const groups = symbols.group ? unsignedInteger.split(symbols.group) : [unsignedInteger];

  if (groups.length > 1) {
    const first = groups[0];
    const last = groups.at(-1)!;
    if (
      !first ||
      first.length > symbols.secondaryGroupSize ||
      last.length !== symbols.primaryGroupSize ||
      groups.slice(1, -1).some((group) => group.length !== symbols.secondaryGroupSize)
    ) return null;
  }

  const digits = groups.join("");
  if (!/^\d*$/.test(digits) || !/^\d*$/.test(fraction)) return null;
  const canonicalInteger = `${negative ? "-" : ""}${digits}`;
  return `${canonicalInteger}${hasDecimal ? `.${fraction}` : ""}`;
}


export function formatDecimal(value: string, locale: string): string {
  if (value === "-") return value;
  if (value === "") return "";
  const symbols = decimalSymbols(locale);
  const match = value.match(/^(-?)(\d*)(?:\.(\d*))?$/);
  if (!match) return value;

  const [, sign, rawInteger, fraction] = match;
  const integer = rawInteger || "0";
  const groups: string[] = [];
  let remaining = integer;
  let groupSize = symbols.primaryGroupSize;
  while (remaining.length > groupSize) {
    groups.unshift(remaining.slice(-groupSize));
    remaining = remaining.slice(0, -groupSize);
    groupSize = symbols.secondaryGroupSize;
  }
  groups.unshift(remaining);
  const grouped = groups.join(symbols.group);
  const localizedDigits = grouped.replace(/\d/g, (digit) => symbols.digits[Number(digit)]);
  const decimalPart = fraction === undefined ? "" : `${symbols.decimal}${fraction.replace(/\d/g, (digit) => symbols.digits[Number(digit)])}`;
  return `${sign}${localizedDigits}${decimalPart}`;
}
