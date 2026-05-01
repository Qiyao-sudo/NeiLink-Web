"use client";

import { useRef, useEffect, useCallback, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Download, Apple, Monitor, Terminal, Github, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "./ToastNotification";
import { useI18n } from "@/i18n";

// ─── Version badge data (client-side fetch with useSyncExternalStore) ─────────

const emptySubscribe = () => () => {};

function useLatestVersion() {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      // client snapshot — read from module-level cache
      return versionCache;
    },
    () => "v1.0.0" // server snapshot
  );
}

let versionCache = "v1.0.0";

if (typeof window !== "undefined") {
  fetch("/api/github")
    .then((r) => r.json())
    .then((data: { latestVersion?: string }) => {
      if (data.latestVersion) versionCache = data.latestVersion;
    })
    .catch(() => {});
}

// ─── VersionBadge Component ──────────────────────────────────────────────

function VersionBadge() {
  const version = useLatestVersion();
  return (
    <span
      className="inline-flex items-center gap-1 ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium align-middle"
      style={{
        background: "var(--hover-bg-strong)",
        border: "1px solid var(--card-border-hover)",
        color: "var(--text-secondary)",
      }}
    >
      <Sparkles size={10} className="text-[#f59e0b]" />
      {version}
    </span>
  );
}

// Each platform gets its own color identity
const DOWNLOAD_OPTIONS = [
  {
    platform: "Windows",
    icon: Monitor,
    version: "v1.0.0",
    size: "65 MB",
    ext: ".exe",
    color: "#2dd4bf", // teal
    recommended: true,
  },
  {
    platform: "macOS",
    icon: Apple,
    version: "v1.0.0",
    size: "72 MB",
    ext: ".dmg",
    color: "#a78bfa", // violet
    recommended: false,
  },
  {
    platform: "Linux",
    icon: Terminal,
    version: "v1.0.0",
    size: "58 MB",
    ext: ".AppImage",
    color: "#fb923c", // orange
    recommended: false,
  },
];

