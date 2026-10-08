// A real Next server in a disposable source copy, against the disposable PG test DB.
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { Client } from 'pg';

assert.ok(process.env.SOLAR_TEST_PG_SOCKET?.startsWith('/tmp/solar-integration-'));
const root = process.cwd();
const workspace = await mkdtemp(path.join(tmpdir(), 'solar-server-http-'));
let child;
let logs = '';
try {
  for (const item of ['src', 'public', 'packages/ui', 'next.config.ts', 'tsconfig.json', 'package.json']) await cp(path.join(root, item), path.join(workspace, item), { recursive: true, filter: source => !['.git', 'node_modules'].includes(path.basename(source)) });
  await mkdir(path.join(workspace, 'database/schema'), { recursive: true });
  await cp(path.join(root, 'database/schema/landing-content.schema.json'), path.join(workspace, 'database/schema/landing-content.schema.json'));
  await symlink(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'), 'dir');
  const probe = net.createServer();
  probe.listen(0, '127.0.0.1'); await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const env = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'development', DEPLOY_TARGET: 'server', NEXT_PUBLIC_SITE_URL: 'https://test.example.com', SEO_INDEXABLE: 'true', DATABASE_URL: process.env.DATABASE_URL_DIRECT, NEXT_TELEMETRY_DISABLED: '1' };
  child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: workspace, env, stdio: ['ignore', 'pipe', 'pipe'] });
  for (const output of [child.stdout, child.stderr]) output.on('data', data => { logs = (logs + data).slice(-15000); });
  const deadline = Date.now() + 45000;
  while (!logs.includes('Ready in')) {
    if (child.exitCode !== null || Date.now() > deadline) throw new Error('Next test server did not start: ' + logs);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const base = `http://127.0.0.1:${port}`;
  const get = url => fetch(base + url, { signal: AbortSignal.timeout(30000) });
  const landing = await get('/api/v1/landing/');
  assert.equal(landing.status, 200);
  assert.equal(landing.headers.get('cache-control'), 'no-store');
  const payload = await landing.json();
  assert.equal(payload.data.sections.length, 9);
  assert.equal(JSON.stringify(payload).includes('PRIVATE-DISABLED-COPY'), false);
  const home = await get('/');
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.ok(html.includes('/images/common/logo.avif'));
  assert.equal(html.includes('PRIVATE-DISABLED-COPY'), false);
  assert.match(html, /name="robots" content="noindex/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.equal(xml.includes('<loc>https://test.example.com/</loc>'), false);
  assert.ok(xml.includes('<loc>https://test.example.com/du-an/</loc>'));
  assert.equal((await get('/api/v1/users/')).status, 404);
  assert.equal((await get('/api/v1/landing/?revision=draft')).status, 400);
  assert.equal((await fetch(base + '/api/v1/projects/', { method: 'POST' })).status, 405);
  const surveyGet = await get('/api/survey/');
  assert.equal(surveyGet.status, 405);
  assert.equal(surveyGet.headers.get('cache-control'), 'no-store');
  const disabledSurvey = await fetch(base + '/api/survey/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base, 'Idempotency-Key': '90000000-0000-4000-8000-000000000099' },
    body: JSON.stringify({ name: 'Nguyễn Văn A', phone: '0912345678', location: 'Cần Thơ', building: 'household', bill: '2m_5m', note: '', consent: true, consentVersion: 'survey-contact-v1', turnstileToken: 'unused' }),
  });
  assert.equal(disabledSurvey.status, 503);
  assert.equal((await disabledSurvey.json()).error.code, 'UNAVAILABLE');
  const projects = await get('/du-an/?limit=2');
  assert.equal(projects.status, 200);
  const projectHtml = await projects.text();
  assert.ok([...projectHtml.matchAll(/href="([^"]+)"/g)].some(([, href]) => {
    const url = new URL(href.replaceAll("&amp;", "&"), base);
    return url.pathname === "/du-an/" && url.searchParams.get("limit") === "2" && Boolean(url.searchParams.get("cursor"));
  }), "Published catalog exposes a next-page cursor");
  const database = new Client({ connectionString: process.env.DATABASE_URL_DIRECT });
  await database.connect();
  try {
    await database.query("UPDATE solar_appdata.projects SET category=$1 WHERE id=$2", ["Published category outside demo groups", payload.data.projects[0].id]);
    const dynamicCategory = await get('/du-an/?limit=100');
    assert.equal(dynamicCategory.status, 200);
    assert.ok((await dynamicCategory.text()).includes('Published category outside demo groups'));
  } finally { await database.end(); }
  console.log('PASS: real Next HTTP API, DB-backed HTML, survey fail-closed response, no draft leak, catalog pagination, dynamic categories and rejected mutations');
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  if (child && child.exitCode === null) {
    const exited = once(child, 'exit');
    child.kill('SIGTERM');
    const killTimer = setTimeout(() => child.kill('SIGKILL'), 5000);
    await exited; clearTimeout(killTimer);
  }
  await rm(workspace, { recursive: true, force: true });
}
