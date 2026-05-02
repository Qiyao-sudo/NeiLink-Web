# NeiLink 官网

> NeiLink（轻连）官网项目，基于 Next.js 16 + Tailwind CSS 4 + Framer Motion + GSAP + Three.js 构建。

---

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [开发命令](#开发命令)
- [多语言 (i18n)](#多语言-i18n)
- [主题切换](#主题切换)
- [API 路由](#api-路由)
- [数据库](#数据库)
- [组件说明](#组件说明)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)

---

## 环境要求

| 工具 | 最低版本 | 推荐版本 |
|------|---------|---------|
| [Bun](https://bun.sh/) | 1.0+ | 最新稳定版 |
| Node.js | 18+ | 20+ (Bun 内置) |
| Git | 2.x | 最新稳定版 |

> 本项目使用 **Bun** 作为包管理器和运行时，不推荐使用 npm/yarn/pnpm。

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Qiyao-sudo/NeiLink.git
cd NeiLink
```

### 2. 安装依赖

```bash
bun install
```

### 3. 启动开发服务器

```bash
bun run dev
```

项目将在 `http://localhost:3000` 启动，支持热更新。

### 4. 检查代码质量

```bash
bun run lint
```

---

## 项目结构

```
NeiLink/
├── prisma/
│   └── schema.prisma          # 数据库模型定义 (SQLite)
├── db/
│   └── custom.db              # SQLite 数据库文件
├── public/
│   └── logo.png               # NeiLink 图标
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根布局 (字体、主题、SEO)
│   │   ├── page.tsx           # 主页 (组合所有 Section)
│   │   ├── globals.css        # 全局样式 + CSS 变量 + 动画
│   │   └── api/
│   │       └── github/
│   │           └── route.ts   # GitHub API 代理 (Stars/Forks)
│   ├── components/
│   │   ├── neilink/           # NeiLink 业务组件 (38 个)
│   │   └── ui/                # shadcn/ui 基础组件
│   ├── i18n/                  # 国际化系统
│   │   ├── context.tsx        # I18nProvider + useI18n Hook
│   │   ├── types.ts           # 翻译键类型定义
│   │   ├── zh.ts              # 中文翻译
│   │   ├── en.ts              # 英文翻译
│   │   └── index.ts           # 统一导出
│   └── lib/
│       └── db.ts              # Prisma 客户端
├── .env                       # 环境变量 (DATABASE_URL)
├── package.json
├── tsconfig.json
├── Caddyfile                  # 网关配置
└── next.config.ts
```

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | 服务端渲染 + 路由 |
| 语言 | TypeScript 5 | 类型安全 |
| 样式 | Tailwind CSS 4 + shadcn/ui | 原子化 CSS + 组件库 |
| 动画 | Framer Motion | React 组件动画 |
| 动画 | GSAP + ScrollTrigger | 滚动驱动动画 |
| 3D | Three.js + React Three Fiber | 3D 粒子网络、盾牌 |
| 主题 | next-themes | 亮/暗模式切换 |
| 国际化 | 自定义 I18nProvider | 中英双语支持 |
| 数据库 | Prisma ORM + SQLite | 数据持久化 |
| 状态 | Zustand | 客户端状态管理 |
| 图标 | Lucide React | 图标库 |

---

## 开发命令

```bash
# 启动开发服务器 (端口 3000，支持热更新)
bun run dev

# 代码检查 (ESLint)
bun run lint

# 数据库相关
bun run db:push       # 推送 Schema 到数据库
bun run db:generate   # 生成 Prisma Client
bun run db:migrate    # 创建迁移
bun run db:reset      # 重置数据库

# 生产构建 (注意：本地开发不需要)
bun run build

# 启动生产服务
bun run start
```

---

## 多语言 (i18n)

本项目使用自定义 i18n 系统，支持 **中文 (zh)** 和 **英文 (en)**。

### 架构

```
src/i18n/
├── context.tsx    # I18nProvider (包裹在 page.tsx 最外层)
├── types.ts       # Translations 类型定义 (100+ 键)
├── zh.ts          # 中文翻译
├── en.ts          # 英文翻译
└── index.ts       # 导出
```

### 在组件中使用

```tsx
"use client";
import { useI18n } from "@/i18n";

export default function MyComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <h1>{t.hero.titleLine1}</h1>
      <p>{locale === "zh" ? "当前中文" : "Current: English"}</p>
      <button onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>
        切换语言
      </button>
    </div>
  );
}
```

### 添加新的翻译键

1. 在 `src/i18n/types.ts` 中添加新的键到 `Translations` 接口
2. 在 `src/i18n/zh.ts` 中添加中文翻译
3. 在 `src/i18n/en.ts` 中添加英文翻译
4. 在组件中通过 `t.xxx` 使用

### 语言检测与持久化

- 首次访问自动检测浏览器语言 (`navigator.language`)
- 用户手动切换后保存到 `localStorage`（key: `neilink-locale`）
- 下次访问优先读取 localStorage 中的偏好

---

## 主题切换

使用 `next-themes` 实现，基于 CSS class 切换：

- **暗色模式**（默认）：`<html class="dark">`
- **亮色模式**：`<html class="">`

CSS 变量定义在 `src/app/globals.css` 中：
- `:root` — 亮色模式变量
- `.dark` — 暗色模式变量

主题切换按钮位于导航栏右侧（Sun/Moon 图标）。

---

## API 路由

### `GET /api/github`

代理 GitHub API，获取 NeiLink 仓库信息。

**响应示例：**
```json
{
  "stars": 42,
  "forks": 10,
  "version": "v1.2.0"
}
```

**缓存：** 5 分钟内存缓存，减少 API 调用。

---

## 数据库

使用 **Prisma ORM + SQLite**，数据库文件位于 `db/custom.db`。

### 环境变量

在 `.env` 文件中配置：

```
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

### 修改 Schema

1. 编辑 `prisma/schema.prisma`
2. 运行 `bun run db:push` 应用变更
3. 在代码中使用：

```tsx
import { db } from "@/lib/db";

const users = await db.user.findMany();
```

---

## 组件说明

### 页面 Sections（14 个内容区域）

| 组件 | Section ID | 说明 |
|------|-----------|------|
| `HeroSection` | `#hero` | 3D 粒子网络 + 标题动画 + CTA |
| `FeaturesSection` | `#features` | 8 个功能卡片 (3D 倾斜 + 光泽) |
| `HowItWorksSection` | `#how-it-works` | 4 步流程 + 进度条 |
| `SecuritySection` | `#security` | 3D 盾牌 + 安全特性列表 |
| `TrustSection` | `#trust` | 动画计数器 + 信任徽章 |
| `CrossPlatformSection` | `#cross-platform` | 多平台设备节点 |
| `ArchitectureSection` | `#architecture` | 交互式 SVG 网络拓扑 |
| `ComparisonSection` | `#comparison` | 传输时间计算器 + 对比表 |
| `ScreenshotsSection` | `#screenshots` | 截图画廊 + 灯箱 |
| `FAQSection` | `#faq` | 手风琴式 FAQ |
| `ChangelogSection` | `#changelog` | 垂直版本时间线 |
| `TestimonialsSection` | `#testimonials` | 用户评价轮播 |
| `LiveDemoSection` | `#live-demo` | 实时传输模拟演示 |
| `DownloadSection` | `#download` | 下载卡片 + Canvas 粒子 |

### 工具组件

| 组件 | 说明 |
|------|------|
| `Navbar` | 导航栏 + 滑动指示器 + 移动端菜单 |
| `Footer` | 页脚 + 统计数据 + 社交链接 |
| `ScrollProgress` | 顶部滚动进度条 |
| `ScrollTimeline` | 右侧滚动时间线 |
| `ScrollVelocityBar` | 滚动速度文字带 |
| `SectionNav` | 右侧圆点导航 |
| `SectionDivider` | 分区装饰分割线 (wave/dots/gradient) |
| `BackToTop` | 回到顶部按钮 |
| `ThemeToggle` | 主题切换 |
| `LanguageSwitcher` | 语言切换 (中/英) |
| `KeyboardShortcutsOverlay` | 键盘快捷键面板 |
| `CursorTrail` | Canvas 鼠标轨迹效果 |
| `ParallaxProvider` | GSAP 视差滚动 |
| `NoiseOverlay` | 噪点纹理覆盖 |
| `NetworkScene` | Three.js 3D 粒子网络 |
| `TerminalBlock` | 终端动画打字效果 |
| `ToastNotification` | Toast 通知系统 |
| `SectionSkeleton` | 加载骨架屏 |
| `SectionReveal` | 滚动渐入动画 |
| `FloatingOrbs` | 浮动背景光球 |
| `TextReveal` | 文字逐字/逐词揭示动画 |
| `JsonLd` | JSON-LD 结构化数据 (SEO) |
| `useReducedMotion` | 无障碍：减弱动画 Hook |

---

## 调试技巧

### 1. 查看开发服务器日志

```bash
# 日志保存在 dev.log 中
tail -f dev.log
```

### 2. 使用 React DevTools

安装 [React DevTools](https://react.dev/link/react-devtools) 浏览器扩展，可查看组件树、Props、状态等。

### 3. 检查 3D 场景性能

Hero 区域的 3D 粒子网络使用 Three.js，如果帧率低：
- 打开 Chrome DevTools → Performance 面板录制
- 检查 `NetworkScene` 组件的渲染帧率
- 可通过 `useReducedMotion` Hook 在低端设备上降级

### 4. 调试动画

- **Framer Motion**：在浏览器控制台中设置 `localStorage.setItem('framer-motion-debug', 'true')`
- **GSAP**：使用 `gsap.debug()` 或 `ScrollTrigger.debug()`
- **减弱动画**：在系统设置中开启"减弱动画"，组件会自动简化

### 5. 调试 i18n

```tsx
// 在任意组件中查看当前语言和翻译
const { locale, t } = useI18n();
console.log("Current locale:", locale);
console.log("Hero title:", t.hero.titleLine1);
```

### 6. 检查 Prisma 查询

```tsx
import { db } from "@/lib/db";
// 在 API Route 或 Server Component 中
const result = await db.user.findMany();
console.log(result);
```

---

## 常见问题

### Q: 启动报错 `MODULE_NOT_FOUND`

```bash
# 删除缓存重新安装
rm -rf node_modules bun.lockb
bun install
```

### Q: 3D 场景白屏/不显示

- 确认浏览器支持 WebGL：访问 [webglreport.com](https://webglreport.com/)
- 检查控制台是否有 Three.js 错误
- `NetworkScene` 组件使用 `Suspense` 包裹，加载中会显示占位内容

### Q: 修改了 Prisma Schema 但代码报错

```bash
bun run db:push      # 推送 Schema 变更
bun run db:generate  # 重新生成 Prisma Client
```

### Q: 样式修改不生效

- Tailwind CSS 4 使用 JIT 模式，修改 `globals.css` 后应自动热更新
- 如果未生效，尝试刷新页面 (Ctrl+Shift+R 强制刷新)
- 确认 CSS 类名在 `tailwind.config.ts` 的 `content` 范围内

### Q: 翻译键缺失 / 页面显示空白文本

1. 检查 `src/i18n/types.ts` 是否定义了该键
2. 确认 `zh.ts` 和 `en.ts` 都有对应的翻译值
3. TypeScript 会在编译时提示缺失的键

### Q: 端口 3000 被占用

```bash
# 查找并终止占用进程
lsof -i :3000
kill -9 <PID>
```

### Q: 如何添加新的 Section

1. 在 `src/components/neilink/` 创建新组件（使用 `"use client"` 指令）
2. 在 `src/i18n/` 中添加对应的翻译键
3. 在 `src/app/page.tsx` 中导入并添加到页面（使用 `next/dynamic` 懒加载）
4. 如需导航，在 `Navbar.tsx` 的 `NAV_ITEMS` 中添加条目

---

## 部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量 `DATABASE_URL`
4. 部署

### Docker

```bash
# 构建
bun run build

# 运行
bun run start
```

### 静态导出

如果不需要服务端功能，可配置 `next.config.ts` 的 `output: 'export'` 生成纯静态文件。

---

## 相关链接

- **NeiLink GitHub**: https://github.com/Qiyao-sudo/NeiLink
- **Next.js 文档**: https://nextjs.org/docs
- **Tailwind CSS 文档**: https://tailwindcss.com/docs
- **Framer Motion 文档**: https://www.framer.com/motion/
- **GSAP 文档**: https://gsap.com/docs/
- **Three.js 文档**: https://threejs.org/docs/
- **Prisma 文档**: https://www.prisma.io/docs
