-- Canonical DDL for the landing/catalog slice. PostgreSQL 14+.
-- Apply ONCE to an empty application schema via a versioned migration runner.
-- No auth/session/survey tables are created here. No roles or secrets are created.
BEGIN;
CREATE SCHEMA IF NOT EXISTS solar_appdata;
SET LOCAL search_path = solar_appdata, pg_catalog;

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_kind text NOT NULL CHECK (storage_kind IN ('STATIC', 'R2')),
  object_key text,
  static_path text,
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint CHECK (size_bytes > 0 AND size_bytes <= 3145728),
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  state text NOT NULL DEFAULT 'PENDING' CHECK (state IN ('PENDING', 'READY', 'DELETE_PENDING')),
  public_use_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (width::bigint * height <= 20000000),
  CHECK (
    (storage_kind = 'STATIC' AND object_key IS NULL AND static_path IS NOT NULL
      AND static_path ~ '^images/[a-zA-Z0-9_./-]+$' AND static_path !~ '\.\.'
      AND state = 'READY')
    OR
    (storage_kind = 'R2' AND static_path IS NULL AND object_key IS NOT NULL
      AND object_key ~ '^(landing|projects|equipment)/[a-f0-9-]{36}/[a-f0-9-]{36}\.webp$'
      AND mime_type = 'image/webp')
  ),
  CHECK (state <> 'READY' OR (size_bytes IS NOT NULL AND width IS NOT NULL AND height IS NOT NULL)),
  UNIQUE (object_key),
  UNIQUE (static_path)
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 160),
  summary text NOT NULL CHECK (length(summary) <= 1000),
  content text NOT NULL DEFAULT '' CHECK (length(content) <= 20000),
  location text NOT NULL CHECK (length(location) BETWEEN 1 AND 300),
  category text NOT NULL CHECK (length(category) BETWEEN 1 AND 100),
  system text NOT NULL CHECK (length(system) BETWEEN 1 AND 150),
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'HIDDEN')),
  cover_media_id uuid,
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'PUBLISHED' OR cover_media_id IS NOT NULL),
  CHECK (deleted_at IS NULL OR status = 'HIDDEN')
);
CREATE TABLE equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 160),
  category text NOT NULL CHECK (length(category) BETWEEN 1 AND 100),
  summary text NOT NULL CHECK (length(summary) <= 1000),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 20000),
  specifications jsonb NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(specifications) = 'object' AND octet_length(specifications::text) <= 16384),
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'HIDDEN')),
  cover_media_id uuid,
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'PUBLISHED' OR cover_media_id IS NOT NULL),
  CHECK (deleted_at IS NULL OR status = 'HIDDEN')
);
CREATE TABLE project_media (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 19),
  alt_text text NOT NULL CHECK (length(alt_text) <= 300),
  PRIMARY KEY (project_id, media_id),
  UNIQUE (project_id, position) DEFERRABLE INITIALLY IMMEDIATE
);
CREATE TABLE equipment_media (
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 19),
  alt_text text NOT NULL CHECK (length(alt_text) <= 300),
  PRIMARY KEY (equipment_id, media_id),
  UNIQUE (equipment_id, position) DEFERRABLE INITIALLY IMMEDIATE
);
ALTER TABLE projects ADD CONSTRAINT project_cover_in_own_gallery
  FOREIGN KEY (id, cover_media_id) REFERENCES project_media(project_id, media_id)
  DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE equipment ADD CONSTRAINT equipment_cover_in_own_gallery
  FOREIGN KEY (id, cover_media_id) REFERENCES equipment_media(equipment_id, media_id)
  DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX projects_public_idx ON projects (created_at DESC, id) WHERE status = 'PUBLISHED';
CREATE INDEX equipment_public_idx ON equipment (created_at DESC, id) WHERE status = 'PUBLISHED';
CREATE INDEX project_media_asset_idx ON project_media (media_id);
CREATE INDEX equipment_media_asset_idx ON equipment_media (media_id);

