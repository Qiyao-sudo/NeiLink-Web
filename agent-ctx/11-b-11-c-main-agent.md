# Task 11-b & 11-c: JSON-LD Structured Data + ArchitectureSection

## Task 11-b: JSON-LD Structured Data for SEO

### Work Done:
- Created `/home/z/my-project/src/components/neilink/JsonLd.tsx` — a server component (no "use client") that renders three JSON-LD script tags:
  1. **SoftwareApplication schema**: Full NeiLink app metadata including name, alternateName, description, url, applicationCategory, operatingSystem, offers (free), license, programmingLanguage, featureList (7 features), and securityFeature (4 features)
  2. **Organization schema**: NeiLink organization with name and GitHub URL
  3. **FAQPage schema**: All 6 FAQ items from FAQSection with Question/Answer pairs
- Integrated `JsonLd` into `layout.tsx` `<head>` section alongside the canonical link
- The component uses `dangerouslySetInnerHTML` with `JSON.stringify()` which is the standard Next.js pattern for JSON-LD

### Files Modified:
- `src/components/neilink/JsonLd.tsx` (new)
- `src/app/layout.tsx` (added import + placed in `<head>`)

## Task 11-c: ArchitectureSection Component

### Work Done:
- Created `/home/z/my-project/src/components/neilink/ArchitectureSection.tsx` — a "use client" component with interactive SVG network topology visualization

### Features:
1. **Section Header**: Sky blue (#38bdf8) badge "技术架构", gradient-text "网络拓扑" + white "，一览无余"
2. **SVG Network Diagram** with 3 device nodes:
   - **发送端** (top) — Monitor icon, amber (#f59e0b) accent
   - **NeiLink 服务端** (center-left) — Server icon, sky blue (#38bdf8) accent
   - **接收端** (center-right) — Smartphone icon, emerald (#34d399) accent
3. **Animated data flow lines**:
   - Sender→Server: gradient amber→violet→sky blue dashed line with "加密传输" label
   - Server→Receiver: gradient sky blue→emerald dashed line with "局域网分发" label
   - Path length animation triggered by useInView
4. **Flowing particles** along connections using SVG `<animateMotion>`:
   - 3 particles per connection with staggered delays and colors
5. **Encryption visualization** at center:
   - Lock icon inside circle with rotating dashed ring
   - "AES-256" label
   - Hover tooltip showing "AES-256-CBC 端到端加密" and "提取码验证 · 访问控制 · 有效期"
6. **Interactive hover effects**:
   - Hovering on a device node highlights its connections (dims others)
   - Tooltip appears with detailed info (e.g., "选择文件 → 加密 → 上传")
   - Hovering encryption center shows detailed encryption info
7. **Step indicators** (left side on desktop):
   - 4 steps: 选择文件, 端到端加密, 局域网传输, 浏览器接收
   - Connected by gradient lines, numbered badges with color accents
8. **Feature description cards** (right side on desktop):
   - 端到端加密 (violet), 局域网直传 (sky blue), 零安装接收 (emerald)
   - Glass-card styling with hover effects
9. **Decorative edge particles**: Small pulsing dots around the SVG edges
10. **FloatingOrbs** background for depth
11. **Responsive**: On mobile, steps and cards stack vertically below the diagram; mobile step indicators shown as horizontal flow
12. **Mobile step indicators**: Compact horizontal layout visible only on small screens

### Integration:
- Added to `page.tsx` between CrossPlatformSection and ComparisonSection with section-dividers
- Uses theme-aware CSS variables (var(--card-bg), var(--text-primary), etc.)
- All text uses text-themed-primary/secondary/muted classes

### Files Modified:
- `src/components/neilink/ArchitectureSection.tsx` (new)
- `src/app/page.tsx` (added import + placed between CrossPlatform and Comparison)

## Verification:
- `bun run lint` passes with zero errors
- Dev server compiles successfully (GET / 200)
- JSON-LD visible in HTML source (3 script tags with correct schemas)
- ArchitectureSection renders with SVG network diagram, animated particles, and interactive hover effects
