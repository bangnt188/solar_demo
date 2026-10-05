#!/usr/bin/env bash
set -euo pipefail
repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
test_root="$(mktemp -d /tmp/solar-integration-XXXXXX)"
cleanup() { pg_ctl -D "$test_root/data" -m immediate -w stop >/dev/null 2>&1 || true; rm -rf -- "$test_root"; }
trap cleanup EXIT
initdb -D "$test_root/data" --encoding=UTF8 --no-locale --auth=trust >/dev/null
pg_ctl -D "$test_root/data" -l "$test_root/log" -o "-F -c listen_addresses='127.0.0.1' -k $test_root -p 55441" -w start >/dev/null
psql_args=(-X -At -h "$test_root" -p 55441 -U "$(id -un)" -d postgres -v ON_ERROR_STOP=1)
cd "$repo_dir"
export DATABASE_URL_DIRECT="postgresql://$(id -un)@127.0.0.1:55441/postgres"
export APP_ENV=sandbox
export NODE_ENV=test
# Inject a journal failure: DDL and its journal entry must roll back together.
psql "${psql_args[@]}" -q <<'SQL'
CREATE SCHEMA solar_migrations;
CREATE TABLE solar_migrations.journal (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now());
CREATE FUNCTION solar_migrations.reject_journal() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'injected journal failure'; END $$;
CREATE TRIGGER reject_journal BEFORE INSERT ON solar_migrations.journal FOR EACH ROW EXECUTE FUNCTION solar_migrations.reject_journal();
SQL
if node --conditions=react-server --import tsx scripts/database.ts migrate >"$test_root/migration-failure.log" 2>&1; then
  echo 'FAIL: migration ignored journal failure' >&2; exit 1
fi
if [[ "$(psql "${psql_args[@]}" -c "SELECT count(*) FROM pg_namespace WHERE nspname='solar_appdata'")" != 0 ]]; then
  echo 'FAIL: failed migration left committed DDL without a journal entry' >&2; exit 1
fi
psql "${psql_args[@]}" -q -c 'DROP TRIGGER reject_journal ON solar_migrations.journal; DROP FUNCTION solar_migrations.reject_journal()'
node --conditions=react-server --import tsx scripts/database.ts migrate
node --conditions=react-server --import tsx scripts/database.ts migrate
node --conditions=react-server --import tsx scripts/database.ts seed
# Re-seeding must reject duplicates and leave existing content intact.
if node --conditions=react-server --import tsx scripts/database.ts seed >"$test_root/duplicate.log" 2>&1; then
  echo 'FAIL: seed overwrote existing data' >&2; exit 1
fi
if [[ "$(psql "${psql_args[@]}" -Atc 'SELECT count(*) FROM solar_appdata.projects')" != 6 ]]; then exit 1; fi
SOLAR_TEST_PG_SOCKET="$test_root" node --conditions=react-server --import tsx --test tests/integration.test.ts
psql "${psql_args[@]}" -q -c "UPDATE solar_appdata.media SET public_use_approved=true WHERE static_path='images/common/logo.png'"
SOLAR_TEST_PG_SOCKET="$test_root" node tests/server-http.mjs
