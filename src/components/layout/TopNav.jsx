// src/components/layout/TopNav.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { settingsService } from "../../services/settingsService";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create Reality" },
  { to: "/saved", label: "Saved" },
  { to: "/archive", label: "Archive" },
];

export const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(() => settingsService.getProfile());

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
    };
    window.addEventListener("parallel:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("parallel:profile-updated", handleProfileUpdate);
  }, []);

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-transparent z-50">
      {/* Left: Multiverse constellation logo + PARALLEL title */}
      <Link to="/" className="flex items-center gap-3 group">
        <svg
          className="w-6 h-6 text-[#F2F3F0] transition-transform group-hover:rotate-45 duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="12" cy="12" r="3" stroke="#C8E9A9" strokeWidth="1.5" />
          <circle cx="12" cy="3" r="2" fill="#F2F3F0" />
          <circle cx="12" cy="21" r="2" fill="#F2F3F0" />
          <circle cx="3" cy="12" r="2" fill="#F2F3F0" />
          <circle cx="21" cy="12" r="2" fill="#F2F3F0" />
        </svg>
        <span className="text-[#F2F3F0] text-sm font-semibold tracking-[0.28em] uppercase">
          PARALLEL
        </span>
      </Link>

      {/* Center: Editorial Navigation Bar matching Landing Page */}
      <nav className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0B0D0F] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {NAV_LINKS.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-200 group ${
                isActive ? "text-[#050505] font-semibold" : "text-[#A5A7A3] hover:text-[#F2F3F0]"
              }`}
            >
              {/* Active sliding pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTopNavIndicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4F2B7] to-[#B5E090] shadow-[0_0_16px_rgba(200,233,169,0.35)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              {/* Hover animated bottom line for non-active links */}
              {!isActive && (
                <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-[#C8E9A9] scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
              )}

              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right: Search, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="w-9 h-9 rounded-full bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Search size={15} />
        </button>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          aria-label="User Settings"
          title="Open Settings"
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-[#C8E9A9]/50 focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all ml-1 group shadow-sm active:scale-95 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-zinc-700/50">
            <img
              src={
                profile.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              }
              alt={profile.name || "avatar"}
              className="w-full h-full object-cover grayscale opacity-85 group-hover:scale-110 transition-transform"
            />
          </div>
          <ChevronDown size={13} className="text-[#A5A7A3] group-hover:text-[#F2F3F0] transition-colors" />
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 rounded-full bg-[#121518] border border-white/[0.08] flex items-center justify-center text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0E1114] border-b border-white/10 p-4 flex flex-col gap-2 md:hidden z-50 shadow-2xl">
          {NAV_LINKS.map((l) => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-[#C8E9A9]/10 text-[#C8E9A9] font-medium border border-[#C8E9A9]/30"
                    : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04]"
                }`}
              >
                <span>{l.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
