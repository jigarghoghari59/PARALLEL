// src/components/landing/UniverseCarousel.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const UniverseCarousel = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Five oversized curated universe cards with realistic imagery
  const cards = [
    {
      id: "u-tech-pioneer",
      title: "The Tech Pioneer",
      subtitle: "Build a life in technology",
      tag: "Career",
      image: "/images/carousel-tech-pioneer.png",
      fallbackImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      description: "Leading deep tech and quantum hardware engineering across global innovation hubs.",
    },
    {
      id: "u-space-explorer",
      title: "The Space Explorer",
      subtitle: "Reach for the stars",
      tag: "Adventure",
      featured: true,
      image: "/images/carousel-space-explorer.png",
      fallbackImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      description: "Orbital mission architect and deep-space habitat pioneer on humanity's frontier.",
    },
    {
      id: "u-peaceful-life",
      title: "The Peaceful Life",
      subtitle: "Find happiness within",
      tag: "Lifestyle",
      image: "/images/carousel-peaceful-life.png",
      fallbackImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",
      description: "A restorative sanctuary in high mountain valleys centered on quiet craft and clarity.",
    },
    {
      id: "u-global-nomad",
      title: "The Global Nomad",
      subtitle: "See the world",
      tag: "Success",
      image: "/images/carousel-global-nomad.png",
      fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      description: "Borderless international consultancy operating seamlessly across thirty capital cities.",
    },
    {
      id: "u-oceanic-frontier",
      title: "The Deep Frontier",
      subtitle: "Pioneer the ocean depths",
      tag: "Frontier",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      description: "Sub-surface ecological habitats and bio-luminescent marine energy research.",
    },
  ];

  // GSAP ScrollTrigger Pinned Horizontal Scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      return -(trackWidth - window.innerWidth + 120);
    };

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(1600, track.scrollWidth - window.innerWidth + 400)}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      return () => {
        tween.kill();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  // Manual Previous/Next Controls (smooth programmatic scrolling)
  const handleScrollStep = (direction) => {
    if (!sectionRef.current) return;
    const scrollTriggerInstance = ScrollTrigger.getById(sectionRef.current);
    const scrollStep = window.innerHeight * 0.45 * direction;
    window.scrollBy({ top: scrollStep, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-20 min-h-screen flex flex-col justify-center bg-[#050505] overflow-hidden select-none py-12"
    >
      {/* Top Header Row inside the pinned section */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 mb-8 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8E9A9]">
                Explore Universes
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#F2F3F0] leading-none">
              Step into Different Possibilities
            </h2>
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors group cursor-pointer"
            >
              <span>View All Universes</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScrollStep(-1)}
                aria-label="Previous card"
                className="w-9 h-9 rounded-full bg-white/[0.03] hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/[0.1] hover:border-[#C8E9A9] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handleScrollStep(1)}
                aria-label="Next card"
                className="w-9 h-9 rounded-full bg-white/[0.03] hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/[0.1] hover:border-[#C8E9A9] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track Driven by Vertical Scroll */}
      <div className="w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 sm:gap-8 px-4 sm:px-6 lg:px-12 w-max"
        >
          {cards.map((card, idx) => {
            const isFeatured = card.featured;

            return (
              <div
                key={card.id}
                onClick={() => navigate(`/explore?search=${encodeURIComponent(card.title)}`)}
                className={`relative group cursor-pointer rounded-2xl bg-[#090b0d] border transition-all duration-300 overflow-hidden flex flex-col justify-between shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
                  isFeatured
                    ? "w-[340px] sm:w-[440px] lg:w-[480px] border-[#C8E9A9]/40 hover:border-[#C8E9A9]/70"
                    : "w-[300px] sm:w-[380px] lg:w-[420px] border-white/[0.1] hover:border-white/25"
                }`}
              >
                {/* Top specular hairline */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />

                {/* Card Image Area with Controlled Proportions */}
                <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] overflow-hidden bg-black/60">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover brightness-[0.8] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = card.fallbackImage;
                    }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b0d] via-transparent to-black/30" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505]/90 border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                    <span className="text-[10px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
                      {card.tag}
                    </span>
                  </div>
                </div>

                {/* Card Text & Metadata Footer */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#090b0d]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-tight group-hover:text-white transition-colors mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#C8E9A9] mb-3 tracking-wide">
                      {card.subtitle}
                    </p>
                    <p className="text-xs text-[#A5A7A3] font-normal leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] text-[#A5A7A3] font-mono uppercase tracking-wider">
                      Explore Timeline
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] group-hover:bg-[#C8E9A9] group-hover:text-[#050505] group-hover:border-[#C8E9A9] flex items-center justify-center text-white/80 transition-all duration-300">
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thin Horizontal Scroll Indicator Line */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 mt-6">
        <div className="w-full h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C8E9A9] transition-all duration-150"
            style={{ width: `${Math.max(15, scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
