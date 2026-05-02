"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Github } from "lucide-react";
import ThemeToggle from "@/components/neilink/ThemeToggle";
import LanguageSwitcher from "@/components/neilink/LanguageSwitcher";
import { useI18n } from "@/i18n";

const NAV_ITEMS = [
  { key: "home" as const, href: "#hero" },
  { key: "features" as const, href: "#features" },
  { key: "security" as const, href: "#security" },
  { key: "liveDemo" as const, href: "#live-demo" },
  { key: "comparison" as const, href: "#comparison" },
  { key: "changelog" as const, href: "#changelog" },
  { key: "download" as const, href: "#download" },
];

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorPos, setIndicatorPos] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateIndicator = useCallback(() => {
    const activeHref = `#${activeSection}`;
    const btn = navButtonRefs.current[activeHref];
    const container = navContainerRef.current;
    if (btn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorPos({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
    // Re-calculate on resize
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#f59e0b] focus:text-[#09090b] focus:font-semibold focus:text-sm focus:shadow-lg"
      >
        {t.nav.skipToContent}
      </a>
      <motion.nav
        role="navigation"
        aria-label={t.nav.ariaLabel}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "nav-themed backdrop-blur-xl border-b"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleNavClick("#hero")}
            >
              <img
                src="./logo.png"
                alt="NeiLink"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold gradient-text leading-tight">NeiLink</span>
                <span className="text-[10px] text-themed-muted leading-tight hidden sm:block">{t.nav.subtitle}</span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 relative" ref={navContainerRef}>
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <motion.button
                    key={item.href}
                    ref={(el) => { navButtonRefs.current[item.href] = el; }}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "text-[#2dd4bf]"
                        : "text-themed-secondary hover:text-themed-primary"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg border"
                        style={{ background: "var(--hover-bg)", borderColor: "var(--card-border-hover)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{t.nav[item.key]}</span>
                  </motion.button>
                );
              })}
              {/* Sliding active underline */}
              <motion.div
                className="absolute bottom-0 h-[2px] rounded-full"
                style={{
                  background: "#2dd4bf",
                  boxShadow: "0 0 8px rgba(45, 212, 191, 0.4)",
                }}
                animate={{
                  left: indicatorPos.left,
                  width: indicatorPos.width,
                  opacity: indicatorPos.width > 0 ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.a
                href="https://github.com/Qiyao-sudo/NeiLink"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-secondary-themed hover:text-themed-primary transition-all duration-300"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Github size={16} />
                <span className="text-sm">GitHub</span>
              </motion.a>
              <ThemeToggle />
              <LanguageSwitcher />
              <motion.button
                onClick={() => handleNavClick("#download")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#f59e0b] text-[#09090b] font-semibold text-sm hover:bg-[#fbbf24] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} />
                <span>{t.nav.downloadBtn}</span>
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="lg:hidden p-2 text-themed-secondary hover:text-themed-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-2xl"
            style={{ background: "var(--mobile-menu-bg)" }}
          >
            {/* Top padding for navbar */}
            <div className="h-16 sm:h-20" />

            {/* Menu content */}
            <div className="flex flex-col h-[calc(100%-5rem)]">
              {/* Nav items */}
              <div className="flex-1 flex flex-col justify-center px-8">
                <nav className="space-y-1">
                  {NAV_ITEMS.map((item, index) => {
                    const sectionId = item.href.replace("#", "");
                    const isActive = activeSection === sectionId;
                    return (
                      <motion.button
                        key={item.href}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.04, duration: 0.3, ease: "easeOut" }}
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left py-3.5 px-4 rounded-xl text-lg transition-all duration-200 flex items-center gap-3 ${
                          isActive
                            ? "text-[#2dd4bf]"
                            : "text-themed-secondary hover:text-themed-primary"
                        }`}
                      >
                        {/* Active dot */}
                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          isActive ? "bg-[#2dd4bf]" : "bg-themed-muted"
                        }`} />
                        {t.nav[item.key]}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="px-8 pb-8 pt-4 border-t"
                style={{ borderColor: "var(--footer-border)" }}
              >
                <div className="flex gap-3">
                  <motion.a
                    href="https://github.com/Qiyao-sudo/NeiLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border btn-secondary-themed hover:text-themed-primary hover:border-themed transition-all"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={18} />
                    GitHub
                  </motion.a>
                  <ThemeToggle />
                  <LanguageSwitcher />
                  <motion.button
                    onClick={() => handleNavClick("#download")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#f59e0b] text-[#09090b] font-semibold hover:bg-[#fbbf24] transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={18} />
                    {t.nav.downloadBtn}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
