"use client";

import { NumberField as PrimitiveNumberField } from "@base-ui/react/number-field";

import type { InputHTMLAttributes, Ref } from "react";
import { Input } from "../../basic/input";
import type { FieldPresentation } from "./text-field";
import styles from "./text-field.module.css";
import { mergeDescribedBy } from "./field-utils";

export type NumberFieldProps = Omit<FieldPresentation, "size"> & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "type" | "value" | "defaultValue" | "onChange" | "size" | "min" | "max" | "step"> & {
  size?: FieldPresentation["size"];
  min?: number;
  max?: number;
  step?: number | "any";
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  controlClassName?: string;
  labelClassName?: string;
  controlRef?: Ref<HTMLInputElement>;
  locale?: string;
};

export function NumberField({
  id, label, description, error, required, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, labelClassName, value, defaultValue, onValueChange,
  locale, controlRef, min, max, step, name, form, disabled, readOnly, ...inputProps
}: NumberFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = mergeDescribedBy(inputProps["aria-describedby"], descriptionId, errorId);

  return (
    <div className={[styles.field, styles[labelPlacement], containerClassName].filter(Boolean).join(" ")}>
      <label className={[styles.label, labelClassName].filter(Boolean).join(" ")} htmlFor={id}>
        <span>{label}</span>{required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      <div className={styles.controlGroup}>
        <PrimitiveNumberField.Root
          id={id}
          name={name}
          form={form}
          value={value}
          defaultValue={defaultValue ?? undefined}
          onValueChange={onValueChange}
          locale={locale}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        >
          <PrimitiveNumberField.Input
            {...inputProps}
            ref={controlRef}
            render={<Input size={size} className={controlClassName} />}
            aria-invalid={error ? true : inputProps["aria-invalid"]}
            aria-describedby={describedBy}
          />
        </PrimitiveNumberField.Root>
        {description && <div className={styles.description} id={descriptionId}>{description}</div>}
        {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}
