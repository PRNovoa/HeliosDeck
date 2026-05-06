# Vercel Readiness Audit Plan

## Summary

Run a local-only deployment readiness audit for HELIOS DECK before uploading to
Vercel. The audit verifies that the app builds cleanly, routes work with Vercel
SPA rewrites, environment variables are documented, live API behavior is safe,
and no local-only assumptions will break production.

The deliverable is a concise readiness report with pass/fail findings and a
prioritized fix plan. No deploy is performed during this audit.

## Audit Checks

Build and tooling:

- Run `npm run build`, `npm run lint`, and `npm run test`.
- Confirm Vite output goes to `dist`.
- Confirm build warnings are either non-blocking or documented.

Vercel configuration:

- Verify `vercel.json` rewrites all paths to `/index.html`.
- Confirm Vercel settings should be: Framework `Vite`, Build `npm run build`,
  Output `dist`.
- Confirm `.gitignore` excludes `node_modules`, `dist`, and `*.local`.

Routing and auth:

- Inspect `createBrowserRouter` routes and ensure `/`, `/dashboard`, `/login`,
  `/signals`, and signal detail routes are covered.
- Confirm protected routes redirect correctly after refresh.
- Confirm no route depends on dev-server-only paths.

Environment and secrets:

- Identify every `import.meta.env` usage.
- Confirm `VITE_NASA_API_KEY` is optional but recommended for DONKI.
- Confirm `.env.local` is ignored and no key is committed.
- Confirm README/docs explain that Vite env vars are public.

API readiness:

- Confirm UI/pages/widgets do not call `fetch` directly.
- Confirm all live widgets use React Query hooks.
- Confirm production clients use direct provider URLs, while Vite proxies are
  dev-only.
- Verify current endpoint health locally for ISS, NOAA, and NASA with local key
  if present.
- Confirm API failures render contained widget-level error states with retry and
  useful hints.

Dashboard persistence:

- Confirm auth/session and widget layout persistence use `localStorage` safely.
- Confirm dashboard config versioning handles old layouts without crashing.

Content and docs:

- Check README, `docs/apis.md`, and `docs/project-status.md` match current signal
  names and statuses.
- Confirm demo login credentials are documented.
- Confirm pending/external constraints are described as provider/key/CORS
  realities, not broken implementation.

## Report Format

The audit report should include:

- Overall status: `READY`, `READY WITH WARNINGS`, or `BLOCKED`.
- Pass/fail table grouped by Build, Vercel config, Routing, Env, APIs, UI
  failure states, Docs.
- Provider/API observations, including any rate-limit or CORS risk.
- Prioritized fix plan:
  - `P0` must-fix before Vercel.
  - `P1` strongly recommended.
  - `P2` optional polish.
- Exact verification commands run and their result.

## Test Plan

Run these locally:

```bash
npm run build
npm run lint
npm run test
```

Optional local preview check:

```bash
npm run preview
```

Manual smoke targets for local preview:

- `/login`
- `/`
- `/dashboard`
- `/signals`
- `/signals/iss`
- `/signals/kp-index`
- `/signals/solar-flares`
- `/signals/solar-wind`
- `/signals/cme`
- `/signals/aurora`
- `/signals/solar-radiation`
- `/about`

## Assumptions

- Audit is local-only; no Vercel deploy or preview URL smoke test.
- The audit may run build/lint/test and endpoint health checks.
- Final output is a report plus fix plan.
- The project remains JavaScript-only, Vite, React Router, React Query,
  Tailwind, and current architecture.
