"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Upload, Link, Download, CheckCircle2, ArrowRight, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n";

// Warm progression: amber → teal → violet → emerald
const STEP_META: { icon: LucideIcon; number: string; color: string }[] = [
  { icon: Upload, number: "01", color: "#f59e0b" },
  { icon: Link, number: "02", color: "#2dd4bf" },
  { icon: Download, number: "03", color: "#a78bfa" },
  { icon: CheckCircle2, number: "04", color: "#34d399" },
];

interface StepItem {
  icon: LucideIcon;
  number: string;
  title: string;
  desc: string;
  color: string;
  detail: string;
}

/* ─── Step Completion Indicator ─── */
function StepCompletionIndicator({
  color,
  delay,
  isInView,
}: {
  color: string;
  delay: number;
  isInView: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [isInView, delay]);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-3 completion-indicator">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6L5 9L10 3"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[11px] font-medium" style={{ color }}>
        {t.howItWorks.completed}
      </span>
    </div>
  );
}

/* ─── SVG Flow Lines (desktop only) ─── */
function FlowLines({ isInView }: { isInView: boolean }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || animated) return;
    const timer = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(timer);
  }, [isInView, animated]);

  // Each segment connects step i to step i+1
  // Colors transition: amber→teal→violet→emerald
  const segments = [
    { from: 0, to: 1, color1: "#f59e0b", color2: "#2dd4bf" },
    { from: 1, to: 2, color1: "#2dd4bf", color2: "#a78bfa" },
    { from: 2, to: 3, color1: "#a78bfa", color2: "#34d399" },
  ];

  // We draw 3 connecting lines between the 4 step columns
  // Each line goes from ~25% to ~75% of its segment width
  // With circles at connection points
  const lineLength = 100; // pixel length for dash calculation

  return (
    <div className="hidden lg:block relative h-8 mt-2">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 32"
        preserveAspectRatio="none"
      >
        <defs>
          {segments.map((seg, i) => (
            <linearGradient key={i} id={`flow-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={seg.color1} stopOpacity="0.4" />
              <stop offset="100%" stopColor={seg.color2} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {segments.map((seg, i) => {
          // Position lines evenly across the 4 columns
          // Each column is 25% wide, lines connect from right edge of col i to left edge of col i+1
          const x1 = (seg.from + 1) * 250 - 20;
          const x2 = (seg.to) * 250 + 20;
          const y = 16;

          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={`url(#flow-grad-${i})`}
                strokeWidth="2"
                strokeDasharray={lineLength}
                strokeDashoffset={animated ? 0 : lineLength}
                style={{
                  transition: `stroke-dashoffset 1s ease-out ${i * 0.3}s`,
                }}
                strokeLinecap="round"
              />
              {/* Connection circles */}
              <circle
                cx={x2}
                cy={y}
                r="4"
                fill={seg.color2}
                opacity={animated ? 0.6 : 0}
                style={{
                  transition: `opacity 0.4s ease-out ${i * 0.3 + 0.8}s`,
                }}
              />
              {/* Pulse ring on circle */}
              {animated && (
                <circle
                  cx={x2}
                  cy={y}
                  r="4"
                  fill="none"
                  stroke={seg.color2}
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    values="4;8;4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Interactive Flow Demonstration ─── */
function FlowDemo() {
  const { t } = useI18n();
  const nodes = [
    { icon: "📤", label: t.howItWorks.flowDemo.sender, color: "#f59e0b" },
    { icon: "🌐", label: t.howItWorks.flowDemo.lan, color: "#2dd4bf" },
    { icon: "📥", label: t.howItWorks.flowDemo.receiver, color: "#34d399" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-12 max-w-md mx-auto"
    >
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <p className="text-xs text-themed-muted text-center mb-5 uppercase tracking-widest">
          {t.howItWorks.flowDemo.title}
        </p>
        <div className="flex items-center justify-between relative">
          {nodes.map((node, i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl"
                style={{
                  background: `${node.color}10`,
                  border: `1px solid ${node.color}20`,
                }}
              >
                {node.icon}
              </div>
              <span
                className="text-[11px] font-medium mt-2"
                style={{ color: `${node.color}cc` }}
              >
                {node.label}
              </span>
            </div>
          ))}

          {/* Connecting lines with pulse */}
          {[0, 1].map((i) => (
            <div
              key={`line-${i}`}
              className="absolute top-6 sm:top-7"
              style={{
                left: i === 0 ? "25%" : "58%",
                width: "17%",
                height: "2px",
              }}
            >
              <div
                className="w-full h-full rounded-full pulse-line"
                style={{
                  background: `linear-gradient(90deg, ${nodes[i].color}40, ${nodes[i + 1].color}40)`,
                }}
              />
              {/* Data packet dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full packet-dot"
                style={{
                  background: nodes[i].color,
                  boxShadow: `0 0 6px ${nodes[i].color}80`,
                  animationDelay: `${i * 1}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({
  step,
  index,
  isInView,
}: {
  step: StepItem;
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isInView || !cardRef.current) return;

    const card = cardRef.current;
    gsap.fromTo(
      card,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
      }
    );

    // Animate the connecting line
    const line = card.querySelector(".step-line") as HTMLElement;
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.6, delay: index * 0.15 + 0.4, ease: "power2.out" }
      );
    }
  }, [isInView, index]);

  return (
    <div className="relative" ref={cardRef} style={{ opacity: 0 }}>
      {/* Connecting line with data-flow animation on hover */}
      {index < STEP_META.length - 1 && (
        <div
          className="step-line hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] origin-left z-10 overflow-hidden"
        >
          {/* Base line */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, ${step.color}25, ${STEP_META[index + 1].color}25)` }}
          />
          {/* Animated data-flow dot */}
          <div
            className="absolute top-0 bottom-0 w-2 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)`,
              opacity: isHovered ? 1 : 0,
              animation: isHovered ? "data-flow-line 1.5s linear infinite" : "none",
            }}
          />
        </div>
      )}

      <div
        className="relative rounded-2xl overflow-hidden group cursor-pointer h-full"
        style={{
          background: "var(--card-bg)",
          border: `1px solid var(--card-border)`,
          transform: isHovered ? "scale(1.03)" : "scale(1)",
          boxShadow: isHovered
            ? `0 12px 40px rgba(0,0,0,0.3), 0 0 15px ${step.color}08`
            : "none",
          transition: "transform 0.3s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }}
        />

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden" style={{ background: `${step.color}08` }}>
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${step.color}40, ${step.color}80)`,
              width: isHovered ? "100%" : "0%",
              transition: "width 0.5s ease-out",
            }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Step number + icon */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: `${step.color}0c`, border: `1px solid ${step.color}18` }}
            >
              <step.icon size={24} style={{ color: step.color }} />
            </div>
            <span
              className="text-5xl font-black transition-opacity"
              style={{
                color: step.color,
                opacity: isHovered ? 0.18 : 0.06,
                animation: isHovered ? "step-number-pulse 1.2s ease-in-out infinite" : "none",
              }}
            >
              {step.number}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-themed-primary mb-3 group-hover:text-[#fafafa] dark:group-hover:text-[#fafafa] transition-colors">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-themed-secondary leading-relaxed mb-4">
            {step.desc}
          </p>

          {/* Detail tags */}
          <div className="flex flex-wrap gap-2">
            {step.detail.split(" · ").map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs"
                style={{ background: `${step.color}08`, color: `${step.color}bb`, border: `1px solid ${step.color}15` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step completion indicator */}
      <StepCompletionIndicator
        color={step.color}
        delay={800 + index * 400}
        isInView={isInView}
      />
    </div>
  );
}

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const steps: StepItem[] = STEP_META.map((meta, i) => ({
    icon: meta.icon,
    number: meta.number,
    color: meta.color,
    title: t.howItWorks.steps[i].title,
    desc: t.howItWorks.steps[i].description,
    detail: t.howItWorks.steps[i].detail,
  }));

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[rgba(245,158,11,0.02)] rounded-full blur-[100px]" data-parallax="0.12" style={{ animation: "floatOrb0 22s ease-in-out infinite" }} />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-[rgba(167,139,250,0.02)] rounded-full blur-[100px]" data-parallax="-0.08" style={{ animation: "floatOrb1 18s ease-in-out infinite" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
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
            style={{ background: "rgba(245, 158, 11, 0.08)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.15)" }}
          >
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-themed-primary">{t.howItWorks.title1}</span>
            <span className="gradient-text">{t.howItWorks.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.howItWorks.description}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Animated SVG flow lines (desktop only) */}
        <FlowLines isInView={isInView} />

        {/* Flow visualization text (existing) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 flex items-center justify-center gap-2 text-themed-muted"
        >
          <span className="text-xs tracking-widest uppercase">{t.howItWorks.flowLabels.sender}</span>
          <ArrowRight size={14} />
          <span className="text-xs tracking-widest uppercase">{t.howItWorks.flowLabels.lan}</span>
          <ArrowRight size={14} />
          <span className="text-xs tracking-widest uppercase">{t.howItWorks.flowLabels.browser}</span>
          <ArrowRight size={14} />
          <span className="text-xs tracking-widest uppercase">{t.howItWorks.flowLabels.receiver}</span>
        </motion.div>

        {/* Interactive flow demonstration */}
        <FlowDemo />
      </div>
    </section>
  );
}
