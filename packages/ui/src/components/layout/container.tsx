import type { HTMLAttributes, ReactNode } from "react";
import styles from "./container.module.css";

export function Container({ width = "lg", className, ...props }: HTMLAttributes<HTMLDivElement> & {
  width?: "sm" | "md" | "lg" | "full";
  children: ReactNode;
}) {
  return <div {...props} className={[styles.container, styles[width], className].filter(Boolean).join(" ")} />;
}
