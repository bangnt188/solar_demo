// A real Next server in a disposable source copy, against the disposable PG test DB.
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';

const mock = process.argv.includes('--mock');
if (!mock) assert.ok(process.env.SOLAR_TEST_PG_SOCKET?.startsWith('/tmp/solar-integration-'));
const root = process.cwd();
const workspace = await mkdtemp(path.join(tmpdir(), 'solar-server-http-'));
let child;
let logs = '';
try {
  for (const item of ['src', 'public', 'next.config.ts', 'tsconfig.json', 'package.json']) await cp(path.join(root, item), path.join(workspace, item), { recursive: true });
  await mkdir(path.join(workspace, 'database/schema'), { recursive: true });
  await cp(path.join(root, 'database/schema/landing-content.schema.json'), path.join(workspace, 'database/schema/landing-content.schema.json'));
  await symlink(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'), 'dir');
  const probe = net.createServer();
  probe.listen(0, '127.0.0.1'); await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const env = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'development', DEPLOY_TARGET: 'server', INTEGRATION_MODE: mock ? 'mock' : 'cloud', NEXT_PUBLIC_SITE_URL: 'https://test.example.com', SEO_INDEXABLE: 'true', DATABASE_URL: mock ? 'invalid-mock-must-ignore' : process.env.DATABASE_URL_DIRECT, NEXT_TELEMETRY_DISABLED: '1' };
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
  assert.equal(payload.data.projects.length, mock ? 6 : 5); // cloud: tombstone from the adapter integration test
  assert.equal(JSON.stringify(payload).includes('PRIVATE-DISABLED-COPY'), false);
  const home = await get('/');
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.ok(html.includes('NĂNG LƯỢNG'));
  assert.ok(html.includes('/images/common/logo.png'));
  assert.equal(html.includes('PRIVATE-DISABLED-COPY'), false);
  assert.match(html, /name="robots" content="noindex/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.equal(xml.includes('<loc>https://test.example.com/</loc>'), false);
  assert.equal(xml.includes('<loc>https://test.example.com/du-an/</loc>'), !mock);
  assert.equal((await get('/api/v1/users/')).status, 404);
  assert.equal((await get('/api/v1/landing/?revision=draft')).status, 400);
  assert.equal((await fetch(base + '/api/v1/projects/', { method: 'POST' })).status, 405);
  const projects = await get('/du-an/?limit=2');
  assert.equal(projects.status, 200);
  assert.equal((await projects.text()).includes('Xem tiếp dự án'), !mock);
  console.log(mock ? 'PASS: mock Next HTTP API/HTML without credentials, forced noindex and rejected mutations' : 'PASS: real Next HTTP API, DB-backed HTML, no draft leak, catalog pagination and rejected mutations');
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
