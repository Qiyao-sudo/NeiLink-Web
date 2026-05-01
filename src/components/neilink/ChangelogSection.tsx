"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ExternalLink, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

const SKY = "#38bdf8";

const VERSION_ACCENTS = ["#34d399", "#a78bfa", "#f59e0b", "#2dd4bf"];

function TimelineEntry({
  version,
  label,
  date,
  description,
  features,
  accent,
  index,
  totalVersions,
  nextAccent,
  isInView,
}: {
  version: string;
  label: string;
  date: string;
  description: string;
  features: string[];
  accent: string;
  index: number;
  totalVersions: number;
  nextAccent?: string;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  /** Update --mouse-x / --mouse-y CSS custom properties for spotlight effect */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
      className="relative flex gap-5 sm:gap-6 pb-10 last:pb-0"
    >
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0">
        {/* Dot */}
        <div className="relative z-10">
          <div
            className="w-4 h-4 rounded-full border-[3px]"
            style={{
              borderColor: accent,
              background: index === 0 ? accent : "#09090b",
              boxShadow: index === 0 ? `0 0 12px ${accent}40` : "none",
            }}
          />
          {/* Pulse ring for latest */}
          {index === 0 && (
            <div
              className="absolute inset-0 w-4 h-4 rounded-full animate-ping"
              style={{ background: `${accent}20`, animationDuration: "2s" }}
            />
          )}
        </div>
        {/* Line segment (invisible for last item, handled by GSAP) */}
        {index < totalVersions - 1 && nextAccent && (
          <div
            className="timeline-segment w-[2px] flex-1 mt-1 origin-top"
            style={{ background: `linear-gradient(180deg, ${accent}30, ${nextAccent}15)` }}
          />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 min-w-0 pb-2">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="glass-card spotlight-card rounded-xl p-5 sm:p-6 transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
        >
          {/* Version + date row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span
              className="text-lg sm:text-xl font-bold"
              style={{ color: accent }}
            >
              {version}
            </span>
            {label && (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: `${accent}15`,
                  color: accent,
                  border: `1px solid ${accent}25`,
                }}
              >
                {label}
              </span>
            )}
            <span className="text-themed-muted text-sm">
              {date}
            </span>
          </div>

          {/* Description */}
          <p className="text-themed-secondary text-sm sm:text-base font-medium mb-4">
            {description}
          </p>

          {/* Feature bullets */}
          <ul className="space-y-2">
            {features.map((feature, fi) => (
              <li key={fi} className="flex items-start gap-2.5">
                <ChevronRight
                  size={14}
                  className="shrink-0 mt-[3px]"
                  style={{ color: `${accent}80` }}
                />
                <span className="text-themed-secondary text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function ChangelogSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || !timelineLineRef.current) return;

    // Animate the main timeline line growing downward
    gsap.fromTo(
      timelineLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.2,
        ease: "power2.out",
        transformOrigin: "top center",
      }
    );

    // Animate each timeline segment
    const segments = sectionRef.current?.querySelectorAll(".timeline-segment");
    segments?.forEach((seg, i) => {
      gsap.fromTo(
        seg,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.5,
          delay: 0.6 + i * 0.2,
          ease: "power2.out",
          transformOrigin: "top center",
        }
      );
    });
  }, [isInView]);

  return (
    <section
      id="changelog"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Floating orb backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[rgba(56,189,248,0.015)] rounded-full blur-[120px]"
          style={{ animation: "floatOrb0 24s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[rgba(167,139,250,0.015)] rounded-full blur-[100px]"
          style={{ animation: "floatOrb1 20s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[rgba(245,158,11,0.01)] rounded-full blur-[80px]"
          style={{ animation: "floatOrb2 18s ease-in-out infinite" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-6"
            style={{
              background: "rgba(56, 189, 248, 0.08)",
              color: SKY,
              border: "1px solid rgba(56, 189, 248, 0.15)",
            }}
          >
            {t.changelog.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.changelog.title1}</span>
            <span className="text-themed-primary">{t.changelog.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-xl mx-auto text-base sm:text-lg">
            {t.changelog.description}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Main vertical timeline line */}
          <div
            ref={timelineLineRef}
            className="absolute left-[7px] top-0 bottom-0 w-[2px] origin-top"
            style={{
              background: `linear-gradient(180deg, ${SKY}20, rgba(255,255,255,0.03))`,
            }}
          />

          {/* Timeline entries */}
          {t.changelog.versions.map((entry, index) => (
            <TimelineEntry
              key={entry.version}
              version={entry.version}
              label={entry.label}
              date={entry.date}
              description={entry.description}
              features={entry.features}
              accent={VERSION_ACCENTS[index % VERSION_ACCENTS.length]}
              index={index}
              totalVersions={t.changelog.versions.length}
              nextAccent={VERSION_ACCENTS[(index + 1) % VERSION_ACCENTS.length]}
              isInView={isInView}
            />
          ))}
        </div>

        {/* "查看全部更新" link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10 sm:mt-14"
        >
          <a
            href="https://github.com/Qiyao-sudo/NeiLink/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group"
            style={{ color: SKY }}
          >
            {t.changelog.viewAll}
            <ExternalLink
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>

        {/* GitHub Star callout card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-14"
        >
          <div
            className="glass-card rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
            style={{ borderColor: "rgba(245, 158, 11, 0.12)" }}
          >
            {/* Subtle amber glow behind */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-[rgba(245,158,11,0.03)] rounded-full blur-[60px]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star size={20} className="text-[#f59e0b]" fill="#f59e0b" />
                <h3 className="text-lg sm:text-xl font-bold text-themed-primary">
                  {t.changelog.starTitle}
                </h3>
              </div>
              <p className="text-themed-secondary text-sm sm:text-base max-w-md mx-auto mb-5">
                {t.changelog.starDescription}
              </p>
              <a
                href="https://github.com/Qiyao-sudo/NeiLink"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#09090b",
                  boxShadow: "0 4px 20px rgba(245, 158, 11, 0.2)",
                }}
              >
                <Star size={16} />
                {t.changelog.starBtn}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
