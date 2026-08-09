import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Briefcase,
  Building2,
  Check,
  Cloud,
  Database,
  Layers,
  Lock,
  Repeat,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export interface LandingSectionsProps {
  onEnter: () => void;
}

type EnterProps = Pick<LandingSectionsProps, 'onEnter'>;
type HeroProps = LandingSectionsProps;

// Access to the hosted instance is by invitation — `allowSignup` defaults to
// false (DROP_ALLOW_SIGNUP, platform.ts) and dropkit.sh runs it that way, so
// sending a new visitor to /dashboard/signup funnels them into a page that
// refuses them. Every "get started" CTA points here instead.
//
// This is the one host-specific string on the page. If you are self-hosting
// DROP and have opened signup, change this to '/dashboard/signup' (or drop the
// CTA) — everything else here is deliberately host-neutral.
const REQUEST_ACCESS_URL = 'https://waitlist.dropkit.sh';

// The self-host path. Unlike REQUEST_ACCESS_URL this is NOT host-specific: it
// points at the project's own repository, which is the same for every DROP
// install serving this bundle, so it does not violate the host-neutrality rule
// above. /releases/latest always resolves to the newest stable release, so this
// never needs bumping at release time — which is the whole reason 1.0.0 was cut
// as a stable version rather than an rc (GitHub does not resolve /latest to a
// prerelease).
const RELEASES_URL = 'https://github.com/JulesNsenda/drop/releases/latest';

// Page order leads with the agentic story, because that is the only claim on
// this page a competitor is not already making. A survey of the category in
// Aug 2026 — Openship, Coolify, Dokploy, Daytona, Freestyle, Railway — found
// that no self-hosted PaaS leads with agent operation: Openship's hero is
// ownership ("Deploy anything. Own everything."), Coolify's does not mention AI
// at all, Dokploy buries "AI-built apps" in a subheading. Daytona and Freestyle
// do lead agentic, but they sell sandboxes for running AI-generated code, not
// somewhere you own and put a real app.
//
// Two things back the claim up and are DROP's actual moat, both previously
// documented only in public/llms.txt and absent from this page entirely:
//
//   1. The MCP server is *remote* and speaks OAuth 2.1 + PKCE with RFC
//      8414/9728 discovery, so claude.ai's web connector can reach it — that
//      connector has no custom-header field, so a bearer token is not an
//      option. Every competitor's agent story is a local mcp.json, which is a
//      developer-only door. Ours is one a non-technical reader can walk
//      through.
//   2. Guardrails (see GUARDRAILS). Everyone in this category says an agent
//      can deploy; nobody answers "what stops it deploying 400 broken apps at
//      3am". Safety is what makes the agentic claim credible rather than
//      alarming.
//
// Do NOT position this page on feature breadth. Openship advertises 42
// capabilities and a built-in mail server, Coolify 280+ one-click services,
// Dokploy Swarm clustering. DROP has Postgres and Redis. Breadth is the one
// axis where a comparison loses to all three.
//
// Host-neutrality matters here: this same bundle is served at "/" by *every*
// DROP install, not just dropkit.sh. No copy may name a specific host, and the
// "hosted" path must read as "this instance", never "our SaaS".

const AGENTS = ['Claude', 'Claude Code', 'Codex', 'Cursor', 'Cline', 'Windsurf'];

const MCP_TOOLS = [
  'deploy_files',
  'deploy_from_git',
  'list_apps',
  'app_status',
  'app_logs',
  'get_deploy_logs',
  'restart_app',
];

const RUNTIMES = [
  'Node.js',
  'Python',
  'Go',
  'Docker',
  'Static',
  'Next.js',
  'Nuxt',
  'SvelteKit',
  'Astro',
  'FastAPI',
  'Flask',
];

// Transcribed from public/llms.txt § "Guardrails on agent-driven deploys". Each
// of these is enforced by the platform — do not add an entry here that the code
// does not implement. The framing matters as much as the list: llms.txt is
// explicit that exceeding a limit returns "a structured refusal explaining
// which one, never a silent failure or kill", and that is the part a reader
// worried about handing over control actually needs to hear.
const GUARDRAILS: { title: string; body: string }[] = [
  {
    title: 'It stops retrying a broken deploy',
    body: 'A circuit breaker trips after repeated failures instead of looping on the same build forever.',
  },
  {
    title: 'It cannot deploy without limit',
    body: 'Deploy quotas are counted per person, so one runaway assistant cannot take the server with it.',
  },
  {
    title: 'Throwaway apps clean themselves up',
    body: 'An app can be created with an expiry — 60 minutes by default, 24 hours at most, three live at a time — plus idle reaping and a disk headroom ceiling.',
  },
  {
    title: 'Your app’s output cannot give orders',
    body: 'Anything an app prints is fenced as untrusted before an assistant reads it, so text in a log can never become an instruction.',
  },
];

