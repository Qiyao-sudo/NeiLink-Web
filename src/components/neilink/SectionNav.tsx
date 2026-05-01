"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion"; // still used for nav container
import useReducedMotion from "./useReducedMotion";
import { useI18n } from "@/i18n";

interface Section {
  id: string;
  i18nKey: string; // key into t.utils.sections
}

const SECTIONS: Section[] = [
  { id: "hero", i18nKey: "hero" },
  { id: "features", i18nKey: "features" },
  { id: "how-it-works", i18nKey: "howItWorks" },
  { id: "security", i18nKey: "security" },
  { id: "trust", i18nKey: "trust" },
  { id: "cross-platform", i18nKey: "crossPlatform" },
  { id: "comparison", i18nKey: "comparison" },
  { id: "screenshots", i18nKey: "screenshots" },
  { id: "faq", i18nKey: "faq" },
  { id: "changelog", i18nKey: "changelog" },
  { id: "testimonials", i18nKey: "testimonials" },
  { id: "live-demo", i18nKey: "liveDemo" },
  { id: "download", i18nKey: "download" },
];

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const reducedMotion = useReducedMotion();
  const { t } = useI18n();

  // IntersectionObserver to detect active section
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: [0.3, 0.5],
    });

    // Observe all sections
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) {
        observerRef.current.observe(el);
      }
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Show/hide based on scroll position — hide when at hero (top)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      setVisible(scrollTop > viewportHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <motion.nav
      initial={reducedMotion ? false : { opacity: 0, x: 20 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3 pointer-events-none"
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-label={t.utils.sectionNav}
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        const sectionLabel = t.utils.sections[section.i18nKey as keyof typeof t.utils.sections];

        return (
          <div key={section.id} className="relative flex items-center">
            {/* Tooltip — appears to the LEFT of the dot */}
            <span
              className="absolute right-full mr-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
                backdropFilter: "blur(12px)",
              }}
            >
              {sectionLabel}
              {/* Small arrow pointing right (toward the dot) */}
              <span
                className="absolute top-1/2 -translate-y-1/2 -right-[5px] w-0 h-0"
                style={{
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderLeft: "5px solid var(--card-border)",
                }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 -right-[4px] w-0 h-0"
                style={{
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: "4px solid var(--card-bg)",
                }}
              />
            </span>

            {/* Dot button */}
            <button
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
              style={{
                width: isActive ? "12px" : "8px",
                height: isActive ? "12px" : "8px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-label={sectionLabel}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Pulse ring for active dot — disabled when reduced motion */}
              {isActive && !reducedMotion && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "rgba(45, 212, 191, 0.4)",
                    animationDuration: "2s",
                  }}
                />
              )}

              {/* Dot core */}
              <span
                className="relative z-10 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? "12px" : "8px",
                  height: isActive ? "12px" : "8px",
                  backgroundColor: isActive ? "#2dd4bf" : "rgba(255, 255, 255, 0.2)",
                }}
              />
            </button>
          </div>
        );
      })}
    </motion.nav>
  );
}
