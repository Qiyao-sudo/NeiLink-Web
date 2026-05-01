"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Zap, Star } from "lucide-react";
import { useI18n } from "@/i18n";

/* ─── Animated counter hook ─── */
function useCountUp(target: number, isActive: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || target === 0) return;

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, isActive, duration]);

  // When target is 0, just return 0 (no animation needed)
  return target === 0 ? 0 : count;
}

/* ─── Slot Machine Digit ─── */
function SlotDigit({ digit, delay, isActive }: { digit: string; delay: number; isActive: boolean }) {
  const digitValue = parseInt(digit, 10);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    if (!isActive) {
      // Reset to show digit 0 at top
      el.style.transform = "translateY(0)";
      el.classList.remove("animating");
      return;
    }

    // Set the target translateY value (each digit row is 1.1em tall)
    const targetEm = -(digitValue * 1.1);
    el.style.setProperty("--slot-target", `${targetEm}em`);
    el.style.animationDelay = `${delay}s`;

    // Remove and re-add animation class to restart
    el.classList.remove("animating");
    void el.offsetWidth;
    el.classList.add("animating");

    const handleAnimationEnd = () => {
      el.classList.remove("animating");
      el.style.transform = `translateY(${targetEm}em)`;
      el.style.filter = "blur(0px)";
    };
    el.addEventListener("animationend", handleAnimationEnd);

    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [isActive, digitValue, delay]);

  return (
    <span className="slot-digit-container">
      <div ref={innerRef} className="slot-digit-inner">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} style={{ height: "1.1em", lineHeight: "1.1em", display: "block" }}>{d}</span>
        ))}
      </div>
    </span>
  );
}

/* ─── Stat Item ─── */
function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  isActive,
  delay,
  loading = false,
  useSlotMachine = false,
}: {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
  isActive: boolean;
  delay: number;
  loading?: boolean;
  useSlotMachine?: boolean;
}) {
  const count = useCountUp(value, isActive);

  // Build the number display based on mode
  const numberDisplay = (() => {
    if (loading) {
      return (
        <span className="inline-block w-20 h-9 rounded-md animate-pulse" style={{ background: `${color}15` }} />
      );
    }
    if (useSlotMachine && value > 0 && isActive) {
      // Slot machine mode: each digit rolls independently
      const digits = String(value).split("");
      return (
        <span className="inline-flex items-baseline">
          {digits.map((d, i) => (
            <SlotDigit
              key={i}
              digit={d}
              delay={i * 0.12}
              isActive={isActive}
            />
          ))}
        </span>
      );
    }
    if (value === 0) {
      return <span style={{ color }}>{count}</span>;
    }
    return <span>{count}</span>;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center gap-2"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-1"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-themed-primary tracking-tight">
        {numberDisplay}
        {!loading && (
          <span className="text-lg sm:text-xl font-medium text-themed-secondary">{suffix}</span>
        )}
      </div>
      <span className="text-sm text-themed-secondary">{label}</span>
    </motion.div>
  );
}

/* ─── Trust Badge ─── */
function TrustBadge({
  icon,
  text,
  accent,
  delay,
}: {
  icon: string;
  text: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-xl px-5 py-3 flex items-center gap-2.5 transition-all duration-300 hover:scale-105"
      style={{ borderColor: `${accent}15` }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-themed-primary whitespace-nowrap">{text}</span>
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: accent, boxShadow: `0 0 6px ${accent}40` }}
      />
    </motion.div>
  );
}

/* ─── Tech Stack Badge ─── */
const TECH_BADGES = [
  { name: "Electron", color: "#47848f" },
  { name: "Node.js", color: "#339933" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "AES-256", color: "#a78bfa" },
  { name: "HTTP", color: "#f59e0b" },
  { name: "WebSocket", color: "#fb923c" },
];

