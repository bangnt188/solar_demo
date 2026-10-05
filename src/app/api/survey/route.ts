import { createSurveySubmissionRoute } from "@/services/survey-submissions";
import { getDatabase } from "@/infrastructure/database/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const dispatch = createSurveySubmissionRoute(getDatabase);

export async function POST(request: Request) {
  return dispatch(request);
}

export async function GET(request: Request) {
  return dispatch(request);
}
