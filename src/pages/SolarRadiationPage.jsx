import { SolarRadiationWidget } from "@/components/widgets/SolarRadiationWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useSolarRadiation } from "@/hooks/useSolarRadiation.js";
import { SIGNAL } from "@/lib/constants.js";

export function SolarRadiationPage() {
  const { data } = useSolarRadiation();

  return (
    <SignalPageLayout
      title="SOLAR RADIATION"
      description="NOAA GOES X-ray flux samples from the primary satellite, filtered to the long XRS channel and normalized into flux and X-ray class."
      sourceLabel="NOAA SWPC"
      sourceUrl="https://www.swpc.noaa.gov"
      status="LIVE"
      cadenceSeconds={60}
      relatedSignals={[SIGNAL.SOLAR_FLARE_EVENTS, SIGNAL.SOLAR_RADIO_FLUX]}
    >
      <section aria-label="Solar radiation data">
        <SolarRadiationWidget />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNALS - SOLAR_RADIATION" />
    </SignalPageLayout>
  );
}
