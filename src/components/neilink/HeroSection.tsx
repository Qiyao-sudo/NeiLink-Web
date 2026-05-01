"use client";

import { useEffect, useRef, useCallback, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Zap, Shield, Wifi, Loader2 } from "lucide-react";
import TerminalBlock from "./TerminalBlock";
import useReducedMotion from "./useReducedMotion";
import { gsap } from "gsap";
import { useI18n } from "@/i18n";

const NetworkScene = lazy(() => import("./NetworkScene"));

/** Subtle loading placeholder for the 3D network scene */
function NetworkSceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 opacity-30">
        <Loader2 size={28} className="text-[#2dd4bf] animate-spin" style={{ animationDuration: "3s" }} />
        <span className="text-[10px] text-themed-muted tracking-widest uppercase">Loading</span>
      </div>
    </div>
  );
}

function FloatingBadge({ icon: Icon, text, delay, color, reducedMotion }: { icon: React.ElementType; text: string; delay: number; color: string; reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reducedMotion ? { duration: 0 } : { delay, duration: 0.8, ease: "easeOut" }}
      className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm"
    >
      <Icon size={14} style={{ color }} />
      <span className="text-themed-primary">{text}</span>
    </motion.div>
  );
}

// Per-character animation — disabled when reduced motion is preferred
function AnimatedTitle({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useI18n();
  const titleText = "NeiLink";
  const subtitleText = t.hero.animatedSubtitle;
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If reduced motion, skip all GSAP character animations — content is shown immediately
    if (reducedMotion) return;

    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".title-char");
    gsap.fromTo(
      chars,
      {
        y: 80,
        opacity: 0,
        rotateX: -90,
        scale: 0.3,
        filter: "blur(12px)",
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08,
        ease: "back.out(1.7)",
        delay: 0.6,
      }
    );

    // Light sweep
    if (shineRef.current) {
      gsap.fromTo(
        shineRef.current,
        { x: "-120%" },
        {
          x: "120%",
          duration: 1.2,
          delay: 1.4,
          ease: "power2.inOut",
        }
      );
    }

    // Subtitle character animation
    const subtitleChars = containerRef.current.querySelectorAll(".subtitle-char");
    gsap.fromTo(
      subtitleChars,
      {
        y: 30,
        opacity: 0,
        filter: "blur(6px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
        delay: 1.2,
      }
    );
  }, [reducedMotion, subtitleText]);

  // When reduced motion, show all characters immediately (no opacity-0)
  if (reducedMotion) {
    return (
      <div ref={containerRef} className="relative inline-block">
        <div className="relative">
          <span
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold tracking-tight leading-none"
          >
            {titleText.split("").map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  background: i < 3
                    ? "linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 40%, var(--text-muted) 100%)"
                    : "linear-gradient(135deg, #5eead4 0%, #2dd4bf 50%, #14b8a6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  filter: `drop-shadow(0 0 ${i === 0 ? "20px" : "12px"} rgba(45, 212, 191, 0.2))`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </div>

        {/* Subtitle */}
        <div className="mt-4 sm:mt-6">
          <span
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wide hero-subtitle-gradient"
          >
            {subtitleText.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  color: char === " " ? "transparent" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* NeiLink title */}
      <div className="relative">
        <span
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold tracking-tight leading-none"
          style={{ perspective: "800px" }}
        >
          {titleText.split("").map((char, i) => (
            <span
              key={i}
              className="title-char inline-block opacity-0"
              style={{
                background: i < 3
                  ? "linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 40%, var(--text-muted) 100%)"
                  : "linear-gradient(135deg, #5eead4 0%, #2dd4bf 50%, #14b8a6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: `drop-shadow(0 0 ${i === 0 ? "20px" : "12px"} rgba(45, 212, 191, 0.2))`,
              }}
            >
              {char}
            </span>
          ))}
        </span>

        {/* Light sweep layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            width: "60%",
            transform: "translateX(-120%)",
          }}
        />
      </div>

      {/* Subtitle */}
      <div className="mt-4 sm:mt-6">
        <span
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wide hero-subtitle-gradient"
          style={{ perspective: "600px" }}
        >
          {subtitleText.split("").map((char, i) => (
            <span
              key={i}
              className="subtitle-char inline-block opacity-0"
              style={{
                color: char === " " ? "transparent" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useI18n();
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mouseGradientRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  /* ── Magnetic button state (inlined to satisfy react-hooks/refs lint rule) ── */
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);
  const magneticRafRef = useRef<number>(0);
  const [isMagnetized, setIsMagnetized] = useState(false);
  const MAX_MAGNETIC_DISTANCE = 80;
  const MAX_MAGNETIC_DISPLACEMENT = 8;

  /** Magnetic cursor effect: when cursor is within 80px of button center, button follows cursor */
  const handleMagneticMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Disable magnetic effect when reduced motion
      if (reducedMotion) return;
      const btn = magneticBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (magneticRafRef.current) cancelAnimationFrame(magneticRafRef.current);

      magneticRafRef.current = requestAnimationFrame(() => {
        if (distance < MAX_MAGNETIC_DISTANCE) {
          const strength = 1 - distance / MAX_MAGNETIC_DISTANCE;
          const moveX = (distX / MAX_MAGNETIC_DISTANCE) * MAX_MAGNETIC_DISPLACEMENT * strength;
          const moveY = (distY / MAX_MAGNETIC_DISTANCE) * MAX_MAGNETIC_DISPLACEMENT * strength;
          btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
          btn.style.transition = "transform 0.2s ease-out";
          setIsMagnetized(true);
        } else {
          btn.style.transform = "translate(0, 0)";
          btn.style.transition = "transform 0.4s ease-out";
          setIsMagnetized(false);
        }
      });
    },
    [MAX_MAGNETIC_DISTANCE, MAX_MAGNETIC_DISPLACEMENT, reducedMotion]
  );

  const handleMagneticMouseLeave = useCallback(() => {
    if (magneticRafRef.current) cancelAnimationFrame(magneticRafRef.current);
    const btn = magneticBtnRef.current;
    if (btn) {
      btn.style.transform = "translate(0, 0)";
      btn.style.transition = "transform 0.4s ease-out";
    }
    setIsMagnetized(false);
  }, []);

  /* Ripple click effect handler */
  const rippleTimeoutRef = useRef<number>(0);
  const secondaryBtnRef = useRef<HTMLAnchorElement>(null);

  const handleRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
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
  }, [reducedMotion]);

  useEffect(() => {
    // If reduced motion, show subtitle and CTA immediately
    if (reducedMotion) {
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = "1";
      }
      if (ctaRef.current) {
        ctaRef.current.style.opacity = "1";
      }
      return;
    }

    const tl = gsap.timeline({ delay: 1.8 });

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }

    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }
  }, [reducedMotion]);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (!mouseGradientRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseGradientRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-follow gradient — hidden when reduced motion */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ overflow: "hidden" }}
        >
          <div
            ref={mouseGradientRef}
            className="absolute"
            style={{
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%",
              transition: "transform 0.3s ease-out",
              willChange: "transform",
            }}
          />
        </div>
      )}

      {/* 3D Background */}
      <div className="absolute inset-0 three-canvas-container">
        <Suspense fallback={<NetworkSceneLoader />}>
          <NetworkScene />
        </Suspense>
      </div>

      {/* Gradient mesh background — animated blobs hidden when reduced motion */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Teal blob */}
          <div
            className="absolute"
            style={{
              width: "400px",
              height: "400px",
              top: "15%",
              left: "10%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(45, 212, 191, 0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "mesh-float-1 25s ease-in-out infinite",
            }}
          />
          {/* Amber blob */}
          <div
            className="absolute"
            style={{
              width: "350px",
              height: "350px",
              top: "50%",
              right: "10%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "mesh-float-2 30s ease-in-out infinite",
            }}
          />
          {/* Violet blob */}
          <div
            className="absolute"
            style={{
              width: "450px",
              height: "450px",
              bottom: "10%",
              left: "30%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167, 139, 250, 0.03) 0%, transparent 70%)",
              filter: "blur(70px)",
              animation: "mesh-float-3 35s ease-in-out infinite",
            }}
          />
          {/* Second teal blob — subtle, offset */}
          <div
            className="absolute"
            style={{
              width: "300px",
              height: "300px",
              top: "35%",
              left: "55%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(45, 212, 191, 0.03) 0%, transparent 70%)",
              filter: "blur(50px)",
              animation: "mesh-float-4 20s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Gradient overlays — theme-aware */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, var(--section-bg), transparent 30%, transparent 70%, var(--section-bg))` }} />
      <div className="absolute inset-0 radial-gradient-overlay pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Floating badges — each with different color */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <FloatingBadge icon={Zap} text={t.hero.badgeFast} delay={0.8} color="#f59e0b" reducedMotion={reducedMotion} />
          <FloatingBadge icon={Shield} text={t.hero.badgeEncrypted} delay={1.0} color="#a78bfa" reducedMotion={reducedMotion} />
          <FloatingBadge icon={Wifi} text={t.hero.badgeOffline} delay={1.2} color="#2dd4bf" reducedMotion={reducedMotion} />
        </div>

        {/* Animated Title */}
        <h1 className="mb-6">
          <AnimatedTitle reducedMotion={reducedMotion} />
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl text-themed-secondary max-w-2xl mx-auto mb-10 leading-relaxed opacity-0"
        >
          {t.hero.subtitle}
          <br className="hidden sm:block" />
          {t.hero.subtitleLine2}
        </p>

        {/* CTA Buttons — warm amber primary with magnetic effect, teal secondary */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0">
          <motion.a
            ref={magneticBtnRef}
            href="https://github.com/Qiyao-sudo/NeiLink/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl bg-[#f59e0b] text-[#09090b] font-bold text-lg hover:bg-[#fbbf24] transition-colors duration-300 overflow-hidden ripple-container cta-shine-btn"
            whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            onMouseMove={handleMagneticMouseMove}
            onMouseLeave={handleMagneticMouseLeave}
            onMouseDown={handleRipple}
            style={{
              // Inner glow effect when magnetized
              boxShadow: isMagnetized
                ? "inset 0 0 20px rgba(255, 255, 255, 0.2), 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)"
                : "0 4px 15px rgba(245, 158, 11, 0.2), 0 0 30px rgba(245, 158, 11, 0.08)",
              transition: isMagnetized
                ? "transform 0.2s ease-out, box-shadow 0.3s ease-out, background-color 0.3s"
                : "transform 0.4s ease-out, box-shadow 0.3s ease-out, background-color 0.3s",
            }}
          >
            <span className="relative z-10">{t.hero.cta}</span>
            <span className="relative z-10 ml-2">→</span>
          </motion.a>

          <motion.a
            ref={secondaryBtnRef}
            href="https://github.com/Qiyao-sudo/NeiLink"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl btn-secondary-themed font-medium text-lg hover:bg-themed-hover hover:border-themed transition-all duration-300 ripple-container"
            whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            onMouseDown={handleRipple}
          >
            {t.hero.ctaSecondary}
          </motion.a>
        </div>

        {/* Terminal Block — animated CLI demo */}
        <div className="mb-10">
          <TerminalBlock />
        </div>

        {/* Version info */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion ? { duration: 0 } : { delay: 3, duration: 1 }}
          className="text-themed-muted text-sm mb-8"
        >
          {t.hero.version}
        </motion.div>

        {/* Scroll indicator — no bounce when reduced motion */}
        <motion.button
          onClick={scrollToFeatures}
          className="mx-auto flex flex-col items-center gap-2 text-themed-muted hover:text-[#2dd4bf] transition-colors cursor-pointer"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion ? { duration: 0 } : { delay: 3.2 }}
        >
          <span className="text-xs tracking-widest uppercase">{t.hero.scrollDown}</span>
          <motion.div
            animate={reducedMotion ? { y: 0 } : { y: [0, 8, 0] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom gradient fade — theme-aware */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to top, var(--section-bg), transparent)" }} />
    </section>
  );
}
