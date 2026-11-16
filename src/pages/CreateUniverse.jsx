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
  Eye,
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
  "Opening quantum timeline gateway...",
  "Collapsing probability waves across parallel dimensions...",
  "Simulating divergent milestones & career vectors...",
  "Weaving chronological turning point events...",
  "Synthesizing speculative realities with Gemini AI...",
  "Finalizing multiverse branches and possibilities...",
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

  // 1. Prefill support: from location.state or URL query params
  useEffect(() => {
    // Check location.state (e.g. from Dashboard Upcoming Branches "Try" button)
    if (location.state?.prefill) {
      setDecision(location.state.prefill);
      return;
    }

    // Check query string ?decision=... or ?q=...
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

  // 2. Rotate cosmic loading messages while loading
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

  // Validation
  const trimmedDecision = decision.trim();
  const isDecisionValid = trimmedDecision.length >= 10 && trimmedDecision.length <= 500;

  // Handle Submit
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

      // Check if crisis handler was triggered
      if (response?.crisis) {
        setIsLoading(false);
        setCrisisData(response.message);
        return;
      }

      // Ensure at least one original reality exists (fallback client-side synthesis if needed)
      let realities = response?.realities || response?.universes || [];
      const hasOriginal = realities.some((r) => r.type === "original");

      if (!hasOriginal) {
        const rootReality = {
          id: `real-orig-${Date.now()}`,
          universeId: response.id || `uni-${Date.now()}`,
          name: "Current Trajectory",
          type: "original",
          parentRealityId: null,
          parentEventId: null,
          summary: `Baseline reality representing life trajectory prior to: "${trimmedDecision}".`,
          career: "Current Career Path",
          industry: category,
          location: "Primary Location",
          skills: ["Core Competencies"],
          opportunities: ["Steady Continuation"],
          challenges: ["Status Quo Drift"],
          outcome: "The familiar path continues as charted.",
          events: [
            {
              id: `evt-base-1`,
              order: 1,
              year: new Date().getFullYear(),
              title: "The Crossroads",
              description: `Faced with the pivotal decision: "${trimmedDecision}".`,
              category: "Turning Point",
              skills: ["Decision Making"],
              opportunities: ["Self-reflection"],
              challenges: ["Uncertainty"],
              consequences: "Chose the default, familiar direction.",
            },
          ],
          simulations: [],
        };
        realities = [rootReality, ...realities];
      }

      const completeUniverse = {
        id: response.id || `uni-${Date.now()}`,
        originalDecision: trimmedDecision,
        category,
        durationYears: Number(durationYears) || 10,
        createdAt: response.createdAt || Date.now(),
        bookmarked: false,
        realities,
      };

      // Save to LocalStorage via Context
      saveUniverseToContext(completeUniverse);

      // Navigate to Explorer
      navigate(`/explore/${completeUniverse.id}`);
    } catch (err) {
      console.error("[CreateUniverse] Generation error:", err);
      setIsLoading(false);
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred while generating the multiverse. Please try again."
      );
    }
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
      {/* MAIN DUAL-COLUMN LAYOUT */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.15fr] gap-8 lg:gap-12 items-start pt-2 pb-8">
        {/* ================= LEFT COLUMN: FORM CONTROLS ================= */}
        <div className="flex flex-col gap-5">
          {/* Header pill matching Landing Page */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl w-fit shadow-[0_0_20px_rgba(200,233,169,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2F3F0]">
              Quantum Branching Engine
            </span>
          </div>

          {/* Heading matching Landing Page Monumental Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#F2F3F0] leading-[1.08]">
            <span>WHAT IF...?</span>
            <br />
            <span className="text-[#C8E9A9]">SYNTHESIZE REALITIES</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#A5A7A3] font-normal leading-relaxed max-w-[480px]">
            Enter a turning point or life decision. The multiverse engine generates coherent branching timelines, career trajectories, and milestones.
          </p>

          {/* Error Banner (if error occurred) */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs shadow-lg"
              >
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Generation Failed</p>
                  <p className="text-rose-300/90 mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={() => handleGenerate()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 font-medium text-[11px] transition-colors shrink-0"
                >
                  <RotateCcw size={12} />
                  <span>Retry</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CARD 1: YOUR DECISION */}
          <div className="glass-card focus-within:border-[#C8E9A9]/50 rounded-xl p-4 transition-all shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2.5">
              <GitFork size={14} className="text-[#C8E9A9] stroke-[2.2]" />
              <span className="text-[11px] font-semibold tracking-wider text-[#A5A7A3] uppercase">
                YOUR DECISION
              </span>
            </div>

            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value.slice(0, 500))}
              placeholder="e.g. What if I had chosen Mechanical Engineering instead of Computer Engineering?"
              rows={3}
              maxLength={500}
              className="w-full bg-transparent text-[#F2F3F0] text-sm placeholder-[#A5A7A3]/40 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-1 text-[11px]">
              <span className={trimmedDecision.length > 0 && trimmedDecision.length < 10 ? "text-amber-400" : "text-transparent"}>
                Min 10 characters required
              </span>
              <span className="text-[#A5A7A3]/70 font-mono">
                {decision.length} / 500
              </span>
            </div>
          </div>

          {/* CARD 2: SELECTORS ROW (CATEGORY & TIMELINE DURATION) */}
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
                className="w-full glass-card hover:border-[#C8E9A9]/50 rounded-xl p-3.5 flex items-center justify-between text-left transition-all shadow-md group cursor-pointer reflection-sheen"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-[#A5A7A3] group-hover:text-[#C8E9A9] transition-colors shrink-0">
                    <Layers size={15} />
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-wider text-[#A5A7A3] uppercase font-semibold">
                      CATEGORY
                    </span>
                    <span className="block text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {category}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-[#A5A7A3] transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Category Dropdown Menu */}
              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-xl p-1.5 shadow-2xl z-40"
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
                            ? "bg-[#C8E9A9]/10 text-[#C8E9A9] border border-[#C8E9A9]/30"
                            : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span>{cat}</span>
                        {category === cat && <Check size={13} className="text-[#C8E9A9]" />}
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
                className="w-full glass-card hover:border-[#C8E9A9]/50 rounded-xl p-3.5 flex items-center justify-between text-left transition-all shadow-md group cursor-pointer reflection-sheen"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-[#A5A7A3] group-hover:text-[#C8E9A9] transition-colors shrink-0">
                    <Clock size={15} />
                  </div>
                  <div>
                    <span className="block text-[10px] tracking-wider text-[#A5A7A3] uppercase font-semibold">
                      TIMELINE DURATION
                    </span>
                    <span className="block text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {durationYears} Years
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-[#A5A7A3] transition-transform ${durationOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Duration Dropdown Menu */}
              <AnimatePresence>
                {durationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-xl p-1.5 shadow-2xl z-40"
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
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          durationYears === dur.value && !showCustomDurationInput
                            ? "bg-[#C8E9A9]/10 text-[#C8E9A9] border border-[#C8E9A9]/30"
                            : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span>{dur.label}</span>
                        {durationYears === dur.value && !showCustomDurationInput && (
                          <Check size={13} className="text-[#C8E9A9]" />
                        )}
                      </button>
                    ))}

                    {/* Custom Duration Option */}
                    <div className="pt-1 mt-1 border-t border-white/[0.04]">
                      {showCustomDurationInput ? (
                        <div className="flex items-center gap-1.5 p-1">
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={customDuration}
                            placeholder="Years (1-50)"
                            onChange={(e) => setCustomDuration(e.target.value)}
                            className="w-full glass-input rounded-lg px-2.5 py-1 text-xs text-[#F2F3F0] focus:outline-none"
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
                            className="px-2.5 py-1 bg-[#C8E9A9] text-[#050505] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Set
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCustomDurationInput(true)}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#A5A7A3] hover:text-[#F2F3F0] rounded-xl hover:bg-white/[0.04] cursor-pointer"
                        >
                          Custom Duration...
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CARD 3: NUMBER OF ALTERNATE REALITIES */}
          <div className="glass-card rounded-xl p-3.5 shadow-md overflow-hidden relative reflection-sheen">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2.5">
              <GitBranch size={13} className="text-[#A5A7A3]" />
              <span className="text-[11px] font-semibold tracking-wider text-[#A5A7A3] uppercase">
                NUMBER OF ALTERNATE REALITIES
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
                    className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "nav-pill-active text-[#C8E9A9] shadow-[0_0_12px_rgba(200,233,169,0.3)]"
                        : "glass-pill text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#C8E9A9]/40"
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
              className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                isDecisionValid && !isLoading
                  ? "bg-[#C8E9A9] text-[#050505] shadow-[0_0_24px_rgba(200,233,169,0.38)] hover:bg-[#d5f2b8] hover:shadow-[0_0_36px_rgba(200,233,169,0.65)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                  : "bg-white/[0.08] text-white/30 border border-white/[0.08] cursor-not-allowed"
              }`}
            >
              <GitFork size={15} className="stroke-[2.5]" />
              <span>Synthesize Realities</span>
              <ArrowRight size={15} className="stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#A5A7A3]">
              <Clock size={13} />
              <span>Est. time: ~15-30s</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: COSMIC PORTAL & PREVIEW ================= */}
        <div className="relative flex flex-col items-center justify-between h-full min-h-[460px]">
          {/* Swirling Cosmic Wormhole / Traveler Visual */}
          <div className="relative w-full h-[320px] sm:h-[360px] rounded-xl overflow-hidden flex items-center justify-center">
            {/* Space background with starlight vortex */}
            <img
              src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80"
              alt="Cosmic Portal"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.75] contrast-125"
            />
            {/* Swirling radial portal overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050505_95%)] pointer-events-none" />

            {/* Glowing Center Vortex Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 rounded-full border border-cyan-200/25 animate-spin duration-1000 shadow-[0_0_80px_rgba(200,233,169,0.2)]" />
              <div className="absolute w-44 h-44 rounded-full border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
              <div className="absolute w-32 h-32 rounded-full border border-[#C8E9A9]/30" />
            </div>

            {/* Solitary Explorer Silhouette standing on a rock */}
            <div className="absolute bottom-4 z-10 flex flex-col items-center">
              <svg viewBox="0 0 100 120" className="w-20 h-24 drop-shadow-2xl">
                {/* Rock peak */}
                <path d="M10 120 L40 75 L60 75 L90 120 Z" fill="#060708" />
                {/* Explorer backpack & body */}
                <ellipse cx="45" cy="50" rx="8" ry="12" fill="#0A0C0E" />
                <rect x="44" y="38" width="12" height="24" rx="4" fill="#070809" />
                {/* Head / Hood */}
                <circle cx="50" cy="30" r="6" fill="#070809" />
                {/* Legs */}
                <line x1="47" y1="62" x2="44" y2="80" stroke="#070809" strokeWidth="4" strokeLinecap="round" />
                <line x1="53" y1="62" x2="56" y2="80" stroke="#070809" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Vertical spaced tracking label */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-[10px] tracking-[0.3em] font-medium text-[#A5A7A3]/80 leading-loose uppercase select-none">
              <span>EXPLORE</span>
              <span>YOUR</span>
              <span>POSSIBLE</span>
              <span>TIMELINES</span>
            </div>
          </div>

          {/* CARD: WHAT TO EXPECT? (PIPELINE PREVIEW) */}
          <div className="w-full glass-card rounded-xl p-4 shadow-xl mt-4 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#C8E9A9] stroke-[2.2]" />
                <span className="text-[11px] font-semibold tracking-wider text-[#A5A7A3] uppercase">
                  WHAT TO EXPECT?
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-[10px] text-[#A5A7A3]">
                <Eye size={11} />
                <span>PREVIEW</span>
              </div>
            </div>

            {/* Pipeline Step Diagram */}
            <div className="flex items-center justify-between px-3 py-1">
              {/* Step 1: Current Life */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C8E9A9]/50 shadow-[0_0_12px_rgba(200,233,169,0.25)] p-0.5 mb-2 bg-[#101113]">
                  <img
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=100&q=70"
                    alt="Current Life"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-[10px] text-[#A5A7A3] font-medium max-w-[70px] leading-tight">
                  Your Current Life
                </span>
              </div>

              {/* Connector line 1 */}
              <div className="flex-1 flex items-center justify-center px-2">
                <div className="w-full h-[1px] bg-gradient-to-r from-[#292C2C] via-[#C8E9A9]/60 to-[#292C2C] relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                </div>
              </div>

              {/* Step 2: Alternative Timelines */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full glass-btn-circle flex items-center justify-center text-[#F2F3F0] font-bold text-sm shadow-md mb-2">
                  ?
                </div>
                <span className="text-[10px] text-[#A5A7A3] font-medium max-w-[70px] leading-tight">
                  Alternative Timelines
                </span>
              </div>

              {/* Connector line 2 */}
              <div className="flex-1 flex items-center justify-center px-2">
                <div className="w-full h-[1px] bg-gradient-to-r from-[#292C2C] via-[#C8E9A9]/60 to-[#292C2C] relative flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                </div>
              </div>

              {/* Step 3: New Possibilities */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-md p-0.5 mb-2 bg-[#101113]">
                  <img
                    src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=100&q=70"
                    alt="New Possibilities"
                    className="w-full h-full object-cover rounded-full grayscale brightness-80"
                  />
                </div>
                <span className="text-[10px] text-[#A5A7A3] font-medium max-w-[70px] leading-tight">
                  New Possibilities
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER DISCLAIMER BAR ================= */}
      <div className="relative z-10 w-full rounded-xl glass-card px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A5A7A3] mt-3 gap-2 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2">
          <Info size={14} className="text-[#A5A7A3] shrink-0" />
          <span>This is a creative exploration. Not a prediction.</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block w-px h-3 bg-white/[0.1]" />
          <div className="flex items-center gap-1.5 text-xs text-[#A5A7A3]">
            <Cpu size={13} className="text-[#9678C9]" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </div>

      {/* ================= FULL-SCREEN COSMIC LOADING OVERLAY ================= */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Spinning Portal Spinner */}
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#C8E9A9]/20 border-t-[#C8E9A9] animate-spin duration-700 shadow-[0_0_30px_rgba(200,233,169,0.3)]" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-white/10 border-b-cyan-300 animate-spin duration-1000 direction-reverse" />
              <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#C8E9A9] shadow-inner">
                <GitFork size={20} className="animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-wide mb-2">
              WEAVING MULTIVERSE
            </h2>

            {/* Rotating Status Messages */}
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsgIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-[#C8E9A9] font-mono max-w-md h-8"
              >
                {COSMIC_MESSAGES[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>

            <p className="text-xs text-[#A5A7A3]/70 mt-6 max-w-xs">
              Calculating divergent life pathways, milestones, and turning points. This typically takes 15–30 seconds.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CRISIS SUPPORT MODAL ================= */}
      <AnimatePresence>
        {crisisData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel rounded-xl p-6 sm:p-7 max-w-lg w-full text-[#F2F3F0] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <HeartHandshake size={20} />
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    You Are Not Alone
                  </span>
                </div>
                <button
                  onClick={() => setCrisisData(null)}
                  className="w-7 h-7 rounded-full glass-btn-circle flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-sm text-[#A5A7A3] leading-relaxed mb-6">
                {crisisData}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setCrisisData(null)}
                  className="px-5 py-2.5 rounded-lg glass-pill hover:border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
