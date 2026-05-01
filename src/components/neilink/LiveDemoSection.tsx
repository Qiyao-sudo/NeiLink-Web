"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Monitor,
  Globe,
  Play,
  RotateCcw,
  Download,
  Lock,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import useReducedMotion from "./useReducedMotion";
import { useI18n } from "@/i18n";

/* ─── Types ─── */
type DemoState = "idle" | "preparing" | "transferring" | "complete";
type FileSize = "10" | "50" | "200";

/* ─── Config ─── */
const FILE_SIZES: Record<FileSize, { label: string; speed: string; duration: number }> = {
  "10": { label: "10 MB", speed: "50", duration: 3000 },
  "50": { label: "50 MB", speed: "48", duration: 3500 },
  "200": { label: "200 MB", speed: "45", duration: 4000 },
};

const EMERALD = "#34d399";

/* ─── Animated counter hook ─── */
function useAnimatedValue(target: number, isActive: boolean, duration = 2000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, isActive, duration]);

  return isActive ? value : 0;
}

/* ─── Data Flow Dots Component ─── */
function DataFlowDots({ isActive, reducedMotion }: { isActive: boolean; reducedMotion: boolean }) {
  if (!isActive) return null;

  // When reduced motion is preferred, show a static connection line without animated dots
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${EMERALD}20, ${EMERALD}20, transparent)`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2">
        {/* Base line */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${EMERALD}20, ${EMERALD}20, transparent)`,
          }}
        />
        {/* Pulsing line */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${EMERALD}40, transparent)`,
            animation: "demo-pulse-line 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Traveling dots (data packets) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: EMERALD,
            boxShadow: `0 0 8px ${EMERALD}80, 0 0 20px ${EMERALD}40`,
            animation: `demo-dot-travel 2s linear infinite`,
            animationDelay: `${i * 0.33}s`,
          }}
        />
      ))}

      {/* Glow trail */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-20 h-4 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${EMERALD}30, transparent)`,
          animation: "demo-glow-travel 2s linear infinite",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
}

