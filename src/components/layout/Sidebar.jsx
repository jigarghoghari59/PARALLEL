// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  GitFork,
  Bookmark,
  Calendar,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/create", label: "Create reality", icon: GitFork },
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
      className={`hidden md:flex flex-col justify-between shrink-0 min-h-dvh bg-paper-2 border-r border-rule p-3 relative z-30 select-none transition-colors duration-200 ${
        collapsed ? "w-[76px]" : "w-[204px]"
      }`}
    >
      {/* Specular top reflection line along the curve */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-accent/50 via-white/20 to-transparent pointer-events-none rounded-tl-[28px]" />

      {/* Middle Node on the border line */}
      <div className="absolute right-[-3px] top-[48%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none" />

      {/* Bottom Right Arc Accent */}
      <div className="absolute right-0 bottom-0 w-8 h-8 pointer-events-none overflow-hidden">
        <div className="w-16 h-16 rounded-full border-r-2 border-b-2 border-accent/40 absolute -top-8 -left-8" />
      </div>

      {/* Top Section: Header with Logo & Toggle & Navigation */}
      <div className="flex flex-col items-center w-full gap-5">
        <div
          className={`w-full flex items-center pt-2 pb-1 ${
            collapsed ? "flex-col gap-2 justify-center" : "justify-between px-2"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col items-center group transition-colors duration-150"
            title="PARALLEL Multiverse"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-7 h-7 text-ink group-hover:text-white transition-colors"
                aria-hidden="true"
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
                <circle cx="16" cy="16" r="1.5" fill="var(--color-accent)" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-ink text-xs font-semibold mt-1">
                Parallel
              </span>
            )}
          </Link>

          {/* Minimize / Maximize Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Maximize sidebar" : "Minimize sidebar"}
            title={collapsed ? "Maximize sidebar" : "Minimize sidebar"}
            className="w-7 h-7 rounded-lg bg-surface border border-rule hover:border-accent/40 active:bg-paper-3 disabled:opacity-50 flex items-center justify-center text-muted hover:text-accent transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            {collapsed ? <PanelLeftOpen size={13} aria-hidden="true" /> : <PanelLeftClose size={13} aria-hidden="true" />}
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
                className={`w-full flex items-center transition-colors duration-150 group relative select-none ${
                  collapsed
                    ? "justify-center py-2 px-0 rounded-lg"
                    : "gap-3 px-3 py-2 rounded-lg"
                } ${
                  active
                    ? "nav-pill-active text-ink rounded-lg"
                    : "text-muted hover:text-ink hover:bg-surface border border-transparent hover:border-rule"
                }`}
              >
                {active ? (
                  <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-accent-ink stroke-[2.4]" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Icon
                      size={16}
                      className="text-muted group-hover:text-ink transition-colors stroke-[1.8]"
                      aria-hidden="true"
                    />
                  </div>
                )}

                {!collapsed && (
                  <span
                    className={`text-xs truncate leading-none ${
                      active ? "font-semibold text-white" : "font-normal"
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

      {/* Bottom Section */}
      <div className="flex flex-col items-center w-full gap-3 mt-auto pt-4">
        {!collapsed && (
          <div
            onClick={() => navigate("/explore")}
            className="w-full rounded-card bg-surface border border-rule hover:border-accent/40 p-2.5 cursor-pointer group transition-colors shadow-lg overflow-hidden"
          >
            <div className="text-left mb-1.5 px-0.5">
              <p className="text-xs font-semibold text-ink leading-tight flex items-center gap-1">
                <span>Multiverse</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" aria-hidden="true" />
              </p>
            </div>

            <div className="w-full h-14 rounded-md overflow-hidden bg-paper relative border border-rule">
              <img
                src="/images/sidebar-galaxy.png"
                alt="Multiverse galaxy view"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=85";
                }}
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
            className={`rounded-lg flex items-center text-muted hover:text-ink hover:bg-surface transition-colors group ${
              collapsed
                ? "w-8 h-8 justify-center"
                : "flex-1 py-1.5 px-2 gap-2"
            }`}
          >
            <Settings
              size={14}
              className="shrink-0"
              aria-hidden="true"
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
            title="Exit multiverse session"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
