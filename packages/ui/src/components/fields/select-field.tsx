import type { ReactNode, Ref } from "react";
import { Select, type SelectProps } from "../../basic/select";
import type { FieldPresentation } from "./text-field";
import styles from "./text-field.module.css";
import { mergeDescribedBy } from "./field-utils";

export type SelectFieldProps = FieldPresentation & Omit<SelectProps, "id" | "className" | "size" | "required"> & {
  options: readonly { value: string; label: ReactNode; disabled?: boolean }[];
  placeholder?: string;
  controlClassName?: string;
  labelClassName?: string;
  controlRef?: Ref<HTMLSelectElement>;
};

export function SelectField({
  id, label, description, error, required, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, labelClassName, controlRef, options, placeholder,
  "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...controlProps
}: SelectFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = error ? true : ariaInvalid;
  const mergedDescriptionIds = mergeDescribedBy(describedBy, descriptionId, errorId);

  return (
    <div className={[styles.field, styles[labelPlacement], containerClassName].filter(Boolean).join(" ")}>
      <label className={[styles.label, labelClassName].filter(Boolean).join(" ")} htmlFor={id}>
        <span>{label}</span>{required && <span className={styles.required} aria-hidden="true">*</span>}
      </label>
      <div className={styles.controlGroup}>
        <Select {...controlProps} id={id} ref={controlRef} size={size} required={required} aria-invalid={invalid} aria-describedby={mergedDescriptionIds} className={controlClassName}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </Select>
        {description && <div className={styles.description} id={descriptionId}>{description}</div>}
        {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}
