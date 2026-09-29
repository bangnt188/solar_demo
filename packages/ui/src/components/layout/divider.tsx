import styles from "./divider.module.css";

export function Divider({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return <div className={[styles.divider, styles[orientation]].join(" ")} role="separator" aria-orientation={orientation} />;
}
