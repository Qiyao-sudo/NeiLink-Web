"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Keyboard, X } from "lucide-react";
import { useI18n } from "@/i18n";

// ─── Section ID mapping for number keys 1-9 ──────────────────────────────────

const SECTION_MAP: Record<string, string> = {
  "1": "features",
  "2": "how-it-works",
  "3": "security",
  "4": "trust",
  "5": "cross-platform",
  "6": "comparison",
  "7": "screenshots",
  "8": "faq",
  "9": "changelog",
};

// ─── Mapping from section DOM IDs to i18n section keys ───────────────────────

const SECTION_I18N_KEY: Record<string, string> = {
  features: "features",
  "how-it-works": "howItWorks",
  security: "security",
  trust: "trust",
  "cross-platform": "crossPlatform",
  comparison: "comparison",
  screenshots: "screenshots",
  faq: "faq",
  changelog: "changelog",
};

// ─── Shortcut definitions grouped by category ────────────────────────────────

interface ShortcutItem {
  keys: string;
  descriptionKey: string; // i18n key for description
}

interface ShortcutGroup {
  labelKey: string; // i18n key for group label
  items: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    labelKey: "navigation",
    items: [
      { keys: "1-9", descriptionKey: "jumpToSection" },
      { keys: "↑ / K", descriptionKey: "scrollUp" },
      { keys: "↓ / J", descriptionKey: "scrollDown" },
      { keys: "G H", descriptionKey: "goBackToTop" },
      { keys: "G D", descriptionKey: "downloadPage" },
    ],
  },
  {
    labelKey: "actions",
    items: [
      { keys: "T", descriptionKey: "toggleTheme" },
      { keys: "?", descriptionKey: "showShortcuts" },
      { keys: "Esc", descriptionKey: "closePanel" },
    ],
  },
  {
    labelKey: "jumpTo",
    items: [
      { keys: "1", descriptionKey: "section:features" },
      { keys: "2", descriptionKey: "section:howItWorks" },
      { keys: "3", descriptionKey: "section:security" },
      { keys: "4", descriptionKey: "section:trust" },
      { keys: "5", descriptionKey: "section:crossPlatform" },
      { keys: "6", descriptionKey: "section:comparison" },
      { keys: "7", descriptionKey: "section:screenshots" },
      { keys: "8", descriptionKey: "section:faq" },
      { keys: "9", descriptionKey: "section:changelog" },
    ],
  },
];

// ─── Platform detection ──────────────────────────────────────────────────────

const emptySubscribe = () => () => {};

function useIsMac() {
  return useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0,
    () => false
  );
}

// ─── KeyboardShortcutsOverlay Component ──────────────────────────────────────

