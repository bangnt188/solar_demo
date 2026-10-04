"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Toast } from "@solar/ui";
import { FormCheckboxField, FormSelectField, FormTextareaField, FormTextField } from "@solar/ui/forms";
import type { SurveyFormContent } from "@/types/survey-content";
import { surveySchema, type SurveyValues } from "./schema";

type SubmitStatus = "idle" | "success" | "error";
type SurveyRateLimitState = {
  successTimestamps: number[];
  cooldownUntil: number | null;
};

const SURVEY_RATE_LIMIT_KEY = "solar:survey-rate-limit:v1";
const SURVEY_SUCCESS_LIMIT = 3;
const SURVEY_WINDOW_MS = 300_000;
const SURVEY_COOLDOWN_MS = 300_000;

function emptyRateLimitState(): SurveyRateLimitState {
  return { successTimestamps: [], cooldownUntil: null };
}

function readRateLimitState(now = Date.now()): SurveyRateLimitState {
  try {
    const raw = window.localStorage.getItem(SURVEY_RATE_LIMIT_KEY);
    if (!raw) return emptyRateLimitState();

    const parsed = JSON.parse(raw) as Partial<SurveyRateLimitState>;
    const cooldownUntil = typeof parsed.cooldownUntil === "number" ? parsed.cooldownUntil : null;

    if (cooldownUntil !== null) {
      if (cooldownUntil > now) {
        return { successTimestamps: [], cooldownUntil };
      }

      window.localStorage.removeItem(SURVEY_RATE_LIMIT_KEY);
      return emptyRateLimitState();
    }

    const successTimestamps = Array.isArray(parsed.successTimestamps)
      ? parsed.successTimestamps.filter(
          (value): value is number => typeof value === "number" && value > now - SURVEY_WINDOW_MS && value <= now,
        )
      : [];

    return { successTimestamps, cooldownUntil: null };
  } catch {
    return emptyRateLimitState();
  }
}

function writeRateLimitState(state: SurveyRateLimitState): void {
  try {
    window.localStorage.setItem(SURVEY_RATE_LIMIT_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable in private/restricted browser modes.
  }
}

function recordSuccessfulSubmission(now = Date.now()): number | null {
  const current = readRateLimitState(now);
  if (current.cooldownUntil !== null) return current.cooldownUntil;

  const successTimestamps = [...current.successTimestamps, now].filter(
    (timestamp) => timestamp > now - SURVEY_WINDOW_MS,
  );

  if (successTimestamps.length >= SURVEY_SUCCESS_LIMIT) {
    const cooldownUntil = now + SURVEY_COOLDOWN_MS;
    writeRateLimitState({ successTimestamps: [], cooldownUntil });
    return cooldownUntil;
  }

  writeRateLimitState({ successTimestamps, cooldownUntil: null });
  return null;
}

function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function SurveyForm({ content }: { content: SurveyFormContent }) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [rateLimitReady, setRateLimitReady] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const { control, handleSubmit, formState, reset } = useForm<SurveyValues>({
    resolver: zodResolver(surveySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", location: "", building: "", bill: "", note: "", consent: false },
  });

  const dismissToast = useCallback(() => setSubmitStatus("idle"), []);

  useEffect(() => {
    const syncFromStorage = () => {
      const state = readRateLimitState();
      setCooldownUntil(state.cooldownUntil);
      setNow(Date.now());
      setRateLimitReady(true);
    };

    syncFromStorage();

    const onStorage = (event: StorageEvent) => {
      if (event.key === SURVEY_RATE_LIMIT_KEY || event.key === null) syncFromStorage();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (cooldownUntil === null) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);

      if (current >= cooldownUntil) {
        try {
          window.localStorage.removeItem(SURVEY_RATE_LIMIT_KEY);
        } catch {
          // Ignore storage cleanup failures; UI still unlocks locally.
        }
        setCooldownUntil(null);
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  const cooldownRemaining = cooldownUntil === null ? 0 : Math.max(0, cooldownUntil - now);
  const isCoolingDown = cooldownRemaining > 0;

  const submit = handleSubmit(async () => {
    const storedState = readRateLimitState();
    if (storedState.cooldownUntil !== null) {
      setCooldownUntil(storedState.cooldownUntil);
      setNow(Date.now());
      return;
    }

    setSubmitStatus("idle");
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    if (Math.random() < 0.5) {
      setSubmitStatus("error");
      return;
    }

    const nextCooldownUntil = recordSuccessfulSubmission();
    if (nextCooldownUntil !== null) {
      setCooldownUntil(nextCooldownUntil);
      setNow(Date.now());
    }

    setSubmitStatus("success");
    reset();
  });

  const countdown = formatCountdown(cooldownRemaining);

  return (
    <form className="survey-form" noValidate onSubmit={submit}>
      <div className="survey-fields">
        <FormTextField control={control} id="survey-name" name="name" label={content.nameLabel} autoComplete="name" required placeholder={content.namePlaceholder} />
        <FormTextField control={control} id="survey-phone" name="phone" type="tel" label={content.phoneLabel} autoComplete="tel" required placeholder={content.phonePlaceholder} />
        <FormTextField control={control} id="survey-location" name="location" label={content.locationLabel} autoComplete="street-address" required placeholder={content.locationPlaceholder} containerClassName="survey-wide" />
        <FormSelectField control={control} id="survey-building" name="building" label={content.buildingLabel} placeholder="Chọn loại công trình" options={content.buildingOptions.map((value) => ({ value, label: value }))} />
        <FormSelectField control={control} id="survey-bill" name="bill" label={content.billLabel} placeholder="Chọn khoảng chi phí" options={content.billOptions.map((value) => ({ value, label: value }))} />
        <FormTextareaField control={control} id="survey-note" name="note" label={content.noteLabel} rows={4} placeholder={content.notePlaceholder} containerClassName="survey-wide" />
      </div>

      <FormCheckboxField
        control={control}
        id="survey-consent"
        name="consent"
        label={content.consentLabel}
        required
        containerClassName="survey-consent"
      />

      <p className="survey-disclaimer">{content.disclaimer}</p>

      <Button type="submit" disabled={!rateLimitReady || formState.isSubmitting || isCoolingDown}>
        {formState.isSubmitting
          ? content.submittingLabel
          : isCoolingDown
            ? `${content.cooldownButtonLabel} ${countdown}`
            : content.submitLabel}
      </Button>

      {isCoolingDown && (
        <p className="survey-cooldown" role="status" aria-live="polite">
          {content.cooldownMessage} <strong>{countdown}</strong>.
        </p>
      )}

      {submitStatus === "success" && (
        <div className="survey-toast-region">
          <Toast
            tone="success"
            title={content.successTitle}
            text={content.successMessage}
            closeLabel="Đóng thông báo"
            onDismiss={dismissToast}
          />
        </div>
      )}

      {submitStatus === "error" && (
        <div className="survey-toast-region">
          <Toast
            tone="error"
            title={content.failureTitle}
            text={content.failureMessage}
            closeLabel="Đóng thông báo"
            onDismiss={dismissToast}
          />
        </div>
      )}
    </form>
  );
}