CREATE TABLE landing_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 160),
  schema_version smallint NOT NULL DEFAULT 1 CHECK (schema_version = 1),
  state text NOT NULL DEFAULT 'DRAFT' CHECK (state IN ('DRAFT', 'SEALED')),
  chrome jsonb NOT NULL CHECK (jsonb_typeof(chrome) = 'object' AND octet_length(chrome::text) <= 32768),
  seo jsonb NOT NULL CHECK (jsonb_typeof(seo) = 'object' AND octet_length(seo::text) <= 4096),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sealed_at timestamptz,
  CHECK ((state = 'DRAFT' AND sealed_at IS NULL) OR (state = 'SEALED' AND sealed_at IS NOT NULL)),
  UNIQUE (id, state)
);
CREATE TABLE landing_sections (
  revision_id uuid NOT NULL REFERENCES landing_revisions(id) ON DELETE CASCADE,
  section_key text NOT NULL CHECK (section_key IN (
    'hero', 'partners', 'services', 'solutions', 'whyUs', 'featuredProjects',
    'testimonials', 'equipmentOffer', 'faq', 'contact'
  )),
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 9),
  enabled boolean NOT NULL DEFAULT true,
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object' AND octet_length(content::text) <= 32768),
  CHECK (section_key <> 'hero' OR (position = 0 AND enabled)),
  PRIMARY KEY (revision_id, section_key),
  UNIQUE (revision_id, position) DEFERRABLE INITIALLY IMMEDIATE
);
CREATE TABLE landing_media_bindings (
  revision_id uuid NOT NULL REFERENCES landing_revisions(id) ON DELETE CASCADE,
  slot text NOT NULL CHECK (
    length(slot) <= 120 AND slot ~ '^(chrome|seo|hero|services|solutions|whyUs|faq)\.[a-zA-Z0-9_.-]+$'
  ),
  media_id uuid NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  PRIMARY KEY (revision_id, slot)
);
CREATE INDEX landing_media_asset_idx ON landing_media_bindings (media_id);
CREATE TABLE landing_featured_projects (
  revision_id uuid NOT NULL,
  section_key text NOT NULL DEFAULT 'featuredProjects' CHECK (section_key = 'featuredProjects'),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 11),
  PRIMARY KEY (revision_id, project_id),
  FOREIGN KEY (revision_id, section_key) REFERENCES landing_sections(revision_id, section_key) ON DELETE CASCADE,
  UNIQUE (revision_id, position) DEFERRABLE INITIALLY IMMEDIATE
);
CREATE TABLE landing_featured_equipment (
  revision_id uuid NOT NULL,
  section_key text NOT NULL DEFAULT 'equipmentOffer' CHECK (section_key = 'equipmentOffer'),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 11),
  PRIMARY KEY (revision_id, equipment_id),
  FOREIGN KEY (revision_id, section_key) REFERENCES landing_sections(revision_id, section_key) ON DELETE CASCADE,
  UNIQUE (revision_id, position) DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX landing_featured_project_idx ON landing_featured_projects (project_id);
CREATE INDEX landing_featured_equipment_idx ON landing_featured_equipment (equipment_id);

CREATE TABLE landing_site (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  published_revision_id uuid,
  required_state text GENERATED ALWAYS AS ('SEALED'::text) STORED,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (published_revision_id, required_state) REFERENCES landing_revisions(id, state)
);
INSERT INTO landing_site(singleton) VALUES (true);

-- Versions support optimistic concurrency. Once sealed, header/content is immutable.
CREATE FUNCTION guard_landing_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP <> 'INSERT' AND OLD.state = 'SEALED' THEN
    RAISE EXCEPTION 'sealed landing revision is immutable' USING ERRCODE = '23514';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.id <> OLD.id THEN RAISE EXCEPTION 'revision id is immutable' USING ERRCODE = '23514'; END IF;
    NEW.version := OLD.version + 1;
    NEW.updated_at := now();
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER landing_revision_guard BEFORE UPDATE OR DELETE ON landing_revisions
  FOR EACH ROW EXECUTE FUNCTION guard_landing_revision();

