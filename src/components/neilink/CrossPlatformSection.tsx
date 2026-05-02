"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Monitor, Laptop, Smartphone, Globe, Wifi, Radio } from "lucide-react";
import TextReveal from "./TextReveal";
import { useI18n } from "@/i18n";

/* ── Device layout data (non-translatable) ── */
interface CrossDevice {
  name: string;
  icon: React.ElementType;
  color: string;
  x: string;
  y: string;
  size: "lg" | "md";
}

const DEVICE_LAYOUT: {
  icon: React.ElementType;
  color: string;
  x: string;
  y: string;
  size: "lg" | "md";
}[] = [
  { icon: Monitor, color: "#2dd4bf", x: "15%", y: "25%", size: "lg" },
  { icon: Laptop, color: "#a78bfa", x: "45%", y: "15%", size: "lg" },
  { icon: Monitor, color: "#fb923c", x: "75%", y: "25%", size: "lg" },
  { icon: Smartphone, color: "#fb7185", x: "20%", y: "65%", size: "md" },
  { icon: Laptop, color: "#34d399", x: "50%", y: "70%", size: "md" },
  { icon: Globe, color: "#f59e0b", x: "80%", y: "65%", size: "md" },
];

function DeviceNode({
  device,
  index,
  isInView,
}: {
  device: CrossDevice;
  index: number;
  isInView: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;
    gsap.fromTo(
      nodeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: index * 0.12, ease: "back.out(1.7)" }
    );
  }, [isInView, index]);

  // Floating animation
  useEffect(() => {
    if (!nodeRef.current) return;
    const floatY = gsap.to(nodeRef.current, {
      y: `+=${8 + index * 2}`,
      duration: 2 + index * 0.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => { floatY.kill(); };
  }, [index]);

  const sizeClasses = device.size === "lg" ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16 sm:w-20 sm:h-20";
  const iconSize = device.size === "lg" ? 28 : 22;

  return (
    <div
      ref={nodeRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: device.x, top: device.y, opacity: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`${sizeClasses} rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300`}
        style={{
          background: isHovered ? `${device.color}12` : "rgba(20, 20, 26, 0.6)",
          border: `1px solid ${isHovered ? device.color + "30" : "rgba(255, 255, 255, 0.06)"}`,
          boxShadow: isHovered ? `0 4px 20px ${device.color}10` : "none",
        }}
        whileHover={{ scale: 1.1 }}
        animate={isHovered ? { rotate: [0, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <device.icon size={iconSize} style={{ color: device.color }} />
        <span className="text-[10px] sm:text-xs text-themed-secondary font-medium">{device.name}</span>
      </motion.div>

      {/* Pulse ring on hover */}
      {isHovered && (
        <motion.div
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border"
          style={{ borderColor: device.color + "20" }}
        />
      )}
    </div>
  );
}

function ConnectionLines({ isInView }: { isInView: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isInView || !svgRef.current) return;
    const paths = svgRef.current.querySelectorAll("line");
    paths.forEach((path, i) => {
      gsap.fromTo(
        path,
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 1, delay: i * 0.1, ease: "power2.out" }
      );
    });
  }, [isInView]);

  const connections = [
    { x1: "15%", y1: "25%", x2: "45%", y2: "15%" },
    { x1: "45%", y1: "15%", x2: "75%", y2: "25%" },
    { x1: "15%", y1: "25%", x2: "20%", y2: "65%" },
    { x1: "45%", y1: "15%", x2: "50%", y2: "70%" },
    { x1: "75%", y1: "25%", x2: "80%", y2: "65%" },
    { x1: "20%", y1: "65%", x2: "50%", y2: "70%" },
    { x1: "50%", y1: "70%", x2: "80%", y2: "65%" },
  ];

  return (
    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}
    </svg>
  );
}

export default function CrossPlatformSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Build devices with i18n names
  const deviceNames = [
    t.crossPlatform.devices[0].name,
    t.crossPlatform.devices[1].name,
    t.crossPlatform.devices[2].name,
    t.crossPlatform.browserDevices[0].name,
    t.crossPlatform.browserDevices[1].name,
    t.crossPlatform.browserDevices[2].name,
  ];
  const DEVICES: CrossDevice[] = DEVICE_LAYOUT.map((layout, i) => ({
    ...layout,
    name: deviceNames[i],
  }));

  // Build network features with i18n
  const NETWORK_FEATURES = t.crossPlatform.networkFeatures.map((feature, i) => ({
    icon: [Wifi, Radio, Globe][i],
    title: feature.title,
    desc: feature.desc,
  }));

  return (
    <section id="cross-platform" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[rgba(251,146,60,0.015)] rounded-full blur-[120px]" />
      </div>

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
            style={{ background: "rgba(251, 146, 60, 0.08)", color: "#fb923c", border: "1px solid rgba(251, 146, 60, 0.15)" }}
          >
            {t.crossPlatform.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <TextReveal text={t.crossPlatform.title1} mode="word" className="text-themed-primary" />
            <TextReveal text={t.crossPlatform.title2} mode="word" className="gradient-text" />
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.crossPlatform.description}
          </p>
        </motion.div>

        {/* Device network visualization */}
        <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] mb-16">
          {/* Center hub */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-[rgba(20,20,26,0.8)] border border-[rgba(255,255,255,0.08)] pulse-glow">
              <div className="text-center">
                <img src="./logo.png" alt="NeiLink" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain mx-auto mb-1" />
                <div className="text-[10px] text-themed-muted">{t.crossPlatform.centerLabel}</div>
              </div>
            </div>
          </motion.div>

          {/* Connection lines */}
          <ConnectionLines isInView={isInView} />

          {/* Device nodes */}
          {DEVICES.map((device, index) => (
            <DeviceNode key={index} device={device} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Network features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {NETWORK_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl glass-card group hover:border-[rgba(255,255,255,0.1)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={22} className="text-[#fb923c]" />
              </div>
              <h4 className="text-themed-primary font-semibold mb-2 group-hover:text-[#fb923c] transition-colors">
                {feature.title}
              </h4>
              <p className="text-sm text-themed-secondary group-hover:text-themed-primary transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
