// src/components/explorer/BranchView.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  Calendar,
  Compass,
  Tag,
  Check,
  Maximize2,
  ArrowRight,
  ChevronDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BranchView({
  universe,
  selectedCategory = "All",
  timeFilter = "All Time",
  onTimeFilterChange,
}) {
  const navigate = useNavigate();
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Default active branch matches Image 2: "Travel Branch"
  const [selectedBranchId, setSelectedBranchId] = useState("travel");

  // Branch data dictionary matching Image 2
  const branchData = {
    original: {
      id: "original",
      title: "Original Timeline",
      subtitle: "Your current reality",
      date: "Now",
      category: "Career",
      image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=85",
      description: "The baseline reality from which all parallel vectors diverge.",
      meta: [
        { icon: Calendar, label: "Present" },
        { icon: Compass, label: "San Francisco" },
        { icon: Tag, label: "Anchor Reality" },
      ],
      path: ["Original Timeline"],
      details: ["Baseline trajectory", "Full memory retention", "Known outcomes"],
    },
    career: {
      id: "career",
      title: "Career Focus",
      subtitle: "Tech journey continues...",
      date: "Mar 2026",
      category: "Career",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=85",
      description: "Diving deeper into enterprise tech, scaling systems, and building high-impact tech companies.",
      meta: [
        { icon: Calendar, label: "Mar 2026" },
        { icon: Compass, label: "Silicon Valley" },
        { icon: Tag, label: "Career" },
      ],
      path: ["Original Timeline", "Career Focus", "Startup / FAANG"],
      details: ["Deep tech mastery", "Rapid startup scaling", "Venture equity potential"],
    },
    startup: {
      id: "startup",
      title: "Startup Founder",
      subtitle: "Build your own company...",
      date: "2030+",
      category: "Career",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=85",
      description: "Bootstrapping an AI-driven platform into a venture-backed enterprise.",
      meta: [
        { icon: Calendar, label: "2030+" },
        { icon: Compass, label: "San Francisco" },
        { icon: Tag, label: "Founder" },
      ],
      path: ["Original Timeline", "Career Focus", "Startup Founder"],
      details: ["High risk & reward", "Team builder", "Industry disruptor"],
    },
    google: {
      id: "google",
      title: "Google SDE",
      subtitle: "Join Google",
      date: "2030+",
      category: "Career",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=85",
      description: "Contributing to world-class machine intelligence and foundational models.",
      meta: [
        { icon: Calendar, label: "2030+" },
        { icon: Compass, label: "Mountain View" },
        { icon: Tag, label: "FAANG" },
      ],
      path: ["Original Timeline", "Career Focus", "Google SDE"],
      details: ["Global scale infrastructure", "Top compensation", "Frontier research"],
    },
    travel: {
      id: "travel",
      title: "Travel Branch",
      subtitle: "Explore the world and create unforgettable memories.",
      date: "Jul 2027",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
      description: "Explore the world and create unforgettable memories.",
      meta: [
        { icon: Calendar, label: "Jul 2027" },
        { icon: Compass, label: "Global" },
        { icon: Tag, label: "Lifestyle" },
      ],
      path: ["Original Timeline", "Travel Branch", "Japan Trip / Switzerland"],
      details: [
        "World travel experience",
        "New cultures & skills",
        "A fresh perspective",
      ],
    },
    japan: {
      id: "japan",
      title: "Japan Trip",
      subtitle: "Experience Tokyo & Kyoto cultural immersion.",
      date: "2028",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=85",
      description: "Submerging into Tokyo's neon streets and Kyoto's tranquil zen sanctuaries.",
      meta: [
        { icon: Calendar, label: "2028" },
        { icon: Compass, label: "Tokyo, Japan" },
        { icon: Tag, label: "Lifestyle" },
      ],
      path: ["Original Timeline", "Travel Branch", "Japan Trip"],
      details: ["Language learning", "Visual documentation", "Urban exploration"],
    },
    switzerland: {
      id: "switzerland",
      title: "Switzerland",
      subtitle: "Alpine adventures and mountain mindfulness.",
      date: "2028",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=85",
      description: "Hiking through the Bernese Oberland and capturing snow-capped peaks.",
      meta: [
        { icon: Calendar, label: "2028" },
        { icon: Compass, label: "Alps, Switzerland" },
        { icon: Tag, label: "Lifestyle" },
      ],
      path: ["Original Timeline", "Travel Branch", "Switzerland"],
      details: ["High-altitude photography", "Decelerated living", "Wilderness resilience"],
    },
    education: {
      id: "education",
      title: "Education Path",
      subtitle: "Higher Studies Abroad",
      date: "Oct 2027",
      category: "Education",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85",
      description: "Advancing into doctoral research in distributed computing and neural architectures.",
      meta: [
        { icon: Calendar, label: "Oct 2027" },
        { icon: Compass, label: "Cambridge, MA" },
        { icon: Tag, label: "Education" },
      ],
      path: ["Original Timeline", "Education Path"],
      details: ["Peer-reviewed publications", "Academic fellowship", "Intellectual autonomy"],
    },
    different: {
      id: "different",
      title: "Different Life",
      subtitle: "A peaceful life",
      date: "2026",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85",
      description: "Choosing quiet contentment, simple routines, and intentional everyday peace.",
      meta: [
        { icon: Calendar, label: "2026" },
        { icon: Compass, label: "Coastal Retreat" },
        { icon: Tag, label: "Wellness" },
      ],
      path: ["Original Timeline", "Different Life"],
      details: ["Stress-free environment", "Daily creative hobbies", "Deeper relationships"],
    },
  };

  const activeBranch = branchData[selectedBranchId] || branchData.travel;
  const timeOptions = ["All Time", "2026 - 2030", "Past 5 Years", "Milestones Only"];

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-rule/50">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent">
              <GitBranch size={16} aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Branch View
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Explore different paths and branches of your alternate realities.
          </p>
        </div>

        {/* Time Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Clock size={13} className="text-muted" aria-hidden="true" />
            <span>{timeFilter}</span>
            <ChevronDown
              size={12}
              className={`text-muted transition-transform duration-200 ${
                timeDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {timeDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-card border border-rule shadow-xl p-1.5 z-50">
              {timeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onTimeFilterChange?.(opt);
                    setTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    timeFilter === opt
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Branch Graph (7-8 cols) + Detail Panel (4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Branch Graph Workspace (7-8 Cols) */}
        <div className="lg:col-span-8 bg-card/80 backdrop-blur-sm border border-rule rounded-2xl p-4 sm:p-6 overflow-x-auto min-h-[560px] flex items-center relative shadow-lg">
          {/* Tree Layout Structure */}
          <div className="relative min-w-[620px] w-full flex items-center justify-start gap-12 sm:gap-14 py-4">
            {/* SVG Connecting Bezier Paths */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {/* Curve from Original to Junction */}
              {/* Curves from Junction (X=190, Y=255) to level 1 branches */}
              {/* Branch 1 (Career): Y=85 */}
              <path
                d="M 195 255 C 220 255, 220 85, 245 85"
                fill="none"
                stroke="var(--color-rule)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Branch 2 (Travel): Y=255 */}
              <path
                d="M 195 255 L 245 255"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              {/* Branch 3 (Education): Y=395 */}
              <path
                d="M 195 255 C 220 255, 220 395, 245 395"
                fill="none"
                stroke="var(--color-rule)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Branch 4 (Different Life): Y=485 */}
              <path
                d="M 195 255 C 220 255, 220 485, 245 485"
                fill="none"
                stroke="var(--color-rule)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Sub-curves from Career Focus (X=400, Y=85) to Startup (Y=50) & Google (Y=120) */}
              <path
                d="M 400 85 C 420 85, 420 50, 440 50"
                fill="none"
                stroke="var(--color-rule)"
                strokeWidth="1.5"
              />
              <path
                d="M 400 85 C 420 85, 420 120, 440 120"
                fill="none"
                stroke="var(--color-rule)"
                strokeWidth="1.5"
              />

              {/* Sub-curves from Travel Branch (X=400, Y=255) to Japan (Y=220) & Switzerland (Y=290) */}
              <path
                d="M 400 255 C 420 255, 420 220, 440 220"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <path
                d="M 400 255 C 420 255, 420 290, 440 290"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </svg>

            {/* Column 0: Root Node (Original Timeline) */}
            <div className="relative z-10 shrink-0 w-[170px]">
              <button
                type="button"
                onClick={() => setSelectedBranchId("original")}
                className={`w-full text-left p-3 rounded-xl border bg-surface/90 backdrop-blur-md transition-all cursor-pointer group shadow-md ${
                  selectedBranchId === "original"
                    ? "border-accent ring-1 ring-accent"
                    : "border-rule hover:border-rule/80"
                }`}
              >
                <div className="w-full h-14 rounded-lg overflow-hidden mb-2 bg-paper relative">
                  <img
                    src={branchData.original.image}
                    alt="Original timeline"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-ink truncate leading-tight">
                  Original Timeline
                </h4>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  Your current reality
                </p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent border border-accent/40">
                    Now
                  </span>
                </div>
              </button>

              {/* Glowing Junction Dot */}
              <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-paper shadow-[0_0_10px_rgba(200,233,169,0.8)] z-20" />
            </div>

            {/* Column 1: Intermediate Divergent Branches */}
            <div className="relative z-10 shrink-0 flex flex-col gap-4 w-[160px] pl-4">
              {/* Branch 1: Career Focus */}
              <button
                type="button"
                onClick={() => setSelectedBranchId("career")}
                className={`w-full text-left p-2.5 rounded-xl border bg-surface/90 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                  selectedBranchId === "career"
                    ? "border-accent ring-1 ring-accent"
                    : "border-rule hover:border-rule/80"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-paper">
                  <img
                    src={branchData.career.image}
                    alt="Career"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[10px] text-muted mb-0.5">
                    <span className="font-semibold text-ink truncate">Career Focus</span>
                  </div>
                  <p className="text-[10px] text-muted truncate">Mar 2026</p>
                  <p className="text-[10px] text-muted/70 truncate">Tech journey continues...</p>
                </div>
              </button>

              {/* Branch 2: Travel Branch (Active Glow!) */}
              <button
                type="button"
                onClick={() => setSelectedBranchId("travel")}
                className={`w-full text-left p-2.5 rounded-xl border bg-surface/95 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                  selectedBranchId === "travel"
                    ? "border-accent ring-1 ring-accent shadow-[0_0_20px_rgba(200,233,169,0.25)]"
                    : "border-rule hover:border-rule/80"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-paper">
                  <img
                    src={branchData.travel.image}
                    alt="Travel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-accent truncate">Travel Branch</span>
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                  </div>
                  <p className="text-[10px] text-accent/80 font-medium truncate">Jul 2027</p>
                  <p className="text-[10px] text-muted truncate">Explore the world</p>
                </div>
              </button>

              {/* Branch 3: Education Path */}
              <button
                type="button"
                onClick={() => setSelectedBranchId("education")}
                className={`w-full text-left p-2.5 rounded-xl border bg-surface/90 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                  selectedBranchId === "education"
                    ? "border-accent ring-1 ring-accent"
                    : "border-rule hover:border-rule/80"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-paper">
                  <img
                    src={branchData.education.image}
                    alt="Education"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-ink truncate">Education Path</p>
                  <p className="text-[10px] text-muted truncate">Oct 2027</p>
                  <p className="text-[10px] text-muted/70 truncate">Higher Studies Abroad</p>
                </div>
              </button>

              {/* Branch 4: Different Life */}
              <button
                type="button"
                onClick={() => setSelectedBranchId("different")}
                className={`w-full text-left p-2.5 rounded-xl border bg-surface/90 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                  selectedBranchId === "different"
                    ? "border-accent ring-1 ring-accent"
                    : "border-rule hover:border-rule/80"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-paper">
                  <img
                    src={branchData.different.image}
                    alt="Different Life"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-ink truncate">Different Life</p>
                  <p className="text-[10px] text-muted truncate">2026</p>
                  <p className="text-[10px] text-muted/70 truncate">A peaceful life</p>
                </div>
              </button>
            </div>

            {/* Column 2: Sub-Branches */}
            <div className="relative z-10 shrink-0 flex flex-col justify-between h-[480px] w-[170px] pl-4">
              {/* Top Sub-branches for Career */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBranchId("startup")}
                  className={`w-full text-left p-2 rounded-lg border bg-surface/80 text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    selectedBranchId === "startup"
                      ? "border-accent ring-1 ring-accent"
                      : "border-rule hover:border-rule/80"
                  }`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-paper">
                    <img
                      src={branchData.startup.image}
                      alt="Startup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-ink truncate">Startup Founder</p>
                      <span className="text-[9px] text-muted">2030+</span>
                    </div>
                    <p className="text-[9px] text-muted truncate">Build your own company...</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBranchId("google")}
                  className={`w-full text-left p-2 rounded-lg border bg-surface/80 text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    selectedBranchId === "google"
                      ? "border-accent ring-1 ring-accent"
                      : "border-rule hover:border-rule/80"
                  }`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-paper">
                    <img
                      src={branchData.google.image}
                      alt="Google"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-ink truncate">Google SDE</p>
                      <span className="text-[9px] text-muted">2030+</span>
                    </div>
                    <p className="text-[9px] text-muted truncate">Join Google</p>
                  </div>
                </button>
              </div>

              {/* Middle Sub-branches for Travel */}
              <div className="space-y-2 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedBranchId("japan")}
                  className={`w-full text-left p-2 rounded-lg border bg-surface/80 text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    selectedBranchId === "japan"
                      ? "border-accent ring-1 ring-accent"
                      : "border-rule hover:border-rule/80"
                  }`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-paper">
                    <img
                      src={branchData.japan.image}
                      alt="Japan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-ink truncate">Japan Trip</p>
                      <span className="text-[9px] text-muted">2028</span>
                    </div>
                    <p className="text-[9px] text-muted truncate">Experience Tokyo</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBranchId("switzerland")}
                  className={`w-full text-left p-2 rounded-lg border bg-surface/80 text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    selectedBranchId === "switzerland"
                      ? "border-accent ring-1 ring-accent"
                      : "border-rule hover:border-rule/80"
                  }`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden shrink-0 bg-paper">
                    <img
                      src={branchData.switzerland.image}
                      alt="Switzerland"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-ink truncate">Switzerland</p>
                      <span className="text-[9px] text-muted">2028</span>
                    </div>
                    <p className="text-[9px] text-muted truncate">Alpine adventures</p>
                  </div>
                </button>
              </div>

              {/* Bottom empty placeholder spacer to keep visual alignment */}
              <div className="h-10" />
            </div>
          </div>
        </div>

        {/* Right Detail Panel matching Image 2 (4 Cols) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 bg-card/90 backdrop-blur-sm border border-rule rounded-2xl p-5 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Large Image Preview with Expand Button */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface border border-rule/60 mb-4 group">
                <img
                  src={activeBranch.image}
                  alt={activeBranch.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Expand image preview"
                >
                  <Maximize2 size={13} aria-hidden="true" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Active Branch Badge */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/40">
                  Active Branch
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-ink tracking-tight">
                {activeBranch.title}
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {activeBranch.description}
              </p>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted py-3 my-2 border-y border-rule/50">
                {activeBranch.meta.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-muted">
                      <Icon size={12} className="text-muted" aria-hidden="true" />
                      <span>{m.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Branch Path Indicators */}
              <div className="py-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <GitBranch size={13} className="text-accent" aria-hidden="true" />
                  <span>Branch Path</span>
                </div>
                <div className="space-y-1.5 pl-1">
                  {activeBranch.path.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          idx === 0
                            ? "bg-accent"
                            : idx === 1
                            ? "bg-cyan-400"
                            : "bg-muted/60"
                        }`}
                      />
                      <span className={idx === 1 ? "text-ink font-semibold" : "text-muted"}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Details with Checkmarks */}
              <div className="pt-3 border-t border-rule/50 mt-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Sparkles size={13} className="text-accent" aria-hidden="true" />
                  <span>Key Details</span>
                </div>
                <div className="space-y-1.5">
                  {activeBranch.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                      <Check size={12} className="text-accent shrink-0" aria-hidden="true" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-rule/60 mt-4">
              <button
                type="button"
                onClick={() => {
                  navigate(`/explore?branch=${activeBranch.id}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rule hover:border-accent/50 bg-surface hover:bg-surface/80 text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-focus"
              >
                <span>Explore this branch</span>
                <ArrowRight size={13} className="text-accent" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal for Full Image Expansion */}
      {previewModalOpen && (
        <div
          onClick={() => setPreviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-2xl overflow-hidden border border-rule bg-card p-2"
          >
            <img
              src={activeBranch.image}
              alt={activeBranch.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
