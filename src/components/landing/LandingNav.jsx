// src/components/landing/LandingNav.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, X, Compass, GitFork, Bookmark, Calendar, Settings, ArrowRight, User } from "lucide-react";
import { settingsService } from "../../services/settingsService";

export const LandingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: "n1",
      title: "New reality timeline branched",
      desc: "Bio-Architect path in Neo-Kyoto reached 96% coherence",
      time: "15m ago",
      unread: true,
    },
    {
      id: "n2",
      title: "Multiverse synchronization",
      desc: "Deep Space Pioneer timeline updated with 4 new choice nodes",
      time: "2h ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Coherence simulation stable",
      desc: "Acoustic Ecology branch diverged into 3 alternate possibilities",
      time: "1d ago",
      unread: false,
    },
  ]);

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile
  const [profile, setProfile] = useState(() => settingsService.getProfile());

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
    };
    window.addEventListener("parallel:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("parallel:profile-updated", handleProfileUpdate);
  }, []);

  // Keyboard shortcut CMD+K / CTRL+K
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/create", label: "Create Reality" },
    { to: "/saved", label: "Saved" },
    { to: "/archive", label: "Archive" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-12 py-3.5 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo with Infinity Loop */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Interlocking Infinite Circles SVG matching reference */}
            <svg viewBox="0 0 40 24" className="w-8 h-5 text-[#F2F3F0] transition-transform duration-300 group-hover:scale-105" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="28" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
              <circle cx="12" cy="12" r="3" fill="#C8E9A9" />
              <circle cx="28" cy="12" r="3" fill="#9678C9" />
            </svg>
          </div>
          <span className="text-[#F2F3F0] text-sm sm:text-base font-bold tracking-[0.24em] uppercase group-hover:text-white transition-colors">
            PARALLEL
          </span>
        </Link>

        {/* Center: Desktop Navigation Pill */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {navLinks.map((item) => {
            const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-[#050505] font-semibold"
                    : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLandingNavPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C8E9A9] to-[#D5F2B8] shadow-[0_0_16px_rgba(200,233,169,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search Pill + Notification Bell + User Avatar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Search Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center relative group"
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-xl border transition-all duration-200 ${
                searchFocused
                  ? "border-[#C8E9A9]/60 shadow-[0_0_16px_rgba(200,233,169,0.25)] w-56"
                  : "border-white/[0.08] hover:border-white/20 w-44"
              }`}
            >
              <Search size={13} className="text-[#A5A7A3] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search universes..."
                className="bg-transparent border-none outline-none text-xs text-[#F2F3F0] placeholder-[#A5A7A3]/60 w-full font-normal tracking-wide"
              />
              <span className="text-[9px] font-mono text-[#A5A7A3]/70 bg-white/[0.06] px-1 py-0.5 rounded pointer-events-none">
                ⌘K
              </span>
            </div>
          </form>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl flex items-center justify-center text-[#F2F3F0] transition-all cursor-pointer group hover:scale-105 active:scale-95"
            >
              <Bell size={13} className="text-[#A5A7A3] group-hover:text-white transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel p-4 shadow-[0_24px_56px_rgba(0,0,0,0.9)] z-50"
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                      <span className="text-xs font-bold text-[#F2F3F0] uppercase tracking-wider">
                        Multiverse Signals
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#A5A7A3] hover:text-white cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          n.unread
                            ? "bg-[#141b15]/70 border-[#C8E9A9]/30 hover:border-[#C8E9A9]/60 shadow-[0_0_12px_rgba(200,233,169,0.08)]"
                            : "bg-white/[0.02] border-white/[0.06] hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                          <span>{n.title}</span>
                          <span className="text-[9.5px] text-[#A5A7A3]">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-[#A5A7A3] mt-0.5 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <Link
            to="/settings"
            title="Account Settings"
            className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-white/20 hover:border-[#C8E9A9]/60 transition-all hover:scale-105 active:scale-95"
          >
            <img
              src={
                profile.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              }
              alt={profile.name || "User Avatar"}
              className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X size={15} /> : <Compass size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="md:hidden mt-3 rounded-2xl bg-[#080a0c]/95 backdrop-blur-2xl border border-white/10 p-4 flex flex-col gap-2 shadow-2xl"
          >
            {navLinks.map((item) => {
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C8E9A9]/10 text-[#C8E9A9] border border-[#C8E9A9]/30"
                      : "text-[#A5A7A3] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
