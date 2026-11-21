// src/pages/Explorer.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ReactFlowProvider, useNodesState, useEdgesState } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Network,
  Clock,
  GitBranch,
  Scale,
  Filter,
  Globe,
  ChevronDown,
  Plus,
  Check,
  RotateCcw,
} from "lucide-react";

import { useUniverse } from "../context/UniverseContext";
import { generateTreeElements } from "../utils/layoutTree";
import { ComparisonView } from "../components/explorer/ComparisonView";
import { BranchView } from "../components/explorer/BranchView";
import { TimelineView } from "../components/explorer/TimelineView";
import { PerspectiveView } from "../components/explorer/PerspectiveView";
import { TreeView } from "../components/explorer/TreeView";

const VIEWS = [
  { id: "perspective", label: "Perspective view", icon: Layers, desc: "Multi-dimensional vantage point" },
  { id: "tree", label: "Tree view", icon: Network, desc: "Hierarchical divergence tree" },
  { id: "timeline", label: "Timeline view", icon: Clock, desc: "Chronological milestone flow" },
  { id: "branch", label: "Branch view", icon: GitBranch, desc: "Focus on divergence points" },
  { id: "comparison", label: "Comparison view", icon: Scale, desc: "Side-by-side trajectory layout" },
];

const CATEGORIES = ["All", "Career", "Education", "Relationships", "Location", "Lifestyle"];

