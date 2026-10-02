"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@solar/ui";
import { FormCheckboxField, FormSelectField, FormTextareaField, FormTextField } from "@solar/ui/forms";
import type { SurveyFormContent } from "@/types/survey-content";
import { surveySchema, type SurveyValues } from "./schema";

type SubmitStatus = "idle" | "success" | "error";

export function SurveyForm({ content }: { content: SurveyFormContent }) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const { control, handleSubmit, formState, reset } = useForm<SurveyValues>({
    resolver: zodResolver(surveySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", location: "", building: "", bill: "", note: "", consent: false },
  });

  const submit = handleSubmit(async () => {
    setSubmitStatus("idle");
    await new Promise((resolve) => window.setTimeout(resolve, 700));

    if (Math.random() < 0.5) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("success");
    reset();
  });

  return (
    <form className="survey-form" noValidate onSubmit={submit}>
      <div className="survey-fields">
        <FormTextField control={control} id="survey-name" name="name" label={content.nameLabel} autoComplete="name" required placeholder={content.namePlaceholder} />
        <FormTextField control={control} id="survey-phone" name="phone" type="tel" label={content.phoneLabel} autoComplete="tel" required placeholder={content.phonePlaceholder} />
        <FormTextField control={control} id="survey-location" name="location" label={content.locationLabel} autoComplete="street-address" required placeholder={content.locationPlaceholder} containerClassName="survey-wide" />
        <FormSelectField control={control} id="survey-building" name="building" label={content.buildingLabel} required placeholder="Chọn loại công trình" options={content.buildingOptions.map((value) => ({ value, label: value }))} />
        <FormSelectField control={control} id="survey-bill" name="bill" label={content.billLabel} required placeholder="Chọn khoảng chi phí" options={content.billOptions.map((value) => ({ value, label: value }))} />
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

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? content.submittingLabel : content.submitLabel}
      </Button>

      {submitStatus === "success" && (
        <div className="survey-submit-status survey-submit-status-success" role="status" aria-live="polite">
          <strong>{content.successTitle}</strong>
          <p>{content.successMessage}</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="survey-submit-status survey-submit-status-error" role="alert">
          <strong>{content.failureTitle}</strong>
          <p>{content.failureMessage}</p>
        </div>
      )}
    </form>
  );
}
