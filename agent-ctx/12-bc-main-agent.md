# Task 12-b & 12-c — ScrollTimeline + SectionDivider

## Task 12-b: ScrollTimeline Component

Created `/home/z/my-project/src/components/neilink/ScrollTimeline.tsx`:
- Fixed vertical timeline bar on left side of viewport (left: 16px, top: 50%, translateY(-50%))
- Only visible on desktop (`hidden lg:flex`)
- 14 dots (one per section) connected by vertical lines
- Dot states:
  - Default: 6px circle, rgba(255,255,255,0.15) border, transparent fill
  - Active: 8px circle, #2dd4bf fill with subtle glow (box-shadow)
  - Visited: 6px circle, rgba(45,212,191,0.4) fill
  - Hover: glass-card tooltip showing section name to the right
- Connecting lines: default 1px rgba(255,255,255,0.08), visited portion uses teal gradient at 60% opacity
- Active dot has ping animation ring
- Progress percentage text at bottom ("35%") with monospace font
- Click on dot smooth-scrolls to that section
- Framer Motion entrance animation (slides in from left, 0.6s with 0.5s delay)
- IntersectionObserver for active section tracking
- Scroll position for visited index and progress calculation
- useReducedMotion support — disables ping animation and entrance animation
- Section IDs: hero, features, how-it-works, security, trust, cross-platform, architecture, comparison, screenshots, faq, changelog, testimonials, live-demo, download
- Section labels: 首页, 功能, 原理, 安全, 信赖, 跨平台, 架构, 对比, 截图, 问答, 日志, 评价, 演示, 下载

## Task 12-c: SectionDivider Component

Created `/home/z/my-project/src/components/neilink/SectionDivider.tsx`:
- Three variants: 'wave' (default), 'gradient', 'dots'
- Props: `variant?: 'wave' | 'gradient' | 'dots'`, `flip?: boolean`
- Wave variant: SVG wave path with gradient fill (primary color to transparent), 32px height, slow horizontal drift animation (20s cycle via .wave-drift CSS class)
- Gradient variant: Horizontal gradient line fading in/out from center, 2px height, 0.25 opacity
- Dots variant: 3 animated dots with dot-pulse keyframe animation, 16px height, staggered delays (0.3s)
- Flip prop: flips wave SVG vertically via scaleY(-1)
- Framer Motion fade-in entrance animation (useInView, once: true)
- Theme-aware: uses var(--primary) for colors
- useReducedMotion support — disables animations

## CSS Additions (globals.css)
- `@keyframes wave-drift` — translateX animation for wave SVG (20s infinite)
- `.wave-drift` — applies the wave drift animation
- `@keyframes dot-pulse` — opacity + scale pulse for dots (0.2→0.6 opacity, scale 1→1.3)
- Added `.wave-drift` to prefers-reduced-motion hide list

## page.tsx Updates
- Imported ScrollTimeline and SectionDivider
- Added `<ScrollTimeline />` after `<SectionNav />`
- Replaced all 13 `<div className="section-divider" />` with `<SectionDivider />` using alternating variants:
  - After Hero: wave
  - After Features: gradient
  - After HowItWorks: dots
  - After Security: wave (flip)
  - After Trust: gradient
  - After CrossPlatform: wave
  - After Architecture: dots
  - After Comparison: gradient
  - After Screenshots: wave (flip)
  - After FAQ: dots
  - After Changelog: wave
  - After Testimonials: gradient
  - After LiveDemo: wave (flip)

## Pre-existing Fix
- Fixed OnboardingTour.tsx lint errors:
  - Moved `completeTour` useCallback before `computePosition` to fix "accessed before declared" error
  - Added `completeTour` to computePosition dependency array
  - Wrapped computePosition call in useEffect with requestAnimationFrame to fix "set-state-in-effect" lint error

## Verification
- `bun run lint` — zero errors
- Dev server compiles successfully
- `.section-divider` CSS class preserved for backward compatibility
