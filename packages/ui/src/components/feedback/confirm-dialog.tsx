"use client";

import { Dialog } from "@base-ui/react/dialog";

import { Button } from "../../basic/button";
import type { PortalContainer } from "../portal-container";
import styles from "./dialog.module.css";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  portalContainer?: PortalContainer;
};

export function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, onClose, onConfirm, portalContainer }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal container={portalContainer}>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.dialog}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.description}>{description}</Dialog.Description>
          <div className={styles.actions}>
            <Dialog.Close render={<Button variant="secondary" />}>{cancelLabel}</Dialog.Close>
            <Button onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
