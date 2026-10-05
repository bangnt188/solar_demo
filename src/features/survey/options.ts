export const SURVEY_CONSENT_VERSION = "survey-contact-v1";
export const buildingOptions = [
  { value: "household", label: "Hộ gia đình" },
  { value: "small_business", label: "Hộ kinh doanh" },
  { value: "commercial", label: "Doanh nghiệp / nhà xưởng" },
] as const;

export const billOptions = [
  { value: "under_2m", label: "Dưới 2 triệu đồng" },
  { value: "2m_5m", label: "2–5 triệu đồng" },
  { value: "5m_20m", label: "5–20 triệu đồng" },
  { value: "over_20m", label: "Trên 20 triệu đồng" },
  { value: "unknown", label: "Chưa rõ" },
] as const;

export type BuildingCode = (typeof buildingOptions)[number]["value"];
export type BillCode = (typeof billOptions)[number]["value"];
