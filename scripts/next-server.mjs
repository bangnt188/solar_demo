import { spawn } from 'node:child_process';
import path from 'node:path';
const command = process.argv[2];
if (!['dev', 'build', 'start'].includes(command)) throw new Error('Expected dev, build or start');
const child = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), command, ...(command === 'build' ? ['--webpack'] : []), ...process.argv.slice(3)], { stdio: 'inherit', env: { ...process.env, DEPLOY_TARGET: 'server' } });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', () => { process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
