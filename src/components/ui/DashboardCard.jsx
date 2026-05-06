import { motion } from "framer-motion";
import { MoreHorizontal, Maximize2 } from "lucide-react";

const cardClasses =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-[linear-gradient(145deg,var(--surface-glass-strong),var(--surface-glass)_48%,rgba(255,255,255,0.12))] shadow-[var(--surface-shadow),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl transition-[border-color,box-shadow,transform] duration-300 hover:border-[var(--surface-border-strong)] hover:shadow-[var(--surface-shadow-strong),0_0_44px_color-mix(in_srgb,var(--card-accent-color)_18%,transparent)]";

const cornerClasses =
  "pointer-events-none absolute z-[1] h-2.5 w-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100";

/**
 * DashboardCard - tech-styled card for dashboard widgets.
 * The drag handle keeps the global "dragHandle" class so react-grid-layout can find it.
 */
export function DashboardCard({
  title,
  accent,
  headerRight,
  children,
  className = "",
}) {
  return (
    <motion.div
      className={[cardClasses, className].join(" ")}
      style={{ "--card-accent-color": accent ?? "var(--color-accent-orange)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--card-accent-color)] to-transparent opacity-80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[var(--card-accent-color)] opacity-[0.08] blur-3xl transition-opacity duration-300 group-hover:opacity-[0.14]"
        aria-hidden="true"
      />
      <span
        className={`${cornerClasses} left-1 top-1 border-l-[1.5px] border-t-[1.5px] border-l-[var(--card-accent-color)] border-t-[var(--card-accent-color)]`}
        aria-hidden="true"
      />
      <span
        className={`${cornerClasses} bottom-1 right-1 border-b-[1.5px] border-r-[1.5px] border-b-[var(--card-accent-color)] border-r-[var(--card-accent-color)]`}
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-0.5 w-0 animate-load-fill bg-[var(--card-accent-color)] opacity-70"
        aria-hidden="true"
      />

      <div className="relative flex shrink-0 items-center gap-2 border-b border-[var(--surface-border)] px-4 py-3">
        <span
          className="dragHandle shrink-0 cursor-grab select-none rounded-md border border-[var(--surface-border)] bg-[var(--surface-inner)] px-2 py-1 font-mono text-[0.65rem] leading-none text-[var(--color-text-muted)] opacity-70 transition-colors duration-150 hover:border-[var(--card-accent-color)] hover:text-[var(--card-accent-color)] hover:opacity-100 active:cursor-grabbing"
          aria-hidden="true"
        >
          MOVE
        </span>
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {headerRight && <div className="flex items-center">{headerRight}</div>}
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-muted)] transition-colors duration-150 hover:border-[var(--surface-border-strong)] hover:text-[var(--color-text-primary)]"
            aria-label="Widget options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto p-4">{children}</div>

      <button
        className="absolute bottom-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-[var(--surface-border)] bg-[var(--surface-inner)] text-[var(--color-text-muted)] opacity-0 transition-colors duration-150 hover:border-[var(--card-accent-color)] hover:text-[var(--card-accent-color)] group-hover:opacity-100"
        aria-label="Expand widget"
      >
        <Maximize2 size={11} />
      </button>
    </motion.div>
  );
}
