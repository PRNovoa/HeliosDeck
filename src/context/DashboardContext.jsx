import { useEffect, useMemo, useState } from "react";
import {
  DASHBOARD_CONFIG_VERSION,
  DASHBOARD_LAYOUT_BREAKPOINTS,
  DASHBOARD_LAYOUT_COLUMNS,
  DASHBOARD_STORAGE_KEY,
  WIDGET_REGISTRY,
} from "@/lib/constants.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { DashboardContext } from "./DashboardContextBase.js";

function buildDefaultLayouts() {
  const layouts = {};

  for (const breakpoint of Object.keys(DASHBOARD_LAYOUT_BREAKPOINTS)) {
    const cols = DASHBOARD_LAYOUT_COLUMNS[breakpoint];

    layouts[breakpoint] = Object.entries(WIDGET_REGISTRY).map(([id, meta]) => {
      const base = meta.defaultLayouts?.[breakpoint] ?? meta.defaultLayouts?.lg;
      return {
        i: id,
        x: Math.min(base.x, cols - 1),
        y: base.y,
        w: Math.min(base.w, cols),
        h: base.h,
        minW: Math.min(meta.minW ?? 1, cols),
        minH: meta.minH ?? 2,
      };
    });
  }

  return layouts;
}

function buildDefaultConfig() {
  const widgets = {};

  for (const [id, meta] of Object.entries(WIDGET_REGISTRY)) {
    widgets[id] = {
      enabled: meta.defaultEnabled,
      order: meta.defaultOrder,
    };
  }

  return {
    version: DASHBOARD_CONFIG_VERSION,
    widgets,
    layouts: buildDefaultLayouts(),
  };
}

function storageKeyForUser(user) {
  return user?.id
    ? `${DASHBOARD_STORAGE_KEY}:user:${user.id}`
    : `${DASHBOARD_STORAGE_KEY}:guest`;
}

function loadFromStorage(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== DASHBOARD_CONFIG_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(storageKey, config) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(config));
  } catch {
    // Ignore write errors (private browsing, storage full, etc.)
  }
}

function mergeWithDefaults(saved) {
  const defaults = buildDefaultConfig();
  if (!saved) return defaults;

  const widgets = {};
  for (const [id, meta] of Object.entries(WIDGET_REGISTRY)) {
    widgets[id] = {
      enabled: saved.widgets?.[id]?.enabled ?? meta.defaultEnabled,
      order: saved.widgets?.[id]?.order ?? meta.defaultOrder,
    };
  }

  const layouts = {};
  for (const breakpoint of Object.keys(DASHBOARD_LAYOUT_BREAKPOINTS)) {
    const defaultItems = defaults.layouts[breakpoint];
    const savedItems = saved.layouts?.[breakpoint] ?? [];

    layouts[breakpoint] = defaultItems.map((defaultItem) => {
      const savedItem = savedItems.find((item) => item.i === defaultItem.i);
      if (!savedItem) return defaultItem;

      const cols = DASHBOARD_LAYOUT_COLUMNS[breakpoint];
      return {
        ...defaultItem,
        ...savedItem,
        x: Math.min(Math.max(savedItem.x ?? defaultItem.x, 0), cols - 1),
        y: Math.max(savedItem.y ?? defaultItem.y, 0),
        w: Math.min(Math.max(savedItem.w ?? defaultItem.w, 1), cols),
        h: Math.max(savedItem.h ?? defaultItem.h, defaultItem.minH ?? 1),
      };
    });
  }

  return {
    version: DASHBOARD_CONFIG_VERSION,
    widgets,
    layouts,
  };
}

export function DashboardProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => storageKeyForUser(user), [user]);
  const [config, setConfig] = useState(() =>
    mergeWithDefaults(loadFromStorage(storageKey)),
  );

  useEffect(() => {
    saveToStorage(storageKey, config);
  }, [config, storageKey]);

  function toggleWidget(id) {
    setConfig((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [id]: {
          ...prev.widgets[id],
          enabled: !prev.widgets[id]?.enabled,
        },
      },
    }));
  }

  function reorderWidgets(orderedIds) {
    setConfig((prev) => {
      const next = { ...prev.widgets };
      orderedIds.forEach((id, index) => {
        if (next[id]) {
          next[id] = { ...next[id], order: index };
        }
      });
      return { ...prev, widgets: next };
    });
  }

  function updateLayouts(nextLayouts) {
    setConfig((prev) => ({
      ...prev,
      layouts: mergeWithDefaults({
        ...prev,
        layouts: nextLayouts,
      }).layouts,
    }));
  }

  function resetConfig() {
    setConfig(buildDefaultConfig());
  }

  function resetLayout() {
    setConfig((prev) => ({
      ...prev,
      layouts: buildDefaultLayouts(),
    }));
  }

  function getSortedWidgets(onlyEnabled = false) {
    return Object.entries(config.widgets)
      .filter(([, w]) => !onlyEnabled || w.enabled)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id, w]) => ({ id, ...w, meta: WIDGET_REGISTRY[id] }));
  }

  return (
    <DashboardContext.Provider
      value={{
        config,
        storageKey,
        toggleWidget,
        reorderWidgets,
        updateLayouts,
        resetConfig,
        resetLayout,
        getSortedWidgets,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
