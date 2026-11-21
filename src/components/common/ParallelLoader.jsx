// src/components/common/ParallelLoader.jsx
// Official PARALLEL Cinematic Loading Experience & Landing Page Arrival Transition
// Adapted from Animorio "Square-tile logo loader" with pure text transformation to "PARALLEL".

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./ParallelLoader.css";

gsap.registerPlugin(useGSAP);

const LETTERS = ["P", "A", "R", "A", "L", "L", "E", "L"];

export const ParallelLoader = ({ onTransitionStart }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      /* ---- Timing parameters matching demo ---- */
      const LOAD_TIME = 2.8;   /* seconds loading takes from 0% to 100% */
      const WAIT_AT_100 = 0.8; /* seconds row stays lit at 100% before text replacement */
      const FLASHES = 4;       /* times the first square flashes */
      const FLASH_SIZE = 3;    /* how big the first square starts before shrinking */
      const FAINT = 0.2;       /* visibility of squares before their turn */
      const SCRAMBLE = 0.8;    /* seconds scrambled words take to settle */
      const OUT = "cubic-bezier(0.2, 0, 0, 1)";
      const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const $ = (s) => container.querySelector(s);
      const $$ = (s, r = container) => [...r.querySelectorAll(s)];

      const loader = $("[data-loader]");
      const center = $("[data-center]");
      const count = $("[data-count]");
      const loading = $("[data-loading]");
      const flash = $("[data-flash]");
      const loaded = $("[data-loaded]");
      const ready = $("[data-ready]");
      const replay = $("[data-replay]");

      // 8 Squares and 8 Letters of the PARALLEL row
      const squares = $$("[data-sq]");
      const chars = $$("[data-char]");

      // 4 symmetrical pairs from outside in (P-L, A-E, R-L, A-L)
      const pairs = [
        [squares[0], squares[7]],
        [squares[1], squares[6]],
        [squares[2], squares[5]],
        [squares[3], squares[4]],
      ];

      // Progress stops
      const STOPS = [
        { p: 25, d: 0.22, ease: "power2.out" },
        { p: 48, d: 0.16, ease: "power1.inOut" },
        { p: 74, d: 0.26, ease: "power2.inOut" },
        { p: 93, d: 0.2, ease: "power3.out" },
        { p: 97, d: 0.08, ease: "none" },
        { p: 100, d: 0.08, ease: "power2.in" },
      ];

      let tl = null;

      // Scramble text helper
      function scrambleTo(element, targetText, duration = 0.8) {
        if (!element) return;
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = targetText.length;
        let frame = 0;
        const totalFrames = Math.max(1, Math.round(duration * 60));
        const interval = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const revealed = Math.floor(progress * length);
          let str = "";
          for (let i = 0; i < length; i++) {
            if (targetText[i] === " ") {
              str += " ";
            } else if (i < revealed) {
              str += targetText[i];
            } else {
              str += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
          }
          element.textContent = str;
          if (frame >= totalFrames) {
            clearInterval(interval);
            element.textContent = targetText;
          }
        }, 1000 / 60);
      }

      function reset() {
        if (tl) tl.kill();
        gsap.set(loader, { autoAlpha: 1 });
        gsap.set(center, { autoAlpha: 1 });
        gsap.set(count, { left: "50%", xPercent: -50, autoAlpha: 0 });
        gsap.set(loading, { left: "50%", xPercent: -50, autoAlpha: 0 });
        gsap.set(flash, { autoAlpha: 0, scale: FLASH_SIZE });
        gsap.set(squares, { autoAlpha: 0, scale: 1 });
        gsap.set(chars, { autoAlpha: 0, y: 8, scale: 0.95, filter: "blur(6px)" });
        if (loaded) loaded.textContent = "";
        if (ready) ready.textContent = "";
        if (count) count.textContent = "0%";
        gsap.set(replay, { autoAlpha: 0 });

        // Set initial landing page hidden state for playPage arrival
        gsap.set("[data-page-logo], [data-page-nav-right]", { autoAlpha: 0 });
        gsap.set("[data-page-voce]", { autoAlpha: 0, y: -8 });
        gsap.set("[data-page-label]", { autoAlpha: 0 });
        gsap.set("[data-page-char]", { autoAlpha: 0, y: 12 });
        gsap.set("[data-page-line], [data-page-actions]", { autoAlpha: 0, y: 16 });
      }

      // Exact landing page arrival sequence from demo (playPage)
      function playPage(t, at) {
        // 1. Header nav logo
        t.to("[data-page-logo]", { autoAlpha: 1, duration: 0.4 }, at);

        // 2. Nav items arrive with stagger
        t.to("[data-page-voce]", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: OUT }, at + 0.1);
        t.to("[data-page-nav-right]", { autoAlpha: 1, duration: 0.5 }, at + 0.15);

        // 3. Status label flickers on like a light finding its contact
        t.to("[data-page-label]", { autoAlpha: 1, duration: 1 / 8, repeat: 7, yoyo: true, ease: "none" }, at + 0.15);
        t.set("[data-page-label]", { autoAlpha: 1 }, at + 0.15 + 8 / 8);

        // 4. Headline characters arrive with random stagger
        t.to("[data-page-char]", { autoAlpha: 1, y: 0, duration: 0.45, ease: OUT, stagger: { amount: 0.85, from: "random" } }, at + 0.22);

        // 5. Subtitle description line glides up
        t.fromTo("[data-page-line]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: OUT }, at + 0.6);

        // 6. Action buttons glide up
        t.fromTo("[data-page-actions]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: OUT }, at + 0.72);

        // 7. Replay pill button appears at bottom center
        t.to(replay, { autoAlpha: 1, duration: 0.5 }, at + 1.2);
      }

      function play() {
        reset();
        tl = gsap.timeline();

        if (REDUCED) {
          gsap.set(chars, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
          if (loaded) loaded.textContent = "100% Loaded";
          if (ready) ready.textContent = "Ready to Explore";
          tl.to(center, { autoAlpha: 1, duration: 0.8 }, 0.2)
            .to(loader, { autoAlpha: 0, duration: 0.6 }, 2.0)
            .to("[data-page-logo], [data-page-voce], [data-page-nav-right], [data-page-label], [data-page-char], [data-page-line], [data-page-actions]", { autoAlpha: 1, y: 0, duration: 0.6 }, 2.2)
            .to(replay, { autoAlpha: 1, duration: 0.5 }, 2.6);
          return;
        }

        // ============================================================
        // 1. The first square: starts big, shrinks into place while flashing 4x
        // ============================================================
        tl.to(flash, { scale: 1, duration: 0.2, ease: "power2.out" }, 0);
        for (let i = 0; i < FLASHES; i++) {
          const at = i * 0.1;
          tl.to(flash, { autoAlpha: 1, duration: 0.05, ease: "power1.in" }, at);
          if (i < FLASHES - 1) {
            tl.to(flash, { autoAlpha: 0, duration: 0.05, ease: "power1.out" }, at + 0.05);
          }
        }
        let t0 = Math.max(0.2, FLASHES * 0.1);

        // ============================================================
        // 2. Counter slides off to top right; words slide to bottom left; squares appear faint
        // ============================================================
        const slideOut = (pairs.length - 1) * 0.033 + 0.15;
        tl.to(count, { left: "102%", xPercent: -100, duration: slideOut, ease: "power2.out" }, t0)
          .to(count, { autoAlpha: 0.4, duration: 0.9 }, t0)
          .to(loading, { left: "0%", xPercent: 0, duration: slideOut, ease: "power2.out" }, t0)
          .to(loading, { autoAlpha: 0.4, duration: 0.9 }, t0);

        pairs.forEach((pr, i) => {
          tl.to(pr, { autoAlpha: FAINT, duration: 0.15, ease: "power2.out" }, t0 + i * 0.033);
        });
        t0 += slideOut + 0.1;

        // ============================================================
        // 3. Progress: counter & words get brighter; pairs light up from outside in
        // ============================================================
        const prog = { p: 0 };
        let lit = 0;
        const onProg = () => {
          const p = Math.round(prog.p);
          if (count) count.textContent = p + "%";
          const a = 0.4 + (p / 100) * 0.6;
          gsap.set([count, loading], { opacity: a });
          const want = Math.min(pairs.length, Math.floor(p / (100 / pairs.length) + 1e-6));
          while (lit < want) {
            gsap.to(pairs[lit], { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
            lit++;
          }
        };

        STOPS.forEach((s) => {
          tl.to(prog, { p: s.p, duration: s.d * LOAD_TIME, ease: s.ease, onUpdate: onProg }, t0);
          t0 += s.d * LOAD_TIME;
        });

        // ============================================================
        // 4. At 100%: words fade; anticipation pause
        // ============================================================
        t0 += WAIT_AT_100;
        tl.to([count, loading], { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, t0);

        // ============================================================
        // 5. Seamless Text Replacement: Squares bloom and replace with "PARALLEL"
        // ============================================================
        // Squares glow & scale up slightly
        tl.to(squares, { scale: 1.35, duration: 0.3, ease: "power2.out" }, t0)
          .to(squares, { autoAlpha: 0, scale: 0.7, duration: 0.28, ease: "power2.in" }, t0 + 0.22);

        // Characters of "PARALLEL" emerge in their exact slots
        tl.to(
          chars,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.55,
            ease: OUT,
            stagger: { amount: 0.22, from: "center" },
          },
          t0 + 0.18
        );

        // Scrambled texts settle underneath
        tl.call(() => scrambleTo(loaded, "100% Loaded", SCRAMBLE), null, t0 + 0.3)
          .call(() => scrambleTo(ready, "Ready to Explore", SCRAMBLE), null, t0 + 0.4);

        // ============================================================
        // 6. The veil lifts and the landing page arrives underneath
        // ============================================================
        t0 += 0.55 + SCRAMBLE + 0.5;

        tl.call(() => {
          onTransitionStart?.();
        }, null, t0);

        tl.to(loader, { autoAlpha: 0, duration: 0.5 }, t0);
        playPage(tl, t0 + 0.15);
      }

      if (replay) {
        replay.addEventListener("click", play);
      }

      // Initial start on font ready
      document.fonts.ready.then(play);

      return () => {
        if (tl) tl.kill();
        if (replay) {
          replay.removeEventListener("click", play);
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {/* The Loader Screen */}
      <div className="caricamento" data-loader="" role="status" aria-live="polite">
        <div className="centro" data-center="">
          {/* Percentage Counter (slides top right) */}
          <div className="numero" data-count="">
            0%
          </div>

          {/* Flash Square (first signal) */}
          <div className="lampo" data-flash="" />

          {/* Pure Text Replacement Track */}
          <div className="word-track">
            {LETTERS.map((char, index) => (
              <div key={index} className="char-slot">
                <div className="char-square" data-sq="" />
                <span className="char-glyph" data-char="">
                  {char}
                </span>
              </div>
            ))}
          </div>

          {/* Loading content label (slides bottom left) */}
          <div className="dicitura" data-loading="">
            Loading content
          </div>

          {/* Scramble text container underneath */}
          <div className="pronto">
            <span data-loaded="">100% Loaded</span>
            <span data-ready="">Ready to Explore</span>
          </div>
        </div>
      </div>

      {/* Floating Replay Button from the Demo */}
      <button
        className="pillola"
        type="button"
        data-replay=""
        title="Replay cinematic loader"
      >
        <span className="pillola__scritta" data-testo="Replay">
          Replay
        </span>
      </button>
    </div>
  );
};
