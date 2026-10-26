#!/usr/bin/env node
// Fails when the hand-written API reference drifts from DROP's OpenAPI document.
//
//   node scripts/check-api-drift.mjs
//   DROP_OPENAPI_URL=./openapi.json node scripts/check-api-drift.mjs   # offline
//
// Documented side: only the `ENDPOINT_GROUPS` array in ReferenceContent.tsx, and
// within it only single-line `{ method: 'X', path: '/...', ..., role: 'y' }`
// entries. Prose, comments and the CLI/MCP tables are never read.
// Served side: GET /api/v1/openapi.json — `x-drop-min-role` is the middleware
// floor, `x-drop-auth: handler` means no middleware floor.
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REFERENCE = resolve(here, '../src/components/landing/ReferenceContent.tsx');
const ALLOWLIST = resolve(here, 'api-drift-allowlist.json');
// The API is served from the dashboard host; the apex dropkit.sh is the site.
const DEFAULT_URL = 'https://dashboard.dropkit.sh/api/v1/openapi.json';
const API_PREFIX = '/api/v1';

// Roles the document can express as a middleware floor vs. ones DROP enforces
// inside the handler (no floor). 'session' is a handler-side check layered on a
// floor, so either shape is acceptable for it.
const FLOOR_ROLES = new Set(['readonly', 'user', 'admin', 'authenticated']);
const HANDLER_ROLES = new Set(['public', 'hmac', 'app-token']);

// A documented path may carry a query string (e.g. '/verify?app=<name>'); OpenAPI paths do not.
const key = (method, path) => `${method.toUpperCase()} ${path.split('?')[0].replace(/:([A-Za-z0-9_]+)/g, '{$1}')}`;

export function parseDocumented(source) {
  const start = source.indexOf('export const ENDPOINT_GROUPS');
  if (start < 0) throw new Error('ENDPOINT_GROUPS not found in ReferenceContent.tsx');
  const end = source.indexOf('\n];', start);
  if (end < 0) throw new Error('end of ENDPOINT_GROUPS not found');
  const out = [];
  for (const line of source.slice(start, end).split('\n')) {
    const m = line.match(/^\s*\{\s*method:\s*'([A-Z]+)',\s*path:\s*'([^']+)'.*\brole:\s*'([a-z-]+)'\s*\},?\s*$/);
    if (m) out.push({ method: m[1], path: m[2], role: m[3] });
    else if (/^\s*\{\s*method:/.test(line)) throw new Error(`unparseable endpoint entry: ${line.trim().slice(0, 100)}`);
  }
  if (out.length === 0) throw new Error('no endpoints parsed from ENDPOINT_GROUPS');
  return out;
}

async function loadSpec(where) {
  if (/^https?:\/\//.test(where)) {
    const res = await fetch(where, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${where} -> HTTP ${res.status}`);
    try {
      return await res.json();
    } catch {
      throw new Error(`GET ${where} did not return JSON (is it the site, not the API host?)`);
    }
  }
  return JSON.parse(await readFile(where, 'utf8'));
}

function served(spec) {
  const map = new Map();
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(item)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      map.set(key(method, path), { floor: op['x-drop-min-role'] ?? null, handler: op['x-drop-auth'] === 'handler' });
    }
  }
  return map;
}

async function main() {
  const documented = parseDocumented(await readFile(REFERENCE, 'utf8'));
  const allow = JSON.parse(await readFile(ALLOWLIST, 'utf8'));
  for (const a of allow) if (!a.method || !a.path || !a.reason) throw new Error(`allow-list entry needs method, path, reason: ${JSON.stringify(a)}`);
  const allowed = new Set(allow.map((a) => key(a.method, a.path)));

  const where = process.env.DROP_OPENAPI_URL || DEFAULT_URL;
  const spec = await loadSpec(where);
  const servedOps = served(spec);
  if (servedOps.size === 0) throw new Error(`no operations in ${where}`);

  const problems = [];
  const docKeys = new Set();
  let skipped = 0;
  for (const d of documented) {
    const k = key(d.method, d.path);
    docKeys.add(k);
    // OpenAPI only covers the /api/v1 route table (root-level discovery
    // documents are not in it), so those cannot be checked either way.
    if (!d.path.startsWith(`${API_PREFIX}/`) && d.path !== API_PREFIX) { skipped++; continue; }
    const s = servedOps.get(k);
    if (!s) { problems.push(`documented but not served: ${k}`); continue; }
    if (FLOOR_ROLES.has(d.role)) {
      if (s.floor !== d.role) problems.push(`role mismatch: ${k} documented '${d.role}', served ${s.floor ? `floor '${s.floor}'` : 'with no middleware floor (x-drop-auth: handler)'}`);
    } else if (HANDLER_ROLES.has(d.role)) {
      if (s.floor) problems.push(`role mismatch: ${k} documented '${d.role}', served with floor '${s.floor}'`);
    } else if (d.role !== 'session') {
      problems.push(`unknown documented role '${d.role}' on ${k}`);
    }
  }
  for (const k of servedOps.keys()) {
    if (!docKeys.has(k) && !allowed.has(k)) problems.push(`served but undocumented: ${k}`);
  }
  for (const k of allowed) {
    if (docKeys.has(k)) problems.push(`allow-list entry is documented, remove it: ${k}`);
    else if (!servedOps.has(k)) problems.push(`allow-list entry is no longer served, remove it: ${k}`);
  }

  console.log(`documented ${documented.length} (${skipped} outside ${API_PREFIX}, not checked), served ${servedOps.size}, allow-listed ${allowed.size}  [${where}]`);
  if (problems.length) {
    for (const p of problems) console.log(`  - ${p}`);
    console.log(`${problems.length} difference(s).`);
    process.exit(1);
  }
  console.log('API reference matches the OpenAPI document.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(`check-api-drift: ${e.message}`); process.exit(2); });
}
