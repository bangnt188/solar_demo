import test from "node:test";
import assert from "node:assert/strict";
import { createDatabase } from "../src/infrastructure/database/client";
import { createSurveySubmissionRoute } from "../src/services/survey-submissions";
import { createPostgresContent } from "../src/repositories/postgres-content";
import { pagination } from "../src/core/pagination";
import { publicRouter } from "../src/core/public-router";
import { AppError } from "../src/core/errors";

test("PostgreSQL adapter: unpublished gate, atomic projection, keyset paging, tombstones and rollback", async () => {
  assert.ok(process.env.SOLAR_TEST_PG_SOCKET?.startsWith("/tmp/solar-integration-"), "Requires disposable runner");
  const db = createDatabase({ host: process.env.SOLAR_TEST_PG_SOCKET, port: 55441, user: process.env.USER, database: "postgres", ssl: false });
  try {
    const repository = createPostgresContent(db, { basePath: "", r2Origin: "https://media.example.com" });
    await assert.rejects(() => repository.landing(), error => error instanceof AppError && error.status === 503);
    await db.transaction(async sql => {
      await sql.query("UPDATE solar_appdata.media SET public_use_approved=true");
      await sql.query("UPDATE solar_appdata.projects SET status='PUBLISHED'");
      await sql.query("UPDATE solar_appdata.equipment SET status='PUBLISHED'");
      await sql.query("UPDATE solar_appdata.landing_sections SET content=jsonb_set(content,'{description}','\"PRIVATE-DISABLED-COPY\"') WHERE section_key='testimonials'");
      await sql.query("SELECT solar_appdata.activate_landing(id,version,1) FROM solar_appdata.landing_revisions");
    });
    const landing = await repository.landing();
    assert.equal(landing.sections.length, 9);
    assert.ok(landing.chrome.brand.logo.startsWith("/images/common/"));
    const response = await publicRouter(async () => repository)("landing", new Request("https://example.com/api/v1/landing/"));
    assert.equal(response.status, 200);
    assert.equal((await response.text()).includes("PRIVATE-DISABLED-COPY"), false);
    const seen: string[] = [];
    let cursor: string | null = null;
    do {
      const input = pagination(new URLSearchParams({ limit: "2", ...(cursor ? { cursor } : {}) }));
      const page = await repository.projects(input);
      seen.push(...page.items.map(item => item.id!));
      cursor = page.nextCursor;
    } while (cursor);
    assert.equal(seen.length, 6); assert.equal(new Set(seen).size, 6);
    const first = landing.projects[0].id!;
    const before = await db.query("SELECT title FROM solar_appdata.projects WHERE id=$1", [first]);
    await assert.rejects(() => db.transaction(async sql => { await sql.query("UPDATE solar_appdata.projects SET title='ROLLBACK-ME' WHERE id=$1", [first]); throw new Error("test rollback"); }));
    assert.deepEqual(await db.query("SELECT title FROM solar_appdata.projects WHERE id=$1", [first]), before);
    await db.query("UPDATE solar_appdata.projects SET status='HIDDEN',deleted_at=now() WHERE id=$1", [first]);
    assert.equal((await repository.landing()).projects.some(item => item.id === first), false);
    assert.equal((await repository.projects({ limit: 100 })).items.some(item => item.id === first), false);
    await db.query("UPDATE solar_appdata.media SET public_use_approved=false WHERE static_path='images/common/logo.png'");
    await assert.rejects(() => repository.landing(), error => error instanceof AppError && error.status === 503);
  } finally { await db.close(); }
});

test("survey API: commit before 201, stable idempotency, validated options and shared limits", async () => {
  assert.ok(process.env.SOLAR_TEST_PG_SOCKET?.startsWith("/tmp/solar-integration-"), "Requires disposable runner");
  const db = createDatabase({ host: process.env.SOLAR_TEST_PG_SOCKET, port: 55441, user: process.env.USER, database: "postgres", ssl: false });
  let verified = 0;
  const dispatch = createSurveySubmissionRoute(db, {
    config: () => ({ rateLimitSecret: "integration-test-key-".padEnd(32, "x"), globalLimit: 100 }),
    verifyChallenge: async token => { assert.equal(token, "test-token"); verified++; },
  });
  const key = "90000000-0000-4000-8000-000000000001";
  const base = {
    name: "Nguyễn Văn A",
    phone: "+84 912 345 678",
    location: "Cần Thơ",
    building: "household",
    bill: "2m_5m",
    note: "Khảo sát mái nhà",
    consent: true,
    consentVersion: "survey-contact-v1",
    turnstileToken: "test-token",
  };
  const send = (body: object, idempotencyKey = key, ip = "198.51.100.7") => dispatch(new Request("https://example.com/api/survey/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.com", "Idempotency-Key": idempotencyKey, "X-Forwarded-For": ip },
    body: JSON.stringify(body),
  }));
  try {
    const created = await send(base);
    assert.equal(created.status, 201);
    const receipt = await created.json() as { data: { id: string; status: string } };
    assert.match(receipt.data.id, /^[0-9a-f-]{36}$/i);
    assert.equal(receipt.data.status, "received");
    const stored = await db.query<{ payload: { phone: string; building: string; bill: string }; consent_version: string }>(
      "SELECT payload, consent_version FROM solar_appdata.survey_submissions WHERE idempotency_key=$1", [key],
    );
    assert.equal(stored.length, 1);
    assert.deepEqual(stored[0].payload, { version: 1, name: "Nguyễn Văn A", phone: "84912345678", location: "Cần Thơ", building: "household", bill: "2m_5m", note: "Khảo sát mái nhà" });
    assert.equal(stored[0].consent_version, "survey-contact-v1");
    const duplicate = await send({ ...base, turnstileToken: "different-token" });
    assert.equal(duplicate.status, 201);
    assert.equal((await duplicate.json() as { data: { id: string } }).data.id, receipt.data.id);
    assert.equal(verified, 1);
    assert.equal((await send({ ...base, note: "Nội dung khác" })).status, 409);
    assert.equal((await send({ ...base, bill: "not-a-range" }, "90000000-0000-4000-8000-000000000002")).status, 400);
    assert.equal((await send({ ...base, consent: false }, "90000000-0000-4000-8000-000000000003")).status, 400);
    assert.equal((await send({ ...base, note: "x".repeat(17_000) }, "90000000-0000-4000-8000-000000000004")).status, 413);
    const crossOrigin = new Request("https://example.com/api/survey/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://attacker.example", "Idempotency-Key": "90000000-0000-4000-8000-000000000005" },
      body: JSON.stringify(base),
    });
    assert.equal((await dispatch(crossOrigin)).status, 403);

    for (let index = 1; index <= 5; index++) {
      const response = await send(base, `90000000-0000-4000-8000-${String(index).padStart(12, "0")}`, "198.51.100.8");
      assert.equal(response.status, 201);
    }
    assert.equal((await send(base, "90000000-0000-4000-8000-000000000099", "198.51.100.8")).status, 429);
  } finally { await db.close(); }
});
