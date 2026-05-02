"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Navbar from "@/components/neilink/Navbar";
import HeroSection from "@/components/neilink/HeroSection";
import ScrollVelocityBar from "@/components/neilink/ScrollVelocityBar";
import SectionDivider from "@/components/neilink/SectionDivider";
import BackToTop from "@/components/neilink/BackToTop";
import ScrollTimeline from "@/components/neilink/ScrollTimeline";
import CursorTrail from "@/components/neilink/CursorTrail";
import ParallaxProvider from "@/components/neilink/ParallaxProvider";
import NoiseOverlay from "@/components/neilink/NoiseOverlay";
import { ToastProvider } from "@/components/neilink/ToastNotification";
import { I18nProvider } from "@/i18n";
import SectionSkeleton from "@/components/neilink/SectionSkeleton";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------
   Lazy-loaded sections — code-split via next/dynamic.
   Each section gets its own chunk, loaded on demand.
   ---------------------------------------------------------------- */
const FeaturesSection = dynamic(
  () => import("@/components/neilink/FeaturesSection"),
  { loading: () => <SectionSkeleton height={600} /> }
);

const HowItWorksSection = dynamic(
  () => import("@/components/neilink/HowItWorksSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const SecuritySection = dynamic(
  () => import("@/components/neilink/SecuritySection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const TrustSection = dynamic(
  () => import("@/components/neilink/TrustSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const CrossPlatformSection = dynamic(
  () => import("@/components/neilink/CrossPlatformSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const ArchitectureSection = dynamic(
  () => import("@/components/neilink/ArchitectureSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const ComparisonSection = dynamic(
  () => import("@/components/neilink/ComparisonSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const ScreenshotsSection = dynamic(
  () => import("@/components/neilink/ScreenshotsSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const FAQSection = dynamic(
  () => import("@/components/neilink/FAQSection"),
  { loading: () => <SectionSkeleton height={400} /> }
);

const ChangelogSection = dynamic(
  () => import("@/components/neilink/ChangelogSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const TestimonialsSection = dynamic(
  () => import("@/components/neilink/TestimonialsSection"),
  { loading: () => <SectionSkeleton height={400} /> }
);

const LiveDemoSection = dynamic(
  () => import("@/components/neilink/LiveDemoSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const DownloadSection = dynamic(
  () => import("@/components/neilink/DownloadSection"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const Footer = dynamic(() => import("@/components/neilink/Footer"), {
  loading: () => <SectionSkeleton height={300} />,
});

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger after all content loads
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <I18nProvider>
      <ToastProvider>
        <main className="min-h-screen flex flex-col">
        <NoiseOverlay />
        <ScrollVelocityBar />
        <Navbar />
        <HeroSection />
        <SectionDivider variant="wave" />
        <FeaturesSection />
        <SectionDivider variant="gradient" />
        <HowItWorksSection />
        <SectionDivider variant="dots" />
        <SecuritySection />
        <SectionDivider variant="wave" flip />
        <TrustSection />
        <SectionDivider variant="gradient" />
        <CrossPlatformSection />
        <SectionDivider variant="wave" />
        <ArchitectureSection />
        <SectionDivider variant="dots" />
        <ComparisonSection />
        <SectionDivider variant="gradient" />
        <ScreenshotsSection />
        <SectionDivider variant="wave" flip />
        <FAQSection />
        <SectionDivider variant="dots" />
        <ChangelogSection />
        <SectionDivider variant="wave" />
        <TestimonialsSection />
        <SectionDivider variant="gradient" />
        <LiveDemoSection />
        <SectionDivider variant="wave" flip />
        <DownloadSection />
        <Footer />
        <CursorTrail />
        <ParallaxProvider />
        <ScrollTimeline />
        <BackToTop />
        </main>
      </ToastProvider>
    </I18nProvider>
  );
}
