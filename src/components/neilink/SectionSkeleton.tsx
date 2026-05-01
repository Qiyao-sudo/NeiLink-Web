"use client";

/**
 * SectionSkeleton — Minimal loading placeholder for lazy-loaded sections.
 * Uses glass-card styling with a subtle shimmer pulse to indicate loading.
 * Prevents layout shift by reserving vertical space with minHeight.
 */
export default function SectionSkeleton({
  height = 400,
}: {
  height?: number;
}) {
  return (
    <div
      className="glass-card rounded-2xl mx-auto max-w-6xl w-full"
      style={{ minHeight: `${height}px` }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        {/* Shimmer bar */}
        <div
          className="w-48 h-4 rounded-full shimmer"
          style={{ opacity: 0.4 }}
        />
        <div
          className="w-32 h-3 rounded-full shimmer"
          style={{ opacity: 0.25, animationDelay: "0.3s" }}
        />
        <div
          className="w-64 h-3 rounded-full shimmer"
          style={{ opacity: 0.2, animationDelay: "0.6s" }}
        />
      </div>
    </div>
  );
}
