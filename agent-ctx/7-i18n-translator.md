# Task 7 - i18n Translation for NeiLink Components

## Summary
Translated 5 NeiLink website components to use the i18n system by replacing all hardcoded Chinese text with `t.xxx` references.

## Components Updated

### 1. ChangelogSection.tsx
- Removed `CHANGELOG_ENTRIES` constant with hardcoded Chinese text
- Added `VERSION_ACCENTS` constant for accent colors (styling only)
- Refactored `TimelineEntry` to accept individual props (version, label, date, description, features, accent) instead of an entry object
- Replaced badge, title, description, viewAll, starTitle, starDescription, starBtn with `t.changelog.xxx`

### 2. TestimonialsSection.tsx
- Removed `TESTIMONIALS` constant with hardcoded Chinese quotes/names/roles
- Refactored `TestimonialCard` to accept `name`, `role`, `quote` as individual props
- Uses `t.testimonials.items[i]` for testimonial data
- Added `pageAriaLabel` for pagination dots accessibility
- Updated `totalPages` function to accept `total` parameter

### 3. LiveDemoSection.tsx
- Replaced `status` prop with `demoState` prop in SenderCard/ReceiverCard for cleaner logic
- Removed `senderStatus`/`receiverStatus` state variables (status text now derived from `demoState` + i18n)
- Added `useI18n()` to SenderCard, ReceiverCard, SpeedIndicator, StatsBar, and main component
- Replaced all Chinese labels: sender/receiver, progress, speed, encryption, elapsed time, download button, etc.
- String matching logic (`status.includes("✓")`) replaced with `demoState === "complete"` checks

### 4. DownloadSection.tsx
- Added `useI18n()` import and usage
- Refactored `DownloadCard` to accept `platformData`, `recommendedLabel`, `downloadInstallLabel` props from i18n
- Replaced badge, title, description, recommended, downloadInstall, viewSource, allVersions, systemRequirements, toastRedirect

### 5. Footer.tsx
- Complete rewrite: replaced `FOOTER_LINKS` with `FOOTER_LINK_STRUCTURE` (structural data only, labels from i18n)
- Replaced `STATS` with `STAT_ICONS` + `STAT_LABELS_KEY` (labels from `t.footer.stats.xxx`)
- Added `useI18n()` hook
- Replaced all Chinese text: section titles, link labels, brand info, description, philosophy, stats, bottom bar

## i18n Changes

### types.ts additions:
- `testimonials.pageAriaLabel`
- `liveDemo.startBtn`, `fileDetail`, `status.receiverIdle/receiverTransferring/receiverComplete`, `receiveProgress`, `encryptionLabel`, `elapsedTimeLabel`, `downloadBtn`, `accessCodeHint`
- `download.platforms[i].ext`, `recommended`, `downloadInstall`, `viewSource`, `allVersions`, `systemRequirements`, `toastRedirect`
- `footer.subtitle`, `tagline`, `description`, `philosophy`, `productLinks/resourceLinks/communityLinks/aboutLinks`, `stats.speedValue/leaks`, `openSource`, `madeBy`, `allRightsReserved`

### zh.ts / en.ts:
- Updated translations to match current component text
- Added all new keys with proper Chinese/English translations
- Updated changelog versions with more detailed feature descriptions matching the components

## Verification
- `bun run lint` passes with zero errors
- Dev server running successfully
- Only remaining Chinese text in components is a code comment (not user-facing)
