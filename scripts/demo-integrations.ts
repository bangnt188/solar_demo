import { integrationMode } from "../src/config/integrations";
import { createMockContent } from "../src/repositories/mock-content";
import { getImageStorage, mediaKey } from "../src/infrastructure/storage/r2";
import { getSubmissionSheet } from "../src/services/submission-sheet";
import sharp from "sharp";

async function main() {
  if (integrationMode() !== "mock") throw new Error("Demo requires mock mode");
  const landing = await createMockContent("").landing();
  const storage = getImageStorage();
  const key = mediaKey("landing", "40000000-0000-4000-8000-000000000001");
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: "#ffffff" } }).png().toBuffer();
  await storage.put(key, png);
  await storage.head(key);
  await storage.remove(key);
  const sheet = getSubmissionSheet();
  const submission = { id: "50000000-0000-4000-8000-000000000001", rowNumber: 2, receivedAt: "2026-09-27T00:00:00.000Z", name: "MOCK ONLY", phone: "0000000000", location: "Synthetic", building: "household", bill: "sample", note: "=MOCK_TEXT", consentVersion: "draft-v1" };
  await sheet.write(submission);
  await sheet.write(submission);
  console.log(`MOCK ONLY: content (${landing.sections.length} sections), R2 put/head/delete, Google Sheets retry (${sheet.snapshot().length} row). No cloud calls or durable data.`);
}
main().catch(() => { console.error("FAIL: mock integration demo. No request data logged."); process.exitCode = 1; });
