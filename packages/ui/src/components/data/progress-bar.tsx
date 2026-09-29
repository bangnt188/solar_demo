"use client";

import { Progress } from "@base-ui/react/progress";
import { uiMessages } from "../../i18n";
import styles from "./progress-bar.module.css";

export type ProgressBarProps = {
  label: string;
  value: number | null;
  min?: number;
  max?: number;
  locale?: string;
  pendingLabel?: string;
  className?: string;
};

export function ProgressBar({ label, value, min = 0, max = 100, locale, pendingLabel, className }: ProgressBarProps) {
  return (
    <Progress.Root
      value={value}
      min={min}
      max={max}
      locale={locale}
      getAriaValueText={(formatted, current) => current === null ? pendingLabel ?? (locale?.startsWith("en") ? uiMessages.en.loading : uiMessages.vi.loading) : formatted}
      className={[styles.progress, className].filter(Boolean).join(" ")}
    >
      <Progress.Label className={styles.label}>{label}</Progress.Label>
      <Progress.Value className={styles.value} />
      <Progress.Track className={styles.track}><Progress.Indicator className={styles.indicator} /></Progress.Track>
    </Progress.Root>
  );
}
