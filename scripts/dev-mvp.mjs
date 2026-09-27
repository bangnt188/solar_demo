import { spawn } from 'node:child_process';
import path from 'node:path';
// Deliberately override inherited env/.env.local for the unapproved MVP preview.
const child = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'dev', '--webpack', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, DEPLOY_TARGET: 'server', INTEGRATION_MODE: 'mock', APP_ENV: 'sandbox', NEXT_PUBLIC_SITE_URL: 'https://mvp.invalid', SEO_INDEXABLE: 'false' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', () => { process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
