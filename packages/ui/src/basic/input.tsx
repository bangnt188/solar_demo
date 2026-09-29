import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./control.module.css";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "sm" | "md" | "lg" };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", ...props },
  ref,
) {
  return <input {...props} ref={ref} className={[styles.control, styles[size], className].filter(Boolean).join(" ")} />;
});
