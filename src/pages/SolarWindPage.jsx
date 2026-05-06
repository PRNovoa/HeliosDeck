import { SolarWindWidget } from "@/components/widgets/SolarWindWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useSolarWind } from "@/hooks/useSolarWind.js";
import { SIGNAL } from "@/lib/constants.js";

export function SolarWindPage() {
  const { data } = useSolarWind();

  return (
    <SignalPageLayout
      title="SOLAR WIND"
      description="NOAA SWPC solar plasma samples from DSCOVR/ACE, normalized into speed, proton density, and temperature. This feed helps explain geomagnetic activity and aurora probability."
      sourceLabel="NOAA SWPC"
      sourceUrl="https://www.swpc.noaa.gov"
      status="LIVE"
      cadenceSeconds={60}
      relatedSignals={[SIGNAL.KP_INDEX, SIGNAL.AURORAL_OVAL_PROBABILITY]}
    >
      <section aria-label="Solar wind live data">
        <SolarWindWidget />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNALS - SOLAR_WIND_SPEED" />
    </SignalPageLayout>
  );
}
