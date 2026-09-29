import { forwardRef, type SelectHTMLAttributes } from "react";
import styles from "./control.module.css";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { size?: "sm" | "md" | "lg" };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size = "md", ...props },
  ref,
) {
  return <select {...props} ref={ref} className={[styles.control, styles[size], className].filter(Boolean).join(" ")} />;
});
