import assert from "node:assert/strict";
import test from "node:test";
import { adaptRowsQuery, createAccessBackend, createCrud, createPostgresRepository, type AccessGrant, type CrudRow } from "@shared/backend";
import { createDatabase } from "../src/infrastructure/database/client";
import { createSolarCatalog } from "../src/server/catalog";
const request = new Request("https://solar.example/api/admin/projects");
function database() {
  assert.ok(process.env.SOLAR_TEST_PG_SOCKET?.startsWith("/tmp/solar-integration-"), "Disposable database runner required");
  return createDatabase({ host: process.env.SOLAR_TEST_PG_SOCKET, port: 55441, user: process.env.USER, database: "postgres", ssl: false });
}
test("Solar real schema: assigned paging/count, covers, publish/hide, CAS, soft delete and failed audit rollback", async () => {
  const db = database();
  const scope = { tenantId: "solar" };
  let grants: AccessGrant[] = ["view", "create", "update", "delete", "publish", "hide"].flatMap(action => ["projects", "equipment"].map(type => ({ permission: `${type}:${action}`, effect: "allow" as const, scope })));
  let failAudit = false;
  const session = { issuer: "solar-test", subject: "staff", expiresAt: Date.now() + 600000 };
  const options = { database: db, tenantId: "solar", origin: "https://solar.example", verifySession: async () => session,
    loadPrincipal: async (_session: unknown, sql: Parameters<Parameters<typeof db.transaction>[0]>[0]) => {
      const [policy] = await sql.query("SELECT version FROM backend_test_policy WHERE id='solar' FOR SHARE");
      return { actorId: "staff", issuer: session.issuer, subject: session.subject, disabled: false, policyVersion: String(policy!.version), grants };
    }, recordDecision: async () => { if (failAudit) throw Error("audit failure"); } };
  try {
    await db.query("CREATE TABLE backend_test_policy(id text PRIMARY KEY, version bigint NOT NULL); INSERT INTO backend_test_policy VALUES ('solar',1)");
    const [media] = await db.query<{ id: string }>(`INSERT INTO solar_appdata.media(storage_kind,static_path,mime_type,size_bytes,width,height,state,public_use_approved)
      VALUES('STATIC','images/tests/backend-cover.webp','image/webp',100,10,10,'READY',true) RETURNING id`);
    const projects = createSolarCatalog("projects", options);
    const form = { title: "Backend project", slug: "backend-project", summary: "Summary", content: "Content", category: "household", location: "Can Tho", system: "10 kWp", coverMediaId: media!.id };
    const created = await projects.service.create(request, form);
    assert.equal(created.status, "DRAFT"); assert.equal(created.version, 1);
    assert.equal((await db.query("SELECT 1 FROM solar_appdata.project_media WHERE project_id=$1 AND media_id=$2", [created.id, media!.id])).length, 1);
    await assert.rejects(projects.service.create(request, form), { code: "CONFLICT" });
    const second = await projects.service.create(request, { ...form, slug: "backend-other" });
    grants = [{ permission: "projects:view", effect: "allow", scope, resourceId: created.id }];
    const assigned = await projects.service.list(request, { pageSize: 1 });
    assert.equal(assigned.totalItems, 1); assert.equal(assigned.items[0]!.id, created.id);
    await assert.rejects(projects.service.get(request, second.id), { code: "FORBIDDEN" });
    await assert.rejects(projects.publish(request, created.id, 1), { code: "FORBIDDEN" });
    grants = ["view", "update", "delete", "publish", "hide", "create"].flatMap(action => ["projects", "equipment"].map(type => ({ permission: `${type}:${action}`, effect: "allow" as const, scope })));
    const commandRequest = (requestOrigin: string, version: string) => new Request("https://solar.example/api/admin/projects/publish", { method: "POST", headers: { origin: requestOrigin, "if-match": version } });
    const context = { params: Promise.resolve({ id: created.id }) };
    assert.equal((await projects.commands.publish(commandRequest("https://evil.example", '"1"'), context)).status, 403);
    assert.equal((await projects.commands.publish(commandRequest("https://solar.example", "invalid"), context)).status, 400);
    const publishedResponse = await projects.commands.publish(commandRequest("https://solar.example", '"1"'), context);
    assert.equal(publishedResponse.status, 200); assert.equal(publishedResponse.headers.get("etag"), '"2"');
    const published = (await publishedResponse.json()).data;
    assert.equal(published.version, 2); assert.equal(published.status, "PUBLISHED");
    await assert.rejects(projects.service.update(request, created.id, 1, { title: "Stale" }), { code: "CONFLICT" });
    const edits = await Promise.allSettled([projects.service.update(request, created.id, 2, { title: "First" }), projects.service.update(request, created.id, 2, { title: "Second" })]);
    assert.equal(edits.filter(result => result.status === "fulfilled").length, 1);
    assert.equal(edits.filter(result => result.status === "rejected" && result.reason.code === "CONFLICT").length, 1);
    const hidden = await projects.hide(request, created.id, 3);
    assert.equal(hidden.status, "HIDDEN"); assert.equal(hidden.version, 4);
    await projects.service.delete(request, created.id, 4);
    const [deleted] = await db.query("SELECT deleted_at,status,version FROM solar_appdata.projects WHERE id=$1", [created.id]);
    assert.ok(deleted!.deleted_at); assert.equal(deleted!.status, "HIDDEN"); assert.equal(Number(deleted!.version), 5);
    await assert.rejects(projects.service.get(request, created.id), { code: "NOT_FOUND" });
    failAudit = true;
    await assert.rejects(projects.service.create(request, { ...form, slug: "backend-rollback" }), { code: "UNAVAILABLE" });
    assert.equal((await db.query("SELECT 1 FROM solar_appdata.projects WHERE slug='backend-rollback'")).length, 0);
    failAudit = false;
    await db.query("UPDATE solar_appdata.media SET public_use_approved=false WHERE id=$1", [media!.id]);
    await assert.rejects(projects.publish(request, second.id, 1), { code: "INVALID_INPUT" });
    assert.equal((await projects.service.get(request, second.id)).status, "DRAFT");
    const equipment = createSolarCatalog("equipment", options);
    const item = await equipment.service.create(request, { title: "Inverter", slug: "backend-inverter", category: "inverter", summary: "", content: "" });
    assert.equal(item.status, "DRAFT"); assert.equal(item.title, "Inverter");
    await assert.rejects(equipment.publish(request, item.id, 1), { code: "INVALID_INPUT" });
    await equipment.service.delete(request, item.id, 1);
  } finally { await db.close(); }
});
test("Mall real PostgreSQL: tenant/property filters, object allows, narrow deny and counts before paging", async () => {
  const db = database();
  const scope = { tenantId: "owner-a", propertyId: "mall-a" };
  type Row = CrudRow & { name: string };
  try {
    await db.query("CREATE SCHEMA backend_mall_test; CREATE TABLE backend_mall_test.customers(id text PRIMARY KEY,tenant_id text NOT NULL,property_id text NOT NULL,organization_id text,version bigint DEFAULT 1,name text NOT NULL)");
    await db.query("INSERT INTO backend_mall_test.customers(id,tenant_id,property_id,organization_id,name) VALUES ('allowed','owner-a','mall-a','org-a','Allowed'),('denied','owner-a','mall-a','org-b','Private'),('foreign','owner-b','mall-a','org-a','Foreign'),('other-property','owner-a','mall-b','org-a','Other')");
    const access = (sql: Parameters<Parameters<typeof db.transaction>[0]>[0]) => createAccessBackend({
      verifySession: async () => ({ issuer: "mall", subject: "staff", expiresAt: Date.now() + 600000 }),
      loadPrincipal: async () => ({ actorId: "staff", issuer: "mall", subject: "staff", disabled: false, policyVersion: "1", grants: [
        { permission: "customers:view", effect: "allow", scope },
        { permission: "customers:view", effect: "deny", scope: { ...scope, organizationId: "org-b" } },
      ] }), recordDecision: async event => { await sql.query("SELECT $1::text", [event.permission]); },
    });
    const crud = createCrud<Row, { name: string }, { name: string }, { id: string; version: number; name: string }>({ type: "customers", parseCreate: input => input as { name: string }, parseUpdate: input => input as { name: string }, project: row => ({ id: row.id, version: row.version, name: row.name }),
      transaction: (_request, work) => db.transaction(sql => work({ scope, access: access(sql), repository: createPostgresRepository({
        query: adaptRowsQuery((text, values) => sql.query(text, values)), schema: "backend_mall_test", table: "customers", columns: { name: "name" },
        scopeColumns: { tenantId: "tenant_id", propertyId: "property_id", organizationId: "organization_id" },
        decode: raw => { const row = raw as Record<string, unknown>; return { id: String(row.id), version: Number(row.version), name: String(row.name), tenantId: String(row.tenant_id), propertyId: String(row.property_id), organizationId: String(row.organization_id) }; },
      }) }), "read"),
    });
    const page = await crud.list(new Request("https://mall.example"), { pageSize: 1 });
    assert.equal(page.totalItems, 1); assert.deepEqual(page.items, [{ id: "allowed", version: 1, name: "Allowed" }]);
    assert.equal((await crud.list(new Request("https://mall.example"), { page: 2, pageSize: 1 })).items.length, 0);
    await assert.rejects(crud.get(new Request("https://mall.example"), "foreign"), { code: "NOT_FOUND" });
    await assert.rejects(crud.get(new Request("https://mall.example"), "denied"), { code: "FORBIDDEN" });
  } finally { await db.close(); }
});
