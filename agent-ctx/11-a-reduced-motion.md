# Task 11-a: Add prefers-reduced-motion support across all animations

## Summary

Successfully added comprehensive `prefers-reduced-motion` accessibility support across the entire NeiLink landing page. When a user has the "reduce motion" system setting enabled, all animations are disabled or minimized.

## Files Created

1. **`/home/z/my-project/src/components/neilink/useReducedMotion.ts`** — SSR-compatible React hook
   - Uses `useSyncExternalStore` for SSR compatibility (server returns `false`)
   - Subscribes to `window.matchMedia('(prefers-reduced-motion: reduce)')` for real-time changes
   - Returns `boolean` — true if user prefers reduced motion

## Files Modified

2. **`/home/z/my-project/src/app/globals.css`** — Global `@media (prefers-reduced-motion: reduce)` block
   - Disables all CSS keyframe animations (duration: 0.01ms, iteration-count: 1)
   - Disables CSS transitions (duration: 0.01ms)
   - Hides decorative animated elements (floating orbs, shimmer, pulse-glow, wave-sway, particle-dots, etc.)
   - Freezes rotating gradient borders
   - Disables slot machine roll animation

3. **`/home/z/my-project/src/components/neilink/CursorTrail.tsx`** — Canvas cursor trail
   - Returns `null` (no canvas) when reduced motion preferred
   - Doesn't set up animation loop at all

4. **`/home/z/my-project/src/components/neilink/ParallaxProvider.tsx`** — GSAP ScrollTrigger parallax
   - Skips all `.to()` and `.fromTo()` calls when reduced motion preferred
   - No ScrollTrigger instances created

5. **`/home/z/my-project/src/components/neilink/SectionNav.tsx`** — Active dot pulse ring
   - Disables `animate-ping` pulse ring on active dot when reduced motion
   - Framer Motion entrance uses `initial={false}` and `duration: 0`

6. **`/home/z/my-project/src/components/neilink/ScrollVelocityBar.tsx`** — Velocity color/glow
   - Removes velocity-based color changes (always teal when reduced motion)
   - Removes glow effects entirely
   - Removes height change based on velocity
   - Progress bar remains functional (static teal color)

7. **`/home/z/my-project/src/components/neilink/LiveDemoSection.tsx`** — Data flow packets
   - `DataFlowDots`: Shows static connection line instead of animated traveling dots
   - Disables infinite bounce on arrow indicators
   - Disables blinking status dots
   - All Framer Motion transitions use `duration: 0` when reduced motion
   - `whileHover`/`whileTap` scale effects disabled

8. **`/home/z/my-project/src/components/neilink/TerminalBlock.tsx`** — Typing animation
   - Shows all 5 terminal lines immediately (no typing animation)
   - No infinite loop
   - No cursor blink
   - No pause-on-hover

9. **`/home/z/my-project/src/components/neilink/HeroSection.tsx`** — Per-letter title + bounce
   - `AnimatedTitle`: Shows full text immediately without per-character GSAP animation
   - No light sweep effect
   - No "探索更多" bounce (ArrowDown stays static)
   - No mouse-follow gradient
   - No gradient mesh blobs
   - No magnetic button effect
   - No ripple click effect
   - `FloatingBadge` uses `initial={false}` and `duration: 0`
   - `whileHover`/`whileTap` scale effects disabled

10. **`/home/z/my-project/src/components/neilink/SectionReveal.tsx`** — Scroll-reveal wrapper
    - `initial={false}` when reduced motion
    - `transition: { duration: 0 }` when reduced motion

11. **`/home/z/my-project/src/components/neilink/BackToTop.tsx`** — Back-to-top button
    - `initial={false}` when reduced motion
    - `whileHover`/`whileTap` disabled

12. **`/home/z/my-project/src/components/neilink/FloatingOrbs.tsx`** — Ambient background orbs
    - Returns `null` (doesn't render at all) when reduced motion

13. **`/home/z/my-project/src/components/neilink/NetworkScene.tsx`** — Three.js particles
    - `NetworkParticles`: Skips velocity, wave motion, and mouse influence when reduced motion
    - `DataFlowRings`: Freezes ring rotations when reduced motion
    - Particles remain visible but static

14. **`/home/z/my-project/src/components/neilink/ScrollProgress.tsx`** — Scroll progress bar
    - Removes CSS transition when reduced motion

## Verification

- `bun run lint` passes with zero errors and zero warnings
- Dev server compiles successfully with no errors
- All changes are additive — no existing functionality broken when reduced motion is NOT preferred
