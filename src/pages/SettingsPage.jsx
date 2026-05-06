import { Moon, RotateCcw, Settings, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useDashboard } from "@/context/useDashboard.js";
import { useTheme } from "@/hooks/useTheme.js";

const panel =
  "rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] p-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl";

export function SettingsPage() {
  const { user } = useAuth();
  const { storageKey, resetConfig, resetLayout, getSortedWidgets } = useDashboard();
  const { isDark, toggleTheme } = useTheme();
  const enabledWidgets = getSortedWidgets(true).length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <header className={panel}>
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-cyan)]">
          <Settings size={14} />
          Settings
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text-primary)]">
          Operator controls
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          Local front-end preferences for the authenticated DummyJSON operator.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className={panel}>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
            Appearance
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Current mode: {isDark ? "Dark" : "Light"}
          </p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)]"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            Toggle theme
          </button>
        </article>

        <article className={panel}>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
            Dashboard JSON
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {enabledWidgets} widgets enabled. Config is stored at:
          </p>
          <p className="mt-2 break-all rounded-xl border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3 font-mono text-[0.68rem] text-[var(--color-text-muted)]">
            {storageKey}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]"
              onClick={resetLayout}
            >
              <RotateCcw size={15} />
              Reset layout
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
              onClick={resetConfig}
            >
              <RotateCcw size={15} />
              Full reset
            </button>
          </div>
        </article>
      </section>

      <section className={panel}>
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-primary)]">
          Operator
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <Info label="User" value={user?.username ?? "guest"} />
          <Info label="Name" value={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Unknown"} />
          <Info label="Session" value="DummyJSON token" />
        </dl>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3">
      <dt className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-[var(--color-text-primary)]">{value}</dd>
    </div>
  );
}
