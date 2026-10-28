#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Install this theme and its playground without cloning the desktop or engine.
const cwd = fileURLToPath(new URL('../', import.meta.url))
const result = spawnSync('pnpm', ['install'], { cwd, stdio: 'inherit' })
process.exit(result.status ?? 1)
