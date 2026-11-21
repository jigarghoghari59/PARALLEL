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
  Layers,
  GitBranch,
  Cpu,
  Compass,
  Zap,
  Palette,
  BarChart3,
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

  // Edit Profile form state
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
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 select-none">
      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card border border-accent/60 text-xs font-semibold text-ink">
          <CheckCircle2 size={14} className="text-accent" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="mb-8 border-b border-rule pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-rule w-fit mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          <span className="text-xs font-medium text-ink">
            System configuration
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Settings & preferences
        </h1>
        <p className="text-sm text-muted font-normal mt-2 max-w-2xl">
          Manage your explorer identity, alert telemetry, data sovereignty, and multiverse repository controls.
        </p>
      </div>

      {/* MAIN TWO-COLUMN SETTINGS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: NAVIGATION SIDEBAR (4 Cols) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* User Account Capsule */}
          <div className="bg-card border border-rule rounded-card p-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border border-rule overflow-hidden bg-paper-3 shrink-0">
                <img
                  src={
                    profile.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"
                  }
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-ink truncate">
                  <span className="truncate">{profile.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                </div>
                <div className="text-[11px] text-muted truncate">
                  {profile.email}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-rule text-xs font-medium text-accent">
                    {profile.role || "Explorer"}
                  </span>
                  <span className="text-xs text-muted">
                    Joined {profile.joined || "Oct 2025"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <nav className="bg-card border border-rule rounded-card p-2 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-btn transition-colors text-left cursor-pointer group relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    isActive
                      ? "bg-accent/10 text-ink border border-accent/40"
                      : "text-muted hover:text-ink hover:bg-surface border border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-accent text-accent-ink"
                        : "bg-surface text-muted group-hover:text-ink"
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold leading-tight ${
                        isActive ? "text-ink" : "text-ink/80"
                      }`}
                    >
                      {tab.label}
                    </div>
                    <div className="text-[11px] text-muted leading-tight mt-0.5 truncate">
                      {tab.description}
                    </div>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Telemetry & Storage Capsule */}
          <div className="bg-card border border-rule rounded-card p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Repository footprint</span>
              <span className="text-ink font-semibold tabular-nums">
                {storageUsage.formatted || "12.5 MB"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: "28%" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <span>Local storage</span>
              <span className="text-accent font-medium">Active</span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: ACTIVE SETTINGS PANEL (8 Cols) */}
        <main className="lg:col-span-8 min-h-[520px]">
          {/* TAB 1: PROFILE & IDENTITY */}
          {activeTab === "profile" && (
            <div className="bg-card border border-rule rounded-card p-6 sm:p-7 space-y-6">
              {/* Section Header */}
              <div className="border-b border-rule pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold text-ink">
                    Profile & explorer identity
                  </h2>
                </div>
                <p className="text-xs text-muted">
                  Configure your public persona, avatar image, and multiverse credentials.
                </p>
              </div>

              {/* Avatar Uploader Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-rule">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-paper-3 border border-rule shrink-0">
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

                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-semibold text-ink">
                    Profile photo
                  </div>
                  <p className="text-xs text-muted">
                    Upload a square image under 2MB. Stored locally in your client cache.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <Upload size={13} className="text-accent" aria-hidden="true" />
                      <span>Upload photo</span>
                    </button>
                    {editForm.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1.5 rounded-btn text-xs text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        Reset default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink block mb-1.5">
                      Explorer full name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, name: e.target.value }));
                        setIsDirty(true);
                      }}
                      className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                      placeholder="e.g. Jigar Ghoghari"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink block mb-1.5">
                      Designation / role
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, role: e.target.value }));
                        setIsDirty(true);
                      }}
                      className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                      placeholder="e.g. Chrononaut, Reality Architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => {
                      setEditForm((prev) => ({ ...prev, email: e.target.value }));
                      setIsDirty(true);
                    }}
                    className="w-full bg-surface border border-rule focus:border-accent rounded-input px-3 py-2 text-xs text-ink outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                    placeholder="explorer@parallel.multiverse"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    Used strictly for localized data exports and identification.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1.5">
                    Personal log / bio
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => {
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }));
                      setIsDirty(true);
                    }}
                    className="w-full bg-surface border border-rule focus:border-accent rounded-input p-3 text-xs text-ink outline-none transition-colors resize-none focus-visible:ring-1 focus-visible:ring-accent"
                    placeholder="Brief manifesto or chronicle of your counterfactual explorations…"
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-rule flex items-center justify-between">
                  <div className="text-xs text-muted">
                    {isDirty ? (
                      <span className="text-accent font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block motion-safe:animate-pulse" />
                        Unsaved edits pending
                      </span>
                    ) : (
                      <span>All explorer credentials synchronized</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isDirty && (
                      <button
                        type="button"
                        onClick={handleDiscardProfile}
                        className="px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 text-xs font-medium text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        Discard
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!isDirty}
                      className={`px-4 py-2 rounded-btn text-xs font-semibold transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                        isDirty
                          ? "bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink"
                          : "bg-surface text-muted/50"
                      }`}
                    >
                      Save profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-rule rounded-card p-6 sm:p-7 space-y-6">
              {/* Section Header */}
              <div className="border-b border-rule pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={16} className="text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold text-ink">
                    Notification channels & alerts
                  </h2>
                </div>
                <p className="text-xs text-muted">
                  Select the signals and updates delivered to your console during reality branching and day simulations.
                </p>
              </div>

              {/* Group 1: Reality & Timeline Signals */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-accent">
                  Reality and timeline signals
                </h3>

                <div className="divide-y divide-rule/60">
                  {[
                    {
                      key: "universeUpdates",
                      title: "New universe convergence",
                      description: "Alert me when an AI-generated alternate reality branch completes its causal trajectory.",
                    },
                    {
                      key: "explorationTips",
                      title: "Exploration and branch prompts",
                      description: "Deliver intelligent decision recommendations and speculative prompts at fork nodes.",
                    },
                  ].map((item) => {
                    const enabled = Boolean(settings.notifications?.[item.key]);
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="space-y-0.5 pr-4">
                          <div className="text-xs font-semibold text-ink">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted leading-relaxed">
                            {item.description}
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => handleToggleNotification(item.key)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                            enabled ? "bg-accent" : "bg-paper-3"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-paper shadow-sm transition duration-150 ${
                              enabled ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: System Telemetry */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-muted">
                  System and platform communications
                </h3>

                <div className="divide-y divide-rule/60">
                  {[
                    {
                      key: "productUpdates",
                      title: "Engine and model upgrades",
                      description: "Announcements regarding reasoning updates and causal graph enhancements.",
                    },
                    {
                      key: "marketingOffers",
                      title: "Community dispatches and axioms",
                      description: "Periodic dispatches on counterfactual theory and feature releases.",
                    },
                  ].map((item) => {
                    const enabled = Boolean(settings.notifications?.[item.key]);
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="space-y-0.5 pr-4">
                          <div className="text-xs font-semibold text-ink">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted leading-relaxed">
                            {item.description}
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={enabled}
                          onClick={() => handleToggleNotification(item.key)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                            enabled ? "bg-accent" : "bg-paper-3"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-paper shadow-sm transition duration-150 ${
                              enabled ? "translate-x-5" : "translate-x-0.5"
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

          {/* TAB 3: PRIVACY & SECURITY */}
          {activeTab === "security" && (
            <div className="bg-card border border-rule rounded-card p-6 sm:p-7 space-y-6">
              {/* Section Header */}
              <div className="border-b border-rule pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold text-ink">
                    Data protection & security controls
                  </h2>
                </div>
                <p className="text-xs text-muted">
                  Parallel utilizes zero-cloud telemetry by default. All alternate universes and decisions remain locally sovereign.
                </p>
              </div>

              {/* Local-first Sovereignty Inset */}
              <div className="py-3 border-b border-rule flex items-start gap-3">
                <Lock size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-ink">
                    Zero-cloud local sovereignty
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Your life decisions, branched realities, and day simulations are never transmitted to a tracking database. Data is persisted in your client-side LocalStorage repository.
                  </p>
                </div>
              </div>

              {/* Security Preferences */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted">
                  Telemetry and diagnostics
                </h3>

                <div className="py-3 border-b border-rule flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-ink">
                      Anonymous graph topology telemetry
                    </div>
                    <div className="text-xs text-muted leading-relaxed">
                      Allow anonymized, aggregated tree branch counts to improve AI narrative coherence algorithms.
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(settings.privacy?.dataSharing)}
                    onClick={() => handleTogglePrivacy("dataSharing")}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                      settings.privacy?.dataSharing ? "bg-accent" : "bg-paper-3"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-paper shadow-sm transition duration-150 ${
                        settings.privacy?.dataSharing ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Archive Export */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-muted">
                  Data portability
                </h3>

                <div className="py-3 border-b border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-ink">
                      Export complete multiverse archive
                    </div>
                    <div className="text-xs text-muted leading-relaxed">
                      Download a structured JSON backup containing all universes, realities, branch choices, and timeline states.
                    </div>
                  </div>

                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <Download size={13} className="text-accent" aria-hidden="true" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-3 pt-3">
                <h3 className="text-xs font-semibold text-muted">
                  Danger zone
                </h3>

                <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-ink">
                      Purge all multiverse data
                    </div>
                    <div className="text-xs text-muted leading-relaxed">
                      Permanently wipe all stored timelines, custom branches, simulation states, and cached profiles.
                    </div>
                  </div>

                  <button
                    onClick={() => setClearDataModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule text-xs font-semibold text-ink hover:text-accent transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    <span>Purge everything</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA & STORAGE */}
          {activeTab === "data" && (
            <div className="bg-card border border-rule rounded-card p-6 sm:p-7 space-y-6">
              {/* Section Header */}
              <div className="border-b border-rule pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Database size={16} className="text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold text-ink">
                    Repository metrics & storage health
                  </h2>
                </div>
                <p className="text-xs text-muted">
                  Monitor your local universe memory, total timeline nodes, and storage quotas.
                </p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 border-b sm:border-b-0 sm:border-r border-rule">
                  <div className="w-7 h-7 rounded-md bg-surface border border-rule flex items-center justify-center text-accent mb-2">
                    <Layers size={14} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-black text-ink tabular-nums">
                    {universesCount}
                  </div>
                  <div className="text-xs font-medium text-muted mt-0.5">
                    Active universes
                  </div>
                  <div className="text-[11px] text-muted/60 mt-0.5">
                    Causal timelines created
                  </div>
                </div>

                <div className="p-3.5 border-b sm:border-b-0 sm:border-r border-rule">
                  <div className="w-7 h-7 rounded-md bg-surface border border-rule flex items-center justify-center text-accent mb-2">
                    <GitBranch size={14} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-black text-ink tabular-nums">
                    {totalBranchesCount}
                  </div>
                  <div className="text-xs font-medium text-muted mt-0.5">
                    Branch nodes
                  </div>
                  <div className="text-[11px] text-muted/60 mt-0.5">
                    Total decision checkpoints
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="w-7 h-7 rounded-md bg-surface border border-rule flex items-center justify-center text-accent mb-2">
                    <Database size={14} aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-black text-ink tabular-nums">
                    {storageUsage.formatted || "12.5 MB"}
                  </div>
                  <div className="text-xs font-medium text-muted mt-0.5">
                    Cache consumed
                  </div>
                  <div className="text-[11px] text-muted/60 mt-0.5">
                    Browser footprint
                  </div>
                </div>
              </div>

              {/* Storage Quota Usage */}
              <div className="py-3 border-t border-rule space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">Client storage quota usage</span>
                  <span className="text-accent font-semibold">Optimal</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-paper-3 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: "24%" }}
                  />
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Browser storage operates with ample capacity. High volume simulations are compressed automatically upon saving.
                </p>
              </div>

              {/* Data Actions Strip */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rule">
                <div className="text-xs text-muted">
                  Looking to review all saved multiverse trees?
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleExportData}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <Download size={13} className="text-accent" aria-hidden="true" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => navigate("/saved")}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span>View saved timelines</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM & ABOUT */}
          {activeTab === "about" && (
            <div className="bg-card border border-rule rounded-card p-6 sm:p-7 space-y-6">
              {/* Section Header */}
              <div className="border-b border-rule pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={16} className="text-accent" aria-hidden="true" />
                  <h2 className="text-base font-bold text-ink">
                    System architecture & speculative fiction ethics
                  </h2>
                </div>
                <p className="text-xs text-muted">
                  Technical specifications, engine axioms, and ethical disclosures governing PARALLEL.
                </p>
              </div>

              {/* Speculative Fiction Ethical Notice */}
              <div className="py-3 border-b border-rule flex items-start gap-3">
                <Compass size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-ink">
                    Mandatory speculative fiction disclosure
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    All parallel universes, divergent timelines, coherence statistics, and day simulation narratives generated by PARALLEL are works of AI-driven speculative fiction and counterfactual models. They do not constitute guaranteed predictions, psychological diagnoses, or deterministic life advice.
                  </p>
                </div>
              </div>

              {/* Architecture Specifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted">
                  Core multiverse architecture
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-rule/60 rounded-md space-y-1">
                    <span className="text-[11px] text-accent">Topology</span>
                    <div className="font-semibold text-ink">Directed Acyclic Graph (DAG)</div>
                    <p className="text-xs text-muted">Strict parent-child reality branching with immutability guarantees.</p>
                  </div>

                  <div className="p-3 border border-rule/60 rounded-md space-y-1">
                    <span className="text-[11px] text-accent">AI reasoning</span>
                    <div className="font-semibold text-ink">Gemini 2.5 Flash Server-Side</div>
                    <p className="text-xs text-muted">Strict Zod schema validation with automatic retry on malformed JSON.</p>
                  </div>

                  <div className="p-3 border border-rule/60 rounded-md space-y-1">
                    <span className="text-[11px] text-accent">Frontend engine</span>
                    <div className="font-semibold text-ink">React 19 + Vite + ES Modules</div>
                    <p className="text-xs text-muted">Near-black design system with sage accent and high-speed reactivity.</p>
                  </div>

                  <div className="p-3 border border-rule/60 rounded-md space-y-1">
                    <span className="text-[11px] text-accent">Release tier</span>
                    <div className="font-semibold text-ink">PARALLEL v1.0.0 Stable</div>
                    <p className="text-xs text-muted">Client-first persistence architecture with zero external tracking.</p>
                  </div>
                </div>
              </div>

              {/* Author Credits & Actions */}
              <div className="pt-3 border-t border-rule flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-ink">
                    Created by Jigar Ghoghari
                  </div>
                  <div className="text-[11px] text-muted">
                    One Life. Infinite Possibilities. &bull; &copy; 2026
                  </div>
                </div>

                <button
                  onClick={() => setCreditsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Cpu size={13} className="text-accent" aria-hidden="true" />
                  <span>View full manifest</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: CLEAR DATA CONFIRMATION */}
      <Modal
        open={clearDataModalOpen}
        onClose={() => setClearDataModalOpen(false)}
        title="Purge Multiverse Repositories"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-card bg-surface border border-rule">
            <AlertTriangle size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-muted leading-relaxed">
              Are you sure you want to permanently clear all saved universes,
              branch points, and life simulations? This action deletes your local data irreversibly.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setClearDataModalOpen(false)}
              className="px-4 py-2 rounded-btn border border-rule bg-surface hover:bg-surface/80 active:bg-paper-2 text-xs font-medium text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Purge everything
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: VIEW CREDITS */}
      <Modal
        open={creditsModalOpen}
        onClose={() => setCreditsModalOpen(false)}
        title="System Manifest & Credits"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 pt-1 text-xs text-muted leading-relaxed">
          <div className="p-3.5 rounded-card bg-surface border border-rule flex items-center gap-3">
            <Compass size={20} className="text-accent shrink-0" aria-hidden="true" />
            <div>
              <div className="font-bold text-ink text-sm">
                PARALLEL Multiverse Exploration System
              </div>
              <div className="text-[11px] text-muted">
                AI-driven counterfactual reality branching engine.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-ink text-xs">
              Technology foundation
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface border border-rule p-2.5 rounded-card flex items-center gap-2">
                <Zap size={14} className="text-accent shrink-0" aria-hidden="true" />
                <div>
                  <strong className="text-ink block">Vite + React 19</strong>
                  <span className="text-[11px] text-muted">ES Modules</span>
                </div>
              </div>
              <div className="bg-surface border border-rule p-2.5 rounded-card flex items-center gap-2">
                <Cpu size={14} className="text-accent shrink-0" aria-hidden="true" />
                <div>
                  <strong className="text-ink block">Gemini 2.5 Flash</strong>
                  <span className="text-[11px] text-muted">Server-side Zod</span>
                </div>
              </div>
              <div className="bg-surface border border-rule p-2.5 rounded-card flex items-center gap-2">
                <Palette size={14} className="text-accent shrink-0" aria-hidden="true" />
                <div>
                  <strong className="text-ink block">Tailwind CSS</strong>
                  <span className="text-[11px] text-muted">Near-black tokens</span>
                </div>
              </div>
              <div className="bg-surface border border-rule p-2.5 rounded-card flex items-center gap-2">
                <BarChart3 size={14} className="text-accent shrink-0" aria-hidden="true" />
                <div>
                  <strong className="text-ink block">Lucide & Framer</strong>
                  <span className="text-[11px] text-muted">Dynamic graphics</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h5 className="font-semibold text-ink text-xs">
              Author
            </h5>
            <p>
              Architected and designed by <strong className="text-ink">Jigar Ghoghari</strong>.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCreditsModalOpen(false)}
              className="px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
