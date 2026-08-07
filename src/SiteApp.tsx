import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';
import ReferencePage from './pages/ReferencePage';
import SiteNotFoundPage from './pages/SiteNotFoundPage';

/**
 * Router for the public marketing site (extracted from the platform's
 * DROP-070 split, see drop's docs/plans/2026-08-07-site-split-and-apex-app.md
 * item 3) — landing, docs, and the API/CLI reference. No auth context, no
 * lazy-loading (the whole point of the split is that this bundle is small on
 * its own).
 *
 * The reference moved from `/reference` to `/docs/api` (still under `/docs`,
 * next to the rest of the documentation); `/reference` client-side-redirects
 * to the new path so old links survive (the static server serves this app's
 * `index.html` for any unknown path, so `/reference` reaches this router).
 * The catch-all renders a real 404 (not a silent
 * bounce to the landing page) so a route divergence stays visible instead of
 * looking like nothing's wrong.
 */
function SiteApp() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="docs" element={<DocsPage />} />
      <Route path="docs/api" element={<ReferencePage />} />
      <Route path="reference" element={<Navigate to="/docs/api" replace />} />
      <Route path="*" element={<SiteNotFoundPage />} />
    </Routes>
  );
}

export default SiteApp;
