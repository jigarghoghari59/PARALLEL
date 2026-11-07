import React from "react";
import { Link, useParams } from "react-router-dom";
import { GitBranch, ArrowLeft } from "lucide-react";
import { useUniverse } from "../context/UniverseContext";

export default function Explorer() {
  const { universeId } = useParams();
  const { universes } = useUniverse();
  const currentUniverse = universes.find((u) => u.id === universeId) || universes[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <GitBranch size={13} />
          <span>Interactive Multiverse Graph</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-2">Universe Explorer</h1>
        {currentUniverse ? (
          <p className="text-sm text-[#C8E9A9] font-medium mb-6">
            Exploring: "{currentUniverse.originalDecision}"
          </p>
        ) : (
          <p className="text-sm text-[#A5A7A3] mb-6">Select a universe to explore its interactive branching tree.</p>
        )}
        <div className="p-6 rounded-xl bg-[#101113] border border-[#292C2C] text-xs text-[#A5A7A3] flex items-center justify-center min-h-[200px]">
          Interactive React Flow reality graph view ready for Phase 3.
        </div>
      </div>
    </div>
  );
}
