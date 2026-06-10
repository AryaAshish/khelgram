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
npm run e2e
```

Pre-commit hooks run typecheck, coverage, and build automatically.

## Phases

See [TESTING.md](./TESTING.md) for per-phase checklists.
