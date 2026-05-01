import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/components/neilink/ThemeProvider";
import JsonLd from "@/components/neilink/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeiLink 轻连 — 局域网极速文件分享工具",
  description: "NeiLink 轻连是一款免费开源的跨平台局域网文件分享工具。支持 AES-256 端到端加密、断点续传、无需外网，Windows/macOS/Linux 全平台覆盖。",
  keywords: ["NeiLink", "轻连", "局域网", "文件传输", "文件分享", "P2P", "AES-256", "开源"],
  authors: [{ name: "Qiyao-sudo" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "NeiLink 轻连 — 局域网极速文件分享工具",
    description: "免费开源的跨平台局域网文件分享工具。支持 AES-256 端到端加密、断点续传、无需外网，Windows/macOS/Linux 全平台覆盖。",
    url: "https://neilink.dev",
    siteName: "NeiLink 轻连",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeiLink 轻连 — 局域网极速文件分享工具",
    description: "免费开源的跨平台局域网文件分享工具。支持 AES-256 端到端加密、断点续传、无需外网。",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="dark">
      <head>
        <link rel="canonical" href="https://neilink.dev" />
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
