export function PixelCard({
  title,
  accent,
  className = "",
  children,
  ...rest
}) {
  return (
    <article
      className={[
        "bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden",
        className,
      ].join(" ")}
      style={accent ? { borderLeftColor: accent, borderLeftWidth: "3px" } : {}}
      {...rest}
    >
      {title && (
        <header className="px-4 py-3 border-b border-[var(--color-border)]">
          <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-secondary)]">
            {title}
          </h3>
        </header>
      )}
      <div className="p-4">{children}</div>
    </article>
  );
}
