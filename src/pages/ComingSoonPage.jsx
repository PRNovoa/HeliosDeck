import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState.jsx";
import { getSignalMeta } from "@/lib/signalRegistry.js";

export function ComingSoonPage({ signalId, signal }) {
  const meta = signalId ? getSignalMeta(signalId) : null;
  const label = meta?.label ?? signal ?? "This signal";

  return (
    <article className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-xl font-bold tracking-widest uppercase text-[var(--color-text-primary)]">
          {label.toUpperCase()}
        </h1>
        {meta && (
          <div className="flex flex-wrap gap-2">
            <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-border)] rounded font-[var(--font-mono)] text-[var(--color-text-muted)]">
              {meta.topic}
            </span>
            <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-border)] rounded font-[var(--font-mono)] text-[var(--color-text-muted)]">
              {meta.sourceLabel}
            </span>
            {meta.requiresKey && (
              <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-accent-amber)] rounded font-[var(--font-mono)] text-[var(--color-accent-amber)]">
                REQUIRES API KEY
              </span>
            )}
          </div>
        )}
        <p className="text-sm text-[var(--color-text-muted)]">
          This signal page is under construction.
        </p>
      </header>

      <EmptyState message="COMING SOON — check back later" icon="🚧" />

      {meta && (
        <section className="flex flex-col gap-3" aria-label="Signal details">
          {meta.pendingReason && (
            <div className="flex flex-col gap-1 p-3 border border-[var(--color-border)] rounded-lg">
              <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
                WHY PENDING
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {meta.pendingReason}
              </p>
            </div>
          )}
          {meta.nextStep && (
            <div className="flex flex-col gap-1 p-3 border border-[var(--color-border)] rounded-lg">
              <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
                NEXT STEP
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {meta.nextStep}
              </p>
            </div>
          )}
          {meta.apiEndpoint && (
            <div className="flex flex-col gap-1 p-3 border border-[var(--color-border)] rounded-lg">
              <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
                API ENDPOINT
              </span>
              <a
                href={meta.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-[var(--font-mono)] text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-orange)] transition-colors break-all"
              >
                {meta.apiEndpoint}
              </a>
            </div>
          )}
          {meta.relatedSignals?.length > 0 && (
            <div className="flex flex-col gap-2 p-3 border border-[var(--color-border)] rounded-lg">
              <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
                RELATED SIGNALS
              </span>
              <div className="flex flex-wrap gap-2">
                {meta.relatedSignals.map((id) => {
                  const rel = getSignalMeta(id);
                  if (!rel) return null;
                  return (
                    <Link
                      key={id}
                      to={rel.route}
                      className="text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 border border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] rounded hover:bg-[var(--color-accent-blue-dim)] transition-colors font-[var(--font-mono)]"
                    >
                      {rel.icon} {rel.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
