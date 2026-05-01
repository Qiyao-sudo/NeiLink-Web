"use client";

import { useEffect, useRef, useCallback } from "react";
import useReducedMotion from "./useReducedMotion";

interface Point {
  x: number;
  y: number;
  age: number;
}

/**
 * CursorTrail — subtle, elegant cursor trail effect
 * Renders small fading dots that follow the mouse cursor
 * Uses canvas for performance (no DOM manipulation)
 * Respects prefers-reduced-motion: disables animation when preferred
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    // If user prefers reduced motion, don't set up the canvas animation at all
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Add a new point
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });
      // Keep max 30 points
      if (pointsRef.current.length > 30) {
        pointsRef.current.shift();
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const now = Date.now();

      // Draw trail points
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const age = (now - point.age) / 1000;
        const maxAge = 0.8; // seconds
        const life = 1 - Math.min(age / maxAge, 1);

        if (life <= 0) {
          points.splice(i, 1);
          i--;
          continue;
        }

        // Use the point's position relative to other points for color
        const progress = i / points.length;
        const size = 2 + progress * 3;
        const opacity = life * (0.15 + progress * 0.15);

        // Gradient from teal to amber along the trail
        const r = Math.round(45 + (245 - 45) * progress);
        const g = Math.round(212 + (158 - 212) * progress);
        const b = Math.round(191 + (11 - 191) * progress);

        ctx.beginPath();
        ctx.arc(point.x, point.y, size * life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }

      // Age points
      points.forEach((p) => {
        if (p.age === 0) p.age = now;
      });

      // Draw connecting lines between close points
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const age1 = (now - p1.age) / 1000;
        const age2 = (now - p2.age) / 1000;
        const life1 = 1 - Math.min(age1 / 0.8, 1);
        const life2 = 1 - Math.min(age2 / 0.8, 1);
        const avgLife = (life1 + life2) / 2;

        if (avgLife > 0.1) {
          const progress = i / points.length;
          const r = Math.round(45 + (245 - 45) * progress);
          const g = Math.round(212 + (158 - 212) * progress);
          const b = Math.round(191 + (11 - 191) * progress);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${avgLife * 0.06})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, reducedMotion]);

  // Don't render canvas if reduced motion is preferred, or on touch devices
  if (reducedMotion) return null;
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999]"
      style={{ opacity: 0.8 }}
      aria-hidden="true"
    />
  );
}
