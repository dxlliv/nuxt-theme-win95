#!/usr/bin/env node

import { execSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, symlinkSync, unlinkSync, lstatSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT_DIR = process.cwd()
const MODULES_DIR = join(ROOT_DIR, 'modules')
const CONFIG_FILE = join(ROOT_DIR, 'desktop.modules.json')

const args = process.argv.slice(2)
const command = args[0] || 'setup'
const useHttps = args.includes('--https')

function log(msg, symbol = 'ℹ') {
  console.log(`${symbol} ${msg}`)
}

function error(msg) {
  console.error(`❌ ${msg}`)
}

function success(msg) {
  console.log(`✅ ${msg}`)
}

function getModulesConfig() {
  if (!existsSync(CONFIG_FILE)) {
    error(`Configuration file ${CONFIG_FILE} not found.`)
    process.exit(1)
  }
  try {
    const raw = readFileSync(CONFIG_FILE, 'utf-8')
    return JSON.parse(raw).modules || []
  } catch (e) {
    error(`Failed to parse ${CONFIG_FILE}: ${e.message}`)
    process.exit(1)
  }
}

function formatRepoUrl(url, https = false) {
  if (https && url.startsWith('git@github.com:')) {
    return url.replace('git@github.com:', 'https://github.com/')
  }
  return url
}

function ensureSymlink(target, linkPath) {
  try {
    if (existsSync(linkPath) || lstatSafe(linkPath)) {
      unlinkSync(linkPath)
    }
    symlinkSync(target, linkPath)
    log(`Linked ${linkPath} -> ${target}`, '🔗')
  } catch (e) {
    log(`Notice: could not create symlink ${linkPath}: ${e.message}`, '⚠️')
  }
}

function lstatSafe(path) {
  try {
    return lstatSync(path)
  } catch {
    return null
  }
}

function setupCoreSymlinks() {
  const coreDir = join(MODULES_DIR, 'core')
  const nuxtDesktopDir = join(MODULES_DIR, 'nuxt-desktop')

  if (existsSync(coreDir) && existsSync(nuxtDesktopDir)) {
    const symlinks = ['kit', 'runtime', 'types']
    for (const name of symlinks) {
      const linkPath = join(coreDir, name)
      const targetPath = join('..', 'nuxt-desktop', 'src', name)
      ensureSymlink(targetPath, linkPath)
    }
  }
}

function cmdClone() {
  const modules = getModulesConfig()

  if (!existsSync(MODULES_DIR)) {
    mkdirSync(MODULES_DIR, { recursive: true })
  }

  log(`Checking ${modules.length} dependencies in ./modules/...`, '📦')

  for (const mod of modules) {
    const targetDir = join(MODULES_DIR, mod.name)
    const repoUrl = formatRepoUrl(mod.repo, useHttps)
    const branch = mod.branch || 'main'

    if (existsSync(targetDir)) {
      log(`[${mod.name}] Already cloned in modules/${mod.name}`, '✔')
    } else {
      log(`[${mod.name}] Cloning branch '${branch}' from ${repoUrl}...`, '⬇')
      try {
        execSync(`git clone --depth 1 --branch ${branch} ${repoUrl} ${targetDir}`, {
          stdio: 'inherit',
        })
        success(`[${mod.name}] Cloned successfully`)
      } catch (err) {
        error(`[${mod.name}] Git clone failed: ${err.message}`)
        if (!useHttps && mod.repo.startsWith('git@')) {
          log(`Retrying with HTTPS...`, '🔄')
          const httpsUrl = formatRepoUrl(mod.repo, true)
          execSync(`git clone --depth 1 --branch ${branch} ${httpsUrl} ${targetDir}`, {
            stdio: 'inherit',
          })
          success(`[${mod.name}] Cloned successfully with HTTPS`)
        }
      }
    }
  }

  setupCoreSymlinks()

  log('Running pnpm install for the standalone workspace...', '🔄')
  try {
    execSync('pnpm install', { stdio: 'inherit', cwd: ROOT_DIR })
    success('Workspace dependencies installed successfully!')
  } catch (err) {
    error(`pnpm install failed: ${err.message}`)
  }

  console.log('\n======================================================')
  success('Standalone desktop environment is ready!')
  console.log('To start development:')
  console.log('  pnpm dev')
  console.log('To check git status across modules:')
  console.log('  node scripts/setup-standalone.mjs status')
  console.log('======================================================\n')
}

function cmdStatus() {
  log('Git Status across workspace modules:\n', '🔍')

  // Check root
  log(`=== Root Theme (${ROOT_DIR}) ===`, '📁')
  spawnSync('git', ['status', '-s', '-b'], { stdio: 'inherit', cwd: ROOT_DIR })
  console.log('')

  if (!existsSync(MODULES_DIR)) {
    log('No ./modules directory found.', 'ℹ')
    return
  }

  const modules = getModulesConfig()
  for (const mod of modules) {
    const targetDir = join(MODULES_DIR, mod.name)
    if (existsSync(targetDir)) {
      log(`=== modules/${mod.name} ===`, '📁')
      spawnSync('git', ['status', '-s', '-b'], { stdio: 'inherit', cwd: targetDir })
      console.log('')
    }
  }
}

function cmdPull() {
  if (!existsSync(MODULES_DIR)) {
    log('No ./modules directory found.', 'ℹ')
    return
  }

  const modules = getModulesConfig()
  for (const mod of modules) {
    const targetDir = join(MODULES_DIR, mod.name)
    if (existsSync(targetDir)) {
      log(`Pulling updates for modules/${mod.name}...`, '⬇')
      try {
        execSync('git pull', { stdio: 'inherit', cwd: targetDir })
      } catch (e) {
        error(`Failed to pull modules/${mod.name}: ${e.message}`)
      }
    }
  }
  setupCoreSymlinks()
  success('All modules updated.')
}

function cmdAdd(name) {
  if (!name) {
    error('Specify module name to add: node scripts/setup-standalone.mjs add <name>')
    process.exit(1)
  }

  const repo = name.includes('/') ? `git@github.com:${name}.git` : `git@github.com:owdproject/${name}.git`
  const pkgName = name.split('/').pop().replace('.git', '')
  const targetDir = join(MODULES_DIR, pkgName)

  if (existsSync(targetDir)) {
    log(`Module ${pkgName} already exists in ./modules/`, 'ℹ')
    return
  }

  log(`Cloning ${repo} into modules/${pkgName}...`, '⬇')
  execSync(`git clone ${repo} ${targetDir}`, { stdio: 'inherit' })
  success(`Module ${pkgName} added. Running pnpm install...`)
  execSync('pnpm install', { stdio: 'inherit', cwd: ROOT_DIR })
}

switch (command) {
  case 'setup':
  case 'clone':
    cmdClone()
    break
  case 'status':
    cmdStatus()
    break
  case 'pull':
    cmdPull()
    break
  case 'add':
    cmdAdd(args[1])
    break
  default:
    console.log(`
OpenWebDesktop Standalone Development Utility

Usage:
  node scripts/setup-standalone.mjs [command]

Commands:
  setup, clone    Clone required dependencies into ./modules and run pnpm install (default)
  status          Show git status across root and all modules/
  pull            Pull latest changes for all modules in modules/
  add <name>      Clone an additional module/app into modules/ (e.g. app-youtube)

Options:
  --https         Clone via HTTPS instead of SSH
`)
}
