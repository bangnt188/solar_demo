"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { Button } from "../../basic/button";
import type { PortalContainer } from "../portal-container";
import styles from "./dialog.module.css";

export type ModalProps = {
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

export function Modal({ title, description, triggerLabel, closeLabel, children, open, defaultOpen, onOpenChange, portalContainer }: ModalProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger render={<Button variant="secondary" />}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Portal container={portalContainer}>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.dialog}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.description}>{description}</Dialog.Description>
          {children}
          <div className={styles.actions}><Dialog.Close render={<Button variant="secondary" />}>{closeLabel}</Dialog.Close></div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
