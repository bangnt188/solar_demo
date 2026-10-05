import "server-only";
import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { AppError } from "@/core/errors";
import { route } from "@/core/http";
import type { Database } from "@/infrastructure/database/client";
import { SURVEY_CONSENT_VERSION, billOptions, buildingOptions } from "@/features/survey/options";

const BODY_LIMIT = 16 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_FIELDS: Record<string, true> = {
  name: true, phone: true, location: true, building: true, bill: true, note: true,
  consent: true, consentVersion: true, turnstileToken: true,
};
type Submission = {
  name: string;
  phone: string;
  location: string;
  building: (typeof buildingOptions)[number]["value"];
  bill: (typeof billOptions)[number]["value"];
  note: string;
  consentVersion: string;
  turnstileToken: string;
};
type SurveyConfig = { rateLimitSecret: string; globalLimit: number };
type Dependencies = {
  config?: () => SurveyConfig;
  verifyChallenge?: (token: string, request: Request) => Promise<void>;
};

function runtimeConfig(): SurveyConfig {
  if (process.env.SURVEY_INTAKE_ENABLED !== "true") throw new AppError("UNAVAILABLE", "Kênh tiếp nhận khảo sát chưa được bật.");
  const rateLimitSecret = process.env.SURVEY_RATE_LIMIT_SECRET?.trim();
  const globalLimit = Number(process.env.SURVEY_GLOBAL_LIMIT);
  if (!rateLimitSecret || Buffer.byteLength(rateLimitSecret) < 32 || !Number.isInteger(globalLimit) || globalLimit < 1 || globalLimit > 10000) {
    throw new AppError("UNAVAILABLE", "Survey intake is not configured.");
  }
  if (!process.env.TURNSTILE_SECRET_KEY?.trim()) throw new AppError("UNAVAILABLE", "Survey intake is not configured.");
  return { rateLimitSecret, globalLimit };
}

function inputError(message: string): never { throw new AppError("INVALID_INPUT", message); }
function text(value: unknown, label: string, min: number, max: number): string {
  if (typeof value !== "string") return inputError(`${label} không hợp lệ.`);
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) return inputError(`${label} không hợp lệ.`);
  return normalized;
}

async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new AppError("UNSUPPORTED_MEDIA", "Yêu cầu phải dùng JSON.");
  }
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > BODY_LIMIT)) throw new AppError("TOO_LARGE", "Yêu cầu vượt quá giới hạn cho phép.");
  if (!request.body) inputError("Nội dung yêu cầu không hợp lệ.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > BODY_LIMIT) {
        await reader.cancel();
        throw new AppError("TOO_LARGE", "Yêu cầu vượt quá giới hạn cho phép.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(new TextDecoder().decode(Buffer.concat(chunks))); }
  catch { return inputError("Nội dung yêu cầu không phải JSON hợp lệ."); }
}

async function parseSubmission(request: Request) {
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey || !UUID.test(idempotencyKey)) inputError("Thiếu mã gửi yêu cầu hợp lệ.");
  const value = await readJson(request);
  if (!value || typeof value !== "object" || Array.isArray(value)) inputError("Nội dung yêu cầu không hợp lệ.");
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some(key => !Object.hasOwn(ALLOWED_FIELDS, key))) inputError("Nội dung yêu cầu có trường không được hỗ trợ.");
  const name = text(body.name, "Họ và tên", 2, 100);
  const phone = text(body.phone, "Số điện thoại", 8, 32);
  if (!/^[+0-9().\s-]+$/.test(phone)) inputError("Số điện thoại không hợp lệ.");
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) inputError("Số điện thoại không hợp lệ.");
  const location = text(body.location, "Địa điểm công trình", 3, 300);
  const building = buildingOptions.find(option => option.value === body.building)?.value;
  const bill = billOptions.find(option => option.value === body.bill)?.value;
  if (!building || !bill) inputError("Vui lòng chọn loại công trình và khoảng chi phí hợp lệ.");
  const note = body.note === undefined || body.note === null ? "" : text(body.note, "Nhu cầu khác", 0, 2000);
  if (body.consent !== true || body.consentVersion !== SURVEY_CONSENT_VERSION) inputError("Bạn cần đồng ý với nội dung lưu và liên hệ trước khi gửi.");
  const turnstileToken = text(body.turnstileToken, "Mã xác minh", 1, 2048);
  return {
    request,
    idempotencyKey,
    submission: { name, phone: digits, location, building, bill, note, consentVersion: SURVEY_CONSENT_VERSION, turnstileToken } satisfies Submission,
  };
}

async function assertSameOrigin(request: Request): Promise<void> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",").at(-1)?.trim();
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https" ? forwardedProtocol : new URL(request.url).protocol.slice(0, -1);
  let expectedOrigin: string;
  try { expectedOrigin = host ? new URL(`${protocol}://${host}`).origin : new URL(request.url).origin; }
  catch { throw new AppError("FORBIDDEN", "Nguồn gửi yêu cầu không hợp lệ."); }
  if (!origin || origin !== expectedOrigin) throw new AppError("FORBIDDEN", "Nguồn gửi yêu cầu không hợp lệ.");
}

