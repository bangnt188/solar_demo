import styles from "./loading-indicator.module.css";

export function LoadingIndicator({ label }: { label: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite" aria-busy="true">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
