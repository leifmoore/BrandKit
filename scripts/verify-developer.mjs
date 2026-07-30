import { spawnSync } from 'node:child_process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const checks = [
  ['run', 'verify:handoff'],
  ['run', 'verify:canonical'],
  ['run', 'typecheck'],
  ['run', 'build'],
  ['run', 'test:production'],
  ['run', 'test:e2e'],
]

for (const args of checks) {
  const result = spawnSync(npmCommand, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
