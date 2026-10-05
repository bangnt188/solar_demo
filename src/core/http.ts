import { randomUUID } from "node:crypto";
import { AppError } from "./errors";

export type RoutePolicy = { kind: "public-read" } | { kind: "public-write"; authorize: (request: Request) => Promise<void> } | { kind: "protected"; authorize: (request: Request) => Promise<void> };
export type Endpoint<Input, Output> = {
  policy: RoutePolicy;
  parse: (request: Request) => Input | Promise<Input>;
  execute: (input: Input) => Output | Promise<Output>;
  successStatus?: number;
};

/** A transport seam: validation, auth ordering, safe errors and cache policy. */
export function route<Input, Output>(endpoint: Endpoint<Input, Output>) {
  return async (request: Request): Promise<Response> => {
    const requestId = randomUUID();
    const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Request-Id": requestId };
    try {
      if (endpoint.policy.kind === "public-read") {
        if (request.method !== "GET" && request.method !== "HEAD") return Response.json({ error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed", requestId } }, { status: 405, headers: { ...headers, Allow: "GET, HEAD" } });
      } else if (endpoint.policy.kind === "public-write") {
        if (request.method !== "POST") return Response.json({ error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed", requestId } }, { status: 405, headers: { ...headers, Allow: "POST" } });
        await endpoint.policy.authorize(request);
      } else { await endpoint.policy.authorize(request); }
      const result = await endpoint.execute(await endpoint.parse(request));
      if (request.method === "HEAD") return new Response(null, { headers });
      return Response.json({ data: result, requestId }, { status: endpoint.successStatus ?? 200, headers });
    } catch (error) {
      const known = error instanceof AppError;
      const code = known ? error.code : "INTERNAL";
      // Config/dependency errors stay generic even when their internal message is useful to operators.
      const message = known && error.status < 500 ? error.message : "Dịch vụ tạm thời chưa sẵn sàng. Vui lòng thử lại sau.";
      if (!known || error.status >= 500) console.error(JSON.stringify({ event: "request.failed", requestId, code }));
      return Response.json({ error: { code, message, requestId } }, { status: known ? error.status : 500, headers });
    }
  };
}
