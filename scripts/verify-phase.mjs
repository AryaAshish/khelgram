#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const phase = process.argv[2]

if (!phase || !/^\d+$/.test(phase)) {
  console.error('Usage: npm run verify:phase -- <phase-number>')
  console.error('Example: npm run verify:phase -- 7')
  process.exit(1)
}

const phaseNumber = Number(phase)
const runPhaseE2e = process.env[`RUN_PHASE${phaseNumber}_E2E`] === '1' || phaseNumber <= 6

function run(command, args, extraEnv = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, ...extraEnv },
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log(`Verifying phase ${phaseNumber}...`)

run('npm', ['run', 'typecheck'])
run('npm', ['run', 'lint'])
run('npm', ['run', 'test:coverage'])
run('npm', ['run', 'build'])

if (phaseNumber === 11) {
  const denoCheck = spawnSync('deno', ['--version'], { stdio: 'ignore' })
  if (denoCheck.status === 0) {
    run('npm', ['run', 'test:edge'])
  } else {
    console.log('\nSkipped edge function Deno tests (deno not installed).')
  }
}

if (phaseNumber >= 1 && phaseNumber <= 6) {
  run('node', ['scripts/verify-rls.mjs'])
}

run('npm', ['run', 'e2e:install'])

if (runPhaseE2e) {
  if (phaseNumber <= 6) {
    run('npx', ['playwright', 'test', `e2e/phases`, '--grep', `@phase${phaseNumber}`])
    if (phaseNumber >= 2) {
      run('npx', ['playwright', 'test', 'e2e/phases/mobile-health.spec.ts'])
    }
  } else {
    run('npx', ['playwright', 'test', `e2e/phases/phase${phaseNumber}-.*.spec.ts`], {
      [`RUN_PHASE${phaseNumber}_E2E`]: '1',
    })
  }
} else {
  console.log(`\nSkipped phase ${phaseNumber} E2E (set RUN_PHASE${phaseNumber}_E2E=1 when implemented).`)
}

console.log(`\nPhase ${phaseNumber} verification complete.`)
