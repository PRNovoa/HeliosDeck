import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes.js";

const SIGNAL_LINKS = [
  {
    to: ROUTES.ISS,
    label: "ISS POSITION",
    icon: "🛰",
    desc: "Live station coordinates",
  },
  {
    to: ROUTES.KP_INDEX,
    label: "KP INDEX",
    icon: "🌐",
    desc: "Geomagnetic activity",
  },
  {
    to: ROUTES.SOLAR_FLARES,
    label: "SOLAR FLARES",
    icon: "☀",
    desc: "X-ray event classification",
  },
  {
    to: ROUTES.CME,
    label: "CME EVENTS",
    icon: "💥",
    desc: "Coronal mass ejections",
  },
  {
    to: ROUTES.SOLAR_WIND,
    label: "SOLAR WIND",
    icon: "〰",
    desc: "Speed & density",
  },
  { to: ROUTES.AURORA, label: "AURORA", icon: "🌌", desc: "Oval probability" },
  {
    to: ROUTES.SOLAR_RADIATION,
    label: "RADIATION",
    icon: "⚡",
    desc: "Solar radiation flux",
  },
];

export function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Hero */}
      <section
        className="flex flex-col items-center gap-4 text-center"
        aria-labelledby="hero-title"
      >
        <h1
          id="hero-title"
          className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]"
        >
          <span
            aria-hidden="true"
            className="text-[var(--color-accent-orange)]"
          >
            ☀
          </span>{" "}
          HELIOS DECK
        </h1>
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-accent-orange)] font-[var(--font-mono)]">
          8-BIT COSMIC GEOPHYSICAL OBSERVATORY
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-md leading-relaxed">
          Real-time data from NASA, NOAA and ISS APIs. Monitor space weather
          from your browser.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="mt-2 text-xs font-bold tracking-widest uppercase px-6 py-2.5 bg-[var(--color-accent-orange)] text-white rounded hover:opacity-90 transition-opacity font-[var(--font-mono)]"
        >
          ▶ OPEN DASHBOARD
        </Link>
      </section>

      {/* Signal grid */}
      <section aria-labelledby="signals-title">
        <h2
          id="signals-title"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-4 font-[var(--font-mono)]"
        >
          AVAILABLE SIGNALS
        </h2>
        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          role="list"
        >
          {SIGNAL_LINKS.map(({ to, label, icon, desc }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col gap-1 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent-orange)] hover:shadow-[var(--shadow-glow-gold)] transition-all group"
              >
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>
                <span className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-orange)] transition-colors font-[var(--font-mono)]">
                  {label}
                </span>
                <span className="text-[0.6rem] text-[var(--color-text-muted)]">
                  {desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
