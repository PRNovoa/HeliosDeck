import { Activity, ArrowRight, Radio } from "lucide-react";
import { useKpIndex } from "@/hooks/useKpIndex.js";
import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { useSolarWind } from "@/hooks/useSolarWind.js";
import { useSolarRadioFlux } from "@/hooks/useSolarRadioFlux.js";
import { formatNumber, formatRelativeTime } from "@/lib/formatters.js";

const panel =
  "rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] p-4 shadow-[var(--surface-shadow)] backdrop-blur-2xl";

export function AnalysisPage() {
  const { data: kpData } = useKpIndex();
  const { data: flareData } = useSolarFlares(7);
  const { data: windData } = useSolarWind();
  const { data: radioFluxData } = useSolarRadioFlux();

  const latestWind = windData?.at(-1);
  const latestFlux = radioFluxData?.at(-1);
  const strongestFlare = flareData?.[0];
  const kp = kpData?.value?.kp;
  const windSpeed = latestWind?.value?.speed_km_s;
  const flux = latestFlux?.value?.flux_sfu;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header className={panel}>
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-cyan)]">
          <Activity size={14} />
          Signal Analysis
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text-primary)]">
          Correlation board
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
          A front-end analysis view that reads normalized signals from React Query
          and explains how the public feeds relate to each other.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-4" aria-label="Signal snapshot">
        <Metric label="Kp Index" value={formatNumber(kp, 1)} note={kpData?.value?.level ?? "waiting"} />
        <Metric label="Solar Wind" value={formatNumber(windSpeed, 0)} note="km/s" />
        <Metric label="F10.7 Flux" value={formatNumber(flux, 0)} note="sfu" />
        <Metric
          label="Top Flare"
          value={strongestFlare?.value?.classType ?? "N/A"}
          note={strongestFlare?.timestamp ? formatRelativeTime(strongestFlare.timestamp) : "waiting"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Analysis relationships">
        <Relationship
          title="Solar driver"
          left="F10.7 flux"
          right="Solar flares"
          body="F10.7 radio flux is a slow-moving solar activity proxy. Flares are shorter explosive events, so the two should be read together rather than treated as duplicates."
        />
        <Relationship
          title="Magnetosphere response"
          left="Solar wind"
          right="Kp index"
          body="Fast solar wind and dense plasma can precede elevated geomagnetic activity. Kp is the global ground-based response signal."
        />
        <Relationship
          title="Operational layer"
          left="NOAA alerts"
          right="Dashboard state"
          body="NOAA watches and warnings are human-readable operational summaries. The dashboard uses them as high-confidence context for alert level."
        />
      </section>
    </div>
  );
}

function Metric({ label, value, note }) {
  return (
    <div className={panel}>
      <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-3 font-mono text-3xl font-semibold text-[var(--color-text-primary)]">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
        {note}
      </p>
    </div>
  );
}

function Relationship({ title, left, right, body }) {
  return (
    <article className={panel}>
      <div className="mb-3 flex items-center gap-2 text-[var(--color-accent-cyan)]">
        <Radio size={16} />
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">{title}</h2>
      </div>
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
        <span>{left}</span>
        <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
        <span>{right}</span>
      </div>
      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{body}</p>
    </article>
  );
}
