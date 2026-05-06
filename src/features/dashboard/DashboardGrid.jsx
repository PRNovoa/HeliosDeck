import {
  Responsive,
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "@/context/useDashboard.js";
import {
  DASHBOARD_LAYOUT_BREAKPOINTS,
  DASHBOARD_LAYOUT_COLUMNS,
  SIGNAL,
  WIDGET_REGISTRY,
} from "@/lib/constants.js";
import { IssPositionWidget } from "@/components/widgets/IssPositionWidget.jsx";
import { KpIndexWidget } from "@/components/widgets/KpIndexWidget.jsx";
import { SolarFlareWidget } from "@/components/widgets/SolarFlareWidget.jsx";
import { DashboardCard } from "@/components/ui/DashboardCard.jsx";

const WIDGET_COMPONENTS = {
  [SIGNAL.ISS_COORDINATES]: IssPositionWidget,
  [SIGNAL.KP_INDEX]: KpIndexWidget,
  [SIGNAL.SOLAR_FLARE_EVENTS]: SolarFlareWidget,
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function withWidgetConstraints(item, breakpoint) {
  const meta = WIDGET_REGISTRY[item.i];
  const cols = DASHBOARD_LAYOUT_COLUMNS[breakpoint] ?? DASHBOARD_LAYOUT_COLUMNS.lg;
  return {
    ...item,
    x: Math.min(item.x, cols - 1),
    w: Math.min(item.w, cols),
    minW: Math.min(meta?.minW ?? 1, cols),
    minH: meta?.minH ?? 2,
  };
}

export function DashboardGrid() {
  const { config, getSortedWidgets, updateLayouts } = useDashboard();
  const { containerRef, mounted, width } = useContainerWidth({
    initialWidth: 1200,
  });
  const enabledWidgets = getSortedWidgets(true);

  const layouts = useMemo(() => {
    const enabledIds = new Set(enabledWidgets.map((widget) => widget.id));

    return Object.fromEntries(
      Object.entries(config.layouts).map(([breakpoint, items]) => {
        const cols = DASHBOARD_LAYOUT_COLUMNS[breakpoint];
        return [
          breakpoint,
          items
            .filter((item) => enabledIds.has(item.i))
            .map((item) => {
              const meta = WIDGET_REGISTRY[item.i];
              return {
                ...item,
                x: Math.min(item.x, cols - 1),
                w: Math.min(item.w, cols),
                minW: Math.min(meta?.minW ?? 1, cols),
                minH: meta?.minH ?? 2,
              };
            }),
        ];
      }),
    );
  }, [config.layouts, enabledWidgets]);

  const handleLayoutChange = useCallback(
    (_currentLayout, allLayouts) => {
      updateLayouts(
        Object.fromEntries(
          Object.entries(allLayouts).map(([breakpoint, items]) => [
            breakpoint,
            items.map((item) => withWidgetConstraints(item, breakpoint)),
          ]),
        ),
      );
    },
    [updateLayouts],
  );

  if (enabledWidgets.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-[18rem] items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-white/[0.03] text-center text-sm text-[var(--color-text-muted)]"
      >
        No widgets enabled. Open the configure panel to add widgets.
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="dashboard-grid-shell"
      aria-label="Dashboard widgets"
    >
      {mounted && (
        <Responsive
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={DASHBOARD_LAYOUT_BREAKPOINTS}
          cols={DASHBOARD_LAYOUT_COLUMNS}
          rowHeight={92}
          dragConfig={{ enabled: true, handle: ".dragHandle", threshold: 4 }}
          resizeConfig={{ enabled: true, handles: ["se"] }}
          onLayoutChange={handleLayoutChange}
          margin={[18, 18]}
          containerPadding={[0, 0]}
          compactor={verticalCompactor}
        >
          {enabledWidgets.map(({ id }, index) => {
            const WidgetComponent = WIDGET_COMPONENTS[id] ?? PlaceholderWidget;
            return (
              <div key={id} className="flex h-full flex-col">
                <motion.div
                  className="flex h-full flex-col"
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                >
                  <WidgetComponent id={id} />
                </motion.div>
              </div>
            );
          })}
        </Responsive>
      )}
    </section>
  );
}

function PlaceholderWidget({ id }) {
  const meta = WIDGET_REGISTRY[id];

  return (
    <DashboardCard
      title={meta?.label ?? "Signal"}
      accent="var(--color-accent-blue)"
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-text-primary)]">
            Signal bay reserved
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            {meta?.description ?? "This widget is ready for a future signal."}
          </p>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-2/3 animate-shimmer bg-gradient-to-r from-transparent via-[var(--color-accent-blue)] to-transparent opacity-60" />
        </div>
      </div>
    </DashboardCard>
  );
}
