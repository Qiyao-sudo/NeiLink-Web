"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useI18n } from "@/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === "zh" ? "en" : "zh");
  };

  return (
    <motion.button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg btn-secondary-themed hover:text-themed-primary transition-all duration-300"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Languages size={16} />
      <span className="text-xs font-medium">
        {locale === "zh" ? "EN" : "中"}
      </span>
    </motion.button>
  );
}
