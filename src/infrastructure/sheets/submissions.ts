import "server-only";
import { AppError } from "@/core/errors";

/** Draft contract: an immutable submission already assigned a row by the DB. */
export type SheetSubmission = Readonly<{
  id: string;
  rowNumber: number;
  receivedAt: string;
  name: string;
  phone: string;
  location: string;
  building: string;
  bill: string;
  note: string;
  consentVersion: string;
}>;
export const submissionColumns = ["submission_id", "received_at", "name", "phone", "location", "building", "bill", "note", "consent_version"] as const;
export type SheetUpdate = Readonly<{
  range: string;
  valueInputOption: "RAW";
  requestBody: { majorDimension: "ROWS"; values: string[][] };
}>;
export type SheetTransport = (update: SheetUpdate) => Promise<void>;

export function submissionUpdate(submission: SheetSubmission): SheetUpdate {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(submission.id)
      || !Number.isSafeInteger(submission.rowNumber) || submission.rowNumber < 2 || submission.rowNumber > 1_000_000) {
    throw new AppError("INVALID_INPUT", "Submission hoặc vị trí hàng không hợp lệ.");
  }
  const values = [submission.id, submission.receivedAt, submission.name, submission.phone, submission.location, submission.building, submission.bill, submission.note, submission.consentVersion];
  if (values.some(value => typeof value !== "string" || value.length > 4000) || values.some((value, index) => index !== 7 && !value.trim())
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(submission.receivedAt)
      || !Number.isFinite(Date.parse(submission.receivedAt))
      || new Date(submission.receivedAt).toISOString() !== submission.receivedAt) {
    throw new AppError("INVALID_INPUT", "Nội dung submission không hợp lệ.");
  }
  return { range: `'Raw_Submissions'!A${submission.rowNumber}:I${submission.rowNumber}`, valueInputOption: "RAW", requestBody: { majorDimension: "ROWS", values: [values] } };
}

/** Transport will eventually call values.update, never values.append. No auth/network here. */
export function createSubmissionSheet(send: SheetTransport) {
  return { async write(submission: SheetSubmission): Promise<void> { await send(submissionUpdate(submission)); } };
}

/** In-process simulation only. Reset on restart; no Google success or durability claim. */
export function createMockSubmissionSheet() {
  const rows = new Map<string, SheetUpdate>();
  const assignments = new Map<string, string>();
  const adapter = createSubmissionSheet(async update => {
    const id = update.requestBody.values[0][0];
    const assigned = assignments.get(id);
    const previous = rows.get(update.range);
    if ((assigned && assigned !== update.range) || (previous && JSON.stringify(previous) !== JSON.stringify(update))) {
      throw new AppError("CONFLICT", "Mock: hàng đã được gán cho một submission bất biến.");
    }
    if (!previous && rows.size >= 1000) throw new AppError("UNAVAILABLE", "Mock sheet đã đạt giới hạn bộ nhớ.");
    rows.set(update.range, structuredClone(update));
    assignments.set(id, update.range);
  });
  return {
    mode: "mock" as const,
    write: adapter.write,
    snapshot: () => structuredClone([...rows.values()]),
  };
}
