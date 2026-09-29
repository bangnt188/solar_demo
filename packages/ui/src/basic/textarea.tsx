import { forwardRef, type TextareaHTMLAttributes } from "react";
import styles from "./control.module.css";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { size?: "sm" | "md" | "lg" };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size = "md", ...props },
  ref,
) {
  return <textarea {...props} ref={ref} className={[styles.control, styles.textarea, styles[size], className].filter(Boolean).join(" ")} />;
});
