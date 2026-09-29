import type { HTMLAttributes, ReactNode } from "react";
import styles from "./badge.module.css";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "action" | "success" | "warning" | "error";
  children: ReactNode;
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={[styles.badge, styles[tone], className].filter(Boolean).join(" ")} />;
}
