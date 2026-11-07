import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

export default function TimelineDetails() {
  const { universeId, realityId } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <Clock size={13} />
          <span>Timeline Event Path</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-2">Timeline Details</h1>
        <p className="text-sm text-[#A5A7A3] mb-6">
          Sequential event timeline and branch points for reality {realityId || "Selected"}.
        </p>
      </div>
    </div>
  );
}
