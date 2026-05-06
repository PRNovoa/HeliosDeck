const SOURCES = [
  {
    name: "Where The ISS At",
    url: "https://wheretheiss.at",
    cors: "Free",
    key: "None",
    signal: "iss_coordinates",
    normalizer: "normalizeISS.js",
    hook: "useISSPosition.js",
  },
  {
    name: "NOAA SWPC",
    url: "https://www.swpc.noaa.gov",
    cors: "Verify prod",
    key: "None",
    signal: "kp_index, solar_wind, aurora, radiation",
    normalizer: "normalizeKpIndex.js",
    hook: "useKpIndex.js",
  },
  {
    name: "NASA DONKI",
    url: "https://api.nasa.gov",
    cors: "Vite proxy",
    key: "Free (DEMO_KEY)",
    signal: "solar_flares, cme",
    normalizer: "normalizeSolarFlare.js",
    hook: "useSolarFlares.js",
  },
];

const STACK = [
  ["React 19", "UI library — concurrent rendering, no legacy class components"],
  [
    "React Router v7",
    "createBrowserRouter, ProtectedRoute guard, SPA on Vercel",
  ],
  [
    "TanStack Query 5",
    "Server-state cache, staleTime/gcTime, refetch intervals",
  ],
  [
    "Recharts 3",
    "BarChart for solar flare severity, LineChart planned for radiation",
  ],
  ["Vite 8", "Bundler with @ alias and dev proxies for NASA/NOAA CORS bypass"],
  ["Tailwind CSS v4", "CSS-first utility system; tokens in @theme {}"],
  [
    "DummyJSON Auth",
    "Simulated auth API — no backend required, localStorage session",
  ],
];

const th =
  "text-left py-2 px-3 text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] border-b border-[var(--color-border)] font-[var(--font-mono)]";
const td =
  "py-2 px-3 text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]";
const mono = "font-[var(--font-mono)] text-[0.7rem]";

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="text-xl font-bold tracking-widest uppercase text-[var(--color-text-primary)]">
        ABOUT HELIOS DECK
      </h1>

      <section aria-labelledby="about-desc">
        <h2
          id="about-desc"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          WHAT IS THIS?
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          HELIOS DECK is an 8-bit styled cosmic observatory that aggregates,
          normalises, and visualises geophysical and heliophysical data from
          public APIs in real time. It serves as a software engineering
          portfolio project demonstrating modern front-end patterns applied to
          scientific data ingestion.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Built with React, React Router, TanStack Query, Recharts, and Tailwind
          CSS v4. No backend. No SSR. Everything runs in your browser.
        </p>
      </section>

      <section aria-labelledby="about-arch">
        <h2
          id="about-arch"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          ARCHITECTURE
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          Every signal follows a strict pipeline from raw API response to UI:
        </p>
        <pre className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[0.65rem] leading-relaxed text-[var(--color-text-secondary)] overflow-auto font-[var(--font-mono)]">{`
  Public API
      │  raw JSON
      ▼
  api client (services/api/)
      │  fetch + error throw
      ▼
  normalizer (services/normalizers/)
      │  NormalizedSignal shape
      ▼
  React Query hook (hooks/)
      │  cached, refetched, deduplicated
      ▼
  Widget / Chart component
      │  props from hook
      ▼
  Signal page (SignalPageLayout)
      │  layout + JsonInspector
      ▼
  User browser
`}</pre>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-3">
          The{" "}
          <code className="font-[var(--font-mono)] text-[0.7rem] px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-cyan)]">
            SignalRegistry
          </code>{" "}
          is the single source of truth for each signal&apos;s metadata (topic,
          cadence, source, status). Every page and the signal catalogue derive
          from it.
        </p>
      </section>

      <section aria-labelledby="about-contract">
        <h2
          id="about-contract"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          NORMALIZED SIGNAL CONTRACT
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          All normalizers output the same shape, making every signal
          interchangeable for display and alerting logic:
        </p>
        <pre className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[0.65rem] leading-relaxed text-[var(--color-text-secondary)] overflow-auto font-[var(--font-mono)]">{`{
  timestamp:  ISO 8601 string,
  source:     SOURCE constant (e.g. "wheretheiss.at"),
  signal:     SIGNAL constant (e.g. "iss_coordinates"),
  value:      object — signal-specific parsed fields,
  unit:       string — physical unit,
  confidence: number 0–1,
  metadata:   object — instrument, cadence, etc.,
  error:      null | string
}`}</pre>
      </section>

      <section aria-labelledby="about-rq">
        <h2
          id="about-rq"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          WHY REACT QUERY?
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Real-time geophysical data requires careful cache management. TanStack
          Query provides <strong>staleTime</strong> (data freshness window) and{" "}
          <strong>refetchInterval</strong> (polling cadence) independently per
          signal — the ISS widget polls every 5 seconds while solar flares
          refresh every 30 minutes. Multiple components showing the same signal
          share one cache entry with zero extra network requests. Devtools are
          included in dev mode only (tree-shaken in production).
        </p>
      </section>

      <section aria-labelledby="about-auth">
        <h2
          id="about-auth"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          AUTH &amp; DASHBOARD
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          Authentication is handled by the <strong>DummyJSON</strong> REST API
          (no backend required). A JWT access token is persisted to{" "}
          <code className="font-[var(--font-mono)] text-[0.7rem] px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-cyan)]">
            localStorage
          </code>{" "}
          under the key{" "}
          <code className="font-[var(--font-mono)] text-[0.7rem] px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-cyan)]">
            helios_auth
          </code>
          . All routes except{" "}
          <code className="font-[var(--font-mono)] text-[0.7rem] px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-cyan)]">
            /login
          </code>{" "}
          are wrapped in a{" "}
          <code className="font-[var(--font-mono)] text-[0.7rem] px-1 py-0.5 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-cyan)]">
            ProtectedRoute
          </code>{" "}
          React Router layout that redirects to login if no token is present.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Test credentials: <strong>emilys</strong> /{" "}
          <strong>emilyspass</strong>
        </p>
      </section>

      <section aria-labelledby="about-sources">
        <h2
          id="about-sources"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          DATA SOURCES
        </h2>
        <div className="overflow-x-auto">
          <table
            className="w-full text-xs border-collapse"
            aria-label="Data sources table"
          >
            <thead>
              <tr>
                {[
                  "Source",
                  "Signal(s)",
                  "CORS",
                  "API Key",
                  "Normalizer",
                  "Hook",
                ].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name}>
                  <td className={td}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-orange)] transition-colors"
                    >
                      {s.name}
                    </a>
                  </td>
                  <td className={`${td} ${mono}`}>{s.signal}</td>
                  <td className={td}>{s.cors}</td>
                  <td className={`${td} ${mono}`}>{s.key}</td>
                  <td className={`${td} ${mono}`}>{s.normalizer}</td>
                  <td className={`${td} ${mono}`}>{s.hook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="about-stack">
        <h2
          id="about-stack"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-orange)] mb-3 font-[var(--font-mono)]"
        >
          STACK
        </h2>
        <table
          className="w-full text-xs border-collapse"
          aria-label="Tech stack"
        >
          <thead>
            <tr>
              <th className={th}>Technology</th>
              <th className={th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {STACK.map(([tech, role]) => (
              <tr key={tech}>
                <td className={`${td} ${mono}`}>{tech}</td>
                <td className={td}>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
