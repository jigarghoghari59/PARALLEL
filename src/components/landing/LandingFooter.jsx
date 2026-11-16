// src/components/landing/LandingFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const LandingFooter = () => {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/create", label: "Create Reality" },
    { to: "/saved", label: "Saved" },
    { to: "/archive", label: "Archive" },
    { to: "/settings", label: "Settings" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com",
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "Discord",
      href: "https://discord.com",
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com",
      icon: (
        <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative z-10 pt-16 pb-8 px-4 sm:px-6 lg:px-12 select-none overflow-hidden bg-[#050505]">
      {/* Top Hairline Curve Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8E9A9]/35 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#C8E9A9]/[0.025] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          {/* Left: Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2.5 group mb-2">
              <svg viewBox="0 0 40 24" className="w-7 h-4 text-[#F2F3F0]" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="28" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.9" />
                <circle cx="12" cy="12" r="3" fill="#C8E9A9" />
                <circle cx="28" cy="12" r="3" fill="#9678C9" />
              </svg>
              <span className="text-white text-sm font-bold tracking-[0.24em] uppercase">
                PARALLEL
              </span>
            </Link>
            <p className="text-xs text-[#A5A7A3] tracking-wide font-normal">
              One Life. Infinite Possibilities.
            </p>
          </div>

          {/* Center: Navigation Links with Animated Underlines */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A5A7A3]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative py-1 hover:text-white transition-colors duration-200 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8E9A9] scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Right: Social Media Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={s.name}
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/25 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Speculative Fiction Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-[#A5A7A3]/70 font-mono">
          <p>© 2026 PARALLEL. All rights reserved. Multiverse Generative Engine.</p>
          <p className="text-center sm:text-right">
            Built with precision • Speculative fiction exploration
          </p>
        </div>
      </div>
    </footer>
  );
};
