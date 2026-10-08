"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@solar/ui";
import {
  FormCheckboxField,
  FormSelectField,
  FormTextareaField,
  FormTextField,
  SurveyForm as SurveyFormShell,
  useSurveySubmission,
} from "@solar/ui/forms";
import type { SurveyFormContent } from "@/types/survey-content";
import { surveySchema, type SurveyValues } from "./schema";

export function SurveyForm({ content }: { content: SurveyFormContent }) {
  const submission = useSurveySubmission<SurveyValues>({
    mode: "demo",
    storageKey: "solar:survey-rate-limit:v1",
  });
  const { control, handleSubmit, formState, reset } = useForm<SurveyValues>({
    resolver: zodResolver(surveySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", location: "", building: "", bill: "", note: "", consent: false },
  });

  const submit = handleSubmit(async (values) => {
    if (await submission.submit(values) === "success") reset();
  });

  return (
    <SurveyFormShell className="survey-form" noValidate submission={submission} onSubmit={submit}>
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

      <Button type="submit" disabled={!submission.ready || formState.isSubmitting || submission.submitting || submission.coolingDown}>
        {formState.isSubmitting || submission.submitting
          ? content.submittingLabel
          : submission.coolingDown
            ? `${content.cooldownButtonLabel} ${submission.countdown}`
            : content.submitLabel}
      </Button>

      {submission.coolingDown && (
        <p className="survey-cooldown" role="status" aria-live="polite">
          {content.cooldownMessage} <strong>{submission.countdown}</strong>.
        </p>
      )}
    </SurveyFormShell>
  );
}