async function verifyTurnstile(token: string, request: Request): Promise<void> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) throw new AppError("UNAVAILABLE", "Survey intake is not configured.");
  let response: Response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
  } catch { throw new AppError("UNAVAILABLE", "Dịch vụ xác minh tạm thời chưa sẵn sàng."); }
  if (!response.ok) throw new AppError("UNAVAILABLE", "Dịch vụ xác minh tạm thời chưa sẵn sàng.");
  const result = await response.json().catch(() => null) as { success?: boolean; hostname?: string; action?: string } | null;
  if (!result?.success || result.hostname !== new URL(request.url).hostname || result.action !== "survey") {
    throw new AppError("FORBIDDEN", "Không xác minh được yêu cầu. Vui lòng thử lại.");
  }
}

function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  const address = forwarded || request.headers.get("x-real-ip")?.trim();
  if (!address || isIP(address) === 0) throw new AppError("UNAVAILABLE", "Survey intake is not configured.");
  return address;
}

async function enforceRateLimit(database: Database, request: Request, config: SurveyConfig): Promise<void> {
  const windowStart = Math.floor(Date.now() / 600_000);
  const hash = (value: string) => createHmac("sha256", config.rateLimitSecret).update(value).digest("hex");
  const ipHash = hash(clientAddress(request));
  const globalHash = hash("global-survey-intake");
  const counts = await database.transaction(async sql => {
    await sql.query("DELETE FROM solar_appdata.survey_rate_limits WHERE window_start < $1", [windowStart - 1]);
    const increment = async (subjectHash: string) => {
      const rows = await sql.query<{ request_count: number }>(
        `INSERT INTO solar_appdata.survey_rate_limits(window_start,subject_hash,request_count) VALUES($1,$2,1)
         ON CONFLICT(window_start,subject_hash) DO UPDATE SET request_count=solar_appdata.survey_rate_limits.request_count+1 RETURNING request_count`,
        [windowStart, subjectHash],
      );
      return Number(rows[0].request_count);
    };
    return { ip: await increment(ipHash), global: await increment(globalHash) };
  });
  if (counts.ip > 5 || counts.global > config.globalLimit) throw new AppError("RATE_LIMITED", "Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.");
}

function payloadHash(submission: Submission): { payload: Record<string, unknown>; hash: string } {
  const { name, phone, location, building, bill, note, consentVersion } = submission;
  const payload = { version: 1, name, phone, location, building, bill, note };
  const hash = createHash("sha256").update(JSON.stringify({ payload, consentVersion })).digest("hex");
  return { payload, hash };
}


export function createSurveySubmissionRoute(database: Database | (() => Database), dependencies: Dependencies = {}) {
  const config = dependencies.config ?? runtimeConfig;
  const verify = dependencies.verifyChallenge ?? verifyTurnstile;
  return route({
    policy: { kind: "public-write", authorize: assertSameOrigin },
    parse: parseSubmission,
    successStatus: 201,
    execute: async ({ request, idempotencyKey, submission }) => {
      const settings = config();
      const db = typeof database === "function" ? database() : database;
      await enforceRateLimit(db, request, settings);
      const { payload, hash } = payloadHash(submission);
      const existing = await db.query<{ id: string; payload_hash: string }>(
        "SELECT id, payload_hash FROM solar_appdata.survey_submissions WHERE idempotency_key=$1", [idempotencyKey],
      );
      if (existing.length) {
        if (existing[0].payload_hash !== hash) throw new AppError("CONFLICT", "Mã gửi đã được dùng cho nội dung khác.");
        return { id: existing[0].id, status: "received" as const };
      }
      await verify(submission.turnstileToken, request);
      const inserted = await db.transaction(async sql => {
        const rows = await sql.query<{ id: string }>(
          `INSERT INTO solar_appdata.survey_submissions(idempotency_key,payload_hash,payload,consent_version)
           VALUES($1,$2,$3::jsonb,$4) ON CONFLICT(idempotency_key) DO NOTHING RETURNING id`,
          [idempotencyKey, hash, JSON.stringify(payload), submission.consentVersion],
        );
        if (rows.length) return rows[0];
        const duplicate = await sql.query<{ id: string; payload_hash: string }>(
          "SELECT id, payload_hash FROM solar_appdata.survey_submissions WHERE idempotency_key=$1", [idempotencyKey],
        );
        if (!duplicate.length) throw new AppError("UNAVAILABLE", "Submission could not be confirmed.");
        if (duplicate[0].payload_hash !== hash) throw new AppError("CONFLICT", "Mã gửi đã được dùng cho nội dung khác.");
        return duplicate[0];
      });
      return { id: inserted.id, status: "received" as const };
    },
  });
}
