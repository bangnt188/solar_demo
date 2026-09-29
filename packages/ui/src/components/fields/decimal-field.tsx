"use client";

import { useEffect, useState, type InputHTMLAttributes, type Ref } from "react";

import { Input } from "../../basic/input";
import { formatDecimal, parseDecimalInput } from "../../validation/decimal";
import type { FieldPresentation } from "./text-field";
import styles from "./text-field.module.css";
import { mergeDescribedBy } from "./field-utils";

export type DecimalFieldProps = Omit<FieldPresentation, "size"> & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "type" | "value" | "defaultValue" | "onChange" | "size"> & {
  size?: FieldPresentation["size"];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  controlClassName?: string;
  labelClassName?: string;
  controlRef?: Ref<HTMLInputElement>;
  locale: string;
};

export function DecimalField({
  id, label, description, error, required, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, labelClassName, value, defaultValue, onValueChange,
  locale, controlRef, ...inputProps
}: DecimalFieldProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? "");
  const currentValue = value === undefined ? internalValue : value;
  const [draft, setDraft] = useState(() => formatDecimal(currentValue ?? "", locale));
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = mergeDescribedBy(inputProps["aria-describedby"], descriptionId, errorId);

  useEffect(() => {
    if (!focused) setDraft(formatDecimal(currentValue ?? "", locale));
  }, [currentValue, focused, locale]);

  return (
    <div className={[styles.field, styles[labelPlacement], containerClassName].filter(Boolean).join(" ")}>
      <label className={[styles.label, labelClassName].filter(Boolean).join(" ")} htmlFor={id}>
        <span>{label}</span>{required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      <div className={styles.controlGroup}>
        <Input
          {...inputProps}
          id={id}
          ref={controlRef}
          type="text"
          inputMode="decimal"
          lang={locale}
          size={size}
          required={required}
          value={draft}
          onFocus={(event) => { setFocused(true); inputProps.onFocus?.(event); }}
          onChange={(event) => {
            const nextDraft = event.currentTarget.value;
            const nextValue = parseDecimalInput(nextDraft, locale);
            setDraft(nextDraft);
            if (value === undefined) setInternalValue(nextValue);
            onValueChange?.(nextValue);
          }}
          onBlur={(event) => {
            setFocused(false);
            setDraft(formatDecimal(currentValue ?? "", locale));
            inputProps.onBlur?.(event);
          }}
          aria-invalid={error ? true : inputProps["aria-invalid"]}
          aria-describedby={describedBy}
          className={controlClassName}
        />
        {description && <div className={styles.description} id={descriptionId}>{description}</div>}
        {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}
