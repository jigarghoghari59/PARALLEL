// src/components/landing/LandingNav.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, X, Compass, GitFork, Bookmark, Calendar, Settings, ArrowRight, User, Menu } from "lucide-react";
import { settingsService } from "../../services/settingsService";

export const LandingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection for dynamic navigation styling
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      if (e.key === "Escape") {
        setShowNotifications(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", number: "01" },
    { to: "/explore", label: "Explore", number: "02" },
    { to: "/create", label: "Create Reality", number: "03" },
    { to: "/saved", label: "Saved", number: "04" },
    { to: "/archive", label: "Archive", number: "05" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-[#050505]/95 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            : "py-5 bg-transparent"
        } px-4 sm:px-6 lg:px-12`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <svg viewBox="0 0 40 24" className="w-8 h-5 text-[#F2F3F0] transition-transform duration-300 group-hover:scale-105" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="28" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="12" cy="12" r="3" fill="#C8E9A9" />
                <circle cx="28" cy="12" r="3" fill="#9678C9" />
              </svg>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-[#F2F3F0] text-sm sm:text-base font-bold tracking-[0.24em] uppercase group-hover:text-white transition-colors"
            >
              PARALLEL
            </motion.span>
          </Link>

          {/* Center: Desktop Navigation Bar with Controlled Geometry */}
          <nav className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0B0D0F] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            {navLinks.map((item) => {
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
                      layoutId="activeNavIndicator"
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

          {/* Right: Search + Notifications + Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative group">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0D0F] border transition-all duration-200 ${
                  searchFocused
                    ? "border-[#C8E9A9]/60 shadow-[0_0_12px_rgba(200,233,169,0.2)] w-56"
                    : "border-white/[0.08] hover:border-white/20 w-44 lg:w-48"
                }`}
              >
                <Search size={13} className={searchFocused ? "text-[#C8E9A9]" : "text-[#A5A7A3]"} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search realities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/60 focus:outline-none w-full"
                />
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/[0.06] border border-white/10 text-[#A5A7A3]">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                aria-label="Notifications"
                className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  showNotifications
                    ? "bg-[#C8E9A9] text-[#050505] border-[#C8E9A9]"
                    : "bg-white/[0.03] hover:bg-white/[0.06] text-[#A5A7A3] hover:text-[#F2F3F0] border-white/[0.08]"
                }`}
              >
                <Bell size={13} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 sm:w-88 rounded-2xl bg-[#090b0d] border border-white/[0.12] p-4 shadow-[0_20px_48px_rgba(0,0,0,0.85)] z-50"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F2F3F0] uppercase tracking-wider">Signals</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C8E9A9]/20 text-[#C8E9A9]">
                          2 new
                        </span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-[#A5A7A3] hover:text-[#F2F3F0] text-xs cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-[#F2F3F0] leading-snug">{n.title}</h4>
                            <span className="text-[10px] text-[#A5A7A3] whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[#A5A7A3] mt-1 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/explore"
                      onClick={() => setShowNotifications(false)}
                      className="mt-3 block text-center py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[11px] font-semibold text-[#C8E9A9] border border-white/[0.06] transition-colors"
                    >
                      View Multiverse Telemetry →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Drawer Link */}
            <Link
              to="/settings"
              aria-label="Settings & Profile"
              className="relative w-8 h-8 rounded-full border border-white/[0.12] overflow-hidden group shrink-0 hover:border-[#C8E9A9]/60 transition-colors"
            >
              <img
                src={
                  profile.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                }
                alt={profile.name}
                className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="md:hidden w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#F2F3F0] hover:border-white/20 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation with Editorial Styling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#050505] md:hidden flex flex-col justify-between pt-24 pb-8 px-6"
          >
            <div className="space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C8E9A9]">
                Navigation Index
              </p>

              <div className="space-y-2 pt-2">
                {navLinks.map((item, idx) => {
                  const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.06 }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3 border-b border-white/[0.06] text-lg font-bold tracking-tight transition-colors ${
                          isActive ? "text-[#C8E9A9]" : "text-[#F2F3F0] hover:text-[#C8E9A9]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#A5A7A3]">{item.number}</span>
                          <span>{item.label}</span>
                        </span>
                        <ArrowRight size={16} className={isActive ? "text-[#C8E9A9]" : "text-[#A5A7A3]"} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="pt-4">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Search size={14} className="text-[#A5A7A3]" />
                  <input
                    type="text"
                    placeholder="Search realities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/60 focus:outline-none w-full"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#A5A7A3]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                <span>Parallel Multiverse Engine</span>
              </div>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">
                Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
