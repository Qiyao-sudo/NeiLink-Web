"use client";

import useReducedMotion from "./useReducedMotion";

export default function NoiseOverlay() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return <div className="noise-overlay" aria-hidden="true" />;
}
