export function ErrorFallback({ error, onRetry, signal }) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An unexpected error occurred";

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-lg border border-[var(--color-accent-red)] bg-[var(--color-accent-red-dim)] text-center"
      role="alert"
      aria-live="assertive"
    >
      <span
        className="text-xl text-[var(--color-accent-red)] animate-blink"
        aria-hidden="true"
      >
        ⚠
      </span>
      <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-red)]">
        {signal ? `${signal.toUpperCase()} SIGNAL LOST` : "DATA UNAVAILABLE"}
      </p>
      <p className="text-xs text-[var(--color-text-secondary)]">{message}</p>
      {onRetry && (
        <button
          className="mt-1 text-xs font-bold tracking-widest uppercase text-[var(--color-accent-red)] border border-[var(--color-accent-red)] rounded px-3 py-1 bg-transparent hover:bg-[var(--color-accent-red-dim)] transition-colors"
          onClick={onRetry}
        >
          ↻ RETRY
        </button>
      )}
    </div>
  );
}
