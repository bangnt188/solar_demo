import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { parseLandingDocument } from "../src/features/landing/validation";
import { projectLanding, resolveMedia } from "../src/features/landing/projection";
import { pagination, encodeCursor } from "../src/core/pagination";
import { publicRouter } from "../src/core/public-router";
import { route } from "../src/core/http";
import { AppError } from "../src/core/errors";
import { createMockContent } from "../src/repositories/mock-content";
import { databaseConfig, storageConfig } from "../src/config/server";
import { createImageStorage, mediaKey, MAX_IMAGE_BYTES } from "../src/infrastructure/storage/r2";
import type { MediaRecord } from "../src/types/landing";

const fixture = JSON.parse(readFileSync("database/seeds/landing-demo.json", "utf8"));
const mock = createMockContent("/solar_demo");

test("landing validation rejects hidden anchor targets, forged hrefs, missing bindings and incomplete layout roles", () => {
  parseLandingDocument(fixture);
  for (const mutate of [
    (doc: typeof fixture) => { doc.sections[0].content.primaryAction.href = "javascript:alert(1)"; },
    (doc: typeof fixture) => { doc.mediaBindings.pop(); },
    (doc: typeof fixture) => { doc.sections.find((s: { key: string }) => s.key === "whyUs").content.images.pop(); },
    (doc: typeof fixture) => { doc.sections.find((s: { key: string }) => s.key === "faq").enabled = false; },
    (doc: typeof fixture) => { doc.sections[0].content.arbitraryHtml = "<script/>"; },
  ]) {
    const candidate = structuredClone(fixture); mutate(candidate);
    assert.throws(() => parseLandingDocument(candidate), AppError);
  }
});

test("public projection omits disabled content and internal state; unavailable required media fails closed", async () => {
  const document = parseLandingDocument(structuredClone(fixture));
  const disabled = document.sections.find(item => item.key === "testimonials");
  assert.ok(disabled); disabled.content.description = "PRIVATE-DISABLED-COPY";
  const media: MediaRecord[] = [...new Set(document.mediaBindings.map(item => item.mediaId))].map(id => ({ id, storage_kind: "STATIC", static_path: "images/demo/solar-roof.webp", object_key: null, state: "READY", public_use_approved: true }));
  const view = projectLanding(document, media, (await mock.projects({ limit: 20 })).items, (await mock.equipment({ limit: 20 })).items, { basePath: "/solar_demo" });
  assert.equal(view.sections.length, 9);
  assert.equal(JSON.stringify(view).includes("PRIVATE-DISABLED-COPY"), false);
  assert.equal(JSON.stringify(view).includes("public_use_approved"), false);
  assert.equal(view.chrome.brand.logo, "/solar_demo/images/demo/solar-roof.webp");
  assert.throws(() => projectLanding(document, media.map(item => ({ ...item, public_use_approved: false })), [], [], { basePath: "" }), AppError);
});

test("media resolver supports approved R2 keys and rejects traversal/unapproved assets", () => {
  const media: MediaRecord = { id: "x", storage_kind: "R2", object_key: "landing/40000000-0000-4000-8000-000000000001/10000000-0000-4000-8000-000000000001.webp", static_path: null, state: "READY", public_use_approved: true };
  assert.ok(resolveMedia(media, { basePath: "", r2Origin: "https://media.example.com" }).startsWith("https://media.example.com/landing/"));
  assert.throws(() => resolveMedia({ ...media, object_key: "../../secret" }, { basePath: "", r2Origin: "https://media.example.com" }), AppError);
});

test("cursor parser preserves PostgreSQL microseconds and bounds input", () => {
  const cursor = { at: "2026-09-27T01:02:03.123456Z", id: "20000000-0000-4000-8000-000000000001" };
  assert.deepEqual(pagination(new URLSearchParams({ cursor: encodeCursor(cursor), limit: "10" })), { limit: 10, cursor });
  for (const query of ["limit=0", "limit=101", "limit=2&limit=3", "cursor=invalid", "table=users", "limit=1;DROP TABLE projects"]) assert.throws(() => pagination(new URLSearchParams(query)), AppError);
});

