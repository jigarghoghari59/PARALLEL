// src/components/landing/UniverseCarousel.jsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  GitBranch,
  Layers,
  Pause,
  Play,
  Share2,
  ExternalLink,
} from "lucide-react";

// #region 3D Pose and Spread Math
const OPEN = 6; // Center spread's slight V at spine, degrees
const SIDE = 82; // How far stacked pages turn towards the middle
const FOLD = 175; // A page folding shut over its partner

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function spreadAspect(stageW, stageH) {
  return stageW < 640 && stageH > stageW ? 0.88 : 1.35;
}

export function spreadWidth(stageW, stageH) {
  if (stageW <= 0 || stageH <= 0) return 0;
  const narrow = stageW < 640;
  return Math.round(
    Math.min(
      stageW * (narrow ? 0.92 : 0.65),
      stageH * 0.82 * spreadAspect(stageW, stageH),
      980
    )
  );
}

export function poseFor(p, w) {
  const d = Math.abs(p);
  const a = d < 1 ? d : 1;
  const s = p < 0 ? -1 : 1;
  const out = d > 1 ? d - 1 : 0;
  const x = s * (a * (w * 0.5 + w * 0.032) + out * w * 0.058);
  const z = -(a * w * 0.44 + out * w * 0.065);
  const fold = a * a;
  const left = p > 0 ? OPEN + (FOLD - OPEN) * fold : OPEN + (SIDE - OPEN) * a;
  const right = p < 0 ? -(OPEN + (FOLD - OPEN) * fold) : -(OPEN + (SIDE - OPEN) * a);
  const shade = (deg) => clamp((Math.abs(deg) - OPEN) / 95, 0, 0.75);

  return {
    x,
    z,
    left,
    right,
    shadeLeft: shade(left),
    shadeRight: shade(right),
    opacity: clamp(5.5 - d, 0, 1),
    hidden: d > 5.5,
  };
}

export function settle(pos, velocity, n) {
  return clamp(
    Math.round(pos + clamp(velocity * 0.18, -1.5, 1.5)),
    0,
    Math.max(0, n - 1)
  );
}

