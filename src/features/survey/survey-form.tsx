"use client";

import type { FormEvent } from "react";
import type { SurveyFormContent } from "@/types/survey-content";

export function SurveyForm({ content }: { content: SurveyFormContent }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${content.nameLabel}: ${data.get("name")}`,
      `${content.phoneLabel}: ${data.get("phone")}`,
      `${content.locationLabel}: ${data.get("location")}`,
      `${content.buildingLabel}: ${data.get("building")}`,
      `${content.billLabel}: ${data.get("bill")}`,
      `${content.noteLabel}: ${data.get("note") || "Không có"}`,
    ].join("\r\n");
    window.location.href = `mailto:${content.recipient}?subject=${encodeURIComponent(content.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <div className="survey-fields">
        <label>{content.nameLabel} <span>*</span><input name="name" autoComplete="name" required placeholder={content.namePlaceholder} /></label>
        <label>{content.phoneLabel} <span>*</span><input name="phone" type="tel" autoComplete="tel" required placeholder={content.phonePlaceholder} /></label>
        <label className="survey-wide">{content.locationLabel} <span>*</span><input name="location" autoComplete="street-address" required placeholder={content.locationPlaceholder} /></label>
        <label>{content.buildingLabel} <span>*</span><select name="building" required defaultValue=""><option value="" disabled>Chọn loại công trình</option>{content.buildingOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>{content.billLabel} <span>*</span><select name="bill" required defaultValue=""><option value="" disabled>Chọn khoảng chi phí</option>{content.billOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label className="survey-wide">{content.noteLabel}<textarea name="note" rows={4} placeholder={content.notePlaceholder} /></label>
      </div>
      <p className="survey-disclaimer">{content.disclaimer}</p>
      <button className="button" type="submit">{content.submitLabel}</button>
    </form>
  );
}
