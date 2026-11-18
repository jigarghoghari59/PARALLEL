// src/components/landing/LandingFooter.jsx
import React from "react";
import HalftoneWordmarkFooter from "../ui/halftone-wordmark-footer";

export const LandingFooter = () => {
  const footerColumns = [
    {
      title: "Exploration",
      links: [
        { label: "Explore Universes", href: "/explore" },
        { label: "Create Reality", href: "/create" },
        { label: "Branch Comparison", href: "/compare" },
        { label: "Saved Timelines", href: "/saved" },
        { label: "Temporal Archive", href: "/archive" },
      ],
    },
    {
      title: "Community & Signals",
      links: [
        { label: "GitHub Community", href: "https://github.com", external: true },
        { label: "Discord Server", href: "https://discord.com", external: true },
        { label: "X / Twitter", href: "https://x.com", external: true },
        { label: "System Settings", href: "/settings" },
      ],
    },
  ];

  return (
    <div className="relative w-full z-10">
      {/* Top Hairline Curve Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/35 to-transparent pointer-events-none z-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-[#C8E9A9]/[0.03] to-transparent blur-3xl pointer-events-none z-20" />

      <HalftoneWordmarkFooter
        wordmark="PARALLEL"
        label="PARALLEL"
        meta="One Life. Infinite Possibilities. · ©2026"
        columns={footerColumns}
        preset="parallel"
        palette={{
          background: "#050505",
          ink: "#F2F3F0",
          warm: "#C8E9A9",
        }}
        dotGap={6}
        radius={95}
        crop={0.24}
        grain={0.4}
        interactive={true}
        height="540px"
        className="border-t border-white/[0.06]"
      />
    </div>
  );
};

export default LandingFooter;
