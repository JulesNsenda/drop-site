import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Standalone site (extracted from DROP's platform repo, DROP-070 → the
// 2026-08-07 site split, see docs/plans/2026-08-07-site-split-and-apex-app.md
// item 3 there). One Vite root at the repo root — no separate `site/`
// directory or entry shim needed here, unlike the platform's
// vite.site.config.ts: that override existed only because the site bundle
// had to share a `src/` tree with the admin dashboard's own Vite root. This
// repo has no second bundle to share with.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
