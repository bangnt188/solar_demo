export type SiteLink = {
  label: string;
  href: string;
  children?: SiteLink[];
  overviewLabel?: string;
};
