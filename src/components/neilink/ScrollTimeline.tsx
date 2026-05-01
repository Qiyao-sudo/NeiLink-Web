"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import useReducedMotion from "./useReducedMotion";

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "hero", label: "首页" },
  { id: "features", label: "功能" },
  { id: "how-it-works", label: "原理" },
  { id: "security", label: "安全" },
  { id: "trust", label: "信赖" },
  { id: "cross-platform", label: "跨平台" },
  { id: "architecture", label: "架构" },
  { id: "comparison", label: "对比" },
  { id: "screenshots", label: "截图" },
  { id: "faq", label: "问答" },
  { id: "changelog", label: "日志" },
  { id: "testimonials", label: "评价" },
  { id: "live-demo", label: "演示" },
  { id: "download", label: "下载" },
];

export default function ScrollTimeline() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [visitedIndex, setVisitedIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const reducedMotion = useReducedMotion();

  // IntersectionObserver to track active section
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

  // Track visited index and progress via scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setProgress(pct);

      // Determine visited index based on which sections have been scrolled past
      let maxVisited = -1;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.5) {
            maxVisited = i;
            break;
          }
        }
      }
      setVisitedIndex(maxVisited);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const activeIdx = SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut", delay: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center"
      aria-label="阅读进度时间线"
    >
      {/* Timeline dots and lines */}
      <div className="relative flex flex-col items-center" style={{ gap: 0 }}>
        {SECTIONS.map((section, idx) => {
          const isActive = activeSection === section.id;
          const isVisited = idx <= visitedIndex;
          const isHovered = hoveredDot === section.id;

          return (
            <div key={section.id} className="flex flex-col items-center">
              {/* Dot button with tooltip */}
              <div className="relative flex items-center">
                {/* Tooltip — appears to the RIGHT of the dot */}
                {isHovered && (
                  <span
                    className="absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-secondary)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    {section.label}
                    {/* Small arrow pointing left (toward the dot) */}
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -left-[5px] w-0 h-0"
                      style={{
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderRight: "5px solid var(--card-border)",
                      }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -left-[4px] w-0 h-0"
                      style={{
                        borderTop: "4px solid transparent",
                        borderBottom: "4px solid transparent",
                        borderRight: "4px solid var(--card-bg)",
                      }}
                    />
                  </span>
                )}

                {/* Dot button */}
                <button
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setHoveredDot(section.id)}
                  onMouseLeave={() => setHoveredDot(null)}
                  className="relative flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full group"
                  style={{
                    width: isActive ? "20px" : "16px",
                    height: isActive ? "20px" : "16px",
                  }}
                  aria-label={section.label}
                  aria-current={isActive ? "true" : undefined}
                >
                  {/* Glow ring for active */}
                  {isActive && !reducedMotion && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        background: "rgba(45, 212, 191, 0.3)",
                        animationDuration: "2s",
                      }}
                    />
                  )}

                  {/* Dot core */}
                  <span
                    className="relative z-10 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? "8px" : "6px",
                      height: isActive ? "8px" : "6px",
                      backgroundColor: isActive
                        ? "#2dd4bf"
                        : isVisited
                          ? "rgba(45, 212, 191, 0.4)"
                          : "transparent",
                      border: isActive
                        ? "none"
                        : `1px solid ${isVisited ? "rgba(45, 212, 191, 0.4)" : "rgba(255, 255, 255, 0.15)"}`,
                      boxShadow: isActive
                        ? "0 0 8px rgba(45, 212, 191, 0.4), 0 0 16px rgba(45, 212, 191, 0.15)"
                        : "none",
                    }}
                  />
                </button>
              </div>

              {/* Connecting line (not after the last dot) */}
              {idx < SECTIONS.length - 1 && (
                <div
                  className="relative"
                  style={{ width: "1px", height: "18px" }}
                >
                  {/* Default line */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                    }}
                  />
                  {/* Visited portion */}
                  {isVisited && (
                    <div
                      className="absolute top-0 left-0 right-0"
                      style={{
                        height: idx < activeIdx ? "100%" : "50%",
                        background:
                          "linear-gradient(180deg, rgba(45, 212, 191, 0.6), rgba(45, 212, 191, 0.2))",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div
        className="mt-3 text-[10px] font-mono font-medium tracking-wide"
        style={{
          color: "var(--text-muted)",
          transition: "color 0.3s ease",
        }}
        aria-label={`阅读进度 ${progress}%`}
      >
        {progress}%
      </div>
    </motion.div>
  );
}
