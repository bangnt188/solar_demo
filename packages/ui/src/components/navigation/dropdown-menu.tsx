"use client";

import { Menu } from "@base-ui/react/menu";
import { Button } from "../../basic/button";
import type { PortalContainer } from "../portal-container";
import styles from "./dropdown-menu.module.css";

export type DropdownMenuItem = { value: string; label: string; onSelect: () => void; disabled?: boolean };
export type DropdownMenuProps = {
  label: string;
  items: readonly DropdownMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: PortalContainer;
};

export function DropdownMenu({ label, items, open, defaultOpen, onOpenChange, portalContainer }: DropdownMenuProps) {
  return (
    <Menu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Menu.Trigger render={<Button variant="secondary" />}>{label}</Menu.Trigger>
      <Menu.Portal container={portalContainer}>
        <Menu.Positioner className={styles.positioner} sideOffset={8} align="start">
          <Menu.Popup className={styles.popup}>
            {items.map((item) => <Menu.Item key={item.value} className={styles.item} disabled={item.disabled} onClick={item.onSelect}>{item.label}</Menu.Item>)}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
