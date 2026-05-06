import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin } from "@/hooks/useLogin.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROUTES } from "@/app/routes.js";
import { ConstellationBackground } from "@/components/ui/ConstellationBackground.jsx";

const formVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
  },
};

const inputCls = "w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] font-[var(--font-mono)] focus:outline-none focus:border-[var(--color-accent-orange)] focus:ring-1 focus:ring-[var(--color-accent-orange)] transition-colors placeholder:text-[var(--color-text-muted)] disabled:opacity-50";

export function LoginPage() {
  const { accessToken } = useAuth();
  const { mutate, isPending, error } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (accessToken) return <Navigate to={ROUTES.DASHBOARD} replace />;

  function handleSubmit(e) {
    e.preventDefault();
    mutate({ username: username.trim(), password });
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-primary)] overflow-hidden">
      <ConstellationBackground />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm px-4">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="text-4xl text-[var(--color-accent-orange)] animate-pulse-dot" aria-hidden="true">◆</span>
          <h1 className="text-2xl font-bold tracking-[0.15em] uppercase text-[var(--color-text-primary)]">HELIOS DECK</h1>
          <p className="text-[0.6rem] font-bold tracking-[0.25em] uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]">
            GEOPHYSICAL &amp; HELIOPHYSICAL OBSERVATORY
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          className="w-full overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass)] shadow-[var(--surface-shadow)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, delay: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Card header with orange top bar */}
          <div className="relative h-1 w-full bg-[var(--color-accent-orange)]">
            <span className="absolute inset-0 animate-scan-sweep bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <div className="px-6 py-5">
            <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-primary)] mb-1">MISSION LOGIN</h2>
            <p className="text-[0.6rem] text-[var(--color-text-muted)] mb-4">
              Use any{" "}
              <a href="https://dummyjson.com/users" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-orange)] transition-colors">
                DummyJSON user
              </a>{" "}
              &mdash; e.g. <code className="font-[var(--font-mono)] text-[0.65rem] text-[var(--color-accent-orange)]">emilys</code> /{" "}
              <code className="font-[var(--font-mono)] text-[0.65rem] text-[var(--color-accent-orange)]">emilyspass</code>
            </p>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="flex flex-col gap-1.5" variants={fieldVariant}>
                <label className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]" htmlFor="username">USERNAME</label>
                <input
                  id="username"
                  className={inputCls}
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
                  placeholder="emilys"
                />
              </motion.div>

              <motion.div className="flex flex-col gap-1.5" variants={fieldVariant}>
                <label className="text-[0.6rem] font-bold tracking-widest uppercase text-[var(--color-text-muted)] font-[var(--font-mono)]" htmlFor="password">PASSWORD</label>
                <input
                  id="password"
                  className={inputCls}
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  placeholder="••••••••"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-[0.65rem] text-[var(--color-accent-red)] bg-[var(--color-accent-red-dim)] border border-[var(--color-accent-red)] rounded px-3 py-2 font-[var(--font-mono)]"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {error.message}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                className="relative w-full py-2.5 rounded bg-[var(--color-accent-orange)] text-white text-xs font-bold tracking-widest uppercase overflow-hidden hover:opacity-90 disabled:opacity-50 transition-opacity font-[var(--font-mono)]"
                type="submit"
                disabled={isPending}
                variants={fieldVariant}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isPending ? (
                  <>
                    <span className="animate-blink">█</span> AUTHENTICATING…
                  </>
                ) : (
                  "LAUNCH →"
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
