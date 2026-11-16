// src/components/layout/AppLayout.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Menu, X, Home, Compass, GitFork, Bookmark, Calendar, Settings } from "lucide-react";

export const AppLayout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read initial collapsed state from localStorage (default: false = maximized)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("parallel_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("parallel_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const navLinks = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/create", label: "Create Reality", icon: GitFork },
    { to: "/saved", label: "Saved", icon: Bookmark },
    { to: "/archive", label: "Archive", icon: Calendar },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#F2F3F0] font-sans antialiased selection:bg-[#C8E9A9] selection:text-[#050505] overflow-x-hidden">
      {/* Desktop Left Sidebar (With Minimize/Maximize Capability) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#050505]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-[#C8E9A9] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
          </div>
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#F2F3F0]">
            PARALLEL
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-white cursor-pointer active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-14 inset-x-0 bg-[#07090b]/98 backdrop-blur-2xl border-b border-white/10 p-4 flex flex-col gap-2 z-50 shadow-2xl"
          >
            {navLinks.map((l) => {
              const active = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "nav-pill-active text-[#C8E9A9]"
                      : "text-[#A5A7A3] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={16} className={active ? "text-[#C8E9A9]" : "text-[#A5A7A3]"} />
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen pt-14 md:pt-0 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
