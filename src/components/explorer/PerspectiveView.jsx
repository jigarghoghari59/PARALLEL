// src/components/explorer/PerspectiveView.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronDown,
  Compass,
  Calendar,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PerspectiveView({
  universe,
  selectedCategory = "All",
  timeFilter = "All Time",
  onTimeFilterChange,
}) {
  const navigate = useNavigate();
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [activePerspectiveIndex, setActivePerspectiveIndex] = useState(0);

  const perspectives = [
    {
      id: "p1",
      badge: "Vantage A",
      title: "Software Architect",
      trajectory: "San Francisco, CA • Distributed Core",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
      coherence: "96%",
      velocity: "+18% / yr",
      category: "Career",
      tags: ["Distributed Systems", "Cloud Scale", "Zero-Latency"],
      summary: "High algorithmic velocity in planetary computing networks.",
      realityId: "real-software-dev",
    },
    {
      id: "p2",
      badge: "Vantage B",
      title: "Travel Photographer",
      trajectory: "Worldwide • Autonomous Nomadic",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
      coherence: "91%",
      velocity: "Nomadic Flow",
      category: "Lifestyle",
      tags: ["Wilderness", "Cultural Immersion", "Expedition"],
      summary: "Panoramic documentation across six continents.",
      realityId: "real-mechanical-eng",
    },
    {
      id: "p3",
      badge: "Vantage C",
      title: "Venture Founder",
      trajectory: "Silicon Valley • Deep Intelligence",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
      coherence: "88%",
      velocity: "High Leverage",
      category: "Career",
      tags: ["Equity Value", "Venture Seed", "Team Lead"],
      summary: "Foundational builder shaping sovereign artificial intelligence platforms.",
      realityId: "real-product-manager",
    },
  ];

  const filteredPerspectives = perspectives.filter((p) => {
    if (!selectedCategory || selectedCategory === "All") return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeP = perspectives[activePerspectiveIndex] || perspectives[0];
  const timeOptions = ["All Time", "2026 - 2030", "Past 5 Years", "Milestones Only"];

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-rule/50">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent">
              <Layers size={16} aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Perspective view
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Multi-dimensional vantage point across divergent realities.
          </p>
        </div>

        {/* Time Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Clock size={13} className="text-muted" aria-hidden="true" />
            <span>{timeFilter}</span>
            <ChevronDown
              size={12}
              className={`text-muted transition-transform duration-200 ${
                timeDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {timeDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-card border border-rule shadow-xl p-1.5 z-50">
              {timeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onTimeFilterChange?.(opt);
                    setTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    timeFilter === opt
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Perspective 3D Dimensional Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredPerspectives.map((p, idx) => {
          const isActive = idx === activePerspectiveIndex;

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setActivePerspectiveIndex(idx)}
              className={`rounded-2xl border p-5 bg-card/80 backdrop-blur-sm flex flex-col justify-between cursor-pointer transition-all shadow-md group ${
                isActive
                  ? "border-accent ring-1 ring-accent shadow-[0_0_24px_rgba(200,233,169,0.2)]"
                  : "border-rule hover:border-rule/80 hover:bg-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isActive
                        ? "bg-accent/15 text-accent border-accent/40"
                        : "bg-surface text-muted border-rule"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-[11px] font-mono text-accent">
                    {p.coherence} coherence
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink leading-snug group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted mt-0.5 truncate">{p.trajectory}</p>

                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-surface border border-rule/50 my-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
                </div>

                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {p.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-surface border border-rule/50 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-rule/50 mt-4 flex items-center justify-between text-xs">
                <span className="text-muted font-medium">Trajectory: {p.velocity}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/universe/${universe?.id || "uni-computer-eng-01"}/reality/${p.realityId}`
                    );
                  }}
                  className="flex items-center gap-1 text-accent font-semibold hover:underline"
                >
                  <span>Explore</span>
                  <ArrowRight size={12} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
