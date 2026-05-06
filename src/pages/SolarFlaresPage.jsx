import { SolarFlareWidget } from "@/components/widgets/SolarFlareWidget.jsx";
import { SolarFlareSeverityChart } from "@/components/charts/SolarFlareSeverityChart.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useSolarFlares } from "@/hooks/useSolarFlares.js";
import { SIGNAL } from "@/lib/constants.js";

export function SolarFlaresPage() {
  const { data } = useSolarFlares(7);

  return (
    <SignalPageLayout
      title="SOLAR FLARES"
      description="X-ray solar flare events observed by GOES satellites, classified A → X by peak intensity. Data from NASA DONKI for the last 7 days. Requires NASA API key."
      sourceLabel="NASA DONKI"
      sourceUrl="https://kauai.ccmc.gsfc.nasa.gov/DONKI"
      status="LIVE"
      cadenceSeconds={1800}
      relatedSignals={[SIGNAL.KP_INDEX, SIGNAL.CORONAL_MASS_EJECTIONS]}
    >
      <section aria-label="Solar flare events">
        <SolarFlareWidget days={7} />
      </section>
      <SolarFlareSeverityChart days={7} />
      <JsonInspector data={data} label="NORMALIZED SIGNALS — SOLAR_FLARE_EVENTS" />
    </SignalPageLayout>
  );
}