const STEPS: { n: string; tag: string; title: string; body: string }[] = [
  {
    n: '01',
    tag: 'DROP',
    title: 'Point it at the project',
    body: 'Ask your assistant to deploy it, or hand DROP the folder yourself. There is no file to write first and no form to fill in.',
  },
  {
    n: '02',
    tag: 'DETECT',
    title: 'It works out the rest',
    body: 'DROP recognises what the app is built with, installs everything it needs, and builds it the way that project expects to be built.',
  },
  {
    n: '03',
    tag: 'DEPLOY',
    title: 'You get a link',
    body: 'The app is online at its own web address, with a valid HTTPS certificate, and it is restarted automatically if it ever falls over.',
  },
];

// Who it's for, in the reader's own words. Each card names the situation the
// reader is actually in and what DROP takes off the invoice — "what it
// replaces" is the question a business reader is really asking. The agents card
// leads because the page now leads on that story.
const AUDIENCES: {
  key: string;
  icon: JSX.Element;
  who: string;
  body: string;
  replaces: string;
}[] = [
  {
    key: 'agents',
    icon: <Bot size={17} style={{ color: 'var(--accent)' }} />,
    who: 'Anyone building with AI assistants',
    body: 'Your assistant wrote the app and it is sitting on your laptop. Connect DROP once and the same assistant puts it on the internet, then reads the logs back to you when something looks wrong.',
    replaces: 'pasting the assistant’s output into a terminal',
  },
  {
    key: 'founder',
    icon: <Briefcase size={17} style={{ color: 'var(--accent)' }} />,
    who: 'Founders & small business owners',
    body: 'Your developer says the app is finished, then adds: “we just need to sort out hosting.” That sentence is a whole other project. This is that project, already done.',
    replaces: 'paying someone to set up servers',
  },
  {
    key: 'agency',
    icon: <Users size={17} style={{ color: 'var(--accent)' }} />,
    who: 'Agencies & freelance dev shops',
    body: 'Twelve client projects should not mean twelve hosting bills and twelve control panels. Run them all on one server, each with its own domain, database and logs.',
    replaces: 'a separate hosting plan per client',
  },
  {
    key: 'lead',
    icon: <Building2 size={17} style={{ color: 'var(--accent)' }} />,
    who: 'Technical leads at small companies',
    body: 'You need a platform team you are never going to get headcount for. DROP is the part of one that actually earns its keep, without adopting Kubernetes to get there.',
    replaces: 'a platform team, or Kubernetes',
  },
];

const HOSTED_POINTS = [
  'Nothing to install, nothing to maintain',
  'Someone else handles updates and backups',
  'Currently invitation-only',
];

const SELFHOST_POINTS = [
  'Runs on a small Linux VPS',
  'Your code and customer data stay on your machine',
  'MIT licensed, and the source is public',
];

const CONFIG_POINTS = [
  'Pin the app type & build/start commands',
  'Custom per-app domains',
  'Inject environment variables',
  'Declare required secrets (auto-generated or prompted)',
  'Attach Postgres & Redis',
];

const CLI_CMDS: { cmd: string; desc: string }[] = [
  { cmd: 'deploy ./app', desc: 'ship it' },
  { cmd: 'logs myapp', desc: 'tail logs' },
  { cmd: 'list', desc: 'list apps' },
  { cmd: 'status myapp', desc: 'app status' },
];

// Mirrors the real dashboard nav (src/dashboard/src/components/Layout.tsx) —
// a product shot promising sections that do not exist is a support ticket.
const DASH_NAV: { label: string; active?: boolean }[] = [
  { label: 'Apps', active: true },
  { label: 'Deploy' },
  { label: 'Users' },
  { label: 'Settings' },
];

const DASH_STATS: { l: string; v: string }[] = [
  { l: 'Online', v: '5/5' },
  { l: 'Req/min', v: '2.4k' },
  { l: 'Avg CPU', v: '4.2%' },
];

const DASH_ROWS: { name: string; meta: string; cpu: string; dot: string }[] = [
  { name: 'myapp', meta: ':4310 · node', cpu: '0.4%', dot: '#39D98A' },
  { name: 'api-gateway', meta: ':4311 · docker', cpu: '1.2%', dot: '#39D98A' },
  { name: 'analytics', meta: ':4312 · python', cpu: '3.8%', dot: '#FEBC2E' },
  { name: 'docs-site', meta: ':4313 · static', cpu: '0.0%', dot: '#39D98A' },
];

/* ------------------------------------------------------------------ */
/* Shared bits of the design system, so the new sections match the old */
/* ------------------------------------------------------------------ */

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: 14,
};

const primaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  fontFamily: 'var(--mono)',
  fontWeight: 600,
  fontSize: 14,
  background: 'linear-gradient(180deg,var(--accent-2),var(--accent))',
  color: 'var(--accent-ink)',
  padding: '13px 22px',
  borderRadius: 11,
  boxShadow: 'var(--btn)',
  border: 'none',
  cursor: 'pointer',
};

const secondaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'var(--mono)',
  fontWeight: 500,
  fontSize: 14,
  background: 'var(--bg-3)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  padding: '13px 22px',
  borderRadius: 11,
};

const panelStyle: CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 16,
  background: 'var(--bg-2)',
  boxShadow: 'var(--elev)',
};

/** Small mono line under a plain-English claim — the technical proof. */
function ProofLine({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', marginTop: 10 }}>
      {children}
    </div>
  );
}

/** The chrome around a code/terminal sample — used three times below. */
function Frame({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--panel)',
        boxShadow: 'var(--elev)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--text-3)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/**
 * The hero. The claim is the hand-off a reader is actually living through in
 * 2026 — the assistant wrote the app, and it is sitting on their laptop.
 *
 * The visual is the assistant conversation rather than a terminal, because the
 * claim has to be visible, not just asserted; the terminal moved down to
 * TechnicalSection where the CLI lives. Deliberately *not* here any more: the
 * old `STATS` strip (0 / 0 / 1 / 24-7 — three of four were things you do not
 * get, and no competitor positions by absence) and the floating "deployed by
 * an assistant" badge, which duplicated a claim the hero now makes outright.
 */
function HeroSection({ onEnter }: HeroProps): JSX.Element {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(58% 55% at 72% 12%,color-mix(in srgb,var(--accent) 20%,transparent),transparent 72%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px)',
          backgroundSize: '54px 54px',
          WebkitMaskImage: 'radial-gradient(75% 60% at 50% 0%,#000,transparent 78%)',
          maskImage: 'radial-gradient(75% 60% at 50% 0%,#000,transparent 78%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="dl-grid-hero"
        style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '84px 28px 76px',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 52,
          alignItems: 'center',
        }}
      >
        <div>
          <a
            href="#assistant"
            className="dl-hover-border"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
              background: 'var(--bg-3)',
              borderRadius: 999,
              padding: '6px 8px 6px 12px',
              marginBottom: 26,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>New</span>
            <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
            Claude, Cursor and Codex deploy straight to DROP
            <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 999, padding: '2px 8px' }}>
              →
            </span>
          </a>
          {/* 48px, not the old 60: JetBrains Mono runs a 0.6em advance and this
              h1 is two full sentences, so at 60px every line wrapped a second
              time inside the 1.05fr column and the sentence break stopped
              reading. Explicit <br/>s below control the break at every width. */}
          <h1
            className="dl-hero-h1"
            style={{
              fontFamily: 'var(--mono)',
              fontWeight: 700,
              fontSize: 48,
              lineHeight: 1.06,
              letterSpacing: -2,
              marginBottom: 22,
            }}
          >
            Your assistant
            <br />
            builds it.
            <br />
            <span
              style={{
                background: 'linear-gradient(120deg,var(--accent),var(--accent-2))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              DROP puts it online.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 480, marginBottom: 18, lineHeight: 1.6 }}>
            {/* The browser path is the differentiator, so it leads — but the
                WORKS WITH row directly below lists five clients that do need a
                token, so the second clause has to be here. Read alone, the
                first clause would promise the no-key path for all of them. */}
            Connect DROP to Claude in your browser with a login — no config file, no API key — or to Claude Code and
            Cursor with a token. Then tell it to put your app on the internet: it deploys, attaches a database, and
            reads the logs back to you if anything looks wrong.
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text-3)', marginBottom: 28 }}>
            Node · Python · Go · Docker · static. Detected automatically, no Dockerfile required.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
            <a href={REQUEST_ACCESS_URL} target="_blank" rel="noopener noreferrer" style={primaryBtnStyle}>
              Request access →
            </a>
            {/* The second audience this page has always had but never served:
                the reader who wants to run it on their own box. */}
            <Link to="/docs#installation" className="dl-hover-border" style={secondaryBtnStyle}>
              Run it on your own server
            </Link>
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="dl-hover-text"
            style={{
              display: 'block',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: 'var(--text-2)',
              background: 'none',
              border: 'none',
              padding: 0,
              marginBottom: 20,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Already have an account? Sign in
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 0.5, color: 'var(--text-3)' }}>
              WORKS WITH
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {AGENTS.map((a) => (
                <span
                  key={a}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--text-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 7,
                    padding: '4px 10px',
                    background: 'var(--bg-2)',
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-8% -6%',
              background:
                'radial-gradient(50% 50% at 50% 40%,color-mix(in srgb,var(--accent) 26%,transparent),transparent 70%)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />
          <AssistantChat />
          <p style={{ marginTop: 22, fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>
            That is the entire deployment. Nobody copied a command out of a chat window.
          </p>
        </div>
      </div>
    </section>
  );
}

/** The assistant conversation. Lives in the hero; the claim has to be shown. */
function AssistantChat(): JSX.Element {
  return (
    <div style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--panel)', boxShadow: 'var(--elev)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            borderRadius: 8,
            background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
          }}
        >
          <Sparkles size={15} style={{ color: 'var(--accent-ink)' }} />
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)' }}>Assistant</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 7px' }}>
          drop · mcp
        </span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            alignSelf: 'flex-end',
            maxWidth: '80%',
            background: 'var(--accent-soft)',
            border: '1px solid var(--border)',
            borderRadius: '12px 12px 4px 12px',
            padding: '11px 14px',
            fontSize: 13.5,
            color: 'var(--text)',
          }}
        >
          Deploy the <span style={{ fontFamily: 'var(--mono)' }}>./api</span> folder and attach a database.
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>On it. Deploying with DROP.</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-2)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)' }}>
            <Settings2 size={14} style={{ color: 'var(--accent)' }} /> called <span style={{ color: 'var(--accent)' }}>deploy_files</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--ok)' }}>done</span>
          </div>
          <pre style={{ margin: 0, padding: '11px 13px', fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.7, color: 'var(--text-3)' }}>
            {'{ "path": "./api", "database": "postgres" }'}
          </pre>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '12px 14px',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--ok)',
            borderRadius: 10,
            background: 'var(--bg-2)',
          }}
        >
          <span style={{ color: 'var(--ok)', fontFamily: 'var(--mono)' }}>✔</span>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text)' }}>https://api.localhost</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>
              FastAPI · Postgres · DATABASE_URL injected
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
          Your FastAPI service is live at <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>api.localhost</span>{' '}
          with a Postgres database attached and logs streaming to the dashboard.
        </div>
      </div>
    </div>
  );
}

