"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Monitor,
  Layout,
  Settings,
  FileText,
  BarChart3,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useI18n } from "@/i18n";

const SCREENSHOT_CONFIG = [
  { id: "main", icon: Monitor, mockup: "main", badgeIndex: 0 },
  { id: "share", icon: Layout, mockup: "share", badgeIndex: -1 },
  { id: "manage", icon: FileText, mockup: "manage", badgeIndex: -1 },
  { id: "stats", icon: BarChart3, mockup: "stats", badgeIndex: -1 },
  { id: "settings", icon: Settings, mockup: "settings", badgeIndex: -1 },
  { id: "web", icon: Globe, mockup: "web", badgeIndex: 1 },
];

const BADGE_CONFIG = [
  { textKey: "items.0.badge", color: "#2dd4bf" },
  { textKey: "items.5.badge", color: "#f59e0b" },
];

/* ─── AppMockup — kept fully intact with all 6 types ─── */
function AppMockup({ type, isActive }: { type: string; isActive: boolean }) {
  const { t } = useI18n();

  const renderMockup = () => {
    const baseClasses =
      "w-full h-full rounded-lg bg-[#131316] border border-[rgba(255,255,255,0.06)] p-3 sm:p-4 overflow-hidden";

    switch (type) {
      case "main":
        return (
          <div className={baseClasses}>
            {/* Title bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[rgba(255,255,255,0.35)]">
                NeiLink
              </span>
            </div>
            {/* Main content */}
            <div className="flex gap-3 h-[calc(100%-40px)]">
              {/* Sidebar */}
              <div className="w-1/4 flex flex-col gap-2">
                {t.screenshots.mockups.sidebar.map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs ${
                        i === 0
                          ? "bg-[rgba(45,212,191,0.08)] text-[#2dd4bf]"
                          : "text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.5)]"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
              {/* Content area */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgba(255,255,255,0.08)] p-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.4)]">
                  {t.screenshots.mockups.main.dragHint}
                </p>
                <button className="px-4 py-1.5 rounded-lg bg-[#f59e0b] text-[#09090b] text-xs font-medium">
                  {t.screenshots.mockups.main.selectFile}
                </button>
              </div>
            </div>
          </div>
        );

      case "share":
        return (
          <div className={baseClasses}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[rgba(255,255,255,0.35)]">
                {t.screenshots.items[1].title}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: t.screenshots.mockups.share.accessCode, value: "••••", enabled: true },
                { label: t.screenshots.mockups.share.expiry, value: t.screenshots.mockups.share.hours, enabled: true },
                { label: t.screenshots.mockups.share.downloadCount, value: t.screenshots.mockups.share.unlimited, enabled: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-4 rounded-full ${
                        item.enabled
                          ? "bg-[#2dd4bf]"
                          : "bg-[rgba(255,255,255,0.08)]"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white mt-0.5 ${
                          item.enabled ? "ml-4" : "ml-0.5"
                        } transition-all`}
                      />
                    </div>
                    <span className="text-xs text-[rgba(255,255,255,0.5)]">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-[#2dd4bf]">{item.value}</span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                <div className="text-xs text-[rgba(255,255,255,0.35)] mb-1">
                  {t.screenshots.mockups.share.shareLink}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-[#a78bfa] flex-1">
                    http://192.168.1.100:8080/s/abc123
                  </code>
                  <button className="px-2 py-1 rounded text-[10px] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)]">
                    {t.screenshots.mockups.share.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "manage":
        return (
          <div className={baseClasses}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[rgba(255,255,255,0.35)]">
                {t.screenshots.items[2].title}
              </span>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: "项目报告.pdf",
                  size: "12.3 MB",
                  downloads: 3,
                  status: "active",
                },
                {
                  name: "设计稿.zip",
                  size: "156 MB",
                  downloads: 1,
                  status: "active",
                },
                {
                  name: "会议记录.docx",
                  size: "2.1 MB",
                  downloads: 5,
                  status: "expired",
                },
              ].map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]"
                >
                  <div>
                    <div className="text-xs text-white">{file.name}</div>
                    <div className="text-[10px] text-[rgba(255,255,255,0.35)]">
                      {file.size} · {file.downloads} {t.screenshots.mockups.manage.downloads}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      file.status === "active"
                        ? "bg-[rgba(52,211,153,0.1)] text-[#34d399]"
                        : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.35)]"
                    }`}
                  >
                    {file.status === "active" ? t.screenshots.mockups.manage.active : t.screenshots.mockups.manage.expired}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className={baseClasses}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[rgba(255,255,255,0.35)]">
                {t.screenshots.items[3].title}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: t.screenshots.mockups.stats.totalUpload, value: "2.4 GB", color: "#2dd4bf" },
                { label: t.screenshots.mockups.stats.totalDownload, value: "1.8 GB", color: "#a78bfa" },
                { label: t.screenshots.mockups.stats.activeShares, value: "3", color: "#34d399" },
                { label: t.screenshots.mockups.stats.totalDownloads, value: "12", color: "#f59e0b" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                >
                  <div className="text-[10px] text-[rgba(255,255,255,0.35)]">
                    {stat.label}
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            {/* Mini chart */}
            <div className="h-16 flex items-end gap-1 px-1">
              {[40, 60, 35, 80, 55, 70, 90, 45, 65, 50, 75, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, rgba(45,212,191,0.2), rgba(45,212,191,0.06))`,
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className={baseClasses}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[rgba(255,255,255,0.35)]">
                {t.screenshots.items[4].title}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: t.screenshots.mockups.settings.networkAdapter, value: "Wi-Fi (wlan0)" },
                { label: t.screenshots.mockups.settings.servicePort, value: "8080" },
                { label: t.screenshots.mockups.settings.autoHotspot, value: t.screenshots.mockups.settings.off },
                { label: t.screenshots.mockups.settings.autoStart, value: t.screenshots.mockups.settings.on },
              ].map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]"
                >
                  <span className="text-xs text-[rgba(255,255,255,0.5)]">
                    {setting.label}
                  </span>
                  <span className="text-xs text-[rgba(255,255,255,0.7)]">
                    {setting.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "web":
        return (
          <div className={baseClasses}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(255,255,255,0.04)]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-[rgba(255,255,255,0.03)] text-[10px] text-[rgba(255,255,255,0.35)]">
                http://192.168.1.100:8080/s/abc123
              </div>
            </div>
            {/* Web page content */}
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <img
                src="./logo.png"
                alt="NeiLink"
                className="w-10 h-10 rounded-xl object-contain"
              />
              <div className="text-sm font-medium text-white">
                {t.screenshots.mockups.web.fileShare}
              </div>
              <div className="text-[10px] text-[rgba(255,255,255,0.35)]">
                项目报告.pdf · 12.3 MB
              </div>
              <div className="w-full max-w-[180px] mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-2">
                  <span className="text-[10px] text-[rgba(255,255,255,0.45)]">
                    {t.screenshots.mockups.web.accessCode}
                  </span>
                  <span className="text-[10px] text-[#a78bfa]">••••</span>
                </div>
                <button className="w-full py-2 rounded-lg bg-[#f59e0b] text-[#09090b] text-xs font-semibold">
                  {t.screenshots.mockups.web.downloadFile}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.4 }}
      className="aspect-[4/3] w-full"
    >
      {renderMockup()}
    </motion.div>
  );
}

/* ─── Lightbox Modal ─── */
function LightboxModal({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { t } = useI18n();
  const shot = SCREENSHOT_CONFIG[index];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl glass-card rounded-2xl p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "var(--hover-bg-strong)",
            color: "var(--text-secondary)",
          }}
          aria-label={t.screenshots.lightbox.close}
        >
          <X size={18} />
        </button>

        {/* Left/Right navigation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "var(--hover-bg-strong)",
            color: "var(--text-secondary)",
          }}
          aria-label={t.screenshots.lightbox.prev}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "var(--hover-bg-strong)",
            color: "var(--text-secondary)",
          }}
          aria-label={t.screenshots.lightbox.next}
        >
          <ChevronRight size={18} />
        </button>

        {/* Full-size AppMockup */}
        <div className="rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <AppMockup type={shot.mockup} isActive={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Title + Description below mockup */}
        <motion.div
          key={`info-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mt-4 sm:mt-5"
        >
          <h3 className="text-lg font-semibold text-themed-primary mb-1">
            {t.screenshots.items[index].title}
          </h3>
          <p className="text-sm text-themed-muted">{t.screenshots.items[index].desc}</p>
          <p className="text-xs text-themed-muted mt-2 opacity-60">
            {index + 1} / {SCREENSHOT_CONFIG.length}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Screenshot Card ─── */
function ScreenshotCard({
  shotIndex,
  index,
  isActive,
  onClick,
}: {
  shotIndex: number;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useI18n();
  const Icon = SCREENSHOT_CONFIG[shotIndex].icon;
  const shotItem = t.screenshots.items[shotIndex];
  const badgeInfo = SCREENSHOT_CONFIG[shotIndex].badgeIndex >= 0
    ? BADGE_CONFIG[SCREENSHOT_CONFIG[shotIndex].badgeIndex]
    : null;
  const badgeText = badgeInfo ? (shotItem as Record<string, unknown>).badge as string : undefined;

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative w-full text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: "var(--card-bg)",
        border: isActive
          ? "1.5px solid #2dd4bf"
          : "1px solid var(--card-border)",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      aria-label={`${t.screenshots.viewLarge}${shotItem.title}`}
    >
      {/* Badge */}
      {badgeText && (
        <div
          className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
          style={{
            background: `${badgeInfo!.color}15`,
            color: badgeInfo!.color,
            border: `1px solid ${badgeInfo!.color}25`,
          }}
        >
          {badgeText}
        </div>
      )}

      {/* Hover border accent */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 z-10"
        style={{
          border: isHovered ? "1.5px solid #2dd4bf" : "1.5px solid transparent",
        }}
      />

      {/* View large overlay on hover */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl transition-all duration-300"
        style={{
          background: isHovered
            ? "rgba(0, 0, 0, 0.45)"
            : "transparent",
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
        }}
      >
        <motion.div
          initial={false}
          animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Maximize2 size={16} className="text-white" />
          <span className="text-white text-sm font-medium">{t.screenshots.viewLarge}</span>
        </motion.div>
      </div>

      {/* Mini AppMockup preview */}
      <div className="p-3 sm:p-4 pb-0">
        <div className="rounded-xl overflow-hidden" style={{ transform: "scale(1)", transformOrigin: "top center" }}>
          <AppMockup type={SCREENSHOT_CONFIG[shotIndex].mockup} isActive={isActive} />
        </div>
      </div>

      {/* Title + description */}
      <div className="p-3 sm:p-4 pt-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon
            size={14}
            className="flex-shrink-0"
            style={{ color: isActive ? "#2dd4bf" : "var(--text-muted)" }}
          />
          <h4 className="text-sm font-semibold text-themed-primary truncate">
            {shotItem.title}
          </h4>
        </div>
        <p className="text-xs text-themed-muted line-clamp-2">{shotItem.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function ScreenshotsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useI18n();

  // Auto-play logic
  useEffect(() => {
    if (autoPlay && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % SCREENSHOT_CONFIG.length);
      }, 3000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, isPaused]);

  // Open lightbox
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setActiveIndex(index);
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Lightbox navigation
  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + SCREENSHOT_CONFIG.length) % SCREENSHOT_CONFIG.length
        : null
    );
    setActiveIndex((prev) => (prev - 1 + SCREENSHOT_CONFIG.length) % SCREENSHOT_CONFIG.length);
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % SCREENSHOT_CONFIG.length : null
    );
    setActiveIndex((prev) => (prev + 1) % SCREENSHOT_CONFIG.length);
  }, []);

  return (
    <section id="screenshots" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: "rgba(167,139,250,0.015)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(45,212,191,0.01)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              background: "rgba(45, 212, 191, 0.08)",
              color: "#2dd4bf",
              border: "1px solid rgba(45, 212, 191, 0.12)",
            }}
          >
            {t.screenshots.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.screenshots.title1}</span>
            <span className="text-themed-primary">{t.screenshots.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.screenshots.description}
          </p>
        </motion.div>

        {/* Grid layout */}
        <div
          ref={gridRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Desktop: 3 columns, Tablet: 2 columns, Mobile: horizontal scroll */}
          <div className="hidden lg:grid grid-cols-3 gap-4 sm:gap-5">
            {SCREENSHOT_CONFIG.map((shot, i) => (
              <ScreenshotCard
                key={shot.id}
                shotIndex={i}
                index={i}
                isActive={i === activeIndex}
                onClick={() => openLightbox(i)}
              />
            ))}
          </div>

          {/* Tablet: 2 columns */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4">
            {SCREENSHOT_CONFIG.map((shot, i) => (
              <ScreenshotCard
                key={shot.id}
                shotIndex={i}
                index={i}
                isActive={i === activeIndex}
                onClick={() => openLightbox(i)}
              />
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-thin">
            {SCREENSHOT_CONFIG.map((shot, i) => (
              <div key={shot.id} className="flex-shrink-0 w-[80vw] snap-center">
                <ScreenshotCard
                  shotIndex={i}
                  index={i}
                  isActive={i === activeIndex}
                  onClick={() => openLightbox(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-play toggle + indicator */}
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
          <motion.button
            onClick={() => setAutoPlay(!autoPlay)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              background: autoPlay
                ? "rgba(45, 212, 191, 0.1)"
                : "var(--hover-bg-strong)",
              border: autoPlay
                ? "1px solid rgba(45, 212, 191, 0.2)"
                : "1px solid var(--card-border)",
              color: autoPlay ? "#2dd4bf" : "var(--text-secondary)",
            }}
          >
            {autoPlay ? (
              <Pause size={14} className="text-[#2dd4bf]" />
            ) : (
              <Play size={14} />
            )}
            <span className="text-xs font-medium">
              {autoPlay ? t.screenshots.pausePlay : t.screenshots.autoPlay}
            </span>
          </motion.button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {SCREENSHOT_CONFIG.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? "20px" : "8px",
                  background:
                    i === activeIndex
                      ? "#2dd4bf"
                      : "var(--hover-bg-strong)",
                }}
                aria-label={`${t.screenshots.switchTo}${t.screenshots.items[i].title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightboxModal
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goToPrev}
            onNext={goToNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