export function durationFor(steps) {
  return steps <= 0 ? 0 : Math.round(540 * Math.sqrt(Math.min(steps, 10)));
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
// #endregion

// Default Curated Universes
const DEFAULT_CARDS = [
  {
    id: "u-space-explorer",
    sector: "SECTOR 01 // ORBITAL",
    title: "The Space Explorer",
    subtitle: "Reach for the stars",
    tag: "Adventure",
    image: "/images/carousel-space-explorer.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=85",
    description:
      "Orbital mission architect and deep-space habitat pioneer on humanity's expanding interstellar frontier.",
    branchPoint: "Year 2038 · Lunar Base Alpha",
    divergence: "89% Divergent",
    nodes: 18,
    stability: "Stable",
    log: "Atmospheric scrubbers stabilized over Mare Tranquillitatis. Earth hangs silent like a marbled sapphire in the viewport.",
  },
  {
    id: "u-tech-pioneer",
    sector: "SECTOR 02 // QUANTUM",
    title: "The Tech Pioneer",
    subtitle: "Build a life in technology",
    tag: "Career",
    image: "/images/carousel-tech-pioneer.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    description:
      "Leading deep tech, quantum computing, and neuromorphic engineering across decentralized silicon hubs.",
    branchPoint: "Year 2031 · MIT Breakthrough",
    divergence: "76% Divergent",
    nodes: 24,
    stability: "High Resonance",
    log: "First coherent 10,000-qubit mesh brought online. Room-temperature superconductors reshape global energy grids.",
  },
  {
    id: "u-peaceful-life",
    sector: "SECTOR 03 // SANCTUARY",
    title: "The Peaceful Life",
    subtitle: "Find happiness within",
    tag: "Lifestyle",
    image: "/images/carousel-peaceful-life.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
    description:
      "A restorative mountain sanctuary centered on organic craft, clean daylight, and unhurried intellectual clarity.",
    branchPoint: "Year 2029 · Alpine Retreat",
    divergence: "64% Divergent",
    nodes: 12,
    stability: "Tranquil",
    log: "Morning fog lifts through the pines. Woodsmoke, warm cedar, and the quiet click of analog printing presses.",
  },
  {
    id: "u-global-nomad",
    sector: "SECTOR 04 // MERIDIAN",
    title: "The Global Nomad",
    subtitle: "See the world",
    tag: "Success",
    image: "/images/carousel-global-nomad.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
    description:
      "Borderless strategic consultancy operating seamlessly across thirty capital cities with zero fixed footprint.",
    branchPoint: "Year 2030 · First Flight Out",
    divergence: "82% Divergent",
    nodes: 31,
    stability: "Fluid",
    log: "Sunrise over Lisbon, evening tea in Kyoto. The entire world converted into a fluid workspace of serendipity.",
  },
  {
    id: "u-oceanic-frontier",
    sector: "SECTOR 05 // ABYSSAL",
    title: "The Deep Frontier",
    subtitle: "Pioneer the ocean depths",
    tag: "Frontier",
    image:
      "https://images.unsplash.com/photo-1505342541109-05b39f95f795?auto=format&fit=crop&w=1200&q=85",
    fallbackImage:
      "https://images.unsplash.com/photo-1505342541109-05b39f95f795?auto=format&fit=crop&w=1200&q=85",
    description:
      "Sub-surface ecological habitats, hydro-thermal research towers, and bioluminescent deep-sea agriculture.",
    branchPoint: "Year 2035 · Mariana Base",
    divergence: "94% Divergent",
    nodes: 16,
    stability: "Pressurized",
    log: "Hydrothermal vents flicker amber outside the panoramic titanium dome. Marine biodiversity thriving in silence.",
  },
];

export const UniverseCarousel = ({ customUniverses = [] }) => {
  const navigate = useNavigate();

  // Combine custom universes if available
  const spreads = useMemo(() => {
    if (!customUniverses || customUniverses.length === 0) {
      return DEFAULT_CARDS;
    }
    // Map custom universes into card format
    const formattedCustom = customUniverses.slice(0, 5).map((u, i) => ({
      id: u.id || `custom-${i}`,
      sector: `CUSTOM SECTOR // 0${i + 1}`,
      title: u.name || u.title || "Custom Reality",
      subtitle: u.description?.slice(0, 40) || "Branching pathway",
      tag: u.category || "Reality",
      image: u.coverImage || DEFAULT_CARDS[i % DEFAULT_CARDS.length].image,
      fallbackImage: DEFAULT_CARDS[i % DEFAULT_CARDS.length].fallbackImage,
      description: u.description || "An alternate trajectory simulated in the PARALLEL engine.",
      branchPoint: u.rootChoice || "Divergence Genesis",
      divergence: `${70 + (i * 7) % 25}% Divergent`,
      nodes: u.realitiesCount || 8,
      stability: "Active",
      log: u.notes || "Speculative timeline node initialized with branching probability trees.",
    }));
    return formattedCustom.length > 0 ? formattedCustom : DEFAULT_CARDS;
  }, [customUniverses]);

  const n = spreads.length;
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const items = useRef([]);
  const pages = useRef([]);
  const width = useRef(0);
  const pos = useRef(0);
  const target = useRef(0);
  const tween = useRef(null);
  const raf = useRef(0);
  const drag = useRef(null);
  const touched = useRef(false);
  const reducedRef = useRef(false);

  // Paint 3D transformation matrices for each spread
  const paint = useCallback(() => {
    const w = width.current;
    if (!w) return;

    for (let i = 0; i < items.current.length; i++) {
      const el = items.current[i];
      if (!el) continue;

      const q = poseFor(i - pos.current, w);
      if (q.hidden) {
        el.style.visibility = "hidden";
        continue;
      }

      el.style.visibility = "visible";
      el.style.opacity = String(q.opacity);
      el.style.transform = `translate3d(${q.x.toFixed(2)}px, 0, ${q.z.toFixed(2)}px)`;

      const l = pages.current[i * 2];
      const r = pages.current[i * 2 + 1];
      if (l) {
        l.style.transform = `rotateY(${q.left.toFixed(2)}deg)`;
        l.style.setProperty("--jsc-s", q.shadeLeft.toFixed(3));
      }
      if (r) {
        r.style.transform = `rotateY(${q.right.toFixed(2)}deg)`;
        r.style.setProperty("--jsc-s", q.shadeRight.toFixed(3));
      }
    }
  }, []);

  // Animation frame loop
  const frame = useCallback(
    (t) => {
      raf.current = 0;
      const tw = tween.current;
      if (tw) {
        const k = tw.dur > 0 ? clamp((t - tw.t0) / tw.dur, 0, 1) : 1;
        pos.current = tw.from + (tw.to - tw.from) * tw.ease(k);
        if (k >= 1) tween.current = null;
      }
      paint();
      if (tween.current) raf.current = requestAnimationFrame(frame);
    },
    [paint]
  );

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(frame);
  }, [frame]);

  const go = useCallback(
    (to, ease = easeInOut) => {
      const next = clamp(to, 0, Math.max(0, n - 1));
      if (next !== target.current) {
        target.current = next;
        setIndex(next);
      }
      const dur = reducedRef.current ? 0 : durationFor(Math.abs(next - pos.current));
      tween.current = { from: pos.current, to: next, t0: performance.now(), dur, ease };
      kick();
    },
    [n, kick]
  );

  // ResizeObserver: measure stage once and store width
  useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width: sw, height: sh } = entry.contentRect;
      const w = spreadWidth(sw, sh);
      width.current = w;
      root.style.setProperty("--jsc-w", `${w}px`);
      root.style.setProperty("--jsc-h", `${Math.round(w / spreadAspect(sw, sh))}px`);
      paint();
    });

    ro.observe(stage);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [paint]);

  // Autoplay functionality
  useEffect(() => {
    const root = rootRef.current;
    if (!isAutoPlayActive || n < 2 || !root) return;

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(root);

    const id = window.setInterval(() => {
      if (touched.current || !visible || document.hidden || drag.current) return;
      go(target.current >= n - 1 ? 0 : target.current + 1);
    }, 4500);

    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [isAutoPlayActive, n, go]);

  const stopAutoPlay = () => {
    touched.current = true;
  };

  // Pointer Drag Handlers
  const onPointerDown = (e) => {
    if (e.button !== 0 || n < 1) return;
    stopAutoPlay();
    tween.current = null;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      from: pos.current,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    const w = width.current;
    if (!d || d.id !== e.pointerId || !w) return;

    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (!d.moved) return;

    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = d.v * 0.6 + (-(e.clientX - d.lastX) / (w * 0.42) / (dt / 1000)) * 0.4;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    pos.current = clamp(d.from - dx / (w * 0.42), -0.3, n - 0.7);
    kick();
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);

    if (d.moved) {
      go(settle(pos.current, d.v, n), easeOut);
      return;
    }

    const hit = e.target.closest("[data-i]");
    const i = hit ? Number(hit.getAttribute("data-i")) : target.current;
    go(i);
  };

  const onKeyDown = (e) => {
    const map = {
      ArrowRight: 1,
      ArrowDown: 1,
      PageDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
      PageUp: -1,
    };
    if (e.key in map) {
      e.preventDefault();
      stopAutoPlay();
      go(target.current + map[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      stopAutoPlay();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      stopAutoPlay();
      go(n - 1);
    }
  };

  const current = spreads[index] || spreads[0];

  return (
    <section
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative z-20 w-full min-h-[820px] lg:min-h-[920px] flex flex-col justify-between bg-paper overflow-hidden select-none py-10 lg:py-14 outline-none"
      style={{
        "--jsc-w": "920px",
        "--jsc-h": "580px",
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(100%_70%_at_50%_40%,var(--color-accent)_0%,transparent_75%)] opacity-[0.035]" />

      {/* Top Header Row matching PARALLEL design */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 mb-6 shrink-0 relative z-30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-ink leading-none">
              Step into different possibilities
            </h2>
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-accent transition-colors group cursor-pointer"
            >
              <span>View all universes</span>
              <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  go(target.current - 1);
                }}
                disabled={index === 0}
                aria-label="Previous universe"
                className="w-9 h-9 rounded-full bg-surface hover:bg-accent text-ink hover:text-accent-ink disabled:opacity-30 disabled:pointer-events-none border border-rule hover:border-accent flex items-center justify-center transition-colors cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  go(target.current + 1);
                }}
                disabled={index === n - 1}
                aria-label="Next universe"
                className="w-9 h-9 rounded-full bg-surface hover:bg-accent text-ink hover:text-accent-ink disabled:opacity-30 disabled:pointer-events-none border border-rule hover:border-accent flex items-center justify-center transition-colors cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Journal / Book Stage Area */}
      <div
        ref={stageRef}
        data-drag={dragging ? "" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]"
      >
        {/* Ambient Floor Shadow under the book */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none -translate-x-1/2 translate-y-[24%] rounded-[30%] bg-black/90 opacity-70 blur-[40px]"
          style={{
            width: "calc(var(--jsc-w) * 1.3)",
            height: "calc(var(--jsc-h) * 0.45)",
          }}
          aria-hidden="true"
        />

        {/* 3D Perspective Viewport */}
        <div
          className="absolute inset-0 overflow-visible"
          style={{
            perspective: "calc(var(--jsc-w) * 2.4)",
            perspectiveOrigin: "50% 48%",
          }}
        >
          {/* Centered 3D Scene */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {spreads.map((card, i) => (
              <div
                key={card.id || i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                data-i={i}
                role="group"
                aria-label={`${card.title}, Spread ${i + 1} of ${n}`}
                className="absolute left-0 top-0"
                style={{
                  transformStyle: "preserve-3d",
                  visibility: "hidden",
                }}
              >
                {/* Double Pages: Left and Right */}
                {["l", "r"].map((side, sideIdx) => {
                  const isLeft = side === "l";

                  return (
                    <div
                      key={side}
                      ref={(el) => {
                        pages.current[i * 2 + sideIdx] = el;
                      }}
                      data-side={side}
                      className="absolute overflow-hidden bg-card border border-rule shadow-2xl"
                      style={{
                        top: "calc(var(--jsc-h) * -0.5)",
                        width: "calc(var(--jsc-w) * 0.5)",
                        height: "var(--jsc-h)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        left: isLeft ? "calc(var(--jsc-w) * -0.5)" : "0px",
                        transformOrigin: isLeft ? "100% 50%" : "0% 50%",
                        borderRadius: isLeft
                          ? "calc(var(--jsc-w) * 0.02) 0 0 calc(var(--jsc-w) * 0.02)"
                          : "0 calc(var(--jsc-w) * 0.02) calc(var(--jsc-w) * 0.02) 0",
                      }}
                    >
                      {/* PAGE CONTENT */}
                      {isLeft ? (
                        /* LEFT PAGE: Cinematic Visual Cover */
                        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-paper-2 overflow-hidden">
                          {/* Background Artwork */}
                          <div className="absolute inset-0 bg-paper">
                            <img
                              src={card.image}
                              alt={card.title}
                              draggable={false}
                              onError={(e) => {
                                e.currentTarget.src = card.fallbackImage;
                              }}
                              className="w-full h-full object-cover opacity-75 contrast-105 select-none pointer-events-none"
                            />
                            {/* Layered Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-paper/60" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-paper/50" />
                          </div>

                          {/* Top Specular Hairline */}
                          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10 pointer-events-none" />

                          {/* Top Meta Bar */}
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-medium text-accent bg-paper/60 px-2.5 py-1 rounded-md border border-rule">
                              {card.sector}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper/75 border border-rule">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              <span className="text-xs font-semibold text-ink">
                                {card.tag}
                              </span>
                            </span>
                          </div>

                          {/* Center Pinned Polaroid / Branch Snippet */}
                          <div className="relative z-10 my-auto py-2">
                            <div className="inline-block">
                              <span className="inline-block px-3 py-1 text-xs text-accent-ink bg-accent font-semibold rounded mb-2">
                                Divergence active
                              </span>
                            </div>
                          </div>

                          {/* Bottom Left Page Typography */}
                          <div className="relative z-10 pt-4">
                            <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-ink tracking-tight leading-tight mb-1.5">
                              {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm font-semibold text-accent tracking-wide flex items-center gap-2">
                              <span>{card.subtitle}</span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* RIGHT PAGE: Archival Field Dossier & Action */
                        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-paper-2 overflow-hidden text-ink">
                          {/* Right Page Header */}
                          <div className="relative z-10 pb-3 border-b border-rule flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GitBranch size={13} className="text-accent" aria-hidden="true" />
                              <span className="text-xs text-muted">
                                Archive log : {card.id}
                              </span>
                            </div>
                            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                              {card.divergence}
                            </span>
                          </div>

                          {/* Narrative & Field Notes */}
                          <div className="relative z-10 flex-1 flex flex-col justify-center py-4 space-y-4">
                            {/* Universe Overview */}
                            <div>
                              <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted">
                                {card.description}
                              </p>
                            </div>

                            {/* Speculative Branch Log Card */}
                            <div className="p-3.5 sm:p-4 rounded-md border border-rule/50 relative overflow-hidden">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Compass size={12} className="text-purple" aria-hidden="true" />
                                <span className="text-xs font-semibold text-purple">
                                  Branch observation
                                </span>
                              </div>
                              <p className="text-xs italic text-ink/90 leading-snug">
                                &ldquo;{card.log}&rdquo;
                              </p>
                              <div className="mt-2 pt-2 border-t border-rule/50 flex items-center justify-between text-xs text-muted">
                                <span>Anchor: {card.branchPoint}</span>
                                <span className="text-accent">{card.nodes} Nodes</span>
                              </div>
                            </div>

                            {/* Speculative Fiction Notice */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/40 border border-rule">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple" aria-hidden="true" />
                              <span className="text-xs text-muted/80">
                                Speculative fiction: branch reflects simulated probability.
                              </span>
                            </div>
                          </div>

                          {/* Right Page Action Footer */}
                          <div className="relative z-10 pt-3 border-t border-rule flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/explore?search=${encodeURIComponent(card.title)}`);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-ink font-semibold text-xs hover:bg-accent/90 active:scale-[0.98] transition-colors shadow-sm group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                            >
                              <span>Explore timeline</span>
                              <ArrowRight size={13} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/simulate?name=${encodeURIComponent(card.title)}`);
                              }}
                              title="Simulate Divergence"
                              className="w-10 h-10 rounded-btn bg-surface hover:bg-surface/80 border border-rule flex items-center justify-center text-muted hover:text-accent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                            >
                              <Compass size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Spine Gutter Lighting */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: isLeft
                            ? "linear-gradient(90deg, rgba(255,255,255,0) 80%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.48) 100%)"
                            : "linear-gradient(270deg, rgba(255,255,255,0) 80%, rgba(0,0,0,0.18) 92%, rgba(0,0,0,0.48) 100%)",
                        }}
                      />

                      {/* Dynamic 3D Curvature Shading */}
                      <div
                        className="absolute inset-0 pointer-events-none bg-paper"
                        style={{ opacity: "var(--jsc-s, 0)" }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Spread Indicators & Controls */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 mt-4 shrink-0 relative z-30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          {/* Active Spread Title and Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-accent font-semibold tabular-nums">
              0{index + 1} / 0{n}
            </span>
            <span className="w-1 h-1 rounded-full bg-rule" />
            <span className="text-xs font-semibold text-ink truncate max-w-[200px] sm:max-w-[280px]">
              {current.title}
            </span>
            <span className="text-xs text-muted">
              ({current.subtitle})
            </span>
          </div>

          {/* Interactive Pagination Spread Pills */}
          <div className="flex items-center gap-2">
            {spreads.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  go(i);
                }}
                aria-label={`Jump to universe ${i + 1}`}
                className={`transition-colors duration-150 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  i === index
                    ? "w-7 h-1.5 bg-accent"
                    : "w-1.5 h-1.5 bg-rule hover:bg-muted"
                }`}
              />
            ))}
          </div>

          {/* AutoPlay Pause / Resume Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlayActive((prev) => !prev);
                touched.current = false;
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {isAutoPlayActive ? (
                <>
                  <Pause size={12} className="text-accent" aria-hidden="true" />
                  <span>Autoplay on</span>
                </>
              ) : (
                <>
                  <Play size={12} aria-hidden="true" />
                  <span>Paused</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniverseCarousel;
