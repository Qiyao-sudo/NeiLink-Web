"use client";

import { useRef, useEffect, Suspense, useMemo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Shield, Key, Timer, Hash, Eye, Lock, type LucideIcon } from "lucide-react";
import TextReveal from "./TextReveal";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useI18n } from "@/i18n";

function Shield3D() {
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.2;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  const shieldShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.2;
    const h = 1.6;
    shape.moveTo(0, h * 0.5);
    shape.quadraticCurveTo(w * 0.1, h * 0.48, w * 0.4, h * 0.35);
    shape.quadraticCurveTo(w * 0.5, h * 0.28, w * 0.5, h * 0.05);
    shape.quadraticCurveTo(w * 0.5, -h * 0.2, 0, -h * 0.5);
    shape.quadraticCurveTo(-w * 0.5, -h * 0.2, -w * 0.5, h * 0.05);
    shape.quadraticCurveTo(-w * 0.5, h * 0.28, -w * 0.4, h * 0.35);
    shape.quadraticCurveTo(-w * 0.1, h * 0.48, 0, h * 0.5);
    return shape;
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Shield — violet/emerald for security */}
        <mesh ref={shieldRef}>
          <extrudeGeometry
            args={[shieldShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }]}
          />
          <meshPhysicalMaterial
            color="#a78bfa"
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.65}
            emissive="#7c3aed"
            emissiveIntensity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner glow */}
        <mesh scale={[0.85, 0.85, 0.85]}>
          <extrudeGeometry
            args={[shieldShape, { depth: 0.17, bevelEnabled: false }]}
          />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.03} side={THREE.DoubleSide} />
        </mesh>
      </Float>

      {/* Orbiting ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} />
      </mesh>

      {/* Particles around shield — mixed colors */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 1.8 + Math.random() * 0.5;
        const colors = ["#a78bfa", "#34d399", "#c4b5fd"];
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.7,
              (Math.random() - 0.5) * 0.5,
            ]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={colors[i % 3]} transparent opacity={0.25 + Math.random() * 0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

const SECURITY_ICONS: { icon: LucideIcon }[] = [
  { icon: Lock },
  { icon: Key },
  { icon: Timer },
  { icon: Hash },
  { icon: Eye },
  { icon: Shield },
];

interface SecurityFeatureItemData {
  icon: LucideIcon;
  title: string;
  desc: string;
}

function SecurityFeatureItem({
  feature,
  index,
}: {
  feature: SecurityFeatureItemData;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative flex items-start gap-4 p-4 rounded-xl cursor-pointer overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transition: "background-color 0.3s ease" }}
    >
      {/* Animated left-border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #a78bfa, #7c3aed)",
          width: isHovered ? "3px" : "0px",
          transition: "width 0.3s ease-out",
        }}
      />

      {/* Background slide-in effect */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "rgba(167, 139, 250, 0.04)",
          transform: isHovered ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s ease-out",
        }}
      />

      {/* Icon with slight rotation on hover */}
      <div
        className="relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(167,139,250,0.06)] border border-[rgba(167,139,250,0.1)] group-hover:bg-[rgba(167,139,250,0.1)] group-hover:border-[rgba(167,139,250,0.2)] transition-all"
        style={{
          transform: isHovered ? "rotate(-6deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <feature.icon size={18} className="text-[#a78bfa]" />
      </div>

      <div className="relative">
        <h4 className="text-themed-primary font-medium mb-1 group-hover:text-[#c4b5fd] transition-colors">
          {feature.title}
        </h4>
        <p className="text-sm text-themed-secondary group-hover:text-themed-primary transition-colors">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function SecuritySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const titleRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const securityFeatures: SecurityFeatureItemData[] = SECURITY_ICONS.map((item, i) => ({
    icon: item.icon,
    title: t.security.items[i].title,
    desc: t.security.items[i].description,
  }));

  useEffect(() => {
    if (!isInView || !titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, [isInView]);

  return (
    <section id="security" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[rgba(167,139,250,0.02)] rounded-full blur-[150px]" style={{ animation: "floatOrb1 25s ease-in-out infinite" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span
            className="section-badge mb-6"
            style={{ background: "rgba(167, 139, 250, 0.05)", color: "#a78bfa", borderLeftColor: "#a78bfa", borderRight: "1px solid rgba(167, 139, 250, 0.15)", borderTop: "1px solid rgba(167, 139, 250, 0.15)", borderBottom: "1px solid rgba(167, 139, 250, 0.15)" }}
          >
            {t.security.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <TextReveal text={t.security.title1} mode="char" className="text-themed-primary" />
            <TextReveal text={t.security.title2} mode="char" className="gradient-text" />
          </h2>
          <p className="text-themed-secondary max-w-2xl mx-auto text-base sm:text-lg">
            {t.security.description}
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* 3D Shield */}
          <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] order-1 lg:order-1">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-20 h-20 rounded-2xl border-2 border-[rgba(167,139,250,0.2)] flex items-center justify-center">
                  <Shield size={32} className="text-[#a78bfa] animate-spin" style={{ animationDuration: "4s" }} />
                </div>
                <span className="text-[10px] text-themed-muted tracking-wider">Loading 3D Shield...</span>
              </div>
            }>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
              >
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.6} color="#a78bfa" />
                <pointLight position={[-5, -5, 5]} intensity={0.3} color="#34d399" />
                <Shield3D />
              </Canvas>
            </Suspense>

            {/* Decorative elements — neutral */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[rgba(255,255,255,0.03)] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[rgba(255,255,255,0.02)] rounded-full pointer-events-none" />
          </div>

          {/* Security features list */}
          <div className="order-2 lg:order-2 space-y-3" ref={titleRef} style={{ opacity: 0 }}>
            {securityFeatures.map((feature, index) => (
              <SecurityFeatureItem key={index} feature={feature} index={index} />
            ))}

            {/* Encryption badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 p-4 rounded-xl glass-card flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                <Lock size={22} className="text-[#09090b] dark:text-white" />
              </div>
              <div>
                <div className="text-themed-primary font-semibold text-sm">AES-256-CBC</div>
                <div className="text-xs text-themed-secondary">
                  {t.security.encryption}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