export default function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isMac = useIsMac();
  const { t } = useI18n();

  // "g" prefix buffer for vim-style key sequences (g h, g d)
  const gBufferRef = useRef(false);
  const gTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close overlay
  const closeOverlay = useCallback(() => {
    setOpen(false);
  }, []);

  // Toggle overlay
  const toggleOverlay = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  }, [mounted, theme, setTheme]);

  // Scroll to section by ID
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Escape always closes the overlay if open
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }

      // Don't process other shortcuts when in input
      if (isInputFocused) return;

      // Don't process if modifier keys are held
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // "?" key toggles overlay
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        toggleOverlay();
        return;
      }

      // If overlay is open, don't process other shortcuts (except Escape)
      if (open) return;

      // "T" toggles theme
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // "j" scrolls down, "k" scrolls up (vim-style)
      if (e.key === "j") {
        e.preventDefault();
        window.scrollBy({ top: 100, behavior: "smooth" });
        return;
      }
      if (e.key === "k") {
        e.preventDefault();
        window.scrollBy({ top: -100, behavior: "smooth" });
        return;
      }

      // "1"-"9" scrolls to corresponding section
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const sectionId = SECTION_MAP[e.key];
        if (sectionId) {
          scrollToSection(sectionId);
        }
        return;
      }

      // "g" prefix for vim-style key sequences (g h = go home, g d = go download)
      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        gBufferRef.current = true;

        // Clear any existing timeout
        if (gTimeoutRef.current) {
          clearTimeout(gTimeoutRef.current);
        }

        // Reset g buffer after 1 second if no second key is pressed
        gTimeoutRef.current = setTimeout(() => {
          gBufferRef.current = false;
        }, 1000);
        return;
      }

      // Second key after "g" prefix
      if (gBufferRef.current) {
        gBufferRef.current = false;
        if (gTimeoutRef.current) {
          clearTimeout(gTimeoutRef.current);
          gTimeoutRef.current = null;
        }

        if (e.key === "h" || e.key === "H") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (e.key === "d" || e.key === "D") {
          e.preventDefault();
          scrollToSection("download");
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gTimeoutRef.current) {
        clearTimeout(gTimeoutRef.current);
      }
    };
  }, [open, toggleOverlay, toggleTheme, scrollToSection]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(() => {
    closeOverlay();
  }, [closeOverlay]);

  // Helper to resolve description key to translated text
  const resolveDescription = (descriptionKey: string): string => {
    if (descriptionKey.startsWith("section:")) {
      const sectionKey = descriptionKey.slice("section:".length);
      return t.utils.sections[sectionKey as keyof typeof t.utils.sections];
    }
    return t.utils.shortcuts[descriptionKey as keyof typeof t.utils.shortcuts];
  };

  // Helper to resolve group label key to translated text
  const resolveGroupLabel = (labelKey: string): string => {
    return t.utils.shortcuts[labelKey as keyof typeof t.utils.shortcuts];
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleBackdropClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Dialog */}
            <motion.div
              className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background: "var(--command-bg)",
                borderColor: "var(--command-border)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              role="dialog"
              aria-label={t.utils.keyboardShortcuts}
              aria-modal="true"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "var(--command-border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Keyboard size={18} className="text-[#2dd4bf]" />
                  <h2 className="text-sm font-semibold text-themed-primary">
                    {t.utils.keyboardShortcuts}
                  </h2>
                </div>
                <button
                  onClick={closeOverlay}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150 hover:bg-themed-hover-strong"
                  aria-label={t.utils.shortcuts.closePanel}
                >
                  <X size={14} className="text-themed-muted" />
                </button>
              </div>

              {/* Content */}
              <div
                className="max-h-[70vh] overflow-y-auto py-3"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--text-muted) transparent",
                }}
              >
                {SHORTCUT_GROUPS.map((group) => (
                  <div key={group.labelKey}>
                    <div className="px-5 pt-3 pb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-themed-muted">
                        {resolveGroupLabel(group.labelKey)}
                      </span>
                    </div>
                    <div className="px-2">
                      {group.items.map((item) => (
                        <div
                          key={item.keys}
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-themed-hover transition-colors duration-100"
                        >
                          <span className="text-sm text-themed-secondary">
                            {resolveDescription(item.descriptionKey)}
                          </span>
                          <kbd
                            className="text-[11px] font-mono px-2 py-0.5 rounded border text-themed-muted whitespace-nowrap"
                            style={{
                              borderColor: "var(--card-border)",
                              background: "var(--hover-bg)",
                            }}
                          >
                            {item.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div
                className="flex items-center justify-center gap-2 px-5 py-3 border-t text-[10px] text-themed-muted"
                style={{ borderColor: "var(--command-border)" }}
              >
                <span>{t.utils.shortcuts.press}</span>
                <kbd
                  className="px-1.5 py-0.5 rounded border text-[10px] font-mono"
                  style={{
                    borderColor: "var(--command-border)",
                    background: "var(--hover-bg)",
                  }}
                >
                  Esc
                </kbd>
                <span>{t.utils.shortcuts.closePanel}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hint badge */}
      <KeyboardHintBadge isMac={isMac} />
    </>
  );
}

// ─── KeyboardHintBadge — subtle hint that fades out after 5 seconds ──────────

function KeyboardHintBadge({ isMac }: { isMac: boolean }) {
  const [visible, setVisible] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
          style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--card-border)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span className="text-[11px] text-themed-muted">{t.utils.shortcuts.press}</span>
          <kbd
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border text-themed-secondary"
            style={{
              borderColor: "var(--card-border)",
              background: "var(--hover-bg)",
            }}
          >
            ?
          </kbd>
          <span className="text-[11px] text-themed-muted">{t.utils.shortcuts.viewShortcuts}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { KeyboardHintBadge };