function HowItWorks(): JSX.Element {
  return (
    <section id="how-it-works" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={eyebrowStyle}>How it works</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 38, letterSpacing: -1 }}>
          Three steps. Nothing to fill in.
        </h2>
      </div>
      <div className="dl-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ ...panelStyle, position: 'relative', padding: 28 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontFamily: 'var(--mono)',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {s.n}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 8 }}>
              {s.tag}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 19, marginBottom: 10 }}>{s.title}</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * "What you get" — plain English first, mechanism underneath as a `ProofLine`.
 * Keeps `id="features"` because SiteNav and SiteFooter both anchor to it.
 *
 * Five cards, down from seven. "Change the code, it redeploys" folded into the
 * big card's body and the logs card into DashboardPreview, which already
 * covered it. Spans still total 12 across four columns, so the bento grid stays
 * exact: big(2×2) + padlock(2) + runtimes(2) + database(2) + restart(2).
 *
 * The runtimes card carries `id="runtimes"` — it absorbed the old standalone
 * RuntimesStrip section, and SiteFooter's "Runtimes" link anchors to that id.
 */
function WhatYouGet(): JSX.Element {
  const iconTile = (child: ReactNode, size = 32): JSX.Element => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 9,
        background: 'var(--accent-soft)',
        color: 'var(--accent)',
        marginBottom: 12,
      }}
    >
      {child}
    </div>
  );

  return (
    <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px' }}>
      <div style={{ marginBottom: 36, maxWidth: 660 }}>
        <div style={eyebrowStyle}>What you get</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 38, letterSpacing: -1, marginBottom: 14 }}>
          Everything a live app needs, already switched on.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7 }}>
          This is not a list of things to set up. It is a list of things nobody on your side has to think about
          again.
        </p>
      </div>
      {/* `minmax(164px,auto)`, not a flat 164px: the plain-English copy is
          longer than the jargon it replaced and none of these cards clip, so a
          fixed row height spills text through the rounded border on desktop.
          (Below 960px landing.css already forces grid-auto-rows:auto.) */}
      <div className="dl-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 'minmax(164px, auto)', gap: 14 }}>
        <div style={{ ...panelStyle, gridColumn: 'span 2', gridRow: 'span 2', padding: 26, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
              color: 'var(--accent-ink)',
              marginBottom: 16,
            }}
          >
            <Rocket size={20} style={{ color: 'var(--accent-ink)' }} />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
            It goes live, and you configured nothing
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 'auto', maxWidth: 340 }}>
            Point DROP at a folder. It works out what the app is, installs what it needs, builds it and starts it.
            No setup wizard, no checklist, no Dockerfile to write. Change the code and it rebuilds and restarts on
            its own.
          </p>
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, background: 'var(--panel)', padding: '13px 15px', fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text-2)', marginTop: 18 }}>
            <span style={{ color: 'var(--accent)' }}>$</span> drop deploy ./app
            <br />
            <span style={{ color: 'var(--ok)' }}>✔ https://app.localhost</span>
          </div>
        </div>

        <div style={{ ...panelStyle, gridColumn: 'span 2', padding: 24 }}>
          {iconTile(<Lock size={18} style={{ color: 'var(--accent)' }} />, 34)}
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 16, marginBottom: 7 }}>
            A real web address, with the padlock
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Every app gets its own address and a valid HTTPS certificate, issued and renewed for it. Point your own
            domain name at it whenever you are ready.
          </p>
          <ProofLine>Caddy reverse proxy · Let&apos;s Encrypt · auto-renewed</ProofLine>
        </div>

        {/* id="runtimes" — SiteFooter anchors here. This card absorbed the
            standalone RuntimesStrip section, so the full RUNTIMES list lives
            in its chip row rather than the old five-item subset. */}
        <div id="runtimes" style={{ ...panelStyle, gridColumn: 'span 2', padding: 24, display: 'flex', flexDirection: 'column' }}>
          {iconTile(<Layers size={18} style={{ color: 'var(--accent)' }} />, 34)}
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 16, marginBottom: 7 }}>
            It runs whatever your developer built
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>
            Node, Python, Go, Docker and plain websites — plus the frameworks built on them, recognised without
            being told which one it is looking at.
          </p>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 'auto' }}>
            {RUNTIMES.map((c) => (
              <span key={c} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 9px', background: 'var(--panel)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle, gridColumn: 'span 2', padding: 24 }}>
          {iconTile(<Database size={18} style={{ color: 'var(--accent)' }} />, 34)}
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 16, marginBottom: 7 }}>
            A database, already plugged in
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Each app gets its own Postgres, connected before it starts, with Redis alongside it if the app wants
            one. Nobody copies a password around.
          </p>
        </div>

        <div style={{ ...panelStyle, gridColumn: 'span 2', padding: 24 }}>
          {iconTile(<Repeat size={18} style={{ color: 'var(--accent)' }} />, 34)}
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 16, marginBottom: 7 }}>
            It picks itself back up
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
            If an app crashes it is restarted automatically, day or night — and everything it printed on the way
            down is kept, so the problem has an answer.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Who it's for + what it replaces — the section a business reader looks for. */
