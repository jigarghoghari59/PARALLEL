// src/components/common/ParallelLoader.jsx
// "Divergence" — PARALLEL's loading experience & landing-page arrival.
//
//  One life (a single sage dot inside a progress ring)  →  the ring and dot split into
//  two parallel worlds (the brand mark)  →  the wordmark rises  →  both rings open as
//  portals that sweep outward and merge, revealing the landing page underneath.
//
// Progress is REAL: web fonts, window load and the 3D hero's textures
// (EarthAndMoon dispatches "parallel:hero-ready"). A short minimum duration keeps the
// choreography readable on fast connections; a hard timeout guarantees the page never
// stays hidden.

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./ParallelLoader.css";

const WORD = "PARALLEL".split("");
const NIGHT = "#050505";
const PALE = "#F2F3F0";
const SAGE = "#C8E9A9";
const PURPLE = "#9678C9";

const MIN_TIME = 2.6; // seconds — minimum visual duration of the progress phase
const HERO_TIMEOUT = 5.5; // seconds — don't wait forever on remote textures
const HARD_TIMEOUT = 10; // seconds — absolute safety net

const STAGES = [
  { key: "fonts", w: 0.2, label: "Setting the typeface" },
  { key: "assets", w: 0.3, label: "Gathering assets" },
  { key: "scene", w: 0.5, label: "Rendering Earth" },
];

const PAGE_HIDDEN =
  "[data-page-nav], [data-page-logo], [data-page-voce], [data-page-nav-right], [data-page-label], [data-page-char], [data-page-line], [data-page-actions]";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

