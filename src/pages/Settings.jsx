import React from "react";
import { Link } from "react-router-dom";
import { Settings as SettingsIcon, ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import { universeService } from "../services/universeService";
import { useUniverse } from "../context/UniverseContext";

export default function Settings() {
  const { refresh } = useUniverse();

  const handleClear = () => {
    if (window.confirm("Clear all multiverse data?")) {
      localStorage.removeItem("parallel.universes");
      refresh();
    }
  };

  const handleResetSample = () => {
    universeService.resetToSample();
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <SettingsIcon size={13} />
          <span>System Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-2">Settings</h1>
        <p className="text-sm text-[#A5A7A3] mb-8">Manage local storage, data resets, and system theme.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#101113] border border-[#292C2C]">
            <div>
              <p className="text-sm font-semibold text-[#F2F3F0]">Reset Demo Data</p>
              <p className="text-xs text-[#A5A7A3]">Restore sample universes matching the reference design.</p>
            </div>
            <button
              onClick={handleResetSample}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181a1c] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-[#F2F3F0] text-xs font-medium transition-colors"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#101113] border border-rose-900/30">
            <div>
              <p className="text-sm font-semibold text-[#F2F3F0]">Clear All Data</p>
              <p className="text-xs text-[#A5A7A3]">Delete all universes from browser local storage.</p>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/50 text-rose-300 text-xs font-medium transition-colors"
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
