import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Client } from "pg";
import { databaseConfig } from "../src/config/server";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
async function main() {
  const action = process.argv[2];
  if (!["migrate", "seed"].includes(action)) throw new Error("Expected migrate or seed");
  if (action === "seed" && process.env.APP_ENV !== "sandbox") throw new Error("Demo seeding requires APP_ENV=sandbox");
  const client = new Client(databaseConfig(process.env, "DATABASE_URL_DIRECT"));
  await client.connect();
  try {
    // Session lock is deliberate: this tool uses the DIRECT migration connection.
    await client.query("SELECT pg_advisory_lock(792346810)");
    if (action === "seed") {
      await client.query(await readFile("database/seeds/001_landing_demo.sql", "utf8"));
      console.log("PASS: sandbox seed committed as DRAFT; nothing published");
      return;
    }
    const migrations = [
      { name: "001_landing", path: "database/schema/001_landing.sql" },
      { name: "002_survey_submissions", path: "database/schema/002_survey_submissions.sql" },
    ] as const;
    await client.query("CREATE SCHEMA IF NOT EXISTS solar_migrations");
    await client.query("REVOKE ALL ON SCHEMA solar_migrations FROM PUBLIC");
    await client.query("CREATE TABLE IF NOT EXISTS solar_migrations.journal (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");
    for (const migration of migrations) {
      const source = await readFile(migration.path, "utf8");
      const checksum = createHash("sha256").update(source).digest("hex");
      await client.query("BEGIN");
      const { rows } = await client.query<{ checksum: string }>("SELECT checksum FROM solar_migrations.journal WHERE name=$1", [migration.name]);
      if (rows.length) {
        if (rows[0].checksum !== checksum) throw new Error("Migration checksum mismatch; write a new migration, do not rewrite an applied one");
        await client.query("COMMIT");
        console.log(`PASS: ${migration.name} already applied, checksum verified`);
        continue;
      }
      const sql = source.replace(/^BEGIN;\s*$/m, "").replace(/^COMMIT;\s*$/m, "");
      await client.query(sql);
      await client.query("INSERT INTO solar_migrations.journal(name,checksum) VALUES($1,$2)", [migration.name, checksum]);
      await client.query("COMMIT");
      console.log(`PASS: ${migration.name} migration committed`);
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally { await client.end(); }
}
main().catch(() => {
  // Never print pg errors: they may embed SQL, credentials or content.
  console.error("FAIL: migration/seed not completed. Check DIRECT credentials, role grants, APP_ENV, schema state and journal checksum. No secrets logged.");
  process.exitCode = 1;
});
