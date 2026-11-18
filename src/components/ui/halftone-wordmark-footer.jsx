// src/components/ui/halftone-wordmark-footer.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hwfHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
export function hwfRadius(coverage, gap) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.56;
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy]. Away from the pointer a
 * displaced dot always heads home and comes to rest.
 */
export function hwfStep(x, y, vx, vy, hx, hy, px, py, r) {
  const dx = x - px;
  const dy = y - py;
  const d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001;
    const f = (1 - d / r) * 2.6;
    vx += (dx / d) * f;
    vy += (dy / d) * f;
  }
  vx = (vx + (hx - x) * 0.05) * 0.84;
  vy = (vy + (hy - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

/** How warm a dot is drawn: 0 at home, 1 once it is `span` px or more away. */
export function hwfWarmth(x, y, hx, hy, span) {
  const d = Math.hypot(x - hx, y - hy);
  return span > 0 ? Math.min(1, d / span) : 0;
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function hwfFitSize(measured, width) {
  return measured > 0 ? (width / measured) * 100 : 0;
}

const PRESETS = {
  night: { background: "#050505", ink: "#E9E4DA", warm: "#C8E9A9" },
  parallel: { background: "#050505", ink: "#F2F3F0", warm: "#C8E9A9" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
};

const DEFAULT_COLUMNS = [
  {
    title: "Exploration",
    links: [
      { label: "Explore Universes", href: "/explore" },
      { label: "Create Reality", href: "/create" },
      { label: "Branch Compare", href: "/compare" },
      { label: "Saved Realities", href: "/saved" },
    ],
  },
  {
    title: "Signals & Community",
    links: [
      { label: "GitHub Repository", href: "https://github.com", external: true },
      { label: "Discord Guild", href: "https://discord.com", external: true },
      { label: "X / Twitter", href: "https://x.com", external: true },
      { label: "System Settings", href: "/settings" },
    ],
  },
];

const SANS_STACK = '"Inter", "Inter Tight", "Helvetica Neue", Arial, sans-serif';
const MONO_STACK = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 10; display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 32px; padding: clamp(26px, 3.8vw, 48px) clamp(20px, 3.8vw, 56px) 0;
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; line-height: 1.8;
}
.hwf-brand strong { display: block; font-weight: 700; letter-spacing: 0.22em; color: #F2F3F0; }
.hwf-brand span { opacity: .65; color: #A5A7A3; font-size: 10px; display: block; margin-top: 4px; }
.hwf-brand .hwf-speculative {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
  padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08); font-size: 9.5px; color: #A5A7A3;
  text-transform: none; letter-spacing: 0.04em;
}
.hwf-brand .hwf-speculative-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #C8E9A9; box-shadow: 0 0 6px #C8E9A9;
}
.hwf-col h3 { margin: 0 0 10px 0; font: inherit; opacity: .45; font-weight: 600; color: #C8E9A9; letter-spacing: 0.2em; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .78; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(#C8E9A9, #C8E9A9); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, color .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; color: #C8E9A9; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid #C8E9A9; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  margin: clamp(20px, 3vw, 36px) clamp(20px, 3.8vw, 56px) 0; padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--hwf-mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #A5A7A3;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 860px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 24px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr); }
  .hwf-rule { flex-direction: column-reverse; align-items: flex-start; gap: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`;

export default function HalftoneWordmarkFooter({
  wordmark = "PARALLEL",
  label = "PARALLEL",
  meta = "One Life. Infinite Possibilities. · ©2026",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  preset = "parallel",
  palette,
  dotGap = 6,
  radius = 90,
  crop = 0.22,
  grain = 0.45,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 900,
  monoFamily = MONO_STACK,
  height = "560px",
  className = "",
}) {
  const colors = { ...(PRESETS[preset] || PRESETS.parallel), ...(palette || {}) };
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const opts = useRef({
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  });
  opts.current = {
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  };

  const key = [
    wordmark,
    dotGap,
    crop,
    grain,
    fontFamily,
    fontWeight,
    colors.background,
    colors.ink,
    colors.warm,
  ].join("|");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0);
    let count = 0;
    let grainTile = null;
    const ink = hwfHex(opts.current.colors.ink) || [242, 243, 240];
    const warm = hwfHex(opts.current.colors.warm) || [200, 233, 169]; // #C8E9A9 sage glow

    const layout = () => {
      const o = opts.current;
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Set the word once on an off-screen mask canvas
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      const face = `${o.fontWeight} 100px ${o.fontFamily}`;
      m.font = face;
      const word = o.wordmark || "PARALLEL";
      const fit = hwfFitSize(m.measureText(word).width, w * 1.04);
      m.font = `${o.fontWeight} ${fit}px ${o.fontFamily}`;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      const c = Math.max(0, Math.min(0.6, o.crop));
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(word, (w - box.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(3, o.dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3x3 sample of the cell.
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.055) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      // Fixed tile of print grain
      grainTile = document.createElement("canvas");
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext("2d");
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      awake = true;
    };

    const draw = (now) => {
      const o = opts.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.colors.background;
      ctx.fillRect(0, 0, w, h);

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.95;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];

        if (!reduced) {
          if (ringAge < 950) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 28);
            if (band > 0) {
              const f = band * 3.4 * (1 - ringAge / 950);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r);
          x = s[0];
          y = s[1];
          vx = s[2];
          vy = s[3];
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }

        const k = hwfWarmth(x, y, hx, hy, 30);
        ctx.fillStyle =
          k > 0.02
            ? `rgb(${Math.round(ink[0] + (warm[0] - ink[0]) * k)}, ${Math.round(
                ink[1] + (warm[1] - ink[1]) * k
              )}, ${Math.round(ink[2] + (warm[2] - ink[2]) * k)})`
            : o.colors.ink;

        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.08;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(grainTile, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      // Sleep once everything is home and nothing is pushing.
      awake = moving || ringAge < 950 || px > -1e4;
    };

    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };

    const onMove = (e) => {
      if (!opts.current.interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };

    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onDown = (e) => {
      if (!opts.current.interactive || reduced) return;
      if (e.target.closest("a,button,input")) return;
      const p = toLocal(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);

    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        layout();
        wake();
      });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [key]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (e, href, external) => {
    if (external || !href.startsWith("/")) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <footer
      ref={rootRef}
      className={`hwf-root ${className}`}
      style={{
        height,
        "--hwf-bg": colors.background,
        "--hwf-ink": colors.ink,
        "--hwf-mono": monoFamily,
      }}
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>

      {/* Top Grid: Brand & Structured Navigation Columns */}
      <div className="hwf-top">
        <div className="hwf-brand">
          <Link to="/" className="inline-flex items-center gap-2 mb-1.5 no-underline">
            <svg viewBox="0 0 40 24" className="w-6 h-3.5 text-[#F2F3F0]" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="28" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="12" cy="12" r="3" fill="#C8E9A9" />
              <circle cx="28" cy="12" r="3" fill="#9678C9" />
            </svg>
            <strong>{label}</strong>
          </Link>
          <span>{meta}</span>
          <div className="hwf-speculative">
            <span className="hwf-speculative-dot" />
            <span>Speculative fiction platform — outcomes represent simulated divergence.</span>
          </div>
        </div>

        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href || "#"} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link
                      to={l.href || "/"}
                      onClick={(e) => handleLinkClick(e, l.href, l.external)}
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom Hairline Rule with Back to Top */}
      <div className="hwf-rule">
        <span>Parallel Multiverse Generative Engine // v2.6.0</span>
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>
    </footer>
  );
}