/* ─── Sender Card ─── */
function SenderCard({
  progress,
  demoState,
  reducedMotion,
}: {
  progress: number;
  demoState: DemoState;
  reducedMotion: boolean;
}) {
  const { t } = useI18n();
  const statusText =
    demoState === "complete" ? t.liveDemo.status.complete :
    demoState === "transferring" ? t.liveDemo.status.transferring :
    demoState === "preparing" ? t.liveDemo.status.connecting :
    t.liveDemo.status.idle;
  return (
    <div className="flex-1 min-w-0">
      <div
        className="glass-card rounded-2xl p-4 sm:p-6 h-full"
        style={{ borderColor: `${EMERALD}15` }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${EMERALD}10`, border: `1px solid ${EMERALD}20` }}
          >
            <Monitor size={14} style={{ color: EMERALD }} />
          </div>
          <span className="text-xs font-medium tracking-wider uppercase" style={{ color: EMERALD }}>
            {t.liveDemo.sender}
          </span>
        </div>

        {/* App mockup */}
        <div
          className="rounded-xl p-3 sm:p-4 mb-4"
          style={{
            background: "var(--hover-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* App title bar */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "#ef444480" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#f59e0b80" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#34d39980" }} />
            <span className="text-[10px] ml-2 text-themed-muted">NeiLink</span>
          </div>

          {/* File being shared */}
          <div
            className="rounded-lg p-3 flex items-center gap-3"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${EMERALD}10`, border: `1px solid ${EMERALD}20` }}
            >
              <FileText size={16} style={{ color: EMERALD }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-themed-primary truncate">{t.liveDemo.fileName}</p>
              <p className="text-[10px] text-themed-muted">{t.liveDemo.fileSize}</p>
            </div>
            <ArrowRight size={12} style={{ color: EMERALD, opacity: 0.5 }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-themed-muted">{t.liveDemo.progress}</span>
            <span className="text-[10px] font-mono" style={{ color: EMERALD }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--hover-bg-strong)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${EMERALD}90, ${EMERALD})`,
                boxShadow: progress > 0 ? `0 0 8px ${EMERALD}40` : "none",
              }}
              animate={{ width: `${progress}%` }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={demoState}
            initial={reducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            {demoState === "complete" ? (
              <CheckCircle2 size={12} style={{ color: EMERALD }} />
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: demoState === "idle" ? "#f59e0b" : EMERALD,
                  animation: demoState === "transferring" && !reducedMotion ? "demo-dot-blink 1s ease-in-out infinite" : "none",
                }}
              />
            )}
            <span className="text-xs text-themed-secondary">{statusText}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Receiver Card ─── */
function ReceiverCard({
  progress,
  demoState,
  isComplete,
  reducedMotion,
}: {
  progress: number;
  demoState: DemoState;
  isComplete: boolean;
  reducedMotion: boolean;
}) {
  const { t } = useI18n();
  const statusText =
    demoState === "complete" ? t.liveDemo.status.receiverComplete :
    demoState === "transferring" ? t.liveDemo.status.receiverTransferring :
    t.liveDemo.status.receiverIdle;
  return (
    <div className="flex-1 min-w-0">
      <div
        className="glass-card rounded-2xl p-4 sm:p-6 h-full"
        style={{ borderColor: `${EMERALD}15` }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${EMERALD}10`, border: `1px solid ${EMERALD}20` }}
          >
            <Globe size={14} style={{ color: EMERALD }} />
          </div>
          <span className="text-xs font-medium tracking-wider uppercase" style={{ color: EMERALD }}>
            {t.liveDemo.receiver}
          </span>
        </div>

        {/* Browser mockup */}
        <div
          className="rounded-xl p-3 sm:p-4 mb-4"
          style={{
            background: "var(--hover-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* Browser address bar */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: "#ef444480" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#f59e0b80" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#34d39980" }} />
            </div>
            <div
              className="flex-1 h-5 rounded-md px-2 flex items-center"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              <Lock size={8} className="mr-1" style={{ color: EMERALD, opacity: 0.6 }} />
              <span className="text-[9px] text-themed-muted truncate">192.168.1.100:8080/share/abc</span>
            </div>
          </div>

          {/* Download page content */}
          <div
            className="rounded-lg p-3"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${EMERALD}10`, border: `1px solid ${EMERALD}20` }}
              >
                <FileText size={16} style={{ color: EMERALD }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-themed-primary truncate">{t.liveDemo.fileName}</p>
                <p className="text-[10px] text-themed-muted">{t.liveDemo.fileDetail}</p>
              </div>
            </div>

            {/* Download button */}
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.button
                  key="download"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${EMERALD}cc, ${EMERALD})`,
                    color: "#09090b",
                    boxShadow: `0 0 12px ${EMERALD}30`,
                  }}
                >
                  <Download size={12} />
                  {t.liveDemo.downloadBtn}
                </motion.button>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="w-full py-2 rounded-lg text-xs text-themed-muted text-center"
                  style={{
                    background: "var(--hover-bg)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  {demoState === "idle" || demoState === "preparing" ? t.liveDemo.status.receiverIdle : t.liveDemo.status.receiverTransferring}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-themed-muted">{t.liveDemo.receiveProgress}</span>
            <span className="text-[10px] font-mono" style={{ color: EMERALD }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--hover-bg-strong)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${EMERALD}90, ${EMERALD})`,
                boxShadow: progress > 0 ? `0 0 8px ${EMERALD}40` : "none",
              }}
              animate={{ width: `${progress}%` }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={demoState}
            initial={reducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            {demoState === "complete" ? (
              <CheckCircle2 size={12} style={{ color: EMERALD }} />
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: demoState === "idle" || demoState === "preparing" ? "var(--text-muted)" : EMERALD,
                  animation: demoState === "transferring" && !reducedMotion ? "demo-dot-blink 1s ease-in-out infinite" : "none",
                }}
              />
            )}
            <span className="text-xs text-themed-secondary">{statusText}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Speed Indicator (center) ─── */
function SpeedIndicator({
  isActive,
  speed,
  fileSize,
  reducedMotion,
}: {
  isActive: boolean;
  speed: number;
  fileSize: FileSize;
  reducedMotion: boolean;
}) {
  const { t } = useI18n();
  const config = FILE_SIZES[fileSize];

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-2 sm:px-4 py-4 relative">
      {/* Data flow dots */}
      <DataFlowDots isActive={isActive} reducedMotion={reducedMotion} />

      {/* Speed display */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.4 }}
        className="relative z-10 text-center"
      >
        <div className="text-xl sm:text-2xl font-bold font-mono" style={{ color: EMERALD }}>
          {isActive || speed > 0 ? `${speed.toFixed(0)}` : "0"}
          <span className="text-xs sm:text-sm font-normal text-themed-muted ml-1">MB/s</span>
        </div>
        <div className="text-[10px] text-themed-muted mt-1">{t.liveDemo.speed}</div>
      </motion.div>

      {/* Direction arrow — no infinite bounce when reduced motion */}
      <motion.div
        animate={isActive && !reducedMotion ? { x: [0, 6, 0] } : { x: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <ArrowRight size={16} style={{ color: EMERALD, opacity: 0.6 }} />
      </motion.div>

      {/* Size label */}
      <div
        className="text-[10px] px-2 py-0.5 rounded-full relative z-10"
        style={{ background: `${EMERALD}10`, color: `${EMERALD}bb`, border: `1px solid ${EMERALD}15` }}
      >
        {config.label}
      </div>
    </div>
  );
}

/* ─── Stats Bar ─── */
function StatsBar({
  isRunning,
  isComplete,
  speed,
  elapsedTime,
  fileSize,
  reducedMotion,
}: {
  isRunning: boolean;
  isComplete: boolean;
  speed: number;
  elapsedTime: number;
  fileSize: FileSize;
  reducedMotion: boolean;
}) {
  const { t } = useI18n();
  const animatedSpeed = useAnimatedValue(speed, isRunning || isComplete, 1500);

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8">
      {/* Transfer speed */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-xl p-3 sm:p-4 text-center"
      >
        <Zap size={16} className="mx-auto mb-2" style={{ color: EMERALD }} />
        <div className="text-lg sm:text-xl font-bold font-mono text-themed-primary">
          {animatedSpeed.toFixed(0)}
          <span className="text-xs font-normal text-themed-muted ml-1">MB/s</span>
        </div>
        <div className="text-[10px] text-themed-muted mt-1">{t.liveDemo.speed}</div>
      </motion.div>

      {/* Encryption method */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-xl p-3 sm:p-4 text-center"
      >
        <Lock size={16} className="mx-auto mb-2" style={{ color: "#a78bfa" }} />
        <div className="text-sm sm:text-base font-bold text-themed-primary font-mono">AES-256</div>
        <div className="text-[10px] text-themed-muted mt-1">{t.liveDemo.encryptionLabel}</div>
      </motion.div>

      {/* Elapsed time */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-xl p-3 sm:p-4 text-center"
      >
        <Clock size={16} className="mx-auto mb-2" style={{ color: "#f59e0b" }} />
        <div className="text-lg sm:text-xl font-bold font-mono text-themed-primary">
          {elapsedTime.toFixed(1)}
          <span className="text-xs font-normal text-themed-muted ml-1">s</span>
        </div>
        <div className="text-[10px] text-themed-muted mt-1">{t.liveDemo.elapsedTimeLabel}</div>
      </motion.div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function LiveDemoSection() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Demo state
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [fileSize, setFileSize] = useState<FileSize>("10");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isRunning = demoState === "preparing" || demoState === "transferring";
  const isComplete = demoState === "complete";

  const resetDemo = useCallback(() => {
    setDemoState("idle");
    setProgress(0);
    setSpeed(0);
    setElapsedTime(0);
  }, []);

  const startDemo = useCallback(() => {
    resetDemo();
    // Phase 1: Preparing (0-500ms)
    setDemoState("preparing");

    // Phase 2: Transferring (500ms - duration)
    setTimeout(() => {
      setDemoState("transferring");
    }, 500);

    // Phase 3: Complete
    const config = FILE_SIZES[fileSize];
    setTimeout(() => {
      setDemoState("complete");
      setProgress(100);
      setSpeed(parseFloat(config.speed));
    }, config.duration + 500);
  }, [fileSize, resetDemo]);

  // Progress and speed animation during transfer
  useEffect(() => {
    if (demoState !== "transferring") return;

    const config = FILE_SIZES[fileSize];
    const totalDuration = config.duration - 500; // Subtract the preparing phase
    const targetSpeed = parseFloat(config.speed);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / totalDuration, 1);

      // Ease-out progress curve
      const easedProgress = 1 - Math.pow(1 - rawProgress, 2.5);
      setProgress(easedProgress * 100);

      // Speed fluctuates around target
      const fluctuation = Math.sin(elapsed / 200) * 3 + Math.random() * 2;
      setSpeed(Math.max(0, targetSpeed + fluctuation));

      // Elapsed time
      setElapsedTime(elapsed / 1000);

      if (rawProgress >= 1) {
        clearInterval(interval);
        setProgress(100);
        setSpeed(targetSpeed);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [demoState, fileSize]);

  // Elapsed time counter for preparing phase
  useEffect(() => {
    if (demoState !== "preparing") return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 50);

    return () => clearInterval(interval);
  }, [demoState]);

  // Compute final elapsed time when complete (derived, no setState in effect)
  const finalElapsedTime =
    demoState === "complete" ? (FILE_SIZES[fileSize].duration + 500) / 1000 : elapsedTime;

  return (
    <section id="live-demo" className="relative py-24 sm:py-32 overflow-hidden" ref={sectionRef}>
      {/* Floating orb background effects — hidden via CSS when reduced motion */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-[5%] w-[350px] h-[350px] rounded-full floating-orb"
          style={{
            background: `radial-gradient(circle, ${EMERALD}04, transparent 70%)`,
            filter: "blur(80px)",
            animation: "floatOrb0 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] rounded-full floating-orb"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.03), transparent 70%)",
            filter: "blur(60px)",
            animation: "floatOrb1 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-[250px] h-[250px] rounded-full floating-orb"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.02), transparent 70%)",
            filter: "blur(70px)",
            animation: "floatOrb2 22s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-6"
            style={{
              background: `rgba(52, 211, 153, 0.08)`,
              color: EMERALD,
              border: `1px solid rgba(52, 211, 153, 0.15)`,
            }}
          >
            {t.liveDemo.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.liveDemo.title1}</span>
            <span className="text-themed-primary">{t.liveDemo.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.liveDemo.description}
          </p>
        </motion.div>

        {/* Main demo area */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.1 }}
        >
          <div
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto relative"
            style={{ borderColor: `${EMERALD}10` }}
          >
            {/* Demo content: Sender + Flow + Receiver */}
            <div className="flex items-stretch gap-2 sm:gap-4 mb-6 sm:mb-8">
              <SenderCard progress={progress} demoState={demoState} reducedMotion={reducedMotion} />

              {/* Center data flow area */}
              <div className="hidden sm:flex items-center justify-center relative w-20 sm:w-28 flex-shrink-0">
                <SpeedIndicator
                  isActive={isRunning}
                  speed={speed}
                  fileSize={fileSize}
                  reducedMotion={reducedMotion}
                />
              </div>

              {/* Mobile: simplified flow indicator — no bounce when reduced motion */}
              <div className="flex sm:hidden items-center justify-center flex-shrink-0 px-1">
                <motion.div
                  animate={isRunning && !reducedMotion ? { y: [0, -4, 0] } : { y: 0 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight size={16} style={{ color: EMERALD, opacity: isRunning ? 1 : 0.3 }} />
                </motion.div>
              </div>

              <ReceiverCard
                progress={progress}
                demoState={demoState}
                isComplete={isComplete}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Interactive controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Start / Reset button */}
              <AnimatePresence mode="wait">
                {isRunning || isComplete ? (
                  <motion.button
                    key="reset"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    onClick={resetDemo}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: "var(--hover-bg-strong)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-secondary)",
                    }}
                    whileHover={reducedMotion ? {} : { scale: 1.03 }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  >
                    <RotateCcw size={14} />
                    {t.liveDemo.resetBtn}
                  </motion.button>
                ) : (
                  <motion.button
                    key="start"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    onClick={startDemo}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${EMERALD}cc, ${EMERALD})`,
                      color: "#09090b",
                      boxShadow: `0 0 16px ${EMERALD}30`,
                    }}
                    whileHover={reducedMotion ? {} : { scale: 1.03, boxShadow: `0 0 24px ${EMERALD}40` }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  >
                    <Play size={14} />
                    {t.liveDemo.startBtn}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* File size selector */}
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{
                  background: "var(--hover-bg)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {(Object.keys(FILE_SIZES) as FileSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (!isRunning) {
                        setFileSize(size);
                        resetDemo();
                      }
                    }}
                    disabled={isRunning}
                    className="px-3 sm:px-4 py-2 text-xs font-medium transition-all duration-200"
                    style={{
                      background:
                        fileSize === size
                          ? `${EMERALD}15`
                          : "transparent",
                      color:
                        fileSize === size ? EMERALD : "var(--text-muted)",
                      cursor: isRunning ? "not-allowed" : "pointer",
                      opacity: isRunning && fileSize !== size ? 0.5 : 1,
                    }}
                  >
                    {FILE_SIZES[size].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <StatsBar
          isRunning={isRunning}
          isComplete={isComplete}
          speed={speed}
          elapsedTime={finalElapsedTime}
          fileSize={fileSize}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* CSS animations for data flow */}
      <style jsx>{`
        @keyframes demo-dot-travel {
          0% {
            left: 0%;
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
          }
          10% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          100% {
            left: 100%;
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
          }
        }

        @keyframes demo-glow-travel {
          0% {
            left: -20%;
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes demo-pulse-line {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes demo-dot-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}
