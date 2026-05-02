"use client";

import { motion } from "framer-motion";
import {
  Github,
  Mail,
  Heart,
  ExternalLink,
  Star,
  Zap,
  Shield,
  Globe,
  Users,
  Lock,
  Scale,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { useI18n } from "@/i18n";

const FOOTER_LINK_STRUCTURE = [
  {
    titleKey: "product" as const,
    linksKey: "productLinks" as const,
    links: [
      { href: "#features" },
      { href: "#how-it-works" },
      { href: "#security" },
      { href: "#cross-platform" },
      { href: "#download" },
    ],
  },
  {
    titleKey: "resource" as const,
    linksKey: "resourceLinks" as const,
    links: [
      { href: "https://github.com/Qiyao-sudo/NeiLink", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink#readme", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink/issues", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink/releases", external: true },
    ],
  },
  {
    titleKey: "community" as const,
    linksKey: "communityLinks" as const,
    links: [
      { href: "https://github.com/Qiyao-sudo/NeiLink/blob/main/CONTRIBUTING.md", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink/blob/main/LICENSE", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink", external: true, highlight: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink/discussions", external: true },
    ],
  },
  {
    titleKey: "about" as const,
    linksKey: "aboutLinks" as const,
    links: [
      { href: "#trust" },
      { href: "#features" },
      { href: "https://github.com/Qiyao-sudo", external: true },
      { href: "https://github.com/Qiyao-sudo/NeiLink/issues", external: true },
    ],
  },
];

const STAT_ICONS = [Star, Zap, Shield, Globe, Users, Lock];

const STAT_LABELS_KEY = [
  "openSource" as const,
  "speed" as const,
  "encryption" as const,
  "platforms" as const,
  "users" as const,
  "leaks" as const,
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Qiyao-sudo/NeiLink",
    icon: Github,
    hoverColor: "hover:text-themed-primary hover:border-themed",
  },
  {
    label: "Issues",
    href: "https://github.com/Qiyao-sudo/NeiLink/issues",
    icon: Mail,
    hoverColor: "hover:text-[#a78bfa] hover:border-[rgba(167,139,250,0.2)]",
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: Twitter,
    hoverColor: "hover:text-[#1da1f2] hover:border-[rgba(29,161,242,0.2)]",
  },
  {
    label: "Discord",
    href: "#",
    icon: MessageCircle,
    hoverColor: "hover:text-[#5865f2] hover:border-[rgba(88,101,242,0.2)]",
  },
];

export default function Footer() {
  const { t } = useI18n();
  const STAT_VALUES = ["Open Source", t.footer.stats.speedValue, "AES-256", "3+", "1000+", "0"];

  return (
    <>
      {/* Animated wave divider — ABOVE the footer */}
      <div className="relative w-full overflow-hidden" style={{ marginTop: "-1px" }}>
        <svg
          className="footer-wave-divider w-[120%] -ml-[10%] h-20 sm:h-24 md:h-28"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "var(--section-bg)", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "var(--footer-bg-from)", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,40 1440,60 L1440,120 L0,120 Z"
            fill="url(#wave-gradient)"
          />
          <path
            d="M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,60 C1350,40 1440,70 1440,80 L1440,120 L0,120 Z"
            fill="url(#wave-gradient)"
            opacity="0.5"
          />
        </svg>
      </div>

      <footer className="relative border-t" style={{ borderColor: "var(--footer-border)" }}>
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to top, var(--footer-bg-from), var(--footer-bg-to))` }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Stats bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 py-8 border-y"
            style={{ borderColor: "var(--footer-border)" }}
          >
            {STAT_ICONS.map((Icon, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--icon-bg)", border: "1px solid var(--icon-border)" }}
                >
                  <Icon size={16} className="text-themed-muted" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-themed-secondary">{STAT_VALUES[i]}</div>
                  <div className="text-xs text-themed-muted">{t.footer.stats[STAT_LABELS_KEY[i]]}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="./logo.png"
                  alt="NeiLink"
                  className="w-12 h-12 rounded-xl object-contain"
                />
                <div>
                  <span className="text-lg font-bold gradient-text">NeiLink</span>
                  <span className="text-sm text-themed-muted ml-2">{t.footer.subtitle}</span>
                  <p className="text-xs text-themed-muted mt-0.5">{t.footer.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-themed-secondary leading-relaxed max-w-sm mb-4">
                {t.footer.description}
              </p>
              <p className="text-xs text-themed-muted mb-5 max-w-xs">
                {t.footer.philosophy}
              </p>

              {/* Badges row */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <a
                  href="https://github.com/Qiyao-sudo/NeiLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors text-themed-secondary hover:text-[#f59e0b]"
                  style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}
                >
                  <Star size={12} className="text-[#f59e0b]" />
                  Star
                </a>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border text-themed-secondary"
                  style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}
                >
                  <Scale size={12} className="text-[#34d399]" />
                  MIT License
                </span>
              </div>

              {/* Social links with tooltips */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("#") ? undefined : "_blank"}
                    rel={social.href.startsWith("#") ? undefined : "noopener noreferrer"}
                    aria-label={social.label}
                    className={`group/social relative w-9 h-9 rounded-lg flex items-center justify-center text-themed-muted border border-themed transition-all duration-300 ${social.hoverColor} hover:scale-110`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={16} />
                    {/* Tooltip */}
                    <span
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/social:opacity-100 transition-opacity duration-200 pointer-events-none"
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border-hover)",
                        color: "var(--text-primary)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links — staggered entrance */}
            {FOOTER_LINK_STRUCTURE.map((section, colIdx) => {
              const linkLabels = t.footer[section.linksKey];
              return (
                <motion.div
                  key={section.titleKey}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: colIdx * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <h4 className="text-sm font-semibold text-themed-secondary mb-4">{t.footer[section.titleKey]}</h4>
                  <ul className="space-y-2.5">
                    {section.links.map((link, li) => (
                      <li key={li}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className={`text-sm transition-colors inline-flex items-center gap-1 ${
                            link.highlight
                              ? "text-[#f59e0b] hover:text-[#2dd4bf] font-medium"
                              : "text-themed-muted hover:text-[#2dd4bf]"
                          }`}
                        >
                          {linkLabels[li]?.label}
                          {link.external && <ExternalLink size={10} className="opacity-40 ml-0.5" />}
                          {link.highlight && <Star size={10} className="ml-0.5" />}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="section-divider mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="./logo.png" alt="NeiLink" className="w-4 h-4 rounded object-contain opacity-50" />
              <p className="text-xs text-themed-muted">
                &copy; {new Date().getFullYear()} NeiLink. {t.footer.allRightsReserved}
              </p>
            </div>
            <p className="text-xs text-themed-muted flex items-center gap-1">
              {t.footer.madeBy}
            </p>
            <p className="text-xs text-themed-muted">
              {t.footer.openSource}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
