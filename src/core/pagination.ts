import { AppError } from "./errors";

export type Cursor = { at: string; id: string };
export type PageInput = { limit: number; cursor?: Cursor };
export type Page<T> = { items: T[]; nextCursor: string | null };
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

export function pagination(params: URLSearchParams): PageInput {
  for (const name of params.keys()) if (!["limit", "cursor"].includes(name) || params.getAll(name).length !== 1) throw new AppError("INVALID_INPUT", "Tham số phân trang không hợp lệ.");
  const rawLimit = params.get("limit") ?? "20";
  if (!/^[1-9]\d{0,2}$/.test(rawLimit) || Number(rawLimit) > 100) throw new AppError("INVALID_INPUT", "limit phải từ 1 đến 100.");
  const raw = params.get("cursor");
  if (!raw) return { limit: Number(rawLimit) };
  try {
    if (raw.length > 256 || !/^[a-zA-Z0-9_-]+$/.test(raw)) throw new Error();
    const value = JSON.parse(Buffer.from(raw, "base64url").toString()) as Record<string, unknown>;
    if (Object.keys(value).sort().join() !== "at,id" || typeof value.at !== "string" || typeof value.id !== "string" || !uuid.test(value.id)
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z$/.test(value.at)
      || new Date(value.at).toISOString().slice(0, 19) !== value.at.slice(0, 19)) throw new Error();
    return { limit: Number(rawLimit), cursor: { at: value.at, id: value.id } };
  } catch { throw new AppError("INVALID_INPUT", "cursor không hợp lệ."); }
}
export function encodeCursor(cursor: Cursor): string { return Buffer.from(JSON.stringify(cursor)).toString("base64url"); }
