"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRight, GraduationCap, Calendar, Compass } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

// Performance Rule: Animate strictly transform and opacity (no layout-thrashing properties)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out
    },
  },
};

interface HeroSectionProps {
  introFinished?: boolean;
}

export function HeroSection({ introFinished = false }: HeroSectionProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-fit sm:min-h-[100svh] w-full flex flex-col justify-start pt-20 pb-10 sm:justify-center sm:pt-28 sm:pb-24 overflow-hidden bg-[#040907]">
      {/* 1. Cinematic Fullscreen Background Image with Full Edge-to-Edge Pan */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="relative h-full aspect-[16/9] max-w-none sm:aspect-auto sm:w-full transform-gpu"
          animate={
            isMobile
              ? { x: ["0%", "calc(-100% + 100vw)", "0%"] }
              : { x: "0%" }
          }
          transition={
            isMobile
              ? {
                  duration: 24,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        >
          <Image
            src="/images/iiuc.jpg"
            alt="International Islamic University Chittagong (IIUC) Campus"
            fill
            priority
            sizes="(max-width: 640px) 250vw, 100vw"
            quality={95}
            className="object-cover object-left sm:object-center transform-gpu"
          />
        </motion.div>

        {/* Lightweight Translucent Vignette Overlays - lets IIUC campus shine clearly */}
        {/* Subtle base scrim for global readability */}
        <div
          className="absolute inset-0 bg-black/35"
          aria-hidden="true"
        />
        {/* Soft bottom-to-top gradient to ground the content */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#040907] via-[#040907]/45 to-transparent"
          aria-hidden="true"
        />
        {/* Subtle emerald ambient top aura */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-black/30"
          aria-hidden="true"
        />
      </div>

      {/* 2. Main Hero Content (Hard-hidden until intro completes, then orchestrated via Variants) */}
      <Container className="relative z-10 flex flex-col items-center text-center">
        <div className={`flex flex-col items-center w-full ${!introFinished ? "invisible" : "visible"}`}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={introFinished ? "visible" : "hidden"}
            className="flex flex-col items-center max-w-4xl"
          >
            {/* Badge: Outer motion.div for entrance stagger, inner motion.div for continuous ambient loop */}
            <motion.div variants={itemVariants} className="mb-5 sm:mb-6">
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-emerald-300 shadow-lg backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Rangunia Upazila • IIUC Student Community</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
            >
              Connecting Rangunia&apos;s{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Brightest Minds
              </span>{" "}
              at IIUC
            </motion.h1>

            {/* 3 Compact Translucent Feature Cards (Mobile: Vertical Stack | Desktop: 3-Column Side-by-Side Grid) */}
            <motion.div
              variants={itemVariants}
              className="mt-30 sm:mt-8 flex flex-col md:grid md:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4 w-full max-w-md md:max-w-4xl lg:max-w-5xl px-3 text-left"
            >
              {/* Card A: Alumni Network */}
              <div className="flex items-center md:items-start gap-3 sm:gap-3.5 rounded-xl md:rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-3 sm:p-4 shadow-lg transition-all hover:bg-black/45 hover:border-emerald-500/30">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg md:rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
                  <GraduationCap className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    Alumni Network & Career Bridge
                  </h2>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-300 leading-snug">
                    Lifelong fraternity connecting current students with established graduates.
                  </p>
                </div>
              </div>

              {/* Card B: Activities & Events */}
              <div className="flex items-center md:items-start gap-3 sm:gap-3.5 rounded-xl md:rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-3 sm:p-4 shadow-lg transition-all hover:bg-black/45 hover:border-teal-500/30">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg md:rounded-xl border border-teal-500/30 bg-teal-500/20 text-teal-300">
                  <Calendar className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    Forum Activities & Events
                  </h2>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-300 leading-snug">
                    Reunions, skill-building workshops, and academic gatherings.
                  </p>
                </div>
              </div>

              {/* Card C: 1-on-1 Mentorship */}
              <div className="flex items-center md:items-start gap-3 sm:gap-3.5 rounded-xl md:rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-3 sm:p-4 shadow-lg transition-all hover:bg-black/45 hover:border-sky-500/30">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg md:rounded-xl border border-sky-500/30 bg-sky-500/20 text-sky-300">
                  <Compass className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-white">
                    1-on-1 Senior Mentorship
                  </h2>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-300 leading-snug">
                    Direct academic guidance, department pathways, and career referrals.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Primary Action Button (Centered directly below the 3 cards) */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-8 w-full flex justify-center px-3"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-13 px-8 text-sm sm:text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Join Student Forum</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
