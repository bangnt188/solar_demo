import { SurveyScreen } from "@/components/screens/survey-screen";
import { surveyContent } from "@/data/content/survey";
import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageBreadcrumbs, pageMetadata, pageStructuredData } from "@/lib/seo";

export const metadata = pageMetadata("/khao-sat/");

export default function SurveyPage() {
  return (
    <>
      <JsonLd data={pageStructuredData("/khao-sat/")} />
      <Breadcrumbs items={pageBreadcrumbs("/khao-sat/")} />
      <SurveyScreen content={surveyContent} />
    </>
  );
}
