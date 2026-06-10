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

Before committing any phase, run:

```bash
npm run verify:phase -- <N>
```

That command automates the checklist below. See [docs/AUTOMATED_TESTING.md](./docs/AUTOMATED_TESTING.md) for details.

| Check                       | Automated command / spec             |
| --------------------------- | ------------------------------------ |
| `typecheck`                 | `verify:phase`                       |
| `lint`                      | `verify:phase`                       |
| `test:coverage` (95%+)      | `verify:phase`                       |
| `build`                     | `verify:phase`                       |
| Homepage renders            | `e2e/phases/phase2-sections.spec.ts` |
| Browser console zero errors | `e2e/fixtures.ts`                    |
| Mobile 375px layout         | `e2e/phases/mobile-health.spec.ts`   |
| Supabase layer enforcement  | ESLint in `verify:phase` lint step   |
| RLS policies                | `npm run verify:rls` (phases 1–6)    |
| Phase acceptance flows      | `e2e/phases/phaseN-*.spec.ts`        |

Pre-commit hooks (Husky) run `typecheck`, `test:coverage`, and `build` only. Run `verify:phase` before each phase commit.

For phases 7–11, enable E2E with `RUN_PHASE7_E2E=1` (etc.) after implementing the phase.

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

## Phase 3 checklist

- [x] Migration `0002_games_gallery_impact_stats.sql` applied
- [x] `games.service`, `gallery.service`, `impactStats.service` with unit tests
- [x] `useGames`, `useGallery`, `useImpactStats`, `useAllSettings` hooks with fixture fallbacks
- [x] `SectionSkeleton` and `SectionErrorBoundary` for loading/error states
- [x] `HomePage` wired to Supabase data via hooks
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 4 checklist

- [x] Migration `0003_registrations.sql` applied (registrations, registration_games, RPCs, triggers)
- [x] `registrations.service.ts` — createRegistration, getRegistrationCount, checkDuplicate, assertCapacity
- [x] `useRegistration.ts` — useCreateRegistration, useRegistrationCount (30s refetch)
- [x] Zod validation in `registration.schema.ts` (validated in hook)
- [x] Registration form wired to mutation; hero shows live counter
- [x] Pre-registration mode: TBA date, countdown hidden, form notice
- [x] RLS: anon insert only; count/duplicate via security definer RPCs
- [x] Unit tests: service + hook; component/page tests updated
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 5 checklist

- [x] Migration `0004_admin_roles.sql` applied
- [x] `auth.service.ts` — signIn, signOut, getSession, getAdminRole
- [x] `useAuth.ts` — useSession, useAdminRole, useSignIn, useSignOut
- [x] `LoginPage`, `AdminLayout`, `RequireAuth`, `ForbiddenPage`
- [x] Lazy-loaded `/admin/*` routes with dashboard and registrations shell
- [x] Wrong password mapped to "Invalid email or password"
- [x] Unit tests: auth service, useAuth, RequireAuth, LoginPage, AdminLayout
- [x] Playwright: `/admin` redirects to login without session
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 6 checklist

- [x] `registrations.service.ts` extended with list, detail, status update, filter helper
- [x] `useAdminRegistrations`, `useExportRegistrations` hooks
- [x] Admin registrations table with search/filter and `.xlsx` export (SheetJS)
- [x] Registration detail page with status updates
- [x] Sidebar registrations count badge
- [x] Unit tests for service, hooks, and admin pages
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 7 checklist

- [x] Migration `0005_content_settings_seed.sql` applied
- [x] `upsertSetting`, `updateSectionSettings` in settings service
- [x] `useUpdateSectionSettings` with optimistic update + rollback
- [x] Admin `ContentPage` with tabs per section (Hero, Countdown, About, Events, Gallery, Register, Contact, Footer)
- [x] Public `HomePage` reads all section strings from settings with fallbacks
- [x] Unit tests: service, hooks, ContentPage, contentSections
- [x] E2E spec ready: `RUN_PHASE7_E2E=1 npm run verify:phase -- 7`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass
