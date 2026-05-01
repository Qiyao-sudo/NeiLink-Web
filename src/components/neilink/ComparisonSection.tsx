"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import {
  Zap,
  Shield,
  Wifi,
  HardDrive,
  TrendingUp,
  Cloud,
  MessageCircle,
  Calculator,
  ArrowRight,
  Check,
  X,
  Minus,
  Radio,
  Mail,
  Usb,
} from "lucide-react";
import TextReveal from "./TextReveal";
import { useI18n } from "@/i18n";

interface ComparisonItem {
  name: string;
  icon: React.ElementType;
  isHighlight: boolean;
  metrics: Record<string, number>;
  descriptions: Record<string, string>;
  tooltips: Record<string, string>;
}

const COMPARISON_ICONS = [Zap, HardDrive, Cloud, MessageCircle];
const COMPARISON_HIGHLIGHTS = [true, false, false, false];
const COMPARISON_METRICS = [
  { speed: 95, ease: 95, security: 90, noLimit: 100, noNetwork: 100 },
  { speed: 60, ease: 30, security: 50, noLimit: 40, noNetwork: 100 },
  { speed: 25, ease: 40, security: 60, noLimit: 30, noNetwork: 0 },
  { speed: 20, ease: 60, security: 40, noLimit: 15, noNetwork: 0 },
];

const METRIC_KEYS = ["speed", "ease", "security", "noLimit", "noNetwork"] as const;
const METRIC_ICONS: Record<string, React.ElementType> = {
  speed: TrendingUp,
  ease: Zap,
  security: Shield,
  noLimit: HardDrive,
  noNetwork: Wifi,
};

/* ── Feature Comparison Matrix Data ── */

type FeatureStatus = "yes" | "no" | "partial";

const FEATURE_MATRIX_STATUSES: { neilink: FeatureStatus; airdrop: FeatureStatus; wechat: FeatureStatus; email: FeatureStatus; usb: FeatureStatus }[] = [
  { neilink: "yes", airdrop: "yes", wechat: "no", email: "no", usb: "yes" },
  { neilink: "yes", airdrop: "yes", wechat: "partial", email: "no", usb: "no" },
  { neilink: "yes", airdrop: "no", wechat: "partial", email: "yes", usb: "no" },
  { neilink: "yes", airdrop: "no", wechat: "no", email: "yes", usb: "no" },
  { neilink: "yes", airdrop: "partial", wechat: "no", email: "no", usb: "yes" },
  { neilink: "yes", airdrop: "no", wechat: "no", email: "no", usb: "no" },
  { neilink: "yes", airdrop: "partial", wechat: "no", email: "no", usb: "yes" },
  { neilink: "yes", airdrop: "no", wechat: "no", email: "yes", usb: "yes" },
];

const MATRIX_TOOL_KEYS = ["neilink", "airdrop", "wechat", "email", "usb"] as const;
const MATRIX_TOOL_ICONS: Record<string, React.ElementType> = {
  neilink: Zap,
  airdrop: Radio,
  wechat: MessageCircle,
  email: Mail,
  usb: Usb,
};
const MATRIX_TOOL_HIGHLIGHTS: Record<string, boolean> = {
  neilink: true,
  airdrop: false,
  wechat: false,
  email: false,
  usb: false,
};

/* ── Feature Status Cell ── */

function FeatureCell({ status }: { status: FeatureStatus }) {
  if (status === "yes") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(52, 211, 153, 0.1)" }}>
          <Check size={14} className="text-[#34d399]" strokeWidth={3} />
        </div>
      </div>
    );
  }
  if (status === "no") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(251, 113, 133, 0.08)" }}>
          <X size={14} className="text-[#fb7185]" strokeWidth={3} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(251, 191, 36, 0.08)" }}>
        <Minus size={14} className="text-[#fbbf24]" strokeWidth={3} />
      </div>
    </div>
  );
}

/* ── MetricBar with Hover ── */

function MetricBar({
  value,
  color,
  delay,
  isInView,
  tooltipText,
  metricKey,
  barIndex,
  hoveredBar,
  onHover,
  onLeave,
  anyHovered,
}: {
  value: number;
  color: string;
  delay: number;
  isInView: boolean;
  tooltipText: string;
  metricKey: string;
  barIndex: number;
  hoveredBar: string | null;
  onHover: () => void;
  onLeave: () => void;
  anyHovered: boolean;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const barId = `${metricKey}-${barIndex}`;
  const isHovered = hoveredBar === barId;

  useEffect(() => {
    if (!isInView || !barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${value}%`, duration: 1, delay: delay, ease: "power3.out" }
    );
  }, [isInView, value, delay]);

  return (
    <div
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        opacity: anyHovered && !isHovered ? 0.5 : 1,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "0%",
            background: `linear-gradient(90deg, ${color}30, ${color})`,
          }}
        />
      </div>
      {isHovered && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap z-10 pointer-events-none"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border-hover)",
            color: "var(--text-primary)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}

/* ── Feature Comparison Matrix Component ── */

function FeatureComparisonMatrix() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();

  const matrixTools = MATRIX_TOOL_KEYS.map((key) => ({
    key,
    label: t.comparison.matrixToolLabels[key],
    icon: MATRIX_TOOL_ICONS[key],
    isHighlight: MATRIX_TOOL_HIGHLIGHTS[key],
  }));

  return (
    <div ref={ref} className="glass-card rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-themed-secondary p-3 w-[120px]">
                {t.comparison.table.feature}
              </th>
              {matrixTools.map((tool) => (
                <th
                  key={tool.key}
                  className="text-center p-3"
                  style={{
                    background: tool.isHighlight ? "rgba(52, 211, 153, 0.04)" : "transparent",
                    borderBottom: tool.isHighlight ? "2px solid rgba(52, 211, 153, 0.2)" : "2px solid var(--card-border)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <tool.icon
                      size={18}
                      className={tool.isHighlight ? "text-[#34d399]" : "text-themed-muted"}
                    />
                    <span
                      className={`text-xs font-semibold ${tool.isHighlight ? "text-[#34d399]" : "text-themed-secondary"}`}
                    >
                      {tool.label}
                    </span>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURE_MATRIX_STATUSES.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: rowIdx * 0.06, duration: 0.35 }}
                className="group"
              >
                <td
                  className="text-sm text-themed-secondary p-3 border-t"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  {t.comparison.featureNames[rowIdx]}
                </td>
                {matrixTools.map((tool) => (
                  <td
                    key={tool.key}
                    className="p-3 text-center border-t transition-colors"
                    style={{
                      borderColor: "var(--card-border)",
                      background: tool.isHighlight ? "rgba(52, 211, 153, 0.02)" : "transparent",
                    }}
                  >
                    <FeatureCell status={row[tool.key]} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile vertical list view */}
      <div className="md:hidden space-y-4">
        {/* Tool selector pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {matrixTools.map((tool) => (
            <div
              key={tool.key}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                tool.isHighlight
                  ? "text-[#34d399]"
                  : "text-themed-secondary"
              }`}
              style={{
                background: tool.isHighlight ? "rgba(52, 211, 153, 0.08)" : "var(--hover-bg)",
                border: tool.isHighlight
                  ? "1px solid rgba(52, 211, 153, 0.15)"
                  : "1px solid var(--card-border)",
              }}
            >
              <tool.icon size={12} />
              {tool.label}
            </div>
          ))}
        </div>

        {/* Feature rows as cards */}
        {FEATURE_MATRIX_STATUSES.map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: rowIdx * 0.05, duration: 0.3 }}
            className="p-3 rounded-xl"
            style={{
              background: "var(--hover-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="text-sm font-medium text-themed-secondary mb-2">
              {t.comparison.featureNames[rowIdx]}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {matrixTools.map((tool) => (
                <div key={tool.key} className="flex flex-col items-center gap-1">
                  <FeatureCell status={row[tool.key]} />
                  <span
                    className="text-[10px] text-themed-muted"
                  >
                    {tool.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ComparisonSection ── */

export default function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeMethod, setActiveMethod] = useState(0);
  const [activeTab, setActiveTab] = useState<"speed" | "features">("speed");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const { t } = useI18n();

  const anyBarHovered = hoveredBar !== null;

  const comparisonData: ComparisonItem[] = t.comparison.barMethods.map((method, i) => ({
    name: method.name,
    icon: COMPARISON_ICONS[i],
    isHighlight: COMPARISON_HIGHLIGHTS[i],
    metrics: COMPARISON_METRICS[i],
    descriptions: {
      speed: method.descriptions.speed,
      ease: method.descriptions.ease,
      security: method.descriptions.security,
      noLimit: method.descriptions.noLimit,
      noNetwork: method.descriptions.noNetwork,
    },
    tooltips: {
      speed: method.tooltips.speed,
      ease: method.tooltips.ease,
      security: method.tooltips.security,
      noLimit: method.tooltips.noLimit,
      noNetwork: method.tooltips.noNetwork,
    },
  }));

  const metricLabels = t.comparison.metricLabels;

  const statBadges = [
    { label: t.comparison.statBadges[0].label, color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.08)", borderColor: "rgba(245, 158, 11, 0.15)" },
    { label: t.comparison.statBadges[1].label, color: "#a78bfa", bgColor: "rgba(167, 139, 250, 0.08)", borderColor: "rgba(167, 139, 250, 0.15)" },
    { label: t.comparison.statBadges[2].label, color: "#34d399", bgColor: "rgba(52, 211, 153, 0.08)", borderColor: "rgba(52, 211, 153, 0.15)" },
  ];

  return (
    <section id="comparison" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[rgba(52,211,153,0.015)] rounded-full blur-[120px] pointer-events-none" />

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
            style={{ background: "rgba(52, 211, 153, 0.08)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.15)" }}
          >
            {t.comparison.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <TextReveal text={t.comparison.title1} mode="word" className="gradient-text" />
            <TextReveal text={t.comparison.title2} mode="word" className="text-themed-primary" />
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg mb-8">
            {t.comparison.description}
          </p>

          {/* Animated Stat Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {statBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                className="glass-card flex items-center gap-2 px-3.5 py-2 rounded-full"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}40` }}
                />
                <span
                  className="text-xs font-semibold whitespace-nowrap"
                  style={{ color: badge.color }}
                >
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab("speed")}
            className="relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === "speed" ? "rgba(45, 212, 191, 0.1)" : "transparent",
              color: activeTab === "speed" ? "#2dd4bf" : "var(--text-muted)",
              border: activeTab === "speed" ? "1px solid rgba(45, 212, 191, 0.2)" : "1px solid var(--card-border)",
            }}
          >
            {t.comparison.tabSpeed}
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className="relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === "features" ? "rgba(45, 212, 191, 0.1)" : "transparent",
              color: activeTab === "features" ? "#2dd4bf" : "var(--text-muted)",
              border: activeTab === "features" ? "1px solid rgba(45, 212, 191, 0.2)" : "1px solid var(--card-border)",
            }}
          >
            {t.comparison.tabFeatures}
          </button>
        </div>

        {/* Feature Comparison Matrix (shown when "features" tab is active) */}
        {activeTab === "features" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FeatureComparisonMatrix />
          </motion.div>
        )}

        {/* Speed Comparison (shown when "speed" tab is active) */}
        {activeTab === "speed" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Method selector (mobile) */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 lg:hidden">
              {comparisonData.map((method, i) => (
                <button
                  key={method.name}
                  onClick={() => setActiveMethod(i)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    i === activeMethod
                      ? "bg-[rgba(52,211,153,0.1)] text-[#34d399] border border-[rgba(52,211,153,0.2)]"
                      : "text-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Desktop: Full comparison table */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div />
                {comparisonData.map((method, i) => (
                  <motion.div
                    key={method.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`text-center p-4 rounded-xl transition-all ${
                      method.isHighlight
                        ? "bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.15)]"
                        : "bg-[rgba(20,20,26,0.4)] border border-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <method.icon
                      size={24}
                      className={`mx-auto mb-2 ${method.isHighlight ? "text-[#34d399]" : "text-[rgba(255,255,255,0.45)]"}`}
                    />
                    <div className={`font-semibold text-sm ${method.isHighlight ? "text-[#34d399]" : "text-themed-primary"}`}>
                      {method.name}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Metrics rows */}
              {METRIC_KEYS.map((key, rowIdx) => {
                const MetricIcon = METRIC_ICONS[key];
                const label = metricLabels[key];
                if (!MetricIcon || !label) return null;
                return (
                  <div key={key} className="grid grid-cols-5 gap-4 mb-3">
                    <div className="flex items-center gap-2 px-4 py-3">
                      <MetricIcon size={14} className="text-[rgba(255,255,255,0.35)]" />
                      <span className="text-sm text-[rgba(255,255,255,0.55)]">{label}</span>
                    </div>
                    {comparisonData.map((method, i) => (
                      <div
                        key={method.name}
                        className={`px-4 py-3 rounded-lg ${
                          method.isHighlight
                            ? "bg-[rgba(52,211,153,0.03)]"
                            : "bg-[rgba(20,20,26,0.2)]"
                        }`}
                      >
                        <MetricBar
                          value={method.metrics[key] || 0}
                          color={method.isHighlight ? "#34d399" : "rgba(255,255,255,0.2)"}
                          delay={rowIdx * 0.1 + i * 0.05}
                          isInView={isInView}
                          tooltipText={method.tooltips[key] || ""}
                          metricKey={key}
                          barIndex={i}
                          hoveredBar={hoveredBar}
                          onHover={() => setHoveredBar(`${key}-${i}`)}
                          onLeave={() => setHoveredBar(null)}
                          anyHovered={anyBarHovered}
                        />
                        <div className="mt-1.5 text-xs text-[rgba(255,255,255,0.35)]">
                          {method.descriptions[key] || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Mobile: Single method view */}
            <div className="lg:hidden">
              <motion.div
                key={activeMethod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-2xl ${
                  comparisonData[activeMethod].isHighlight
                    ? "glass-card border-[rgba(52,211,153,0.15)]"
                    : "bg-[rgba(20,20,26,0.4)] border border-[rgba(255,255,255,0.05)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const Icon = comparisonData[activeMethod].icon;
                    return <Icon size={24} className={comparisonData[activeMethod].isHighlight ? "text-[#34d399]" : "text-[rgba(255,255,255,0.45)]"} />;
                  })()}
                  <h3 className={`text-lg font-semibold ${comparisonData[activeMethod].isHighlight ? "text-[#34d399]" : "text-themed-primary"}`}>
                    {comparisonData[activeMethod].name}
                  </h3>
                </div>

                <div className="space-y-5">
                  {METRIC_KEYS.map((key, i) => {
                    const label = metricLabels[key];
                    if (!label) return null;
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[rgba(255,255,255,0.55)]">{label}</span>
                          <span className="text-sm text-[rgba(255,255,255,0.65)]">
                            {comparisonData[activeMethod].descriptions[key] || ""}
                          </span>
                        </div>
                        <MetricBar
                          value={comparisonData[activeMethod].metrics[key] || 0}
                          color={comparisonData[activeMethod].isHighlight ? "#34d399" : "rgba(255,255,255,0.2)"}
                          delay={i * 0.08}
                          isInView={isInView}
                          tooltipText={comparisonData[activeMethod].tooltips[key] || ""}
                          metricKey={key}
                          barIndex={activeMethod}
                          hoveredBar={hoveredBar}
                          onHover={() => setHoveredBar(`${key}-${activeMethod}`)}
                          onLeave={() => setHoveredBar(null)}
                          anyHovered={anyBarHovered}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Speed Calculator Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 sm:mt-20"
        >
          <SpeedCalculator />
        </motion.div>
      </div>
    </section>
  );
}

/** Interactive speed calculator: compare transfer times across methods */
function SpeedCalculator() {
  const [fileSize, setFileSize] = useState(500);
  const [unit, setUnit] = useState<"MB" | "GB">("MB");
  const { t } = useI18n();

  const getFileSizeMB = useCallback(() => {
    return unit === "GB" ? fileSize * 1024 : fileSize;
  }, [fileSize, unit]);

  const methods = [
    { name: t.comparison.calculator.methods[0].name, speed: 50, color: "#34d399", icon: Zap },
    { name: t.comparison.calculator.methods[1].name, speed: 15, color: "rgba(255,255,255,0.35)", icon: HardDrive },
    { name: t.comparison.calculator.methods[2].name, speed: 3, color: "rgba(255,255,255,0.25)", icon: Cloud },
    { name: t.comparison.calculator.methods[3].name, speed: 2, color: "rgba(255,255,255,0.2)", icon: MessageCircle },
  ];

  const formatTime = (seconds: number) => {
    if (seconds < 1) return t.comparison.calculator.timeUnits.lessThanSecond;
    if (seconds < 60) return `${Math.round(seconds)} ${t.comparison.calculator.timeUnits.second}`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t.comparison.calculator.timeUnits.minute} ${Math.round(seconds % 60)} ${t.comparison.calculator.timeUnits.second}`;
    return `${Math.floor(seconds / 3600)} ${t.comparison.calculator.timeUnits.hour} ${Math.floor((seconds % 3600) / 60)} ${t.comparison.calculator.timeUnits.minute}`;
  };

  const sizeMB = getFileSizeMB();
  const fastestTime = sizeMB / methods[0].speed;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
          <Calculator size={20} className="text-[#34d399]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-themed-primary">{t.comparison.calculator.title}</h3>
          <p className="text-xs text-themed-muted">{t.comparison.calculator.subtitle}</p>
        </div>
      </div>

      {/* Input area */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-themed-secondary">{t.comparison.calculator.sizeLabel}</span>
        <input
          type="range"
          min={unit === "MB" ? 1 : 1}
          max={unit === "MB" ? 2000 : 50}
          value={fileSize}
          onChange={(e) => setFileSize(Number(e.target.value))}
          className="flex-1 accent-[#34d399] h-2 rounded-full cursor-pointer"
          style={{ background: `linear-gradient(90deg, #34d399 ${((fileSize - (unit === "MB" ? 1 : 1)) / ((unit === "MB" ? 2000 : 50) - (unit === "MB" ? 1 : 1))) * 100}%, rgba(255,255,255,0.08) ${((fileSize - (unit === "MB" ? 1 : 1)) / ((unit === "MB" ? 2000 : 50) - (unit === "MB" ? 1 : 1))) * 100}%)` }}
        />
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-[#34d399] min-w-[50px] text-right">{fileSize}</span>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={() => { setUnit("MB"); setFileSize(Math.min(fileSize, 2000)); }}
              className={`px-2 py-1 text-xs font-medium transition-colors ${unit === "MB" ? "bg-[rgba(52,211,153,0.1)] text-[#34d399]" : "text-themed-muted hover:text-themed-secondary"}`}
            >
              MB
            </button>
            <button
              onClick={() => { setUnit("GB"); setFileSize(Math.min(fileSize, 50)); }}
              className={`px-2 py-1 text-xs font-medium transition-colors ${unit === "GB" ? "bg-[rgba(52,211,153,0.1)] text-[#34d399]" : "text-themed-muted hover:text-themed-secondary"}`}
            >
              GB
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {methods.map((method) => {
          const time = sizeMB / method.speed;
          const isFastest = method.name === t.comparison.calculator.methods[0].name;
          const barWidth = Math.min((fastestTime / time) * 100, 100);
          return (
            <div
              key={method.name}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isFastest ? "bg-[rgba(52,211,153,0.04)]" : "hover:bg-[rgba(255,255,255,0.02)]"}`}
            >
              <method.icon size={16} className={isFastest ? "text-[#34d399]" : "text-themed-muted"} />
              <span className={`text-sm font-medium min-w-[80px] ${isFastest ? "text-[#34d399]" : "text-themed-secondary"}`}>
                {method.name}
              </span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ background: `linear-gradient(90deg, ${method.color}30, ${method.color})` }}
                />
              </div>
              <span className={`text-sm font-semibold min-w-[80px] text-right ${isFastest ? "text-[#34d399]" : "text-themed-secondary"}`}>
                {formatTime(time)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-2 text-xs text-themed-muted">
          <ArrowRight size={12} className="text-[#34d399]" />
          <span>{t.comparison.calculator.bottomNote}</span>
        </div>
      </div>
    </div>
  );
}
