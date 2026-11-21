// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[65dvh] flex items-center justify-center p-6 select-none">
      <div className="relative z-10 rounded-card p-8 sm:p-10 max-w-lg w-full text-center bg-card border border-rule">
        {/* Compass Icon */}
        <div className="w-14 h-14 rounded-full bg-surface border border-rule flex items-center justify-center text-accent mx-auto mb-5">
          <Compass size={28} className="motion-safe:animate-spin duration-1000" style={{ animationDuration: "20s" }} aria-hidden="true" />
        </div>

        {/* 404 Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-rule w-fit mx-auto mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          <span className="text-xs font-medium text-ink">
            404 &bull; Dimension uncharted
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-2">
          Timeline divergence lost
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6 max-w-sm mx-auto">
          The coordinate you requested does not exist in any explored parallel timeline. It may have collapsed into an unobserved probability wave.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Home size={14} aria-hidden="true" /> Return home
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule text-ink text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Layers size={14} className="text-accent" aria-hidden="true" /> Multiverse explorer
          </Link>
        </div>
      </div>
    </div>
  );
}
