import { useContext } from "react";
import { DashboardContext } from "./DashboardContextBase.js";

/** @returns {{ config, storageKey, toggleWidget, reorderWidgets, updateLayouts, resetConfig, resetLayout, getSortedWidgets }} */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside <DashboardProvider>");
  }
  return ctx;
}