export const ParallelLoader = ({ onTransitionStart }) => {
  const rootRef = useRef(null);
  const startRef = useRef(onTransitionStart);
  startRef.current = onTransitionStart;
  const [done, setDone] = useState(false);

  // Static star positions (normalised) — generated once.
  const starsRef = useRef(null);
  if (!starsRef.current) {
    const n = typeof window !== "undefined" && window.innerWidth < 768 ? 26 : 52;
    starsRef.current = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 0.95,
    }));
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (s) => root.querySelector(s);
    const qa = (s) => [...root.querySelectorAll(s)];
    const pageQ = (s) => [...document.querySelectorAll(s)];

    /* ------------------------------------------------------------ elements */
    const svg = q(".plx__svg");
    const maskEl = q("#plx-mask");
    const maskBg = q("[data-mask-bg]");
    const veil = q("[data-veil]");
    const holeA = q("[data-hole-a]");
    const holeB = q("[data-hole-b]");
    const glowA = q("[data-glow-a]");
    const glowB = q("[data-glow-b]");
    const starsG = q("[data-stars]");
    const starEls = qa("[data-star]");
    const track = q("[data-track]");
    const ringA = q("[data-ring-a]");
    const ringB = q("[data-ring-b]");
    const dotA = q("[data-dot-a]");
    const dotB = q("[data-dot-b]");
    const head = q("[data-head]");
    const meta = q("[data-meta]");
    const countEl = q("[data-count]");
    const statusEl = q("[data-status]");
    const word = q("[data-word]");
    const glyphs = qa("[data-glyph]");
    const tag = q("[data-tag]");

    /* ------------------------------------------------------------ geometry */
    const g = { W: 0, H: 0, cx: 0, cy: 0, r: 30, Rmax: 1000, hair: 1.25, swMax: 8 };

    // Animated proxy — every visual of the mark is derived from this in render().
    const m = { p: 0, split: 0, sw: 0, grow: 0, hole: 0, dotA: 0, dotB: 0, breath: 0, pulse: 0 };

    const set = (el, attrs) => {
      for (const k in attrs) el.setAttribute(k, attrs[k]);
    };

    const render = () => {
      const off = m.split * g.r;
      const R = g.r + m.grow * (g.Rmax - g.r);
      const sw = lerp(g.hair, g.swMax, m.sw);
      const ax = g.cx - off;
      const bx = g.cx + off;
      const dotR = g.r * 0.375;

      set(track, { cx: ax, cy: g.cy, r: R, "stroke-width": g.hair });

      const p = clamp(m.p, 0, 1);
      set(ringA, {
        cx: ax,
        cy: g.cy,
        r: R,
        "stroke-width": sw,
        transform: `rotate(-90 ${ax} ${g.cy})`,
        "stroke-dasharray": p >= 0.9995 ? "none" : "100",
        "stroke-dashoffset": p >= 0.9995 ? 0 : 100 * (1 - p),
      });
      set(ringB, { cx: bx, cy: g.cy, r: R, "stroke-width": sw });

      set(dotA, { cx: ax, cy: g.cy, r: Math.max(0, dotR * (1 + 0.14 * m.breath + 0.4 * m.pulse) * m.dotA) });
      set(dotB, { cx: bx, cy: g.cy, r: Math.max(0, dotR * m.dotB) });

      const a = (-90 + 360 * p) * (Math.PI / 180);
      set(head, {
        cx: ax + R * Math.cos(a),
        cy: g.cy + R * Math.sin(a),
        opacity: p > 0.012 && p < 0.9995 ? 1 : 0,
      });

      const hr = Math.max(0, (R - sw / 2) * m.hole);
      set(holeA, { cx: ax, cy: g.cy, r: hr });
      set(holeB, { cx: bx, cy: g.cy, r: hr });

      set(glowA, { cx: ax, cy: g.cy });
      set(glowB, { cx: bx, cy: g.cy });
    };

    const layout = () => {
      g.W = window.innerWidth;
      g.H = window.innerHeight;
      g.r = clamp(Math.min(g.W, g.H) * 0.055, 24, 40);
      g.swMax = g.r * 0.27; // matches the brand mark's stroke-to-radius ratio
      g.cx = g.W / 2;
      g.cy = g.H / 2 - g.r * 0.45;
      g.Rmax = Math.hypot(g.W / 2 + g.r, g.H / 2 + Math.abs(g.cy - g.H / 2)) + g.r * 2;

      set(svg, { viewBox: `0 0 ${g.W} ${g.H}` });
      for (const el of [maskEl, maskBg, veil]) set(el, { x: 0, y: 0, width: g.W, height: g.H });

      set(glowA, { r: g.r * 5 });
      set(glowB, { r: g.r * 5 });
      set(head, { r: Math.max(2, g.r * 0.075) });

      starEls.forEach((el, i) => {
        const s = starsRef.current[i];
        set(el, { cx: s.x * g.W, cy: s.y * g.H, r: s.r });
      });

      meta.style.top = `${g.cy + g.r + 34}px`;
      word.style.top = `${g.cy + g.r + 40}px`;
      render();
    };

    /* ------------------------------------------------------------ scroll lock */
    const prevOverflow = document.documentElement.style.overflow;
    const stop = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
    const onKey = (e) => {
      if (KEYS.has(e.key)) stop(e);
    };
    const lock = () => {
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("wheel", stop, { capture: true, passive: false });
      window.addEventListener("touchmove", stop, { capture: true, passive: false });
      window.addEventListener("keydown", onKey, true);
    };
    const unlock = () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("wheel", stop, true);
      window.removeEventListener("touchmove", stop, true);
      window.removeEventListener("keydown", onKey, true);
    };

    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lock();

    /* ------------------------------------------------------------ real readiness */
    const stages = STAGES.map((s) => ({ ...s, done: false, at: 0 }));
    let clock0 = 0;
    const now = () => gsap.ticker.time - clock0;
    const markDone = (key) => {
      const s = stages.find((x) => x.key === key);
      if (s && !s.done) {
        s.done = true;
        s.at = now();
      }
    };

    const onLoadEvt = () => markDone("assets");
    const onHeroEvt = () => markDone("scene");

    /* ------------------------------------------------------------ page arrival */
    const hideTargets = () => {
      const all = pageQ(PAGE_HIDDEN);
      if (all.length) gsap.set(all, { autoAlpha: 0 });
      const chars = pageQ("[data-page-char]");
      if (chars.length) gsap.set(chars, { autoAlpha: 1, yPercent: 118, rotate: 4, transformOrigin: "0% 100%" });
    };

    const playPage = (tl, at) => {
      const OUT = "expo.out";
      const nav = pageQ("[data-page-nav]");
      const logo = pageQ("[data-page-logo]");
      const voce = pageQ("[data-page-voce]");
      const right = pageQ("[data-page-nav-right]");
      const label = pageQ("[data-page-label]");
      const chars = pageQ("[data-page-char]");
      const line = pageQ("[data-page-line]");
      const actions = pageQ("[data-page-actions]");

      if (nav.length) tl.fromTo(nav, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: OUT }, at);
      if (logo.length) tl.to(logo, { autoAlpha: 1, duration: 0.5 }, at + 0.1);
      if (voce.length) tl.to(voce, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: OUT }, at + 0.18);
      if (right.length) tl.to(right, { autoAlpha: 1, duration: 0.6 }, at + 0.3);

      if (label.length) {
        tl.to(label, { autoAlpha: 1, duration: 0.06, repeat: 5, yoyo: true, ease: "none" }, at + 0.25);
        tl.set(label, { autoAlpha: 1 }, at + 0.25 + 0.06 * 6);
      }
      if (chars.length)
        tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.15, ease: OUT, stagger: { each: 0.028 } }, at + 0.32);
      if (line.length) tl.fromTo(line, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: OUT }, at + 0.85);
      if (actions.length)
        tl.fromTo(actions, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: OUT }, at + 0.98);
    };

    const clearPage = () => {
      const all = pageQ(PAGE_HIDDEN);
      if (all.length) gsap.set(all, { clearProps: "opacity,visibility,transform,transformOrigin" });
    };

    /* ------------------------------------------------------------ choreography */
    let finished = false;
    let ended = false;
    let breath = null;
    let tickFn = null;
    const timers = [];

    const end = () => {
      if (ended) return;
      ended = true;
      clearPage();
      unlock();
      root.setAttribute("aria-busy", "false");
      setDone(true);
    };

    const finishReduced = () => {
      const tl = gsap.timeline({ onComplete: end });
      tl.to(root, { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, 0.1);
      tl.call(() => startRef.current?.(), null, 0.1);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      if (tickFn) gsap.ticker.remove(tickFn);
      if (REDUCED) return finishReduced();
      breath?.kill();
      gsap.to(m, { breath: 0, duration: 0.3, onUpdate: render });

      const tl = gsap.timeline({ onComplete: end });

      // 1 — settle the HUD, pulse the single life
      tl.to([countEl, statusEl], { autoAlpha: 0, y: -6, duration: 0.4, ease: "power2.in" }, 0.05);
      tl.to(m, { pulse: 1, duration: 0.26, ease: "power2.out", onUpdate: render }, 0);
      tl.to(m, { pulse: 0, duration: 0.5, ease: "power2.inOut", onUpdate: render }, 0.26);

      // 2 — divergence: one ring → two parallel worlds
      const D = 0.5;
      tl.set(ringB, { autoAlpha: 1 }, D);
      tl.to(track, { autoAlpha: 0, duration: 0.3 }, D);
      tl.to(m, { split: 1, duration: 1.15, ease: "expo.inOut", onUpdate: render }, D);
      tl.to(m, { sw: 1, duration: 0.9, ease: "power3.inOut", onUpdate: render }, D + 0.05);
      tl.to(m, { dotB: 1, duration: 0.9, ease: "expo.out", onUpdate: render }, D + 0.2);
      tl.to([glowA, glowB], { autoAlpha: 1, duration: 1.3, ease: "power2.out" }, D + 0.4);

      // 3 — wordmark rises through its mask
      const W = D + 0.95;
      tl.set(word, { autoAlpha: 1 }, W);
      tl.fromTo(
        glyphs,
        { yPercent: 118 },
        { yPercent: 0, duration: 0.95, ease: "expo.out", stagger: { amount: 0.4, from: "center" } },
        W
      );
      tl.fromTo(tag, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, W + 0.45);

      // 4 — hold, then the portals open
      const X = W + 1.55;
      tl.to(
        glyphs,
        { yPercent: -118, duration: 0.55, ease: "power3.in", stagger: { amount: 0.2, from: "edges" } },
        X
      );
      tl.to(tag, { autoAlpha: 0, y: -6, duration: 0.4, ease: "power2.in" }, X);
      tl.set(root, { pointerEvents: "none" }, X + 0.2);

      const P = X + 0.35;
      tl.call(() => startRef.current?.(), null, P);
      tl.to(dotA, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, P - 0.05);
      tl.to(dotB, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, P - 0.05);
      tl.to(m, { hole: 1, duration: 0.45, ease: "power2.out", onUpdate: render }, P);
      tl.to(m, { grow: 1, duration: 1.5, ease: "power4.inOut", onUpdate: render }, P);
      tl.to([ringA, ringB], { autoAlpha: 0, duration: 0.55, ease: "power1.in" }, P + 0.95);

      // 5 — the landing page arrives as the portals widen
      playPage(tl, P + 0.55);
    };

    /* ------------------------------------------------------------ progress loop */
    const HUD_EASE = gsap.parseEase("power2.inOut");
    let display = 0;
    let lastInt = -1;
    let statusText = STAGES[0].label;

    const swapStatus = (txt) => {
      if (txt === statusText) return;
      statusText = txt;
      gsap
        .timeline()
        .to(statusEl, { yPercent: -70, autoAlpha: 0, duration: 0.18, ease: "power2.in" })
        .add(() => {
          statusEl.textContent = txt;
        })
        .fromTo(statusEl, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" });
    };

    tickFn = (_t, dtMs) => {
      if (finished) return;
      const dt = dtMs / 1000;
      const elapsed = now();

      // real progress: completed stages + a gentle, honest creep inside the current one
      let base = 0;
      let cur = null;
      let curStart = 0;
      let lastAt = 0;
      for (const s of stages) {
        if (!s.done) {
          cur = s;
          curStart = lastAt;
          break;
        }
        base += s.w;
        lastAt = s.at;
      }
      const allDone = !cur;
      const real = allDone ? 1 : base + cur.w * 0.88 * (1 - Math.exp(-(elapsed - curStart) / 2.2));
      const cap = HUD_EASE(clamp(elapsed / MIN_TIME, 0, 1));
      const target = Math.min(real, cap);

      let step = (target - display) * (1 - Math.exp(-dt * 6));
      step = Math.max(step, Math.min(target - display, 0.22 * dt));
      display = clamp(display + Math.max(0, step), 0, 1);

      if (!REDUCED) {
        m.p = display;
        render();
      }
      const n = Math.round(display * 100);
      if (n !== lastInt) {
        lastInt = n;
        countEl.textContent = String(n).padStart(3, "0");
      }
      if (cur) swapStatus(cur.label);
      else swapStatus("Aligning timelines");

      if (allDone && display >= 0.998 && (!REDUCED || elapsed > 0.9)) {
        m.p = 1;
        render();
        countEl.textContent = "100";
        finish();
      }
    };

    /* ------------------------------------------------------------ boot */
    const ctx = gsap.context(() => {
      layout();
      window.addEventListener("resize", layout);

      // the SVG veil is now painting — let the DOM background go transparent
      gsap.set(root, { backgroundColor: "transparent" });

      if (REDUCED) {
        // Calm, static mark → simple cross-fade. No page hiding, no motion.
        m.split = 1;
        m.sw = 1;
        m.dotA = 1;
        m.dotB = 1;
        m.p = 1;
        render();
        gsap.set([ringA, ringB, dotA, dotB, glowA, glowB], { autoAlpha: 1 });
        gsap.set(track, { autoAlpha: 0 });
        gsap.set(head, { autoAlpha: 0 });
        gsap.set(word, { autoAlpha: 1 });
        gsap.set(glyphs, { yPercent: 0 });
        gsap.set(tag, { autoAlpha: 1 });
        gsap.set(meta, { autoAlpha: 0 });
      } else {
        hideTargets();
        gsap.set(starEls, { autoAlpha: () => 0.12 + Math.random() * 0.45 });
        gsap.set(glyphs, { yPercent: 118 });
        gsap.set([word, tag], { autoAlpha: 0 });
        gsap.set(meta, { autoAlpha: 0 });
        gsap.set(starsG, { autoAlpha: 0 });
        gsap.set(track, { autoAlpha: 0 });

        // intro — the single life appears
        const intro = gsap.timeline();
        intro
          .to(m, { dotA: 1, duration: 1, ease: "expo.out", onUpdate: render }, 0.1)
          .to(track, { autoAlpha: 0.16, duration: 0.8 }, 0.1)
          .to(starsG, { autoAlpha: 1, duration: 1.4, ease: "power1.out" }, 0)
          .to(meta, { autoAlpha: 1, duration: 0.7 }, 0.45);

        breath = gsap.to(m, {
          breath: 1,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          onUpdate: render,
        });

        // ambient twinkle
        gsap.to(starEls, {
          opacity: () => 0.1 + Math.random() * 0.55,
          duration: () => 1.2 + Math.random() * 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.05, from: "random" },
        });
      }

      // readiness sources
      clock0 = gsap.ticker.time;
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => markDone("fonts"));
      else markDone("fonts");

      if (document.readyState === "complete") markDone("assets");
      else window.addEventListener("load", onLoadEvt, { once: true });

      const onHome = window.location.pathname === "/";
      if (!onHome || window.__parallelHeroReady) markDone("scene");
      else {
        window.addEventListener("parallel:hero-ready", onHeroEvt, { once: true });
        timers.push(gsap.delayedCall(HERO_TIMEOUT, () => markDone("scene")));
      }
      timers.push(
        gsap.delayedCall(HARD_TIMEOUT, () => {
          stages.forEach((s) => markDone(s.key));
        })
      );

      gsap.ticker.add(tickFn);
    }, root);

    return () => {
      if (tickFn) gsap.ticker.remove(tickFn);
      timers.forEach((t) => t.kill());
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", onLoadEvt);
      window.removeEventListener("parallel:hero-ready", onHeroEvt);
      unlock();
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="plx" role="status" aria-live="polite" aria-busy="true">
      <span className="plx__sr">Loading Parallel</span>

      <svg className="plx__svg" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <radialGradient id="plx-glow-a">
            <stop offset="0" stopColor={SAGE} stopOpacity="0.15" />
            <stop offset="0.35" stopColor={SAGE} stopOpacity="0.06" />
            <stop offset="0.7" stopColor={SAGE} stopOpacity="0.014" />
            <stop offset="1" stopColor={SAGE} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="plx-glow-b">
            <stop offset="0" stopColor={PURPLE} stopOpacity="0.2" />
            <stop offset="0.35" stopColor={PURPLE} stopOpacity="0.08" />
            <stop offset="0.7" stopColor={PURPLE} stopOpacity="0.018" />
            <stop offset="1" stopColor={PURPLE} stopOpacity="0" />
          </radialGradient>
          <mask id="plx-mask" maskUnits="userSpaceOnUse">
            <rect data-mask-bg="" fill="#fff" />
            <circle data-hole-a="" fill="#000" r="0" />
            <circle data-hole-b="" fill="#000" r="0" />
          </mask>
        </defs>

        {/* The veil — everything inside is eaten away by the two portals */}
        <g mask="url(#plx-mask)">
          <rect data-veil="" fill={NIGHT} />
          <circle data-glow-a="" fill="url(#plx-glow-a)" opacity="0" />
          <circle data-glow-b="" fill="url(#plx-glow-b)" opacity="0" />
          <g data-stars="" opacity="0">
            {starsRef.current.map((_, i) => (
              <circle key={i} data-star="" fill={PALE} />
            ))}
          </g>
        </g>

        {/* The mark: one ring + one dot that diverge into two */}
        <g>
          <circle data-track="" fill="none" stroke={PALE} opacity="0" />
          <circle data-ring-b="" fill="none" stroke={PALE} strokeOpacity="0.95" opacity="0" />
          <circle data-ring-a="" fill="none" stroke={PALE} strokeOpacity="0.95" pathLength="100" />
          <circle data-dot-a="" fill={SAGE} r="0" />
          <circle data-dot-b="" fill={PURPLE} r="0" />
          <circle data-head="" fill={SAGE} opacity="0" />
        </g>
      </svg>

      <div className="plx__meta" data-meta="">
        <span className="plx__count" data-count="">
          000
        </span>
        <span className="plx__status" data-status="">
          {STAGES[0].label}
        </span>
      </div>

      <div className="plx__word" data-word="">
        <div className="plx__letters" aria-hidden="true">
          {WORD.map((c, i) => (
            <span key={i} className="plx__mask">
              <span className="plx__glyph" data-glyph="">
                {c}
              </span>
            </span>
          ))}
        </div>
        <p className="plx__tag" data-tag="">
          One life <i aria-hidden="true" /> Infinite possibilities
        </p>
      </div>
    </div>
  );
};
