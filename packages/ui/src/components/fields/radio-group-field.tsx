import type { FieldsetHTMLAttributes, FocusEvent, ReactNode, Ref } from "react";
import { Radio } from "../../basic/radio";
import type { FieldPresentation } from "./text-field";
import { mergeDescribedBy } from "./field-utils";
import styles from "./choice-field.module.css";

export type RadioOption = { value: string; label: ReactNode; disabled?: boolean };

type RadioGroupNativeProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "id" | "className" | "name" | "disabled">;

export type RadioGroupFieldProps = Omit<FieldPresentation, "labelPlacement" | "size"> & RadioGroupNativeProps & {
  name: string;
  options: readonly RadioOption[];
  orientation?: "horizontal" | "vertical";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onGroupBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  controlRef?: Ref<HTMLInputElement>;
  controlClassName?: string;
};

export function RadioGroupField({
  id, label, description, error, required, containerClassName, name, options,
  orientation = "vertical", value, defaultValue, onValueChange, onGroupBlur, disabled, readOnly, controlRef, controlClassName,
  onBlur, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...fieldsetProps
}: RadioGroupFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = error ? true : ariaInvalid;
  const mergedDescriptionIds = mergeDescribedBy(describedBy, descriptionId, errorId);
  const firstEnabledIndex = options.findIndex((option) => !disabled && !option.disabled);

  return (
    <fieldset
      {...fieldsetProps}
      id={id}
      className={[styles.radioGroup, styles[orientation], containerClassName].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-describedby={mergedDescriptionIds}
      aria-invalid={invalid}
      aria-readonly={readOnly || undefined}
      onBlur={(event: FocusEvent<HTMLFieldSetElement>) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onGroupBlur?.();
      }}
    >
      <legend className={styles.legend}>{label}{required && <span className={styles.required} aria-hidden="true"> *</span>}</legend>
      {description && <div className={styles.description} id={descriptionId}>{description}</div>}
      <div className={styles.options}>
        {options.map((option, index) => {
          const optionId = `${id}-${index}`;
          return (
            <label className={styles.radioLabel} htmlFor={optionId} key={option.value}>
              <Radio
                ref={index === firstEnabledIndex ? controlRef : undefined}
                id={optionId}
                className={controlClassName}
                aria-invalid={invalid}
                aria-describedby={mergedDescriptionIds}
                aria-readonly={readOnly || undefined}
                name={name}
                value={option.value}
                checked={value === undefined ? undefined : value === option.value}
                defaultChecked={value === undefined && defaultValue === option.value}
                onClick={readOnly ? (event) => event.preventDefault() : undefined}
                onChange={(event) => { if (!readOnly && event.currentTarget.checked) onValueChange?.(option.value); }}
                required={required}
                disabled={disabled || option.disabled}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error && <div className={styles.error} id={errorId} role="alert">{error}</div>}
    </fieldset>
  );
}