test("generic router only serves allowlisted public resources and never accepts draft selectors", async () => {
  const dispatch = publicRouter(async () => mock);
  assert.equal((await dispatch("landing", new Request("https://example.com/api/v1/landing/"))).status, 200);
  for (const resource of ["users", "__proto__", "constructor", "survey_submissions"]) assert.equal((await dispatch(resource, new Request("https://example.com/api/v1/x/"))).status, 404);
  assert.equal((await dispatch("landing", new Request("https://example.com/api/v1/landing/?revision=x"))).status, 400);
  assert.equal((await dispatch("projects", new Request("https://example.com/api/v1/projects/", { method: "POST" }))).status, 405);
  const head = await dispatch("landing", new Request("https://example.com/api/v1/landing/", { method: "HEAD" }));
  assert.equal(await head.text(), "");
});

test("protected handler authorizes before parsing/execution; errors redact provider messages", async () => {
  let touched = false;
  const handler = route({ policy: { kind: "protected", authorize: async () => { throw new AppError("FORBIDDEN", "Không có quyền."); } }, parse: () => { touched = true; }, execute: () => { touched = true; } });
  assert.equal((await handler(new Request("https://example.com/", { method: "POST" }))).status, 403);
  assert.equal(touched, false);
  const errorHandler = route({ policy: { kind: "public-read" }, parse: () => undefined, execute: () => { throw new Error("postgres://secret:user-password@example.invalid"); } });
  const response = await errorHandler(new Request("https://example.com/"));
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal((await response.text()).includes("user-password"), false);
});

test("database and R2 configuration do not weaken TLS or accept an arbitrary storage endpoint", () => {
  const config = databaseConfig({ DATABASE_URL: "postgres://u:p@ep-example-pooler.neon.tech/app?sslmode=require", NODE_ENV: "production" });
  assert.deepEqual(config.ssl, { rejectUnauthorized: true });
  assert.equal(config.connectionString.includes("sslmode"), false);
  assert.throws(() => databaseConfig({ DATABASE_URL: "postgres://u:p@localhost/app", NODE_ENV: "production" }), AppError);
  assert.throws(() => databaseConfig({ DATABASE_URL: "postgres://u:p@host/app?host=evil" }), AppError);
  assert.throws(() => storageConfig({ R2_ACCOUNT_ID: "a".repeat(32), R2_ENDPOINT: "https://attacker.example", R2_BUCKET: "sandbox", R2_ACCESS_KEY_ID: "x", R2_SECRET_ACCESS_KEY: "y" }), AppError);
});

test("R2 adapter validates and re-encodes bytes before transport, strips metadata and scopes keys", async () => {
  let requests = 0;
  let written: Buffer | undefined;
  const storage = createImageStorage("sandbox-bucket", async command => {
    requests++;
    if (command instanceof PutObjectCommand) {
      assert.equal(command.input.Bucket, "sandbox-bucket");
      assert.equal(command.input.IfNoneMatch, "*");
      assert.equal(command.input.ContentType, "image/webp");
      assert.ok(Buffer.isBuffer(command.input.Body));
      written = command.input.Body;
    }
    return {};
  });
  const key = mediaKey("landing", "40000000-0000-4000-8000-000000000001");
  const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: "#fff" } }).withMetadata().png().toBuffer();
  const result = await storage.put(key, png);
  assert.equal(result.width, 2);
  assert.ok(written);
  assert.equal((await sharp(written).metadata()).exif, undefined);
  await assert.rejects(() => storage.put(key, Buffer.from("<svg><script/></svg>")), AppError);
  await assert.rejects(() => storage.put(key, Buffer.alloc(MAX_IMAGE_BYTES + 1)), AppError);
  await assert.rejects(() => storage.put("../../other-bucket", png), AppError);
  assert.equal(requests, 1);
});
