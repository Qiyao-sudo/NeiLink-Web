# Task 8-c: Enhance Trust Section + HowItWorks with animated elements

## Summary

Enhanced two NeiLink website sections with animated visual elements as specified.

## Files Modified

1. **`src/app/globals.css`** — Added 8 new CSS keyframes and 6 utility classes:
   - `.rotating-gradient-border` — Conic gradient border that rotates (8s cycle)
   - `.gentle-float` — Floating translateY oscillation for achievement badges
   - `.flow-line-draw` — SVG line draw animation (stroke-dashoffset)
   - `.pulse-line` — Pulsing opacity for connection lines
   - `.packet-dot` — Data packet travel animation
   - `.completion-indicator` — Completion checkmark fade-in

2. **`src/components/neilink/TrustSection.tsx`** — 3 enhancements:
   - `TechStackBadges` — 6 tech pills with stagger entrance (Electron, Node.js, TypeScript, AES-256, HTTP, WebSocket)
   - `rotating-gradient-border` on quote card — conic-gradient with 8s rotation
   - `FloatingBadge` — MIT License + v1.0.0 badges with gentle float animation
   - Fixed `loading` prop destructuring bug in StatItem

3. **`src/components/neilink/HowItWorksSection.tsx`** — 3 enhancements:
   - `FlowLines` — SVG connecting lines between steps with draw animation + pulse circles
   - `StepCompletionIndicator` — "✓ 完成" below each step card, sequential fade-in
   - `FlowDemo` — Interactive flow visualization with data packet dots traveling between nodes

## Verification

- `bun run lint` — zero errors
- Dev server compiles successfully, GET / 200
- All existing content preserved in both sections
