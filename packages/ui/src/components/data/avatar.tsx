"use client";

import { Avatar as PrimitiveAvatar } from "@base-ui/react/avatar";
import type { ReactNode } from "react";
import styles from "./avatar.module.css";

export type AvatarProps = {
  name: string;
  fallback: ReactNode;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({ name, fallback, src, size = "md", className }: AvatarProps) {
  return (
    <PrimitiveAvatar.Root role="img" aria-label={name} className={[styles.avatar, styles[size], className].filter(Boolean).join(" ")}>
      {src && <PrimitiveAvatar.Image src={src} alt="" className={styles.image} />}
      <PrimitiveAvatar.Fallback aria-hidden="true" className={styles.fallback}>{fallback}</PrimitiveAvatar.Fallback>
    </PrimitiveAvatar.Root>
  );
}
