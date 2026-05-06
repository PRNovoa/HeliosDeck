import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { ROUTES } from "@/app/routes.js";

function UtcClock() {
  const [time, setTime] = useState(() =>
    new Date().toISOString().substring(11, 19),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-sm tabular-nums text-[var(--color-text-primary)]">
      {time}
    </span>
  );
}

export function TopBar({
  onHudToggle,
  hudOpen,
  isDark,
  onThemeToggle,
  isHidden,
}) {
  return (
    <header
      className={[
        "fixed left-5 top-5 z-[var(--z-overlay)] flex items-center gap-3 transition-[opacity,transform] duration-300",
        isHidden ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100",
      ].join(" ")}
      role="banner"
    >
      <div className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-control)] p-1.5 shadow-[var(--surface-shadow)] backdrop-blur-2xl">
        <button
          className={[
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
            hudOpen
              ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)] text-[var(--color-accent-orange)] shadow-[0_0_28px_rgba(255,157,92,0.24)]"
              : "border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)]",
          ].join(" ")}
          onClick={onHudToggle}
          aria-expanded={hudOpen}
          aria-controls="hud-panel"
          aria-label={hudOpen ? "Close navigation" : "Open navigation"}
        >
          <span className="absolute inset-1 rounded-full border border-white/5" />
          <Menu size={20} />
        </button>

        <NavLink
          to={ROUTES.DASHBOARD}
          className="hidden pr-4 leading-none text-[var(--color-text-primary)] hover:text-[var(--color-accent-orange)] sm:flex sm:flex-col"
          aria-label="HELIOS DECK home"
        >
          <span className="text-sm font-bold uppercase tracking-[0.26em]">
            Helios
          </span>
          <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
            Stellar Map
          </span>
        </NavLink>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-control)] px-4 py-3 shadow-[var(--surface-shadow)] backdrop-blur-2xl md:flex">
        <span
          className="h-2 w-2 animate-pulse-dot rounded-full bg-[var(--color-accent-green)] shadow-[0_0_14px_var(--color-accent-green)]"
          aria-hidden="true"
        />
        <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          UTC
        </span>
        <UtcClock />
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-control)] p-1.5 shadow-[var(--surface-shadow)] backdrop-blur-2xl sm:flex">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]"
          onClick={onThemeToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <NavLink
          to={ROUTES.ALERTS}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)]"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </NavLink>
      </div>
    </header>
  );
}
