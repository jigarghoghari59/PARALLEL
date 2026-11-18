// src/pages/Settings.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  Database,
  Info,
  CheckCircle2,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  ArrowRight,
  Lock,
  RefreshCw,
  Layers,
  GitBranch,
  Mail,
  Calendar,
  ExternalLink,
  Cpu,
  Compass,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { settingsService } from "../services/settingsService";
import { Modal } from "../components/common/Modal";

const TABS = [
  {
    id: "profile",
    label: "Profile & Identity",
    description: "Personal details & explorer credentials",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Timeline signals & alert preferences",
    icon: Bell,
  },
  {
    id: "security",
    label: "Privacy & Security",
    description: "Sovereign encryption & data controls",
    icon: Shield,
  },
  {
    id: "data",
    label: "Data & Storage",
    description: "Multiverse repository & backup archive",
    icon: Database,
  },
  {
    id: "about",
    label: "System & About",
    description: "Engine specs & speculative fiction ethics",
    icon: Info,
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { universes, refresh } = useUniverse();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("profile");

  // Profile & Settings states
  const [profile, setProfile] = useState(() => settingsService.getProfile());
  const [settings, setSettings] = useState(() => settingsService.getSettings());

  // Storage usage
  const [storageUsage, setStorageUsage] = useState(() => settingsService.getStorageUsage());

  // Modals state
  const [clearDataModalOpen, setClearDataModalOpen] = useState(false);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Profile form state (direct inline editing)
  const [editForm, setEditForm] = useState({
    name: profile.name || "Jigar Ghoghari",
    email: profile.email || "jigar@example.com",
    role: profile.role || "Explorer",
    bio: profile.bio || "Chrononaut mapping counterfactual life trajectories across divergent causal graphs.",
    avatar: profile.avatar || "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize profile changes from external events
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setProfile(e.detail);
        setEditForm((prev) => ({
          ...prev,
          name: e.detail.name || prev.name,
          email: e.detail.email || prev.email,
          role: e.detail.role || prev.role,
          bio: e.detail.bio || prev.bio,
          avatar: e.detail.avatar || prev.avatar,
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

  // Transient notification toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Notification toggle handler
  const handleToggleNotification = (key) => {
    const current = settings.notifications || {};
    const updatedNotifications = { ...current, [key]: !current[key] };
    const updated = settingsService.saveSettings({
      notifications: updatedNotifications,
    });
    setSettings(updated);
    triggerToast("Notification preferences updated");
  };

  // Privacy toggle handler
  const handleTogglePrivacy = (key) => {
    const current = settings.privacy || {};
    const updatedPrivacy = { ...current, [key]: !current[key] };
    const updated = settingsService.saveSettings({
      privacy: updatedPrivacy,
    });
    setSettings(updated);
    triggerToast("Privacy preferences updated");
  };

  // Profile save handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = settingsService.saveProfile(editForm);
    setProfile(updated);
    setIsDirty(false);
    triggerToast("Profile identity saved successfully");
  };

  // Discard profile edits
  const handleDiscardProfile = () => {
    setEditForm({
      name: profile.name || "Jigar Ghoghari",
      email: profile.email || "jigar@example.com",
      role: profile.role || "Explorer",
      bio: profile.bio || "Chrononaut mapping counterfactual life trajectories across divergent causal graphs.",
      avatar: profile.avatar || "",
    });
    setIsDirty(false);
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
        setIsDirty(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove custom avatar
  const handleRemoveAvatar = () => {
    setEditForm((prev) => ({
      ...prev,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
    }));
    setIsDirty(true);
  };

  // Data export handler
  const handleExportData = () => {
    const ok = settingsService.exportAllData();
    if (ok) {
      triggerToast("Multiverse repository archive downloaded");
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
    triggerToast("All multiverse repositories cleared");
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0E1114] border border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] shadow-[0_0_24px_rgba(200,233,169,0.35)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 size={14} className="text-[#C8E9A9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1114] border border-white/[0.08] w-fit mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2F3F0]">
            System Configuration
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#F2F3F0] tracking-tight leading-none">
          SETTINGS & PREFERENCES
        </h1>
        <p className="text-sm sm:text-base text-[#A5A7A3] font-normal mt-2 max-w-2xl">
          Manage your explorer identity, alert telemetry, data sovereignty, and multiverse repository controls.
        </p>
      </div>

      {/* MAIN TWO-COLUMN SETTINGS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: NAVIGATION SIDEBAR (4 Cols)                 */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 space-y-4">
          {/* User Account Capsule Card */}
          <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-4.5 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3.5">
              <div className="relative w-13 h-13 rounded-full border border-white/10 ring-2 ring-white/[0.04] overflow-hidden bg-black/60 shrink-0">
                <img
                  src={
                    profile.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
                  }
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale brightness-95"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#F2F3F0] truncate">
                  <span className="truncate">{profile.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9] shrink-0" />
                </div>
                <div className="text-[11px] text-[#A5A7A3] truncate">
                  {profile.email}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-medium text-[#C8E9A9]">
                    {profile.role || "Explorer"}
                  </span>
                  <span className="text-[10px] text-[#A5A7A3]/70 font-mono">
                    Joined {profile.joined || "Oct 2025"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <nav className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-2 shadow-xl space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all text-left cursor-pointer group relative ${
                    isActive
                      ? "bg-[#141A15] text-[#F2F3F0] border border-[#C8E9A9]/40 shadow-sm"
                      : "text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#C8E9A9] text-[#050505] shadow-[0_0_12px_rgba(200,233,169,0.4)]"
                        : "bg-white/[0.04] text-[#A5A7A3] group-hover:text-[#F2F3F0]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold leading-tight ${
                        isActive ? "text-[#F2F3F0]" : "text-[#E0E2DC]"
                      }`}
                    >
                      {tab.label}
                    </div>
                    <div className="text-[10px] text-[#A5A7A3] leading-tight mt-0.5 truncate">
                      {tab.description}
                    </div>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Telemetry & Storage Pill */}
          <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A5A7A3] font-medium">Repository Footprint</span>
              <span className="text-[#F2F3F0] font-mono font-bold">
                {storageUsage.formatted || "12.5 MB"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C8E9A9] to-[#91B77A] rounded-full"
                style={{ width: "28%" }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#A5A7A3]/70 font-mono mt-2">
              <span>Local-First Sovereign Storage</span>
              <span className="text-[#C8E9A9]">Encrypted</span>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: DEDICATED ACTIVE SETTINGS PANEL (8 Cols)   */}
        {/* ======================================================== */}
        <main className="lg:col-span-8 min-h-[560px]">
          {/* ====================================================== */}
          {/* TAB 1: PROFILE & IDENTITY                              */}
          {/* ====================================================== */}
          {activeTab === "profile" && (
            <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-[#C8E9A9]" />
                  <h2 className="text-lg font-bold text-[#F2F3F0]">
                    Profile & Explorer Identity
                  </h2>
                </div>
                <p className="text-xs text-[#A5A7A3]">
                  Configure your public persona, avatar image, and multiverse credentials.
                </p>
              </div>

              {/* Avatar Uploader Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-[#121518]/70 border border-white/[0.06]">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-lg">
                  <img
                    src={
                      editForm.avatar ||
                      profile.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
                    }
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-xs font-semibold text-[#F2F3F0]">
                    Profile Photo
                  </div>
                  <p className="text-[11px] text-[#A5A7A3]">
                    Upload a square PNG, JPG, or WebP image under 2MB. Stored locally in your client cache.
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#181C20] hover:bg-[#20252A] border border-white/[0.1] hover:border-[#C8E9A9]/60 text-xs font-medium text-[#F2F3F0] transition-colors cursor-pointer"
                    >
                      <Upload size={13} className="text-[#C8E9A9]" />
                      <span>Upload Photo</span>
                    </button>
                    {editForm.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1.5 rounded-lg text-xs text-[#A5A7A3] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-[#F2F3F0] block mb-1.5">
                      Explorer Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, name: e.target.value }));
                        setIsDirty(true);
                      }}
                      className="w-full bg-[#121518] border border-white/[0.08] focus:border-[#C8E9A9] rounded-xl px-4 py-2.5 text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/50 outline-none transition-colors"
                      placeholder="e.g. Jigar Ghoghari"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#F2F3F0] block mb-1.5">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, role: e.target.value }));
                        setIsDirty(true);
                      }}
                      className="w-full bg-[#121518] border border-white/[0.08] focus:border-[#C8E9A9] rounded-xl px-4 py-2.5 text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/50 outline-none transition-colors"
                      placeholder="e.g. Chrononaut, Reality Architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#F2F3F0] block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => {
                      setEditForm((prev) => ({ ...prev, email: e.target.value }));
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121518] border border-white/[0.08] focus:border-[#C8E9A9] rounded-xl px-4 py-2.5 text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/50 outline-none transition-colors"
                    placeholder="explorer@parallel.multiverse"
                  />
                  <p className="text-[10px] text-[#A5A7A3] mt-1">
                    Used strictly for localized data exports and identification. Never shared with third parties.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#F2F3F0] block mb-1.5">
                    Personal Log / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => {
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }));
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121518] border border-white/[0.08] focus:border-[#C8E9A9] rounded-xl p-3.5 text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/50 outline-none transition-colors resize-none"
                    placeholder="Brief manifesto or chronicle of your counterfactual explorations..."
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[11px] text-[#A5A7A3]">
                    {isDirty ? (
                      <span className="text-[#C8E9A9] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] inline-block animate-pulse" />
                        Unsaved edits pending
                      </span>
                    ) : (
                      <span>All explorer credentials synchronized</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {isDirty && (
                      <button
                        type="button"
                        onClick={handleDiscardProfile}
                        className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors cursor-pointer"
                      >
                        Discard
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!isDirty}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        isDirty
                          ? "bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] shadow-[0_0_16px_rgba(200,233,169,0.3)] active:scale-95"
                          : "bg-white/[0.06] text-[#A5A7A3]/50 cursor-not-allowed"
                      }`}
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 2: NOTIFICATIONS                                   */}
          {/* ====================================================== */}
          {activeTab === "notifications" && (
            <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={18} className="text-[#C8E9A9]" />
                  <h2 className="text-lg font-bold text-[#F2F3F0]">
                    Notification Channels & Alerts
                  </h2>
                </div>
                <p className="text-xs text-[#A5A7A3]">
                  Select the signals and updates delivered to your console during reality branching and day simulations.
                </p>
              </div>

              {/* Group 1: Reality & Timeline Signals */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8E9A9]">
                  Reality & Timeline Signals
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      key: "universeUpdates",
                      title: "New Universe Convergence",
                      description: "Alert me when an AI-generated alternate reality branch completes its causal trajectory.",
                    },
                    {
                      key: "explorationTips",
                      title: "Exploration & Branch Prompts",
                      description: "Deliver intelligent decision recommendations and speculative prompts at fork nodes.",
                    },
                  ].map((item) => {
                    const enabled = Boolean(settings.notifications?.[item.key]);
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#121518]/60 border border-white/[0.06] hover:border-white/10 transition-colors"
                      >
                        <div className="space-y-0.5 pr-4">
                          <div className="text-xs font-semibold text-[#F2F3F0]">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#A5A7A3] leading-relaxed">
                            {item.description}
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => handleToggleNotification(item.key)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            enabled ? "bg-[#C8E9A9]" : "bg-[#292C2C]"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#050505] shadow-lg ring-0 transition duration-200 ease-in-out ${
                              enabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: System Telemetry */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5A7A3]">
                  System & Platform Communications
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      key: "productUpdates",
                      title: "Engine & Model Upgrades",
                      description: "Announcements regarding Gemini reasoning updates, DAG improvements, and new parameters.",
                    },
                    {
                      key: "marketingOffers",
                      title: "Community Dispatches & Axioms",
                      description: "Periodic dispatches on counterfactual theory, causal graph benchmarks, and feature releases.",
                    },
                  ].map((item) => {
                    const enabled = Boolean(settings.notifications?.[item.key]);
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#121518]/60 border border-white/[0.06] hover:border-white/10 transition-colors"
                      >
                        <div className="space-y-0.5 pr-4">
                          <div className="text-xs font-semibold text-[#F2F3F0]">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#A5A7A3] leading-relaxed">
                            {item.description}
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => handleToggleNotification(item.key)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            enabled ? "bg-[#C8E9A9]" : "bg-[#292C2C]"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#050505] shadow-lg ring-0 transition duration-200 ease-in-out ${
                              enabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 3: PRIVACY & SECURITY                              */}
          {/* ====================================================== */}
          {activeTab === "security" && (
            <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={18} className="text-[#C8E9A9]" />
                  <h2 className="text-lg font-bold text-[#F2F3F0]">
                    Data Protection & Security Controls
                  </h2>
                </div>
                <p className="text-xs text-[#A5A7A3]">
                  Parallel utilizes zero-cloud telemetry by default. All alternate universes and decisions remain locally sovereign.
                </p>
              </div>

              {/* Local-first Sovereignty Banner */}
              <div className="p-4 rounded-xl bg-[#141A15] border border-[#C8E9A9]/20 flex items-start gap-3.5">
                <Lock size={18} className="text-[#C8E9A9] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#F2F3F0]">
                    Zero-Cloud Local Sovereignty
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] leading-relaxed">
                    Your life decisions, branched realities, and day simulations are never transmitted to a centralized tracking database. Data is persisted exclusively in your client-side LocalStorage repository.
                  </p>
                </div>
              </div>

              {/* Security Preferences */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5A7A3]">
                  Telemetry & Diagnostics
                </h3>

                <div className="p-4 rounded-xl bg-[#121518]/60 border border-white/[0.06] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#F2F3F0]">
                      Anonymous Graph Topology Telemetry
                    </div>
                    <div className="text-[11px] text-[#A5A7A3] leading-relaxed">
                      Allow anonymized, aggregated tree branch counts to improve AI narrative coherence algorithms.
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(settings.privacy?.dataSharing)}
                    onClick={() => handleTogglePrivacy("dataSharing")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.privacy?.dataSharing ? "bg-[#C8E9A9]" : "bg-[#292C2C]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#050505] shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.privacy?.dataSharing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Archive Export Card */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5A7A3]">
                  Data Portability
                </h3>

                <div className="p-4 rounded-xl bg-[#121518]/60 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#F2F3F0]">
                      Export Complete Multiverse Archive
                    </div>
                    <div className="text-[11px] text-[#A5A7A3] leading-relaxed">
                      Download a structured JSON backup containing all universes, realities, branch choices, and timeline states.
                    </div>
                  </div>

                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181C20] hover:bg-[#20252A] border border-white/[0.1] hover:border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] transition-colors shrink-0 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Download size={13} className="text-[#C8E9A9]" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4 pt-4 border-t border-rose-500/20">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Danger Zone
                </h3>

                <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-rose-300">
                      Purge All Multiverse Data
                    </div>
                    <div className="text-[11px] text-[#A5A7A3] leading-relaxed">
                      Permanently wipe all stored timelines, custom branches, simulation states, and cached profiles.
                    </div>
                  </div>

                  <button
                    onClick={() => setClearDataModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/40 text-xs font-semibold text-rose-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Purge Everything</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 4: DATA & STORAGE                                  */}
          {/* ====================================================== */}
          {activeTab === "data" && (
            <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Database size={18} className="text-[#C8E9A9]" />
                  <h2 className="text-lg font-bold text-[#F2F3F0]">
                    Repository Metrics & Storage Health
                  </h2>
                </div>
                <p className="text-xs text-[#A5A7A3]">
                  Monitor your local universe memory, total timeline nodes, and storage quotas.
                </p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#121518] border border-white/[0.08]">
                  <div className="w-8 h-8 rounded-lg bg-[#141A15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mb-3 shadow-[0_0_10px_rgba(200,233,169,0.2)]">
                    <Layers size={15} />
                  </div>
                  <div className="text-2xl font-black text-[#F2F3F0]">
                    {universesCount}
                  </div>
                  <div className="text-xs font-semibold text-[#A5A7A3] mt-0.5">
                    Active Universes
                  </div>
                  <div className="text-[10px] text-[#A5A7A3]/60 mt-1">
                    Causal timelines created
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121518] border border-white/[0.08]">
                  <div className="w-8 h-8 rounded-lg bg-[#141A15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mb-3 shadow-[0_0_10px_rgba(200,233,169,0.2)]">
                    <GitBranch size={15} />
                  </div>
                  <div className="text-2xl font-black text-[#F2F3F0]">
                    {totalBranchesCount}
                  </div>
                  <div className="text-xs font-semibold text-[#A5A7A3] mt-0.5">
                    Branch Nodes
                  </div>
                  <div className="text-[10px] text-[#A5A7A3]/60 mt-1">
                    Total decision checkpoints
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121518] border border-white/[0.08]">
                  <div className="w-8 h-8 rounded-lg bg-[#141A15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mb-3 shadow-[0_0_10px_rgba(200,233,169,0.2)]">
                    <Database size={15} />
                  </div>
                  <div className="text-2xl font-black text-[#F2F3F0]">
                    {storageUsage.formatted || "12.5 MB"}
                  </div>
                  <div className="text-xs font-semibold text-[#A5A7A3] mt-0.5">
                    Cache Consumed
                  </div>
                  <div className="text-[10px] text-[#A5A7A3]/60 mt-1">
                    Estimated browser footprint
                  </div>
                </div>
              </div>

              {/* Storage Quota Breakdown Card */}
              <div className="p-5 rounded-xl bg-[#121518]/60 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F2F3F0]">Client Storage Quota Usage</span>
                  <span className="text-[#C8E9A9] font-mono font-bold">Optimal</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8E9A9] to-[#91B77A] rounded-full"
                    style={{ width: "24%" }}
                  />
                </div>
                <p className="text-[11px] text-[#A5A7A3] leading-relaxed">
                  Browser storage operates with ample capacity. High volume simulations and recursively generated timelines are compressed automatically upon saving.
                </p>
              </div>

              {/* Data Actions Strip */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-[#A5A7A3]">
                  Looking to review all saved multiverse trees?
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleExportData}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#181C20] hover:bg-[#20252A] border border-white/[0.08] hover:border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-[#C8E9A9]" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => navigate("/saved")}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs transition-all shadow-[0_0_16px_rgba(200,233,169,0.3)] cursor-pointer active:scale-95"
                  >
                    <span>View Saved Timelines</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* TAB 5: SYSTEM & ABOUT                                  */}
          {/* ====================================================== */}
          {activeTab === "about" && (
            <div className="bg-[#0B0D0E] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/30 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={18} className="text-[#C8E9A9]" />
                  <h2 className="text-lg font-bold text-[#F2F3F0]">
                    System Architecture & Speculative Fiction Ethics
                  </h2>
                </div>
                <p className="text-xs text-[#A5A7A3]">
                  Technical specifications, engine axioms, and ethical disclosures governing PARALLEL.
                </p>
              </div>

              {/* Speculative Fiction Ethical Notice Banner */}
              <div className="p-4 rounded-xl bg-[#141A15] border border-[#C8E9A9]/20 flex items-start gap-3.5">
                <Compass size={20} className="text-[#C8E9A9] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#F2F3F0]">
                    Mandatory Speculative Fiction Disclosure
                  </div>
                  <p className="text-[11px] text-[#A5A7A3] leading-relaxed">
                    All parallel universes, divergent timelines, coherence statistics, and day simulation narratives generated by PARALLEL are works of AI-driven speculative fiction and counterfactual models. They do not constitute guaranteed predictions, psychological diagnoses, or deterministic life advice.
                  </p>
                </div>
              </div>

              {/* Architecture Specifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5A7A3]">
                  Core Multiverse Architecture
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#121518]/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-[#C8E9A9] uppercase">Topology</span>
                    <div className="font-bold text-[#F2F3F0]">Directed Acyclic Graph (DAG)</div>
                    <p className="text-[11px] text-[#A5A7A3]">Strict parent-child reality branching with immutability guarantees.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121518]/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-[#C8E9A9] uppercase">AI Reasoning</span>
                    <div className="font-bold text-[#F2F3F0]">Gemini 2.5 Flash Server-Side</div>
                    <p className="text-[11px] text-[#A5A7A3]">Strict Zod schema validation with automatic retry on malformed JSON.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121518]/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-[#C8E9A9] uppercase">Frontend Engine</span>
                    <div className="font-bold text-[#F2F3F0]">React 19 + Vite + ES Modules</div>
                    <p className="text-[11px] text-[#A5A7A3]">Near-black design system with sage accent and high-speed reactivity.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121518]/70 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-[#C8E9A9] uppercase">Release Tier</span>
                    <div className="font-bold text-[#F2F3F0]">PARALLEL v1.0.0 Stable</div>
                    <p className="text-[11px] text-[#A5A7A3]">Client-first persistence architecture with zero external tracking.</p>
                  </div>
                </div>
              </div>

              {/* Author Credits & Actions */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F2F3F0]">
                    Created by Jigar Ghoghari
                  </div>
                  <div className="text-[11px] text-[#A5A7A3]">
                    One Life. Infinite Possibilities. · ©2026
                  </div>
                </div>

                <button
                  onClick={() => setCreditsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181C20] hover:bg-[#20252A] border border-white/[0.08] hover:border-[#C8E9A9]/60 text-xs font-semibold text-[#F2F3F0] transition-colors cursor-pointer"
                >
                  <Cpu size={13} className="text-[#C8E9A9]" />
                  <span>View Full Manifest</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CLEAR DATA CONFIRMATION                         */}
      {/* ======================================================== */}
      <Modal
        open={clearDataModalOpen}
        onClose={() => setClearDataModalOpen(false)}
        title="Purge Multiverse Repositories"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#A5A7A3] leading-relaxed">
              Are you sure you want to permanently clear all saved universes,
              branch points, and life simulations? This action deletes your local data irreversibly.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setClearDataModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-[#121518] hover:bg-[#181C20] text-xs font-medium text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
            >
              Yes, Purge Everything
            </button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: VIEW CREDITS                                    */}
      {/* ======================================================== */}
      <Modal
        open={creditsModalOpen}
        onClose={() => setCreditsModalOpen(false)}
        title="System Manifest & Credits"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 pt-1 text-xs text-[#A5A7A3] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#141A15] border border-[#C8E9A9]/20 flex items-center gap-3">
            <Compass size={22} className="text-[#C8E9A9] shrink-0" />
            <div>
              <div className="font-bold text-[#F2F3F0] text-sm">
                PARALLEL Multiverse Exploration System
              </div>
              <div className="text-[11px] text-[#A5A7A3]">
                AI-driven counterfactual reality branching engine.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-[#F2F3F0] uppercase tracking-wider text-[10px]">
              Technology Foundation
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#121518] border border-white/[0.08] p-2.5 rounded-xl">
                ⚡ <strong className="text-[#F2F3F0]">Vite + React 19</strong> (ES Modules)
              </div>
              <div className="bg-[#121518] border border-white/[0.08] p-2.5 rounded-xl">
                🤖 <strong className="text-[#F2F3F0]">Gemini 2.5 Flash</strong> (Server-side)
              </div>
              <div className="bg-[#121518] border border-white/[0.08] p-2.5 rounded-xl">
                🎨 <strong className="text-[#F2F3F0]">Tailwind CSS</strong> (Near-black)
              </div>
              <div className="bg-[#121518] border border-white/[0.08] p-2.5 rounded-xl">
                📊 <strong className="text-[#F2F3F0]">Lucide Icons & Framer</strong>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h5 className="font-bold text-[#F2F3F0] uppercase tracking-wider text-[10px]">
              Author
            </h5>
            <p>
              Architected and designed by <strong className="text-[#F2F3F0]">Jigar Ghoghari</strong>.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCreditsModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
