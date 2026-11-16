// src/pages/LandingPage.jsx
import React, { useRef } from "react";
import { useUniverse } from "../context/UniverseContext";

import { HeroSection } from "../components/landing/HeroSection";
import { StatsStrip } from "../components/landing/StatsStrip";
import { ConceptSection } from "../components/landing/ConceptSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { UniverseCarousel } from "../components/landing/UniverseCarousel";
import { CtaSection } from "../components/landing/CtaSection";

export default function LandingPage() {
  const { universes, stats } = useUniverse();
  const conceptSectionRef = useRef(null);

  const handleLearnMore = () => {
    const conceptElement = document.getElementById("the-concept");
    if (conceptElement) {
      conceptElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full -mt-20 sm:-mt-24 select-none">
      {/* 1. Large Cinematic Hero Section */}
      <HeroSection onLearnMoreClick={handleLearnMore} />

      {/* 2. Statistics Floating Glass Strip */}
      <StatsStrip stats={stats} />

      {/* 3. The Concept / Storytelling Section */}
      <div id="the-concept" ref={conceptSectionRef}>
        <ConceptSection />
      </div>

      {/* 4. How It Works — Three Connected Steps */}
      <HowItWorksSection />

      {/* 5. Explore Parallel Universes — Interactive Carousel */}
      <UniverseCarousel customUniverses={universes} />

      {/* 6. Create Your Universe — Prominent CTA Section */}
      <CtaSection />
    </div>
  );
}
