# Testing Guide

## Commands

| Command                 | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `npm run typecheck`     | TypeScript strict check                         |
| `npm run lint`          | ESLint (zero warnings)                          |
| `npm run test`          | Vitest unit tests                               |
| `npm run test:coverage` | Vitest with 95% line/branch/function thresholds |
| `npm run build`         | Production build                                |
| `npm run e2e`           | Playwright smoke/E2E tests                      |

## Pre-commit hooks (Husky)

Every commit runs:

1. `lint-staged` (Prettier + ESLint on staged files)
2. `npm run typecheck`
3. `npm run test:coverage`
4. `npm run build`

## Agent pre-commit checklist

Before committing any phase:

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run test:coverage` — all thresholds green
- [ ] `npm run build` — clean build
- [ ] Open `http://localhost:5173` — verify acceptance criteria visually
- [ ] Browser console — zero errors
- [ ] Mobile viewport (375px) — no broken layouts
- [ ] No `supabase` import outside `services/` (ESLint enforces)
- [ ] Loading and error states render correctly
- [ ] New RLS policies tested in Supabase SQL editor (when applicable)
- [ ] Update this file with phase checklist results

## Phase 0 checklist

- [x] Vite + React + TypeScript strict scaffolded
- [x] Vitest + coverage-v8 with 95% thresholds
- [x] Playwright smoke test
- [x] Husky pre-commit hooks
- [x] ESLint layer enforcement (`no-restricted-imports` on supabase)
- [x] Folder structure: `components/`, `pages/`, `hooks/`, `services/`, `lib/`, `types/`
- [x] `.env.example` documented
- [x] Supabase MCP configured for project `yxxrbblhbydsubmabarp`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 1 checklist

- [x] `site_settings` migration applied (`0001_site_settings.sql`)
- [x] Seed data includes `site_name` and hero/footer settings
- [x] `settings.service.ts` maps DB rows to app DTOs
- [x] `useSiteSetting` hook loads header name from Supabase
- [x] `HomePage` renders site name from DB with fallback
- [x] RLS: public read for anon on `site_settings`
- [x] Unit tests: service + hook + page (100% coverage on included files)
- [x] Verified SQL: `select key, value from site_settings where key = 'site_name'`

## Phase 2 checklist

- [x] All public sections as pure components (Hero, Countdown, About, Events, Gallery, Register, Contact, Footer)
- [x] `homePageFixtures.ts` with static data
- [x] `HomePage` composes sections with fixtures only (no hooks)
- [x] UI primitives: Button, Card, Input, Label
- [x] Component tests for every public section
- [x] `npm run test:coverage` passes at 95%+ thresholds
