import type { ReactNode } from "react";
import styles from "./empty-state.module.css";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <section className={styles.empty} aria-label={title}>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action && <div>{action}</div>}
    </section>
  );
}
