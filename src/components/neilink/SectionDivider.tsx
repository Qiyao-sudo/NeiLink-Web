"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useReducedMotion from "./useReducedMotion";

interface SectionDividerProps {
  variant?: "wave" | "gradient" | "dots";
  flip?: boolean;
}

function WaveDivider({ flip }: { flip: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "32px" }}
    >
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{
          transform: flip ? "scaleY(-1)" : "none",
        }}
      >
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="30%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="70%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 16 C200 4, 400 28, 600 16 C800 4, 1000 28, 1200 16 L1200 32 L0 32 Z"
          fill="url(#wave-grad)"
          className="wave-drift"
        />
      </svg>
    </div>
  );
}

function GradientDivider() {
  return (
    <div className="flex items-center justify-center" style={{ height: "2px" }}>
      <div
        className="w-full"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--primary) 30%, var(--primary) 70%, transparent)",
          opacity: 0.25,
        }}
      />
    </div>
  );
}

function DotsDivider({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-3"
      style={{ height: "16px" }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: "var(--primary)",
            opacity: 0.35,
            animation: reducedMotion
              ? "none"
              : `dot-pulse 2s ease-in-out infinite ${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SectionDivider({
  variant = "wave",
  flip = false,
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      className="w-full py-2"
    >
      {variant === "wave" && <WaveDivider flip={flip} />}
      {variant === "gradient" && <GradientDivider />}
      {variant === "dots" && <DotsDivider reducedMotion={reducedMotion} />}
    </motion.div>
  );
}
