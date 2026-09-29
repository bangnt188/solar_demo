"use client";

import { Combobox } from "@base-ui/react/combobox";

import type { InputHTMLAttributes, Ref } from "react";
import type { PortalContainer } from "../portal-container";
import type { FieldPresentation } from "./text-field";
import controlStyles from "../../basic/control.module.css";
import fieldStyles from "./text-field.module.css";
import styles from "./combobox.module.css";
import { mergeDescribedBy } from "./field-utils";

export type ComboboxOption = { value: string; label: string };

export type ComboboxFieldProps = FieldPresentation & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "size" | "value" | "defaultValue" | "onChange" | "name" | "disabled" | "required"> & {
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  emptyLabel: string;
  openLabel: string;
  name?: string;
  disabled?: boolean;
  controlClassName?: string;
  controlRef?: Ref<HTMLInputElement>;
  portalContainer?: PortalContainer;
};

export function ComboboxField({
  id, label, options, value, defaultValue, onValueChange, onBlur, placeholder, emptyLabel, openLabel, name,
  disabled, required, readOnly, description, error, labelPlacement = "top", size = "md",
  containerClassName, controlClassName, controlRef, portalContainer, "aria-describedby": describedBy, "aria-invalid": ariaInvalid,
  ...inputProps
}: ComboboxFieldProps) {
  const selected = options.find((option) => option.value === value) ?? null;
  const initial = options.find((option) => option.value === defaultValue) ?? null;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = error ? true : ariaInvalid;
  const mergedDescriptionIds = mergeDescribedBy(describedBy, descriptionId, errorId);

  return (
    <div className={[fieldStyles.field, fieldStyles[labelPlacement], containerClassName].filter(Boolean).join(" ")}>
      <label className={fieldStyles.label} htmlFor={id}>
        <span>{label}</span>{required && <span className={fieldStyles.required} aria-hidden="true">*</span>}
      </label>
      <div className={fieldStyles.controlGroup}>
        <Combobox.Root
          items={options}
          name={name}
          required={required}
          disabled={disabled}
          value={value === undefined ? undefined : selected}
          defaultValue={defaultValue === undefined ? undefined : initial}
          onValueChange={(option) => onValueChange?.(option?.value ?? "")}
          itemToStringLabel={(option) => option.label}
          itemToStringValue={(option) => option.value}
          isItemEqualToValue={(option, selectedOption) => option.value === selectedOption.value}
          autoHighlight
        >
          <div className={styles.combobox}>
            <Combobox.Input
              {...inputProps}
              id={id}
              ref={controlRef}
              onBlur={onBlur}
              readOnly={readOnly}
              className={[controlStyles.control, controlStyles[size], styles.input, controlClassName].filter(Boolean).join(" ")}
              placeholder={placeholder}
              aria-required={required || undefined}
              aria-invalid={invalid}
              aria-describedby={mergedDescriptionIds}
            />
            <Combobox.Trigger className={styles.trigger} aria-label={openLabel} disabled={disabled || readOnly}>⌄</Combobox.Trigger>
          </div>
          <Combobox.Portal container={portalContainer}>
            <Combobox.Positioner className={styles.positioner} sideOffset={4}>
              <Combobox.Popup className={styles.popup}>
                <Combobox.Empty className={styles.empty}>{emptyLabel}</Combobox.Empty>
                <Combobox.List className={styles.list}>
                  {(option: ComboboxOption) => <Combobox.Item className={styles.item} key={option.value} value={option}>{option.label}</Combobox.Item>}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        {description && <div className={fieldStyles.description} id={descriptionId}>{description}</div>}
        {error && <div className={fieldStyles.error} id={errorId} role="alert">{error}</div>}
      </div>
    </div>
  );
}
