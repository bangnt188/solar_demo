-- Run after canonical schema + demo seed on a DISPOSABLE database.
-- Changes are rolled back; no public-content approval is persisted.
BEGIN;
SET LOCAL search_path = solar_appdata, pg_catalog;
CREATE FUNCTION pg_temp.assert(ok boolean, message text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF ok IS DISTINCT FROM true THEN RAISE EXCEPTION 'FAIL: %', message; END IF;
  RAISE NOTICE 'PASS: %', message;
END $$;
CREATE FUNCTION pg_temp.expect_error(command text, expected_state text, message text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE caught boolean := false;
BEGIN
  BEGIN EXECUTE command;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE <> expected_state THEN RAISE; END IF;
    caught := true;
  END;
  PERFORM pg_temp.assert(caught, message);
END $$;

SELECT pg_temp.assert((SELECT count(*) = 10 FROM landing_sections), 'all ten real landing sections seeded');
SELECT pg_temp.assert((SELECT published_revision_id IS NULL FROM landing_site), 'seed remains unpublished');
SELECT pg_temp.assert((SELECT count(*) = 6 FROM projects WHERE status = 'DRAFT'), 'six projects stay draft');
SELECT pg_temp.assert((SELECT count(*) = 4 FROM equipment WHERE status = 'DRAFT'), 'four equipment stay draft');
SELECT pg_temp.assert((SELECT count(*) = 18 FROM media WHERE NOT public_use_approved), 'all 18 demo media remain unapproved');
SELECT pg_temp.assert((SELECT count(*) = 16 FROM media WHERE mime_type = 'image/avif'), 'demo static media use AVIF metadata');
SELECT pg_temp.expect_error($q$UPDATE landing_sections SET enabled = false WHERE section_key = 'hero'$q$, '23514', 'cannot hide hero');
SELECT pg_temp.expect_error($q$UPDATE landing_sections SET section_key = 'custom-html' WHERE section_key = 'faq'$q$, '23514', 'arbitrary section types blocked');
SELECT pg_temp.expect_error($q$UPDATE landing_sections SET position = 0 WHERE section_key = 'faq'$q$, '23505', 'duplicate display position blocked');
SELECT pg_temp.expect_error($q$UPDATE landing_sections SET content = '[]'::jsonb WHERE section_key = 'faq'$q$, '23514', 'non-object content rejected');
SELECT pg_temp.expect_error($q$UPDATE landing_media_bindings SET media_id = '99999999-0000-4000-8000-000000000001' WHERE slot = 'hero.image'$q$, '23503', 'dangling media FK rejected');
SELECT pg_temp.expect_error($q$UPDATE projects SET slug = 'mini-house-thai-thao' WHERE slug = 'le-grande-centre'$q$, '23505', 'duplicate catalog slug rejected');
SELECT pg_temp.expect_error($q$DELETE FROM media WHERE static_path = 'images/demo/solar-roof.webp'$q$, '23001', 'referenced media cannot be deleted');
SELECT pg_temp.expect_error($q$UPDATE media SET static_path='images/demo/replaced.webp' WHERE static_path='images/demo/solar-roof.webp'$q$, '23514', 'media URL identity cannot mutate beneath sealed content');
SELECT pg_temp.expect_error($q$INSERT INTO media(storage_kind,static_path,mime_type,size_bytes,width,height,state) VALUES ('STATIC','images/../secret.png','image/png',100,10,10,'READY')$q$, '23514', 'static path traversal rejected');
SELECT pg_temp.expect_error($q$INSERT INTO media(storage_kind,static_path,mime_type,size_bytes,width,height,state) VALUES ('STATIC','images/oversized.png','image/png',3145729,10,10,'READY')$q$, '23514', 'oversized media metadata rejected');
SELECT pg_temp.expect_error($q$INSERT INTO media(storage_kind,static_path,mime_type,size_bytes,width,height,state) VALUES ('STATIC','images/bomb.png','image/png',100,10000,10000,'READY')$q$, '23514', 'excessive image pixel count rejected');
SELECT pg_temp.expect_error($q$UPDATE landing_site SET published_revision_id = '40000000-0000-4000-8000-000000000001'$q$, '23503', 'site pointer cannot target draft');
SELECT pg_temp.expect_error($q$SELECT activate_landing(id,version,1) FROM landing_revisions$q$, '23514', 'unapproved media blocks activation');
SELECT pg_temp.assert((SELECT state = 'DRAFT' FROM landing_revisions), 'failed activation does not seal draft');
UPDATE media SET public_use_approved = true;
SELECT pg_temp.expect_error($q$SELECT activate_landing(id,version,1) FROM landing_revisions$q$, '23514', 'draft catalog blocks activation');
UPDATE projects SET status = 'PUBLISHED';
UPDATE equipment SET status = 'PUBLISHED';

-- Cover must belong to the SAME project gallery, including at commit.
SELECT pg_temp.expect_error($q$DO $block$
BEGIN
 UPDATE projects SET cover_media_id = '10000000-0000-4000-8000-000000000001'
 WHERE id = '20000000-0000-4000-8000-000000000001';
 SET CONSTRAINTS ALL IMMEDIATE;
END $block$;$q$, '23503', 'cover from outside own gallery rejected');

-- Atomic reordering using deferrable uniqueness.
SET CONSTRAINTS ALL DEFERRED;
UPDATE landing_sections SET position = CASE position WHEN 1 THEN 2 WHEN 2 THEN 1 END WHERE position IN (1,2);
SET CONSTRAINTS ALL IMMEDIATE;
SELECT pg_temp.assert((SELECT position = 2 FROM landing_sections WHERE section_key = 'partners'), 'atomic section reorder allowed');
SELECT pg_temp.expect_error($q$SELECT activate_landing(id,version - 1,1) FROM landing_revisions$q$, '40001', 'stale draft version rejected');
SELECT activate_landing(id,version,1) FROM landing_revisions;
SELECT pg_temp.assert((SELECT r.state = 'SEALED' AND s.version = 2 FROM landing_site s JOIN landing_revisions r ON r.id=s.published_revision_id), 'activation seals snapshot and swaps pointer');
SELECT pg_temp.expect_error($q$UPDATE landing_revisions SET label = 'changed' $q$, '23514', 'sealed header immutable');
SELECT pg_temp.expect_error($q$UPDATE landing_sections SET content = '{}'::jsonb WHERE section_key = 'faq'$q$, '23514', 'sealed section immutable');
SELECT pg_temp.expect_error($q$DELETE FROM landing_featured_projects$q$, '23514', 'sealed selection immutable');
SELECT pg_temp.expect_error($q$DELETE FROM landing_media_bindings$q$, '23514', 'sealed bindings immutable');
SELECT pg_temp.expect_error($q$DELETE FROM landing_revisions$q$, '23514', 'sealed revision cannot be accidentally deleted');
SELECT pg_temp.expect_error($q$SELECT activate_landing(id,version,1) FROM landing_revisions$q$, '40001', 'stale site version prevents overwriting publication');

INSERT INTO landing_revisions(id,label,chrome,seo)
 SELECT '40000000-0000-4000-8000-000000000002','New draft',chrome,seo FROM landing_revisions;
INSERT INTO landing_sections(revision_id,section_key,position,enabled,content)
 SELECT '40000000-0000-4000-8000-000000000002',section_key,position,enabled,content FROM landing_sections;
UPDATE landing_sections SET content=jsonb_set(content,'{title}','"Draft title"')
 WHERE revision_id='40000000-0000-4000-8000-000000000002' AND section_key='hero';
SELECT pg_temp.assert((SELECT content->>'title' <> 'Draft title' FROM landing_sections s JOIN landing_site ls ON ls.published_revision_id=s.revision_id WHERE s.section_key='hero'), 'draft editing does not change published content');
SELECT pg_temp.assert((SELECT version > 1 FROM landing_revisions WHERE id='40000000-0000-4000-8000-000000000002'), 'child writes bump aggregate version');

UPDATE projects SET status='HIDDEN',deleted_at=now() WHERE id='20000000-0000-4000-8000-000000000002';
SELECT pg_temp.assert((SELECT count(*)=3 FROM landing_site s JOIN landing_featured_projects f ON f.revision_id=s.published_revision_id JOIN projects p ON p.id=f.project_id JOIN media m ON m.id=p.cover_media_id WHERE p.status='PUBLISHED' AND p.deleted_at IS NULL AND m.state='READY' AND m.public_use_approved), 'soft-deleted featured record disappears without republishing');
SELECT pg_temp.expect_error($q$SELECT activate_landing(id,version,2) FROM landing_revisions WHERE state='SEALED'$q$, '23514', 'rollback revalidates current catalog eligibility');
UPDATE projects SET status='PUBLISHED',deleted_at=NULL WHERE id='20000000-0000-4000-8000-000000000002';
SELECT activate_landing(id,version,2) FROM landing_revisions WHERE state='SEALED';
SELECT pg_temp.assert((SELECT version=3 FROM landing_site), 'safe reactivation of sealed snapshot supported');
DELETE FROM landing_revisions WHERE state='DRAFT';
SELECT pg_temp.assert((SELECT count(*)=10 FROM landing_sections), 'discarding draft cascades only its children');
ROLLBACK;
