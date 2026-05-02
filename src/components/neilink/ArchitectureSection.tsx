"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Server,
  Smartphone,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/i18n";

/* ── Step indicator data (layout only, labels from i18n) ── */
const STEP_COLORS = ["#f59e0b", "#a78bfa", "#38bdf8", "#34d399"];

/* ── Device layout data ── */
interface ArchDevice {
  id: string;
  label: string;
  sublabel: string;
  Icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  color: string;
  desktopX: number;
  desktopY: number;
}

/* ── Connection layout data ── */
interface ArchConnection {
  from: string;
  to: string;
  label: string;
  color: string;
}

/* ── Floating particle along a path ── */
function FlowingParticle({
  pathD,
  duration,
  delay,
  color,
  id,
}: {
  pathD: string;
  duration: number;
  delay: number;
  color: string;
  id: string;
}) {
  return (
    <circle r="3" fill={color} opacity="0">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={pathD}
      />
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

/* ── Device Node component ── */
function DeviceNode({
  device,
  isHovered,
  onHover,
  onLeave,
  isInView,
  index,
}: {
  device: ArchDevice;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isInView: boolean;
  index: number;
}) {
  const { id, label, sublabel, Icon, color, desktopX, desktopY } = device;

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {/* Glow behind on hover */}
      <circle
        cx={desktopX}
        cy={desktopY}
        r="52"
        fill={isHovered ? `${color}10` : "transparent"}
        style={{ transition: "fill 0.3s ease" }}
      />

      {/* Card background */}
      <rect
        x={desktopX - 48}
        y={desktopY - 40}
        width={96}
        height={80}
        rx={16}
        fill={isHovered ? `${color}08` : "var(--card-bg)"}
        stroke={isHovered ? `${color}40` : "var(--card-border)"}
        strokeWidth={1}
        style={{ transition: "all 0.3s ease" }}
      />

      {/* Icon circle */}
      <circle
        cx={desktopX}
        cy={desktopY - 10}
        r={20}
        fill={`${color}10`}
        stroke={`${color}25`}
        strokeWidth={1}
      />

      {/* Icon */}
      <g transform={`translate(${desktopX}, ${desktopY - 10})`}>
        <g transform="translate(-10, -10)">
          <Icon
            size={20}
            color={color}
            style={{ opacity: isHovered ? 1 : 0.8, transition: "opacity 0.3s" }}
          />
        </g>
      </g>

      {/* Label */}
      <text
        x={desktopX}
        y={desktopY + 22}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize={12}
        fontWeight={600}
        style={{ transition: "fill 0.3s ease" }}
      >
        {label}
      </text>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <rect
              x={desktopX - 80}
              y={desktopY - 72}
              width={160}
              height={26}
              rx={8}
              fill="var(--card-bg)"
              stroke="var(--card-border-hover)"
              strokeWidth={1}
            />
            <text
              x={desktopX}
              y={desktopY - 55}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize={10}
            >
              {sublabel}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Entrance animation wrapper */}
      {!isInView && (
        <rect
          x={desktopX - 48}
          y={desktopY - 40}
          width={96}
          height={80}
          rx={16}
          fill="var(--section-bg)"
        />
      )}
    </g>
  );
}

