import { Button } from "../../basic/button";
import styles from "./pagination.module.css";

export function Pagination({ page, pageCount, onPageChange, previousLabel, nextLabel, label }: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  label: string;
}) {
  const visiblePage = pageCount === 0 ? 0 : Math.min(Math.max(page, 1), pageCount);

  return (
    <nav className={styles.pagination} aria-label={label}>
      <Button variant="secondary" size="sm" disabled={visiblePage <= 1} onClick={() => onPageChange(visiblePage - 1)}>{previousLabel}</Button>
      <span aria-live="polite">{visiblePage} / {pageCount}</span>
      <Button variant="secondary" size="sm" disabled={visiblePage >= pageCount} onClick={() => onPageChange(visiblePage + 1)}>{nextLabel}</Button>
    </nav>
  );
}
