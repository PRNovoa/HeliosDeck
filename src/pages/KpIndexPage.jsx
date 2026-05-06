import { KpIndexWidget } from "@/components/widgets/KpIndexWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useKpIndex } from "@/hooks/useKpIndex.js";
import { SIGNAL } from "@/lib/constants.js";

export function KpIndexPage() {
  const { data } = useKpIndex();

  return (
    <SignalPageLayout
      title="KP INDEX"
      description="Planetary geomagnetic activity index ranging 0 (quiet) to 9 (extreme storm). Derived from ground-based magnetometer network readings. Updated every 3 minutes via NOAA SWPC."
      sourceLabel="NOAA SWPC"
      sourceUrl="https://www.swpc.noaa.gov"
      status="LIVE"
      cadenceSeconds={180}
      relatedSignals={[SIGNAL.SOLAR_FLARE_EVENTS, SIGNAL.AURORAL_OVAL_PROBABILITY]}
    >
      <section aria-label="Kp index live data">
        <KpIndexWidget />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNAL — KP_INDEX" />
    </SignalPageLayout>
  );
}
