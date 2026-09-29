import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./control.module.css";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ className, ...props }, ref) {
  return <input {...props} ref={ref} type="checkbox" className={[styles.choice, className].filter(Boolean).join(" ")} />;
});
