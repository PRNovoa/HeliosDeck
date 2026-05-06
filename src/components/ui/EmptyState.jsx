export function EmptyState({ message = "No data available", icon = "○" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-2xl opacity-40" aria-hidden="true">
        {icon}
      </span>
      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
        {message}
      </p>
    </div>
  );
}
