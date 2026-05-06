import { CMEWidget } from "@/components/widgets/CMEWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useCME } from "@/hooks/useCME.js";
import { SIGNAL } from "@/lib/constants.js";

export function CMEPage() {
  const { data } = useCME(7);

  return (
    <SignalPageLayout
      title="CME EVENTS"
      description="Coronal mass ejection events from NASA DONKI, normalized into event time, speed, analysis type, and instrument metadata. Requires NASA API quota."
      sourceLabel="NASA DONKI"
      sourceUrl="https://kauai.ccmc.gsfc.nasa.gov/DONKI"
      status="LIVE"
      cadenceSeconds={3600}
      relatedSignals={[SIGNAL.SOLAR_FLARE_EVENTS, SIGNAL.KP_INDEX]}
    >
      <section aria-label="CME event data">
        <CMEWidget days={7} />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNALS - CME_EVENTS" />
    </SignalPageLayout>
  );
}
