# Solar LXDB — Deployment runbook (Cloudflare Workers)

Updated: 2026-11-09. Source: https://github.com/bangnt188/solar_demo (branch `dev`).

## Current hosting

- **Production demo domain:** https://lxdb.captain-solution.tech/ → Cloudflare Workers custom domain → `lxdb-solar-worker`.
- **Worker preview:** https://lxdb-solar-worker.nguyenbang-skyone.workers.dev/
- **Build source:** `dev` contains Next.js and private submodules `packages/ui`, `packages/backend`. `main` is untouched and reserved for a separate full-stack production deployment.
- **Deploy artifact:** `cf-pages` is an orphan branch containing prebuilt `out/` files. Despite its historical name, this is **not GitHub Pages hosting**. Cloudflare Workers Builds tracks this branch.
- **Fallback:** Cloudflare Pages project `lxdb-solar-demo` remains on `lxdb-solar-demo.pages.dev` for rollback only; its custom domain was removed. Do not configure a duplicate custom domain while Workers is serving traffic.
- **GitHub Pages:** legacy workflow `.github/workflows/deploy-pages.yml` was deleted. Branch `gh-pages` contains old artifacts and is not used in deployment. To unpublish the legacy GitHub Pages website, repository admin must use GitHub Settings → Pages.

## Build and deployment sequence

1. Push source changes to `dev`.
2. Workflow `.github/workflows/deploy-cloudflare-pages.yml` runs from `dev`. It uses `environment: github-pages` **only** to read the legacy private-submodule token `COMPONENT_UI_READ_TOKEN` (or `SUBMODULE_READ_TOKEN`). It does **not** deploy to GitHub Pages.
3. Checkout pinned submodules → Node 22 → `npm ci` → `npm run typecheck` → `npm run build:demo` → `npm run test:export`. Build env: `NEXT_PUBLIC_SITE_URL=https://lxdb.captain-solution.tech/`, `SEO_INDEXABLE=false`, `DEPLOY_TARGET=demo`.
4. Action `peaceiris/actions-gh-pages@v4` publishes **only** `out/` to orphan branch `cf-pages`. It is used as a generic Git branch publisher; the GitHub Pages website is not involved.
5. Cloudflare Workers Builds triggers on `cf-pages` and deploys static assets onto `lxdb-solar-worker` using account-managed build credentials.
6. **Critical security boundary:** Workers build copies the prebuilt branch files with `cp -R ./* /tmp/lxdb-public-assets/`. The shell glob excludes root dotfiles (especially `.git`, `.wrangler`). The deploy command points to **`/tmp/lxdb-public-assets`**, never to the checkout root. Do not revert to `wrangler deploy --assets .` because that includes Git metadata and build temp files.
7. Verify Workers Builds result is `success`, custom domain is mapped to `lxdb-solar-worker`, homepage and deep links work, and private-submodule code / environment files were not published.

## Cloudflare configuration

- Account: `4e577220abb44fa926f2a11b8cf10b55`
- Zone: `captain-solution.tech`
- Worker: `lxdb-solar-worker`
- Builds connected repo: `bangnt188/solar_demo`, production branch: `cf-pages`.
- Build: `mkdir -p /tmp/lxdb-public-assets && cp -R ./* /tmp/lxdb-public-assets/ && test -f /tmp/lxdb-public-assets/index.html && test -f /tmp/lxdb-public-assets/404.html`
- Deploy: `npx --yes wrangler@4.148.0 deploy --assets /tmp/lxdb-public-assets --name lxdb-solar-worker --compatibility-date 2026-11-09`
- Worker uses an existing account build token. Recommended follow-up: create a dedicated narrowly scoped token for `lxdb-solar-worker` rather than reusing the `le-grande-centre` build token.
- The Worker hosts a **static demo**. No live CMS auth/CRUD or survey submissions. Backend `server` target stays separate.

## Verification and rollback

- Source: https://github.com/bangnt188/solar_demo/tree/dev
- CI: https://github.com/bangnt188/solar_demo/actions/workflows/deploy-cloudflare-pages.yml
- Cloudflare: https://dash.cloudflare.com/4e577220abb44fa926f2a11b8cf10b55/workers-and-pages
- Test `/`, `/du-an/`, `/thiet-bi/`, `/dich-vu/`, `/giai-phap/`, `/khao-sat/`, `/admin/`, asset loading, links and Lighthouse. Compare published footer contacts against signed LXDB company data; do not include developer personal contacts.
- After a failed GitHub Actions build, the last successful Worker deployment remains. After a failed Workers Build, confirm its deploy did not change Worker version before attempting rollback.
- Code rollback: create a revert commit on `dev`, let Actions republish `cf-pages`, wait for successful Workers Build. Avoid force-updating `main`.
- Infrastructure rollback: if needed, detach Worker custom domain and reattach the Cloudflare Pages fallback domain with the correct DNS. Only do this with validation and an outage plan.
- GitHub Pages clean-up is separate from Worker hosting: removing the old workflow stops future GH Pages publishing, but does **not** itself unpublish any previously published GitHub Pages site. Do not delete `cf-pages`; that branch drives Workers Builds.

## Security and access

- Never commit private submodules, source secrets or PATs to public `cf-pages`.
- Use private GitHub Environment secret only for checkout. Eventually migrate the secret to `cloudflare-worker` environment and update the workflow.
- If a secret leak is suspected, revoke the credential, investigate logs and published assets, then rotate it before redeploy.
- Keep `SEO_INDEXABLE=false` until demo content, images and production SEO have client approval.
