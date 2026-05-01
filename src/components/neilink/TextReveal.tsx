"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  mode?: "char" | "word";
  delay?: number;
  className?: string;
}

export default function TextReveal({
  text,
  mode = "char",
  delay = 0,
  className = "",
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const items = mode === "char" ? text.split("") : text.split(/(\s+)/);

  const durationPerItem = mode === "char" ? 0.03 : 0.06;

  return (
    <span ref={ref} className={className}>
      {items.map((item, i) => {
        // Preserve whitespace items as-is
        if (mode === "word" && /^\s+$/.test(item)) {
          return <span key={`ws-${i}`}>{item}</span>;
        }

        return (
          <motion.span
            key={`${item}-${i}`}
            initial={{ opacity: 0, y: 2 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 2 }}
            transition={{
              delay: delay + i * durationPerItem,
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{ display: "inline-block" }}
          >
            {item}
          </motion.span>
        );
      })}
    </span>
  );
}
