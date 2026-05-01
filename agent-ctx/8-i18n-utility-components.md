# Task 8 — i18n Utility Components Translation

## Summary
Translated all 5 NeiLink utility components to use the i18n system. Replaced all hardcoded Chinese text with i18n references.

## Files Modified

### i18n System
- **`src/i18n/types.ts`** — Added new keys: `utils.sectionNav`, `utils.shortcuts.jumpTo`, `utils.shortcuts.jumpToSection`, `utils.shortcuts.scrollUp`, `utils.shortcuts.scrollDown`, `utils.shortcuts.goBackToTop`, `utils.shortcuts.downloadPage`, `utils.shortcuts.press`, `utils.shortcuts.viewShortcuts`, `terminal.copy`, `terminal.copyLink`, `terminal.copiedToClipboard`, `terminal.copyFailed`, `terminal.copyFailedDesc`
- **`src/i18n/zh.ts`** — Added Chinese translations for all new keys; corrected `utils.shortcuts.navigation` from "跳转" to "导航"; updated `terminal.lines` to match component's actual 5-line content; updated `keyboardShortcuts` from "快捷键" to "键盘快捷键"
- **`src/i18n/en.ts`** — Added English translations for all new keys; updated `terminal.lines` to match component's actual 5-line content

### Components
- **`BackToTop.tsx`** — Replaced `aria-label="回到顶部"` → `t.utils.backToTop`, tooltip text → `{t.utils.backToTop}`
- **`KeyboardShortcutsOverlay.tsx`** — Restructured `SHORTCUT_GROUPS` to use i18n keys (`labelKey`, `descriptionKey`) instead of hardcoded Chinese; replaced all Chinese text (group labels, shortcut descriptions, header, footer, aria-labels, KeyboardHintBadge text) with i18n references; added `resolveDescription()` and `resolveGroupLabel()` helpers
- **`SectionNav.tsx`** — Replaced `SECTIONS` array's Chinese labels with `i18nKey` references; used `t.utils.sections[key]` for tooltip/button labels; replaced `aria-label="页面段落导航"` → `t.utils.sectionNav`
- **`TerminalBlock.tsx`** — Renamed `TERMINAL_LINES` to `TERMINAL_LINE_META` (text now from `t.terminal.lines`); replaced toast messages ("已复制到剪贴板", "复制失败", etc.) with i18n; replaced "已复制"/"复制" button text and aria-label with i18n
- **`ToastNotification.tsx`** — No Chinese text found; no changes needed

## Lint Result
✅ `bun run lint` passed with zero errors
