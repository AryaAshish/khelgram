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

## Phase 8 checklist

- [x] Migration `0006_media_assets.sql` applied (media_assets table + Storage bucket `media`)
- [x] `media.service.ts` — uploadFile, deleteFile, listAssets
- [x] `useMediaLibrary.ts` — list, upload, delete mutations
- [x] `gallery.service.ts` extended with saveGalleryImages
- [x] Admin `MediaPage` — upload grid, drag-drop, delete with confirm
- [x] Admin `GalleryPage` — add from media library, reorder, inline alt/caption, save
- [x] `ImagePicker` component for media selection
- [x] Unit tests: media service, hooks, admin pages, ImagePicker
- [x] E2E spec ready: `RUN_PHASE8_E2E=1 npm run verify:phase -- 8`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 9 checklist

- [x] Migration `0007_credibility.sql` applied (team, contributors, sponsors, testimonials, faq)
- [x] Credibility services and hooks with fixture fallbacks
- [x] Public components: ImpactStatsBar, TeamGrid, ContributorsGrid, SponsorWall, TestimonialCarousel, FAQAccordion
- [x] Admin CRUD pages: Team, Contributors, Sponsors, Testimonials, FAQ, Impact stats
- [x] HomePage section order updated; impact stats moved out of About
- [x] Unit tests for services, hooks, components, and admin pages
- [x] E2E spec ready: `RUN_PHASE9_E2E=1 npm run verify:phase -- 9`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 10 checklist

- [x] Migration `0008_games_management.sql` applied (pre_registration_allowed, waitlist count trigger)
- [x] `games.service.ts` extended — upsert, delete, open/close, getGameWithCapacity
- [x] `useAdminGames` hooks + admin `GamesPage` (CRUD, capacity, manual registration)
- [x] Event status machine in Content CMS Site tab
- [x] `EventCard` with capacity bar and status badges; `PreRegBanner` on homepage
- [x] Waitlist flow in registration (no hard block when full)
- [x] `promoteFromWaitlist` in admin registrations
- [x] Unit tests for services, hooks, components, admin pages
- [x] E2E spec ready: `RUN_PHASE10_E2E=1 npm run verify:phase -- 10`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 11 checklist

- [x] Migration `0009_admin_email_setting.sql` applied
- [x] Edge Function `send-registration-email` (Resend, parent + admin emails)
- [x] `registrationEmail` templates with brand colors
- [x] `resendConfirmation` service + `useResendConfirmation` hook
- [x] Admin registration detail: **Resend Confirmation** button
- [x] Site tab: `admin_email` setting in Content CMS
- [x] Unit tests: `registrationEmail`, service, hook, detail page
- [x] Deno tests: `npm run test:edge` (when Deno is installed)
- [x] E2E spec ready: `RUN_PHASE11_E2E=1 npm run verify:phase -- 11`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 12 checklist

- [x] Migration `0010_section_visibility.sql` applied
- [x] `homepageSections` config with `isSectionVisible` / `sectionTitle` helpers
- [x] Content CMS **Sections** tab: per-section visibility toggles
- [x] Content CMS: credibility headings (`impact_title`, `team_title`, etc.) + `site_name` on Site tab
- [x] `HomePage` conditional rendering for all 14 homepage blocks
- [x] `ImpactStatsBar` accepts editable section title
- [x] Admin link in public header and footer
- [x] Unit tests: `homepageSections`, `contentSections`, `HomePage`, `ContentPage`, `ImpactStatsBar`
- [x] E2E spec ready: `RUN_PHASE12_E2E=1 npm run verify:phase -- 12`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 13 checklist

- [x] Dedicated `/register` route with focused registration page
- [x] `ShareRegistrationLink` — copy link + native share on registration form
- [x] Homepage registration section includes share actions
- [x] Header **Register** nav links to `/register` (shareable URL)
- [x] `/#register` hash still scrolls to form on homepage
- [x] Unit tests: `shareUrl`, `ShareRegistrationLink`, `RegisterPage`, form/header updates
- [x] E2E spec ready: `RUN_PHASE13_E2E=1 npm run verify:phase -- 13`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 14 checklist

- [x] `/` NGO homepage — org hero, about, impact, credibility, contact (no countdown/events/register)
- [x] `/khel2026` event landing via `EventLandingSections` + `Khel2026Page`
- [x] Header nav: About, Programs (`#programs`), Impact, **Khel2026**, Contact; logo → `/`
- [x] `RegisterPage` back link → `/khel2026`
- [x] Migration `0011_khel2026_split_defaults.sql` — org hero + khel2026 visibility defaults
- [x] `orgHomeSections.ts`, `khel2026Sections.ts`, `OrgHeroSection`, `EventRegisterCta`
- [x] Unit tests: `HomePage`, `Khel2026Page`, `EventLandingSections`, header, section configs
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 15 checklist

- [x] Migration `0012_org_khel2026_content_keys.sql` — `org_*` and `khel2026_*` CMS keys
- [x] `orgContentSections.ts` + `khel2026ContentSections.ts` admin field configs
- [x] Content admin grouped tabs: **Organization** | **Khel 2026** | **Shared**
- [x] `HomePage` reads `org_*`; `EventLandingSections` / `RegisterPage` read `khel2026_*`
- [x] NGO mission copy seeded for org about fields
- [x] Unit tests: content sections, ContentPage groups, khel2026Sections keys
- [x] E2E spec ready: `RUN_PHASE15_E2E=1 npm run verify:phase -- 15`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 16 checklist

- [x] Migration `0013_programs.sql` — `programs` table with RLS and six NGO pillar seeds
- [x] `programs.service.ts` + unit tests (CRUD, reorder, publish update)
- [x] `usePrograms.ts` hook + tests with fixture fallback
- [x] `ProgramsSection` on homepage `#programs` (after about, before impact)
- [x] `ProgramsPage` admin — CRUD, reorder, publish toggle + tests
- [x] Admin sidebar link and `/admin/programs` route
- [x] `programs_visible` / `programs_title` section settings
- [x] E2E spec ready: `RUN_PHASE16_E2E=1 npm run verify:phase -- 16`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 17 checklist

- [x] CMS fields under Organization tab: 4 stakeholder cards (title, description, button label, button URL)
- [x] `org_get_involved_*` keys with defaults in `useSiteSettings` fallback map
- [x] Public `GetInvolvedSection` on NGO homepage with Parents → `/register`, others → `/#contact`
- [x] Optional `/get-involved` route via `GetInvolvedPage` (same CMS data)
- [x] `get_involved_visible` section toggle in org Sections admin tab
- [x] Unit tests: `getInvolvedContent`, `GetInvolvedSection`, `GetInvolvedPage`, `HomePage`
- [x] E2E spec ready: `RUN_PHASE17_E2E=1 npm run verify:phase -- 17`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass

## Phase 18 checklist

- [x] Migration `0014_ngo_impact_stats.sql` — `scope` column, NGO metric reseed, `org_impact_subtitle`
- [x] `useImpactStats(scope)` filters org vs event stats with scoped fallbacks
- [x] `ImpactStatsBar` optional subtitle; homepage uses `org_impact_subtitle`
- [x] Admin Impact stats page — org/event scope tabs and relabeled headings
- [x] Unit tests updated for service, hook, bar, admin page, homepage
- [x] E2E spec ready: `RUN_PHASE18_E2E=1 npm run verify:phase -- 18`
- [x] `npm run typecheck`, `lint`, `test:coverage`, `build` all pass
