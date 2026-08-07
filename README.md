# drop-site

The public marketing site, documentation, and API/CLI reference for
[DROP](https://github.com/JulesNsenda/drop) — served at
[dropkit.sh](https://dropkit.sh). A static React + Vite app with its own
client-side router: `/` (landing), `/docs` (documentation), and `/docs/api`
(API/CLI reference). `/reference` redirects to `/docs/api` for old links.

This repo was extracted out of DROP's platform repo (`src/dashboard`), which
used to build and serve this content itself. It deploys to DROP as an
ordinary static app — a push to `main` redeploys it via git deploy.

## Local development

```bash
npm install
npm run dev       # Vite dev server
npm run build     # Production build -> dist/
npm run preview   # Serve the production build locally
```

No backend, no API calls, no auth — this bundle is deliberately static so it
stays small and can't reach into DROP's control plane.
