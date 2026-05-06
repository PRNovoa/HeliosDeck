import { useEffect, useRef } from "react";

const STAR_COUNT = 220;
const NODE_COUNT = 38;
const LINK_DISTANCE = 170;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeStar(width, height) {
  return {
    x: rand(0, width),
    y: rand(0, height),
    r: rand(0.45, 1.8),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.0008, 0.0022),
    alpha: rand(0.22, 0.85),
  };
}

function makeNode(width, height) {
  return {
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.035, 0.035),
    vy: rand(-0.025, 0.025),
    r: rand(1.1, 2.4),
    alpha: rand(0.36, 0.82),
  };
}

function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  return {
    star: styles.getPropertyValue("--stellar-star-rgb").trim() || "230, 245, 255",
    node: styles.getPropertyValue("--stellar-node-rgb").trim() || "255, 214, 170",
    line: styles.getPropertyValue("--stellar-line-rgb").trim() || "125, 231, 255",
    grid: styles.getPropertyValue("--stellar-grid-rgb").trim() || "175, 219, 255",
    nebula:
      styles.getPropertyValue("--stellar-nebula-rgb").trim() || "125, 231, 255",
  };
}

export function ConstellationBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let nodes = [];
    let lastTime = performance.now();
    let palette = readPalette();

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: STAR_COUNT }, () => makeStar(width, height));
      nodes = Array.from({ length: NODE_COUNT }, () => makeNode(width, height));
    }

    function draw(timestamp) {
      const delta = Math.min(timestamp - lastTime, 32);
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      const drift = reducedMotion ? 0 : timestamp * 0.003;
      const gradient = ctx.createRadialGradient(
        width * 0.52,
        height * 0.22,
        0,
        width * 0.52,
        height * 0.22,
        Math.max(width, height) * 0.78,
      );
      gradient.addColorStop(0, `rgba(${palette.nebula}, 0.095)`);
      gradient.addColorStop(0.44, `rgba(${palette.line}, 0.055)`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate((drift % 48) - 48, (drift % 48) - 48);
      ctx.fillStyle = `rgba(${palette.grid}, 0.055)`;
      for (let y = 0; y < height + 96; y += 48) {
        for (let x = 0; x < width + 96; x += 48) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.restore();

      for (const star of stars) {
        const pulse = reducedMotion
          ? 1
          : 0.72 + Math.sin(timestamp * star.speed + star.phase) * 0.28;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.star}, ${star.alpha * pulse})`;
        ctx.fill();
      }

      for (const node of nodes) {
        if (!reducedMotion) {
          node.x += node.vx * delta;
          node.y += node.vy * delta;
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;

          const opacity = (1 - distance / LINK_DISTANCE) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${palette.line}, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.node}, ${node.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.node}, ${node.alpha * 0.045})`;
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    draw(performance.now());

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-95"
      aria-hidden="true"
    />
  );
}
