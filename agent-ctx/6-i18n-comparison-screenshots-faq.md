# Task 6 — i18n Translation for ComparisonSection, ScreenshotsSection, FAQSection

## Summary
Translated all hardcoded Chinese text in the 3 specified components to use the `t.xxx` i18n reference system. Added extensive new keys to `types.ts`, `zh.ts`, and `en.ts` to support all text content.

## Changes Made

### types.ts
- **comparison section**: Added `tabSpeed`, `tabFeatures`, `statBadges`, `barMethods` (with `descriptions` and `tooltips` sub-objects for each of 4 methods), `metricLabels`, `featureNames`, `matrixToolLabels`, extended `calculator` with `subtitle`, `timeUnits`, `bottomNote`
- **screenshots section**: Added `items` array (with `title`, `desc`, `badge?`), `mockups` object (with `sidebar`, `main`, `share`, `manage`, `stats`, `settings`, `web` sub-objects), `lightbox` (close/prev/next), `viewLarge`, `autoPlay`, `pausePlay`, `switchTo`
- **faq section**: Added `description` field

### zh.ts / en.ts
- Updated all values to match the exact text that was hardcoded in the components
- Added all new translation entries for the new keys above
- Updated FAQ answers to match the component's actual text (which differed slightly from prior i18n values)

### ComparisonSection.tsx
- Added `import { useI18n } from "@/i18n"`
- Replaced `COMPARISON_DATA` with dynamic `comparisonData` built from `t.comparison.barMethods`
- Replaced `METRIC_LABELS` with `t.comparison.metricLabels`
- Replaced `SPEED_VALUES` with tooltip text from `t.comparison.barMethods[i].tooltips[key]`
- Replaced `FEATURE_MATRIX` with `FEATURE_MATRIX_STATUSES` + `t.comparison.featureNames`
- Replaced `MATRIX_TOOLS` labels with `t.comparison.matrixToolLabels`
- Replaced `STAT_BADGES` labels with `t.comparison.statBadges`
- `MetricBar` now receives `tooltipText` prop instead of looking up `SPEED_VALUES`
- `FeatureComparisonMatrix` uses its own `useI18n()` hook
- `SpeedCalculator` uses `t.comparison.calculator.*` and `t.comparison.calculator.timeUnits.*` for formatTime
- All section header text (badge, title, description) uses `t.comparison.*`

### ScreenshotsSection.tsx
- Added `import { useI18n } from "@/i18n"`
- Replaced `SCREENSHOTS` array with `SCREENSHOT_CONFIG` (static structure) + `t.screenshots.items[i]` for text
- `AppMockup` uses `useI18n()` directly for all mockup UI text (sidebar items, drag hint, select file, share labels, manage labels, stats labels, settings labels, web labels)
- `LightboxModal` uses `t.screenshots.lightbox.*` for aria-labels and info text
- `ScreenshotCard` uses `t.screenshots.items[i]`, `t.screenshots.viewLarge`
- Main component uses `t.screenshots.*` for header, auto-play button, dot indicator labels

### FAQSection.tsx
- Added `import { useI18n } from "@/i18n"`
- Removed `FAQ_DATA` constant; replaced with `t.faq.items.map()`
- Section header uses `t.faq.badge`, `t.faq.title1`, `t.faq.title2`, `t.faq.description`

## Verification
- `bun run lint` passes with zero errors
- Dev server compiles without errors
