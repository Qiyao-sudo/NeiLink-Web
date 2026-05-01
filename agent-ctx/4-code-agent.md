# Task 4 — i18n Translation for NeiLink Components

## Agent: Code Agent
## Status: ✅ Completed

## Summary
Translated 3 NeiLink website components (FeaturesSection, HowItWorksSection, SecuritySection) to use the i18n system, replacing all hardcoded Chinese text with `t.xxx` references.

## Changes Made

### 1. i18n Type Updates (`src/i18n/types.ts`)
- **features**: Added `learnMore: string` and `stats: { label: string }[]`
- **howItWorks**: Added `detail: string` to steps, `completed: string`, `flowLabels: { sender, lan, browser, receiver }`, `flowDemo: { title, sender, lan, receiver }`

### 2. Chinese Translations (`src/i18n/zh.ts`)
- Updated `features` section to match actual component content (8 feature cards with correct titles/descriptions, added learnMore and stats)
- Updated `howItWorks` section (4 steps with detail tags, flow labels, flow demo labels, completed text)
- Updated `security` section (6 security items matching actual component, updated encryption text)

### 3. English Translations (`src/i18n/en.ts`)
- Mirrored all zh.ts structural changes with proper English translations

### 4. FeaturesSection.tsx
- Added `import { useI18n } from "@/i18n"`
- Replaced `FEATURES` constant with `FEATURE_META` (icon + color only)
- Created `features` array inside component by merging `FEATURE_META` with `t.features.items[i]`
- Replaced badge text → `t.features.badge`
- Replaced title parts → `t.features.title1`, `t.features.title2`
- Replaced description → `t.features.description`
- Replaced "了解更多" → `t.features.learnMore`
- Replaced stat bar labels → `t.features.stats[i].label`

### 5. HowItWorksSection.tsx
- Added `import { useI18n } from "@/i18n"`
- Replaced `STEPS` constant with `STEP_META` (icon + number + color only)
- Created `steps` array inside component by merging `STEP_META` with `t.howItWorks.steps[i]`
- Replaced badge → `t.howItWorks.badge`
- Replaced title parts → `t.howItWorks.title1`, `t.howItWorks.title2`
- Replaced description → `t.howItWorks.description`
- Replaced step titles/descriptions/details → `t.howItWorks.steps[i].title/description/detail`
- Replaced "完成" → `t.howItWorks.completed` (in StepCompletionIndicator)
- Replaced flow labels → `t.howItWorks.flowLabels.*`
- Replaced FlowDemo labels → `t.howItWorks.flowDemo.*`

### 6. SecuritySection.tsx
- Added `import { useI18n } from "@/i18n"`
- Replaced `SECURITY_FEATURES` constant with `SECURITY_ICONS` (icon only)
- Created `securityFeatures` array inside component by merging with `t.security.items[i]`
- Replaced badge → `t.security.badge`
- Replaced title parts → `t.security.title1`, `t.security.title2`
- Replaced description → `t.security.description`
- Replaced security items → `t.security.items[i].title/description`
- Replaced encryption badge text → `t.security.encryption`

## Verification
- `bun run lint` — ✅ Zero errors
- TypeScript check — ✅ No new errors in modified files (pre-existing trust.badges type errors unrelated)
- Dev server — ✅ Compiles successfully
