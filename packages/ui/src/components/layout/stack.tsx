import type { HTMLAttributes, ReactNode } from "react";
import styles from "./stack.module.css";

export function Stack({ direction = "vertical", gap = "md", className, ...props }: HTMLAttributes<HTMLDivElement> & {
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  children: ReactNode;
}) {
  return <div {...props} className={[styles.stack, styles[direction], styles[gap], className].filter(Boolean).join(" ")} />;
}
