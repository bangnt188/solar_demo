import type { HTMLAttributes, ReactNode } from "react";
import styles from "./grid.module.css";

export function Grid({ columns = 2, gap = "md", className, ...props }: HTMLAttributes<HTMLDivElement> & {
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  children: ReactNode;
}) {
  return <div {...props} className={[styles.grid, styles[`columns${columns}`], styles[gap], className].filter(Boolean).join(" ")} />;
}
