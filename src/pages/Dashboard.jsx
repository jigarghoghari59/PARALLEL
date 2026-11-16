// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  GitFork,
  ArrowRight,
  Play,
  Activity,
  Calendar,
  Crosshair,
  X,
  Check,
  Layers,
  Compass,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { settingsService } from "../services/settingsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { universes, stats } = useUniverse();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Notification popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "New branch generated",
      desc: "Relocation to Tokyo path calculated with 94% coherence",
      time: "20m ago",
      unread: true,
    },
    {
      id: "n2",
      title: "Coherence simulation stable",
      desc: "Mechanical Engineer timeline reached year 10",
      time: "2h ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Timeline divergence recorded",
      desc: "Career shift node branched into 3 alternate realities",
      time: "1d ago",
      unread: false,
    },
  ]);

  // Profile data
  const [profile, setProfile] = useState(() => settingsService.getProfile());

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
    };
    window.addEventListener("parallel:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("parallel:profile-updated", handleProfileUpdate);
  }, []);

  // Keyboard shortcut listener for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  // Safe stat counts with reference defaults
  const universesCount = stats?.totalUniverses > 12 ? `${stats.totalUniverses}+` : "12+";
  const timelinesCount = stats?.totalTimelines > 48 ? `${stats.totalTimelines}+` : "48+";
  const decisionsCount = stats?.totalDecisions > 120 ? `${stats.totalDecisions}+` : "120+";

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
      {/* ======================================================== */}
      {/* 2. HERO SECTION: TEXT + PORTAL CINEMATIC ARTWORK         */}
      {/* ======================================================== */}
      

      {/* ======================================================== */}
      {/* 2. HERO SECTION: TEXT + PORTAL CINEMATIC ARTWORK         */}
      {/* ======================================================== */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] items-center gap-4 py-2 flex-1 min-h-[260px] lg:min-h-[290px]">
        {/* Left Column: Welcome Capsule + Headlines + Primary CTAs */}
        <div className="flex flex-col justify-center max-w-[490px] z-10">
          {/* Welcome Capsule Pill with Green Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1114] border border-white/[0.08] w-fit mb-3.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-[#F2F3F0]">
              Welcome back, <span className="text-[#C8E9A9]">{profile.name?.split(" ")[0] || "Explorer"}</span>
            </span>
          </div>

          {/* Large Hero Title Matching Reference Typography */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold tracking-tight leading-[1.08] mb-3 text-[#F2F3F0]">
            <span>ONE LIFE.</span>
            <br />
            <span className="italic font-normal text-[#C8E9A9] tracking-wide mr-2">
              INFINITE
            </span>
            <span>POSSIBILITIES.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xs sm:text-sm text-[#A5A7A3] font-normal leading-relaxed max-w-[380px] mb-6">
            Explore the paths not taken. Discover the lives
            <br />
            that could have been.
          </p>

          {/* Action Button Row */}
          <div className="flex items-center gap-3">
            {/* Primary CTA: Create Universe (Solid High-Contrast Sage) */}
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(200,233,169,0.35)] hover:shadow-[0_0_36px_rgba(200,233,169,0.6)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <GitFork size={14} className="text-[#050505] stroke-[2.5]" />
              <span>Create Universe</span>
              <ArrowRight size={13} className="stroke-[2.5]" />
            </button>

            {/* Secondary CTA: Explore Timelines (Clean Dark Surface) */}
            <button
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#121518] hover:bg-[#181C20] border border-white/[0.1] hover:border-white/25 text-[#F2F3F0] hover:text-white font-semibold text-xs tracking-wider transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Play size={11} className="text-[#C8E9A9] fill-transparent stroke-[2.4] ml-0.5" />
              <span>Explore Timelines</span>
            </button>
          </div>
        </div>

        {/* Right Column: High Quality Portal Artwork & Celestial View */}
        <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] flex items-center justify-end overflow-hidden pointer-events-none select-none">
          {/* Main Cinematic Portal & Astronaut Artwork */}
          <div className="relative w-full h-full max-w-[560px] flex items-center justify-end">
            <img
              src="/images/portal-hero.png"
              alt="Cosmic Portal Horizon"
              className="w-full h-full object-contain object-right brightness-[1.04] contrast-[1.05]"
            />

            {/* Subtle Pulse Halo behind the Wormhole Gateway */}
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[22%] sm:right-[24%] top-[34%] w-24 h-24 rounded-full bg-purple-500/20 blur-2xl pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. STATISTICS & QUOTE HORIZONTAL BAR                      */}
      {/* ======================================================== */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3.5 my-2 w-full">
        {/* Left Statistics Panel: 3 Columns with Clean Dividers */}
        <div className="rounded-2xl bg-[#090C0E] border border-white/[0.08] px-5 py-3 flex items-center justify-around gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top specular reflection line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Stat 1: Universes Created */}
          <div
            onClick={() => navigate("/saved")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-transform hover:scale-[1.02]"
          >
            {/* Spiral Galaxy Icon */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-8 h-8 text-[#C8E9A9]" fill="none">
                <ellipse
                  cx="16"
                  cy="16"
                  rx="14"
                  ry="6"
                  stroke="#C8E9A9"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  transform="rotate(-25 16 16)"
                />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="10"
                  ry="4"
                  stroke="#C8E9A9"
                  strokeWidth="1.4"
                  transform="rotate(-25 16 16)"
                />
                <circle cx="16" cy="16" r="3" fill="#C8E9A9" />
              </svg>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none group-hover:text-[#C8E9A9] transition-colors">
                {universesCount}
              </p>
              <p className="text-[10px] text-[#A5A7A3] font-semibold tracking-wide mt-1 whitespace-nowrap">
                Universes Created
              </p>
            </div>
          </div>

          <div className="w-[1px] h-9 bg-white/[0.1] shrink-0" />

          {/* Stat 2: Timelines Explored */}
          <div
            onClick={() => navigate("/explore")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-transform hover:scale-[1.02]"
          >
            {/* Branching Network Nodes Icon */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7 text-[#C8E9A9]" fill="none">
                <circle cx="16" cy="7" r="3" stroke="#C8E9A9" strokeWidth="1.8" />
                <path d="M16 10V18" stroke="#C8E9A9" strokeWidth="1.6" />
                <path d="M16 18L10 24" stroke="#C8E9A9" strokeWidth="1.6" />
                <path d="M16 18L22 24" stroke="#C8E9A9" strokeWidth="1.6" />
                <circle cx="9" cy="25" r="2.5" fill="#C8E9A9" />
                <circle cx="23" cy="25" r="2.5" fill="#C8E9A9" />
              </svg>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none group-hover:text-[#C8E9A9] transition-colors">
                {timelinesCount}
              </p>
              <p className="text-[10px] text-[#A5A7A3] font-semibold tracking-wide mt-1 whitespace-nowrap">
                Timelines Explored
              </p>
            </div>
          </div>

          <div className="w-[1px] h-9 bg-white/[0.1] shrink-0" />

          {/* Stat 3: Decisions Explored (Contextual Branching Fork Icon, NO STARS!) */}
          <div
            onClick={() => navigate("/create")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-transform hover:scale-[1.02]"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#C8E9A9]">
              <GitFork size={22} className="stroke-[2]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none group-hover:text-[#C8E9A9] transition-colors">
                {decisionsCount}
              </p>
              <p className="text-[10px] text-[#A5A7A3] font-semibold tracking-wide mt-1 whitespace-nowrap">
                Decisions Explored
              </p>
            </div>
          </div>
        </div>

        {/* Right Quote Panel: Philosophical Reflection + Planet Crescent */}
        <div className="relative rounded-2xl bg-[#090C0E] border border-white/[0.08] px-5 py-3 flex items-center gap-3 min-w-[280px] lg:min-w-[310px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <div className="flex items-start gap-2.5 z-10 max-w-[210px]">
            <span className="text-[#A5A7A3]/70 font-serif text-3xl leading-none select-none">
              “
            </span>
            <p className="text-[11.5px] italic text-[#F2F3F0] font-normal leading-snug mt-1">
              Every decision creates
              <br />
              a new reality...
            </p>
          </div>

          {/* Crescent Planet Artwork on the right corner */}
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden">
            <img
              src="/images/quote-moon.png"
              alt="Crescent Planet"
              className="w-full h-full object-cover object-left opacity-90"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FOUR LOWER CARDS ROW (EXACT REFERENCE REPRODUCTION)   */}
      {/* ======================================================== */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 pb-1 w-full">
        {/* Card 1: Your Realities */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-2xl bg-[#0B0D0F] hover:bg-[#0E1114] border border-white/[0.08] hover:border-white/20 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-all duration-300 shadow-[0_10px_28px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Specular top reflection line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#C8E9A9] stroke-[2.2]" />
              <span className="text-[11px] font-bold text-white tracking-wide">
                Your Realities
              </span>
            </div>
            <span className="text-[9.5px] text-[#A5A7A3] font-medium">
              2 Universes
            </span>
          </div>

          {/* Stacked City Perspective Skyline Image */}
          <div className="w-full h-[84px] rounded-xl overflow-hidden bg-black/60 relative border border-white/[0.08] my-1">
            <img
              src="/images/card-city.png"
              alt="Futuristic Skyline Perspective"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                Computer Engineer
              </p>
              <p className="text-[9.5px] text-[#A5A7A3] leading-tight mt-0.5">
                Original Reality
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#121518] border border-white/[0.1] group-hover:bg-[#C8E9A9] group-hover:text-[#050505] group-hover:border-[#C8E9A9] flex items-center justify-center text-white/80 transition-all">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Card 2: Recent Exploration */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-2xl bg-[#0B0D0F] hover:bg-[#0E1114] border border-white/[0.08] hover:border-white/20 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-all duration-300 shadow-[0_10px_28px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Crosshair size={13} className="text-[#C8E9A9]" />
              <span className="text-[11px] font-bold text-white tracking-wide">
                Recent Exploration
              </span>
            </div>
            <span className="text-[9.5px] text-[#A5A7A3] font-medium">
              2h ago
            </span>
          </div>

          {/* Space Station Wheel Image */}
          <div className="w-full h-[84px] rounded-xl overflow-hidden bg-black/60 relative border border-white/[0.08] my-1">
            <img
              src="/images/card-station.png"
              alt="Orbital Station Wheel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                Mechanical Engineer
              </p>
              <p className="text-[9.5px] text-[#A5A7A3] leading-tight mt-0.5">
                Alternative Reality
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#121518] border border-white/[0.1] group-hover:bg-[#C8E9A9] group-hover:text-[#050505] group-hover:border-[#C8E9A9] flex items-center justify-center text-white/80 transition-all">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Card 3: Timeline Activity */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-2xl bg-[#0B0D0F] hover:bg-[#0E1114] border border-white/[0.08] hover:border-white/20 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-all duration-300 shadow-[0_10px_28px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Activity size={13} className="text-[#C8E9A9]" />
              <span className="text-[11px] font-bold text-white tracking-wide">
                Timeline Activity
              </span>
            </div>
          </div>

          {/* Vertical Timeline Track with Green Illuminated Dots */}
          <div className="flex flex-col gap-2.5 my-auto pl-1">
            {/* Timeline Item 1 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                <span className="text-[#F2F3F0] text-[11px] font-medium">
                  Explored a new branch
                </span>
              </div>
              <span className="text-[10px] text-[#A5A7A3] font-normal">
                2h ago
              </span>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                <span className="text-[#F2F3F0] text-[11px] font-medium">
                  Created a universe
                </span>
              </div>
              <span className="text-[10px] text-[#A5A7A3] font-normal">
                1d ago
              </span>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                <span className="text-[#F2F3F0] text-[11px] font-medium">
                  Compared realities
                </span>
              </div>
              <span className="text-[10px] text-[#A5A7A3] font-normal">
                2d ago
              </span>
            </div>
          </div>

          <div className="h-0.5" />
        </div>

        {/* Card 4: Upcoming Branches (Torii Gate & Mount Fuji Scene) */}
        <div
          onClick={() => navigate("/create?decision=What+if+I+moved+to+Japan")}
          className="relative rounded-2xl bg-[#0B0D0F] hover:bg-[#0E1114] border border-white/[0.08] hover:border-white/20 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-all duration-300 shadow-[0_10px_28px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Background Japanese Torii & Mountain Artwork on Right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none select-none overflow-hidden">
            <img
              src="/images/card-japan.png"
              alt="Japan Torii Gate"
              className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            {/* Smooth gradient blend into the card's dark background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090B0D] via-[#090B0D]/60 to-transparent" />
          </div>

          {/* Card Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#C8E9A9]" />
              <span className="text-[11px] font-bold text-white tracking-wide">
                Upcoming Branches
              </span>
            </div>
          </div>

          {/* Card Body Text */}
          <div className="z-10 my-auto max-w-[170px]">
            <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
              What if I moved to Japan?
            </h4>
            <p className="text-[9.5px] text-[#A5A7A3] leading-relaxed mt-1 font-normal">
              Explore a new possibility from your robotics journey.
            </p>
          </div>

          {/* Card Footer with Circular Arrow Button */}
          <div className="flex items-center justify-end z-10">
            <div className="w-7 h-7 rounded-full bg-[#121518] border border-white/[0.1] group-hover:bg-[#C8E9A9] group-hover:text-[#050505] group-hover:border-[#C8E9A9] flex items-center justify-center text-white/80 transition-all shadow-sm">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. BOTTOM STATUS FOOTER LINE                              */}
      {/* ======================================================== */}
      <footer className="relative z-10 flex items-center justify-center gap-3 pt-3 pb-1 w-full text-center">
        <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-white/[0.12]" />
        <div className="flex items-center gap-2 text-[10.5px] text-[#A5A7A3]/80 tracking-wide font-normal">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
          <span>Step into another reality...</span>
        </div>
        <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-white/[0.12]" />
      </footer>
    </div>
  );
}
