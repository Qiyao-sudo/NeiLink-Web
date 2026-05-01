# Task 12-d: Light Mode Polish + Footer Consistency + Micro-style Details

## Work Summary

### 1. Light Mode Refinements (globals.css)
- **Card hover in light mode**: Added `:root:not(.dark) .feature-card-glow:hover` and `:root:not(.dark) .glass-card:hover` with `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)` for visible hover state
- **Section backgrounds**: Updated `--section-bg-alt: #f5f5f5` in `:root` for subtle alternating backgrounds
- **Gradient text in light mode**: Changed gradient from `#18181b, #14b8a6, #0d9488` to `#18181b, #0d9488, #14b8a6` for better contrast progression
- **Command palette in light mode**: Added `--command-backdrop: rgba(255, 255, 255, 0.6)` in light mode vs `rgba(0, 0, 0, 0.6)` in dark mode; applied via `command-palette-backdrop` class in CommandPalette.tsx
- **ScrollVelocityBar in light mode**: Added `.scroll-velocity-bar` CSS class with theme-aware gradient — dark mode gets `#2dd4bf → #a78bfa`, light mode gets `#0d9488 → #7c3aed` (darker/more saturated); updated ScrollVelocityBar.tsx to use this class

### 2. Footer Consistency (Footer.tsx)
- **External link icons**: Now ALL external links show the ExternalLink icon (previously highlighted links like "Star on GitHub" excluded it)
- **Link styling consistency**: All footer links now hover to teal (`hover:text-[#2dd4bf]`) instead of `hover:text-themed-secondary` for non-highlight and `hover:text-[#fbbf24]` for highlight
- **Newsletter input styling**: Added `focus:ring-2 focus:ring-[#f59e0b]/20` and changed `transition-colors` to `transition-all` for better focus visibility

### 3. Navbar Polish (Navbar.tsx)
- **Mobile menu**: Already had `backdrop-blur-2xl` — verified working correctly
- **Active section indicator**: Verified the sliding underline uses spring animation (`stiffness: 350, damping: 30`) and the layoutId active pill uses (`stiffness: 400, damping: 30`) — both smooth

### 4. Download Section Enhancement (DownloadSection.tsx)
- **Breathing glow animation**: Added `breathing-glow` CSS class to the recommended (Windows) download card; defined `@keyframes breathing-glow` (3s cycle, subtle amber glow pulse) and `@keyframes breathing-glow-light` for light mode
- **Version badge**: Added `VersionBadge` component that uses `useSyncExternalStore` to read version from `/api/github` endpoint; displays as a small pill badge next to the section title

### 5. Global CSS Micro-details (globals.css)
- **Custom selection color**: `::selection { background: rgba(45, 212, 191, 0.3); color: inherit; }`
- **Smooth scroll**: Already present — `html { scroll-behavior: smooth; }`
- **Focus-visible ring**: `:focus-visible { outline: 2px solid var(--primary, #2dd4bf); outline-offset: 2px; border-radius: 4px; }`
- **Scrollbar styling**: Widened from 6px to 8px, border-radius from 3px to 4px; hover state already present
- **Text-balance utility**: `.text-balance { text-wrap: balance; }` — applied to DownloadSection heading

### Lint Result
- `bun run lint` passes with zero errors
- Dev server compiles successfully
