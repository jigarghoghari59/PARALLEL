// src/pages/Settings.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Sun,
  Bell,
  Shield,
  Database,
  Info,
  Edit3,
  Mail,
  Calendar,
  Download,
  Trash2,
  GitBranch,
  ArrowRight,
  Check,
  AlertTriangle,
  Upload,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  Layers,
  Heart,
  Globe,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { settingsService } from "../services/settingsService";
import { Modal } from "../components/common/Modal";

// Theme preview thumbnail images
const THEME_IMAGES = {
  dark: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80",
  dim: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
  auto: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80",
};

export default function Settings() {
  const navigate = useNavigate();
  const { universes, refresh } = useUniverse();

  // Active section for sidebar navigation
  const [activeNav, setActiveNav] = useState("settings");

  // Profile & Settings states
  const [profile, setProfile] = useState(() => settingsService.getProfile());
  const [settings, setSettings] = useState(() => settingsService.getSettings());

  // Storage usage
  const [storageUsage, setStorageUsage] = useState(() => settingsService.getStorageUsage());

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [clearDataModalOpen, setClearDataModalOpen] = useState(false);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Profile Form state
  const [editForm, setEditForm] = useState({
    name: profile.name || "Jigar Ghoghari",
    email: profile.email || "jigar@example.com",
    role: profile.role || "Explorer",
    avatar: profile.avatar || "",
  });
  const fileInputRef = useRef(null);

  // Synchronize profile changes
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setProfile(e.detail);
        setEditForm((prev) => ({
          ...prev,
          name: e.detail.name,
          email: e.detail.email,
          role: e.detail.role,
          avatar: e.detail.avatar,
        }));
      }
    };
    window.addEventListener("parallel:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("parallel:profile-updated", handleProfileUpdate);
  }, []);

  // Compute live statistics
  const universesCount = universes?.length || 0;
  const totalBranchesCount = useMemo(() => {
    if (!universes || universes.length === 0) return 24;
    return universes.reduce((acc, u) => {
      const realityCount = u.realities?.length || 0;
      const eventCount =
        u.realities?.reduce((eAcc, r) => eAcc + (r.events?.length || 0), 0) || 0;
      return acc + (realityCount > 1 ? realityCount - 1 : 0) + eventCount;
    }, 0);
  }, [universes]);

  // Show transient notification toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Theme change handler
  const handleThemeChange = (newTheme) => {
    const updated = settingsService.saveSettings({ theme: newTheme });
    setSettings(updated);
    triggerToast(`Theme updated to ${newTheme.toUpperCase()}`);
  };

  // Notification toggle handler
  const handleToggleNotification = (key) => {
    const current = settings.notifications || {};
    const updatedNotifications = { ...current, [key]: !current[key] };
    const updated = settingsService.saveSettings({
      notifications: updatedNotifications,
    });
    setSettings(updated);
  };

  // Privacy toggle handler
  const handleTogglePrivacy = (key) => {
    const current = settings.privacy || {};
    const updatedPrivacy = { ...current, [key]: !current[key] };
    const updated = settingsService.saveSettings({
      privacy: updatedPrivacy,
    });
    setSettings(updated);
  };

  // Profile save handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = settingsService.saveProfile(editForm);
    setProfile(updated);
    setEditProfileOpen(false);
    triggerToast("Profile updated successfully");
  };

  // Avatar file upload handler
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (typeof dataUrl === "string") {
        setEditForm((prev) => ({ ...prev, avatar: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Data export handler
  const handleExportData = () => {
    const ok = settingsService.exportAllData();
    if (ok) {
      triggerToast("Multiverse archive downloaded");
    } else {
      alert("Failed to export data. Please try again.");
    }
  };

  // Clear data handler
  const handleConfirmClear = () => {
    settingsService.clearAllData();
    setClearDataModalOpen(false);
    refresh();
    setStorageUsage(settingsService.getStorageUsage());
    triggerToast("All multiverse data cleared");
  };

  // Sidebar navigation scroll handler
  const scrollToSection = (id) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] overflow-x-hidden select-none pb-12">
      {/* Background Celestial Orbit & Planetary Horizon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle orbital path arc */}
        <svg
          className="absolute -top-12 -right-20 w-[850px] h-[550px] opacity-40"
          viewBox="0 0 850 550"
          fill="none"
        >
          <ellipse
            cx="480"
            cy="180"
            rx="360"
            ry="200"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 4"
            transform="rotate(-12 480 180)"
          />
        </svg>

        {/* Crescent Earth/Moon Horizon Graphic in top-right */}
        <div className="absolute -top-24 -right-28 w-[500px] h-[500px] rounded-full overflow-hidden opacity-85 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80"
            alt="Planetary Horizon"
            className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050505]/40 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Subtle background star points */}
        <div className="absolute top-12 left-[18%] w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-36 left-[38%] w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-40" />
        <div className="absolute top-24 left-[58%] w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute bottom-1/4 left-[24%] w-1 h-1 bg-white rounded-full opacity-30" />
      </div>

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B0D0E] border border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] shadow-[0_0_20px_rgba(200,233,169,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Sparkles size={14} className="text-[#C8E9A9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* ======================================================== */}
        {/* TOP HEADER TITLE BAR                                     */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-9 rounded-full bg-[#C8E9A9] shadow-[0_0_10px_#C8E9A9]" />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-tight leading-none">
                Settings
              </h1>
              <p className="text-[11px] text-[#A5A7A3] mt-1 font-medium">
                Customize your Parallel Universe experience.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN LAYOUT: LEFT SIDEBAR (3 Cols) + RIGHT GRID (9 Cols) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR COLUMN (3 Cols)                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* User Profile Mini Capsule Card */}
            <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center backdrop-blur-md relative overflow-hidden">
              {/* Outer halo avatar circle */}
              <div className="relative w-20 h-20 rounded-full border border-white/10 ring-4 ring-white/[0.03] overflow-hidden bg-black/60 shadow-xl mb-3 group">
                <img
                  src={
                    profile.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => setEditProfileOpen(true)}
                  aria-label="Edit Profile"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Edit3 size={16} className="text-[#C8E9A9]" />
                </button>
              </div>

              {/* User Name with Dot */}
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#F2F3F0]">
                <span>{profile.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              </div>

              {/* Role with Dot */}
              <div className="text-[11px] text-[#A5A7A3] mt-0.5 font-medium flex items-center gap-1.5">
                <span>{profile.role || "Explorer"}</span>
                <span className="w-1 h-1 rounded-full bg-[#A5A7A3]/60" />
              </div>

              {/* Premium Access Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141a15] border border-[#C8E9A9]/20 text-[#C8E9A9] text-[10px] font-bold tracking-wider uppercase">
                <span>💎</span>
                <span>Premium Access</span>
              </div>
            </div>

            {/* Navigation Menu List */}
            <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-2 shadow-2xl backdrop-blur-md space-y-1">
              {[
                { id: "settings", label: "Settings", icon: SettingsIcon },
                { id: "profile-section", label: "Profile", icon: User },
                { id: "appearance-section", label: "Appearance", icon: Sun },
                { id: "notifications-section", label: "Notifications", icon: Bell },
                { id: "privacy-section", label: "Privacy & Security", icon: Shield },
                { id: "data-section", label: "Data Management", icon: Database },
                { id: "about-section", label: "About", icon: Info },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNav === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? "bg-[#141a15] text-[#C8E9A9] border border-[#C8E9A9]/30 shadow-[0_0_12px_rgba(200,233,169,0.12)]"
                        : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.03]"
                    }`}
                  >
                    <IconComponent
                      size={15}
                      className={isActive ? "text-[#C8E9A9]" : "text-[#A5A7A3]"}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inset Card: "Explore Deeper" */}
            <div className="relative bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-4.5 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-[#F2F3F0]">
                  Explore Deeper
                </h4>
                <p className="text-[11px] text-[#A5A7A3] mt-0.5 leading-relaxed max-w-[170px]">
                  Unlock more features with Premium.
                </p>

                <button
                  onClick={() => setPremiumModalOpen(true)}
                  className="mt-3 px-4 py-2 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] text-[#050505] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(200,233,169,0.25)] group"
                >
                  <span>Upgrade Now</span>
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>

              {/* Planet crescent in bottom right corner */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full overflow-hidden pointer-events-none opacity-80">
                <img
                  src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=300&q=80"
                  alt="Planet"
                  className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0E] via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT MAIN CONTENT GRID (9 Cols)                         */}
          {/* ======================================================== */}
          <div className="lg:col-span-9 space-y-6">
            {/* ======================================================== */}
            {/* ROW 1: PROFILE SETTINGS (Left) + APPEARANCE (Right)      */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* CARD 1: PROFILE SETTINGS */}
              <div
                id="profile-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#A5A7A3]" />
                      <h3 className="text-sm font-bold text-[#F2F3F0]">
                        Profile Settings
                      </h3>
                    </div>

                    <button
                      onClick={() => setEditProfileOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121416] hover:bg-[#1a1c1e] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-[11px] font-semibold text-[#F2F3F0] transition-colors shadow-sm"
                    >
                      <Edit3 size={11} className="text-[#C8E9A9]" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Profile Info Block */}
                  <div className="flex items-start gap-4 pt-1">
                    {/* Avatar circle with pencil overlay */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-white/10 shadow-lg">
                        <img
                          src={
                            profile.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={profile.name}
                          className="w-full h-full object-cover grayscale brightness-90"
                        />
                      </div>
                      <button
                        onClick={() => setEditProfileOpen(true)}
                        aria-label="Change Avatar"
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#141a15] border border-[#C8E9A9]/40 flex items-center justify-center text-[#C8E9A9] shadow-md hover:scale-110 transition-transform"
                      >
                        <Edit3 size={10} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#F2F3F0] truncate">
                        {profile.name}
                      </h4>
                      <p className="text-[11px] text-[#A5A7A3] mt-0.5">
                        {profile.role || "Explorer"} • Since {profile.joined || "Oct 2025"}
                      </p>

                      <div className="mt-3 space-y-1.5 text-xs text-[#A5A7A3]">
                        <div className="flex items-center gap-2 truncate">
                          <Mail size={12} className="text-[#A5A7A3]/70 shrink-0" />
                          <span className="truncate">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Calendar size={12} className="text-[#A5A7A3]/70 shrink-0" />
                          <span>Joined on {profile.joined || "Oct 25, 2025"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: APPEARANCE */}
              <div
                id="appearance-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-center gap-2 mb-1">
                    <Sun size={16} className="text-[#C8E9A9]" />
                    <h3 className="text-sm font-bold text-[#F2F3F0]">
                      Appearance
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] mb-4">
                    Choose your theme and display preferences.
                  </p>

                  {/* 3 Theme Options Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "dark",
                        title: "Dark",
                        subtitle: "Pure black theme",
                        image: THEME_IMAGES.dark,
                      },
                      {
                        id: "dim",
                        title: "Dim",
                        subtitle: "Slightly lighter",
                        image: THEME_IMAGES.dim,
                      },
                      {
                        id: "auto",
                        title: "Auto",
                        subtitle: "Follow system",
                        image: THEME_IMAGES.auto,
                      },
                    ].map((t) => {
                      const isSelected = (settings.theme || "dark") === t.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => handleThemeChange(t.id)}
                          className={`relative rounded-xl p-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group ${
                            isSelected
                              ? "bg-[#141a15] border-2 border-[#C8E9A9] shadow-[0_0_15px_rgba(200,233,169,0.2)]"
                              : "bg-[#0B0D0E] border border-[#292C2C] hover:border-[#3d4040]"
                          }`}
                        >
                          {/* Active Dot indicator */}
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                          )}

                          {/* Image preview */}
                          <div className="w-full h-14 rounded-lg overflow-hidden bg-black/60 mb-2 border border-white/5">
                            <img
                              src={t.image}
                              alt={t.title}
                              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <span className="text-xs font-bold text-[#F2F3F0]">
                            {t.title}
                          </span>
                          <span className="text-[9px] text-[#A5A7A3] mt-0.5 line-clamp-1">
                            {t.subtitle}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* ROW 2: NOTIFICATIONS (Left) + PRIVACY & SECURITY (Right) */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* CARD 3: NOTIFICATIONS */}
              <div
                id="notifications-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bell size={16} className="text-[#C8E9A9]" />
                    <h3 className="text-sm font-bold text-[#F2F3F0]">
                      Notifications
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] mb-4">
                    Control what you want to be notified about.
                  </p>

                  {/* 4 Switch Rows */}
                  <div className="space-y-3.5">
                    {[
                      {
                        key: "universeUpdates",
                        label: "New Universe Updates",
                      },
                      {
                        key: "explorationTips",
                        label: "Exploration Tips",
                      },
                      {
                        key: "productUpdates",
                        label: "Product Updates",
                      },
                      {
                        key: "marketingOffers",
                        label: "Marketing Offers",
                      },
                    ].map((item) => {
                      const enabled = Boolean(settings.notifications?.[item.key]);

                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-0.5"
                        >
                          <span className="text-xs font-medium text-[#F2F3F0]">
                            {item.label}
                          </span>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={enabled}
                            onClick={() => handleToggleNotification(item.key)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              enabled ? "bg-[#C8E9A9]" : "bg-[#292C2C]"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#050505] shadow-lg ring-0 transition duration-200 ease-in-out ${
                                enabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 4: PRIVACY & SECURITY */}
              <div
                id="privacy-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={16} className="text-[#C8E9A9]" />
                    <h3 className="text-sm font-bold text-[#F2F3F0]">
                      Privacy & Security
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] mb-4">
                    Manage your data and security preferences.
                  </p>

                  {/* Actions & Graphic Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Left Actions (8 Cols) */}
                    <div className="sm:col-span-8 space-y-3.5">
                      {/* Sub-row 1: Data Sharing */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-medium text-[#F2F3F0]">
                            Data Sharing for Research
                          </div>
                          <div className="text-[10px] text-[#A5A7A3]">
                            Help improve Parallel with anonymous data.
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(settings.privacy?.dataSharing)}
                          onClick={() => handleTogglePrivacy("dataSharing")}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            settings.privacy?.dataSharing ? "bg-[#C8E9A9]" : "bg-[#292C2C]"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#050505] shadow-lg ring-0 transition duration-200 ease-in-out ${
                              settings.privacy?.dataSharing
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Sub-row 2: Download Your Data */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-medium text-[#F2F3F0]">
                            Download Your Data
                          </div>
                          <div className="text-[10px] text-[#A5A7A3]">
                            Export all your universes and timelines.
                          </div>
                        </div>

                        <button
                          onClick={handleExportData}
                          className="px-3 py-1 rounded-full bg-[#121416] hover:bg-[#1a1c1e] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs font-semibold text-[#F2F3F0] flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Download size={11} className="text-[#C8E9A9]" />
                          <span>Download</span>
                        </button>
                      </div>

                      {/* Sub-row 3: Clear All Data */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-medium text-[#F2F3F0]">
                            Clear All Data
                          </div>
                          <div className="text-[10px] text-[#A5A7A3]">
                            Remove all saved universes.
                          </div>
                        </div>

                        <button
                          onClick={() => setClearDataModalOpen(true)}
                          className="px-3 py-1 rounded-full bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/60 text-xs font-semibold text-red-400 flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Trash2 size={11} />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Graphic: Holographic Security Shield (4 Cols) */}
                    <div className="hidden sm:flex sm:col-span-4 items-center justify-center relative">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Starry orbital circle */}
                        <div className="absolute inset-0 rounded-full border border-[#C8E9A9]/20 animate-spin-slow opacity-60" />
                        <div className="absolute -inset-1 rounded-full border border-dashed border-[#C8E9A9]/15" />

                        {/* Holographic Shield Container */}
                        <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-[#142017] to-[#0B0D0E] border border-[#C8E9A9]/40 flex items-center justify-center shadow-[0_0_20px_rgba(200,233,169,0.15)] backdrop-blur-sm">
                          <Lock size={20} className="text-[#C8E9A9]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* ROW 3: DATA MANAGEMENT (Left) + ABOUT PARALLEL (Right)    */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* CARD 5: DATA MANAGEMENT */}
              <div
                id="data-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database size={16} className="text-[#C8E9A9]" />
                    <h3 className="text-sm font-bold text-[#F2F3F0]">
                      Data Management
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] mb-4">
                    Manage your saved universes and history.
                  </p>

                  {/* 3 Stats Columns */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-[#292C2C]/50">
                    {/* Stat 1: Saved Universes */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#141a15] border border-[#C8E9A9]/20 flex items-center justify-center text-[#C8E9A9]">
                        <Layers size={14} />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-[#F2F3F0] leading-none">
                          {universesCount}
                        </div>
                        <div className="text-[10px] text-[#A5A7A3] mt-0.5 font-medium">
                          Saved Universes
                        </div>
                      </div>
                    </div>

                    {/* Stat 2: Total Branches */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#141a15] border border-[#C8E9A9]/20 flex items-center justify-center text-[#C8E9A9]">
                        <GitBranch size={14} />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-[#F2F3F0] leading-none">
                          {totalBranchesCount}
                        </div>
                        <div className="text-[10px] text-[#A5A7A3] mt-0.5 font-medium">
                          Total Branches
                        </div>
                      </div>
                    </div>

                    {/* Stat 3: Storage Used */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#141a15] border border-[#C8E9A9]/20 flex items-center justify-center text-[#C8E9A9]">
                        <Database size={14} />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-[#F2F3F0] leading-none">
                          {storageUsage.formatted || "12.5 MB"}
                        </div>
                        <div className="text-[10px] text-[#A5A7A3] mt-0.5 font-medium">
                          Storage Used
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => navigate("/saved")}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#121416] hover:bg-[#1a1c1e] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs font-semibold text-[#F2F3F0] transition-colors"
                  >
                    <span>Manage Data</span>
                    <ArrowRight size={12} className="text-[#C8E9A9]" />
                  </button>
                </div>
              </div>

              {/* CARD 6: ABOUT PARALLEL */}
              <div
                id="about-section"
                className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={16} className="text-[#C8E9A9]" />
                    <h3 className="text-sm font-bold text-[#F2F3F0]">
                      About Parallel
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#A5A7A3]">
                    One Life. Infinite Possibilities.
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[#A5A7A3] font-mono">
                      Version 1.0.0
                    </span>

                    <button
                      onClick={() => setCreditsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121416] hover:bg-[#1a1c1e] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs font-semibold text-[#F2F3F0] transition-colors"
                    >
                      <span>View Credits</span>
                      <ArrowRight size={12} className="text-[#C8E9A9]" />
                    </button>
                  </div>
                </div>

                {/* Right planet graphic */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full overflow-hidden pointer-events-none opacity-85">
                  <img
                    src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80"
                    alt="Planet horizon"
                    className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0E] via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Speculative fiction notice */}
            <p className="text-[10px] text-center text-[#A5A7A3]/60 pt-2">
              All parallel universes, timelines, simulations, and outcomes are AI-generated speculative fiction and illustrative models.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT PROFILE                                    */}
      {/* ======================================================== */}
      <Modal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Explorer Profile"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          {/* Avatar Upload / Preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-[#292C2C] shrink-0">
              <img
                src={editForm.avatar || profile.avatar}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs font-semibold text-[#F2F3F0] block mb-1">
                Profile Avatar
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121416] hover:bg-[#1a1c1e] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs font-medium text-[#F2F3F0] transition-colors"
              >
                <Upload size={12} className="text-[#C8E9A9]" />
                <span>Upload Image</span>
              </button>
              <p className="text-[10px] text-[#A5A7A3] mt-1">
                PNG, JPG or WebP under 2MB.
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-xs font-semibold text-[#F2F3F0] block mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-xl px-3.5 py-2 text-xs text-[#F2F3F0] outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-semibold text-[#F2F3F0] block mb-1">
              Explorer Designation / Role
            </label>
            <input
              type="text"
              value={editForm.role}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="e.g. Explorer, Quantum Architect"
              className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-xl px-3.5 py-2 text-xs text-[#F2F3F0] outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-[#F2F3F0] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full bg-[#08090A] border border-[#292C2C] focus:border-[#C8E9A9] rounded-xl px-3.5 py-2 text-xs text-[#F2F3F0] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#292C2C]">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 rounded-full border border-[#292C2C] bg-[#08090A] hover:bg-[#121416] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] text-[#050505] font-bold text-xs shadow-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: CLEAR DATA CONFIRMATION                         */}
      {/* ======================================================== */}
      <Modal
        open={clearDataModalOpen}
        onClose={() => setClearDataModalOpen(false)}
        title="Clear All Multiverse Data"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/20 border border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#A5A7A3] leading-relaxed">
              Are you sure you want to permanently clear all saved universes,
              branch points, and life simulations? This action cannot be undone.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setClearDataModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#292C2C] bg-[#08090A] hover:bg-[#121416] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              Clear Everything
            </button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: VIEW CREDITS                                    */}
      {/* ======================================================== */}
      <Modal
        open={creditsModalOpen}
        onClose={() => setCreditsModalOpen(false)}
        title="Credits & System Architecture"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 pt-1 text-xs text-[#A5A7A3] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#141a15] border border-[#C8E9A9]/20 flex items-center gap-3">
            <Sparkles size={20} className="text-[#C8E9A9] shrink-0" />
            <div>
              <div className="font-bold text-[#F2F3F0] text-sm">
                PARALLEL Multiverse Exploration
              </div>
              <div className="text-[11px] text-[#A5A7A3]">
                AI-powered speculative multiverse engine.
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#F2F3F0] uppercase tracking-wider text-[10px] mb-1">
              Core Technologies
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#08090A] p-2 rounded-lg border border-[#292C2C]">
                ⚡ <strong className="text-[#F2F3F0]">Vite + React 19</strong> (ES Modules)
              </div>
              <div className="bg-[#08090A] p-2 rounded-lg border border-[#292C2C]">
                🤖 <strong className="text-[#F2F3F0]">Gemini 2.5 Flash</strong> (Server-side)
              </div>
              <div className="bg-[#08090A] p-2 rounded-lg border border-[#292C2C]">
                🎨 <strong className="text-[#F2F3F0]">Tailwind CSS v4</strong> (Near-black)
              </div>
              <div className="bg-[#08090A] p-2 rounded-lg border border-[#292C2C]">
                📊 <strong className="text-[#F2F3F0]">Recharts & Framer Motion</strong>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#F2F3F0] uppercase tracking-wider text-[10px] mb-1">
              Credits & Author
            </h5>
            <p>
              Designed and crafted by <strong className="text-[#F2F3F0]">Jigar Ghoghari</strong> for exploring alternate life trajectories and counterfactual timelines.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCreditsModalOpen(false)}
              className="px-5 py-2 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] text-[#050505] font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: PREMIUM ACCESS                                  */}
      {/* ======================================================== */}
      <Modal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        title="Premium Access Status"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1 text-xs text-[#A5A7A3] text-center">
          <div className="w-12 h-12 rounded-full bg-[#141a15] border border-[#C8E9A9]/30 flex items-center justify-center text-2xl mx-auto shadow-lg">
            💎
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F2F3F0]">
              You're on the Full Multiverse Pass
            </h4>
            <p className="text-[11px] text-[#A5A7A3] mt-1">
              All capabilities including recursive timeline branching, day simulations, and comparison metrics are fully unlocked.
            </p>
          </div>
          <button
            onClick={() => setPremiumModalOpen(false)}
            className="px-5 py-2 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
}
