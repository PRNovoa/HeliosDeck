import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DashboardGrid } from "@/features/dashboard/DashboardGrid.jsx";
import { WidgetSelector } from "@/features/dashboard/WidgetSelector.jsx";
import { MissionControlHeader } from "@/features/dashboard/MissionControlHeader.jsx";

export function DashboardPage() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col gap-4">
      <MissionControlHeader
        onConfigure={() => setPanelOpen((o) => !o)}
        panelOpen={panelOpen}
      />

      <AnimatePresence initial={false}>
        {panelOpen && (
          <div id="widget-selector">
            <WidgetSelector />
          </div>
        )}
      </AnimatePresence>

      <DashboardGrid />
    </div>
  );
}