function WhoItsFor(): JSX.Element {
  return (
    <section id="who" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px' }}>
      <div style={{ marginBottom: 36, maxWidth: 660 }}>
        <div style={eyebrowStyle}>Who it&apos;s for</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 38, letterSpacing: -1, marginBottom: 14 }}>
          If one of these is you, this is the missing piece.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7 }}>
          DROP replaces the step between “the app is built” and “the app is online”, the one that usually needs a
          specialist.
        </p>
      </div>
      <div className="dl-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {AUDIENCES.map((a) => (
          <div key={a.key} style={{ ...panelStyle, display: 'flex', flexDirection: 'column', padding: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--accent-soft)',
                marginBottom: 14,
              }}
            >
              {a.icon}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 15, marginBottom: 10, lineHeight: 1.35 }}>
              {a.who}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 18 }}>{a.body}</p>
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>
                Replaces
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{a.replaces}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The depth behind the hero's claim: how an assistant connects, what it can
 * call, and — the part no competitor markets — what stops it doing damage.
 *
 * The OAuth line is the differentiator and is load-bearing: claude.ai's web
 * connector has no custom-header field, so a remote MCP server it can reach
 * *must* speak OAuth 2.1 + PKCE with RFC 8414/9728 discovery. Every rival's
 * agent story is a local mcp.json, which only a developer can wire up. Do not
 * soften this into "supports MCP" — that is the table-stakes version.
 */