function TechStackBadges() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mb-16"
    >
      {/* Scrollable on mobile, wrapped on desktop */}
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="flex sm:flex-wrap justify-start sm:justify-center gap-2 min-w-max sm:min-w-0 pb-2 sm:pb-0">
          {TECH_BADGES.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: `${badge.color}08`,
                border: `1px solid ${badge.color}18`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: badge.color, boxShadow: `0 0 4px ${badge.color}50` }}
              />
              <span className="text-[10px] font-medium" style={{ color: `${badge.color}cc` }}>
                {badge.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating Achievement Badge ─── */
function FloatingBadge({
  text,
  icon,
  rotate,
  className,
  delay,
}: {
  text: string;
  icon: string;
  rotate: number;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`absolute pointer-events-none gentle-float ${className}`}
      style={{ "--float-rotate": `${rotate}deg` } as React.CSSProperties}
    >
      <div
        className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-1.5"
        style={{
          transform: `rotate(${rotate}deg)`,
          background: "var(--card-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium text-themed-primary">{text}</span>
      </div>
    </motion.div>
  );
}

/* ─── Mounted state helper (avoids setState-in-effect lint) ─── */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/* ─── Main Section ─── */
export default function TrustSection() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [statsActive, setStatsActive] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [starsLoading, setStarsLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isInView) {
      // Small delay so animation feels intentional
      const timer = setTimeout(() => setStatsActive(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Fetch GitHub stars
  useEffect(() => {
    if (!isMounted) return;
    let cancelled = false;
    async function fetchStars() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setGithubStars(data.stars ?? 0);
          setStarsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setGithubStars(null);
          setStarsLoading(false);
        }
      }
    }
    fetchStars();
    return () => { cancelled = true; };
  }, [isMounted]);

  return (
    <section id="trust" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-[10%] w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.04), transparent 70%)",
            filter: "blur(80px)",
            animation: "floatOrb0 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-[15%] w-[250px] h-[250px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.03), transparent 70%)",
            filter: "blur(60px)",
            animation: "floatOrb1 25s ease-in-out infinite",
          }}
        />
      </div>

      {/* Floating achievement badges */}
      <FloatingBadge
        text={t.trust.mitLicense}
        icon="📜"
        rotate={5}
        className="top-16 right-[8%] sm:right-[12%] hidden sm:block"
        delay={0.8}
      />
      <FloatingBadge
        text={t.trust.version}
        icon="🏷️"
        rotate={-3}
        className="bottom-24 left-[6%] sm:left-[10%] hidden sm:block"
        delay={1.0}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
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
              background: "rgba(52, 211, 153, 0.08)",
              color: "#34d399",
              border: "1px solid rgba(52, 211, 153, 0.15)",
            }}
          >
            {t.trust.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-themed-primary">{t.trust.title1}</span>{" "}
            <span className="gradient-text">{t.trust.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.trust.description}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-16">
          <StatItem
            icon={Star}
            value={githubStars ?? 0}
            suffix={starsLoading ? "" : (githubStars !== null ? ` ${t.trust.stars}` : ` ${t.trust.starsFallback}`)}
            label={starsLoading ? t.trust.loading : (githubStars !== null ? `GitHub ${t.trust.stars}` : t.trust.starsFallback)}
            color="#f59e0b"
            isActive={statsActive && !starsLoading}
            delay={0}
            loading={starsLoading}
            useSlotMachine
          />
          <StatItem
            icon={Zap}
            value={50}
            suffix="MB/s"
            label={t.trust.speed}
            color="#f59e0b"
            isActive={statsActive}
            delay={0.15}
            useSlotMachine
          />
          <StatItem
            icon={Shield}
            value={0}
            suffix=""
            label={t.trust.leaks}
            color="#34d399"
            isActive={statsActive}
            delay={0.3}
          />
        </div>

        {/* Trust badges row */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          <TrustBadge icon="🔒" text={t.trust.badges[0].aes} accent="#a78bfa" delay={0.1} />
          <TrustBadge icon="🌐" text={t.trust.badges[1].openSource} accent="#2dd4bf" delay={0.2} />
          <TrustBadge icon="🏠" text={t.trust.badges[2].local} accent="#f59e0b" delay={0.3} />
          <TrustBadge icon="🛡️" text={t.trust.badges[3].zeroLeak} accent="#34d399" delay={0.4} />
        </div>

        {/* Tech stack badges row */}
        <TechStackBadges />

        {/* Quote / testimonial — with animated gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="rotating-gradient-border rounded-2xl relative">
            <div className="relative p-8 sm:p-10 rounded-2xl" style={{ background: "var(--card-bg)" }}>
              {/* Decorative quote marks */}
              <span
                className="absolute top-4 left-6 text-5xl sm:text-6xl font-serif leading-none select-none"
                style={{ color: "rgba(52, 211, 153, 0.12)" }}
              >
                &ldquo;
              </span>
              <span
                className="absolute bottom-4 right-6 text-5xl sm:text-6xl font-serif leading-none select-none"
                style={{ color: "rgba(52, 211, 153, 0.12)" }}
              >
                &rdquo;
              </span>

              <p
                className="text-lg sm:text-xl italic leading-relaxed mb-4"
                style={{
                  background: "linear-gradient(135deg, #fafafa, #34d399, #5eead4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.trust.quote}
              </p>
              <p className="text-sm text-themed-muted">{t.trust.quoteAttribution}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
