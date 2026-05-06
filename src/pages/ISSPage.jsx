import { IssPositionWidget } from "@/components/widgets/IssPositionWidget.jsx";
import { SignalPageLayout } from "@/components/layout/SignalPageLayout.jsx";
import { JsonInspector } from "@/components/ui/JsonInspector.jsx";
import { useISSPosition } from "@/hooks/useISSPosition.js";

export function ISSPage() {
  const { data } = useISSPosition();

  return (
    <SignalPageLayout
      title="ISS POSITION"
      description="International Space Station real-time coordinates updated every 5 seconds. Latitude, longitude, altitude, and velocity are normalised from the wheretheiss.at REST API."
      sourceLabel="wheretheiss.at"
      sourceUrl="https://wheretheiss.at/w/developer"
      status="LIVE"
      cadenceSeconds={5}
      relatedSignals={[]}
    >
      <section aria-label="ISS live data">
        <IssPositionWidget />
      </section>
      <JsonInspector data={data} label="NORMALIZED SIGNAL — ISS_COORDINATES" />
    </SignalPageLayout>
  );
}
