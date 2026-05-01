# Task 4-a: Trust Section & FAQ Section

## Task Summary
Created TrustSection and FAQSection components and wired them into the NeiLink website.

## Files Created
- `/home/z/my-project/src/components/neilink/TrustSection.tsx` - Social proof / trust section
- `/home/z/my-project/src/components/neilink/FAQSection.tsx` - FAQ section with accordion

## Files Modified
- `/home/z/my-project/src/app/page.tsx` - Added imports and inserted both sections with dividers
- `/home/z/my-project/src/components/neilink/ThemeToggle.tsx` - Fixed pre-existing lint error (useSyncExternalStore)
- `/home/z/my-project/worklog.md` - Appended work record

## Section Order in page.tsx (final)
1. HeroSection
2. FeaturesSection
3. HowItWorksSection
4. SecuritySection
5. **TrustSection** (NEW - between Security and CrossPlatform)
6. CrossPlatformSection
7. ComparisonSection
8. ScreenshotsSection
9. **FAQSection** (NEW - between Screenshots and Download)
10. DownloadSection

## Key Implementation Details

### TrustSection
- Custom `useCountUp` hook using `requestAnimationFrame` with ease-out cubic easing
- Avoids `set-state-in-effect` lint by not calling `setCount` when target is 0
- Returns `target === 0 ? 0 : count` to handle zero case without setState
- Floating orbs use inline `animation` style referencing `floatOrb0`/`floatOrb1` keyframes from globals.css
- Stats animation triggered by `useInView` with 300ms intentional delay via `setTimeout`

### FAQSection
- Uses shadcn/ui Accordion components from `@/components/ui/accordion`
- Custom glass-card styling applied via inline `style` on AccordionItem
- Border override: `!border-b-0` to remove default bottom border from shadcn accordion
- `no-underline hover:no-underline` on AccordionTrigger to override shadcn's default hover underline

### Lint Fix (ThemeToggle.tsx)
- Replaced `useState(false)` + `useEffect(() => setMounted(true), [])` with `useSyncExternalStore`
- Server snapshot: `() => false`, Client snapshot: `() => true`
- Eliminates `react-hooks/set-state-in-effect` lint error

## Verification
- `bun run lint` passes with zero errors
- Dev server compiles successfully
