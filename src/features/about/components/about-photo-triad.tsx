"use client";

import * as React from "react";
import { motion } from "motion/react";

interface AboutPhotoTriadProps {
  photos: string[];
}

export function AboutPhotoTriad({ photos }: AboutPhotoTriadProps) {
  const p1 = photos[0] || "/images/rsf1.jpg";
  const p2 = photos[1] || "/images/rsf2.jpg";
  const p3 = photos[2] || "/images/rsf3.jpg";

  return (
    <div className="relative w-full max-w-lg mx-auto py-8 sm:py-12 flex items-center justify-center">
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Floating 3-Photo Overlapping Fan (Desktop & Mobile Responsive) */}
      <div className="relative flex items-center justify-center w-full h-[320px] sm:h-[380px]">
        {/* Photo 1: Left Wing (-3deg tilt) */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.03, zIndex: 30 }}
          className="absolute left-0 sm:left-4 top-8 sm:top-6 w-[55%] sm:w-[50%] aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer z-10 transform-gpu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p1}
            alt="RSF Gathering Left"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Photo 2: Centerpiece (0deg tilt, Elevated) */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          whileHover={{ y: -10, scale: 1.04, zIndex: 40 }}
          className="relative w-[62%] sm:w-[58%] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950 shadow-[0_25px_50px_rgba(16,185,129,0.2)] cursor-pointer z-20 transform-gpu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p2}
            alt="RSF Campus Centerpiece"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span>IIUC Brotherhood</span>
            <span>Est. Community</span>
          </div>
        </motion.div>

        {/* Photo 3: Right Wing (+3deg tilt) */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.03, zIndex: 30 }}
          className="absolute right-0 sm:right-4 bottom-8 sm:bottom-6 w-[55%] sm:w-[50%] aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer z-10 transform-gpu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p3}
            alt="RSF Activity Right"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
