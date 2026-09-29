"use client";

import { useController, type Control, type FieldPathByValue, type FieldValues } from "react-hook-form";

import {
  CheckboxField, ComboboxField, DecimalField, NumberField, RadioGroupField,
  PasswordField, SelectField, SwitchField, TextareaField, TextField,
  type CheckboxFieldProps, type ComboboxFieldProps, type DecimalFieldProps,
  type NumberFieldProps, type PasswordFieldProps, type RadioGroupFieldProps, type SelectFieldProps,
  type SwitchFieldProps, type TextareaFieldProps, type TextFieldProps,
} from "../components/fields";

type FormTextFieldProps<TValues extends FieldValues> = Omit<TextFieldProps, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormTextField<TValues extends FieldValues>({ control, name, ...props }: FormTextFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <TextField {...props} {...field} value={field.value ?? ""} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormPasswordFieldProps<TValues extends FieldValues> = Omit<PasswordFieldProps, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormPasswordField<TValues extends FieldValues>({ control, name, ...props }: FormPasswordFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <PasswordField {...props} {...field} value={field.value ?? ""} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormTextareaFieldProps<TValues extends FieldValues> = Omit<TextareaFieldProps, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormTextareaField<TValues extends FieldValues>({ control, name, ...props }: FormTextareaFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <TextareaField {...props} {...field} value={field.value ?? ""} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormSelectFieldProps<TValues extends FieldValues> = Omit<SelectFieldProps, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormSelectField<TValues extends FieldValues>({ control, name, ...props }: FormSelectFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <SelectField {...props} {...field} value={field.value ?? ""} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormComboboxFieldProps<TValues extends FieldValues> = Omit<ComboboxFieldProps, "name" | "value" | "defaultValue" | "onValueChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormComboboxField<TValues extends FieldValues>({ control, name, ...props }: FormComboboxFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <ComboboxField {...props} name={field.name} value={field.value ?? ""} disabled={field.disabled} controlRef={field.ref} onValueChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}

type FormNumberFieldProps<TValues extends FieldValues> = Omit<NumberFieldProps, "name" | "value" | "defaultValue" | "onValueChange" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, number | null | undefined>;
};

export function FormNumberField<TValues extends FieldValues>({ control, name, ...props }: FormNumberFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <NumberField {...props} name={field.name} value={field.value ?? null} disabled={field.disabled} controlRef={field.ref} onValueChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}

type FormDecimalFieldProps<TValues extends FieldValues> = Omit<DecimalFieldProps, "name" | "value" | "defaultValue" | "onValueChange" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | null | undefined>;
};

export function FormDecimalField<TValues extends FieldValues>({ control, name, ...props }: FormDecimalFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <DecimalField {...props} name={field.name} value={field.value ?? ""} disabled={field.disabled} controlRef={field.ref} onValueChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />;
}

type FormCheckboxFieldProps<TValues extends FieldValues> = Omit<CheckboxFieldProps, "name" | "checked" | "defaultChecked" | "onCheckedChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, boolean | undefined>;
};

export function FormCheckboxField<TValues extends FieldValues>({ control, name, ...props }: FormCheckboxFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <CheckboxField {...props} name={field.name} checked={field.value ?? false} onCheckedChange={field.onChange} onBlur={field.onBlur} disabled={field.disabled} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormSwitchFieldProps<TValues extends FieldValues> = Omit<SwitchFieldProps, "name" | "checked" | "defaultChecked" | "onCheckedChange" | "onBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, boolean | undefined>;
};

export function FormSwitchField<TValues extends FieldValues>({ control, name, ...props }: FormSwitchFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <SwitchField {...props} name={field.name} checked={field.value ?? false} onCheckedChange={field.onChange} onBlur={field.onBlur} disabled={field.disabled} controlRef={field.ref} error={fieldState.error?.message} />;
}

type FormRadioGroupFieldProps<TValues extends FieldValues> = Omit<RadioGroupFieldProps, "name" | "value" | "defaultValue" | "onValueChange" | "onGroupBlur" | "error" | "controlRef"> & {
  control: Control<TValues>;
  name: FieldPathByValue<TValues, string | undefined>;
};

export function FormRadioGroupField<TValues extends FieldValues>({ control, name, ...props }: FormRadioGroupFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name, disabled: props.disabled });
  return <RadioGroupField {...props} name={field.name} value={field.value ?? ""} onValueChange={field.onChange} onGroupBlur={field.onBlur} disabled={field.disabled} controlRef={field.ref} error={fieldState.error?.message} />;
}
