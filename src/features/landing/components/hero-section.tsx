"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Droplet,
  Users,
  MapPin,
} from "lucide-react";
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
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden bg-[#040907] pt-24 pb-16 sm:pt-28 sm:pb-24">
      {/* 1. Cinematic Fullscreen Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/iiuc.jpg"
          alt="International Islamic University Chittagong (IIUC) Campus"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-center scale-[1.02] transform-gpu"
        />

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

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-zinc-100 font-medium leading-relaxed px-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            >
              The dedicated platform uniting students and alumni through lifelong
              brotherhood, academic guidance, career referrals, and an instant{" "}
              <span className="text-rose-400 font-semibold underline decoration-rose-500/40 underline-offset-4">
                emergency blood donor network
              </span>
              .
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 sm:mt-10 flex w-full flex-col items-stretch sm:flex-row sm:w-auto sm:items-center justify-center gap-3.5 sm:gap-4 px-4"
            >
              {/* CTA 1: Join / Portal */}
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-7 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Join Student Forum</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* CTA 2: Emergency Blood Directory */}
              <Link href="#blood-network" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 text-base font-semibold border-rose-500/40 bg-rose-950/20 text-rose-200 hover:bg-rose-950/40 hover:text-white hover:border-rose-400 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Droplet className="mr-2 h-4 w-4 text-rose-400 fill-rose-400" />
                  <span>Find Blood Donors</span>
                </Button>
              </Link>
            </motion.div>

            {/* Mobile-First Feature Highlights Grid */}
            <motion.div
              variants={itemVariants}
              className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 w-full max-w-4xl text-left"
            >
            {/* Feature 1 */}
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/15 bg-black/50 p-4 sm:p-5 backdrop-blur-md shadow-xl transition-all hover:border-emerald-500/40 hover:bg-black/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/60 text-rose-400 shadow-inner">
                <Droplet className="h-5 w-5 fill-rose-500/40 text-rose-400" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  24/7 Blood Network
                </h2>
                <p className="mt-0.5 text-xs text-zinc-300 leading-normal">
                  Rapid volunteer coordination for emergency transfusion cases in Chittagong.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/15 bg-black/50 p-4 sm:p-5 backdrop-blur-md shadow-xl transition-all hover:border-emerald-500/40 hover:bg-black/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 shadow-inner">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Verified Directory
                </h2>
                <p className="mt-0.5 text-xs text-zinc-300 leading-normal">
                  Strictly authenticated IIUC student profiles with private-by-default controls.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/15 bg-black/50 p-4 sm:p-5 backdrop-blur-md shadow-xl transition-all hover:border-emerald-500/40 hover:bg-black/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-950/60 text-teal-400 shadow-inner">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  15 Unions & Wards
                </h2>
                <p className="mt-0.5 text-xs text-zinc-300 leading-normal">
                  Connecting students from Betagi to Mariamnagar with localized brotherhood.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      </Container>
    </section>
  );
}
