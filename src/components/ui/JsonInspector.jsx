export function JsonInspector({ data, label = "RAW SIGNAL DATA" }) {
  return (
    <details className="border border-[var(--color-border)] rounded-md overflow-hidden text-xs font-[var(--font-mono)]">
      <summary className="px-3 py-2 cursor-pointer select-none font-semibold tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors list-none">
        <span aria-hidden="true">{"{ }"}</span> {label}
      </summary>
      <pre className="p-3 text-[0.7rem] leading-relaxed text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] overflow-auto max-h-64">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
