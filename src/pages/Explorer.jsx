// src/pages/Explorer.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Box,
  GitBranch,
  Network,
  Scale,
  Filter,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

import { useUniverse } from "../context/UniverseContext";
import {
  DecisionRootNode,
  JunctionNode,
  RealityNode,
  AddBranchNode,
} from "../components/universe/CustomNodes";
import { RealityDetailPanel } from "../components/universe/RealityDetailPanel";
import { generateTreeElements } from "../utils/layoutTree";
import { BranchModal } from "../components/timeline/BranchModal";

// Register custom React Flow node components
const nodeTypes = {
  decisionRoot: DecisionRootNode,
  junction: JunctionNode,
  realityCard: RealityNode,
  addBranch: AddBranchNode,
};

const CATEGORIES = ["All", "Career", "Education", "Relationships", "Location", "Lifestyle"];

const VIEWS = [
  { id: "timeline", label: "Timeline View", icon: Box },
  { id: "branch", label: "Branch View", icon: GitBranch },
  { id: "tree", label: "Tree View", icon: Network },
  { id: "comparison", label: "Comparison View", icon: Scale },
];

/**
 * Zoom Controls connected directly to React Flow instance
 */
function ZoomToolbar({ zoomLevel, onZoomChange }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex items-center gap-2 bg-[#0B0D0E]/90 border border-[#292C2C] rounded-full px-3.5 py-1.5 shadow-xl backdrop-blur-md text-xs text-[#A5A7A3]">
      <span className="text-[11px] font-medium text-[#A5A7A3]">Zoom:</span>
      <button
        onClick={() => {
          zoomOut();
          onZoomChange((z) => Math.max(0.4, z - 0.15));
        }}
        className="w-5 h-5 rounded flex items-center justify-center hover:text-white transition-colors"
        aria-label="Zoom out"
      >
        <ZoomOut size={13} />
      </button>

      {/* Interactive slider / visual bar */}
      <div className="w-16 h-1 bg-[#1A1D20] rounded-full relative flex items-center">
        <div
          className="absolute h-1 bg-[#C8E9A9]/70 rounded-full"
          style={{ width: `${Math.min(100, Math.max(10, zoomLevel * 60))}%` }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]"
          style={{ left: `calc(${Math.min(90, Math.max(5, zoomLevel * 55))}% - 5px)` }}
        />
      </div>

      <button
        onClick={() => {
          zoomIn();
          onZoomChange((z) => Math.min(2.0, z + 0.15));
        }}
        className="w-5 h-5 rounded flex items-center justify-center hover:text-white transition-colors"
        aria-label="Zoom in"
      >
        <ZoomIn size={13} />
      </button>

      <button
        onClick={() => {
          fitView({ padding: 0.25, duration: 400 });
          onZoomChange(1);
        }}
        className="w-6 h-6 rounded-md bg-white/[0.04] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#C8E9A9]/40 ml-1 transition-colors"
        aria-label="Fit view"
      >
        <Maximize2 size={11} />
      </button>
    </div>
  );
}

/**
 * Inner Explorer Canvas with state & interaction management
 */
