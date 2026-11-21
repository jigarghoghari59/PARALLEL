// src/pages/CreateUniverse.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitFork,
  ArrowRight,
  Clock,
  Layers,
  GitBranch,
  Info,
  ChevronDown,
  AlertCircle,
  RotateCcw,
  Check,
  HeartHandshake,
  X,
  Cpu,
} from "lucide-react";
import { api, ApiError } from "../services/apiClient";
import { useUniverse } from "../context/UniverseContext";

const CATEGORIES = [
  "Career",
  "Education",
  "Relationships",
  "Location",
  "Lifestyle",
  "Personal",
];

const DURATIONS = [
  { label: "5 Years", value: 5 },
  { label: "10 Years", value: 10 },
  { label: "20 Years", value: 20 },
];

const COSMIC_MESSAGES = [
  "Opening timeline gateway…",
  "Collapsing probability waves across dimensions…",
  "Simulating divergent milestones and career vectors…",
  "Weaving chronological turning point events…",
  "Synthesizing speculative realities with Gemini AI…",
  "Finalizing multiverse branches and possibilities…",
];

export default function CreateUniverse() {
  const navigate = useNavigate();
  const location = useLocation();
  const { create: saveUniverseToContext } = useUniverse();

  // Form State
  const [decision, setDecision] = useState("");
  const [category, setCategory] = useState("Career");
  const [durationYears, setDurationYears] = useState(10);
  const [realitiesCount, setRealitiesCount] = useState(2);

  // Dropdown UI States
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [customDuration, setCustomDuration] = useState("");
  const [showCustomDurationInput, setShowCustomDurationInput] = useState(false);

  // Submission & Error State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [crisisData, setCrisisData] = useState(null);

  // Prefill support
  useEffect(() => {
    if (location.state?.prefill) {
      setDecision(location.state.prefill);
      return;
    }

    const params = new URLSearchParams(location.search);
    const qDecision = params.get("decision") || params.get("q");
    if (qDecision) {
      setDecision(qDecision);
    }

    const qCategory = params.get("category");
    if (qCategory && CATEGORIES.includes(qCategory)) {
      setCategory(qCategory);
    }
  }, [location]);

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % COSMIC_MESSAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setCategoryOpen(false);
      setDurationOpen(false);
    };
    if (categoryOpen || durationOpen) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [categoryOpen, durationOpen]);

  const trimmedDecision = decision.trim();
  const isDecisionValid = trimmedDecision.length >= 10 && trimmedDecision.length <= 500;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!isDecisionValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCrisisData(null);
    setLoadingMsgIdx(0);

    const payload = {
      originalDecision: trimmedDecision,
      category,
      durationYears: Number(durationYears) || 10,
      realitiesCount: Number(realitiesCount) || 2,
    };

    try {
      const response = await api.generateUniverse(payload);

      if (response?.crisis) {
        setIsLoading(false);
        setCrisisData(response.message);
        return;
      }

      let realities = response?.realities || response?.universes || [];
      const hasOriginal = realities.some((r) => r.type === "original");

      if (!hasOriginal) {
        const rootReality = {
          id: `real-orig-${Date.now()}`,
          universeId: response?.universeId || `univ-${Date.now()}`,
          name: "Original Timeline",
          type: "original",
          status: "Baseline reality",
          description: `Baseline path proceeding with decision: ${trimmedDecision}`,
          events: [
            {
              id: `evt-${Date.now()}-1`,
              year: new Date().getFullYear(),
              title: "Divergence Point",
              description: `Initial turning point: ${trimmedDecision}`,
              impact: "neutral",
            },
          ],
        };
        realities = [rootReality, ...realities];
      }

      const newUniverse = {
        id: response?.universeId || `univ-${Date.now()}`,
        name: response?.universeName || trimmedDecision.slice(0, 48),
        originalDecision: trimmedDecision,
        category,
        durationYears: Number(durationYears) || 10,
        createdAt: new Date().toISOString(),
        realities,
      };

      saveUniverseToContext(newUniverse);
      navigate(`/explore/${newUniverse.id}`);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred while generating the multiverse. Please try again."
      );
    }
  };

  return (
    <div className="relative w-full max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="relative z-10 flex flex-col gap-6 pt-2 pb-8">
        <div className="flex flex-col gap-5">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule w-fit shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">
              Quantum branching engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-ink leading-[1.08]">
            <span>What if…?</span>
            <br />
            <span className="text-accent">Synthesize realities</span>
          </h1>

          <p className="text-sm sm:text-base text-muted font-normal leading-relaxed max-w-[640px]">
            Enter a turning point or life decision. The multiverse engine generates coherent branching timelines, career trajectories, and milestones.
          </p>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 p-3.5 rounded-card bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs shadow-lg"
              >
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Generation failed</p>
                  <p className="text-rose-300/90 mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={() => handleGenerate()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 font-medium text-xs transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  <span>Retry</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CARD 1: YOUR DECISION */}
          <div className="bg-card border border-rule focus-within:border-accent rounded-card p-4 transition-colors relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2.5">
              <GitFork size={14} className="text-accent stroke-[2.2]" aria-hidden="true" />
              <label htmlFor="decision-input" className="text-xs font-medium text-muted">
                Your decision
              </label>
            </div>

            <textarea
              id="decision-input"
              value={decision}
              onChange={(e) => setDecision(e.target.value.slice(0, 500))}
              placeholder="e.g. What if I had chosen Mechanical Engineering instead of Computer Engineering?"
              rows={3}
              maxLength={500}
              className="w-full bg-transparent text-ink text-sm placeholder-muted/40 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-rule mt-1 text-xs">
              <span className={trimmedDecision.length > 0 && trimmedDecision.length < 10 ? "text-amber-400" : "text-transparent"}>
                Minimum 10 characters required
              </span>
              <span className="text-muted font-mono">
                {decision.length} / 500
              </span>
            </div>
          </div>

          {/* CARD 2: SELECTORS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Category Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryOpen(!categoryOpen);
                  setDurationOpen(false);
                }}
                className="w-full bg-card hover:bg-surface border border-rule hover:border-white/20 rounded-card p-3.5 flex items-center justify-between text-left transition-colors shadow-sm group cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-muted group-hover:text-accent transition-colors shrink-0">
                    <Layers size={15} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-xs text-muted font-medium">
                      Category
                    </span>
                    <span className="block text-xs font-semibold text-ink mt-0.5">
                      {category}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform ${categoryOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full mt-2 bg-surface border border-rule rounded-card p-1.5 shadow-2xl z-40"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setCategoryOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          category === cat
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "text-muted hover:text-ink hover:bg-card"
                        }`}
                      >
                        <span>{cat}</span>
                        {category === cat && <Check size={13} className="text-accent" aria-hidden="true" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timeline Duration Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDurationOpen(!durationOpen);
                  setCategoryOpen(false);
                }}
                className="w-full bg-card hover:bg-surface border border-rule hover:border-white/20 rounded-card p-3.5 flex items-center justify-between text-left transition-colors shadow-sm group cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-muted group-hover:text-accent transition-colors shrink-0">
                    <Clock size={15} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-xs text-muted font-medium">
                      Timeline duration
                    </span>
                    <span className="block text-xs font-semibold text-ink mt-0.5">
                      {durationYears} Years
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform ${durationOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {durationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full mt-2 bg-surface border border-rule rounded-card p-1.5 shadow-2xl z-40"
                  >
                    {DURATIONS.map((dur) => (
                      <button
                        key={dur.value}
                        type="button"
                        onClick={() => {
                          setDurationYears(dur.value);
                          setShowCustomDurationInput(false);
                          setDurationOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          durationYears === dur.value && !showCustomDurationInput
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "text-muted hover:text-ink hover:bg-card"
                        }`}
                      >
                        <span>{dur.label}</span>
                        {durationYears === dur.value && !showCustomDurationInput && (
                          <Check size={13} className="text-accent" aria-hidden="true" />
                        )}
                      </button>
                    ))}

                    <div className="pt-1 mt-1 border-t border-rule">
                      {showCustomDurationInput ? (
                        <div className="flex items-center gap-1.5 p-1">
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={customDuration}
                            placeholder="Years (1 to 50)"
                            onChange={(e) => setCustomDuration(e.target.value)}
                            className="w-full bg-card border border-rule rounded-lg px-2.5 py-1 text-xs text-ink focus:border-accent focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = parseInt(customDuration, 10);
                              if (val >= 1 && val <= 50) {
                                setDurationYears(val);
                                setDurationOpen(false);
                              }
                            }}
                            className="px-2.5 py-1 bg-accent text-accent-ink rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Set
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCustomDurationInput(true)}
                          className="w-full text-left px-3 py-1.5 text-xs text-muted hover:text-ink rounded-lg hover:bg-card cursor-pointer"
                        >
                          Custom duration…
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CARD 3: NUMBER OF ALTERNATE REALITIES */}
          <div className="bg-card border border-rule rounded-card p-3.5 shadow-sm overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2.5">
              <GitBranch size={13} className="text-muted" aria-hidden="true" />
              <span className="text-xs font-medium text-muted">
                Number of alternate realities
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => {
                const isSelected = realitiesCount === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRealitiesCount(num)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus ${
                      isSelected
                        ? "nav-pill-active text-accent"
                        : "bg-surface border border-rule hover:border-white/20 text-muted hover:text-ink"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTON & ESTIMATED TIME */}
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!isDecisionValid || isLoading}
              className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-xs transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 ${
                isDecisionValid && !isLoading
                  ? "bg-accent text-accent-ink hover:bg-accent-muted active:scale-95 cursor-pointer"
                  : "bg-surface text-muted/50 border border-rule cursor-not-allowed"
              }`}
            >
              <GitFork size={15} className="stroke-[2.5]" aria-hidden="true" />
              <span>Synthesize realities</span>
              <ArrowRight size={15} className="stroke-[2.5]" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={13} aria-hidden="true" />
              <span>Estimated time: 15 to 30s</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER DISCLAIMER BAR */}
      <div className="relative z-10 w-full rounded-card bg-card border border-rule px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted mt-3 gap-2 overflow-hidden shadow-sm">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2">
          <Info size={14} className="text-muted shrink-0" aria-hidden="true" />
          <span>This is a creative exploration. Not a guaranteed prediction.</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block w-px h-3 bg-rule" />
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Cpu size={13} className="text-purple" aria-hidden="true" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-paper/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent motion-safe:animate-spin" />
              <div className="w-12 h-12 rounded-full bg-surface border border-rule flex items-center justify-center text-accent">
                <GitFork size={20} aria-hidden="true" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">
              Weaving multiverse
            </h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsgIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-accent max-w-md h-8"
              >
                {COSMIC_MESSAGES[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>

            <p className="text-xs text-muted mt-6 max-w-xs">
              Calculating divergent life pathways, milestones, and turning points. This typically takes 15 to 30 seconds.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRISIS SUPPORT MODAL */}
      <AnimatePresence>
        {crisisData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-rule rounded-card p-6 sm:p-7 max-w-lg w-full text-ink shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between pb-3 border-b border-rule mb-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <HeartHandshake size={20} aria-hidden="true" />
                  <span className="font-semibold text-sm">
                    You are not alone
                  </span>
                </div>
                <button
                  onClick={() => setCrisisData(null)}
                  className="w-7 h-7 rounded-full bg-surface border border-rule flex items-center justify-center text-muted hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
                  aria-label="Close crisis support"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>

              <p className="text-sm text-muted leading-relaxed mb-6">
                {crisisData}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setCrisisData(null)}
                  className="px-5 py-2.5 rounded-lg bg-surface border border-rule hover:border-accent/60 text-xs font-semibold text-ink cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
                >
                  I understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
