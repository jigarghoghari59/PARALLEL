// src/pages/Saved.jsx
import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Database,
  Calendar,
  GitBranch,
  Play,
  Scale,
  Bookmark,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { Modal } from "../components/common/Modal";

function formatDate(timestamp) {
  if (!timestamp) return "Oct 26, 2025";
  try {
    const d = new Date(timestamp);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Oct 26, 2025";
  }
}

export default function Saved() {
  const navigate = useNavigate();
  const location = useLocation();
  const isArchivePage = location.pathname.startsWith("/archive");

  const { universes, remove, toggleBookmark } = useUniverse();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(
    isArchivePage ? "bookmarked" : "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Delete modal state
  const [universeToDelete, setUniverseToDelete] = useState(null);

  // Filter universes
  const filteredUniverses = useMemo(() => {
    let list = universes || [];

    // Filter by archive/bookmark if on /archive or filter selected
    if (isArchivePage || selectedFilter === "bookmarked") {
      list = list.filter((u) => u.bookmarked);
    } else if (selectedFilter === "original") {
      list = list.filter((u) => u.status === "original" || !u.status);
    } else if (selectedFilter === "alternative") {
      list = list.filter((u) => u.status === "alternative");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.title?.toLowerCase().includes(q) ||
          u.originalDecision?.toLowerCase().includes(q) ||
          u.pathText?.toLowerCase().includes(q) ||
          u.category?.toLowerCase().includes(q) ||
          u.realities?.some(
            (r) =>
              r.name?.toLowerCase().includes(q) ||
              r.career?.toLowerCase().includes(q) ||
              r.industry?.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [universes, isArchivePage, selectedFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUniverses.length / pageSize));
  const paginatedUniverses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUniverses.slice(start, start + pageSize);
  }, [filteredUniverses, currentPage, pageSize]);

  const handleDeleteConfirm = () => {
    if (universeToDelete?.id) {
      remove(universeToDelete.id);
      setUniverseToDelete(null);
    }
  };

  const totalCount = universes.length;

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] overflow-x-hidden select-none pb-12">
      {/* Background Star Dots (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
        <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-white rounded-full opacity-30" />
        <div className="absolute bottom-24 right-1/3 w-1.5 h-1.5 bg-[#9678C9] rounded-full opacity-30" />
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* TOP HEADER SECTION (Title + Planet Inset Banner)        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Title Block (7 Cols) */}
          <div className="lg:col-span-7 space-y-2">
            {/* Pill Counter Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E]/90 border border-[#292C2C] text-xs text-[#F2F3F0] shadow-sm backdrop-blur-md">
              <Database size={13} className="text-[#C8E9A9]" />
              <span className="font-medium">
                {isArchivePage
                  ? `${filteredUniverses.length} Universes Bookmarked`
                  : `${totalCount} Universes Saved`}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
            </div>

            {/* Main Page Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F2F3F0] tracking-tight">
              {isArchivePage ? (
                <>
                  Multiverse <span className="text-[#C8E9A9]">Archive</span>
                </>
              ) : (
                <>
                  Saved <span className="text-[#C8E9A9]">Universes</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#A5A7A3] font-medium leading-relaxed">
              {isArchivePage
                ? "Your bookmarked turning points and high-priority timelines."
                : "Revisit your explored realities anytime."}
            </p>
          </div>

          {/* Right Celestial Planet Inset Banner (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-32 sm:h-36 rounded-2xl sm:rounded-3xl bg-[#0B0D0E]/80 border border-[#292C2C] overflow-hidden flex items-center justify-between p-6 shadow-2xl backdrop-blur-md group">
              {/* Left Quote */}
              <div className="relative z-10 max-w-[200px] sm:max-w-[240px]">
                <p className="text-[11px] sm:text-xs font-semibold text-[#A5A7A3] uppercase tracking-[0.22em] leading-relaxed">
                  SOME POSSIBILITIES <br />
                  ARE WORTH EXPLORING AGAIN.
                </p>
              </div>

              {/* Planet sphere with glowing horizon */}
              <div className="absolute -right-16 -top-10 -bottom-10 w-64 sm:w-72 rounded-full overflow-hidden pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80"
                  alt="Planet from orbit"
                  className="w-full h-full object-cover brightness-[0.9] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0E] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEARCH & FILTER CONTROLS BAR                             */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A7A3]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search realities, paths, industries..."
              aria-label="Search saved universes"
              className="w-full bg-[#0B0D0E]/90 border border-[#292C2C] focus:border-[#C8E9A9] focus-visible:ring-1 focus-visible:ring-[#C8E9A9] rounded-full pl-9 pr-4 py-2 text-xs text-[#F2F3F0] placeholder:text-[#A5A7A3]/60 outline-none transition-colors shadow-inner"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {[
              { id: "all", label: "All Realities" },
              { id: "original", label: "Original" },
              { id: "alternative", label: "Alternative" },
              { id: "bookmarked", label: "Bookmarked" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFilter(f.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  selectedFilter === f.id
                    ? "bg-[#C8E9A9] text-[#050505] font-bold shadow-[0_0_10px_rgba(200,233,169,0.3)]"
                    : "bg-[#0B0D0E]/80 border border-[#292C2C] text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#383b3b]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARDS GRID (3 Columns × 2 Rows matching reference UI)    */}
        {/* ======================================================== */}
        {paginatedUniverses.length === 0 ? (
          <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-12 text-center shadow-xl backdrop-blur-md">
            <Database size={32} className="text-[#C8E9A9] mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-[#F2F3F0] mb-1">
              No Universes Found
            </h3>
            <p className="text-xs text-[#A5A7A3] max-w-sm mx-auto mb-5 leading-relaxed">
              {searchQuery
                ? `No timelines matched "${searchQuery}". Try a different search term or clear filters.`
                : isArchivePage
                ? "No bookmarked universes yet. Click the bookmark icon on any universe card to add it to your archive."
                : "You haven't generated any alternate realities yet. Start exploring turning points to build your library."}
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs shadow-md hover:bg-[#d8f5be] transition-colors"
            >
              <Sparkles size={14} /> Create a Universe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedUniverses.map((uni, idx) => {
              const branchesCount =
                uni.realities && uni.realities.length > 0
                  ? uni.realities.length
                  : 1;

              const isOriginal =
                uni.status === "original" || idx === 0 && !uni.status;

              const badgeColor = uni.badgeColor || (isOriginal ? "sage" : idx % 2 === 0 ? "blue" : "purple");

              const thumbnail =
                uni.image ||
                uni.realities?.[0]?.image ||
                "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80";

              const displayTitle =
                uni.title ||
                uni.realities?.[0]?.name ||
                uni.originalDecision ||
                "Alternate Timeline";

              const displayPath =
                uni.pathText ||
                (uni.realities?.[0]
                  ? `${uni.category || "Career"} → ${uni.realities[0].career || uni.realities[0].name}`
                  : `${uni.category || "Career"} → Exploration`);

              const dateString = formatDate(uni.createdAt);

              return (
                <div
                  key={uni.id || idx}
                  className="bg-[#0B0D0E]/90 border border-[#292C2C] hover:border-[#3d4040] rounded-2xl p-4.5 transition-all duration-300 shadow-xl flex flex-col justify-between group relative"
                >
                  {/* Card Upper Half */}
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      {/* Left Square Thumbnail */}
                      <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-xl overflow-hidden bg-black/60 border border-white/5 shrink-0 relative group-hover:scale-[1.02] transition-transform duration-300">
                        <img
                          src={thumbnail}
                          alt={displayTitle}
                          className="w-full h-full object-cover brightness-[0.8] contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0">
                        {/* Top Row: Badge + More Options Button */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          {isOriginal ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141a15] border border-[#C8E9A9]/20 text-[#C8E9A9] text-[9px] font-bold tracking-wider uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                              ORIGINAL
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                                badgeColor === "purple"
                                  ? "bg-[#181520] border-[#9678C9]/30 text-[#9678C9]"
                                  : badgeColor === "blue"
                                  ? "bg-[#121820] border-[#78a9c9]/30 text-[#78a9c9]"
                                  : "bg-[#141a15] border-[#C8E9A9]/20 text-[#C8E9A9]"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  badgeColor === "purple"
                                    ? "bg-[#9678C9]"
                                    : badgeColor === "blue"
                                    ? "bg-[#78a9c9]"
                                    : "bg-[#C8E9A9]"
                                }`}
                              />
                              ALTERNATIVE
                            </span>
                          )}

                          <button
                            aria-label="More actions"
                            onClick={() => navigate(`/explore/${uni.id}`)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:bg-white/[0.04] transition-colors"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-[#F2F3F0] group-hover:text-white transition-colors truncate leading-snug">
                          {displayTitle}
                        </h3>

                        {/* Subtitle / Path */}
                        <p className="text-[11px] text-[#A5A7A3] truncate mt-0.5 font-medium leading-relaxed">
                          {displayPath}
                        </p>

                        {/* Meta: Date & Branch Count */}
                        <div className="flex items-center gap-3 mt-2 text-[10px] sm:text-[11px] text-[#A5A7A3]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-[#A5A7A3]" />
                            <span>{dateString}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GitBranch size={11} className="text-[#A5A7A3]" />
                            <span>
                              {branchesCount}{" "}
                              {branchesCount === 1 ? "Branch" : "Branches"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#292C2C]/50 gap-2">
                    {/* Left: Explore Again Button */}
                    <button
                      onClick={() => navigate(`/explore/${uni.id}`)}
                      className="px-3.5 py-1.5 rounded-full bg-[#0B0D0E] hover:bg-[#141618] border border-[#292C2C] hover:border-[#C8E9A9]/60 text-xs text-[#F2F3F0] font-semibold flex items-center gap-1.5 transition-all shadow-sm group/btn"
                    >
                      <Play
                        size={10}
                        className="fill-[#C8E9A9] text-[#C8E9A9] group-hover/btn:scale-110 transition-transform"
                      />
                      <span>Explore Again</span>
                    </button>

                    {/* Right: Compare, Bookmark, Delete Icons */}
                    <div className="flex items-center gap-1.5">
                      {/* Compare Button */}
                      <button
                        onClick={() => navigate("/compare")}
                        aria-label="Compare realities"
                        className="w-7 h-7 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-[#292C2C] hover:border-[#C8E9A9]/40 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
                      >
                        <Scale size={13} />
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(uni.id)}
                        aria-label={
                          uni.bookmarked ? "Remove bookmark" : "Bookmark universe"
                        }
                        className={`w-7 h-7 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border transition-colors flex items-center justify-center ${
                          uni.bookmarked
                            ? "border-[#C8E9A9]/50 text-[#C8E9A9]"
                            : "border-[#292C2C] text-[#A5A7A3] hover:text-[#F2F3F0]"
                        }`}
                      >
                        <Bookmark
                          size={13}
                          className={uni.bookmarked ? "fill-[#C8E9A9]" : ""}
                        />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setUniverseToDelete(uni)}
                        aria-label="Delete universe"
                        className="w-7 h-7 rounded-full bg-white/[0.03] hover:bg-red-500/10 border border-[#292C2C] hover:border-red-500/40 flex items-center justify-center text-[#A5A7A3] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM NAVIGATION & TIP BAR                              */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.04]">
          {/* Left Tip */}
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B0D0E]/90 hover:bg-[#141618] border border-[#292C2C] hover:border-[#C8E9A9]/40 text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-all group"
          >
            <Lightbulb
              size={13}
              className="text-[#C8E9A9] group-hover:scale-110 transition-transform"
            />
            <span>Tip: Generate more universes to discover even more possibilities.</span>
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Right Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="w-8 h-8 rounded-full bg-[#0B0D0E] border border-[#292C2C] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }).map((_, pIdx) => {
                const pageNum = pIdx + 1;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0B0D0E] border border-[#C8E9A9] text-[#C8E9A9] shadow-[0_0_8px_rgba(200,233,169,0.3)]"
                        : "bg-[#0B0D0E]/70 border border-[#292C2C] text-[#A5A7A3] hover:text-[#F2F3F0]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
                className="w-8 h-8 rounded-full bg-[#0B0D0E] border border-[#292C2C] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Speculative fiction disclaimer */}
        <p className="text-[10px] text-center text-[#A5A7A3]/60 pt-4">
          All universes, timelines, and outcomes are AI-generated speculative fiction and do not guarantee future predictions.
        </p>
      </div>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      <Modal
        open={Boolean(universeToDelete)}
        onClose={() => setUniverseToDelete(null)}
        title="Delete Universe"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/20 border border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#A5A7A3] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-[#F2F3F0]">
                "{universeToDelete?.title || universeToDelete?.originalDecision}"
              </span>
              ? All child realities, branch points, and simulations will be removed from local memory.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setUniverseToDelete(null)}
              className="px-4 py-2 rounded-full border border-[#292C2C] bg-[#08090A] hover:bg-[#121416] text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              Delete Universe
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
