import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.js";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const NAV_LINKS = [
  { to: ROUTES.DASHBOARD, label: "DASHBOARD" },
  { to: ROUTES.SIGNALS, label: "SIGNALS" },
  { to: ROUTES.ANALYSIS, label: "ANALYSIS" },
  { to: ROUTES.ALERTS, label: "ALERTS" },
  { to: ROUTES.SOURCES, label: "SOURCES" },
  { to: ROUTES.ISS, label: "ISS" },
  { to: ROUTES.KP_INDEX, label: "KP INDEX" },
  { to: ROUTES.SETTINGS, label: "SETTINGS" },
  { to: ROUTES.ABOUT, label: "ABOUT" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <header
      className="sticky top-0 z-[var(--z-overlay)] bg-[var(--color-bg-card)] border-b border-[var(--color-border)]"
      role="banner"
    >
      <nav
        className="flex items-center gap-4 px-4 md:px-8 h-11"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <NavLink
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent-orange)] transition-colors"
          aria-label="HELIOS DECK home"
        >
          <span aria-hidden="true">☀</span>
          <span>HELIOS DECK</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 ml-4" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ROUTES.HOME}
                className={({ isActive }) =>
                  [
                    "text-[0.65rem] font-bold tracking-widest uppercase px-2 py-1 rounded transition-colors",
                    isActive
                      ? "text-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User + logout */}
        {user && (
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <span className="text-[0.65rem] font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
              {user.username}
            </span>
            <button
              className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] transition-colors"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="ml-auto md:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul
          id="mobile-menu"
          className="flex flex-col border-t border-[var(--color-border)] md:hidden"
          role="list"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === ROUTES.HOME}
                className={({ isActive }) =>
                  [
                    "block px-4 py-3 text-xs font-bold tracking-widest uppercase border-b border-[var(--color-border)] transition-colors",
                    isActive
                      ? "text-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                  ].join(" ")
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <button
                className="w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red-dim)] transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                LOGOUT ({user.username})
              </button>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