function AssistantSection(): JSX.Element {
  return (
    <section id="assistant" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px' }}>
      <div className="dl-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.02fr', gap: 48, alignItems: 'start' }}>
        <div>
          <div style={eyebrowStyle}>Deploy from an AI assistant</div>
          <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 38, letterSpacing: -1, marginBottom: 16 }}>
            Let the assistant do the deploy.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>
            Say &ldquo;ship this folder&rdquo; to Claude, Codex or Cursor and it does, then reads the logs back to
            you if something went wrong. Nobody copies commands out of a chat window into a terminal.
          </p>
          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 24 }}>
            The technical version: DROP hosts its own MCP (Model Context Protocol) server, so any MCP client gets
            deploy, log and status calls as native tools. It speaks OAuth 2.1 with PKCE — which is what lets you add
            DROP as a connector in claude.ai from a browser, with a login instead of an API key — and takes a bearer
            token for clients that can set headers, like Claude Code.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MCP_TOOLS.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 7,
                  padding: '5px 10px',
                  background: 'var(--bg-2)',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>›</span> {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ ...panelStyle, padding: 30 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--accent-soft)',
              marginBottom: 16,
            }}
          >
            <ShieldCheck size={19} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 21, marginBottom: 10 }}>
            And it can&apos;t wreck anything
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 22 }}>
            Handing an assistant the keys is only reasonable if there are limits behind it. Exceeding one returns a
            clear refusal naming the limit — never a silent failure, and never a killed app.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {GUARDRAILS.map((g) => (
              <div key={g.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--mono)', fontSize: 13.5, color: 'var(--text)', marginBottom: 4 }}>
                  <Check size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  {g.title}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, paddingLeft: 23 }}>{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ onEnter }: EnterProps): JSX.Element {
  return (
    <section id="dashboard" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px' }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--bg-2)', boxShadow: 'var(--elev)' }}>
        <div style={{ padding: '44px 44px 8px', maxWidth: 640 }}>
          <div style={eyebrowStyle}>The dashboard</div>
          <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 32, letterSpacing: -0.5, marginBottom: 14 }}>
            One screen that answers &ldquo;is everything OK?&rdquo;
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 22 }}>
            Which apps are up, how hard they are working, what changed and when, plus domains, passwords and
            databases. Everything an app printed is kept and searchable, so a problem has an answer. If you would
            rather click than type, everything the command line does is here too.
          </p>
          <button type="button" onClick={onEnter} style={{ ...primaryBtnStyle, padding: '12px 20px' }}>
            Open the dashboard →
          </button>
        </div>
        <div style={{ padding: '32px 44px 0' }}>
          <div
            style={{
              border: '1px solid var(--border)',
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              borderBottom: 0,
              background: 'var(--panel)',
              overflow: 'hidden',
              boxShadow: '0 -8px 40px rgba(0,0,0,.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 15px', borderBottom: '1px solid var(--border)', background: 'var(--bg-3)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
              <span style={{ marginLeft: 8 }}>myapp.localhost/dashboard</span>
            </div>
            <div className="dl-grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: 280 }}>
              <div style={{ borderRight: '1px solid var(--border)', padding: '16px 12px', background: 'var(--bg-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
                  <span style={{ width: 13, height: 13, background: 'var(--accent)', borderRadius: '50% 50% 50% 2px', transform: 'rotate(45deg)' }} />
                  DROP
                </div>
                {DASH_NAV.map((n) => (
                  <div
                    key={n.label}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 12,
                      padding: '7px 10px',
                      borderRadius: 7,
                      marginBottom: 2,
                      color: n.active ? 'var(--text)' : 'var(--text-2)',
                      background: n.active ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    {n.label}
                  </div>
                ))}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                  {DASH_STATS.map((s) => (
                    <div key={s.l} style={{ border: '1px solid var(--border)', borderRadius: 9, padding: '12px 14px', background: 'var(--bg-2)' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-3)' }}>
                        {s.l}
                      </div>
                      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 20, marginTop: 4 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DASH_ROWS.map((r) => (
                    <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 9, background: 'var(--bg-2)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, boxShadow: `0 0 8px ${r.dot}` }} />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text)', flex: 1 }}>{r.name}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>{r.meta}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-2)' }}>{r.cpu}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Hosted vs self-hosted, side by side. Deliberately host-neutral: this bundle
 * is served by every DROP install, so the hosted column says "this instance",
 * never a specific domain.
 */
function TwoWaysToRun({ onEnter }: EnterProps): JSX.Element {
  const bullet = (text: string): JSX.Element => (
    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55 }}>
      <Check size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }} />
      {text}
    </div>
  );

  return (
    <section id="run" style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 28px' }}>
      <div style={{ marginBottom: 36, maxWidth: 660 }}>
        <div style={eyebrowStyle}>Two ways to run it</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 38, letterSpacing: -1, marginBottom: 14 }}>
          Use someone else&apos;s DROP, or run your own.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7 }}>
          Same platform either way. The only question is who keeps the server running. You can start on one and
          move to the other.
        </p>
      </div>
      <div className="dl-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column', borderRadius: 18, padding: 32 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--accent-soft)',
              marginBottom: 16,
            }}
          >
            <Cloud size={19} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 21, marginBottom: 10 }}>
            Use a hosted DROP
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 20 }}>
            Deploy onto a DROP someone already runs: this one, or your company&apos;s. You never touch a server.
            Access here is by invitation while the platform is in beta; ask for one and we&apos;ll be in touch.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
            {HOSTED_POINTS.map(bullet)}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <a href={REQUEST_ACCESS_URL} target="_blank" rel="noopener noreferrer" style={primaryBtnStyle}>
              Request access →
            </a>
            <button
              type="button"
              onClick={onEnter}
              className="dl-hover-text"
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: 'var(--text-2)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>

        <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column', borderRadius: 18, padding: 32 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--accent-soft)',
              marginBottom: 16,
            }}
          >
            <Server size={19} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 21, marginBottom: 10 }}>
            Run it on your own server
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 20 }}>
            One install script on any Linux machine. A small VPS is plenty for a portfolio of apps. Nothing leaves
            hardware you control, and there is no per-app fee because there is no bill but the server.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
            {SELFHOST_POINTS.map(bullet)}
          </div>
          <Link
            to="/docs#installation"
            className="dl-hover-border"
            style={{ ...secondaryBtnStyle, marginTop: 'auto', alignSelf: 'flex-start' }}
          >
            Installation guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * The technical appendix, in one section instead of the five it used to take
 * (a divider, a runtimes strip, drop.yaml, the CLI, and MCP config).
 *
 * The old divider opened with "If you were deciding whether DROP is for you,
 * you already have what you need" — which told half the audience to stop
 * reading at section 7 of 12. This introduces proof instead of dismissing the
 * reader.
 */
