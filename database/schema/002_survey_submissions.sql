-- Survey intake storage and shared, short-lived rate limits.
BEGIN;
CREATE TABLE solar_appdata.survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key uuid NOT NULL UNIQUE,
  payload_hash char(64) NOT NULL CHECK (payload_hash ~ '^[a-f0-9]{64}$'),
  payload_schema_version smallint NOT NULL DEFAULT 1 CHECK (payload_schema_version = 1),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  consent_version text NOT NULL CHECK (length(consent_version) BETWEEN 1 AND 64),
  consented_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE solar_appdata.survey_rate_limits (
  window_start bigint NOT NULL,
  subject_hash char(64) NOT NULL CHECK (subject_hash ~ '^[a-f0-9]{64}$'),
  request_count integer NOT NULL CHECK (request_count > 0),
  PRIMARY KEY (window_start, subject_hash)
);
REVOKE ALL ON TABLE solar_appdata.survey_submissions, solar_appdata.survey_rate_limits FROM PUBLIC;
COMMIT;