function ExplorerContent() {
  const { universeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { universes, stats } = useUniverse();

  // Find universe from URL param or fallback to latest
  const universe = useMemo(() => {
    if (universeId) {
      const found = universes.find((u) => u.id === universeId);
      if (found) return found;
    }
    return universes[0] || null;
  }, [universeId, universes]);

  // View state
  const [activeView, setActiveView] = useState("branch");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Selected reality in component state only (per prompt requirement)
  const [selectedRealityId, setSelectedRealityId] = useState(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Branch modal state
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [branchTargetReality, setBranchTargetReality] = useState(null);

  // Focus node passed via navigation state (e.g. from TimelineDetails after branching)
  useEffect(() => {
    if (location.state?.focusedRealityId) {
      setSelectedRealityId(location.state.focusedRealityId);
      setMobilePanelOpen(true);
    }
  }, [location.state?.focusedRealityId]);

  // Filter realities if category filter is active
  const filteredUniverse = useMemo(() => {
    if (!universe) return null;
    if (selectedCategory === "All") return universe;

    const matchedRealities = (universe.realities || []).filter(
      (r) =>
        r.industry?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.career?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.type === "original"
    );

    return {
      ...universe,
      realities: matchedRealities.length > 0 ? matchedRealities : universe.realities,
    };
  }, [universe, selectedCategory]);

  // Default selection to focused node or 3rd reality or original
  useEffect(() => {
    if (filteredUniverse?.realities?.length) {
      if (!selectedRealityId) {
        if (location.state?.focusedRealityId) {
          setSelectedRealityId(location.state.focusedRealityId);
        } else {
          const defaultTarget =
            filteredUniverse.realities[2] || filteredUniverse.realities[0];
          setSelectedRealityId(defaultTarget.id);
        }
      }
    }
  }, [filteredUniverse, selectedRealityId, location.state]);

  const handleSelectReality = useCallback((reality) => {
    if (reality?.id) {
      setSelectedRealityId(reality.id);
      setMobilePanelOpen(true);
    }
  }, []);

  const handleExploreMoreBranches = useCallback(
    (targetReality) => {
      const target =
        targetReality ||
        filteredUniverse?.realities?.find((r) => r.id === selectedRealityId) ||
        filteredUniverse?.realities?.[0] ||
        null;
      setBranchTargetReality(target);
      setBranchModalOpen(true);
    },
    [filteredUniverse, selectedRealityId]
  );

  const handleBranchSuccess = useCallback((childReality) => {
    if (childReality?.id) {
      setSelectedRealityId(childReality.id);
      setMobilePanelOpen(true);
    }
  }, []);

  // Generate initial React Flow nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return generateTreeElements({
      universe: filteredUniverse,
      selectedRealityId,
      onSelectReality: handleSelectReality,
      onExploreMoreBranches: handleExploreMoreBranches,
    });
  }, [filteredUniverse, selectedRealityId, handleSelectReality, handleExploreMoreBranches]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when selection or filter changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Selected reality object for details panel
  const selectedReality = useMemo(() => {
    return (
      filteredUniverse?.realities?.find((r) => r.id === selectedRealityId) ||
      filteredUniverse?.realities?.[0] ||
      null
    );
  }, [filteredUniverse, selectedRealityId]);

  const selectedIndex = filteredUniverse?.realities?.findIndex(
    (r) => r.id === selectedRealityId
  );
  const letterBadge =
    selectedIndex !== -1 && selectedIndex !== undefined
      ? ["A", "B", "C", "D", "E"][selectedIndex] || "C"
      : "C";

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[640px] bg-[#050505] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Starlight & Cosmic Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle planetary curve at lower right */}
        <div className="absolute -bottom-48 -right-48 w-[580px] h-[580px] rounded-full bg-[radial-gradient(circle_at_30%_30%,_#161c1a_0%,_#050505_70%)] border border-white/5 opacity-80" />
        <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full border border-[#C8E9A9]/10 pointer-events-none" />

        {/* Orbit ellipses behind nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 1200 800" fill="none">
          <ellipse cx="600" cy="380" rx="460" ry="240" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" transform="rotate(-8 600 380)" />
          <ellipse cx="600" cy="380" rx="360" ry="170" stroke="rgba(200,233,169,0.15)" strokeWidth="0.8" transform="rotate(4 600 380)" />
        </svg>

        {/* Faint distant stars */}
        <div className="absolute top-16 left-1/3 w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute top-36 right-1/4 w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-30" />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
      </div>

      {/* TOP HEADER CONTROLS BAR */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-white/[0.04]">
        {/* Left: Back button & Title */}
        <div className="flex flex-col gap-1.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D0E]/80 border border-[#292C2C] hover:border-[#3d4040] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors w-fit shadow-md"
          >
            <ArrowLeft size={13} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="mt-1">
            <span className="text-[10px] tracking-[0.2em] font-semibold text-[#A5A7A3] uppercase">
              UNIVERSE EXPLORER
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F2F3F0] leading-tight">
              EXPLORE YOUR PARALLEL TIMELINES
            </h1>
            <p className="text-[11px] text-[#A5A7A3]">
              Click on any branch to dive deeper into that reality.
            </p>
          </div>
        </div>

        {/* Center: Zoom Controls Toolbar */}
        <div className="hidden md:flex items-center">
          <ZoomToolbar zoomLevel={zoomLevel} onZoomChange={setZoomLevel} />
        </div>

        {/* Mobile Detail Panel Trigger */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobilePanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0D0E] border border-[#C8E9A9]/50 text-xs text-[#C8E9A9] font-medium"
          >
            <SlidersHorizontal size={13} />
            <span>Inspect Reality</span>
          </button>
        </div>
      </div>

      {/* MAIN EXPLORER AREA (Sidebar + React Flow Canvas + Detail Panel) */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="relative z-20 hidden md:flex flex-col justify-between w-[220px] p-4 border-r border-white/[0.04] bg-[#050505]/60 backdrop-blur-md shrink-0">
          <div className="space-y-5">
            {/* Box 1: View Modes */}
            <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-2.5 space-y-1 shadow-lg">
              {VIEWS.map((v) => {
                const IconComponent = v.icon;
                const isActive = activeView === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#141618] border border-[#292C2C] text-[#C8E9A9] shadow-sm"
                        : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.02]"
                    }`}
                  >
                    <IconComponent size={14} className={isActive ? "text-[#C8E9A9]" : "text-[#A5A7A3]"} />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Box 2: Filter By Category */}
            <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-3 px-1 text-[11px] font-bold text-[#A5A7A3] uppercase tracking-wider">
                <Filter size={12} />
                <span>FILTER BY CATEGORY</span>
              </div>

              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategory === cat;
                  return (
                    <label
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="flex items-center gap-2.5 px-1 text-xs cursor-pointer group"
                    >
                      {/* Custom Radio Circle */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isChecked
                            ? "border-[#C8E9A9] bg-[#C8E9A9]/20"
                            : "border-[#292C2C] group-hover:border-[#404343]"
                        }`}
                      >
                        {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />}
                      </div>
                      <span
                        className={`transition-colors ${
                          isChecked ? "text-[#F2F3F0] font-medium" : "text-[#A5A7A3] group-hover:text-[#F2F3F0]"
                        }`}
                      >
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Left Stats Indicator */}
          <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-3 flex items-center justify-between text-center shadow-lg">
            <div className="flex items-center gap-1.5 text-left">
              <Globe size={18} className="text-[#C8E9A9]" />
              <div>
                <p className="text-xs font-bold text-[#F2F3F0]">
                  {stats?.totalUniverses || 3}
                </p>
                <p className="text-[9px] text-[#A5A7A3] uppercase tracking-wider">
                  Universes
                </p>
              </div>
            </div>
            <div className="w-px h-6 bg-[#292C2C]" />
            <div>
              <p className="text-xs font-bold text-[#F2F3F0]">
                {universe?.realities?.length ? universe.realities.length * 2 + 1 : 7}
              </p>
              <p className="text-[9px] text-[#A5A7A3] uppercase tracking-wider">
                Branches
              </p>
            </div>
            <div className="w-px h-6 bg-[#292C2C]" />
            <div>
              <p className="text-xs font-bold text-[#C8E9A9]">∞</p>
              <p className="text-[9px] text-[#A5A7A3] uppercase tracking-wider">
                Possibilities
              </p>
            </div>
          </div>
        </div>

        {/* ================= CENTER: REACT FLOW CANVAS ================= */}
        <div className="relative flex-1 w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.28 }}
            minZoom={0.4}
            maxZoom={2.2}
            defaultViewport={{ x: 100, y: 40, zoom: 0.95 }}
            proOptions={{ hideAttribution: true }}
            className="w-full h-full bg-transparent"
          />
        </div>

        {/* ================= RIGHT SIDEBAR: REALITY DETAIL PANEL ================= */}
        <div className="relative z-20 hidden lg:block w-[360px] xl:w-[380px] p-4 shrink-0 h-full">
          {selectedReality && (
            <RealityDetailPanel
              reality={selectedReality}
              universeId={universe?.id || "uni-current"}
              badgeLabel={`REALITY ${letterBadge}`}
              badgeColor={letterBadge === "A" ? "blue" : letterBadge === "B" ? "purple" : "sage"}
              onExploreMoreBranches={handleExploreMoreBranches}
            />
          )}
        </div>
      </div>

      {/* ================= MOBILE BOTTOM SHEET PANEL ================= */}
      {mobilePanelOpen && selectedReality && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm lg:hidden">
          <div className="h-[80vh] w-full animate-in slide-in-from-bottom duration-300">
            <RealityDetailPanel
              reality={selectedReality}
              universeId={universe?.id || "uni-current"}
              badgeLabel={`REALITY ${letterBadge}`}
              badgeColor={letterBadge === "A" ? "blue" : letterBadge === "B" ? "purple" : "sage"}
              onClose={() => setMobilePanelOpen(false)}
              onExploreMoreBranches={handleExploreMoreBranches}
            />
          </div>
        </div>
      )}

      {/* ================= BRANCH MODAL ================= */}
      {universe && (
        <BranchModal
          open={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          universe={universe}
          initialReality={branchTargetReality || selectedReality}
          onSuccess={handleBranchSuccess}
        />
      )}
    </div>
  );
}

/**
 * Default Export wrapped in ReactFlowProvider
 */
export default function Explorer() {
  return (
    <ReactFlowProvider>
      <ExplorerContent />
    </ReactFlowProvider>
  );
}