-- Every child mutation locks and touches the parent. Publishing takes the same lock.
CREATE FUNCTION touch_draft_landing() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE rid uuid; touched uuid;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.revision_id <> OLD.revision_id THEN
    RAISE EXCEPTION 'cannot move content between revisions' USING ERRCODE = '23514';
  END IF;
  IF TG_OP = 'DELETE' THEN rid := OLD.revision_id; ELSE rid := NEW.revision_id; END IF;
  UPDATE solar_appdata.landing_revisions SET updated_at = now()
    WHERE id = rid AND state = 'DRAFT' RETURNING id INTO touched;
  IF touched IS NULL THEN
    -- Cascade from deletion of an unsealed draft has already removed its parent.
    IF TG_OP = 'DELETE' AND NOT EXISTS (SELECT 1 FROM solar_appdata.landing_revisions WHERE id = rid) THEN RETURN OLD; END IF;
    RAISE EXCEPTION 'landing child requires a draft revision' USING ERRCODE = '23514';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER landing_sections_draft BEFORE INSERT OR UPDATE OR DELETE ON landing_sections FOR EACH ROW EXECUTE FUNCTION touch_draft_landing();
CREATE TRIGGER landing_bindings_draft BEFORE INSERT OR UPDATE OR DELETE ON landing_media_bindings FOR EACH ROW EXECUTE FUNCTION touch_draft_landing();
CREATE TRIGGER landing_projects_draft BEFORE INSERT OR UPDATE OR DELETE ON landing_featured_projects FOR EACH ROW EXECUTE FUNCTION touch_draft_landing();
CREATE TRIGGER landing_equipment_draft BEFORE INSERT OR UPDATE OR DELETE ON landing_featured_equipment FOR EACH ROW EXECUTE FUNCTION touch_draft_landing();

CREATE FUNCTION bump_catalog_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id <> OLD.id THEN RAISE EXCEPTION 'catalog id is immutable' USING ERRCODE = '23514'; END IF;
  NEW.version := OLD.version + 1;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER projects_version BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION bump_catalog_version();
CREATE TRIGGER equipment_version BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION bump_catalog_version();

CREATE FUNCTION guard_media_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (OLD.state = 'READY' AND NEW.state = 'PENDING')
      OR (OLD.state = 'DELETE_PENDING' AND NEW.state <> 'DELETE_PENDING') THEN
    RAISE EXCEPTION 'media lifecycle cannot move backwards' USING ERRCODE = '23514';
  END IF;
  IF (NEW.id, NEW.storage_kind, NEW.object_key, NEW.static_path)
      IS DISTINCT FROM (OLD.id, OLD.storage_kind, OLD.object_key, OLD.static_path) THEN
    RAISE EXCEPTION 'media identity/key is immutable; create a new asset' USING ERRCODE = '23514';
  END IF;
  IF OLD.state = 'READY' AND (NEW.mime_type, NEW.size_bytes, NEW.width, NEW.height)
      IS DISTINCT FROM (OLD.mime_type, OLD.size_bytes, OLD.width, OLD.height) THEN
    RAISE EXCEPTION 'ready media metadata is immutable' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER media_identity BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION guard_media_identity();

