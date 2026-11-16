// src/components/layout/TopNav.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { settingsService } from "../../services/settingsService";
import { LiquidNavbar } from "../ui/liquid-glass-navbar";

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

  // Determine active nav index from pathname
  const activeIndex = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return 0;
    if (path.startsWith("/explore")) return 1;
    if (path.startsWith("/create")) return 2;
    if (path.startsWith("/saved")) return 3;
    if (path.startsWith("/archive")) return 4;
    return 0;
  }, [location.pathname]);

  const handleNavChange = (index) => {
    const target = NAV_LINKS[index];
    if (target && target.to !== location.pathname) {
      navigate(target.to);
    }
  };

  const navItems = useMemo(
    () =>
      NAV_LINKS.map((item) => ({
        label: item.label,
        href: undefined, // using onChange with router navigation
      })),
    []
  );

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

      {/* Center: Floating Liquid Glass Pill Navbar */}
      <div className="hidden md:flex items-center justify-center">
        <LiquidNavbar
          items={navItems}
          active={activeIndex}
          onChange={handleNavChange}
          tone="dark"
          sound={false}
          className="shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.5)] border border-white/[0.08]"
        />
      </div>

      {/* Right: Search, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="w-9 h-9 rounded-full glass-btn-circle hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all shadow-sm active:scale-95"
        >
          <Search size={15} />
        </button>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full glass-btn-circle hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all shadow-sm active:scale-95"
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          aria-label="User Settings"
          title="Open Settings"
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full glass-pill hover:border-[#C8E9A9]/50 focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none transition-all ml-1 group shadow-sm active:scale-95"
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
          className="md:hidden w-9 h-9 rounded-full glass-btn-circle flex items-center justify-center text-[#F2F3F0] focus-visible:ring-2 focus-visible:ring-[#C8E9A9] focus-visible:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel border-b border-white/10 p-4 flex flex-col gap-2 md:hidden z-50 shadow-2xl">
          {NAV_LINKS.map((l, idx) => {
            const active = idx === activeIndex;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "nav-pill-active text-[#C8E9A9] font-medium"
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
