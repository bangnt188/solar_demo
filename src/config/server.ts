import "server-only";
import { AppError } from "@/core/errors";

type Environment = Readonly<Record<string, string | undefined>>;
function required(env: Environment, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new AppError("UNAVAILABLE", `Missing server configuration: ${key}`);
  return value;
}

export function databaseConfig(env: Environment = process.env, key = "DATABASE_URL") {
  let url: URL;
  try { url = new URL(required(env, key)); } catch { throw new AppError("UNAVAILABLE", `Invalid server configuration: ${key}`); }
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.username || url.pathname.length < 2 || url.hash) {
    throw new AppError("UNAVAILABLE", `Invalid server configuration: ${key}`);
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (local && env.NODE_ENV === "production") throw new AppError("UNAVAILABLE", "Production database must use remote TLS");
  // Do not let URI options replace our certificate-verifying SSL object.
  for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert", "uselibpqcompat"]) url.searchParams.delete(option);
  // Arbitrary session/config parameters do not belong in the runtime connection URI.
  for (const option of url.searchParams.keys()) {
    if (option !== "channel_binding") throw new AppError("UNAVAILABLE", `Unsupported ${key} connection option`);
  }
  url.searchParams.delete("channel_binding");
  return { connectionString: url.toString(), ssl: local ? false as const : { rejectUnauthorized: true }, enableChannelBinding: true };
}

export function mediaOrigin(env: Environment = process.env): string | undefined {
  if (!env.R2_PUBLIC_BASE_URL?.trim()) return undefined;
  let url: URL;
  try { url = new URL(env.R2_PUBLIC_BASE_URL); } catch { throw new AppError("UNAVAILABLE", "Invalid R2_PUBLIC_BASE_URL"); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new AppError("UNAVAILABLE", "R2_PUBLIC_BASE_URL must be a HTTPS origin");
  }
  return url.origin;
}

export function storageConfig(env: Environment = process.env) {
  const account = required(env, "R2_ACCOUNT_ID");
  if (!/^[a-f0-9]{32}$/i.test(account)) throw new AppError("UNAVAILABLE", "Invalid R2_ACCOUNT_ID");
  const allowed = ["", ".eu", ".us", ".fedramp"].map(zone => `https://${account}${zone}.r2.cloudflarestorage.com`);
  const endpoint = env.R2_ENDPOINT || allowed[0];
  if (!allowed.includes(endpoint)) throw new AppError("UNAVAILABLE", "R2_ENDPOINT must belong to the configured account");
  const bucket = required(env, "R2_BUCKET");
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) throw new AppError("UNAVAILABLE", "Invalid R2_BUCKET");
  return { endpoint, bucket, credentials: { accessKeyId: required(env, "R2_ACCESS_KEY_ID"), secretAccessKey: required(env, "R2_SECRET_ACCESS_KEY") } };
}
