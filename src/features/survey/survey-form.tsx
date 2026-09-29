"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@solar/ui";
import { FormSelectField, FormTextareaField, FormTextField } from "@solar/ui/forms";
import type { SurveyFormContent } from "@/types/survey-content";
import { surveySchema, type SurveyValues } from "./schema";

export function SurveyForm({ content }: { content: SurveyFormContent }) {
  const { control, handleSubmit, formState } = useForm<SurveyValues>({
    resolver: zodResolver(surveySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", phone: "", location: "", building: "", bill: "", note: "" },
  });

  const submit = handleSubmit((values) => {
    const body = [
      `${content.nameLabel}: ${values.name}`,
      `${content.phoneLabel}: ${values.phone}`,
      `${content.locationLabel}: ${values.location}`,
      `${content.buildingLabel}: ${values.building}`,
      `${content.billLabel}: ${values.bill}`,
      `${content.noteLabel}: ${values.note || "Không có"}`,
    ].join("\r\n");
    window.location.href = `mailto:${content.recipient}?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(body)}`;
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
      <p className="survey-disclaimer">{content.disclaimer}</p>
      <Button type="submit" disabled={formState.isSubmitting}>{content.submitLabel}</Button>
    </form>
  );
}
