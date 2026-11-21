// src/components/layout/TopNav.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { settingsService } from "../../services/settingsService";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create reality" },
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
      {/* Left: Constellation logo + PARALLEL title */}
      <Link to="/" className="flex items-center gap-3 group">
        <svg
          className="w-6 h-6 text-ink transition-transform duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="12" cy="12" r="3" stroke="var(--color-accent)" strokeWidth="1.5" />
          <circle cx="12" cy="3" r="2" fill="var(--color-ink)" />
          <circle cx="12" cy="21" r="2" fill="var(--color-ink)" />
          <circle cx="3" cy="12" r="2" fill="var(--color-ink)" />
          <circle cx="21" cy="12" r="2" fill="var(--color-ink)" />
        </svg>
        <span className="text-ink text-sm font-semibold tracking-normal">
          Parallel
        </span>
      </Link>

      {/* Center: Navigation Bar */}
      <nav className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-card border border-rule shadow-sm">
        {NAV_LINKS.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 group ${
                isActive ? "text-accent-ink font-semibold" : "text-muted hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTopNavIndicator"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              {!isActive && (
                <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left" />
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
          className="w-9 h-9 rounded-full bg-surface hover:bg-card border border-rule hover:border-accent/50 flex items-center justify-center text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-focus transition-colors shadow-sm active:scale-95 cursor-pointer"
        >
          <Search size={15} aria-hidden="true" />
        </button>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-surface hover:bg-card border border-rule hover:border-accent/50 flex items-center justify-center text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-focus transition-colors shadow-sm active:scale-95 cursor-pointer"
        >
          <Bell size={15} aria-hidden="true" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          aria-label="User settings"
          title="Open settings"
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-surface hover:bg-card border border-rule hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-focus transition-colors ml-1 group shadow-sm active:scale-95 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-surface border border-rule">
            <img
              src={
                profile.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85"
              }
              alt={profile.name || "User avatar"}
              className="w-full h-full object-cover grayscale opacity-85"
            />
          </div>
          <ChevronDown size={13} className="text-muted group-hover:text-ink transition-colors" aria-hidden="true" />
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 rounded-full bg-surface border border-rule flex items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface border-b border-rule p-4 flex flex-col gap-2 md:hidden z-50 shadow-2xl">
          {NAV_LINKS.map((l) => {
            const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent/10 text-accent font-medium border border-accent/30"
                    : "text-muted hover:text-ink hover:bg-card"
                }`}
              >
                <span>{l.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
