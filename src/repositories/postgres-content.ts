import "server-only";
import type { Database, SqlExecutor } from "@/infrastructure/database/client";
import type { PublicContentRepository } from "./public-content";
import type { Equipment, Project } from "@/types/catalog";
import type { MediaRecord } from "@/types/landing";
import { parseLandingDocument } from "@/features/landing/validation";
import { projectLanding, resolveMedia, type MediaContext } from "@/features/landing/projection";
import { encodeCursor, type Page, type PageInput } from "@/core/pagination";
import { unavailable } from "@/core/errors";

type CatalogRow = MediaRecord & { entity_id: string; title: string; category: string; summary: string; location: string; system: string; alt_text: string; cursor_at: string };
// SQL identifiers come only from this compile-time allowlist, never a URL/body.
const definitions = {
  projects: { table: "projects", gallery: "project_media", foreignKey: "project_id", title: "title", extra: "c.location, c.system", selection: "landing_featured_projects" },
  equipment: { table: "equipment", gallery: "equipment_media", foreignKey: "equipment_id", title: "name", extra: "''::text AS location, ''::text AS system", selection: "landing_featured_equipment" },
} as const;
type Kind = keyof typeof definitions;
type CatalogTypes = { projects: Project; equipment: Equipment };
const mappers: { [K in Kind]: (row: CatalogRow, context: MediaContext) => CatalogTypes[K] } = {
  projects: (row, context) => ({ id: row.entity_id, title: row.title, description: row.summary, location: row.location, category: row.category, system: row.system, image: resolveMedia(row, context), imageAlt: row.alt_text }),
  equipment: (row, context) => ({ id: row.entity_id, title: row.title, description: row.summary, category: row.category, image: resolveMedia(row, context), imageAlt: row.alt_text }),
};

async function readCatalog<K extends Kind>(sql: SqlExecutor, kind: K, context: MediaContext, input: PageInput, revisionId?: string): Promise<Page<CatalogTypes[K]>> {
  const d = definitions[kind];
  const values: unknown[] = revisionId ? [revisionId] : [input.limit + 1, input.cursor?.at ?? null, input.cursor?.id ?? null];
  const rows = await sql.query<CatalogRow>(`
    SELECT c.id AS entity_id, c.${d.title} AS title, c.category, c.summary, ${d.extra},
      m.id, m.storage_kind, m.static_path, m.object_key, m.state, m.public_use_approved, g.alt_text,
      to_char(c.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS cursor_at
    FROM solar_appdata.${d.table} c
    JOIN solar_appdata.${d.gallery} g ON g.${d.foreignKey}=c.id AND g.media_id=c.cover_media_id
    JOIN solar_appdata.media m ON m.id=c.cover_media_id
    ${revisionId ? `JOIN solar_appdata.${d.selection} f ON f.${d.foreignKey}=c.id AND f.revision_id=$1` : ""}
    WHERE c.status='PUBLISHED' AND c.deleted_at IS NULL AND m.state='READY' AND m.public_use_approved
    ${revisionId ? "ORDER BY f.position" : "AND ($2::timestamptz IS NULL OR c.created_at < $2::timestamptz OR (c.created_at = $2::timestamptz AND c.id > $3::uuid)) ORDER BY c.created_at DESC, c.id ASC LIMIT $1"}
  `, values);
  const visible = revisionId ? rows : rows.slice(0, input.limit);
  const last = visible.at(-1);
  return { items: visible.map(row => mappers[kind](row, context)), nextCursor: !revisionId && rows.length > input.limit && last ? encodeCursor({ at: last.cursor_at, id: last.entity_id }) : null };
}

export function createPostgresContent(database: Database, context: MediaContext): PublicContentRepository {
  // Invalid stored content, unavailable DB and unpublished site all fail closed.
  async function read<T>(work: (sql: SqlExecutor) => Promise<T>): Promise<T> {
    try { return await database.transaction(work, "read"); } catch { return unavailable(); }
  }
  return {
    projects: input => read(sql => readCatalog(sql, "projects", context, input)),
    equipment: input => read(sql => readCatalog(sql, "equipment", context, input)),
    landing: () => read(async sql => {
      const [header] = await sql.query<{ id: string; chrome: unknown; seo: unknown; schema_version: number }>(`
        SELECT r.id,r.chrome,r.seo,r.schema_version FROM solar_appdata.landing_site s
        JOIN solar_appdata.landing_revisions r ON r.id=s.published_revision_id AND r.state='SEALED' WHERE s.singleton`);
      if (!header) return unavailable();
      const values = [header.id];
      const sections = await sql.query(`SELECT section_key AS key, position, enabled, content FROM solar_appdata.landing_sections WHERE revision_id=$1 ORDER BY position`, values);
      const mediaBindings = await sql.query(`SELECT slot, media_id AS "mediaId" FROM solar_appdata.landing_media_bindings WHERE revision_id=$1`, values);
      const featuredProjects = await sql.query(`SELECT project_id AS "projectId",position FROM solar_appdata.landing_featured_projects WHERE revision_id=$1 ORDER BY position`, values);
      const featuredEquipment = await sql.query(`SELECT equipment_id AS "equipmentId",position FROM solar_appdata.landing_featured_equipment WHERE revision_id=$1 ORDER BY position`, values);
      const document = parseLandingDocument({ schemaVersion: header.schema_version, chrome: header.chrome, seo: header.seo, sections, mediaBindings, featuredProjects, featuredEquipment });
      const media = await sql.query<MediaRecord>(`SELECT m.* FROM solar_appdata.media m WHERE m.id IN (SELECT media_id FROM solar_appdata.landing_media_bindings WHERE revision_id=$1)`, values);
      const projects = await readCatalog(sql, "projects", context, { limit: 12 }, header.id);
      const equipment = await readCatalog(sql, "equipment", context, { limit: 12 }, header.id);
      return projectLanding(document, media, projects.items, equipment.items, context);
    }),
  };
}
