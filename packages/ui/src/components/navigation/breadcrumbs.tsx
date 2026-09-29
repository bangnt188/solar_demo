import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./breadcrumbs.module.css";

type BreadcrumbItem = {
  label: ReactNode;
  href: string;
  current?: boolean;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;
};

export function Breadcrumbs({ items, label, className }: { items: readonly BreadcrumbItem[]; label: string; className?: string }) {
  return (
    <nav className={[styles.nav, className].filter(Boolean).join(" ")} aria-label={label}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li className={styles.item} key={`${item.href}-${index}`}>
            {item.current ? <span aria-current="page">{item.label}</span> : <a {...item.linkProps} href={item.href}>{item.label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
