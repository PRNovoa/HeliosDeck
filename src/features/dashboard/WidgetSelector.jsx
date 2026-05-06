import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useDashboard } from "@/context/useDashboard.js";
import { WIDGET_REGISTRY } from "@/lib/constants.js";

export function WidgetSelector() {
  const { config, toggleWidget, resetConfig, storageKey } = useDashboard();
  const widgets = Object.values(WIDGET_REGISTRY);

  return (
    <motion.aside
      className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] p-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl"
      aria-label="Widget configuration panel"
      initial={{ opacity: 0, y: -12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
            Widget bay
          </h2>
          <p className="mt-1 text-[0.65rem] text-[var(--color-text-muted)]">
            Saved as JSON for this DummyJSON operator: {storageKey.split(":").at(-1)}
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-inner)] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-orange)] hover:text-[var(--color-accent-orange)]"
          onClick={resetConfig}
          aria-label="Reset dashboard to default configuration"
        >
          <RotateCcw size={13} />
          Full reset
        </button>
      </div>

      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-4" role="list">
        {widgets.map((meta) => {
          const isEnabled = config.widgets[meta.id]?.enabled ?? false;

          return (
            <li key={meta.id}>
              <label
                className={[
                  "group flex h-full cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all",
                  isEnabled
                    ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan-dim)]"
                    : "border-[var(--surface-border)] bg-[var(--surface-inner)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-glass-strong)]",
                ].join(" ")}
                htmlFor={`widget-${meta.id}`}
              >
                <input
                  id={`widget-${meta.id}`}
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--color-accent-cyan)]"
                  checked={isEnabled}
                  onChange={() => toggleWidget(meta.id)}
                  aria-label={`Toggle ${meta.label} widget`}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    {meta.label}
                  </span>
                  <span className="mt-1 text-[0.68rem] leading-4 text-[var(--color-text-muted)]">
                    {meta.description}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </motion.aside>
  );
}
