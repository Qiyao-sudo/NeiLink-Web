# Task 12-a: Create Interactive Onboarding Tour Component

## Agent: Main Agent
## Status: Completed

## Work Log

- Read existing project files (page.tsx, worklog.md, component directory)
- Identified section IDs: hero, features, security, live-demo, comparison, download
- Reviewed CommandPalette and KeyboardShortcutsOverlay for patterns (useSyncExternalStore, Framer Motion AnimatePresence, glass-card styling)
- Created OnboardingTour component at `/home/z/my-project/src/components/neilink/OnboardingTour.tsx`
- Added CSS keyframes to globals.css: `tour-spotlight-pulse` and `tour-spotlight-glow`
- Integrated OnboardingTour into page.tsx after KeyboardShortcutsOverlay
- Fixed lint error (completeTour declared after computePosition — reordered hooks)
- Lint passes with zero errors, dev server compiles successfully

## Component Features

1. **Auto-start**: Triggers 2s after first visit if `neilink-tour-completed` not in localStorage
2. **6 Tour Steps**: Hero → Features → Security → Live Demo → Comparison → Download
3. **Spotlight Effect**: Dark overlay (rgba(0,0,0,0.75)) with clip-path cutout for target section
4. **Animated Border**: 2px dashed teal border with pulse animation on spotlight
5. **Subtle Glow**: Box-shadow glow around spotlight with breathing animation
6. **Glass Tooltip Card**: Positioned auto (top/bottom/left/right), glass-card style with backdrop blur
7. **Step Number Badge**: Teal gradient circle with step number
8. **Navigation**: "上一步" / "下一步" buttons, "跳过导览" link, "知道了！" on last step
9. **Progress Dots**: 6 dots with active one elongated (20px wide) and teal gradient
10. **Keyboard Navigation**: Escape to skip, ArrowRight/Enter for next, ArrowLeft for previous
11. **Window Resize**: Recomputes spotlight position on resize via requestAnimationFrame
12. **Missing Element Handling**: Skips step if target element not found
13. **Mobile Responsive**: Fixed bottom tooltip on mobile (<768px)
14. **Restart Button**: "?" button (HelpCircle icon) fixed at bottom-left after tour completes
15. **useSyncExternalStore**: Used for localStorage check, mounted state, and mobile detection
16. **Framer Motion**: AnimatePresence for tooltip transitions with directional slide+fade

## Files Modified

- `/home/z/my-project/src/components/neilink/OnboardingTour.tsx` — New component (693 lines)
- `/home/z/my-project/src/app/globals.css` — Added tour-spotlight-pulse and tour-spotlight-glow keyframes
- `/home/z/my-project/src/app/page.tsx` — Imported and added OnboardingTour after KeyboardShortcutsOverlay
