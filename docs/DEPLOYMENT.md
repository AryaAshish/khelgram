# Deployment (GitHub + Vercel)

Branch-based deployments:

| Branch | Environment | Vercel project    | URL                             |
| ------ | ----------- | ----------------- | ------------------------------- |
| `main` | Production  | `khelgram` (prod) | https://khelgram.vercel.app     |
| `dev`  | Development | `khelgram-dev`    | https://khelgram-dev.vercel.app |

Merging (or pushing) to `main` deploys production. Merging to `dev` deploys the dev environment.

## 1. Push to GitHub

```bash
gh auth login
git add .
git commit -m "Prepare GitHub and Vercel deployment pipeline"
git branch dev
git push -u origin main
git push -u origin dev
```

Create the remote repo if needed:

```bash
gh repo create khelgram --private --source=. --remote=origin --push
```

## 2. Create two Vercel projects

Use the [Vercel dashboard](https://vercel.com/new) and import the same GitHub repository twice:

1. **khelgram** (production)
   - Production Branch: `main`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **khelgram-dev** (development)
   - Production Branch: `dev`
   - Same build settings as above

`vercel.json` in the repo handles SPA routing for React Router.

## 3. Environment variables

Set these in each Vercel project under **Settings → Environment Variables**:

| Variable                 | Production (`main`) | Development (`dev`)                        |
| ------------------------ | ------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`      | Prod Supabase URL   | Dev/staging Supabase URL (or same project) |
| `VITE_SUPABASE_ANON_KEY` | Prod anon key       | Dev anon key                               |

Use **Production** scope for the prod project and **Production** scope for the dev project (each project treats its tracked branch as production).

## 4. GitHub Actions secrets

In the GitHub repo: **Settings → Secrets and variables → Actions**, add:

| Secret                   | Where to find it                                           |
| ------------------------ | ---------------------------------------------------------- |
| `VERCEL_TOKEN`           | [Vercel account tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`          | Vercel project → Settings → General (Team/Org ID)          |
| `VERCEL_PROJECT_ID_PROD` | Production project ID                                      |
| `VERCEL_PROJECT_ID_DEV`  | Dev project ID                                             |

Workflows:

- `.github/workflows/ci.yml` — lint, test, and build on PRs and pushes to `main` / `dev`
- `.github/workflows/deploy.yml` — deploys to the matching Vercel project after merge

## 5. GitHub environments (optional)

Create **production** and **development** environments in GitHub (**Settings → Environments**) to gate prod deploys with required reviewers.

## 6. Custom domains (optional)

- Prod project: `khelgram.org` (or your domain)
- Dev project: `dev.khelgram.org` assigned to the `dev` branch

## Local preview of production build

```bash
npm run build
npm run preview
```
