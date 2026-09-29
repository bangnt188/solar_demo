import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./control.module.css";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ className, ...props }, ref) {
  return <input {...props} ref={ref} type="radio" className={[styles.choice, className].filter(Boolean).join(" ")} />;
});