/* ── Encryption center visualization ── */
function EncryptionCenter({
  isHovered,
  onHover,
  onLeave,
  isInView,
  encryptionHoverTitle,
  encryptionHoverDetail,
}: {
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isInView: boolean;
  encryptionHoverTitle: string;
  encryptionHoverDetail: string;
}) {
  const cx = 360;
  const cy = 140;

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r="36"
        fill={isHovered ? "#a78bfa08" : "transparent"}
        style={{ transition: "fill 0.3s ease" }}
      />

      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r="28"
        fill="var(--card-bg)"
        stroke={isHovered ? "#a78bfa40" : "var(--card-border)"}
        strokeWidth={1}
        style={{ transition: "all 0.3s ease" }}
      />

      {/* Rotating dashed ring */}
      <circle
        cx={cx}
        cy={cy}
        r="34"
        fill="none"
        stroke="#a78bfa30"
        strokeWidth={1}
        strokeDasharray="4 4"
        style={{
          animation: "arch-spin-slow 20s linear infinite",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />

      {/* Lock icon */}
      <g transform={`translate(${cx}, ${cy})`}>
        <g transform="translate(-8, -12)">
          <Lock
            size={16}
            color="#a78bfa"
            style={{ transition: "opacity 0.3s" }}
          />
        </g>
      </g>

      {/* AES-256 label */}
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fill="#a78bfa"
        fontSize={8}
        fontWeight={700}
        letterSpacing="0.5"
      >
        AES-256
      </text>

      {/* Hover detail */}
      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <rect
              x={cx - 85}
              y={cy + 40}
              width={170}
              height={44}
              rx={10}
              fill="var(--card-bg)"
              stroke="var(--card-border-hover)"
              strokeWidth={1}
            />
            <text
              x={cx}
              y={cy + 56}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize={9}
              fontWeight={600}
            >
              {encryptionHoverTitle}
            </text>
            <text
              x={cx}
              y={cy + 72}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={8}
            >
              {encryptionHoverDetail}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

/* ── Main ArchitectureSection ── */
export default function ArchitectureSection() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [encryptionHovered, setEncryptionHovered] = useState(false);

  // Build STEPS with i18n labels
  const STEPS = t.architecture.stepLabels.map((label, i) => ({
    num: i + 1,
    label,
    color: STEP_COLORS[i],
  }));

  // Build DEVICES with i18n labels
  const DEVICES: ArchDevice[] = [
    {
      id: "sender",
      label: t.architecture.sender,
      sublabel: t.architecture.senderSublabel,
      Icon: Monitor,
      color: "#f59e0b",
      desktopX: 200,
      desktopY: 60,
    },
    {
      id: "server",
      label: t.architecture.server,
      sublabel: t.architecture.serverSublabel,
      Icon: Server,
      color: "#38bdf8",
      desktopX: 200,
      desktopY: 220,
    },
    {
      id: "receiver",
      label: t.architecture.receiver,
      sublabel: t.architecture.receiverSublabel,
      Icon: Smartphone,
      color: "#34d399",
      desktopX: 520,
      desktopY: 220,
    },
  ];

  // Build CONNECTIONS with i18n labels
  const CONNECTIONS: ArchConnection[] = [
    { from: "sender", to: "server", label: t.architecture.encrypted, color: "#a78bfa" },
    { from: "server", to: "receiver", label: t.architecture.lanDistribution, color: "#38bdf8" },
  ];

  // SVG viewbox dimensions
  const vbWidth = 720;
  const vbHeight = 300;

  // Path data for connections
  const senderToServer = `M${DEVICES[0].desktopX},${DEVICES[0].desktopY + 40} L${DEVICES[1].desktopX},${DEVICES[1].desktopY - 40}`;
  const serverToReceiver = `M${DEVICES[1].desktopX + 48},${DEVICES[1].desktopY} L${DEVICES[2].desktopX - 48},${DEVICES[2].desktopY}`;

  return (
    <section
      id="architecture"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* FloatingOrbs background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.03), transparent 70%)",
            filter: "blur(80px)",
            animation: "floatOrb0 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.025), transparent 70%)",
            filter: "blur(90px)",
            animation: "floatOrb1 25s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
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
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.15)",
            }}
          >
            {t.architecture.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.architecture.title1}</span>
            <span className="text-themed-primary">{t.architecture.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.architecture.description}
          </p>
        </motion.div>

        {/* Main content: Diagram + Steps */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Step indicators (left side on desktop, top on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-0 lg:py-8 order-2 lg:order-1"
          >
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex lg:flex-row items-center gap-3">
                {/* Vertical connector line */}
                {i > 0 && (
                  <div
                    className="hidden lg:block w-px h-8 -mr-6"
                    style={{
                      background: `linear-gradient(to bottom, ${STEPS[i - 1].color}30, ${step.color}30)`,
                    }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${step.color}12`,
                      color: step.color,
                      border: `1px solid ${step.color}25`,
                    }}
                  >
                    {step.num}
                  </div>
                  <span className="text-sm text-themed-secondary whitespace-nowrap hidden sm:block">
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* SVG Network Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full max-w-2xl order-1 lg:order-2"
          >
            <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(56,189,248,0.05), transparent 60%)",
                }}
              />

              <svg
                viewBox={`0 0 ${vbWidth} ${vbHeight}`}
                className="w-full h-auto"
                style={{ minHeight: 240 }}
              >
                <defs>
                  {/* Gradient for sender→server line */}
                  <linearGradient
                    id="grad-sender-server"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Gradient for server→receiver line */}
                  <linearGradient
                    id="grad-server-receiver"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Arrow marker */}
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 8 3, 0 6"
                      fill="var(--text-muted)"
                      opacity="0.5"
                    />
                  </marker>
                </defs>

                {/* ── Connection lines ── */}

                {/* Sender → Server */}
                <motion.path
                  d={senderToServer}
                  fill="none"
                  stroke="url(#grad-sender-server)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1.2, delay: 0.5 }}
                  style={{
                    opacity:
                      hoveredNode && hoveredNode !== "sender" && hoveredNode !== "server"
                        ? 0.2
                        : 1,
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Server → Receiver */}
                <motion.path
                  d={serverToReceiver}
                  fill="none"
                  stroke="url(#grad-server-receiver)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1.2, delay: 0.7 }}
                  style={{
                    opacity:
                      hoveredNode && hoveredNode !== "server" && hoveredNode !== "receiver"
                        ? 0.2
                        : 1,
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Connection labels */}
                <motion.text
                  x={170}
                  y={148}
                  textAnchor="middle"
                  fill="#a78bfa"
                  fontSize={9}
                  fontWeight={600}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.7 } : {}}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  {CONNECTIONS[0].label}
                </motion.text>
                <motion.text
                  x={360}
                  y={208}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize={9}
                  fontWeight={600}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.7 } : {}}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {CONNECTIONS[1].label}
                </motion.text>

                {/* ── Flowing particles ── */}
                {isInView && (
                  <>
                    {/* Particles along sender→server */}
                    <FlowingParticle
                      pathD={senderToServer}
                      duration={2.5}
                      delay={0}
                      color="#a78bfa"
                      id="ps1"
                    />
                    <FlowingParticle
                      pathD={senderToServer}
                      duration={2.5}
                      delay={0.8}
                      color="#f59e0b"
                      id="ps2"
                    />
                    <FlowingParticle
                      pathD={senderToServer}
                      duration={3}
                      delay={1.6}
                      color="#a78bfa"
                      id="ps3"
                    />

                    {/* Particles along server→receiver */}
                    <FlowingParticle
                      pathD={serverToReceiver}
                      duration={2.5}
                      delay={0.4}
                      color="#38bdf8"
                      id="pr1"
                    />
                    <FlowingParticle
                      pathD={serverToReceiver}
                      duration={2.5}
                      delay={1.2}
                      color="#34d399"
                      id="pr2"
                    />
                    <FlowingParticle
                      pathD={serverToReceiver}
                      duration={3}
                      delay={2.0}
                      color="#38bdf8"
                      id="pr3"
                    />
                  </>
                )}

                {/* ── Encryption center ── */}
                <EncryptionCenter
                  isHovered={encryptionHovered}
                  onHover={() => setEncryptionHovered(true)}
                  onLeave={() => setEncryptionHovered(false)}
                  isInView={isInView}
                  encryptionHoverTitle={t.architecture.encryptionHoverTitle}
                  encryptionHoverDetail={t.architecture.encryptionHoverDetail}
                />

                {/* ── Device nodes ── */}
                {DEVICES.map((device, index) => (
                  <DeviceNode
                    key={device.id}
                    device={device}
                    isHovered={hoveredNode === device.id}
                    onHover={() => setHoveredNode(device.id)}
                    onLeave={() => setHoveredNode(null)}
                    isInView={isInView}
                    index={index}
                  />
                ))}

                {/* ── Decorative edge particles ── */}
                {isInView && (
                  <>
                    {/* Small floating dots around the edges */}
                    <circle cx="50" cy="150" r="1.5" fill="#38bdf8" opacity="0.3">
                      <animate
                        attributeName="opacity"
                        values="0.1;0.4;0.1"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="670" cy="80" r="1.5" fill="#a78bfa" opacity="0.3">
                      <animate
                        attributeName="opacity"
                        values="0.1;0.5;0.1"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="600" cy="260" r="1.5" fill="#34d399" opacity="0.3">
                      <animate
                        attributeName="opacity"
                        values="0.15;0.45;0.15"
                        dur="3.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="100" cy="50" r="1" fill="#f59e0b" opacity="0.3">
                      <animate
                        attributeName="opacity"
                        values="0.1;0.35;0.1"
                        dur="2.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="500" cy="30" r="1" fill="#38bdf8" opacity="0.25">
                      <animate
                        attributeName="opacity"
                        values="0.1;0.3;0.1"
                        dur="3.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}
              </svg>

              {/* CSS for SVG animations */}
              <style jsx>{`
                @keyframes arch-spin-slow {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          </motion.div>

          {/* Feature description cards (right side on desktop, bottom on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-3 w-full lg:w-56 order-3"
          >
            {/* Encryption card */}
            <div className="glass-card rounded-xl p-4 group hover:border-[rgba(167,139,250,0.2)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound
                  size={14}
                  className="text-[#a78bfa] group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-semibold text-[#a78bfa]">
                  {t.architecture.featureCards[0].title}
                </span>
              </div>
              <p className="text-xs text-themed-secondary leading-relaxed">
                {t.architecture.featureCards[0].description}
              </p>
            </div>

            {/* LAN card */}
            <div className="glass-card rounded-xl p-4 group hover:border-[rgba(56,189,248,0.2)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight
                  size={14}
                  className="text-[#38bdf8] group-hover:translate-x-0.5 transition-transform"
                />
                <span className="text-xs font-semibold text-[#38bdf8]">
                  {t.architecture.featureCards[1].title}
                </span>
              </div>
              <p className="text-xs text-themed-secondary leading-relaxed">
                {t.architecture.featureCards[1].description}
              </p>
            </div>

            {/* No install card */}
            <div className="glass-card rounded-xl p-4 group hover:border-[rgba(52,211,153,0.2)] transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2
                  size={14}
                  className="text-[#34d399] group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-semibold text-[#34d399]">
                  {t.architecture.featureCards[2].title}
                </span>
              </div>
              <p className="text-xs text-themed-secondary leading-relaxed">
                {t.architecture.featureCards[2].description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile step indicators (visible on small screens only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8 sm:hidden"
        >
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: `${step.color}12`,
                  color: step.color,
                  border: `1px solid ${step.color}25`,
                }}
              >
                {step.num}
              </div>
              <span className="text-[10px] text-themed-muted">{step.label}</span>
              {i < STEPS.length - 1 && (
                <ArrowRight size={10} className="text-themed-muted mx-0.5" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
