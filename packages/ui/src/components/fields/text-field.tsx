import type { ReactNode, Ref } from "react";
import { Input, type InputProps } from "../../basic/input";
import { Textarea, type TextareaProps } from "../../basic/textarea";
import { mergeDescribedBy } from "./field-utils";
import styles from "./text-field.module.css";

export type FieldPresentation = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  labelPlacement?: "top" | "start";
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
};

export type TextFieldProps = FieldPresentation & Omit<InputProps, "id" | "className" | "size" | "required"> & {
  controlClassName?: string;
  labelClassName?: string;
  controlRef?: Ref<HTMLInputElement>;
  trailingAction?: ReactNode;
};

export function TextField({
  id, label, description, error, required, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, labelClassName, controlRef, trailingAction,
  "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...controlProps
}: TextFieldProps) {
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
        {trailingAction ? (
          <div className={styles.controlWithAction}>
            <Input {...controlProps} id={id} ref={controlRef} size={size} required={required} aria-invalid={invalid} aria-describedby={mergedDescriptionIds} className={controlClassName} />
            {trailingAction}
          </div>
        ) : (
          <Input {...controlProps} id={id} ref={controlRef} size={size} required={required} aria-invalid={invalid} aria-describedby={mergedDescriptionIds} className={controlClassName} />
        )}
        {description && <div className={styles.description} id={descriptionId}>{description}</div>}
        {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}

export type TextareaFieldProps = FieldPresentation & Omit<TextareaProps, "id" | "className" | "size" | "required"> & {
  controlClassName?: string;
  labelClassName?: string;
  controlRef?: Ref<HTMLTextAreaElement>;
};

export function TextareaField({
  id, label, description, error, required, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, labelClassName, controlRef,
  "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...controlProps
}: TextareaFieldProps) {
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
        <Textarea {...controlProps} id={id} ref={controlRef} size={size} required={required} aria-invalid={invalid} aria-describedby={mergedDescriptionIds} className={controlClassName} />
        {description && <div className={styles.description} id={descriptionId}>{description}</div>}
        {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}
