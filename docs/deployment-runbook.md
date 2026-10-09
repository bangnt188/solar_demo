# Solar LXDB — Deployment runbook (GitHub Pages demo / Next.js server)

Updated: 2026-10-09. Repository: https://github.com/bangnt188/solar_demo (branch `dev`).

## Environments and boundaries

- **Static demo:** GitHub Pages at https://bangnt188.github.io/solar_demo/. Built from `dev` using `.github/workflows/deploy-pages.yml`; `npm run build:demo`, `npm run test:export`, `out/` artifact. `SEO_INDEXABLE=false`. The public CMS demo and survey form are mock UX, not production CRUD or persisted intake.
- **Backend/server:** `.github/workflows/backend-ci.yml` checks a separate Next.js server build (`npm run build:server`) with fake build-only DATABASE_URL and SURVEY_INTAKE_ENABLED=false. This CI does **not** deploy a backend or production system.
- **Production:** `main` is reserved for production. Do not assume a deployed production backend, Neon, R2, auth or CMS from a green Pages workflow.

## GitHub prerequisites

1. Settings → Pages → Build and deployment → **Source: GitHub Actions**.
2. Settings → Environments → `github-pages`: permit deployment from `dev`. Any required reviewers may delay execution.
3. Settings → Environments → `github-pages` → Environment secrets: `COMPONENT_UI_READ_TOKEN` (or `SUBMODULE_READ_TOKEN`). Token permissions: **Contents: Read**, selected repositories **component-ui** and **lib-ts-be**; optionally Solar repo itself. Never put PAT into code or a Google Doc. Environment secrets are visible to jobs with `environment: github-pages`; normal job without that binding cannot see them.
4. `GITHUB_TOKEN` is used by actions/checkout for the Solar parent; the Environment token is used separately only for pinned private submodules. Permissions for demo workflow: `contents: read`, `pages: write`, `id-token: write`.

## Automatic pipeline

Push `dev` → checkout parent with built-in token → fetch pinned private submodules → Node 22 + npm ci → npm run typecheck → npm run build:demo → npm run test:export → validate `out/index.html` → upload Pages artifact → GitHub Pages deploy.

Backend CI separately checks integrity, backend typechecks and tests, consumer tests, core tests and `build:server` with dummy config. Only trusted dev pushes/manual dispatch/same-repo PRs run checks needing the private Environment token; fork PRs skip this sensitive job, and must be vetted by maintainers before merge.

## Verification

- Actions → “Deploy demo to GitHub Pages”: workflow, build and deployment green.
- Confirm `head_sha` of the successful deployment run matches current `dev` commit SHA; a green old run does not prove current code is deployed.
- Open https://bangnt188.github.io/solar_demo/ and validate `/du-an/`, `/thiet-bi/`, `/khao-sat/`, `/admin/` under `/solar_demo/`.
- After a failed build, **do not** claim the website updated. The last published GitHub Pages version may remain live.
- The old `gh-pages/deployment.json` manifest can be stale: after GitHub Actions artifact deployments the `gh-pages` branch need not change. Use Actions deployment SHA as source of truth.

## Operations, errors and rollback

- `SUBMODULE_READ_TOKEN missing`: verify secret is an Environment secret under `github-pages`, the job has `environment: github-pages`, and environment branch policy allows `dev`.
- `Repository not found` or `could not read Username`: verify PAT expiration, Contents: Read scope and **both** private repos. Checkout parent with the built-in GitHub token before fetching submodules.
- `npm ci`/workspace errors: check checked-in `package-lock.json` plus two pinned submodule commits, do not float dependencies inside deploy.
- `Build static site`/export errors: run `npm ci`, `npm run typecheck`, `npm run build:demo`, `npm run test:export` locally with same `NEXT_PUBLIC_SITE_URL`, `SEO_INDEXABLE=false`.
- To rollback: identify the last known good dev commit and create an auditable revert commit on `dev` (not a force-push); let Actions publish the reverted source. An old successful workflow run is not necessarily a rollback of the currently checked-out source.
- For a token leak: revoke/rotate token immediately; replace only the GitHub Environment secret; rerun deployment.

## Links

- Source: https://github.com/bangnt188/solar_demo/tree/dev
- Pages workflow: https://github.com/bangnt188/solar_demo/actions/workflows/deploy-pages.yml
- Backend checks: https://github.com/bangnt188/solar_demo/actions/workflows/backend-ci.yml
- Existing guidance: README.md, docs/backend-core.md, docs/neon-r2-setup.md

Owner action if deploying a real server: provide a separate approved hosting target and server secrets outside Pages; do not enable survey intake or copy database credentials into this demo pipeline.
