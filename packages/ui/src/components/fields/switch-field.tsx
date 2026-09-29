import type { InputHTMLAttributes, Ref } from "react";
import { Switch } from "../../basic/switch";
import type { FieldPresentation } from "./text-field";
import { mergeDescribedBy } from "./field-utils";
import styles from "./choice-field.module.css";

type SwitchNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "role" | "checked" | "defaultChecked" | "onChange" | "className" | "size">;

export type SwitchFieldProps = Omit<FieldPresentation, "labelPlacement" | "size"> & SwitchNativeProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  controlRef?: Ref<HTMLInputElement>;
  controlClassName?: string;
  labelClassName?: string;
};

export function SwitchField({
  id, label, description, error, required, containerClassName, controlClassName, labelClassName,
  checked, defaultChecked, onCheckedChange, controlRef, onClick, readOnly, disabled,
  "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...controlProps
}: SwitchFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = error ? true : ariaInvalid;
  const mergedDescriptionIds = mergeDescribedBy(describedBy, descriptionId, errorId);

  return (
    <div className={[styles.choiceField, containerClassName].filter(Boolean).join(" ")}>
      <label className={[styles.switchLabel, labelClassName].filter(Boolean).join(" ")} htmlFor={id}>
        <Switch
          {...controlProps}
          ref={controlRef}
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-readonly={readOnly || undefined}
          aria-invalid={invalid}
          aria-describedby={mergedDescriptionIds}
          className={controlClassName}
          onClick={(event) => { if (readOnly) event.preventDefault(); onClick?.(event); }}
          onChange={(event) => { if (!readOnly) onCheckedChange?.(event.currentTarget.checked); }}
        />
        <span>{label}{required && <span className={styles.required} aria-hidden="true"> *</span>}</span>
      </label>
      {description && <div className={styles.description} id={descriptionId}>{description}</div>}
      {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
    </div>
  );
}
