"use client";

import { Drawer as PrimitiveDrawer } from "@base-ui/react/drawer";
import type { ReactNode } from "react";
import { Button } from "../../basic/button";
import type { PortalContainer } from "../portal-container";
import styles from "./drawer.module.css";

export type DrawerProps = {
  title: string;
  description: string;
  triggerLabel: string;
  closeLabel: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: PortalContainer;
};

export function Drawer({ title, description, triggerLabel, closeLabel, children, open, defaultOpen, onOpenChange, portalContainer }: DrawerProps) {
  return (
    <PrimitiveDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} swipeDirection="right">
      <PrimitiveDrawer.Trigger render={<Button variant="secondary" />}>{triggerLabel}</PrimitiveDrawer.Trigger>
      <PrimitiveDrawer.Portal container={portalContainer}>
        <PrimitiveDrawer.Backdrop className={styles.backdrop} />
        <PrimitiveDrawer.Viewport className={styles.viewport}>
          <PrimitiveDrawer.Popup className={styles.popup}>
            <PrimitiveDrawer.Content>
              <PrimitiveDrawer.Title className={styles.title}>{title}</PrimitiveDrawer.Title>
              <PrimitiveDrawer.Description className={styles.description}>{description}</PrimitiveDrawer.Description>
              {children}
              <div className={styles.actions}><PrimitiveDrawer.Close render={<Button variant="secondary" />}>{closeLabel}</PrimitiveDrawer.Close></div>
            </PrimitiveDrawer.Content>
          </PrimitiveDrawer.Popup>
        </PrimitiveDrawer.Viewport>
      </PrimitiveDrawer.Portal>
    </PrimitiveDrawer.Root>
  );
}
