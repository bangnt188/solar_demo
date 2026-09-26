export type SurveyFormContent = {
  recipient: string;
  subject: string;
  nameLabel: string;
  phoneLabel: string;
  locationLabel: string;
  buildingLabel: string;
  billLabel: string;
  noteLabel: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  locationPlaceholder: string;
  notePlaceholder: string;
  buildingOptions: readonly string[];
  billOptions: readonly string[];
  disclaimer: string;
  submitLabel: string;
};

export type SurveyScreenContent = {
  eyebrow: string;
  title: string;
  introduction: string;
  formHeading: string;
  formDescription: string;
  form: SurveyFormContent;
};
