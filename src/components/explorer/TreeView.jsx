// src/components/explorer/TreeView.jsx
import React, { useState } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Map as MapIcon,
  ChevronDown,
  Clock,
} from "lucide-react";
import {
  DecisionRootNode,
  JunctionNode,
  RealityNode,
  AddBranchNode,
} from "../universe/CustomNodes";
import { RealityDetailPanel } from "../universe/RealityDetailPanel";
import { BranchModal } from "../timeline/BranchModal";

const nodeTypes = {
  decisionRoot: DecisionRootNode,
  junction: JunctionNode,
  realityCard: RealityNode,
  addBranch: AddBranchNode,
};

function ZoomToolbar({ zoomLevel, onZoomChange, showMiniMap, onToggleMiniMap }) {
  const { zoomTo, fitView } = useReactFlow();

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    onZoomChange(val);
    zoomTo(val, { duration: 150 });
  };

  const handleZoomIn = () => {
    const next = Math.min(2.0, Number((zoomLevel + 0.15).toFixed(2)));
    onZoomChange(next);
    zoomTo(next, { duration: 200 });
  };

  const handleZoomOut = () => {
    const next = Math.max(0.4, Number((zoomLevel - 0.15).toFixed(2)));
    onZoomChange(next);
    zoomTo(next, { duration: 200 });
  };

  const handleResetZoom = () => {
    onZoomChange(1.0);
    zoomTo(1.0, { duration: 200 });
  };

  const handleFitView = () => {
    fitView({ padding: 0.25, duration: 400 });
    onZoomChange(1.0);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-rule shadow-sm text-xs text-muted select-none">
      <span className="text-xs font-medium text-muted hidden sm:inline">Zoom:</span>
      <button
        type="button"
        onClick={handleZoomOut}
        className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        aria-label="Zoom out"
      >
        <ZoomOut size={13} aria-hidden="true" />
      </button>

      <div className="w-16 sm:w-20 flex items-center">
        <input
          type="range"
          min="0.4"
          max="2.0"
          step="0.05"
          value={zoomLevel}
          onChange={handleSliderChange}
          aria-label="Zoom level"
          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>

      <button
        type="button"
        onClick={handleZoomIn}
        className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        aria-label="Zoom in"
      >
        <ZoomIn size={13} aria-hidden="true" />
      </button>

      <div className="w-px h-3.5 bg-rule mx-0.5" />

      <button
        type="button"
        onClick={handleResetZoom}
        className="w-6 h-6 rounded-md bg-paper border border-rule hover:border-accent/40 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        title="Reset zoom to 100%"
        aria-label="Reset zoom"
      >
        <RotateCcw size={11} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={handleFitView}
        className="w-6 h-6 rounded-md bg-paper border border-rule hover:border-accent/40 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        title="Fit all realities into view"
        aria-label="Fit view"
      >
        <Maximize2 size={11} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onToggleMiniMap}
        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus ${
          showMiniMap
            ? "bg-accent/20 border-accent text-accent"
            : "bg-paper border-rule text-muted hover:text-ink hover:border-accent/40"
        }`}
        title={showMiniMap ? "Hide minimap" : "Show minimap overview"}
        aria-label="Toggle minimap"
      >
        <MapIcon size={11} aria-hidden="true" />
      </button>
    </div>
  );
}

export function TreeView({
  universe,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  selectedReality,
  onSelectRealityId,
  selectedCategory,
  timeFilter = "All Time",
  onTimeFilterChange,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [branchModalNode, setBranchModalNode] = useState(null);

  const timeOptions = ["All Time", "2026 - 2030", "Past 5 Years", "Milestones Only"];

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-rule/50">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent">
              <Network size={16} aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Tree view
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Hierarchical divergence tree and interactive decision nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ZoomToolbar
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            showMiniMap={showMiniMap}
            onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
          />

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
      </div>

      {/* Main ReactFlow Canvas Container */}
      <div className="relative w-full h-[580px] rounded-2xl border border-rule bg-card/80 backdrop-blur-sm flex overflow-hidden shadow-lg">
        <div className="relative flex-1 w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.3}
            maxZoom={2.0}
            className="bg-transparent"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant="dots" gap={24} size={1} color="#222" />
            {showMiniMap && (
              <MiniMap
                nodeStrokeColor="#C8E9A9"
                nodeColor="#1a1a1a"
                maskColor="rgba(0, 0, 0, 0.75)"
                className="!bg-paper !border !border-rule !rounded-lg !overflow-hidden !m-3"
                style={{ width: 150, height: 100 }}
              />
            )}
          </ReactFlow>
        </div>

        {/* Right Detail Panel if a reality is selected */}
        {selectedReality && (
          <div className="relative z-20 hidden lg:block w-[340px] border-l border-rule bg-paper/95 shrink-0 overflow-y-auto">
            <RealityDetailPanel
              reality={selectedReality}
              letter="A"
              universeId={universe?.id}
              onClose={() => onSelectRealityId(null)}
              onExploreMoreBranches={(rel) => setBranchModalNode({ reality: rel || selectedReality })}
            />
          </div>
        )}
      </div>

      {/* Branch Modal */}
      {branchModalNode && (
        <BranchModal
          open={Boolean(branchModalNode)}
          isOpen={Boolean(branchModalNode)}
          onClose={() => setBranchModalNode(null)}
          universe={universe}
          initialReality={branchModalNode?.reality || selectedReality}
          parentNodeData={branchModalNode}
          universeId={universe?.id}
          onSuccess={(newReality) => {
            setBranchModalNode(null);
            if (newReality?.id) {
              onSelectRealityId(newReality.id);
            }
          }}
        />
      )}
    </div>
  );
}
