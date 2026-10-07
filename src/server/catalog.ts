import "server-only";
import {
  AccessError, BackendError, adaptRowsQuery, createAccessBackend, createCrud, createCrudHandlers,
  createPostgresRepository, createEndpoint, integerInput, jsonSuccess, objectInput, textInput,
  type AccessAdapters, type CrudRow,
} from "@shared/backend";
import type { Database, SqlExecutor } from "@/infrastructure/database/client";

type Kind = "projects" | "equipment";
type Form = { title: string; slug: string; summary: string; content: string; category: string; location?: string; system?: string; coverMediaId?: string | null };
type Row = CrudRow & Form & { status: "DRAFT" | "PUBLISHED" | "HIDDEN" };
export type CatalogDTO = Form & { id: string; version: number; status: Row["status"] };
export type SolarCatalogOptions = {
  database: Database;
  /** This database contains exactly one Solar tenant. Independent DB/keys per app. */
  tenantId: string;
  origin: string;
  verifySession: AccessAdapters["verifySession"];
  /** Lock current identity/assignment/policy revision rows until transaction ends. */
  loadPrincipal: (session: Parameters<AccessAdapters["loadPrincipal"]>[0], sql: SqlExecutor) => Promise<unknown>;
  recordDecision: AccessAdapters["recordDecision"];
  recordDecisions?: AccessAdapters["recordDecisions"];
};
const uuid = (input: unknown): string => {
  const value = textInput(input);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value)) throw new BackendError("INVALID_INPUT");
  return value;
};
const definitions = {
  projects: { title: "title", content: "content", gallery: "project_media", foreignKey: "project_id" },
  equipment: { title: "name", content: "description", gallery: "equipment_media", foreignKey: "equipment_id" },
} as const;
function parser(kind: Kind, partial: boolean) {
  return (input: unknown): Partial<Form> => {
    const data = objectInput(input, ["title", "slug", "summary", "content", "category", "coverMediaId", ...(kind === "projects" ? ["location", "system"] : [])]);
    if (partial && !Object.keys(data).length) throw new BackendError("INVALID_INPUT");
    const result: Partial<Form> = {};
    const limits = { title: 200, slug: 160, summary: 1000, content: 20000, category: 100, location: 300, system: 150 } as const;
    for (const field of Object.keys(limits) as (keyof typeof limits)[]) {
      if (kind === "equipment" && (field === "location" || field === "system")) continue;
      if (Object.hasOwn(data, field) || !partial) result[field] = textInput(data[field] ?? (field === "content" ? "" : undefined), { minLength: field === "summary" || field === "content" ? 0 : 1, maxLength: limits[field] });
    }
    if (result.slug !== undefined && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(result.slug)) throw new BackendError("INVALID_INPUT");
    if (Object.hasOwn(data, "coverMediaId")) result.coverMediaId = data.coverMediaId === null ? null : uuid(data.coverMediaId);
    return result;
  };
}
async function approvedMedia(sql: SqlExecutor, id: string) {
  const rows = await sql.query("SELECT id FROM solar_appdata.media WHERE id=$1 AND state='READY' AND public_use_approved FOR SHARE", [id]);
  if (rows.length !== 1) throw new BackendError("INVALID_INPUT");
}
/** Application-owned mapping and lifecycle. No provider/session defaults and no demo authority. */
export function createSolarCatalog(kind: Kind, options: SolarCatalogOptions) {
  const definition = definitions[kind];
  if (!definition) throw new BackendError("INVALID_INPUT");
  const scope = { tenantId: textInput(options.tenantId) };
  const columns = { title: definition.title, slug: "slug", summary: "summary", content: definition.content, category: "category", coverMediaId: "cover_media_id", ...(kind === "projects" ? { location: "location", system: "system" } : {}) };
  const decode = (input: unknown): Row => {
    if (!input || typeof input !== "object") throw new BackendError("UNAVAILABLE");
    const raw = input as Record<string, unknown>;
    if (!["DRAFT", "PUBLISHED", "HIDDEN"].includes(String(raw.status))) throw new BackendError("UNAVAILABLE");
    const form = parser(kind, false)({ title: raw[definition.title], slug: raw.slug, summary: raw.summary, content: raw[definition.content], category: raw.category,
      coverMediaId: raw.cover_media_id, ...(kind === "projects" ? { location: raw.location, system: raw.system } : {}) });
    return { ...form as Form, ...scope, id: uuid(raw.id), version: integerInput(Number(raw.version), { min: 1, max: Number.MAX_SAFE_INTEGER }), status: raw.status as Row["status"] };
  };
  const project = (row: Row): CatalogDTO => ({ id: row.id, version: row.version, status: row.status, title: row.title, slug: row.slug, summary: row.summary,
    content: row.content, category: row.category, coverMediaId: row.coverMediaId, ...(kind === "projects" ? { location: row.location, system: row.system } : {}) });
  async function transaction<T>(request: Request, work: (sql: SqlExecutor, access: ReturnType<typeof createAccessBackend>) => Promise<T>): Promise<T> {
    try {
      return await options.database.transaction(async sql => work(sql, createAccessBackend({ verifySession: options.verifySession,
        loadPrincipal: identity => options.loadPrincipal(identity, sql), recordDecision: options.recordDecision, recordDecisions: options.recordDecisions })));
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
      if (code === "23505") throw new BackendError("CONFLICT");
      if (code === "23514" || code === "23503" || code === "22P02") throw new BackendError("INVALID_INPUT");
      if (error instanceof BackendError || error instanceof AccessError) throw error;
      throw new BackendError("UNAVAILABLE");
    }
  }
  const service = createCrud<Row, Partial<Form>, Partial<Form>, CatalogDTO>({ type: kind, parseCreate: parser(kind, false), parseUpdate: parser(kind, true), project,
    transaction: (request, work) => transaction(request, async (sql, access) => {
      const stored = createPostgresRepository<Row, Partial<Form>, Partial<Form>>({ query: adaptRowsQuery((text, values) => sql.query(text, values)),
        schema: "solar_appdata", table: kind, columns, scopeColumns: {}, fixedScope: scope, decode,
        softDelete: { column: "deleted_at", values: { status: "HIDDEN" } },
      });
      const linkCover = async (id: string, mediaId: string) => {
        await approvedMedia(sql, mediaId);
        // Existing gallery order is retained; replacement covers are added only when absent.
        await sql.query(`INSERT INTO solar_appdata.${definition.gallery} (${definition.foreignKey},media_id,position,alt_text)
          SELECT $1,$2,(SELECT COALESCE(MAX(position)+1,0) FROM solar_appdata.${definition.gallery} WHERE ${definition.foreignKey}=$1),''
          WHERE NOT EXISTS (SELECT 1 FROM solar_appdata.${definition.gallery} WHERE ${definition.foreignKey}=$1 AND media_id=$2)
          ON CONFLICT (${definition.foreignKey},media_id) DO NOTHING`, [id, mediaId]);
      };
      return work({ scope, access, repository: { ...stored,
        async insert(data, activeScope) {
          if (data.coverMediaId) await approvedMedia(sql, data.coverMediaId);
          const row = await stored.insert(data, activeScope);
          if (data.coverMediaId) await linkCover(row.id, data.coverMediaId);
          return row;
        },
        async update(id, data, version, activeScope) {
          const [current] = await sql.query(`SELECT id FROM solar_appdata.${kind} WHERE id=$1 AND deleted_at IS NULL AND version=$2 FOR UPDATE`, [uuid(id), version]);
          if (!current) return null;
          if (data.coverMediaId) await linkCover(id, data.coverMediaId);
          return stored.update(id, data, version, activeScope);
        },
      } });
    }),
  });
  async function visibility(request: Request, id: string, version: number, status: "PUBLISHED" | "HIDDEN") {
    uuid(id); integerInput(version, { min: 1, max: Number.MAX_SAFE_INTEGER });
    return transaction(request, (sql, access) => access.withOperation(request, { permission: `${kind}:${status === "PUBLISHED" ? "publish" : "hide"}`, resource: { ...scope, type: kind, kind: "object", id } }, async operation => {
      const [raw] = await sql.query(`SELECT * FROM solar_appdata.${kind} WHERE id=$1 AND deleted_at IS NULL FOR UPDATE`, [id]);
      if (!raw) throw new BackendError("NOT_FOUND");
      const row = decode(raw);
      await operation.requireAccess({ permission: `${kind}:${status === "PUBLISHED" ? "publish" : "hide"}`, resource: { ...scope, type: kind, kind: "object", id } });
      if (row.version !== version) throw new BackendError("CONFLICT");
      if (status === "PUBLISHED") {
        if (!row.coverMediaId) throw new BackendError("INVALID_INPUT");
        await approvedMedia(sql, row.coverMediaId);
      }
      const [updated] = await sql.query(`UPDATE solar_appdata.${kind} SET status=$1 WHERE id=$2 AND version=$3 RETURNING *`, [status, id, version]);
      if (!updated) throw new BackendError("CONFLICT");
      return project(decode(updated));
    }));
  }
  const visibilityHandler = (status: "PUBLISHED" | "HIDDEN") => (request: Request, context: { params: Promise<{ id: string }> }) => createEndpoint({
    method: "POST", origin: options.origin,
    authorize: async incoming => {
      let session;
      try { session = await options.verifySession(incoming); } catch { throw new AccessError("UNAVAILABLE"); }
      if (!session || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) throw new AccessError("UNAUTHENTICATED");
    },
    parse: incoming => {
      const version = incoming.headers.get("if-match");
      if (incoming.body || new URL(incoming.url).search || !version || !/^"[1-9][0-9]{0,15}"$/.test(version)) throw new BackendError("INVALID_INPUT");
      return integerInput(Number(version.slice(1, -1)), { min: 1, max: Number.MAX_SAFE_INTEGER });
    },
    execute: async (version, incoming) => visibility(incoming, (await context.params).id, version, status),
    success: dto => { const response = jsonSuccess(dto); response.headers.set("etag", `"${dto.version}"`); return response; },
  })(request);
  return { service, handlers: createCrudHandlers(service, { origin: options.origin }), publish: (request: Request, id: string, version: number) => visibility(request, id, version, "PUBLISHED"),
    hide: (request: Request, id: string, version: number) => visibility(request, id, version, "HIDDEN"),
    commands: { publish: visibilityHandler("PUBLISHED"), hide: visibilityHandler("HIDDEN") } };
}
