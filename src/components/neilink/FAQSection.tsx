"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useI18n } from "@/i18n";

export default function FAQSection() {
  const rippleTimeoutRef = useRef<number>(0);
  const { t } = useI18n();

  const handleRipple = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100) + "%";
    const y = ((e.clientY - rect.top) / rect.height * 100) + "%";
    el.style.setProperty("--ripple-x", x);
    el.style.setProperty("--ripple-y", y);
    el.classList.remove("ripple-active");
    void el.offsetWidth;
    el.classList.add("ripple-active");
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = window.setTimeout(() => {
      el.classList.remove("ripple-active");
    }, 600);
  }, []);

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-6"
            style={{
              background: "rgba(251, 146, 60, 0.08)",
              color: "#fb923c",
              border: "1px solid rgba(251, 146, 60, 0.15)",
            }}
          >
            {t.faq.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{t.faq.title1}</span>{" "}
            <span className="text-themed-primary">{t.faq.title2}</span>
          </h2>
          <p className="text-themed-secondary max-w-xl mx-auto text-base sm:text-lg">
            {t.faq.description}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {t.faq.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="rounded-xl border-0 !border-b-0 overflow-hidden ripple-container"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
                onMouseDown={handleRipple}
              >
                <AccordionTrigger
                  className="text-themed-primary hover:text-[#fb923c] transition-colors px-5 py-4 text-left text-sm sm:text-base font-medium [&>svg]:text-themed-muted [&>svg]:hover:text-[#fb923c] no-underline hover:no-underline"
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-themed-secondary text-sm leading-relaxed px-5 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
