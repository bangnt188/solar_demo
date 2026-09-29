import type { ReactNode } from "react";
import styles from "./table.module.css";

export type TableColumn<TRow> = {
  id: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
};

export function Table<TRow>({
  columns, rows, getRowKey, emptyLabel, caption,
}: {
  columns: readonly TableColumn<TRow>[];
  rows: readonly TRow[];
  getRowKey: (row: TRow) => string | number;
  emptyLabel: string;
  caption?: string;
}) {
  return (
    <div className={styles.viewport}>
      <table className={styles.table}>
        {caption && <caption>{caption}</caption>}
        <thead><tr>{columns.map((column) => <th key={column.id} scope="col">{column.header}</th>)}</tr></thead>
        <tbody>
          {rows.length > 0
            ? rows.map((row) => <tr key={getRowKey(row)}>{columns.map((column) => <td key={column.id}>{column.cell(row)}</td>)}</tr>)
            : <tr><td className={styles.empty} colSpan={Math.max(columns.length, 1)}>{emptyLabel}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
