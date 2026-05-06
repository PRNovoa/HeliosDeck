import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./TopBar.jsx";
import { HudPanel } from "./HudPanel.jsx";
import { useTheme } from "@/hooks/useTheme.js";
import { useInactivityHide } from "@/hooks/useInactivityHide.js";
import { ConstellationBackground } from "@/components/ui/ConstellationBackground.jsx";

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(8px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

export function Shell() {
  const location = useLocation();
  const [hudOpen, setHudOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isHidden } = useInactivityHide();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(var(--stellar-line-rgb),0.18),transparent_28%),radial-gradient(circle_at_76%_0%,rgba(var(--stellar-node-rgb),0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)] dark:bg-[radial-gradient(circle_at_20%_8%,rgba(var(--stellar-line-rgb),0.18),transparent_28%),radial-gradient(circle_at_76%_0%,rgba(var(--stellar-node-rgb),0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_42%)]" />
      <ConstellationBackground />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(var(--stellar-grid-rgb),0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--stellar-grid-rgb),0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45 dark:opacity-30" />

      <TopBar
        onHudToggle={() => setHudOpen((o) => !o)}
        hudOpen={hudOpen}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        isHidden={isHidden && !hudOpen}
      />

      <HudPanel open={hudOpen} onClose={() => setHudOpen(false)} />

      <motion.main
        className="relative z-[1] min-h-screen px-3 pb-8 sm:px-4 lg:px-5"
        animate={{
          paddingTop: hudOpen ? "25rem" : isHidden ? "1rem" : "5.75rem",
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        id="main-content"
        tabIndex={-1}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="mx-auto min-h-full w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-2.5rem)]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
