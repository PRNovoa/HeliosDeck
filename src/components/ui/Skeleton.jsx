/**
 * Skeleton — Animated placeholder for loading states.
 */
export function Skeleton({ width = "100%", height = "1rem", className = "" }) {
  return (
    <span
      className={[
        "block rounded animate-pulse bg-[var(--color-border-strong)]",
        className,
      ].join(" ")}
      style={{ width, height, display: "block" }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

export function SkeletonBlock({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading…">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height="0.75rem"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}
