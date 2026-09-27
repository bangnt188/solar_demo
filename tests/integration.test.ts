import test from "node:test";
import assert from "node:assert/strict";
import { createDatabase } from "../src/infrastructure/database/client";
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
    assert.equal(landing.projects.length, 6);
    assert.equal(landing.equipment.length, 4);
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
    const first = seen[0];
    const before = await db.query("SELECT title FROM solar_appdata.projects WHERE id=$1", [first]);
    await assert.rejects(() => db.transaction(async sql => { await sql.query("UPDATE solar_appdata.projects SET title='ROLLBACK-ME' WHERE id=$1", [first]); throw new Error("test rollback"); }));
    assert.deepEqual(await db.query("SELECT title FROM solar_appdata.projects WHERE id=$1", [first]), before);
    await db.query("UPDATE solar_appdata.projects SET status='HIDDEN',deleted_at=now() WHERE id=$1", [first]);
    assert.equal((await repository.landing()).projects.length, 5);
    assert.equal((await repository.projects({ limit: 100 })).items.some(item => item.id === first), false);
    await db.query("UPDATE solar_appdata.media SET public_use_approved=false WHERE static_path='images/common/logo.png'");
    await assert.rejects(() => repository.landing(), error => error instanceof AppError && error.status === 503);
  } finally { await db.close(); }
});
