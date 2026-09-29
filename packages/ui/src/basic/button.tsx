import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./control.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={[styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ")}
    />
  );
});
