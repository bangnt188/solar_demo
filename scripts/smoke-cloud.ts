import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createDatabase } from "../src/infrastructure/database/client";
import { databaseConfig, storageConfig } from "../src/config/server";
import { getImageStorage, mediaKey } from "../src/infrastructure/storage/r2";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

async function main() {
  const write = process.argv.includes("--write");
  if (write && process.env.APP_ENV !== "sandbox") throw new Error("Write smoke requires APP_ENV=sandbox");
  // Validate both configs before doing any I/O.
  const databaseSettings = databaseConfig();
  storageConfig();
  const db = createDatabase(databaseSettings);
  try {
    await db.query("SELECT 1 AS ok");
    await db.query("SELECT singleton FROM solar_appdata.landing_site LIMIT 1");
    console.log("PASS: database runtime connection and landing schema");
    const storage = getImageStorage();
    await storage.check();
    console.log("PASS: R2 scoped bucket access");
    if (write) {
      const key = mediaKey("landing", randomUUID());
      const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: "#ffffff" } }).png().toBuffer();
      try {
        const result = await storage.put(key, png);
        const head = await storage.head(key);
        if (!head || typeof head !== "object" || !("ContentLength" in head) || head.ContentLength !== result.sizeBytes || !("ContentType" in head) || head.ContentType !== result.mimeType) throw new Error("Object metadata mismatch");
        console.log("PASS: R2 synthetic image upload and metadata");
      } finally { await storage.remove(key); }
      console.log("PASS: R2 synthetic object deleted");
    }
  } finally { await db.close(); }
}
main().catch(() => { console.error("FAIL: cloud smoke. Check runtime credentials, schema, region, bucket scope and APP_ENV. No secret values logged."); process.exitCode = 1; });
