"use client";

import { Popover as PrimitivePopover } from "@base-ui/react/popover";
import type { ReactNode } from "react";
import { Button } from "../../basic/button";
import type { PortalContainer } from "../portal-container";
import styles from "./popover.module.css";

export type PopoverProps = {
  triggerLabel: string;
  title: string;
  closeLabel: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: PortalContainer;
};

export function Popover({ triggerLabel, title, closeLabel, children, open, defaultOpen, onOpenChange, portalContainer }: PopoverProps) {
  return (
    <PrimitivePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PrimitivePopover.Trigger render={<Button variant="secondary" />}>{triggerLabel}</PrimitivePopover.Trigger>
      <PrimitivePopover.Portal container={portalContainer}>
        <PrimitivePopover.Positioner className={styles.positioner} sideOffset={8}>
          <PrimitivePopover.Popup className={styles.popup}>
            <PrimitivePopover.Title className={styles.title}>{title}</PrimitivePopover.Title>
            <div className={styles.content}>{children}</div>
            <PrimitivePopover.Close render={<Button variant="quiet" size="sm" />}>{closeLabel}</PrimitivePopover.Close>
          </PrimitivePopover.Popup>
        </PrimitivePopover.Positioner>
      </PrimitivePopover.Portal>
    </PrimitivePopover.Root>
  );
}
