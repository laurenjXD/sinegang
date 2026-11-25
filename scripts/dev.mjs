import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const [major, minor] = process.versions.node.split('.').map(Number)
const supportsEnvProxy = major > 24 || (major === 24 && minor >= 5) || (major === 22 && minor >= 21)
const viteEntry = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const args = [...(supportsEnvProxy ? ['--use-env-proxy'] : []), viteEntry, ...process.argv.slice(2)]
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, NODE_USE_ENV_PROXY: supportsEnvProxy ? '1' : process.env.NODE_USE_ENV_PROXY },
})

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  if (!child.killed) child.kill(signal)
})
child.on('exit', (code) => { process.exitCode = code ?? 1 })
