"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import useReducedMotion from "./useReducedMotion";
import { useI18n } from "@/i18n";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setVisible(scrollPercent > 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer group"
          style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--card-border)",
          }}
          whileHover={reducedMotion ? {} : {
            scale: 1.1,
            borderColor: "rgba(45, 212, 191, 0.3)",
            backgroundColor: "rgba(20, 20, 26, 0.85)",
            transition: { duration: 0.2 },
          }}
          whileTap={reducedMotion ? {} : { scale: 0.95 }}
          aria-label={t.utils.backToTop}
        >
          <ArrowUp
            size={18}
            className="text-themed-secondary group-hover:text-[#2dd4bf] transition-colors duration-200"
          />

          {/* Tooltip */}
          <span
            className="absolute right-full mr-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-secondary)",
            }}
          >
            {t.utils.backToTop}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
