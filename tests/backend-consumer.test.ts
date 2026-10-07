import assert from "node:assert/strict";
import test from "node:test";
import { AccessError, BackendError, createAccessBackend, createCrud } from "@shared/backend";
import { route } from "../src/core/http";
import { createSolarCatalog } from "../src/server/catalog";
test("Solar preserves error envelope/status across the shared backend seam", async () => {
  for (const error of [new AccessError("UNAUTHENTICATED"), new AccessError("FORBIDDEN"), new BackendError("CONFLICT"), new BackendError("UNAVAILABLE")]) {
    const handler = route({ policy: { kind: "public-read" }, parse: () => undefined, execute: () => { throw error; } });
    const response = await handler(new Request("https://solar.example/api"));
    assert.equal(response.status, error.status);
    const body = await response.json();
    assert.equal(body.error.code, error.code); assert.equal(typeof body.error.requestId, "string");
  }
});
test("Solar catalog refuses UI image URLs, injected status/scope and fields exceeding DB constraints before SQL", async () => {
  const catalog = createSolarCatalog("projects", { tenantId: "solar", origin: "https://solar.example", database: {
    query: async () => { throw new Error("Must not query"); }, close: async () => {}, transaction: async () => { throw new Error("Must not transact"); },
  }, verifySession: async () => null, loadPrincipal: async () => null, recordDecision: async () => {} });
  const form = { title: "Project", slug: "project", summary: "", content: "", category: "household", location: "Can Tho", system: "10 kWp" };
  for (const extra of [{ image: "https://evil.example/image" }, { status: "PUBLISHED" }, { tenantId: "mall" }, { location: "x".repeat(301) }, { slug: "Invalid Slug" }]) {
    await assert.rejects(catalog.service.create(new Request("https://solar.example"), { ...form, ...extra }), { code: "INVALID_INPUT" });
  }
});
test("a failed batch audit prevents a consumer transaction committing its mutation", async () => {
  let row: { tenantId: string; id: string; version: number } | null = null;
  const scope = { tenantId: "solar" };
  const access = createAccessBackend({ verifySession: async () => ({ issuer: "solar", subject: "staff", expiresAt: Date.now() + 60000 }),
    loadPrincipal: async () => ({ actorId: "staff", issuer: "solar", subject: "staff", disabled: false, policyVersion: "1", grants: [{ permission: "projects:create", effect: "allow", scope }] }),
    recordDecision: async () => {}, recordDecisions: async () => { throw Error("sink failed"); } });
  const crud = createCrud({ type: "projects", parseCreate: input => input, parseUpdate: input => input, project: value => ({ id: value.id, version: value.version }),
    transaction: async (_request, work) => {
      const previous = row;
      try { return await work({ scope, access, repository: { find: async () => row, list: async () => ({ items: [], totalItems: 0 }),
        insert: async () => row = { ...scope, id: "1", version: 1 }, update: async () => null, delete: async () => false } }); }
      catch (error) { row = previous; throw error; }
    },
  });
  await assert.rejects(crud.create(new Request("https://solar.example"), {}), { code: "UNAVAILABLE" });
  assert.equal(row, null);
});
