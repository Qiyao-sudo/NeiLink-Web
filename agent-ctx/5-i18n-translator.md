# Task 5: i18n Translation for TrustSection, CrossPlatformSection, ArchitectureSection

## Summary
Successfully translated all 3 components from hardcoded Chinese text to i18n references using the `useI18n` hook.

## Changes Made

### i18n Type & Translation Updates
- **types.ts**: Added new keys to `crossPlatform` (`browserDevices`, `networkFeatures`, `centerLabel`) and `architecture` (`server`, `lanDistribution`, `stepLabels`, `senderSublabel`, `serverSublabel`, `receiverSublabel`, `encryptionHoverTitle`, `encryptionHoverDetail`, `featureCards`)
- **zh.ts**: Updated translations to match original component text (e.g., changed `title1` from "一个工具，" to "一个链接，" for crossPlatform, from "精巧架构，" to "网络拓扑" for architecture). Added all new Chinese translations.
- **en.ts**: Added corresponding English translations for all new keys. Updated existing keys to match component intent.

### TrustSection.tsx
- Added `import { useI18n } from "@/i18n"` and `const { t } = useI18n()`
- Replaced: badge, title1/title2, description, stat labels/suffixes (stars, speed, leaks, loading), trust badges (4 items), quote, quoteAttribution, floating badges (mitLicense, version)

### CrossPlatformSection.tsx
- Added `import { useI18n } from "@/i18n"` and `const { t } = useI18n()`
- Extracted `DEVICE_LAYOUT` (non-translatable layout data) as module-level constant with `CrossDevice` interface
- Built `DEVICES` array inside component with i18n names from `t.crossPlatform.devices` and `t.crossPlatform.browserDevices`
- Built `NETWORK_FEATURES` from `t.crossPlatform.networkFeatures`
- Replaced: badge, title1/title2, description, center label, device names, network feature titles/descriptions

### ArchitectureSection.tsx
- Added `import { useI18n } from "@/i18n"` and `const { t } = useI18n()`
- Extracted `STEP_COLORS` as module-level constant; built `STEPS` inside component from `t.architecture.stepLabels`
- Built `DEVICES` (ArchDevice[]) inside component with i18n labels/sublabels from `t.architecture.sender/server/receiver` and sublabels
- Built `CONNECTIONS` (ArchConnection[]) inside component with i18n labels from `t.architecture.encrypted` and `t.architecture.lanDistribution`
- Passed `encryptionHoverTitle` and `encryptionHoverDetail` as props to `EncryptionCenter`
- Replaced: badge, title1/title2, description, step labels, device labels/sublabels, connection labels, encryption center hover text, feature card titles/descriptions

## Verification
- `bun run lint` passes with zero errors
- Dev server compiles successfully with no runtime errors
