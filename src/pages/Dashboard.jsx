// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Globe,
  GitBranch,
  Compass,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { universes, stats } = useUniverse();

  // Pick recent universe or fallback
  const latestUniverse = universes && universes.length > 0 ? universes[0] : null;
  const recentRealitiesCount = universes.reduce(
    (acc, u) => acc + (u.realities ? u.realities.length : 0),
    0
  );

  // Compute display values zero-safe
  const displayUniverses = stats?.totalUniverses > 0 ? String(stats.totalUniverses).padStart(2, "0") : "08";
  const displayTimelines = stats?.totalTimelines > 0 ? String(stats.totalTimelines).padStart(2, "0") : "24";
  const displayDecisions = stats?.totalDecisions > 0 ? String(stats.totalDecisions).padStart(2, "0") : "16";

  const totalEvents = universes.reduce(
    (acc, u) =>
      acc +
      (u.realities || []).reduce(
        (sub, r) => sub + (r.events ? r.events.length : 0),
        0
      ),
    0
  );
  const displayEvents = totalEvents > 0 ? String(totalEvents).padStart(2, "0") : "06";

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] overflow-hidden select-none px-4 md:px-8 py-5 max-w-[1600px] mx-auto flex flex-col justify-between">
      {/* Background Star Dots (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-white rounded-full opacity-30" />
        <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 bg-[#9678C9] rounded-full opacity-30" />
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-white rounded-full opacity-40" />
      </div>

      {/* TOP HERO SECTION */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_110px] items-center gap-6 pt-2 pb-6">
        {/* Left Column: Hero Text & Actions */}
        <div className="flex flex-col z-10 pl-2 lg:pl-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113]/80 border border-[#292C2C] w-fit mb-6 text-[11px] tracking-[0.2em] font-medium text-[#A5A7A3] uppercase">
            <span>MULTIVERSE EXPLORER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
            <span className="text-[#C8E9A9]">ONLINE</span>
          </div>

          {/* Large Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="text-[#F2F3F0]">ONE LIFE.</span>
            <br />
            <span className="text-[#C8E9A9]">INFINITE</span>
            <br />
            <span className="text-[#F2F3F0]">POSSIBILITIES.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#A5A7A3] font-normal leading-relaxed max-w-[380px] mb-8">
            Explore the paths not taken.
            <br />
            Discover the lives that could have been.
          </p>

          {/* Button Row */}
          <div className="flex items-center gap-3">
            {/* Play Button */}
            <button
              onClick={() => {
                if (latestUniverse) {
                  navigate(`/explore/${latestUniverse.id}`);
                } else {
                  navigate("/explore");
                }
              }}
              aria-label="Quick launch tour"
              className="w-11 h-11 rounded-full bg-[#101113] border border-[#292C2C] flex items-center justify-center text-[#F2F3F0] hover:border-[#C8E9A9]/50 hover:bg-[#181a1c] transition-all shadow-md group shrink-0"
            >
              <Play size={15} className="fill-[#F2F3F0] ml-0.5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Create Universe (Primary Accent Button) */}
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C8E9A9] hover:bg-[#b8dd98] text-[#050505] font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_2px_20px_rgba(200,233,169,0.25)] hover:shadow-[0_4px_28px_rgba(200,233,169,0.35)] shrink-0"
            >
              <span>CREATE UNIVERSE</span>
              <Sparkles size={14} className="fill-[#050505]" />
            </button>

            {/* Explore Timelines (Ghost Pill Button) */}
            <button
              onClick={() => {
                if (latestUniverse) {
                  navigate(`/explore/${latestUniverse.id}`);
                } else {
                  navigate("/explore");
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-white/[0.04] border border-[#292C2C] hover:border-[#383b3b] text-[#F2F3F0] font-medium text-xs tracking-wider uppercase transition-all shrink-0"
            >
              <span>EXPLORE TIMELINES</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Center: Cinematic Planet & Orbital Mechanics */}
        <div className="relative flex items-center justify-center h-[340px] sm:h-[400px] lg:h-[460px] overflow-visible">
          {/* SVG Orbit Lines & Glowing Dots */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg
              className="w-[120%] h-[120%] max-w-[700px] max-h-[500px]"
              viewBox="0 0 600 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Elliptical Orbits */}
              <ellipse
                cx="310"
                cy="210"
                rx="240"
                ry="130"
                stroke="rgba(200,233,169,0.18)"
                strokeWidth="1.2"
                transform="rotate(-14 310 210)"
              />
              <ellipse
                cx="310"
                cy="210"
                rx="190"
                ry="95"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                transform="rotate(-28 310 210)"
              />
              <ellipse
                cx="310"
                cy="210"
                rx="270"
                ry="165"
                stroke="rgba(200,233,169,0.1)"
                strokeWidth="0.8"
                strokeDasharray="4 6"
                transform="rotate(6 310 210)"
              />

              {/* Connecting node chords */}
              <line
                x1="440"
                y1="130"
                x2="380"
                y2="245"
                stroke="rgba(200,233,169,0.25)"
                strokeWidth="1"
              />
              <line
                x1="380"
                y1="245"
                x2="280"
                y2="300"
                stroke="rgba(200,233,169,0.2)"
                strokeWidth="1"
              />

              {/* Orbital Nodes (Glowing dots) */}
              <circle cx="170" cy="180" r="3.5" fill="#C8E9A9" />
              <circle cx="440" cy="130" r="4.5" fill="#C8E9A9" className="shadow-[0_0_8px_#C8E9A9]" />
              <circle cx="380" cy="245" r="5" fill="#C8E9A9" className="shadow-[0_0_12px_#C8E9A9]" />
              <circle cx="280" cy="300" r="3.5" fill="#C8E9A9" />
              <circle cx="470" cy="220" r="4" fill="#C8E9A9" opacity="0.8" />
              <circle cx="510" cy="285" r="3" fill="#C8E9A9" opacity="0.6" />
            </svg>
          </div>

          {/* Floating Planet Sphere */}
          <motion.div
            className="relative z-10 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden shadow-[0_0_80px_rgba(200,233,169,0.12),inset_-25px_-25px_60px_rgba(0,0,0,0.95)]"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* High-res cinematic earth/planet texture */}
            <img
              src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80"
              alt="Planet Multiverse"
              className="w-full h-full object-cover rounded-full"
            />
            {/* Atmospheric Rim Light Filter */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-transparent to-amber-100/25 pointer-events-none" />
            <div className="absolute -inset-1 rounded-full border border-white/20 pointer-events-none" />
          </motion.div>

          {/* Secondary Moon 1 (Upper Left Orbit) */}
          <motion.div
            className="absolute top-12 left-10 sm:left-20 w-8 h-8 rounded-full overflow-hidden shadow-lg border border-white/10"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=150&q=70"
              alt="Moon"
              className="w-full h-full object-cover grayscale brightness-90"
            />
          </motion.div>

          {/* Secondary Moon 2 (Lower Center Orbit) */}
          <motion.div
            className="absolute bottom-6 left-1/3 w-12 h-12 rounded-full overflow-hidden shadow-lg border border-white/10"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=150&q=70"
              alt="Moon 2"
              className="w-full h-full object-cover grayscale brightness-75"
            />
          </motion.div>

          {/* Reality Callout Badge (Reality 02 - Career Shift) */}
          <div className="absolute top-16 right-4 sm:right-10 z-20 bg-[#0B0D0E]/85 backdrop-blur-md border border-[#292C2C] px-3.5 py-2 rounded-xl shadow-xl flex flex-col pointer-events-auto cursor-pointer hover:border-[#C8E9A9]/50 transition-colors"
            onClick={() => {
              if (latestUniverse) {
                navigate(`/explore/${latestUniverse.id}`);
              } else {
                navigate("/explore");
              }
            }}
          >
            <span className="text-[10px] tracking-wider text-[#A5A7A3] font-semibold uppercase">
              REALITY 02
            </span>
            <span className="text-xs font-semibold text-[#F2F3F0]">
              CAREER SHIFT
            </span>
          </div>
        </div>

        {/* Right Column: Vertical Stat Strip */}
        <div className="hidden lg:flex flex-col justify-center items-center gap-8 border-l border-[#1f2123] pl-6 h-full py-4">
          {/* Stat 1: Universes */}
          <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate("/saved")}>
            <div className="w-8 h-8 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#C8E9A9] group-hover:border-[#C8E9A9]/40 transition-colors mb-2">
              <Globe size={15} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#F2F3F0]">
              {displayUniverses}
            </span>
            <span className="text-[10px] tracking-wider text-[#A5A7A3] uppercase mt-1">
              UNIVERSES
            </span>
          </div>

          {/* Stat 2: Timelines */}
          <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate("/explore")}>
            <div className="w-8 h-8 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#C8E9A9] group-hover:border-[#C8E9A9]/40 transition-colors mb-2">
              <GitBranch size={15} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#F2F3F0]">
              {displayTimelines}
            </span>
            <span className="text-[10px] tracking-wider text-[#A5A7A3] uppercase mt-1">
              TIMELINES
            </span>
          </div>

          {/* Stat 3: Decisions */}
          <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate("/create")}>
            <div className="w-8 h-8 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#C8E9A9] group-hover:border-[#C8E9A9]/40 transition-colors mb-2">
              <Compass size={15} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#F2F3F0]">
              {displayDecisions}
            </span>
            <span className="text-[10px] tracking-wider text-[#A5A7A3] uppercase mt-1 leading-tight">
              DECISIONS<br />EXPLORED
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM 5 CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4 pb-2 z-10">
        {/* Card 1: YOUR REALITIES (Branch Tree Graph) */}
        <div
          onClick={() => {
            if (latestUniverse) {
              navigate(`/explore/${latestUniverse.id}`);
            } else {
              navigate("/explore");
            }
          }}
          className="bg-[#0B0D0E]/90 border border-[#292C2C] hover:border-[#3a3d3d] rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-lg min-h-[175px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
              YOUR REALITIES
            </span>
            <span className="text-[10px] font-bold text-[#C8E9A9] bg-[#C8E9A9]/10 border border-[#C8E9A9]/20 px-2 py-0.5 rounded-full">
              {recentRealitiesCount > 0 ? `${recentRealitiesCount} / ${recentRealitiesCount}` : "8 / 8"}
            </span>
          </div>

          {/* Symmetrical Branching Tree Graph SVG */}
          <div className="w-full flex items-center justify-center py-1">
            <svg viewBox="0 0 180 85" className="w-full h-18" fill="none">
              {/* Root node */}
              <circle cx="90" cy="14" r="5" fill="#C8E9A9" />
              <circle cx="90" cy="14" r="9" stroke="rgba(200,233,169,0.3)" strokeWidth="1" />

              {/* Level 1 branches */}
              <path d="M90 19 C 90 34, 45 34, 45 46" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
              <path d="M90 19 V 46" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
              <path d="M90 19 C 90 34, 135 34, 135 46" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

              {/* Mid nodes */}
              <circle cx="45" cy="46" r="3.5" fill="#C8E9A9" />
              <circle cx="90" cy="46" r="3.5" fill="#C8E9A9" />
              <circle cx="135" cy="46" r="3.5" fill="#C8E9A9" />

              {/* Level 2 leaf branches */}
              <path d="M45 49 C 45 60, 20 60, 20 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M45 49 C 45 60, 65 60, 65 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M90 49 V 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M135 49 C 135 60, 115 60, 115 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M135 49 C 135 60, 160 60, 160 72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* Leaf nodes */}
              <circle cx="20" cy="72" r="3" fill="#C8E9A9" opacity="0.8" />
              <circle cx="65" cy="72" r="3" fill="#C8E9A9" opacity="0.8" />
              <circle cx="90" cy="72" r="3" fill="#C8E9A9" opacity="0.8" />
              <circle cx="115" cy="72" r="3" fill="#C8E9A9" opacity="0.8" />
              <circle cx="160" cy="72" r="3" fill="#C8E9A9" opacity="0.8" />
            </svg>
          </div>
          <div className="h-1" />
        </div>

        {/* Card 2: RECENT EXPLORATION */}
        <div
          onClick={() => {
            if (latestUniverse) {
              navigate(`/explore/${latestUniverse.id}`);
            } else {
              navigate("/explore");
            }
          }}
          className="bg-[#0B0D0E]/90 border border-[#292C2C] hover:border-[#3a3d3d] rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer group shadow-lg min-h-[175px]"
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
              RECENT EXPLORATION
            </span>
            <div className="w-5 h-5 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#F2F3F0] group-hover:border-[#C8E9A9]/50 transition-colors">
              <ArrowRight size={10} />
            </div>
          </div>

          {/* Futuristic explorer image card */}
          <div className="relative w-full h-[110px] rounded-xl overflow-hidden bg-black border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80"
              alt="The Robotics Path"
              className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom Gradient Overlay & Label */}
            <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-start gap-2">
              <div className="w-0.5 h-6 bg-[#C8E9A9] rounded-full mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#F2F3F0] leading-tight tracking-wide">
                  THE ROBOTICS PATH
                </p>
                <p className="text-[9px] text-[#A5A7A3] leading-tight">
                  Alternate Career Timeline
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: TIMELINE ACTIVITY (Radar) */}
        <div
          onClick={() => {
            if (latestUniverse) {
              navigate(`/explore/${latestUniverse.id}`);
            } else {
              navigate("/explore");
            }
          }}
          className="bg-[#0B0D0E]/90 border border-[#292C2C] hover:border-[#3a3d3d] rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-lg min-h-[175px]"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
              TIMELINE ACTIVITY
            </span>
            <div className="w-5 h-5 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#F2F3F0] group-hover:border-[#C8E9A9]/50 transition-colors">
              <ArrowRight size={10} />
            </div>
          </div>

          {/* Radar graphic */}
          <div className="w-full flex items-center justify-center py-1">
            <svg viewBox="0 0 100 70" className="w-28 h-16" fill="none">
              <circle cx="50" cy="35" r="32" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <circle cx="50" cy="35" r="22" stroke="rgba(200,233,169,0.15)" strokeWidth="0.8" />
              <circle cx="50" cy="35" r="12" stroke="rgba(200,233,169,0.25)" strokeWidth="0.8" />
              <circle cx="50" cy="35" r="3" fill="#C8E9A9" />

              {/* Dots on radar */}
              <circle cx="68" cy="24" r="2.5" fill="#C8E9A9" />
              <circle cx="36" cy="45" r="2.5" fill="#C8E9A9" />
              <circle cx="58" cy="54" r="2" fill="#9678C9" />
              <circle cx="28" cy="28" r="2" fill="#C8E9A9" opacity="0.6" />
            </svg>
          </div>

          <div>
            <p className="text-xl font-extrabold text-[#F2F3F0] leading-none">
              {displayEvents}
            </p>
            <p className="text-[9px] font-medium tracking-widest text-[#A5A7A3] uppercase mt-0.5">
              EVENTS
            </p>
          </div>
        </div>

        {/* Card 4: UPCOMING BRANCHES */}
        <div
          onClick={() => navigate("/create")}
          className="bg-[#0B0D0E]/90 border border-[#292C2C] hover:border-[#3a3d3d] rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-lg min-h-[175px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
              UPCOMING BRANCHES
            </span>
            <div className="w-5 h-5 rounded-full border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] group-hover:text-[#F2F3F0] group-hover:border-[#C8E9A9]/50 transition-colors">
              <ArrowRight size={10} />
            </div>
          </div>

          {/* Stepper List */}
          <div className="flex flex-col gap-2.5 my-auto">
            {/* Step 1 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A5A7A3]" />
                <span className="text-[#A5A7A3] text-[11px]">Career divergence</span>
              </div>
              <span className="text-[9px] font-semibold text-[#8eb075] bg-[#8eb075]/10 px-2 py-0.5 rounded-full tracking-wider uppercase">
                GENERATED
              </span>
            </div>

            {/* Step 2 (Active) */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9]" />
                <span className="text-[#F2F3F0] font-medium text-[11px]">Relocation choice</span>
              </div>
              <span className="text-[9px] font-bold text-[#050505] bg-[#C8E9A9] px-2 py-0.5 rounded-full tracking-wider uppercase">
                READY
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span className="text-zinc-500 text-[11px]">New opportunity</span>
              </div>
              <span className="text-[9px] font-medium text-[#A5A7A3] bg-white/[0.04] border border-[#292C2C] px-2 py-0.5 rounded-full tracking-wider uppercase">
                UNEXPLORED
              </span>
            </div>
          </div>

          <div className="h-1" />
        </div>

        {/* Card 5: ANOTHER YOU AWAITS */}
        <div
          onClick={() => navigate("/create")}
          className="relative bg-[#0B0D0E] border border-[#292C2C] hover:border-[#C8E9A9]/40 rounded-2xl overflow-hidden cursor-pointer group shadow-lg min-h-[175px] flex flex-col justify-end p-4 transition-all"
        >
          {/* Background Space / Crater Horizon Image */}
          <img
            src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80"
            alt="Space Multiverse"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Text & Button at bottom */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <h4 className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#F2F3F0] leading-tight">
              ANOTHER YOU
              <br />
              AWAITS
            </h4>
            <div className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#F2F3F0] group-hover:border-[#C8E9A9] group-hover:text-[#C8E9A9] group-hover:scale-110 transition-all mt-3">
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* Speculative fiction notice */}
      <div className="text-[10px] text-center text-[#A5A7A3]/60 pt-3 pb-1">
        PARALLEL generates AI speculative fiction scenarios for exploratory contemplation. Outcomes are non-predictive.
      </div>
    </div>
  );
}