function TechnicalSection(): JSX.Element {
  return (
    <section id="technical" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 8px' }}>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 44, maxWidth: 680, marginBottom: 40 }}>
        <div style={eyebrowStyle}>For whoever runs it</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 34, letterSpacing: -1, marginBottom: 14 }}>
          The technical part.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7 }}>
          Everything above is what DROP does. This is how it does it: what it detects, how to override it, and how
          to drive it from a terminal or an assistant.
        </p>
      </div>

      <div className="dl-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 52 }}>
        <div>
          <div style={eyebrowStyle}>Escape hatch</div>
          <h3 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 28, letterSpacing: -0.5, marginBottom: 16 }}>
            Zero config by default. Full control when you want it.
          </h3>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>
            Most apps need nothing at all. For the rest, drop a <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>drop.yaml</span>{' '}
            in the folder to pin the app type, claim domains, set env, declare the secrets it can&apos;t start without,
            and attach a database. Unknown keys are rejected, so a typo fails loudly instead of doing nothing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONFIG_POINTS.map((c) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--accent)' }}>▸</span>
                {c}
              </div>
            ))}
          </div>
        </div>
        {/* This sample is pinned byte-for-byte by
            src/core/detector/documented-samples.test.ts ('landing: escape-hatch
            drop.yaml') — a published sample the parser rejects has shipped
            before. Change it there in the same commit or not at all. */}
        <Frame title="drop.yaml">
          <pre style={{ margin: 0, padding: 22, fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.85, color: 'var(--text-2)', overflow: 'auto' }}>
            <span style={{ color: 'var(--accent-2)' }}>name</span>: <span style={{ color: 'var(--ok)' }}>myapp</span>
            {'\n'}
            <span style={{ color: 'var(--accent-2)' }}>type</span>: <span style={{ color: 'var(--ok)' }}>nodejs</span>
            {'\n'}
            <span style={{ color: 'var(--accent-2)' }}>domains</span>:{'\n'}
            {'  - '}
            <span style={{ color: 'var(--ok)' }}>app.example.com</span>
            {'\n'}
            <span style={{ color: 'var(--accent-2)' }}>database</span>: <span style={{ color: 'var(--ok)' }}>postgres</span>
            {'\n'}
            <span style={{ color: 'var(--accent-2)' }}>env</span>:{'\n'}
            {'  '}
            <span style={{ color: 'var(--accent-2)' }}>NODE_ENV</span>: <span style={{ color: 'var(--ok)' }}>production</span>
            {'\n'}
            <span style={{ color: 'var(--accent-2)' }}>secrets</span>:{'\n'}
            {'  '}
            <span style={{ color: 'var(--accent-2)' }}>JWT_SECRET</span>: <span style={{ color: 'var(--ok)' }}>generate</span>
          </pre>
        </Frame>
      </div>

      <div className="dl-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={eyebrowStyle}>Command line + API</div>
          <h3 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 28, letterSpacing: -0.5, marginBottom: 16 }}>
            Install once. Deploy anything.
          </h3>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 22 }}>
            A full-featured CLI plus a REST API secured with JWT and API keys. Manage apps, logs, and domains from
            your terminal, your CI pipeline, or an AI agent. The MCP endpoint is the same platform behind a
            different door.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            {CLI_CMDS.map((c) => (
              <div key={c.cmd} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--panel)', fontFamily: 'var(--mono)', fontSize: 13.5 }}>
                <span style={{ color: 'var(--accent)' }}>$</span>
                <span style={{ color: 'var(--text)', flex: 1 }}>
                  <span style={{ color: 'var(--accent)' }}>drop</span> {c.cmd}
                </span>
                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{c.desc}</span>
              </div>
            ))}
          </div>
          <Link to="/docs/api" style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 14, color: 'var(--accent)' }}>
            Full CLI &amp; API reference →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Moved down from the hero, which now shows the assistant
              conversation instead. The build figure is a plausible Next.js
              install+build, not a flattering one — the old 8.2s matched a
              "~8s median deploy" stat that nothing in the repo measured. */}
          <Frame title="~/projects — drop">
            <div style={{ padding: 22, fontFamily: 'var(--mono)', fontSize: 13.5, lineHeight: 1.95 }}>
              <div>
                <span style={{ color: 'var(--accent)' }}>$</span> <span style={{ color: 'var(--text)' }}>drop deploy ./myapp</span>
              </div>
              <div style={{ color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--accent-2)' }}>→</span> Detecting app type…{' '}
                <span style={{ color: 'var(--text)' }}>Next.js 15</span> <span style={{ color: 'var(--ok)' }}>✓</span>
              </div>
              <div style={{ color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--accent-2)' }}>→</span> Provisioning PostgreSQL…{' '}
                <span style={{ color: 'var(--text)' }}>DATABASE_URL</span> <span style={{ color: 'var(--ok)' }}>✓</span>
              </div>
              <div style={{ color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--accent-2)' }}>→</span> Building… done in <span style={{ color: 'var(--text)' }}>41.6s</span>
              </div>
              <div style={{ color: 'var(--text-2)' }}>
                <span style={{ color: 'var(--accent-2)' }}>→</span> Starting… <span style={{ color: 'var(--ok)' }}>online ✓</span>
              </div>
              <div style={{ marginTop: 8, color: 'var(--ok)' }}>
                ✔ Deployed → <span style={{ color: 'var(--accent)' }}>https://myapp.localhost</span>
                <span
                  className="dl-cursor"
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 15,
                    background: 'var(--accent)',
                    marginLeft: 6,
                    verticalAlign: -2,
                  }}
                />
              </div>
            </div>
          </Frame>

          <Frame title="~/.config/mcp.json">
            <pre style={{ margin: 0, padding: '16px 18px', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.75, color: 'var(--text-2)', overflow: 'auto' }}>
              {'{'}
              {'\n'}
              {'  '}
              <span style={{ color: 'var(--accent-2)' }}>&quot;mcpServers&quot;</span>: {'{'}
              {'\n'}
              {'    '}
              <span style={{ color: 'var(--accent-2)' }}>&quot;drop&quot;</span>: {'{'}
              {'\n'}
              {'      '}
              <span style={{ color: 'var(--accent-2)' }}>&quot;url&quot;</span>:{' '}
              <span style={{ color: 'var(--ok)' }}>&quot;https://your-host/api/v1/mcp&quot;</span>,{'\n'}
              {'      '}
              <span style={{ color: 'var(--accent-2)' }}>&quot;headers&quot;</span>: {'{ '}
              <span style={{ color: 'var(--accent-2)' }}>&quot;Authorization&quot;</span>:{' '}
              <span style={{ color: 'var(--ok)' }}>&quot;Bearer drop_&lt;your-api-key&gt;&quot;</span>
              {' }'}
              {'\n'}
              {'    '}
              {'}'}
              {'\n'}
              {'  '}
              {'}'}
              {'\n'}
              {'}'}
            </pre>
          </Frame>
        </div>
      </div>
    </section>
  );
}

