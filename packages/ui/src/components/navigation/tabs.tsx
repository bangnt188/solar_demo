"use client";

import { Tabs } from "@base-ui/react/tabs";

import type { ReactNode } from "react";
import styles from "./tabs.module.css";

export type TabItem = { value: string; label: ReactNode; content: ReactNode; disabled?: boolean };

export function TabsComponent({ items, label, orientation = "horizontal", value, defaultValue, onValueChange }: {
  items: readonly TabItem[];
  label: string;
  orientation?: "horizontal" | "vertical";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
}) {
  return (
    <Tabs.Root value={value} defaultValue={value === undefined ? defaultValue ?? items.find((item) => !item.disabled)?.value : undefined} orientation={orientation} onValueChange={onValueChange} className={[styles.root, styles[orientation]].join(" ")}>
      <Tabs.List className={styles.list} aria-label={label}>
        {items.map((item) => <Tabs.Tab className={styles.tab} value={item.value} disabled={item.disabled} key={item.value}>{item.label}</Tabs.Tab>)}
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
      {items.map((item) => <Tabs.Panel className={styles.panel} value={item.value} key={item.value}>{item.content}</Tabs.Panel>)}
    </Tabs.Root>
  );
}
