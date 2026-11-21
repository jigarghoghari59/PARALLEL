// src/pages/Compare.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Compass,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Building2,
  Trophy,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useUniverse } from "../context/UniverseContext";
import { api } from "../services/apiClient";
import { Modal } from "../components/common/Modal";

// Preset comparison items
const DEFAULT_PRESETS = [
  {
    id: "preset-1",
    universeId: "uni-computer-eng-01",
    realityIds: ["real-software-dev", "real-mechanical-eng"],
    title: "Computer Eng. vs Mechanical Eng.",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "preset-2",
    universeId: "uni-auto-path-03",
    realityIds: ["real-auto-aero", "real-auto-motorsport"],
    title: "Stay in India vs Move Abroad",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "preset-3",
    universeId: "uni-tech-ent-04",
    realityIds: ["real-seed-founder", "real-venture-partner"],
    title: "Tech vs Business",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85",
  },
];

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { universes, getComparison, saveComparison } = useUniverse();

  // Modal for new comparison
  const [newComparisonModalOpen, setNewComparisonModalOpen] = useState(false);
  const [modalSelectedUniverseId, setModalSelectedUniverseId] = useState("");
  const [modalSelectedRealities, setModalSelectedRealities] = useState([]);

  // Active query parameters
  const queryUniverseId = searchParams.get("universe");
  const queryRealityA = searchParams.get("a");
  const queryRealityB = searchParams.get("b");
  const queryRealityC = searchParams.get("c");

  // Determine active universe
  const currentUniverse = useMemo(() => {
    if (queryUniverseId) {
      const found = universes.find((u) => u.id === queryUniverseId);
      if (found) return found;
    }
    return (
      universes.find((u) => u.id === "uni-computer-eng-01") ||
      universes[0] ||
      null
    );
  }, [universes, queryUniverseId]);

  // Determine realities to compare
  const comparedRealities = useMemo(() => {
    if (!currentUniverse || !currentUniverse.realities?.length) return [];

    if (queryRealityA && queryRealityB) {
      const rA = currentUniverse.realities.find((r) => r.id === queryRealityA);
      const rB = currentUniverse.realities.find((r) => r.id === queryRealityB);
      const rC = queryRealityC
        ? currentUniverse.realities.find((r) => r.id === queryRealityC)
        : null;
      if (rA && rB) {
        return rC ? [rA, rB, rC] : [rA, rB];
      }
    }

    // Default to first two realities of the universe
    return currentUniverse.realities.slice(0, 2);
  }, [currentUniverse, queryRealityA, queryRealityB, queryRealityC]);

  const comparedIds = useMemo(
    () => comparedRealities.map((r) => r.id),
    [comparedRealities]
  );

  // Comparison AI Results State
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch or retrieve cached comparison
  const fetchComparison = useCallback(async () => {
    if (!currentUniverse || comparedRealities.length < 2) return;

    const cached = getComparison(currentUniverse.id, comparedIds);
    if (cached) {
      setComparisonData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        originalDecision: currentUniverse.originalDecision || "",
        realities: comparedRealities.map((r) => ({
          id: r.id,
          name: r.name,
          career: r.career || "",
          industry: r.industry || "",
          location: r.location || "",
          summary: r.summary || "",
          outcome: r.outcome || "",
        })),
      };

      const res = await api.compareRealities(payload);
      const dataToSave = {
        realities: res.realities || [],
        takeaways: res.takeaways || [],
        finalSummary: res.finalSummary || "",
        quickInsights:
          res.quickInsights ||
          "Both paths lead to distinct careers with unique compounding advantages.",
      };

      saveComparison(currentUniverse.id, comparedIds, dataToSave);
      setComparisonData(dataToSave);
      setLoading(false);
    } catch (err) {
      console.error("[Compare] API error:", err);
      // Fallback illustrative scores
      const fallbackScores = {
        realities: comparedRealities.map((r, idx) => ({
          id: r.id,
          scores: {
            careerGrowth: idx === 0 ? 9.5 : 9.0,
            incomePotential: idx === 0 ? 9.2 : 8.8,
            workLifeBalance: idx === 0 ? 7.8 : 8.5,
            innovationImpact: idx === 0 ? 9.0 : 9.5,
          },
          summary: r.summary || "",
        })),
        takeaways: [
          "Choose what excites you more, software architectures or physical engineering systems.",
        ],
        finalSummary:
          "Both realities present viable trajectories. The optimal path depends on your target domain and preferred pace.",
        quickInsights:
          "Both paths lead to distinct careers with unique compounding advantages.",
      };
      setComparisonData(fallbackScores);
      setLoading(false);
    }
  }, [currentUniverse, comparedRealities, comparedIds, getComparison, saveComparison]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    const targetUni = universes.find((u) => u.id === preset.universeId);
    if (targetUni) {
      const [a, b] = preset.realityIds;
      setSearchParams({
        universe: preset.universeId,
        a,
        b,
      });
    }
  };

  // Open "Create New Comparison" modal
  const handleOpenNewComparison = () => {
    const defaultUniId = currentUniverse?.id || universes[0]?.id || "";
    setModalSelectedUniverseId(defaultUniId);
    const uni = universes.find((u) => u.id === defaultUniId);
    if (uni?.realities?.length >= 2) {
      setModalSelectedRealities([uni.realities[0].id, uni.realities[1].id]);
    } else {
      setModalSelectedRealities([]);
    }
    setNewComparisonModalOpen(true);
  };

  // Execute custom comparison from modal
  const handleApplyCustomComparison = () => {
    if (modalSelectedRealities.length < 2) return;
    const [a, b, c] = modalSelectedRealities;
    const params = { universe: modalSelectedUniverseId, a, b };
    if (c) params.c = c;
    setSearchParams(params);
    setNewComparisonModalOpen(false);
  };

  // Build chart dataset from comparison data
  const chartData = useMemo(() => {
    const rA = comparedRealities[0];
    const rB = comparedRealities[1];
    const rC = comparedRealities[2] || null;

    const scoresA =
      comparisonData?.realities?.find((r) => r.id === rA?.id)?.scores || {
        careerGrowth: 9.5,
        incomePotential: 9.2,
        workLifeBalance: 7.8,
        innovationImpact: 9.0,
      };

    const scoresB =
      comparisonData?.realities?.find((r) => r.id === rB?.id)?.scores || {
        careerGrowth: 9.0,
        incomePotential: 8.8,
        workLifeBalance: 8.5,
        innovationImpact: 9.5,
      };

    const scoresC = rC
      ? comparisonData?.realities?.find((r) => r.id === rC.id)?.scores || {
          careerGrowth: 8.5,
          incomePotential: 9.0,
          workLifeBalance: 8.0,
          innovationImpact: 8.8,
        }
      : null;

    const categories = [
      { key: "careerGrowth", label: "Career Growth" },
      { key: "incomePotential", label: "Income Potential" },
      { key: "workLifeBalance", label: "Work-Life Balance" },
      { key: "innovationImpact", label: "Innovation Impact" },
    ];

    return categories.map((cat) => {
      const valA = Math.round(Number(scoresA[cat.key] || 8) * 10);
      const valB = Math.round(Number(scoresB[cat.key] || 8) * 10);
      const item = {
        category: cat.label,
        realityA: valA,
        realityB: valB,
        realityALabel: `${valA}%`,
        realityBLabel: `${valB}%`,
      };
      if (rC && scoresC) {
        const valC = Math.round(Number(scoresC[cat.key] || 8) * 10);
        item.realityC = valC;
        item.realityCLabel = `${valC}%`;
      }
      return item;
    });
  }, [comparedRealities, comparisonData]);

  // Reality A & Reality B objects
  const realityA = comparedRealities[0];
  const realityB = comparedRealities[1];

  const quickInsightsText =
    comparisonData?.quickInsights ||
    "Both paths lead to distinct careers with unique compounding advantages.";

  const keyTakeawayText =
    comparisonData?.takeaways?.[0] ||
    "Choose what excites you more, software architectures or physical engineering systems.";

  const finalVerdictText =
    comparisonData?.finalSummary ||
    "Both realities present viable trajectories. The optimal path depends on your target domain and preferred pace.";

  const isPresetActive = (preset) => {
    if (!currentUniverse) return false;
    if (preset.universeId !== currentUniverse.id) return false;
    const [pA, pB] = preset.realityIds;
    return comparedIds.includes(pA) && comparedIds.includes(pB);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 select-none">
      {/* Top Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-rule w-fit mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          <span className="text-xs font-medium text-ink">
            Reality comparison matrix
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Compare parallel realities
        </h1>
        <p className="text-sm text-muted font-normal mt-2 max-w-xl">
          Examine divergence points, career vectors, coherence scores, and lifestyle differences between your alternate realities side by side.
        </p>
      </div>

      <div>
        {/* TOP LEVEL GRID (Left Sidebar 3 Cols, Right Content 9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: PRESETS & EXPLORE MORE (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-semibold text-muted px-1">
              Comparison presets
            </h2>

            {/* Presets List */}
            <div className="space-y-2 pt-1">
              {DEFAULT_PRESETS.map((preset) => {
                const active = isPresetActive(preset);

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-card flex items-center gap-3 transition-colors duration-150 cursor-pointer overflow-hidden border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? "bg-accent/10 border-accent/40 text-ink"
                        : "bg-surface/50 hover:bg-surface border-rule text-muted hover:text-ink"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-paper-3 border border-rule shrink-0">
                      <img
                        src={preset.image}
                        alt={preset.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-ink truncate leading-tight">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-muted mt-0.5">
                        {preset.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inset Panel: Explore More */}
            <div className="border border-rule rounded-card p-4 space-y-2 bg-surface/40">
              <div className="text-accent">
                <Compass size={16} aria-hidden="true" />
              </div>
              <h3 className="text-xs font-semibold text-ink">Explore more</h3>
              <p className="text-xs text-muted leading-relaxed">
                Discover new comparisons across different decisions.
              </p>

              <button
                onClick={handleOpenNewComparison}
                className="mt-3 w-full py-2 px-3 rounded-full bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs flex items-center justify-center gap-2 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>Create new comparison</span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* MAIN COMPARISON WORKSPACE (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* UPPER ROW: SIDE-BY-SIDE REALITY CARDS + QUICK INSIGHTS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* CENTER AREA: REALITY A & REALITY B CARDS (8 Cols) */}
              <div className="xl:col-span-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                  {/* REALITY A CARD */}
                  {realityA && (
                    <div className="bg-card border border-rule rounded-card p-5 flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          Reality A
                        </div>

                        {/* Title & Career */}
                        <h2 className="text-base font-bold text-ink tracking-tight leading-snug">
                          {realityA.name}
                        </h2>
                        <p className="text-xs text-muted font-medium mt-0.5">
                          {realityA.career || "Software Developer"}
                        </p>

                        {/* Banner Image */}
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-paper-3 border border-rule my-3">
                          <img
                            src={
                              realityA.image ||
                              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=85"
                            }
                            alt={realityA.name}
                            className="w-full h-full object-cover opacity-80"
                          />
                        </div>

                        {/* Attributes List */}
                        <div className="space-y-2 text-xs pt-1 divide-y divide-rule/60">
                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Briefcase size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Career</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityA.career || "Software Development"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <GraduationCap size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Skills</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityA.skills)
                                ? realityA.skills.slice(0, 3).join(", ")
                                : "Programming, System Design"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Building2 size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Industry</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityA.industry || "Tech & Product"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Trophy size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Opportunities</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityA.opportunities)
                                ? realityA.opportunities.slice(0, 2).join(", ")
                                : "FAANG, Startups"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Challenges</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityA.challenges)
                                ? realityA.challenges.slice(0, 1).join(", ")
                                : "High Competition"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Target size={12} className="text-accent" aria-hidden="true" />
                              <span className="text-xs text-muted">Outcome</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityA.outcome || "Successful Tech Career"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FLOATING "VS" CIRCULAR BADGE IN THE MIDDLE */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-rule items-center justify-center text-[11px] font-bold text-ink pointer-events-none">
                    vs
                  </div>

                  {/* REALITY B CARD */}
                  {realityB && (
                    <div className="bg-card border border-rule rounded-card p-5 flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple/10 border border-purple/30 text-purple text-xs font-medium mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                          Reality B
                        </div>

                        {/* Title & Career */}
                        <h2 className="text-base font-bold text-ink tracking-tight leading-snug">
                          {realityB.name}
                        </h2>
                        <p className="text-xs text-muted font-medium mt-0.5">
                          {realityB.career || "Robotics Engineer"}
                        </p>

                        {/* Banner Image */}
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-paper-3 border border-rule my-3">
                          <img
                            src={
                              realityB.image ||
                              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=85"
                            }
                            alt={realityB.name}
                            className="w-full h-full object-cover opacity-80"
                          />
                        </div>

                        {/* Attributes List */}
                        <div className="space-y-2 text-xs pt-1 divide-y divide-rule/60">
                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Briefcase size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Career</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityB.career || "Robotics & Automation"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <GraduationCap size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Skills</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityB.skills)
                                ? realityB.skills.slice(0, 3).join(", ")
                                : "Mechanical Design, AI"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Building2 size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Industry</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityB.industry || "Automotive, Robotics"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Trophy size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Opportunities</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityB.opportunities)
                                ? realityB.opportunities.slice(0, 2).join(", ")
                                : "R&D, Innovation"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-muted" aria-hidden="true" />
                              <span className="text-xs text-muted">Challenges</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {Array.isArray(realityB.challenges)
                                ? realityB.challenges.slice(0, 1).join(", ")
                                : "Technical Complexity"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-muted pt-1.5">
                            <div className="flex items-center gap-2">
                              <Target size={12} className="text-accent" aria-hidden="true" />
                              <span className="text-xs text-muted">Outcome</span>
                            </div>
                            <span className="text-xs font-medium text-ink truncate max-w-[150px]">
                              {realityB.outcome || "Leader in Robotics Field"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT UPPER: QUICK INSIGHTS & PROGRESS BARS (4 Cols) */}
              <div className="xl:col-span-4 flex flex-col justify-between bg-card border border-rule rounded-card p-5 space-y-4 overflow-hidden">
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-2">
                    <TrendingUp size={14} className="text-accent" aria-hidden="true" />
                    <span>Quick insights</span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-xs text-muted leading-relaxed">
                    {quickInsightsText}
                  </p>

                  {/* Metric Progress Bars */}
                  <div className="space-y-3 mt-4">
                    {/* Career Growth */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-ink">Career Growth</span>
                        <span className="text-muted tabular-nums">92%</span>
                      </div>
                      <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    {/* Work-Life Balance */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-ink">Work-Life Balance</span>
                        <span className="text-muted tabular-nums">78%</span>
                      </div>
                      <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: "78%" }}
                        />
                      </div>
                    </div>

                    {/* Innovation Impact */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-ink">Innovation Impact</span>
                        <span className="text-muted tabular-nums">95%</span>
                      </div>
                      <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: "95%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Inset: Key Takeaway */}
                <div className="border-t border-rule pt-3 flex items-start gap-2.5">
                  <div className="text-accent shrink-0 mt-0.5">
                    <Lightbulb size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-ink">Key takeaway</h5>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">
                      {keyTakeawayText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER ROW: GROUPED BAR CHART & FINAL VERDICT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* RECHARTS GROUPED BAR CHART (8 Cols) */}
              <div className="xl:col-span-8 bg-card border border-rule rounded-card p-5 overflow-hidden">
                {/* Chart Header + Legend */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} className="text-muted" aria-hidden="true" />
                    <h3 className="text-xs font-semibold text-ink">
                      Side by side analysis
                    </h3>
                  </div>

                  {/* Legend Indicators */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-muted text-xs">
                        Reality A
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple" />
                      <span className="text-muted text-xs">
                        Reality B
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grouped Bar Chart */}
                <div className="w-full h-52 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                      barGap={6}
                    >
                      <CartesianGrid
                        stroke="var(--color-rule)"
                        strokeOpacity={0.3}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 500 }}
                        axisLine={{ stroke: "var(--color-rule)" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-rule)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "var(--color-ink)",
                        }}
                        formatter={(val) => [`${val}%`, ""]}
                      />
                      {/* Reality A Bar: Sage */}
                      <Bar
                        dataKey="realityA"
                        fill="var(--color-accent)"
                        radius={[4, 4, 0, 0]}
                        name="Reality A"
                      >
                        <LabelList
                          dataKey="realityALabel"
                          position="top"
                          fill="var(--color-ink)"
                          fontSize={10}
                          fontWeight={500}
                        />
                      </Bar>

                      {/* Reality B Bar: Purple */}
                      <Bar
                        dataKey="realityB"
                        fill="var(--color-purple)"
                        radius={[4, 4, 0, 0]}
                        name="Reality B"
                      >
                        <LabelList
                          dataKey="realityBLabel"
                          position="top"
                          fill="var(--color-ink)"
                          fontSize={10}
                          fontWeight={500}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* FINAL VERDICT CARD (4 Cols) */}
              <div className="xl:col-span-4 relative bg-card border border-rule rounded-card p-5 overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-2">
                    <Award size={14} className="text-accent" aria-hidden="true" />
                    <span>Final verdict</span>
                  </div>

                  {/* Main Verdict Heading */}
                  <h3 className="text-base font-bold text-ink tracking-tight leading-snug">
                    Both realities are viable paths.
                  </h3>

                  {/* Verdict Description */}
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {finalVerdictText}
                  </p>
                </div>

                {/* Speculative notice */}
                <div className="relative z-10 pt-6 text-[11px] text-muted/70">
                  AI-generated speculative comparison, not predictive fact.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "CREATE NEW COMPARISON" MODAL */}
      <Modal
        open={newComparisonModalOpen}
        onClose={() => setNewComparisonModalOpen(false)}
        title="Create New Comparison"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          {/* Pick Universe */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Select universe:
            </label>
            <select
              value={modalSelectedUniverseId}
              onChange={(e) => {
                const newId = e.target.value;
                setModalSelectedUniverseId(newId);
                const uni = universes.find((u) => u.id === newId);
                if (uni?.realities?.length >= 2) {
                  setModalSelectedRealities([uni.realities[0].id, uni.realities[1].id]);
                } else {
                  setModalSelectedRealities([]);
                }
              }}
              className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {universes.map((u) => (
                <option key={u.id} value={u.id} className="bg-card text-ink">
                  {u.title || u.originalDecision} ({u.realities?.length || 0} realities)
                </option>
              ))}
            </select>
          </div>

          {/* Pick 2 to 3 realities */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Pick 2 or 3 realities to compare:
            </label>

            {(() => {
              const activeUni = universes.find((u) => u.id === modalSelectedUniverseId);
              const realities = activeUni?.realities || [];

              if (realities.length < 2) {
                return (
                  <p className="text-xs text-muted py-2">
                    This universe has fewer than 2 realities. Please create or branch realities first.
                  </p>
                );
              }

              return (
                <div className="space-y-2">
                  {realities.map((r) => {
                    const isSelected = modalSelectedRealities.includes(r.id);

                    const toggleSelect = () => {
                      if (isSelected) {
                        setModalSelectedRealities((prev) =>
                          prev.filter((id) => id !== r.id)
                        );
                      } else {
                        if (modalSelectedRealities.length >= 3) {
                          return;
                        }
                        setModalSelectedRealities((prev) => [...prev, r.id]);
                      }
                    };

                    return (
                      <div
                        key={r.id}
                        onClick={toggleSelect}
                        className={`p-2.5 rounded-card border flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? "bg-accent/10 border-accent/40 text-ink"
                            : "bg-surface/50 border-rule hover:border-rule/80 text-muted"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-semibold text-ink truncate">{r.name}</div>
                          <div className="text-[11px] text-muted truncate">
                            {r.career || r.industry || "General"}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-accent border-accent text-accent-ink"
                              : "border-rule"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} aria-hidden="true" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-rule">
            <button
              type="button"
              onClick={() => setNewComparisonModalOpen(false)}
              className="px-4 py-2 rounded-btn bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={modalSelectedRealities.length < 2}
              onClick={handleApplyCustomComparison}
              className="px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Compare realities
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
