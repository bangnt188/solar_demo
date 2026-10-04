export type SurveyFormContent = {
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
  consentLabel: string;
  disclaimer: string;
  submitLabel: string;
  submittingLabel: string;
  cooldownButtonLabel: string;
  cooldownMessage: string;
  successTitle: string;
  successMessage: string;
  failureTitle: string;
  failureMessage: string;
};

export type SurveyScreenContent = {
  eyebrow: string;
  title: string;
  introduction: string;
  formHeading: string;
  formDescription: string;
  form: SurveyFormContent;
};
