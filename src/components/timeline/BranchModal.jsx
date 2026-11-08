// src/components/timeline/BranchModal.jsx
import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { GitBranch, Sparkles, AlertCircle, RefreshCw, Clock, ArrowRight } from "lucide-react";
import { api, ApiError } from "../../services/apiClient";
import { useUniverse } from "../../context/UniverseContext";

const LOADING_STEPS = [
  "Calculating temporal divergence point...",
  "Simulating alternate trajectory and milestones...",
  "Synthesizing new life path and outcomes...",
  "Finalizing alternate universe branch...",
];

export const BranchModal = ({
  open,
  onClose,
  universe,
  initialReality = null,
  initialEvent = null,
  onSuccess,
}) => {
  const { addReality } = useUniverse();

  const realities = universe?.realities || [];

  // Selected reality and event state (allows changing if opened from Explorer or desired)
  const [selectedRealityId, setSelectedRealityId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [question, setQuestion] = useState("");
  const [durationYears, setDurationYears] = useState(5);

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState(null);

  // Sync initial props when opened
  useEffect(() => {
    if (open) {
      const reality =
        initialReality ||
        realities.find((r) => r.id === selectedRealityId) ||
        realities[0] ||
        null;
      const realityId = reality?.id || "";
      setSelectedRealityId(realityId);

      const events = reality?.events || [];
      const event =
        initialEvent ||
        events.find((e) => e.id === selectedEventId) ||
        events[events.length - 1] ||
        events[0] ||
        null;
      setSelectedEventId(event?.id || "");

      setQuestion("");
      setError(null);
      setLoading(false);
      setLoadingStepIndex(0);
    }
  }, [open, initialReality, initialEvent, universe]);

  // Rotate loading step messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [loading]);

  const activeReality = realities.find((r) => r.id === selectedRealityId);
  const activeEvents = activeReality?.events || [];
  const activeEvent =
    activeEvents.find((e) => e.id === selectedEventId) || activeEvents[0];

  const handleRealityChange = (e) => {
    const newRealityId = e.target.value;
    setSelectedRealityId(newRealityId);
    const targetReality = realities.find((r) => r.id === newRealityId);
    if (targetReality?.events?.length) {
      setSelectedEventId(targetReality.events[0].id);
    } else {
      setSelectedEventId("");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim() || question.trim().length < 5) {
      setError("Please enter a question with at least 5 characters.");
      return;
    }
    if (!activeReality || !activeEvent) {
      setError("Please select both a reality and an event to branch from.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        originalDecision: universe.originalDecision || "",
        parentRealityId: activeReality.id,
        parentEventId: activeEvent.id,
        selectedReality: {
          name: activeReality.name,
          summary: activeReality.summary || "",
          career: activeReality.career || "",
        },
        selectedEvent: {
          id: activeEvent.id,
          year: activeEvent.year,
          age: activeEvent.age,
          title: activeEvent.title,
          description: activeEvent.description || "",
        },
        existingTimeline: (activeReality.events || []).map((evt) => ({
          year: evt.year,
          title: evt.title,
        })),
        question: question.trim(),
        durationYears: Number(durationYears) || 5,
      };

      const res = await api.branchUniverse(payload);
      const childReality = res?.reality;

      if (!childReality) {
        throw new Error("No reality was returned from the server.");
      }

      // Ensure links are preserved and attached
      childReality.parentRealityId = activeReality.id;
      childReality.parentEventId = activeEvent.id;
      childReality.universeId = universe.id;

      // Assign a default visual theme if not provided
      if (!childReality.image) {
        childReality.image =
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80";
      }

      // Append to universe and update storage
      addReality(universe.id, childReality);

      setLoading(false);
      onClose?.();
      onSuccess?.(childReality);
    } catch (err) {
      console.error("[BranchModal] Branch generation error:", err);
      setError(
        err.message ||
          "Failed to branch timeline. Please verify server connection and try again."
      );
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title=""
      maxWidth="max-w-xl"
      className="p-0 overflow-hidden bg-[#0B0D0E] border-[#292C2C]"
    >
      {/* Header Banner */}
      <div className="relative px-6 pt-6 pb-4 border-b border-[#292C2C]/60 bg-gradient-to-b from-[#141816]/70 to-[#0B0D0E]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#162017] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9]">
            <GitBranch size={15} />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C8E9A9]">
            Branch Alternate Reality
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#F2F3F0] tracking-tight">
          Create Divergent Timeline
        </h2>
        <p className="text-xs text-[#A5A7A3] mt-1 leading-relaxed">
          Introduce a new choice or unexpected event to spawn a completely new alternate life trajectory.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Branch Origin Anchor Card */}
        <div className="bg-[#101214] border border-[#292C2C] rounded-xl p-3.5 space-y-3">
          <div className="text-[10px] font-bold text-[#A5A7A3] uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={12} className="text-[#C8E9A9]" />
            <span>Branching Anchor Point</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reality Picker */}
            <div>
              <label className="block text-[11px] text-[#A5A7A3] mb-1 font-medium">
                Parent Reality:
              </label>
              <select
                disabled={loading}
                value={selectedRealityId}
                onChange={handleRealityChange}
                className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-lg px-3 py-2 text-xs text-[#F2F3F0] outline-none transition-colors"
              >
                {realities.map((r, i) => (
                  <option key={r.id} value={r.id}>
                    {r.name || `Reality ${i + 1}`} ({r.career || r.industry || "Career"})
                  </option>
                ))}
              </select>
            </div>

            {/* Event Picker */}
            <div>
              <label className="block text-[11px] text-[#A5A7A3] mb-1 font-medium">
                Starting Event (Year):
              </label>
              <select
                disabled={loading}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-lg px-3 py-2 text-xs text-[#F2F3F0] outline-none transition-colors"
              >
                {activeEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.year}: {evt.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeEvent && (
            <div className="pt-2 border-t border-white/[0.04] text-[11px] text-[#A5A7A3] flex items-center gap-1.5">
              <span className="text-[#C8E9A9] font-medium">Point of Divergence:</span>
              <span className="text-[#F2F3F0] font-semibold truncate">
                {activeEvent.year} — {activeEvent.title}
              </span>
            </div>
          )}
        </div>

        {/* What If Question Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#F2F3F0] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#C8E9A9]" />
              <span>What if...? (The Turning Question)</span>
            </label>
            <span
              className={`text-[10px] ${
                question.length > 500
                  ? "text-red-400"
                  : question.length >= 5
                  ? "text-[#C8E9A9]"
                  : "text-[#A5A7A3]"
              }`}
            >
              {question.length}/500
            </span>
          </div>

          <textarea
            rows={3}
            disabled={loading}
            maxLength={500}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What if I accepted an international fellowship in bio-robotics? or What if I joined an early AI startup instead?"
            className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-xl px-4 py-3 text-xs text-[#F2F3F0] placeholder:text-zinc-600 outline-none resize-none transition-all shadow-inner"
          />
        </div>

        {/* Duration selector */}
        <div className="flex items-center justify-between bg-[#101214] border border-[#292C2C] rounded-xl px-4 py-3">
          <div>
            <div className="text-xs font-semibold text-[#F2F3F0]">Branch Horizon</div>
            <div className="text-[10px] text-[#A5A7A3]">How many years into this alternate path to simulate</div>
          </div>
          <div className="flex items-center gap-2">
            {[5, 10, 20].map((yrs) => (
              <button
                key={yrs}
                type="button"
                disabled={loading}
                onClick={() => setDurationYears(yrs)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  durationYears === yrs
                    ? "bg-[#C8E9A9] text-[#050505] font-bold shadow-[0_0_8px_rgba(200,233,169,0.4)]"
                    : "bg-[#08090A] text-[#A5A7A3] border border-[#292C2C] hover:text-[#F2F3F0]"
                }`}
              >
                {yrs} Yrs
              </button>
            ))}
          </div>
        </div>

        {/* Speculative Fiction Disclaimer */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-[#A5A7A3] leading-relaxed flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shrink-0" />
          <span>
            Speculative fiction generated by AI. Outcomes are hypothetical simulations, not guaranteed predictions.
          </span>
        </div>

        {/* Loading Progress Bar & Message */}
        {loading && (
          <div className="p-4 rounded-xl bg-[#08120B]/90 border border-[#C8E9A9]/30 text-center space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#C8E9A9]">
              <RefreshCw size={15} className="animate-spin text-[#C8E9A9]" />
              <span>{LOADING_STEPS[loadingStepIndex]}</span>
            </div>
            <div className="w-full bg-[#18261c] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C8E9A9] h-full transition-all duration-700 rounded-full"
                style={{
                  width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#292C2C] bg-[#08090A] hover:bg-[#121416] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || question.trim().length < 5}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] disabled:opacity-40 disabled:cursor-not-allowed text-[#050505] font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(200,233,169,0.3)] transition-all"
          >
            {loading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Simulating Branch...</span>
              </>
            ) : (
              <>
                <span>Create Alternate Reality</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
