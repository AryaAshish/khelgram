#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) {
    return
  }

  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue
    }
    const [key, ...rest] = trimmed.split('=')
    const value = rest.join('=').replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

loadEnvFile()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, anonKey)

const checks = []

async function runCheck(name, fn) {
  try {
    await fn()
    checks.push({ name, ok: true })
    console.log(`✓ ${name}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    checks.push({ name, ok: false, message })
    console.error(`✗ ${name}: ${message}`)
  }
}

await runCheck('anon can read site_settings', async () => {
  const { data, error } = await supabase.from('site_settings').select('key').limit(1)
  assert(!error, error?.message ?? 'query failed')
  assert(Array.isArray(data), 'expected array response')
})

await runCheck('anon can read games', async () => {
  const { data, error } = await supabase.from('games').select('id').limit(1)
  assert(!error, error?.message ?? 'query failed')
  assert((data ?? []).length > 0, 'expected seeded games')
})

await runCheck('anon cannot read registrations', async () => {
  const { data, error } = await supabase.from('registrations').select('id').limit(1)
  assert(!error, `unexpected query error: ${error?.message}`)
  assert((data ?? []).length === 0, `expected 0 rows, got ${data?.length ?? 0}`)
})

await runCheck('anon can read registration count RPC', async () => {
  const { data, error } = await supabase.rpc('get_registration_count')
  assert(!error, error?.message ?? 'rpc failed')
  assert(typeof data === 'number', 'expected numeric count')
})

await runCheck('anon can insert registration', async () => {
  const stamp = Date.now()
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      child_name: `RLS Child ${stamp}`,
      age: 8,
      parent_name: 'RLS Parent',
      email: `rls-${stamp}@khelgram.test`,
      phone: '9999999999',
    })
    .select('id, code')
    .single()

  assert(!error, error?.message ?? 'insert failed')
  assert(data?.code?.startsWith('KG-2026-'), 'expected generated registration code')
})

const failed = checks.filter((check) => !check.ok)
if (failed.length > 0) {
  console.error(`\nRLS verification failed (${failed.length}/${checks.length})`)
  process.exit(1)
}

console.log(`\nRLS verification passed (${checks.length}/${checks.length})`)
