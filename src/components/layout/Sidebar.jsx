import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  BarChart2,
  Bell,
  Database,
  Archive,
  Settings,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROUTES } from "@/app/routes.js";

const NAV_ITEMS = [
  {
    to: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  { to: ROUTES.SIGNALS, icon: Radio, label: "Signals" },
  { to: null, icon: BarChart2, label: "Analysis", disabled: true },
  { to: null, icon: Bell, label: "Alerts", disabled: true },
  { to: null, icon: Database, label: "Sources", disabled: true },
  { to: null, icon: Archive, label: "Archive", disabled: true },
  { to: null, icon: Settings, label: "Settings", disabled: true },
  { separator: true },
  { to: ROUTES.ABOUT, icon: Info, label: "About" },
];

const navLinkClasses =
  "relative isolate flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sticky top-0 z-[var(--z-overlay)] hidden h-screen w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] md:flex">
      <div className="border-b border-[var(--color-border)] px-4 pb-5 pt-6">
        <span className="mb-1 block text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          OBSERVATORY
        </span>
        <h2 className="text-xl font-bold leading-[1.1] text-[var(--color-text-primary)]">
          HELIOS OPS
        </h2>
        <span className="mt-1 block font-mono text-xs text-[var(--color-text-muted)]">
          DECK-01
        </span>

        {user && (
          <div className="mt-4">
            <span className="mb-2 block text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              OPERATOR
            </span>
            <div className="flex items-center gap-2">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 shrink-0 rounded-full border border-[var(--color-border-strong)] object-cover"
                width={32}
                height={32}
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {user.firstName[0]}. {user.lastName}
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
        <ul className="flex list-none flex-col gap-0.5" role="list">
          {NAV_ITEMS.map((item, i) => {
            if (item.separator) {
              return (
                <li
                  key={`sep-${i}`}
                  className="my-2 h-px bg-[var(--color-border)]"
                  role="separator"
                />
              );
            }

            const { to, icon: Icon, label, end, disabled } = item;

            if (disabled) {
              return (
                <li key={label}>
                  <span
                    className={`${navLinkClasses} pointer-events-none cursor-default opacity-[0.35]`}
                  >
                    <Icon
                      size={16}
                      className="relative z-[1] shrink-0 transition-colors duration-150"
                      aria-hidden="true"
                    />
                    <span className="relative z-[1]">{label}</span>
                  </span>
                </li>
              );
            }

            return (
              <li key={label}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${navLinkClasses} ${
                      isActive
                        ? "!text-[var(--color-accent-amber)] bg-[var(--color-accent-orange-dim)]"
                        : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 -z-[1] rounded-md bg-[var(--color-accent-orange-dim)]"
                          layoutId="sidebar-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon
                        size={16}
                        className={`relative z-[1] shrink-0 transition-colors duration-150 ${
                          isActive ? "text-[var(--color-accent-amber)]" : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span className="relative z-[1]">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
