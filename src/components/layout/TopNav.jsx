// src/components/layout/TopNav.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create Reality" },
  { to: "/saved", label: "Saved" },
  { to: "/archive", label: "Archive" },
];

export const TopNav = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-[#050505] z-50 border-b border-[#1b1c1e]">
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

      {/* Center: Floating capsule pill nav */}
      <nav className="hidden md:flex items-center bg-[#0B0D0E]/90 border border-[#292C2C] rounded-full px-4 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {NAV_LINKS.map((l) => {
          const active = isActive(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`relative px-4 py-1 text-xs font-medium transition-colors ${
                active ? "text-[#F2F3F0]" : "text-[#A5A7A3] hover:text-[#F2F3F0]"
              }`}
            >
              {l.label}
              {active && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Search, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Search"
          className="w-9 h-9 rounded-full bg-[#0B0D0E] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#383b3b] transition-colors"
        >
          <Search size={15} />
        </button>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-[#0B0D0E] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#383b3b] transition-colors"
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
        </button>

        <button
          aria-label="User Profile"
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-[#0B0D0E] border border-[#292C2C] hover:border-[#383b3b] transition-colors ml-1"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-zinc-800 to-zinc-600 border border-zinc-700/50">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="avatar"
              className="w-full h-full object-cover grayscale opacity-85"
            />
          </div>
          <ChevronDown size={13} className="text-[#A5A7A3]" />
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 rounded-full bg-[#0B0D0E] border border-[#292C2C] flex items-center justify-center text-[#F2F3F0]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B0D0E] border-b border-[#292C2C] p-4 flex flex-col gap-2 md:hidden z-50">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                  active
                    ? "bg-[#181a1c] text-[#C8E9A9] font-medium"
                    : "text-[#A5A7A3] hover:text-[#F2F3F0]"
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
