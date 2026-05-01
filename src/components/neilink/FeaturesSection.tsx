"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  FolderOpen,
  Lock,
  QrCode,
  Smartphone,
  Settings,
  BarChart3,
  Wifi,
  FileCode,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import TextReveal from "./TextReveal";
import { useI18n } from "@/i18n";

// Multi-accent feature palette — genuinely different colors, not teal variants
const FEATURE_META: { icon: LucideIcon; color: string }[] = [
  { icon: FolderOpen, color: "#34d399" }, // emerald
  { icon: Lock, color: "#a78bfa" }, // violet
  { icon: QrCode, color: "#fb923c" }, // orange
  { icon: Smartphone, color: "#2dd4bf" }, // teal
  { icon: Settings, color: "#f59e0b" }, // amber
  { icon: BarChart3, color: "#fb7185" }, // rose
  { icon: Wifi, color: "#38bdf8" }, // sky — ok for accent, not primary
  { icon: FileCode, color: "#c084fc" }, // purple
];

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  learnMore: string;
}

function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Update CSS custom properties for spotlight effect
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    // Cancel any pending animation frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Use requestAnimationFrame for performance
    rafRef.current = requestAnimationFrame(() => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Max tilt of 6 degrees, subtle and professional
      const maxTilt = 6;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      setTiltStyle({ rotateX, rotateY });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Reset tilt smoothly
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
      style={{ perspective: "800px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group rounded-2xl overflow-hidden cursor-pointer feature-card-glow spotlight-card"
        style={{
          background: "var(--card-bg)",
          border: isHovered ? `1px solid ${feature.color}30` : "1px solid var(--card-border)",
          transform: isHovered
            ? `rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease-out, border-color 0.4s ease, box-shadow 0.4s ease",
          willChange: "transform",
          boxShadow: isHovered
            ? `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${feature.color}08`
            : "none",
        }}
      >
        {/* Mouse follow glow */}
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: mousePos.x - 150,
            top: mousePos.y - 150,
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${feature.color}10 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            borderRadius: "50%",
          }}
        />

        {/* Shimmer sweep overlay */}
        <div className="tilt-shimmer-overlay" />

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${feature.color}08, transparent, ${feature.color}05)`,
            border: `1px solid ${feature.color}20`,
            borderRadius: "16px",
          }}
        />

        <div className="relative p-6 sm:p-8" style={{ transform: "translateZ(20px)" }}>
          {/* Icon with pulse/bounce on hover */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 icon-pulse-on-hover"
            style={{ background: `${feature.color}10`, border: `1px solid ${feature.color}18` }}
          >
            <feature.icon size={22} style={{ color: feature.color }} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-themed-primary mb-3 group-hover:text-[#fafafa] dark:group-hover:text-[#fafafa] transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-themed-secondary leading-relaxed group-hover:text-themed-primary transition-colors duration-300">
            {feature.desc}
          </p>

          {/* Arrow */}
          <div className="mt-4 flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" style={{ color: feature.color }}>
            <span>{feature.learnMore}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const features: FeatureItem[] = FEATURE_META.map((meta, i) => ({
    icon: meta.icon,
    color: meta.color,
    title: t.features.items[i].title,
    desc: t.features.items[i].description,
    learnMore: t.features.learnMore,
  }));

  const statItems = [
    { value: "AES-256", color: "#a78bfa" },
    { value: "3+", color: "#2dd4bf" },
    { value: "0", color: "#34d399" },
    { value: "∞", color: "#f59e0b" },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(255,255,255,0.01)] rounded-full blur-[120px] pointer-events-none" />
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[300px] h-[300px] -top-20 -left-20 rounded-full bg-[rgba(167,139,250,0.015)] blur-[80px]" data-parallax="0.15" style={{ animation: "floatOrb0 20s ease-in-out infinite" }} />
        <div className="absolute w-[400px] h-[400px] top-1/2 -right-20 rounded-full bg-[rgba(52,211,153,0.01)] blur-[100px]" data-parallax="-0.1" style={{ animation: "floatOrb1 25s ease-in-out infinite" }} />
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
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="section-badge mb-6"
            style={{ background: "rgba(167, 139, 250, 0.05)", color: "#a78bfa", borderLeftColor: "#a78bfa", borderRight: "1px solid rgba(167, 139, 250, 0.15)", borderTop: "1px solid rgba(167, 139, 250, 0.15)", borderBottom: "1px solid rgba(167, 139, 250, 0.15)" }}
          >
            {t.features.badge}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <TextReveal text={t.features.title1} mode="word" className="gradient-text" />
            <TextReveal text={t.features.title2} mode="word" className="text-themed-primary" />
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.features.description}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8"
        >
          {statItems.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl glass-card">
              <div className="text-2xl sm:text-3xl font-bold mb-1 stat-gradient">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-themed-muted">{t.features.stats[i].label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
