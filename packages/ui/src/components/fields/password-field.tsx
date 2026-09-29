"use client";

import { useState } from "react";
import { Button } from "../../basic/button";
import { TextField, type TextFieldProps } from "./text-field";

export type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailingAction"> & {
  showLabel: string;
  hideLabel: string;
};

export function PasswordField({ showLabel, hideLabel, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? hideLabel : showLabel;

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailingAction={
        <Button variant="quiet" size="sm" disabled={props.disabled} aria-label={toggleLabel} aria-pressed={visible} onClick={() => setVisible(!visible)}>
          {toggleLabel}
        </Button>
      }
    />
  );
}
