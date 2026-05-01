"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useReducedMotion from "./useReducedMotion";
import { useI18n } from "@/i18n";

/** Line metadata for the terminal animation (text comes from i18n) */
interface TerminalLineMeta {
  color: string;
  typed: boolean; // true = typed char-by-char, false = appears instantly
  delayBefore: number; // ms delay before this line starts (after previous line completed)
}

const TERMINAL_LINE_META: TerminalLineMeta[] = [
  { color: "#2dd4bf", typed: true, delayBefore: 0 },
  { color: "rgba(255,255,255,0.5)", typed: false, delayBefore: 300 },
  { color: "rgba(255,255,255,0.5)", typed: false, delayBefore: 500 },
  { color: "rgba(255,255,255,0.5)", typed: false, delayBefore: 300 },
  { color: "#34d399", typed: false, delayBefore: 300 },
];

const RESET_DELAY = 2000; // ms after last line before looping
const TYPING_SPEED = 40; // ms per character

export default function TerminalBlock() {
  // completedLines[i] = true if line i has fully appeared in visibleLines
  const [completedLines, setCompletedLines] = useState<boolean[]>([]);
  // For typed lines: partial text being typed
  const [typingText, setTypingText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const pauseRef = useRef(false);
  const cancelledRef = useRef(false);
  const { toast } = useToast();
  const reducedMotion = useReducedMotion();
  const { t } = useI18n();

  // Get terminal lines from i18n
  const terminalLines = t.terminal.lines;

  /** Wait for a delay, respecting pause state */
  const waitFor = useCallback(async (ms: number) => {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (cancelledRef.current) { resolve(); return; }
        if (!pauseRef.current) {
          setTimeout(resolve, ms);
        } else {
          // Check again in 100ms if still paused
          setTimeout(check, 100);
        }
      };
      check();
    });
  }, []);

  /** Run the full terminal animation sequence */
  const runAnimation = useCallback(async () => {
    if (cancelledRef.current) return;

    for (let i = 0; i < TERMINAL_LINE_META.length; i++) {
      if (cancelledRef.current) return;

      const lineMeta = TERMINAL_LINE_META[i];
      const lineText = terminalLines[i] || "";

      // Wait before this line starts
      if (lineMeta.delayBefore > 0) {
        await waitFor(lineMeta.delayBefore);
        if (cancelledRef.current) return;
      }

      if (lineMeta.typed) {
        // Type character by character
        for (let c = 1; c <= lineText.length; c++) {
          if (cancelledRef.current) return;
          // Wait while paused
          while (pauseRef.current && !cancelledRef.current) {
            await new Promise<void>((r) => setTimeout(r, 50));
          }
          if (cancelledRef.current) return;
          setTypingText(lineText.slice(0, c));
          await waitFor(TYPING_SPEED);
        }
        // Typing done for this line — add to completed
        setTypingText("");
        setCompletedLines((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      } else {
        // Line appears instantly
        setCompletedLines((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }
    }

    // All lines done — wait then reset
    if (!cancelledRef.current) {
      await waitFor(RESET_DELAY);
      if (!cancelledRef.current) {
        setCompletedLines([]);
        setTypingText("");
        // Loop
        runAnimation();
      }
    }
  }, [waitFor, terminalLines]);

  // Start animation on mount
  useEffect(() => {
    cancelledRef.current = false;
    setIsAnimating(true);

    // If reduced motion is preferred, show all lines immediately — no animation loop
    if (reducedMotion) {
      setCompletedLines(TERMINAL_LINE_META.map(() => true));
      setTypingText("");
      return;
    }

    // Small initial delay for visual effect
    const startTimeout = setTimeout(() => {
      runAnimation();
    }, 500);

    return () => {
      cancelledRef.current = true;
      clearTimeout(startTimeout);
    };
  }, [reducedMotion, runAnimation]);

  // Pause on hover — only when not in reduced motion
  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;
    pauseRef.current = true;
    setIsPaused(true);
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;
    pauseRef.current = false;
    setIsPaused(false);
  }, [reducedMotion]);

  // Copy URL to clipboard
  const handleCopy = useCallback(async () => {
    const url = "http://192.168.1.100:8080/s/abc123";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: t.terminal.copiedToClipboard,
        description: url,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t.terminal.copyFailed,
        description: t.terminal.copyFailedDesc,
        variant: "destructive",
      });
    }
  }, [toast, t]);

  // Find which line is currently being typed (only when not reduced motion)
  const typingLineIndex = reducedMotion
    ? -1
    : TERMINAL_LINE_META.findIndex(
        (line, i) => line.typed && !completedLines[i]
      );

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 2.2, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-2xl"
        style={{
          background: "#0d0d0f",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="block w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ff5f57" }}
            />
            <span
              className="block w-3 h-3 rounded-full"
              style={{ backgroundColor: "#febc2e" }}
            />
            <span
              className="block w-3 h-3 rounded-full"
              style={{ backgroundColor: "#28c840" }}
            />
          </div>
          <span className="flex-1 text-center text-xs font-medium text-[rgba(255,255,255,0.4)] tracking-wide">
            NeiLink
          </span>
          <div className="w-[54px]" />
        </div>

        {/* Terminal content */}
        <div className="p-4 sm:p-5 font-mono text-[13px] sm:text-sm leading-7 min-h-[220px]">
          {TERMINAL_LINE_META.map((lineMeta, i) => {
            const isCompleted = completedLines[i];
            const isCurrentlyTyping = i === typingLineIndex;
            const isUrlLine = i === 3;
            const lineText = terminalLines[i] || "";

            // If this line is not yet visible and not being typed, skip
            if (!isCompleted && !isCurrentlyTyping) return null;

            return (
              <div key={`line-${i}`} className="flex items-start gap-3">
                {/* Line number */}
                <span className="text-[rgba(255,255,255,0.15)] select-none w-4 text-right shrink-0 text-xs leading-7 tabular-nums">
                  {i + 1}
                </span>

                {/* Line content */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isCurrentlyTyping && !isCompleted ? (
                    /* Being typed right now */
                    <span
                      style={{
                        color: lineMeta.color,
                        textShadow: `0 0 8px ${lineMeta.color}33`,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {typingText}
                      <span
                        className="inline-block w-[8px] h-[15px] ml-[1px] align-middle"
                        style={{
                          backgroundColor: lineMeta.color,
                          animation: isPaused ? "none" : "terminal-blink 1s step-end infinite",
                        }}
                      />
                    </span>
                  ) : isCompleted ? (
                    /* Fully visible line */
                    <span
                      style={{
                        color: lineMeta.color,
                        textShadow: isUrlLine ? "none" : `0 0 8px ${lineMeta.color}33`,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {isUrlLine ? (
                        <>
                          {"🔗 "}
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 underline decoration-[rgba(255,255,255,0.3)] hover:decoration-[rgba(45,212,191,0.6)] transition-colors"
                            style={{ color: "#2dd4bf" }}
                            onClick={(e) => e.preventDefault()}
                          >
                            http://192.168.1.100:8080/s/abc123
                            <ExternalLink size={11} className="inline opacity-50" />
                          </a>
                        </>
                      ) : (
                        lineText
                      )}
                    </span>
                  ) : null}

                  {/* Copy button next to URL line */}
                  {isUrlLine && isCompleted && (
                    <button
                      onClick={handleCopy}
                      className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(45,212,191,0.3)] hover:bg-[rgba(45,212,191,0.08)]"
                      style={{ color: copied ? "#34d399" : "rgba(255,255,255,0.4)" }}
                      aria-label={t.terminal.copyLink}
                    >
                      {copied ? (
                        <>
                          <Check size={10} />
                          <span>{t.terminal.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>{t.terminal.copy}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Blinking cursor when paused (no active typing) — not shown in reduced motion */}
          {!reducedMotion && isPaused && typingLineIndex === -1 && completedLines.length > 0 && completedLines.length < TERMINAL_LINE_META.length && (
            <div className="flex items-start gap-3">
              <span className="text-[rgba(255,255,255,0.15)] select-none w-4 text-right shrink-0 text-xs leading-7 tabular-nums">
                {completedLines.filter(Boolean).length + 1}
              </span>
              <span
                className="inline-block w-[8px] h-[15px] align-middle"
                style={{
                  backgroundColor: "#2dd4bf",
                  animation: "terminal-blink 1s step-end infinite",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cursor blink animation */}
      <style jsx global>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
