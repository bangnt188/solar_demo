export type ErrorCode = "INVALID_INPUT" | "NOT_FOUND" | "FORBIDDEN" | "CONFLICT" | "TOO_LARGE" | "UNSUPPORTED_MEDIA" | "RATE_LIMITED" | "UNAVAILABLE" | "INTERNAL";
const statuses: Record<ErrorCode, number> = { INVALID_INPUT: 400, NOT_FOUND: 404, FORBIDDEN: 403, CONFLICT: 409, TOO_LARGE: 413, UNSUPPORTED_MEDIA: 415, RATE_LIMITED: 429, UNAVAILABLE: 503, INTERNAL: 500 };

export class AppError extends Error {
  readonly status: number;
  constructor(readonly code: ErrorCode, message: string) {
    super(message);
    this.name = "AppError";
    this.status = statuses[code];
  }
}

export function unavailable(): never {
  throw new AppError("UNAVAILABLE", "Dữ liệu tạm thời chưa sẵn sàng. Vui lòng thử lại sau.");
}
