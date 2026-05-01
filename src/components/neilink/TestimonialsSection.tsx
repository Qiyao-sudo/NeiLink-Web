"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/i18n";

/* ─── Accent border colors (alternating) ─── */
const ACCENT_COLORS = ["#fb7185", "#2dd4bf", "#a78bfa", "#f59e0b", "#34d399", "#38bdf8"];

/* ─── Determine how many cards to show per viewport (sync external store) ─── */
function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getCardsPerPageSnapshot() {
  const w = window.innerWidth;
  if (w < 640) return 1;       // mobile
  if (w < 1024) return 2;     // tablet
  return 3;                    // desktop
}

function getServerSnapshot() {
  return 3;
}

function useCardsPerPage() {
  return useSyncExternalStore(subscribeToResize, getCardsPerPageSnapshot, getServerSnapshot);
}

/* ─── Total pages ─── */
function totalPages(perPage: number, total: number) {
  return Math.ceil(total / perPage);
}

/* ─── Single testimonial card ─── */
function TestimonialCard({
  name,
  role,
  quote,
  accentColor,
  index,
}: {
  name: string;
  role: string;
  quote: string;
  accentColor: string;
  index: number;
}) {
  const firstChar = name.charAt(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="relative glass-card rounded-2xl overflow-hidden h-full flex"
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full h-full flex rounded-2xl"
        style={{
          transform: isHovered ? "rotateX(2deg)" : "rotateX(0deg)",
          transition: "transform 0.3s ease-out, border-color 0.4s ease",
          border: `1px solid ${isHovered ? accentColor + "30" : "var(--card-border)"}`,
          borderRadius: "16px",
        }}
      >
      {/* Left accent border */}
      <div
        className="w-1 flex-shrink-0 rounded-l-2xl"
        style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}60)` }}
      />

      <div className="flex-1 p-6 sm:p-8 flex flex-col">
        {/* Quote icon with scale effect on hover */}
        <Quote
          size={24}
          className="mb-4 flex-shrink-0 transition-transform duration-300"
          style={{
            color: accentColor,
            opacity: isHovered ? 0.5 : 0.3,
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Quote text */}
        <p className="text-themed-secondary text-sm sm:text-base leading-relaxed flex-1 mb-6">
          {quote}
        </p>

        {/* Bottom row: avatar + name + stars */}
        <div className="flex items-center justify-between gap-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-themed-primary"
              style={{
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                border: `1px solid ${accentColor}30`,
              }}
            >
              {firstChar}
            </div>
            <div className="min-w-0">
              <p className="text-themed-primary text-sm font-medium truncate">{name}</p>
              <p className="text-themed-muted text-xs truncate">{role}</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex gap-0.5 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill="#f59e0b"
                className="text-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function TestimonialsSection() {
  const { t } = useI18n();
  const items = t.testimonials.items;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const perPage = useCardsPerPage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = totalPages(perPage, items.length);

  // Auto-rotate every 5 seconds
  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || !isInView) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, isInView, goToNext]);

  // Clamp current page when perPage changes
  const effectivePage = Math.min(currentPage, total - 1);

  // Get testimonials for current page
  const startIdx = effectivePage * perPage;
  const visibleTestimonials = items.slice(startIdx, startIdx + perPage);

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Floating orb background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-[5%] w-[350px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251,113,133,0.04), transparent 70%)",
            filter: "blur(80px)",
            animation: "floatOrb0 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/3 right-[10%] w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.03), transparent 70%)",
            filter: "blur(70px)",
            animation: "floatOrb1 28s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.02), transparent 70%)",
            filter: "blur(90px)",
            animation: "floatOrb2 25s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-6"
            style={{
              background: "rgba(251, 113, 133, 0.08)",
              color: "#fb7185",
              border: "1px solid rgba(251, 113, 133, 0.15)",
            }}
          >
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.testimonials.title1}</span>
            <span className="text-themed-primary">{t.testimonials.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.testimonials.description}
          </p>
        </motion.div>

        {/* Carousel / Grid of testimonial cards */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={effectivePage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {visibleTestimonials.map((testimonial, i) => {
                const globalIndex = startIdx + i;
                return (
                  <TestimonialCard
                    key={globalIndex}
                    name={testimonial.name}
                    role={testimonial.role}
                    quote={testimonial.quote}
                    accentColor={ACCENT_COLORS[globalIndex % ACCENT_COLORS.length]}
                    index={i}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className="relative w-8 h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fb7185] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
              aria-label={t.testimonials.pageAriaLabel.replace('{page}', String(i + 1))}
              style={{
                background:
                  i === effectivePage
                    ? "linear-gradient(90deg, #fb7185, #fb718580)"
                    : "rgba(255, 255, 255, 0.08)",
              }}
            >
              {i === effectivePage && (
                <motion.div
                  layoutId="testimonial-dot"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #fb7185, #fb718580)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
