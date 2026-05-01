"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxProvider — adds scroll-driven parallax effects to sections
 * Apply data-speed attributes to elements for parallax movement
 * Respects prefers-reduced-motion: disables parallax when preferred
 */
export default function ParallaxProvider() {
  const initializedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // If user prefers reduced motion, skip all parallax animations
    if (reducedMotion) return;

    // Parallax effect for section backgrounds (floating orbs)
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    parallaxElements.forEach((el) => {
      const speed = parseFloat((el as HTMLElement).dataset.parallax || "0.1");
      const direction = (el as HTMLElement).dataset.parallaxDir || "y";

      gsap.to(el, {
        [direction === "y" ? "y" : "x"]: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Fade-in effect for section headers
    const sectionHeaders = document.querySelectorAll("section > div > .text-center");
    sectionHeaders.forEach((header) => {
      gsap.fromTo(
        header,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.body) return;
        trigger.kill();
      });
    };
  }, [reducedMotion]);

  return null;
}
