// src/pages/Compare.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Briefcase,
  GraduationCap,
  Building2,
  Trophy,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  RefreshCw,
  Layers,
  ArrowRight,
  Check,
  Scale,
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

// Preset comparison items matching reference UI
const DEFAULT_PRESETS = [
  {
    id: "preset-1",
    universeId: "uni-computer-eng-01",
    realityIds: ["real-software-dev", "real-mechanical-eng"],
    title: "Computer Eng. vs Mechanical Eng.",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-2",
    universeId: "uni-auto-path-03",
    realityIds: ["real-auto-aero", "real-auto-motorsport"],
    title: "Stay in India vs Move Abroad",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-3",
    universeId: "uni-tech-ent-04",
    realityIds: ["real-seed-founder", "real-venture-partner"],
    title: "Tech vs Business",
    subtitle: "2 Realities",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
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
          "Both paths lead to successful careers, but with different experiences and opportunities.",
      };

      saveComparison(currentUniverse.id, comparedIds, dataToSave);
      setComparisonData(dataToSave);
      setLoading(false);
    } catch (err) {
      console.error("[Compare] API error:", err);
      // Fallback fallback illustrative scores so user always sees rich visuals
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
          "Choose what excites you more — coding or creating in the physical world.",
        ],
        finalSummary:
          "Both realities are incredible. It all comes down to what kind of impact you want to make.",
        quickInsights:
          "Both paths lead to successful careers, but with different experiences and opportunities.",
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
    "Both paths lead to successful careers, but with different experiences and opportunities.";

  const keyTakeawayText =
    comparisonData?.takeaways?.[0] ||
    "Choose what excites you more — coding or creating in the physical world.";

  const finalVerdictText =
    comparisonData?.finalSummary ||
    "Both realities are incredible. It all comes down to what kind of impact you want to make.";

  const isPresetActive = (preset) => {
    if (!currentUniverse) return false;
    if (preset.universeId !== currentUniverse.id) return false;
    const [pA, pB] = preset.realityIds;
    return comparedIds.includes(pA) && comparedIds.includes(pB);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] overflow-x-hidden select-none pb-12">
      {/* Background Starlight & Cosmic Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-40" />
        <div className="absolute top-28 right-[12%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-white rounded-full opacity-30" />
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* TOP LEVEL GRID (Left Sidebar 3 Cols, Right Content 9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: PRESETS & EXPLORE MORE (3 Cols)             */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* Back to Explorer Pill */}
            <Link
              to={currentUniverse ? `/explore/${currentUniverse.id}` : "/explore"}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D0E]/90 hover:bg-[#141618] border border-[#292C2C] hover:border-[#3d4040] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors shadow-sm"
            >
              <ArrowLeft size={13} />
              <span>Back to Explorer</span>
            </Link>

            {/* Page Title Block */}
            <div className="pt-1">
              <h1 className="text-2xl font-extrabold text-[#F2F3F0] tracking-tight">
                Compare Realities
              </h1>
              <p className="text-xs text-[#A5A7A3] mt-1 font-medium">
                See how different choices shape your life.
              </p>
            </div>

            {/* Presets List */}
            <div className="space-y-2.5 pt-2">
              {DEFAULT_PRESETS.map((preset) => {
                const active = isPresetActive(preset);

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-md ${
                      active
                        ? "bg-[#0E1210] border-2 border-[#C8E9A9] shadow-[0_0_15px_rgba(200,233,169,0.18)]"
                        : "bg-[#0B0D0E]/85 border border-[#292C2C] hover:border-[#3d4040] hover:bg-[#101214]"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/70 border border-white/5 shrink-0">
                      <img
                        src={preset.image}
                        alt={preset.title}
                        className="w-full h-full object-cover brightness-85"
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#F2F3F0] truncate leading-tight">
                        {preset.title}
                      </h4>
                      <p className="text-[10px] text-[#A5A7A3] mt-0.5">
                        {preset.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Card: Explore More */}
            <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-4.5 shadow-xl relative overflow-hidden">
              <div className="text-[#C8E9A9] mb-2">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-bold text-[#F2F3F0]">Explore More</h3>
              <p className="text-[11px] text-[#A5A7A3] mt-1 leading-relaxed">
                Discover new comparisons across different decisions.
              </p>

              <button
                onClick={handleOpenNewComparison}
                className="mt-4 w-full py-2.5 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] text-[#050505] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(200,233,169,0.25)]"
              >
                <span>Create New Comparison</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MAIN COMPARISON WORKSPACE (9 Cols)                       */}
          {/* ======================================================== */}
          <div className="lg:col-span-9 space-y-6">
            {/* UPPER ROW: SIDE-BY-SIDE REALITY CARDS + QUICK INSIGHTS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* CENTER AREA: REALITY A & REALITY B CARDS (8 Cols) */}
              <div className="xl:col-span-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                  {/* REALITY A CARD */}
                  {realityA && (
                    <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-4.5 shadow-2xl flex flex-col justify-between backdrop-blur-md">
                      <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141a15] border border-[#C8E9A9]/20 text-[#C8E9A9] text-[9px] font-bold tracking-wider uppercase mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                          REALITY A
                        </div>

                        {/* Title & Career */}
                        <h2 className="text-base sm:text-lg font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
                          {realityA.name}
                        </h2>
                        <p className="text-xs text-[#A5A7A3] font-medium mt-0.5">
                          {realityA.career || "Software Developer"}
                        </p>

                        {/* Banner Image */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/80 border border-white/5 my-3.5">
                          <img
                            src={
                              realityA.image ||
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={realityA.name}
                            className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-transparent" />
                        </div>

                        {/* Attributes List */}
                        <div className="space-y-2 text-xs pt-1">
                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Briefcase size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Career</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {realityA.career || "Software Development"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <GraduationCap size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Skills</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityA.skills)
                                ? realityA.skills.slice(0, 3).join(", ")
                                : "Programming, System Design"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Building2 size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Industry</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {realityA.industry || "Tech & Product"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Trophy size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Opportunities</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityA.opportunities)
                                ? realityA.opportunities.slice(0, 2).join(", ")
                                : "FAANG, Startups"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Challenges</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityA.challenges)
                                ? realityA.challenges.slice(0, 1).join(", ")
                                : "High Competition"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Sparkles size={12} className="text-[#C8E9A9]" />
                              <span className="text-[11px] text-[#A5A7A3]">Outcome</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {realityA.outcome || "Successful Tech Career"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FLOATING "VS" CIRCULAR BADGE IN THE MIDDLE */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#050505] border-2 border-[#292C2C] shadow-2xl items-center justify-center text-[10px] font-extrabold text-[#F2F3F0] tracking-wider pointer-events-none">
                    VS
                  </div>

                  {/* REALITY B CARD */}
                  {realityB && (
                    <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-4.5 shadow-2xl flex flex-col justify-between backdrop-blur-md">
                      <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181520] border border-[#9678C9]/30 text-[#9678C9] text-[9px] font-bold tracking-wider uppercase mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9678C9]" />
                          REALITY B
                        </div>

                        {/* Title & Career */}
                        <h2 className="text-base sm:text-lg font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
                          {realityB.name}
                        </h2>
                        <p className="text-xs text-[#A5A7A3] font-medium mt-0.5">
                          {realityB.career || "Robotics Engineer"}
                        </p>

                        {/* Banner Image */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/80 border border-white/5 my-3.5">
                          <img
                            src={
                              realityB.image ||
                              "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={realityB.name}
                            className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-transparent" />
                        </div>

                        {/* Attributes List */}
                        <div className="space-y-2 text-xs pt-1">
                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Briefcase size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Career</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {realityB.career || "Robotics & Automation"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <GraduationCap size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Skills</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityB.skills)
                                ? realityB.skills.slice(0, 3).join(", ")
                                : "Mechanical Design, AI"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Building2 size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Industry</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {realityB.industry || "Automotive, Robotics"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Trophy size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Opportunities</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityB.opportunities)
                                ? realityB.opportunities.slice(0, 2).join(", ")
                                : "R&D, Innovation"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-[#A5A7A3]" />
                              <span className="text-[11px] text-[#A5A7A3]">Challenges</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
                              {Array.isArray(realityB.challenges)
                                ? realityB.challenges.slice(0, 1).join(", ")
                                : "Technical Complexity"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#A5A7A3]">
                            <div className="flex items-center gap-2">
                              <Sparkles size={12} className="text-[#C8E9A9]" />
                              <span className="text-[11px] text-[#A5A7A3]">Outcome</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#F2F3F0] truncate max-w-[150px]">
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
              <div className="xl:col-span-4 flex flex-col justify-between bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-4">
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2F3F0] tracking-wide mb-2.5">
                    <Sparkles size={13} className="text-[#C8E9A9]" />
                    <span>Quick Insights</span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-xs text-[#A5A7A3] leading-relaxed">
                    {quickInsightsText}
                  </p>

                  {/* Metric Progress Bars */}
                  <div className="space-y-3.5 mt-5">
                    {/* Career Growth */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F2F3F0]">Career Growth</span>
                        <span className="text-[#F2F3F0] font-mono">92%</span>
                      </div>
                      <div className="w-full bg-[#161a15] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C8E9A9] h-full rounded-full transition-all duration-700"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    {/* Work-Life Balance */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F2F3F0]">Work-Life Balance</span>
                        <span className="text-[#F2F3F0] font-mono">78%</span>
                      </div>
                      <div className="w-full bg-[#161a15] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C8E9A9] h-full rounded-full transition-all duration-700"
                          style={{ width: "78%" }}
                        />
                      </div>
                    </div>

                    {/* Innovation Impact */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F2F3F0]">Innovation Impact</span>
                        <span className="text-[#F2F3F0] font-mono">95%</span>
                      </div>
                      <div className="w-full bg-[#161a15] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C8E9A9] h-full rounded-full transition-all duration-700"
                          style={{ width: "95%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Inset: Key Takeaway */}
                <div className="bg-[#101214] border border-[#292C2C]/70 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="text-amber-300 shrink-0 mt-0.5">
                    <Lightbulb size={15} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#F2F3F0]">Key Takeaway</h5>
                    <p className="text-[11px] text-[#A5A7A3] mt-0.5 leading-relaxed">
                      {keyTakeawayText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER ROW: GROUPED BAR CHART & FINAL VERDICT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* RECHARTS GROUPED BAR CHART (8 Cols) */}
              <div className="xl:col-span-8 bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl backdrop-blur-md">
                {/* Chart Header + Legend */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} className="text-[#A5A7A3]" />
                    <h3 className="text-xs font-bold text-[#F2F3F0] tracking-wide">
                      Side by Side Analysis
                    </h3>
                  </div>

                  {/* Legend Indicators */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C8E9A9]" />
                      <span className="text-[#A5A7A3] text-[11px] font-medium">
                        Reality A
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#9678C9]" />
                      <span className="text-[#A5A7A3] text-[11px] font-medium">
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
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "#A5A7A3", fontSize: 10, fontWeight: 500 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tick={{ fill: "#A5A7A3", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0B0D0E",
                          borderColor: "#292C2C",
                          borderRadius: "12px",
                          fontSize: "11px",
                          color: "#F2F3F0",
                        }}
                        formatter={(val) => [`${val}%`, ""]}
                      />
                      {/* Reality A Bar: Sage */}
                      <Bar
                        dataKey="realityA"
                        fill="#C8E9A9"
                        radius={[4, 4, 0, 0]}
                        name="Reality A"
                      >
                        <LabelList
                          dataKey="realityALabel"
                          position="top"
                          fill="#F2F3F0"
                          fontSize={10}
                          fontWeight={600}
                        />
                      </Bar>

                      {/* Reality B Bar: Purple */}
                      <Bar
                        dataKey="realityB"
                        fill="#9678C9"
                        radius={[4, 4, 0, 0]}
                        name="Reality B"
                      >
                        <LabelList
                          dataKey="realityBLabel"
                          position="top"
                          fill="#F2F3F0"
                          fontSize={10}
                          fontWeight={600}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* FINAL VERDICT CARD (4 Cols) */}
              <div className="xl:col-span-4 relative bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2F3F0] tracking-wide mb-2.5">
                    <Sparkles size={13} className="text-[#C8E9A9]" />
                    <span>Final Verdict</span>
                  </div>

                  {/* Main Verdict Heading */}
                  <h3 className="text-base sm:text-lg font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
                    Both realities are incredible.
                  </h3>

                  {/* Verdict Description */}
                  <p className="text-xs text-[#A5A7A3] mt-1.5 leading-relaxed">
                    {finalVerdictText}
                  </p>
                </div>

                {/* Planet Horizon in Bottom Right */}
                <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full overflow-hidden pointer-events-none opacity-85">
                  <img
                    src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80"
                    alt="Space Horizon"
                    className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0E] via-transparent to-transparent" />
                </div>

                {/* Speculative notice */}
                <div className="relative z-10 pt-6 text-[10px] text-[#A5A7A3]/70">
                  AI-generated illustrative ratings, not facts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* "CREATE NEW COMPARISON" MODAL                            */}
      {/* ======================================================== */}
      <Modal
        open={newComparisonModalOpen}
        onClose={() => setNewComparisonModalOpen(false)}
        title="Create New Comparison"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          {/* Pick Universe */}
          <div>
            <label className="block text-xs font-bold text-[#F2F3F0] mb-1.5">
              Select Universe:
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
              className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-xl px-3 py-2 text-xs text-[#F2F3F0] outline-none"
            >
              {universes.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title || u.originalDecision} ({u.realities?.length || 0} realities)
                </option>
              ))}
            </select>
          </div>

          {/* Pick 2 to 3 realities */}
          <div>
            <label className="block text-xs font-bold text-[#F2F3F0] mb-1.5">
              Pick 2 or 3 Realities to Compare:
            </label>

            {(() => {
              const activeUni = universes.find((u) => u.id === modalSelectedUniverseId);
              const realities = activeUni?.realities || [];

              if (realities.length < 2) {
                return (
                  <p className="text-xs text-[#A5A7A3] py-2">
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
                          return; // Max 3
                        }
                        setModalSelectedRealities((prev) => [...prev, r.id]);
                      }
                    };

                    return (
                      <div
                        key={r.id}
                        onClick={toggleSelect}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#141a15] border-[#C8E9A9] text-[#F2F3F0]"
                            : "bg-[#08090A] border-[#292C2C] text-[#A5A7A3] hover:border-[#3d4040]"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold truncate">{r.name}</div>
                          <div className="text-[10px] text-[#A5A7A3] truncate">
                            {r.career || r.industry || "General"}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#C8E9A9] border-[#C8E9A9] text-[#050505]"
                              : "border-[#292C2C]"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#292C2C]/60">
            <button
              type="button"
              onClick={() => setNewComparisonModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#292C2C] bg-[#08090A] hover:bg-[#121416] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={modalSelectedRealities.length < 2}
              onClick={handleApplyCustomComparison}
              className="px-5 py-2 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] disabled:opacity-40 disabled:cursor-not-allowed text-[#050505] font-bold text-xs shadow-md transition-all"
            >
              Compare Realities
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
