"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button } from "../../basic/button";
import styles from "./toast.module.css";

export type ToastTone = "info" | "success" | "warning" | "error";

export function Toast({ tone, text, onDismiss, closeLabel, duration = 5000 }: {
  tone: ToastTone;
  text: string;
  onDismiss: () => void;
  closeLabel: string;
  duration?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const remaining = useRef(duration);
  const startedAt = useRef(0);
  const previousDuration = useRef(duration);

  useEffect(() => {
    if (previousDuration.current !== duration) {
      remaining.current = duration;
      previousDuration.current = duration;
    }
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(onDismiss, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    };
  }, [duration, onDismiss, paused]);

  return (
    <div
      className={[styles.toast, styles[tone]].join(" ")}
      role={tone === "error" ? "alert" : "status"}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
      onPointerEnter={(event: PointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
    >
      <span>{text}</span>
      <Button variant="quiet" size="sm" aria-label={closeLabel} onClick={onDismiss}>×</Button>
    </div>
  );
}
