# Automated Phase Verification

Manual checklist items from `TESTING.md` are automated as follows.

## One command per phase

```bash
npm run verify:phase -- <N>
```

| Phase | What `verify:phase` runs                               |
| ----- | ------------------------------------------------------ |
| All   | `typecheck`, `lint`, `test:coverage`, `build`          |
| 1–6   | `verify:rls` (live Supabase RLS checks)                |
| 2–6   | Playwright `@phaseN` specs + mobile overflow check     |
| 7–11  | Playwright specs when `RUN_PHASE7_E2E=1` (etc.) is set |

Examples:

```bash
npm run verify:phase -- 6
RUN_PHASE7_E2E=1 npm run verify:phase -- 7
```

## Manual checklist → automation map

| Manual item                 | Automated by                                   |
| --------------------------- | ---------------------------------------------- |
| `npm run typecheck`         | `verify:phase` step 1                          |
| `npm run lint`              | `verify:phase` step 2                          |
| `npm run test:coverage`     | `verify:phase` step 3                          |
| `npm run build`             | `verify:phase` step 4                          |
| Open localhost:5173         | Playwright `visitPublicHomepage()`             |
| Browser console zero errors | `e2e/fixtures.ts` console/pageerror assertions |
| Mobile viewport 375px       | `e2e/phases/mobile-health.spec.ts`             |
| RLS SQL editor checks       | `npm run verify:rls`                           |
| Phase acceptance flows      | `e2e/phases/phaseN-*.spec.ts`                  |

## E2E layout

```
e2e/
  fixtures.ts              # Fails test on console/page errors
  helpers/
    pageHealth.ts          # Section visibility + overflow checks
    auth.ts                # Admin login/logout helpers
  phases/
    phase2-sections.spec.ts
    phase3-data.spec.ts
    phase4-registration.spec.ts
    phase5-admin-auth.spec.ts
    phase6-admin-registrations.spec.ts
    mobile-health.spec.ts
    phase7-content.spec.ts      # gated: RUN_PHASE7_E2E=1
    phase8-media.spec.ts        # gated: RUN_PHASE8_E2E=1
    phase9-credibility.spec.ts  # gated: RUN_PHASE9_E2E=1
    phase10-games.spec.ts       # gated: RUN_PHASE10_E2E=1
    phase11-email.spec.ts       # gated: RUN_PHASE11_E2E=1
```

## Required environment

```bash
cp .env.example .env
```

| Variable                             | Required for                           |
| ------------------------------------ | -------------------------------------- |
| `VITE_SUPABASE_URL`                  | RLS checks, live registration E2E      |
| `VITE_SUPABASE_ANON_KEY`             | RLS checks, live registration E2E      |
| `E2E_ADMIN_EMAIL`                    | Admin E2E (phases 5–11)                |
| `E2E_ADMIN_PASSWORD`                 | Admin E2E (phases 5–11)                |
| `RUN_PHASE7_E2E` … `RUN_PHASE11_E2E` | Enable future-phase specs              |
| `RESEND_E2E_INBOX_ID`                | Phase 11 delivery assertion (optional) |

Install browsers once:

```bash
npm run e2e:install
```

## Targeted runs

```bash
npm run e2e:smoke          # homepage desktop + mobile
npm run e2e:phases         # all phase specs (future phases skip by default)
npm run verify:rls         # RLS only
npx playwright test --grep @phase5
```

## Phase 7–11 workflow

1. Implement the phase feature.
2. Fill in / adjust the matching `e2e/phases/phaseN-*.spec.ts` selectors.
3. Set `RUN_PHASEN_E2E=1` and run `npm run verify:phase -- N`.
4. Commit with updated `TESTING.md` checklist.

Pre-commit hooks still run unit tests + build only (E2E stays opt-in via `verify:phase` to keep commits fast).
