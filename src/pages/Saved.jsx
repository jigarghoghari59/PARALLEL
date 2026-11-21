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
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  GitFork,
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

  return (
    <div className="relative min-h-dvh bg-paper text-ink overflow-x-hidden select-none pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 select-none">
        {/* TOP HEADER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Title Block (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-rule w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
              <span className="text-xs font-medium text-ink">
                {isArchivePage ? "Bookmarked archive" : "Multiverse archive"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {isArchivePage ? (
                <>
                  Multiverse <span className="text-accent">archive</span>
                </>
              ) : (
                <>
                  Saved <span className="text-accent">universes</span>
                </>
              )}
            </h1>

            <p className="text-sm text-muted font-normal leading-relaxed max-w-lg">
              {isArchivePage
                ? "Your bookmarked turning points and high-priority alternate timelines."
                : "Revisit your explored realities, branch points, and divergent life journeys."}
            </p>
          </div>

          {/* Right Inset Banner (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-32 sm:h-36 rounded-card overflow-hidden flex items-center justify-between p-5 border border-rule bg-card">
              <div className="relative z-10 max-w-xs">
                <p className="text-xs font-semibold text-accent mb-0.5">
                  Reflection
                </p>
                <p className="text-xs sm:text-sm font-medium text-ink leading-snug">
                  Some possibilities are worth exploring again.
                </p>
              </div>

              {/* Sphere visual */}
              <div className="absolute -right-12 -top-8 -bottom-8 w-56 rounded-full overflow-hidden pointer-events-none opacity-40">
                <img
                  src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=85"
                  alt="Planet from orbit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search realities, paths, industries…"
              aria-label="Search saved universes"
              className="w-full bg-surface border border-rule focus:border-accent rounded-full pl-9 pr-4 py-2 text-xs text-ink placeholder:text-muted outline-none transition-colors focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {[
              { id: "all", label: "All realities" },
              { id: "original", label: "Original" },
              { id: "alternative", label: "Alternative" },
              { id: "bookmarked", label: "Bookmarked" },
            ].map((f) => {
              const active = selectedFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFilter(f.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    active
                      ? "bg-accent text-accent-ink font-semibold"
                      : "bg-surface text-muted hover:text-ink border border-rule hover:border-rule/80"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CARDS GRID */}
        {paginatedUniverses.length === 0 ? (
          <div className="rounded-card p-10 text-center bg-card border border-rule">
            <Database size={32} className="text-accent mx-auto mb-3 opacity-80" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-ink mb-1">
              No universes found
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-5 leading-relaxed">
              {searchQuery
                ? `No timelines matched "${searchQuery}". Try a different search term or clear filters.`
                : isArchivePage
                ? "No bookmarked universes yet. Click the bookmark icon on any universe card to add it to your archive."
                : "You have not generated any alternate realities yet. Start exploring turning points to build your library."}
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <GitFork size={13} className="stroke-[2.5]" aria-hidden="true" /> Create a universe
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
                uni.status === "original" || (idx === 0 && !uni.status);

              const badgeColor = uni.badgeColor || (isOriginal ? "sage" : "purple");

              const thumbnail =
                uni.image ||
                uni.realities?.[0]?.image ||
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=85";

              const displayTitle =
                uni.title ||
                uni.realities?.[0]?.name ||
                uni.originalDecision ||
                "Alternate timeline";

              const displayPath =
                uni.pathText ||
                (uni.realities?.[0]
                  ? `${uni.category || "Career"} : ${uni.realities[0].career || uni.realities[0].name}`
                  : `${uni.category || "Career"} : Exploration`);

              const dateString = formatDate(uni.createdAt);

              return (
                <div
                  key={uni.id || idx}
                  className="rounded-card p-4 transition-colors duration-150 flex flex-col justify-between group relative overflow-hidden bg-card border border-rule hover:border-rule/80"
                >
                  {/* Card Upper Half */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      {/* Left Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-paper-3 border border-rule shrink-0 relative">
                        <img
                          src={thumbnail}
                          alt={displayTitle}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0">
                        {/* Top Row: Badge + More Options Button */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          {isOriginal ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              Original
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                badgeColor === "purple"
                                  ? "bg-purple/10 border-purple/30 text-purple"
                                  : "bg-accent/10 border-accent/30 text-accent"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  badgeColor === "purple"
                                    ? "bg-purple"
                                    : "bg-accent"
                                }`}
                              />
                              Alternative
                            </span>
                          )}

                          <button
                            aria-label="More actions"
                            onClick={() => navigate(`/explore/${uni.id}`)}
                            className="w-6 h-6 rounded-full bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                          >
                            <MoreHorizontal size={13} aria-hidden="true" />
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-bold text-ink truncate leading-snug">
                          {displayTitle}
                        </h3>

                        {/* Subtitle / Path */}
                        <p className="text-[11px] text-muted truncate mt-0.5 leading-relaxed">
                          {displayPath}
                        </p>

                        {/* Meta: Date & Branch Count */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                          <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-muted" aria-hidden="true" />
                            <span>{dateString}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch size={11} className="text-muted" aria-hidden="true" />
                            <span>
                              {branchesCount}{" "}
                              {branchesCount === 1 ? "branch" : "branches"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action Row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-rule gap-2">
                    {/* Left: Explore Button */}
                    <button
                      onClick={() => navigate(`/explore/${uni.id}`)}
                      className="px-3 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs text-ink font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <Play
                        size={10}
                        className="fill-accent text-accent"
                        aria-hidden="true"
                      />
                      <span>Explore again</span>
                    </button>

                    {/* Right: Compare, Bookmark, Delete Icons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate("/compare")}
                        aria-label="Compare realities"
                        className="w-7 h-7 rounded-full bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <Scale size={12} aria-hidden="true" />
                      </button>

                      <button
                        onClick={() => toggleBookmark(uni.id)}
                        aria-label={
                          uni.bookmarked ? "Remove bookmark" : "Bookmark universe"
                        }
                        className={`w-7 h-7 rounded-full bg-surface hover:bg-surface/80 active:bg-paper-2 border transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                          uni.bookmarked
                            ? "border-accent/40 text-accent"
                            : "border-rule hover:border-accent/40 text-muted hover:text-ink"
                        }`}
                      >
                        <Bookmark
                          size={12}
                          className={uni.bookmarked ? "fill-accent" : ""}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        onClick={() => setUniverseToDelete(uni)}
                        aria-label="Delete universe"
                        className="w-7 h-7 rounded-full bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-rule/80 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <Trash2 size={12} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM NAVIGATION & TIP BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rule">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-btn bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule hover:border-accent/40 text-xs text-muted hover:text-ink transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Lightbulb
              size={13}
              className="text-accent"
              aria-hidden="true"
            />
            <span>Tip: Generate more universes to discover alternate paths.</span>
            <ArrowRight
              size={12}
              aria-hidden="true"
            />
          </Link>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="w-7 h-7 rounded-full bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronLeft size={13} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }).map((_, pIdx) => {
                const pageNum = pIdx + 1;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-full text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                      isActive
                        ? "bg-accent text-accent-ink font-semibold"
                        : "bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 text-muted hover:text-ink"
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
                className="w-7 h-7 rounded-full bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronRight size={13} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Speculative fiction disclaimer */}
        <p className="text-[11px] text-center text-muted/70 pt-2">
          All universes, timelines, and outcomes are AI-generated speculative fiction and do not guarantee future predictions.
        </p>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        open={Boolean(universeToDelete)}
        onClose={() => setUniverseToDelete(null)}
        title="Delete Universe"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-2.5 p-3 rounded-card bg-surface border border-rule">
            <AlertTriangle size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-muted leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-ink">
                &ldquo;{universeToDelete?.title || universeToDelete?.originalDecision}&rdquo;
              </span>
              ? All child realities, branch points, and simulations will be removed from local storage.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setUniverseToDelete(null)}
              className="px-4 py-2 rounded-btn bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 text-xs text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Delete universe
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
