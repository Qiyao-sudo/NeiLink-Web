"use client";

import { useRef, useEffect } from "react";
import useReducedMotion from "./useReducedMotion";

interface FloatingOrbsProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export default function FloatingOrbs({
  count = 3,
  colors = ["#2dd4bf", "#a78bfa", "#f59e0b"],
  className = "",
}: FloatingOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    if (reducedMotion) return; // No animation when reduced motion

    const orbs = containerRef.current.querySelectorAll(".floating-orb");
    orbs.forEach((orb, i) => {
      const el = orb as HTMLElement;
      const speed = 15 + i * 5;
      const offset = i * 120;
      el.style.animation = `floatOrb${i % 3} ${speed}s ease-in-out infinite ${offset}ms`;
    });
  }, [reducedMotion]);

  // When reduced motion is preferred, don't render the orbs at all
  if (reducedMotion) return null;

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="floating-orb absolute rounded-full"
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            left: `${10 + i * 30}%`,
            top: `${20 + i * 15}%`,
            background: `radial-gradient(circle, ${colors[i % colors.length]}05, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes floatOrb0 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(-20px, 30px); }
          75% { transform: translate(20px, 20px); }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-25px, 25px); }
          50% { transform: translate(30px, -15px); }
          75% { transform: translate(-15px, -20px); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, 15px); }
          50% { transform: translate(-30px, 20px); }
          75% { transform: translate(15px, -25px); }
        }
      `}</style>
    </div>
  );
}
