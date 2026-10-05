import { mkdtemp, cp, mkdir, rm, symlink, readdir, readFile, appendFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = await mkdtemp(path.join(tmpdir(), 'solar-demo-build-'));
try {
  for (const item of ['src', 'public', 'next.config.ts', 'tsconfig.json', 'package.json']) await cp(path.join(root, item), path.join(workspace, item), { recursive: true });
  // The isolated build needs the workspace package declarations and built assets.
  await mkdir(path.join(workspace, 'packages/ui'), { recursive: true });
  for (const item of ['package.json', 'dist']) await cp(path.join(root, 'packages/ui', item), path.join(workspace, 'packages/ui', item), { recursive: true });
  await mkdir(path.join(workspace, 'database/schema'), { recursive: true });
  await cp(path.join(root, 'database/schema/landing-content.schema.json'), path.join(workspace, 'database/schema/landing-content.schema.json'));
  for (const serverRoute of ['src/app/api', 'src/app/admin']) await rm(path.join(workspace, serverRoute), { recursive: true, force: true });
  // Server sitemap reads published SEO at request time; the noindex demo has no DB.
  await appendFile(path.join(workspace, 'src/app/sitemap.ts'), '\nexport const dynamic = "force-static";\n');
  await mkdir(path.join(workspace, 'node_modules/@solar'), { recursive: true });
  for (const item of await readdir(path.join(root, 'node_modules'))) {
    if (item !== '@solar') await symlink(path.join(root, 'node_modules', item), path.join(workspace, 'node_modules', item));
  }
  // Resolve the copied UI, not npm's symlink back to the mutable source workspace.
  await symlink(path.join(workspace, 'packages/ui'), path.join(workspace, 'node_modules/@solar/ui'), 'dir');
  const env = Object.fromEntries(['PATH', 'HOME', 'USER', 'LOGNAME', 'SHELL', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot', 'COMSPEC', 'CI'].filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]));
  Object.assign(env, { DEPLOY_TARGET: 'demo', NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://bangnt188.github.io/solar_demo/', SEO_INDEXABLE: 'false', NEXT_TELEMETRY_DISABLED: '1' });
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], { cwd: workspace, env, stdio: 'inherit' });
    child.on('error', reject); child.on('exit', resolve);
  });
  if (exitCode !== 0) throw new Error('Demo build failed');
  const manifest = JSON.parse(await readFile(path.join(workspace, '.next/server/app-paths-manifest.json'), 'utf8'));
  if (Object.keys(manifest).some(route => /^\/(api|admin)(\/|$)/.test(route))) throw new Error('Server routes leaked into demo artifact');
  await rm(path.join(root, 'out'), { recursive: true, force: true });
  await cp(path.join(workspace, 'out'), path.join(root, 'out'), { recursive: true });
  console.log('Demo export ready: out/ (no server routes or cloud environment)');
} finally { await rm(workspace, { recursive: true, force: true }); }
