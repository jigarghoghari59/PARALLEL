// src/components/landing/LandingNav.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  X,
  Menu,
} from "lucide-react";
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

  // Close menus on route change
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
    { to: "/create", label: "Create reality", number: "03" },
    { to: "/saved", label: "Saved", number: "04" },
    { to: "/archive", label: "Archive", number: "05" },
  ];

  return (
    <>
      <header
        data-page-nav=""
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
          isScrolled
            ? "py-3 bg-paper/95 border-b border-rule shadow-lg backdrop-blur-sm"
            : "py-5 bg-transparent"
        } px-4 sm:px-6 lg:px-12`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link to="/" data-page-logo="" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 40 24"
                className="w-8 h-5 text-ink transition-transform duration-200"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="28" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="12" cy="12" r="3" fill="var(--color-accent)" />
                <circle cx="28" cy="12" r="3" fill="var(--color-purple)" />
              </svg>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-ink text-sm sm:text-base font-bold tracking-normal group-hover:text-white transition-colors"
            >
              Parallel
            </motion.span>
          </Link>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-card border border-rule shadow-sm">
            {navLinks.map((item) => {
              const isActive =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-page-voce=""
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 group ${
                    isActive ? "text-accent-ink font-semibold" : "text-muted hover:text-ink"
                  }`}
                >
                  {/* Active sliding pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  {/* Hover animated bottom line for non-active links */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left" />
                  )}

                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Notifications + Profile */}
          <div data-page-nav-right="" className="flex items-center gap-2.5 shrink-0">
            {/* Search Pill: Fixed container prevents layout shifts, while form expands cleanly to the left */}
            <div className="hidden sm:block relative w-44 lg:w-48 h-8">
              <form
                onSubmit={handleSearchSubmit}
                onClick={() => searchInputRef.current?.focus()}
                className={`absolute right-0 top-0 h-8 rounded-full bg-card border flex items-center gap-2 px-3 transition-all duration-200 ease-out cursor-text ${
                  searchFocused
                    ? "w-64 lg:w-72 border-accent shadow-md shadow-accent/5 z-20"
                    : "w-44 lg:w-48 border-rule hover:border-white/20 z-10"
                }`}
              >
                <Search
                  size={13}
                  className={`shrink-0 transition-colors ${
                    searchFocused ? "text-accent" : "text-muted"
                  }`}
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search realities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-xs text-ink placeholder:text-muted/60 focus:outline-none w-full"
                />
              </form>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                aria-label="Notifications"
                className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                  showNotifications
                    ? "bg-accent text-accent-ink border-accent"
                    : "bg-surface hover:bg-card text-muted hover:text-ink border-rule"
                }`}
              >
                <Bell size={13} aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-80 sm:w-88 rounded-card bg-card border border-rule p-4 shadow-2xl z-50"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink">Signals</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                          2 new
                        </span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-muted hover:text-ink text-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
                        aria-label="Close notifications"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-lg bg-surface hover:bg-card border border-rule transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-ink leading-snug">{n.title}</h4>
                            <span className="text-xs text-muted whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-muted mt-1 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/explore"
                      onClick={() => setShowNotifications(false)}
                      className="mt-3 block text-center py-2 rounded-lg bg-surface hover:bg-card text-xs font-medium text-accent border border-rule transition-colors"
                    >
                      View multiverse telemetry
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Drawer Link */}
            <Link
              to="/settings"
              aria-label="Settings and profile"
              className="relative w-8 h-8 rounded-full border border-rule overflow-hidden group shrink-0 hover:border-accent/60 transition-colors"
            >
              <img
                src={
                  profile.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
                }
                alt={profile.name || "User profile"}
                className="w-full h-full object-cover grayscale opacity-90"
              />
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="md:hidden w-8 h-8 rounded-full border border-rule bg-surface flex items-center justify-center text-ink hover:border-white/20 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={15} aria-hidden="true" /> : <Menu size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-paper md:hidden flex flex-col justify-between pt-20 pb-8 px-6 overflow-y-auto"
          >
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-accent mb-2">
                  Navigation index
                </p>

                <div className="space-y-1">
                  {navLinks.map((item, idx) => {
                    const isActive =
                      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                      >
                        <Link
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-2.5 border-b border-rule text-base font-semibold transition-colors ${
                            isActive ? "text-accent" : "text-ink hover:text-accent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-xs text-muted">{item.number}</span>
                            <span>{item.label}</span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
