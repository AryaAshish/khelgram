# Khelgram Foundation

Event registration and CMS platform for the Khelgram Children's Sports Festival.

## Stack

- React 19 + Vite + TypeScript
- Supabase (Postgres, Auth, Storage)
- TanStack Query, React Router, Vitest, Playwright

## Architecture

```
UI (components/pages) → hooks (business logic) → services (data layer) → Supabase
```

Supabase client is only imported in `src/services/` and `src/lib/supabase.ts`.

## Setup

```bash
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

npm install
npm run dev
```

## Quality

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run e2e:install   # once, installs Playwright browser
npm run verify:phase -- 6
```

Pre-commit hooks run typecheck, coverage, and build automatically. Phase completion uses `verify:phase` (unit + RLS + E2E).

## Design system

Khelgram uses a **hybrid brand** with two visual lanes:

| Surface                          | Mood               | Key tokens                                              |
| -------------------------------- | ------------------ | ------------------------------------------------------- |
| NGO (`/`, `/get-involved`)       | Grassroots dignity | `--color-wheat`, `--color-earth`, warm `SectionShell`   |
| Event (`/khel2026`, `/register`) | Festival energy    | `--color-festival`, `--color-saffron`, festival buttons |

Shared primitives live in `src/components/public/primitives/` (`SectionShell`, `SectionHeading`, `StatCard`, `RevealOnScroll`). Tokens are defined in `src/styles/design-tokens.css`.

### Swapping hero/about images

Curated placeholder URLs ship in `src/fixtures/visualAssets.ts`. Admins can override without code changes:

1. Open **Admin → Content → Organization → Hero** (or **About**, or **Khel 2026 → Hero**).
2. Paste an image URL or click **Choose from library** (upload assets on **Media** first).
3. Save the section. Public pages prefer CMS URLs via `resolveHeroVisual()` in `src/lib/heroVisuals.ts`.

Keys: `org_hero_image`, `org_about_image`, `khel2026_hero_image` (migration `0019_hero_visual_cms.sql`).

## Phases

- [TESTING.md](./TESTING.md) — per-phase deliverable checklists
- [docs/AUTOMATED_TESTING.md](./docs/AUTOMATED_TESTING.md) — how manual checks map to automation