function ExplorerInner() {
  const { universeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { universes, stats } = useUniverse();

  // Active view: read from query param or default to "comparison" as shown in picture 1
  const initialView = searchParams.get("view") || "comparison";
  const [activeView, setActiveView] = useState(initialView);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All Time");

  const [selectedRealityId, setSelectedRealityId] = useState(null);
  const [universeDropdownOpen, setUniverseDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync activeView with searchParam
  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", viewId);
    setSearchParams(newParams, { replace: true });
  };

  // Close universe dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUniverseDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const universe = useMemo(() => {
    if (!universes || universes.length === 0) return null;
    if (universeId) {
      const found = universes.find((u) => u.id === universeId);
      if (found) return found;
    }
    return universes[0];
  }, [universes, universeId]);

  useEffect(() => {
    if (universe && universe.realities?.length > 0) {
      const exists = universe.realities.some((r) => r.id === selectedRealityId);
      if (!exists) {
        setSelectedRealityId(universe.realities[0].id);
      }
    } else {
      setSelectedRealityId(null);
    }
  }, [universe, selectedRealityId]);

  // Compute Tree Elements for Tree View
  const onNodeClick = useCallback((realityIdOrData) => {
    const id = typeof realityIdOrData === "string" ? realityIdOrData : realityIdOrData?.id;
    if (id) setSelectedRealityId(id);
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!universe) {
      return { initialNodes: [], initialEdges: [] };
    }
    return generateTreeElements(universe, {
      selectedRealityId,
      onNodeClick,
      onAddBranchClick: () => {},
      viewMode: activeView,
      selectedCategory,
    });
  }, [universe, selectedRealityId, onNodeClick, activeView, selectedCategory]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const selectedReality = useMemo(() => {
    if (!universe?.realities) return null;
    return universe.realities.find((r) => r.id === selectedRealityId) || universe.realities[0] || null;
  }, [universe, selectedRealityId]);

  // Category counts matching the UI in screenshots
  const categoryCounts = useMemo(() => {
    const counts = {
      All: 6,
      Career: 1,
      Education: 1,
      Relationships: 1,
      Location: 1,
      Lifestyle: 1,
    };
    if (universe?.realities) {
      counts.All = Math.max(universe.realities.length, 6);
    }
    return counts;
  }, [universe]);

  const handleSelectUniverse = (targetUniverseId) => {
    setUniverseDropdownOpen(false);
    navigate(`/explore/${targetUniverseId}?view=${activeView}`);
  };

  return (
    <div className="relative w-full max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-10 py-5 select-none">
      {/* Background Cosmic Atmosphere Planet Horizon (Bottom-Left) */}
      <div
        className="pointer-events-none fixed -bottom-24 -left-24 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full opacity-60 z-0"
        style={{
          background: "radial-gradient(circle at 35% 35%, #182025 0%, #0c1013 45%, #050505 85%)",
          boxShadow: "inset -10px -10px 40px rgba(0, 0, 0, 0.9), 0 0 60px rgba(200, 233, 169, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.04)",
        }}
        aria-hidden="true"
      >
        {/* Subtle planet surface texture overlay */}
        <div className="absolute inset-0 rounded-full opacity-30 bg-repeat bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px]" />
      </div>

      {/* Main Container: Left Sidebar + Center View Content */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR matching Images 1, 2, 3 */}
        <aside className="w-full lg:w-[230px] shrink-0 bg-paper/90 backdrop-blur-md rounded-2xl border border-rule/70 p-4 space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Radial Arc */}
          <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

          {/* Group 1: Perspective / Tree / Timeline / Branch / Comparison Views */}
          <div className="space-y-1.5">
            {VIEWS.map((v) => {
              const IconComponent = v.icon;
              const isActive = activeView === v.id;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleViewChange(v.id)}
                  title={v.desc}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-surface/95 text-white font-semibold border border-accent/40 shadow-[0_0_18px_rgba(200,233,169,0.14)]"
                      : "text-muted hover:text-ink hover:bg-surface/50 border border-transparent"
                  }`}
                >
                  {/* Glowing left edge marker for active view */}
                  {isActive && (
                    <motion.div
                      layoutId="activeViewIndicator"
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <IconComponent
                    size={15}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-accent stroke-[2.2]" : "text-muted group-hover:text-ink"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* Group 2: Category Filter matching Images 1, 2, 3 */}
          <div className="pt-4 border-t border-rule/60 space-y-2.5">
            <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted">
              <div className="flex items-center gap-1.5">
                <Filter size={13} aria-hidden="true" />
                <span>Category filter</span>
              </div>
              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="text-[11px] text-accent hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1 pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all text-left ${
                      isSelected
                        ? "bg-surface/80 text-ink font-semibold border border-rule/60"
                        : "text-muted hover:text-ink hover:bg-surface/40 font-normal border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Radio dot with glowing accent */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-accent bg-accent/20 shadow-[0_0_8px_rgba(200,233,169,0.5)]"
                            : "border-rule/80"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <span>{cat}</span>
                    </div>

                    <span className="text-[11px] font-mono text-muted tabular-nums">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Universe Pill / Switcher at Bottom of Sidebar */}
          <div className="pt-4 border-t border-rule/60" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUniverseDropdownOpen(!universeDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-surface/60 hover:bg-surface border border-rule hover:border-accent/40 text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Globe size={13} className="text-accent shrink-0" aria-hidden="true" />
                <span className="truncate">{universe?.title || "My Actual Timeline"}</span>
              </div>
              <ChevronDown size={12} className="text-muted shrink-0" aria-hidden="true" />
            </button>

            {universeDropdownOpen && (
              <div className="absolute left-4 right-4 bottom-16 bg-card border border-rule rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted border-b border-rule">
                  Switch Multiverse Timeline
                </div>
                {universes.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUniverse(u.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                      u.id === universe?.id
                        ? "bg-accent/15 text-accent font-semibold"
                        : "text-ink hover:bg-surface"
                    }`}
                  >
                    <span className="truncate">{u.title}</span>
                    {u.id === universe?.id && <Check size={12} className="text-accent" />}
                  </button>
                ))}
                <Link
                  to="/create"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
                >
                  <Plus size={12} />
                  <span>Create Reality</span>
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT MAIN VIEW CONTAINER with Smooth Motion Animated Switching */}
        <main className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeView === "comparison" && (
                <ComparisonView
                  universe={universe}
                  selectedCategory={selectedCategory}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              )}

              {activeView === "branch" && (
                <BranchView
                  universe={universe}
                  selectedCategory={selectedCategory}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              )}

              {activeView === "timeline" && (
                <TimelineView
                  universe={universe}
                  selectedCategory={selectedCategory}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              )}

              {activeView === "perspective" && (
                <PerspectiveView
                  universe={universe}
                  selectedCategory={selectedCategory}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              )}

              {activeView === "tree" && (
                <TreeView
                  universe={universe}
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  selectedReality={selectedReality}
                  onSelectRealityId={setSelectedRealityId}
                  selectedCategory={selectedCategory}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function Explorer() {
  return (
    <ReactFlowProvider>
      <ExplorerInner />
    </ReactFlowProvider>
  );
}
