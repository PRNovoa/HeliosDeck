import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes.js";

export function NotFoundPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4"
      role="main"
    >
      <span
        className="text-6xl font-bold text-[var(--color-border)] animate-glitch font-[var(--font-mono)]"
        aria-hidden="true"
      >
        404
      </span>
      <h1 className="text-lg font-bold tracking-widest uppercase text-[var(--color-text-primary)]">
        SIGNAL NOT FOUND
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
        The coordinates you entered do not exist in this observatory.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-2 text-xs font-bold tracking-widest uppercase px-4 py-2 border border-[var(--color-accent-orange)] text-[var(--color-accent-orange)] rounded hover:bg-[var(--color-accent-orange-dim)] transition-colors font-[var(--font-mono)]"
      >
        ← RETURN TO BASE
      </Link>
    </div>
  );
}
