#!/usr/bin/env bash
# Disposable local PostgreSQL only. Never reads DATABASE_URL or contacts Neon.
set -euo pipefail
repo_dir="$(cd "$(dirname "$0")/../.." && pwd)"
for binary in initdb pg_ctl psql; do command -v "$binary" >/dev/null || { echo "Missing $binary" >&2; exit 1; }; done
test_root="$(mktemp -d /tmp/solar-landing-db.XXXXXX)"
cleanup() {
  pg_ctl -D "$test_root/data" -m immediate -w stop >/dev/null 2>&1 || true
  rm -rf -- "$test_root"
}
trap cleanup EXIT
initdb -D "$test_root/data" --encoding=UTF8 --no-locale --auth=trust >/dev/null
# Unix socket in a private directory; no TCP listener or persistent service.
pg_ctl -D "$test_root/data" -l "$test_root/postgres.log" -o "-F -c listen_addresses='' -k $test_root -p 55439" -w start >/dev/null
psql_args=(-X -At -h "$test_root" -p 55439 -U "$(id -un)" -d postgres -v ON_ERROR_STOP=1)
psql "${psql_args[@]}" -q -f "$repo_dir/database/schema/001_landing.sql"
psql "${psql_args[@]}" -q -f "$repo_dir/database/seeds/001_landing_demo.sql"
psql "${psql_args[@]}" -q -f "$repo_dir/database/tests/landing.sql"
# Child write vs publish concurrency: validate optimistic version after waiting
# for a parent row lock. Both processes touch only this disposable database.
read -r revision_version <<< "$(psql "${psql_args[@]}" -Atc 'SELECT version FROM solar_appdata.landing_revisions LIMIT 1')"
psql "${psql_args[@]}" -q -c "BEGIN; UPDATE solar_appdata.landing_sections SET content=content WHERE section_key='faq'; SELECT pg_sleep(2); COMMIT;" >"$test_root/writer.log" 2>&1 &
writer_pid=$!
# Wait until the test writer is sleeping while retaining its row lock.
for attempt in {1..100}; do
  waiting="$(psql "${psql_args[@]}" -Atc "SELECT count(*) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND wait_event='PgSleep'")"
  if [[ "$waiting" != 0 ]]; then break; fi
  sleep 0.02
done
if [[ "$waiting" == 0 ]]; then echo 'FAIL: concurrency writer did not acquire lock' >&2; exit 1; fi
if psql "${psql_args[@]}" -q -c "SELECT solar_appdata.activate_landing('40000000-0000-4000-8000-000000000001',$revision_version,1)" >"$test_root/publish.log" 2>&1; then
  echo 'FAIL: stale concurrent publish succeeded' >&2; exit 1
fi
wait "$writer_pid"
if ! rg -q 'revision version conflict' "$test_root/publish.log"; then cat "$test_root/publish.log"; exit 1; fi
echo 'PASS: concurrent child edit cannot be published using stale draft version'
echo 'PASS: disposable PostgreSQL schema/seed/constraint tests complete'