/**
 * The closer keeps "Drop a folder. Get a URL." It is the sharpest line the
 * project has, but it describes a file operation rather than a result, so it
 * lands here — where the reader already has the context to decode it — rather
 * than in the hero, where it has to introduce the product cold.
 */
function FinalCta(): JSX.Element {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 28px 88px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          borderRadius: 22,
          background: 'var(--bg-2)',
          boxShadow: 'var(--elev)',
          textAlign: 'center',
          padding: '76px 28px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(55% 80% at 50% 0%,color-mix(in srgb,var(--accent) 22%,transparent),transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <span
            style={{
              display: 'inline-block',
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
              borderRadius: '50% 50% 50% 4px',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 30px var(--accent)',
              marginBottom: 28,
            }}
          />
          <h2 style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 42, letterSpacing: -1.5, marginBottom: 16 }}>
            Drop a folder. Get a URL.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 30px', lineHeight: 1.6 }}>
            Ask for access to the hosted platform, or put DROP on your own server in an afternoon.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={REQUEST_ACCESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...primaryBtnStyle, padding: '14px 26px' }}
            >
              Request access
            </a>
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dl-hover-border"
              style={{ ...secondaryBtnStyle, padding: '14px 26px' }}
            >
              Download the latest release
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingSections({ onEnter }: LandingSectionsProps): JSX.Element {
  return (
    <>
      <HeroSection onEnter={onEnter} />
      <HowItWorks />
      <WhatYouGet />
      <WhoItsFor />
      <AssistantSection />
      <DashboardPreview onEnter={onEnter} />
      <TwoWaysToRun onEnter={onEnter} />
      <TechnicalSection />
      <FinalCta />
    </>
  );
}
