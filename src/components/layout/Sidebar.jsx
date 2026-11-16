// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  GitFork,
  Bookmark,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/create", label: "Create Reality", icon: GitFork },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/archive", label: "Archive", icon: Calendar },
];

export const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between shrink-0 min-h-screen bg-[#07090b]/90 backdrop-blur-2xl border-r border-white/[0.08] p-3 relative z-30 select-none transition-all duration-300 sidebar-glow-frame ${
        collapsed ? "w-[76px]" : "w-[204px]"
      }`}
    >
      {/* Specular top reflection line along the curve */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-[#C8E9A9]/70 via-white/30 to-transparent pointer-events-none rounded-tl-[28px]" />

      {/* Middle Glowing Node on the border line (matching reference) */}
      <div className="absolute right-[-3px] top-[48%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9,0_0_16px_#C8E9A9] pointer-events-none" />

      {/* Bottom Right Glowing Arc Accent */}
      <div className="absolute right-0 bottom-0 w-8 h-8 pointer-events-none overflow-hidden">
        <div className="w-16 h-16 rounded-full border-r-2 border-b-2 border-[#C8E9A9]/60 shadow-[0_0_16px_rgba(200,233,169,0.4)] absolute -top-8 -left-8" />
      </div>

      {/* Top Section: Header with Logo + Toggle & Navigation */}
      <div className="flex flex-col items-center w-full gap-5">
        {/* Header: Logo & Minimize/Maximize Button */}
        <div
          className={`w-full flex items-center pt-2 pb-1 ${
            collapsed ? "flex-col gap-2 justify-center" : "justify-between px-2"
          }`}
        >
          {/* Logo: Continuous ribbon / hourglass loops */}
          <Link
            to="/"
            className="flex flex-col items-center group transition-transform hover:scale-105 duration-200"
            title="PARALLEL Multiverse"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-7 h-7 text-[#F2F3F0] group-hover:text-white transition-colors"
              >
                <path
                  d="M16 4C11 4 8 8 8 13C8 17.5 12 21 16 23C20 21 24 17.5 24 13C24 8 21 4 16 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-95"
                />
                <path
                  d="M16 28C21 28 24 24 24 19C24 14.5 20 11 16 9C12 11 8 14.5 8 19C8 24 11 28 16 28Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-95"
                />
                <circle cx="16" cy="16" r="1.5" fill="#C8E9A9" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-[#F2F3F0] text-[10px] font-semibold tracking-[0.3em] uppercase mt-1">
                PARALLEL
              </span>
            )}
          </Link>

          {/* Minimize / Maximize Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Maximize Sidebar" : "Minimize Sidebar"}
            title={collapsed ? "Maximize Sidebar" : "Minimize Sidebar"}
            className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#C8E9A9] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {collapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
          </button>
        </div>

        {/* Navigation Items Stack */}
        <nav className="flex flex-col items-center w-full gap-1.5 mt-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all duration-200 group relative select-none ${
                  collapsed
                    ? "justify-center py-2 px-0 rounded-xl"
                    : "gap-3 px-3 py-2 rounded-xl"
                } ${
                  active
                    ? "nav-pill-active text-[#F2F3F0] rounded-full"
                    : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]"
                }`}
              >
                {/* Icon Container: Green glowing pill badge when active, clean icon when inactive */}
                {active ? (
                  <div className="w-6 h-6 rounded-lg bg-[#C8E9A9] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(200,233,169,0.5)]">
                    <Icon size={13} className="text-[#050505] stroke-[2.4]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Icon
                      size={16}
                      className="text-[#A5A7A3] group-hover:text-[#F2F3F0] transition-colors stroke-[1.8]"
                    />
                  </div>
                )}

                {/* Text Label (shown when maximized) */}
                {!collapsed && (
                  <span
                    className={`text-xs tracking-tight truncate leading-none ${
                      active ? "font-bold text-white" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Multiverse Card (when maximized) + Settings & Exit */}
      <div className="flex flex-col items-center w-full gap-3 mt-auto pt-4">
        {/* Explore the Multiverse Galaxy Card (when maximized) */}
        {!collapsed && (
          <div
            onClick={() => navigate("/explore")}
            className="w-full rounded-xl glass-card hover:border-[#C8E9A9]/40 p-2.5 cursor-pointer group transition-all shadow-lg overflow-hidden"
          >
            <div className="text-left mb-1.5 px-0.5">
              <p className="text-[9.5px] font-semibold text-[#F2F3F0] leading-tight">
                Explore the
              </p>
              <p className="text-[9.5px] font-semibold text-[#F2F3F0] leading-tight flex items-center gap-1">
                <span>Multiverse</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] inline-block shadow-[0_0_6px_#C8E9A9]" />
              </p>
            </div>

            {/* Spiral Galaxy Thumbnail */}
            <div className="w-full h-14 rounded-lg overflow-hidden bg-black/60 relative border border-white/[0.08]">
              <img
                src="/images/sidebar-galaxy.png"
                alt="Multiverse Galaxy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Footer Actions: Settings & Exit */}
        <div
          className={`flex items-center w-full ${
            collapsed ? "flex-col gap-2 pt-1" : "justify-between gap-1 px-1 pt-1"
          }`}
        >
          <Link
            to="/settings"
            title="Settings"
            className={`rounded-lg flex items-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04] transition-colors group ${
              collapsed
                ? "w-8 h-8 justify-center"
                : "flex-1 py-1.5 px-2 gap-2"
            }`}
          >
            <Settings
              size={14}
              className="group-hover:rotate-45 transition-transform shrink-0"
            />
            {!collapsed && <span className="text-xs font-medium">Settings</span>}
          </Link>

          <button
            onClick={() => {
              if (
                window.confirm(
                  "Reset active session and return to multiverse dashboard?"
                )
              ) {
                navigate("/");
              }
            }}
            title="Exit Multiverse Session"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A5A7A3]/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
