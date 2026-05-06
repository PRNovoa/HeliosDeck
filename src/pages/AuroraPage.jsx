import { AuroraWidget } from "@/components/widgets/AuroraWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useAurora } from "@/hooks/useAurora.js";
import { SIGNAL } from "@/lib/constants.js";

export function AuroraPage() {
  const { data } = useAurora();

  return (
    <SignalPageLayout
      title="AURORA OVAL"
      description="NOAA Ovation aurora model summarized into peak probability, hemispheric maxima, and active grid counts for a compact dashboard view."
      sourceLabel="NOAA SWPC"
      sourceUrl="https://www.swpc.noaa.gov"
      status="LIVE"
      cadenceSeconds={300}
      relatedSignals={[SIGNAL.KP_INDEX, SIGNAL.SOLAR_WIND_SPEED]}
    >
      <section aria-label="Aurora probability data">
        <AuroraWidget />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNAL - AURORAL_OVAL_PROBABILITY" />
    </SignalPageLayout>
  );
}