-- Relational publication gates. The service MUST ALSO validate the full JSON Schema,
-- semantic media slots/links, content approval and the actor's current ROOT/ADMIN role.
-- SECURITY INVOKER: never a bypass for application authorization.
CREATE FUNCTION activate_landing(p_revision uuid, p_revision_version bigint, p_site_version bigint)
RETURNS bigint LANGUAGE plpgsql SET search_path = solar_appdata, pg_catalog AS $$
DECLARE r landing_revisions%ROWTYPE; site_ver bigint; new_site_ver bigint;
BEGIN
  SELECT version INTO site_ver FROM landing_site WHERE singleton FOR UPDATE;
  IF site_ver IS DISTINCT FROM p_site_version THEN RAISE EXCEPTION 'site version conflict' USING ERRCODE = '40001'; END IF;
  SELECT * INTO r FROM landing_revisions WHERE id = p_revision FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'revision not found' USING ERRCODE = '23503'; END IF;
  IF r.version IS DISTINCT FROM p_revision_version THEN RAISE EXCEPTION 'revision version conflict' USING ERRCODE = '40001'; END IF;
  IF (SELECT count(*) FROM landing_sections WHERE revision_id = p_revision) <> 10 THEN
    RAISE EXCEPTION 'exactly ten known sections are required' USING ERRCODE = '23514';
  END IF;
  -- Common lock order: site -> revision -> catalog -> media (UUID order per table).
  PERFORM p.id FROM projects p JOIN landing_featured_projects f ON f.project_id = p.id
    WHERE f.revision_id = p_revision ORDER BY p.id FOR SHARE OF p;
  PERFORM e.id FROM equipment e JOIN landing_featured_equipment f ON f.equipment_id = e.id
    WHERE f.revision_id = p_revision ORDER BY e.id FOR SHARE OF e;
  -- Lock cover assets too, even when they are not also section image bindings.
  PERFORM m.id FROM media m WHERE m.id IN (
    SELECT media_id FROM landing_media_bindings WHERE revision_id = p_revision
    UNION SELECT p.cover_media_id FROM projects p JOIN landing_featured_projects f ON f.project_id = p.id WHERE f.revision_id = p_revision
    UNION SELECT e.cover_media_id FROM equipment e JOIN landing_featured_equipment f ON f.equipment_id = e.id WHERE f.revision_id = p_revision
  ) ORDER BY m.id FOR SHARE OF m;
  IF NOT EXISTS (SELECT 1 FROM landing_media_bindings WHERE revision_id = p_revision AND slot = 'chrome.logo')
     OR EXISTS (SELECT 1 FROM landing_media_bindings b JOIN media m ON m.id = b.media_id
       WHERE b.revision_id = p_revision AND (m.state <> 'READY' OR NOT m.public_use_approved)) THEN
    RAISE EXCEPTION 'all bound media must be ready and approved; logo is required' USING ERRCODE = '23514';
  END IF;
  IF EXISTS (SELECT 1 FROM landing_featured_projects f JOIN projects p ON p.id = f.project_id
      LEFT JOIN media m ON m.id = p.cover_media_id WHERE f.revision_id = p_revision
      AND (p.status <> 'PUBLISHED' OR p.deleted_at IS NOT NULL OR m.id IS NULL OR m.state <> 'READY' OR NOT m.public_use_approved))
    OR EXISTS (SELECT 1 FROM landing_featured_equipment f JOIN equipment e ON e.id = f.equipment_id
      LEFT JOIN media m ON m.id = e.cover_media_id WHERE f.revision_id = p_revision
      AND (e.status <> 'PUBLISHED' OR e.deleted_at IS NOT NULL OR m.id IS NULL OR m.state <> 'READY' OR NOT m.public_use_approved)) THEN
    RAISE EXCEPTION 'featured catalog must be published with approved ready covers' USING ERRCODE = '23514';
  END IF;
  IF EXISTS (SELECT 1 FROM landing_sections s WHERE revision_id = p_revision AND enabled AND
    ((section_key = 'featuredProjects' AND NOT EXISTS (SELECT 1 FROM landing_featured_projects WHERE revision_id = p_revision))
     OR (section_key = 'equipmentOffer' AND NOT EXISTS (SELECT 1 FROM landing_featured_equipment WHERE revision_id = p_revision))
     OR (section_key = 'testimonials' AND COALESCE(jsonb_array_length(content->'items'), 0) = 0))) THEN
    RAISE EXCEPTION 'enabled collection section cannot be empty' USING ERRCODE = '23514';
  END IF;
  IF r.state = 'DRAFT' THEN UPDATE landing_revisions SET state = 'SEALED', sealed_at = now() WHERE id = p_revision; END IF;
  UPDATE landing_site SET published_revision_id = p_revision, version = version + 1, updated_at = now()
    WHERE singleton RETURNING version INTO new_site_ver;
  RETURN new_site_ver;
END $$;
REVOKE ALL ON FUNCTION activate_landing(uuid, bigint, bigint) FROM PUBLIC;
-- Grant EXECUTE only to the server application role during deployment (see docs).
COMMIT;
