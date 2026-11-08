import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "./TopNav";

export const AppLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#F2F3F0] font-sans antialiased selection:bg-[#C8E9A9] selection:text-[#050505]">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
