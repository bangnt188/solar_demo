import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { integrationMode, requireCloudMode } from "../src/config/integrations";
import { createMockSubmissionSheet, createSubmissionSheet, submissionUpdate, type SheetSubmission, type SheetUpdate } from "../src/infrastructure/sheets/submissions";
import { getImageStorage, mediaKey } from "../src/infrastructure/storage/r2";
import { getDatabase } from "../src/infrastructure/database/client";
import { getSubmissionSheet } from "../src/services/submission-sheet";
import { AppError } from "../src/core/errors";

const sample: SheetSubmission = { id: "50000000-0000-4000-8000-000000000001", rowNumber: 2, receivedAt: "2026-09-27T00:00:00.000Z", name: "MOCK ONLY", phone: "0000000000", location: "Synthetic", building: "household", bill: "sample", note: "=HYPERLINK(\"https://example.invalid\")", consentVersion: "draft-v1" };

test("mock is default and production/cloud operations never silently downgrade", () => {
  assert.equal(integrationMode({}), "mock");
  assert.equal(integrationMode({ INTEGRATION_MODE: "cloud", APP_ENV: "production" }), "cloud");
  assert.throws(() => integrationMode({ APP_ENV: "production" }), AppError);
  assert.throws(() => integrationMode({ INTEGRATION_MODE: "mock", VERCEL_ENV: "production" }), AppError);
  assert.throws(() => integrationMode({ INTEGRATION_MODE: "typo" }), AppError);
  assert.throws(() => requireCloudMode({}), AppError);
});

test("Sheets mock retries one immutable row, rejects collisions and isolates snapshots", async () => {
  const sheet = createMockSubmissionSheet();
  await sheet.write(sample); await sheet.write(sample);
  assert.equal(sheet.mode, "mock");
  assert.equal(sheet.snapshot().length, 1);
  const [row] = sheet.snapshot();
  assert.equal(row.range, "'Raw_Submissions'!A2:I2");
  assert.equal(row.valueInputOption, "RAW");
  assert.equal(row.requestBody.values[0][3], "0000000000");
  assert.equal(row.requestBody.values[0][7], sample.note);
  row.requestBody.values[0][0] = "mutated";
  assert.equal(sheet.snapshot()[0].requestBody.values[0][0], sample.id);
  await assert.rejects(sheet.write({ ...sample, name: "changed" }), AppError);
  await assert.rejects(sheet.write({ ...sample, id: "50000000-0000-4000-8000-000000000002" }), AppError);
  await assert.rejects(sheet.write({ ...sample, rowNumber: 3 }), AppError);
  assert.equal(sheet.snapshot().length, 1);
});

test("Sheets contract validates before transport and retry keeps exactly the same update", async () => {
  const writes: SheetUpdate[] = [];
  const sheet = createSubmissionSheet(async update => { writes.push(update); if (writes.length === 1) throw new Error("simulated response lost"); });
  for (const candidate of [{ ...sample, rowNumber: 1 }, { ...sample, rowNumber: 2.5 }, { ...sample, receivedAt: "2026-99-01T00:00:00.000Z" }, { ...sample, note: "x".repeat(4001) }]) {
    await assert.rejects(sheet.write(candidate), AppError);
  }
  assert.equal(writes.length, 0);
  await assert.rejects(sheet.write(sample));
  await sheet.write(sample);
  assert.deepEqual(writes[0], writes[1]);
  assert.deepEqual(writes[0], submissionUpdate(sample));
});

test("mock composition ignores invalid cloud credentials and never calls fetch", async () => {
  const keys = ["INTEGRATION_MODE", "APP_ENV", "VERCEL_ENV", "DEPLOY_TARGET", "NEXT_PUBLIC_SITE_URL", "DATABASE_URL", "R2_ACCOUNT_ID", "GOOGLE_PRIVATE_KEY"];
  const before = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { INTEGRATION_MODE: "mock", APP_ENV: "sandbox", VERCEL_ENV: "preview", DEPLOY_TARGET: "server", NEXT_PUBLIC_SITE_URL: "https://mvp.invalid", DATABASE_URL: "invalid", R2_ACCOUNT_ID: "invalid", GOOGLE_PRIVATE_KEY: "invalid" });
    globalThis.fetch = async () => { throw new Error("Network must not be used"); };
    const { getPublicRepository } = await import("../src/services/public-content");
    assert.ok((await (await getPublicRepository()).landing()).sections.length > 0);
    assert.throws(() => getDatabase(), AppError);
    const storage = getImageStorage();
    const key = mediaKey("projects", "20000000-0000-4000-8000-000000000001");
    const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: "#ffffff" } }).png().toBuffer();
    const image = await storage.put(key, png);
    assert.deepEqual(await storage.head(key), { ContentLength: image.sizeBytes, ContentType: "image/webp" });
    await assert.rejects(storage.put(key, png), AppError);
    await storage.remove(key); await storage.remove(key);
    await assert.rejects(storage.head(key), AppError);
    assert.equal(getSubmissionSheet().mode, "mock");
    process.env.INTEGRATION_MODE = "cloud";
    assert.throws(() => getSubmissionSheet(), AppError);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of keys) { if (before[key] === undefined) delete process.env[key]; else process.env[key] = before[key]; }
  }
});
