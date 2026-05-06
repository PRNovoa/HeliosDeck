import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  BarChart2,
  Bell,
  Database,
  Info,
  LayoutDashboard,
  LogOut,
  Radio,
  Settings,
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
  { to: ROUTES.ABOUT, icon: Info, label: "About" },
];

const panelVariants = {
  closed: {
    opacity: 0,
    x: -18,
    y: -12,
    scale: 0.96,
    filter: "blur(8px)",
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -8 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.04 + i * 0.025, duration: 0.16, ease: "easeOut" },
  }),
};

export function HudPanel({ open, onClose }) {
  const { user, logout } = useAuth();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    const id = setTimeout(() => {
      document.addEventListener("pointerdown", onPointer);
    }, 80);
    return () => {
      clearTimeout(id);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onClose]);

  const operatorName = user
    ? `${user.lastName?.toUpperCase()}, ${user.firstName?.[0]?.toUpperCase()}.`
    : "UNASSIGNED";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="hud-panel"
          ref={panelRef}
          className="fixed left-5 top-[5.75rem] z-[calc(var(--z-overlay)-1)] w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface-glass-strong)] p-3 shadow-[var(--surface-shadow-strong)] backdrop-blur-2xl"
          variants={panelVariants}
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="false"
          aria-label="Navigation panel"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(var(--stellar-line-rgb),0.14),transparent_36%),radial-gradient(circle_at_100%_22%,rgba(var(--stellar-node-rgb),0.12),transparent_34%)]" />

          <div className="relative rounded-[1.35rem] border border-[var(--surface-border)] bg-[var(--surface-inner)] p-4">
            <div className="mb-4 flex items-center gap-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={operatorName}
                  className="h-12 w-12 rounded-2xl border border-[var(--color-accent-cyan)] object-cover shadow-[0_0_24px_rgba(125,231,255,0.18)]"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-2xl border border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan-dim)]" />
              )}
              <div className="min-w-0">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-cyan)]">
                  Operator
                </p>
                <p className="truncate text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  {operatorName}
                </p>
              </div>
            </div>

            <nav aria-label="Main navigation">
              <ul className="grid grid-cols-2 gap-2" role="list">
                {NAV_ITEMS.map((item, i) => {
                  const { to, icon: Icon, label, end, disabled } = item;

                  if (disabled) {
                    return (
                      <motion.li
                        key={label}
                        custom={i}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <span className="flex min-h-20 flex-col justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-inner)] p-3 text-[var(--color-text-muted)] opacity-45">
                          <Icon size={18} aria-hidden="true" />
                          <span className="text-[0.62rem] font-bold uppercase tracking-wider">
                            {label}
                          </span>
                        </span>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li
                      key={label}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          [
                            "group flex min-h-20 flex-col justify-between rounded-2xl border p-3 transition-all duration-200",
                            isActive
                              ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-dim)] text-[var(--color-accent-orange)] shadow-[0_0_24px_rgba(255,157,92,0.14)]"
                              : "border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan-dim)] hover:text-[var(--color-accent-cyan)]",
                          ].join(" ")
                        }
                        onClick={onClose}
                      >
                        <Icon size={19} aria-hidden="true" />
                        <span className="text-[0.62rem] font-bold uppercase tracking-wider">
                          {label}
                        </span>
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-4 flex items-center gap-3 border-t border-[var(--surface-border)] pt-4">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[var(--color-accent-green)] shadow-[0_0_12px_var(--color-accent-green)]" />
              <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[var(--color-accent-green)]">
                System nominal
              </span>

              {user && (
                <button
                  className="ml-auto flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-wider text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
