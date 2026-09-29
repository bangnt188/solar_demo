import { forwardRef, type HTMLAttributes } from "react";
import styles from "./card.module.css";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "raised";
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={[styles.card, styles[variant], className].filter(Boolean).join(" ")} />;
});
