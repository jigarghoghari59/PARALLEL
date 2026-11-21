// src/components/timeline/BranchModal.jsx
import React, { useState, useEffect } from "react";
import { GitBranch, Clock, GitFork, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { Modal } from "../common/Modal";
import { api } from "../../services/apiClient";
import { useUniverse } from "../../context/UniverseContext";

const LOADING_STEPS = [
  "Anchoring timeline to selected milestone…",
  "Calculating divergent probability vectors…",
  "Synthesizing alternate career trajectory with Gemini…",
  "Finalizing child reality branch…",
];

export const BranchModal = ({
  open,
  isOpen,
  onClose,
  universe,
  initialReality,
  initialEvent,
  parentNodeData,
  universeId,
  onSuccess,
}) => {
  const { branchReality } = useUniverse();
  const isModalOpen = Boolean(open ?? isOpen);

  const realities = universe?.realities || [];

  const defaultRealityId =
    initialReality?.id ||
    parentNodeData?.reality?.id ||
    (realities.length > 0 ? realities[0].id : "");

  const [selectedRealityId, setSelectedRealityId] = useState(defaultRealityId);
  const [selectedEventId, setSelectedEventId] = useState(initialEvent?.id || "");
  const [question, setQuestion] = useState("");
  const [durationYears, setDurationYears] = useState(10);

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialReality?.id) {
      setSelectedRealityId(initialReality.id);
    } else if (parentNodeData?.reality?.id) {
      setSelectedRealityId(parentNodeData.reality.id);
    } else if (realities.length > 0 && !selectedRealityId) {
      setSelectedRealityId(realities[0].id);
    }
  }, [initialReality, parentNodeData, realities, selectedRealityId]);

  const activeReality =
    realities.find((r) => r.id === selectedRealityId) || realities[0] || null;

  const activeEvents = activeReality?.events || [];

  useEffect(() => {
    if (initialEvent?.id) {
      setSelectedEventId(initialEvent.id);
    } else if (activeEvents.length > 0) {
      setSelectedEventId(activeEvents[0].id);
    } else {
      setSelectedEventId("");
    }
  }, [selectedRealityId, initialEvent, activeEvents]);

  const activeEvent =
    activeEvents.find((e) => e.id === selectedEventId) || activeEvents[0] || null;

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleRealityChange = (e) => {
    const newRealityId = e.target.value;
    setSelectedRealityId(newRealityId);
    const targetReality = realities.find((r) => r.id === newRealityId);
    if (targetReality?.events?.length > 0) {
      setSelectedEventId(targetReality.events[0].id);
    } else {
      setSelectedEventId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 5) {
      setError("Please enter a turning question of at least 5 characters.");
      return;
    }

    if (!activeReality || !activeEvent) {
      setError("Please select both a parent reality and an event to branch from.");
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStepIndex(0);

    try {
      const payload = {
        universeId: universe?.id || universeId,
        parentRealityId: activeReality.id,
        parentEventId: activeEvent.id,
        branchQuestion: question.trim(),
        durationYears: Number(durationYears) || 10,
      };

      const response = await api.branchReality(payload);

      let childReality = response?.reality || response;
      if (!childReality || !childReality.id) {
        childReality = {
          id: `real-branch-${Date.now()}`,
          name: `Branch: ${question.trim().slice(0, 32)}`,
          type: "branch",
          parentRealityId: activeReality.id,
          parentEventId: activeEvent.id,
          career: activeReality.career || "Alternate Career",
          summary: `Branched from "${activeEvent.title}" (${activeEvent.year}): ${question.trim()}`,
          skills: activeReality.skills || ["Adaptability", "Innovation"],
          opportunities: ["Divergent Path Opportunities", "New Milestone Trajectory"],
          challenges: ["Uncertain Path Dynamics"],
          outcome: `Alternative outcome shaped by: ${question.trim()}`,
          events: [
            {
              id: `evt-${Date.now()}-1`,
              year: (activeEvent.year || new Date().getFullYear()) + 1,
              title: "Branch Milestone",
              description: `Initial trajectory shift following: ${question.trim()}`,
              category: "Career",
            },
          ],
        };
      }

      branchReality(universe?.id || universeId, childReality);

      setLoading(false);
      setQuestion("");
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
      open={isModalOpen}
      onClose={loading ? undefined : onClose}
      title=""
      maxWidth="max-w-xl"
      className="p-0 overflow-hidden bg-card border border-rule"
    >
      {/* Header Banner */}
      <div className="relative px-6 pt-6 pb-4 border-b border-rule bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-surface border border-accent/30 flex items-center justify-center text-accent">
            <GitBranch size={15} aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-accent">
            Branch alternate reality
          </span>
        </div>
        <h2 className="text-xl font-bold text-ink tracking-tight">
          Create divergent timeline
        </h2>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Introduce a new choice or unexpected event to spawn a completely new alternate life trajectory.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Branch Origin Anchor Card */}
        <div className="bg-surface border border-rule rounded-card p-4 space-y-3 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          <div className="text-xs font-semibold text-muted flex items-center gap-1.5">
            <Clock size={12} className="text-accent" aria-hidden="true" />
            <span>Branching anchor point</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="parent-reality-select" className="block text-xs text-muted mb-1 font-medium">
                Parent reality:
              </label>
              <select
                id="parent-reality-select"
                disabled={loading}
                value={selectedRealityId}
                onChange={handleRealityChange}
                className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none transition-colors"
              >
                {realities.map((r, i) => (
                  <option key={r.id} value={r.id} className="bg-paper text-ink">
                    {r.name || `Reality ${i + 1}`} ({r.career || r.industry || "Career"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="starting-event-select" className="block text-xs text-muted mb-1 font-medium">
                Starting event (year):
              </label>
              <select
                id="starting-event-select"
                disabled={loading}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none transition-colors"
              >
                {activeEvents.map((evt) => (
                  <option key={evt.id} value={evt.id} className="bg-paper text-ink">
                    {evt.year}: {evt.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeEvent && (
            <div className="pt-2 border-t border-rule text-xs text-muted flex items-center gap-1.5">
              <span className="text-accent font-medium">Point of divergence:</span>
              <span className="text-ink font-semibold truncate">
                {activeEvent.year}: {activeEvent.title}
              </span>
            </div>
          )}
        </div>

        {/* What If Question Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="branch-question-input" className="text-xs font-bold text-ink flex items-center gap-1.5">
              <GitFork size={13} className="text-accent" aria-hidden="true" />
              <span>What if…? (The turning question)</span>
            </label>
            <span
              className={`text-xs ${
                question.length > 500
                  ? "text-rose-400"
                  : question.length >= 5
                  ? "text-accent"
                  : "text-muted"
              }`}
            >
              {question.length}/500
            </span>
          </div>

          <textarea
            id="branch-question-input"
            rows={3}
            disabled={loading}
            maxLength={500}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What if I accepted an international fellowship in bio-robotics? or What if I joined an early AI startup instead?"
            className="w-full bg-card border border-rule focus:border-accent rounded-card px-4 py-3 text-xs text-ink placeholder:text-muted/50 outline-none resize-none transition-colors"
          />
        </div>

        {/* Duration selector */}
        <div className="flex items-center justify-between bg-surface border border-rule rounded-card px-4 py-3 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          <div>
            <div className="text-xs font-semibold text-ink">Branch horizon</div>
            <div className="text-xs text-muted">How many years into this alternate path to simulate</div>
          </div>
          <div className="flex items-center gap-2">
            {[5, 10, 20].map((yrs) => (
              <button
                key={yrs}
                type="button"
                disabled={loading}
                onClick={() => setDurationYears(yrs)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus ${
                  durationYears === yrs
                    ? "bg-accent text-accent-ink font-semibold"
                    : "bg-card border border-rule hover:border-white/20 text-muted hover:text-ink"
                }`}
              >
                {yrs} Yrs
              </button>
            ))}
          </div>
        </div>

        {/* Speculative Fiction Disclaimer */}
        <div className="p-2.5 rounded-card bg-surface border border-rule text-xs text-muted leading-relaxed flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
          <span>
            Speculative fiction generated by AI. Outcomes are hypothetical simulations, not guaranteed predictions.
          </span>
        </div>

        {/* Loading Progress Bar & Message */}
        {loading && (
          <div className="p-4 rounded-card bg-surface border border-accent/30 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-accent">
              <RefreshCw size={15} className="motion-safe:animate-spin text-accent" aria-hidden="true" />
              <span>{LOADING_STEPS[loadingStepIndex]}</span>
            </div>
            <div className="w-full bg-paper h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full rounded-full"
                style={{
                  width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-card bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface border border-rule hover:border-accent/40 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading || question.trim().length < 5}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-muted text-accent-ink font-semibold text-xs flex items-center gap-2 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-focus"
          >
            {loading ? (
              <>
                <RefreshCw size={13} className="motion-safe:animate-spin" aria-hidden="true" />
                <span>Simulating branch…</span>
              </>
            ) : (
              <>
                <span>Create alternate reality</span>
                <ArrowRight size={13} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
