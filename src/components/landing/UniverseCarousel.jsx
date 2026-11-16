// src/components/landing/UniverseCarousel.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Compass } from "lucide-react";

export const UniverseCarousel = ({ customUniverses = [] }) => {
  const navigate = useNavigate();
  const carouselContainerRef = useRef(null);

  // Default curated universes matching the reference design cards exactly
  const defaultItems = [
    {
      id: "u-tech-pioneer",
      title: "The Tech Pioneer",
      subtitle: "Build a life in technology",
      tag: "Career",
      image: "/images/carousel-tech-pioneer.png",
      fallbackImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      coherence: 94,
      timelineYear: "Year 8",
      decision: "What if I pursued robotics & quantum computing early?",
    },
    {
      id: "u-space-explorer",
      title: "The Space Explorer",
      subtitle: "Reach for the stars",
      tag: "Adventure",
      image: "/images/carousel-space-explorer.png",
      fallbackImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      coherence: 98,
      timelineYear: "Year 12",
      decision: "What if I joined the lunar orbital program?",
    },
    {
      id: "u-peaceful-life",
      title: "The Peaceful Life",
      subtitle: "Find happiness within",
      tag: "Lifestyle",
      image: "/images/carousel-peaceful-life.png",
      fallbackImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",
      coherence: 89,
      timelineYear: "Year 6",
      decision: "What if I moved to a quiet mountain sanctuary?",
    },
    {
      id: "u-global-nomad",
      title: "The Global Nomad",
      subtitle: "See the world",
      tag: "Success",
      image: "/images/carousel-global-nomad.png",
      fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      coherence: 92,
      timelineYear: "Year 10",
      decision: "What if I lived across 30 countries without a permanent base?",
    },
  ];

  // Merge with custom universes if provided
  const items = defaultItems;

  const [activeIndex, setActiveIndex] = useState(1); // Default to centered card (The Space Explorer)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleCardClick = (index, item) => {
    if (activeIndex === index) {
      navigate(`/explore?search=${encodeURIComponent(item.title)}`);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section className="relative z-10 py-16 lg:py-24 px-4 sm:px-6 lg:px-12 select-none overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8E9A9]">
                Explore Universes
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#F2F3F0]">
              Step into Different Possibilities
            </h2>
          </div>

          {/* Right Header Link & Controls */}
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors group cursor-pointer"
            >
              <span>View All Universes</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Prev / Next Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous universe"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/10 hover:border-[#C8E9A9] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next universe"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/10 hover:border-[#C8E9A9] flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Grid / Horizontal Track */}
        <div
          ref={carouselContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={item.id}
                onClick={() => handleCardClick(index, item)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between h-[340px] sm:h-[380px] border transition-all duration-500 shadow-xl ${
                  isActive
                    ? "border-[#C8E9A9]/70 shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_30px_rgba(200,233,169,0.18)] scale-[1.02]"
                    : "border-white/[0.1] hover:border-white/30 bg-[#07090b]"
                }`}
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.88]"
                    onError={(e) => {
                      e.currentTarget.src = item.fallbackImage;
                    }}
                  />
                  {/* Cinematic Dark Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/30 pointer-events-none" />
                </div>

                {/* Top Specular Reflection Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none" />

                {/* Top Card Badge: Tag */}
                <div className="relative z-10 p-5 flex items-center justify-between">
                  {isActive ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8E9A9]/20 border border-[#C8E9A9]/40 backdrop-blur-md text-[10.5px] font-bold uppercase tracking-wider text-[#C8E9A9]">
                      <Sparkles size={11} />
                      Featured Reality
                    </span>
                  ) : (
                    <div />
                  )}

                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white tracking-wide">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 p-5 pt-0 mt-auto">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#C8E9A9] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#A5A7A3] font-normal mt-0.5 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Circular Action Arrow Button */}
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isActive
                          ? "bg-[#C8E9A9] text-[#050505] border-[#C8E9A9] scale-110 shadow-[0_0_12px_rgba(200,233,169,0.5)]"
                          : "bg-white/10 group-hover:bg-[#C8E9A9] text-white group-hover:text-[#050505] border-white/20 group-hover:border-[#C8E9A9]"
                      }`}
                    >
                      <ArrowRight size={13} className="stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Dots Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Jump to universe ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
