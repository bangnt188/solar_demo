export type ServiceStageContent = {
  title: string;
  turnaround: string;
  image: string;
  imageAlt: string;
  details: readonly string[];
};

export type ServiceOverviewContent = {
  title: string;
  introduction: string;
  image: string;
  imageAlt: string;
  stages: readonly ServiceStageContent[];
};
