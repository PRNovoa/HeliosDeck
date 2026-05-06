import { Database } from "lucide-react";
import { SIGNAL_REGISTRY } from "@/lib/signalRegistry.js";

const panel =
  "rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] p-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl";

const statusColor = {
  LIVE: "var(--color-accent-green)",
  PENDING: "var(--color-accent-amber)",
  MOCK: "var(--color-text-muted)",
};

export function SourcesPage() {
  const live = SIGNAL_REGISTRY.filter((signal) => signal.implemented).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header className={panel}>
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-cyan)]">
          <Database size={14} />
          Source Registry
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text-primary)]">
          Public API sources
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          {live} implemented feeds, all routed through API clients, normalizers,
          and React Query before the interface renders them.
        </p>
      </header>

      <section className={panel} aria-label="Source table">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--surface-border)] text-[0.58rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                <th className="px-3 py-3">Signal</th>
                <th className="px-3 py-3">Provider</th>
                <th className="px-3 py-3">Endpoint</th>
                <th className="px-3 py-3">Auth</th>
                <th className="px-3 py-3">CORS</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {SIGNAL_REGISTRY.map((signal) => (
                <tr
                  key={signal.id}
                  className="border-b border-[var(--surface-border)] text-[var(--color-text-secondary)]"
                >
                  <td className="px-3 py-3 font-semibold text-[var(--color-text-primary)]">
                    {signal.label}
                  </td>
                  <td className="px-3 py-3">{signal.sourceLabel}</td>
                  <td className="max-w-[22rem] truncate px-3 py-3 font-mono text-[0.68rem]">
                    {signal.apiEndpoint}
                  </td>
                  <td className="px-3 py-3">{signal.requiresKey ? "NASA key" : "None"}</td>
                  <td className="px-3 py-3">{signal.corsStatus}</td>
                  <td className="px-3 py-3">
                    <span style={{ color: statusColor[signal.status] }}>
                      {signal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
