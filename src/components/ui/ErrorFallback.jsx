export function ErrorFallback({ error, onRetry, signal }) {
  const message = getErrorMessage(error);
  const hint = getFailureHint(message);

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-lg border border-[var(--color-accent-red)] bg-[var(--color-accent-red-dim)] p-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <span
        className="animate-blink text-xl text-[var(--color-accent-red)]"
        aria-hidden="true"
      >
        !
      </span>
      <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-accent-red)]">
        {signal ? `${signal.toUpperCase()} SIGNAL LOST` : "DATA UNAVAILABLE"}
      </p>
      <p className="text-xs text-[var(--color-text-secondary)]">{message}</p>
      {hint && (
        <p className="max-w-xs text-xs leading-5 text-[var(--color-text-muted)]">
          {hint}
        </p>
      )}
      {onRetry && (
        <button
          className="mt-1 rounded border border-[var(--color-accent-red)] bg-transparent px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-red)] transition-colors hover:bg-[var(--color-accent-red-dim)]"
          onClick={onRetry}
        >
          RETRY
        </button>
      )}
    </div>
  );
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "The upstream data provider did not return a usable response.";
}

function getFailureHint(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("429") || normalized.includes("over_rate_limit")) {
    return "The provider rate limit was reached. For NASA DONKI, set VITE_NASA_API_KEY in Vercel and retry after the quota resets.";
  }

  if (
    normalized.includes("401") ||
    normalized.includes("403") ||
    normalized.includes("api_key") ||
    normalized.includes("api key")
  ) {
    return "The provider rejected the request. Check the API key and Vercel environment variables.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("cors")
  ) {
    return "The browser could not reach the provider. Check network access, CORS, or the production endpoint.";
  }

  if (normalized.includes("500") || normalized.includes("503")) {
    return "The upstream provider appears temporarily unavailable. Retry in a moment.";
  }

  return "The dashboard kept the failure contained to this widget so the rest of HELIOS DECK can continue loading.";
}
