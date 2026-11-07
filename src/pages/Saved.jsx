import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useUniverse } from "../context/UniverseContext";

export default function Saved() {
  const { universes } = useUniverse();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <Bookmark size={13} />
          <span>Multiverse Library</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-2">Saved Universes</h1>
        <p className="text-sm text-[#A5A7A3] mb-6">All bookmarked and explored realities stored in local quantum memory.</p>

        <div className="space-y-3">
          {universes.map((u) => (
            <Link
              key={u.id}
              to={`/explore/${u.id}`}
              className="block p-4 rounded-xl bg-[#101113] border border-[#292C2C] hover:border-[#C8E9A9]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#C8E9A9]">
                  {u.category || "General"}
                </span>
                <span className="text-[11px] text-[#A5A7A3]">
                  {u.realities ? `${u.realities.length} Realities` : "1 Reality"}
                </span>
              </div>
              <p className="text-sm font-medium text-[#F2F3F0]">{u.originalDecision}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
