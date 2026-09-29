import type { HTMLAttributes, ReactNode } from "react";
import styles from "./alert.module.css";

export type AlertTone = "info" | "success" | "warning" | "error";

export function Alert({ tone = "info", title, children, className, ...props }: HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div {...props} className={[styles.alert, styles[tone], className].filter(Boolean).join(" ")} role={tone === "error" ? "alert" : "status"}>
      {title && <strong className={styles.title}>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