// Particle burst component for click effect
function ParticleBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 20 + Math.random() * 30;
    return {
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle-dot"
          style={{
            left: x,
            top: y,
            background: color,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ["rgba(45, 212, 191,", "rgba(167, 139, 250,", "rgba(251, 146, 60,", "rgba(52, 211, 153,"];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        color: colors[i % colors.length],
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections — neutral
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function DownloadCard({
  option,
  index,
  onDownloadClick,
  platformData,
  recommendedLabel,
  downloadInstallLabel,
}: {
  option: (typeof DOWNLOAD_OPTIONS)[0];
  index: number;
  onDownloadClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  platformData: { version: string; size: string; ext: string };
  recommendedLabel: string;
  downloadInstallLabel: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; color: string; id: number }[]>([]);
  const particleIdRef = useRef(0);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const tiltRafRef = useRef<number>(0);
  const rippleTimeoutRef = useRef<number>(0);
  const MAX_TILT = 4; // degrees

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * MAX_TILT * 2;
    const rotateX = (0.5 - y) * MAX_TILT * 2;

    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        // Subtle inner shadow that shifts with tilt
        const shadowX = rotateY * 1.5;
        const shadowY = rotateX * 1.5;
        cardRef.current.style.boxShadow = `inset ${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.2)`;
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = "translateY(0) perspective(800px) rotateX(0deg) rotateY(0deg)";
      cardRef.current.style.boxShadow = "";
    }
  }, []);

  const handleRipple = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100) + "%";
    const y = ((e.clientY - rect.top) / rect.height * 100) + "%";
    el.style.setProperty("--ripple-x", x);
    el.style.setProperty("--ripple-y", y);
    el.classList.remove("ripple-active");
    void el.offsetWidth;
    el.classList.add("ripple-active");
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = window.setTimeout(() => {
      el.classList.remove("ripple-active");
    }, 600);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Get click position relative to the card
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add particle burst
    const id = ++particleIdRef.current;
    setParticles((prev) => [...prev, { x, y, color: option.color, id }]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 700);

    onDownloadClick(e);
  }, [onDownloadClick, option.color]);

  return (
    <motion.a
      ref={cardRef}
      key={option.platform}
      href="https://github.com/Qiyao-sudo/NeiLink/releases"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseDown={handleRipple}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative group p-6 rounded-2xl overflow-hidden cursor-pointer ripple-container ${option.recommended ? "breathing-glow" : ""}`}
      style={{
        background: "rgba(20, 20, 26, 0.5)",
        border: option.recommended ? `1px solid ${option.color}20` : "1px solid rgba(255,255,255,0.05)",
        // Border glow pulse on hover
        animation: isHovered ? "border-glow-pulse 2s ease-in-out infinite" : "none",
        ["--glow-color" as string]: `${option.color}30`,
        transform: "translateY(0) perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.3s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer bar at top */}
      <div
        className="shimmer-bar rounded-t-2xl"
        style={{ "--shimmer-bar-color": `${option.color}60` } as React.CSSProperties}
      />

      {/* Recommended badge */}
      {option.recommended && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${option.color}15`, color: option.color }}>
          <Sparkles size={10} />
          {recommendedLabel}
        </div>
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${option.color}06, transparent 70%)` }}
      />

      {/* Particle bursts */}
      {particles.map((p) => (
        <ParticleBurst key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}

      <div className="relative" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 icon-bounce-on-hover"
          style={{ background: `${option.color}0a`, border: `1px solid ${option.color}15` }}
        >
          <option.icon size={24} style={{ color: option.color }} />
        </div>

        <h3 className="text-lg font-semibold text-themed-primary mb-1">{option.platform}</h3>
        <p className="text-xs text-[rgba(255,255,255,0.35)] mb-4">{platformData.version} · {platformData.size} · {platformData.ext}</p>

        <div
          className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
          style={{ color: option.color }}
        >
          <Download size={16} />
          <span>{downloadInstallLabel}</span>
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.a>
  );
}

export default function DownloadSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ctaRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isInView || !ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, [isInView]);

  const handleDownloadClick = useCallback(() => {
    showToast("info", t.download.toastRedirect);
  }, [showToast, t.download.toastRedirect]);

  return (
    <section id="download" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <ParticleField />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden"
          >
            <img src="/logo.png" alt="NeiLink" className="w-full h-full object-contain p-1" />
          </motion.div>
          <span
            className="section-badge mb-6"
            style={{ background: "rgba(245, 158, 11, 0.05)", color: "#f59e0b", borderLeftColor: "#f59e0b", borderRight: "1px solid rgba(245, 158, 11, 0.15)", borderTop: "1px solid rgba(245, 158, 11, 0.15)", borderBottom: "1px solid rgba(245, 158, 11, 0.15)" }}
          >
            {t.download.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-themed-primary">{t.download.title1}</span>
            <span className="gradient-text">{t.download.title2}</span>
            <VersionBadge />
          </h2>
          <p className="text-[rgba(255,255,255,0.5)] max-w-xl mx-auto text-base sm:text-lg">
            {t.download.description}
          </p>
        </motion.div>

        {/* Download cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12" ref={ctaRef} style={{ opacity: 0 }}>
          {DOWNLOAD_OPTIONS.map((option, index) => (
            <DownloadCard
              key={option.platform}
              option={option}
              index={index}
              onDownloadClick={handleDownloadClick}
              platformData={t.download.platforms[index]}
              recommendedLabel={t.download.recommended}
              downloadInstallLabel={t.download.downloadInstall}
            />
          ))}
        </div>

        {/* Additional links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
        >
          <a
            href="https://github.com/Qiyao-sudo/NeiLink"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all"
          >
            <Github size={16} />
            <span>{t.download.viewSource}</span>
          </a>
          <a
            href="https://github.com/Qiyao-sudo/NeiLink/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[rgba(255,255,255,0.55)] hover:text-[#a78bfa] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(167,139,250,0.15)] transition-all"
          >
            <span>{t.download.allVersions}</span>
            <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* System requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 text-center text-xs text-[rgba(255,255,255,0.18)]"
        >
          {t.download.systemRequirements}
        </motion.div>
      </div>
    </section>
  );
}
