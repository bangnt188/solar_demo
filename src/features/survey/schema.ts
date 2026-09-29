import { z } from "zod";
import { uiMessages } from "@solar/ui/i18n";

const required = z.string().trim().min(1, uiMessages.vi.required);

export const surveySchema = z.object({
  name: required,
  phone: required,
  location: required,
  building: required,
  bill: required,
  note: z.string(),
});

export type SurveyValues = z.infer<typeof surveySchema>;
