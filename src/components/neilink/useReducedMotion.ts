"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * useReducedMotion — SSR-compatible hook that returns true when the user
 * has enabled "prefers-reduced-motion: reduce" in their OS settings.
 *
 * Uses `useSyncExternalStore` to avoid setState-in-effect lint errors
 * and guarantee consistent server/client rendering.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export default function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
