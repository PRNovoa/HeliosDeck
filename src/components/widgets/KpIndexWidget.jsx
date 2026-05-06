import { useKpIndex } from "@/hooks/useKpIndex.js";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";
import { SkeletonBlock } from "@/components/ui/Skeleton.jsx";
import { ErrorFallback } from "@/components/ui/ErrorFallback.jsx";
import { SourceBadge } from "@/components/ui/SourceBadge.jsx";
import { LastUpdatedIndicator } from "@/components/ui/LastUpdatedIndicator.jsx";
import { kpColourVar, formatNumber } from "@/lib/formatters.js";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes.js";

const MAX_KP = 9;
const CX = 70;
const CY = 76;
const RADIUS = 52;
const SW = 8; // stroke-width
const START = 130; // degrees, "7 o'clock"
const SWEEP = 280; // arc span in degrees

/** Convert bearing-style angle (0 degrees = top) to SVG x,y. */
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** SVG arc path from startDeg sweeping clockwise by sweepDeg. */
function arcPath(cx, cy, r, startDeg, sweepDeg) {
  const endDeg = startDeg + sweepDeg;
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const SCALE_TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const KP_G_LABEL = { 5: "G1", 6: "G2", 7: "G3", 8: "G4", 9: "G5" };

/**
 * KpIndexWidget
 * -------------------------------------------------------
 * Kp Index with SVG radial gauge.
 */
export function KpIndexWidget() {
  const { data, isLoading, isError, error, isFetching, refetch } = useKpIndex();

  if (isLoading) {
    return (
      <DashboardCard title="KP INDEX">
        <SkeletonBlock lines={3} />
      </DashboardCard>
    );
  }

  if (isError || data?.error) {
    return (
      <DashboardCard title="KP INDEX">
        <ErrorFallback
          error={isError ? error : data.error}
          signal="Kp Index"
          onRetry={refetch}
        />
      </DashboardCard>
    );
  }

  const { value, timestamp, source } = data;
  const kp = value?.kp ?? 0;
  const level = value?.level ?? "QUIET";
  const kpColour = kpColourVar(kp);
  const fillSweep = Math.min(SWEEP, (kp / MAX_KP) * SWEEP);

  const levelLabel = KP_G_LABEL[Math.floor(kp)]
    ? `${KP_G_LABEL[Math.floor(kp)]} ${level}`
    : level;

  return (
    <DashboardCard
      title="KP INDEX"
      accent={kpColour}
      headerRight={
        <Link
          to={ROUTES.KP_INDEX}
          className="text-[0.5625rem] font-bold tracking-[0.1em] text-[var(--color-text-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-accent-amber)]"
        >
          DETAILS -&gt;
        </Link>
      }
    >
      <div
        className="flex flex-col items-center gap-1"
        aria-label={`Kp index: ${kp}, level: ${level}`}
      >
        <div className="relative flex h-[104px] w-[140px] items-end justify-center">
          <svg
            width="140"
            height="104"
            viewBox="0 0 140 104"
            className="block"
            aria-hidden="true"
          >
            <path
              d={arcPath(CX, CY, RADIUS, START, SWEEP)}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={SW}
              strokeLinecap="round"
            />

            {kp > 0 && (
              <path
                d={arcPath(CX, CY, RADIUS, START, fillSweep)}
                fill="none"
                stroke={kpColour}
                strokeWidth={SW}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${kpColour})` }}
              />
            )}

            {SCALE_TICKS.map((i) => {
              const deg = START + (i / MAX_KP) * SWEEP;
              const inner = polar(CX, CY, RADIUS - SW / 2 - 2, deg);
              const outer = polar(CX, CY, RADIUS + SW / 2 + 4, deg);
              return (
                <line
                  key={i}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth={1.5}
                />
              );
            })}
          </svg>

          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 flex-col items-center gap-px whitespace-nowrap text-center">
            <span
              className="font-mono text-[2.25rem] font-bold leading-none"
              style={{ color: kpColour }}
            >
              {formatNumber(kp, 1)}
            </span>
            <span
              className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em]"
              style={{ color: kpColour }}
            >
              {levelLabel.toUpperCase()}
            </span>
          </div>
        </div>

        <div
          className="flex w-[120px] justify-between px-1 font-mono text-[0.5625rem] text-[var(--color-text-muted)]"
          aria-hidden="true"
        >
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
        </div>
      </div>

      <footer className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <SourceBadge source={source} />
        <LastUpdatedIndicator timestamp={timestamp} isFetching={isFetching} />
      </footer>
    </DashboardCard>
  );
}
