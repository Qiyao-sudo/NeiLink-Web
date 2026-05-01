"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useReducedMotion from "./useReducedMotion";
import { useI18n } from "@/i18n";

export default function ScrollVelocityBar() {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [height, setHeight] = useState(3);
  const reducedMotion = useReducedMotion();

  const rafRef = useRef<number>(0);
  const lastScrollYRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const velocityDecayRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const now = performance.now();
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(Math.min(scrollPercent, 100));

      // When reduced motion is preferred, skip all velocity-based effects
      if (reducedMotion) return;

      // Calculate velocity using timestamps and scroll positions
      if (lastTimestampRef.current > 0) {
        const dt = now - lastTimestampRef.current;
        if (dt > 0) {
          const distance = Math.abs(scrollTop - lastScrollYRef.current);
          const instantVelocity = (distance / dt) * 1000; // px/s

          // Smooth velocity with exponential moving average
          const alpha = 0.3;
          velocityDecayRef.current =
            alpha * instantVelocity +
            (1 - alpha) * velocityDecayRef.current;

          const smoothedVelocity = velocityDecayRef.current;

          // Height: 3px slow, 4px fast
          setHeight(smoothedVelocity >= 800 ? 4 : 3);
        }
      }

      lastScrollYRef.current = scrollTop;
      lastTimestampRef.current = now;
    });
  }, [reducedMotion]);

  useEffect(() => {
    velocityDecayRef.current = 0;
    lastScrollYRef.current = window.scrollY;
    lastTimestampRef.current = performance.now();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Decay velocity when not scrolling (only needed for non-reduced-motion)
  useEffect(() => {
    if (reducedMotion) return;

    const decayInterval = setInterval(() => {
      velocityDecayRef.current *= 0.9;
      if (velocityDecayRef.current < 1) {
        velocityDecayRef.current = 0;
        setHeight(3);
      } else {
        setHeight(velocityDecayRef.current >= 800 ? 4 : 3);
      }
    }, 100);

    return () => clearInterval(decayInterval);
  }, [reducedMotion]);

  // Static teal color when reduced motion, gradient when normal
  const barColor = reducedMotion
    ? "#2dd4bf"
    : undefined;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t.scrollVelocity.text}
    >
      <div
        className={`h-full will-change-[width] transition-[width] duration-100 ease-out ${reducedMotion ? "" : "scroll-velocity-bar"}`}
        style={{
          width: `${progress}%`,
          background: barColor ?? undefined,
          transition: reducedMotion
            ? "none"
            : "width 100ms ease-out, background-color 0.5s ease, height 0.3s ease",
          boxShadow: "none",
        }}
      />
    </div>
  );
}
