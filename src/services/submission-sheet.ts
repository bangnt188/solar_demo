import "server-only";
import { integrationMode } from "@/config/integrations";
import { AppError } from "@/core/errors";
import { createMockSubmissionSheet } from "@/infrastructure/sheets/submissions";

let mock: ReturnType<typeof createMockSubmissionSheet> | undefined;
export function getSubmissionSheet() {
  if (integrationMode() === "cloud") throw new AppError("UNAVAILABLE", "Google Sheets live connector is deferred until MVP scope is approved");
  return mock ??= createMockSubmissionSheet();
}
