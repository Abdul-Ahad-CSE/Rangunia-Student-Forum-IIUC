"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface CinematicIntroProps {
  onComplete?: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const logoWrapperRef = React.useRef<HTMLDivElement>(null);
  const logoGlowRef = React.useRef<HTMLDivElement>(null);
  const textWordsRef = React.useRef<HTMLDivElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const lineAccentRef = React.useRef<HTMLDivElement>(null);
  const skipBtnRef = React.useRef<HTMLButtonElement>(null);

  const [isVisible, setIsVisible] = React.useState(false);

  // Callback to finish intro and store session flag
  const finishIntro = React.useCallback(() => {
    try {
      sessionStorage.setItem("rsf_intro_has_played", "true");
    } catch {
      // Ignore storage access errors in restricted iframe/browser modes
    }
    setIsVisible(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rsf_intro_finished"));
    }
    onComplete?.();
  }, [onComplete]);

  React.useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      // 1. Check if user already saw the intro in this browser session
      try {
        const alreadyPlayed = sessionStorage.getItem("rsf_intro_has_played");
        if (alreadyPlayed === "true") {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("rsf_intro_finished"));
          }
          onComplete?.();
          return;
        }
      } catch {
        // Fallback if sessionStorage is not accessible
      }

      // 2. Check prefers-reduced-motion media query
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        finishIntro();
        return;
      }

      // If not played and reduced motion is false, activate intro
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(rafId);
  }, [finishIntro, onComplete]);

  React.useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            onComplete: finishIntro,
          });
        },
      });

      // Target elements
      const words = textWordsRef.current?.querySelectorAll(".intro-word");

      // Initial States
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(logoWrapperRef.current, {
        scale: 0.6,
        opacity: 0,
        filter: "blur(10px)",
      });
      gsap.set(logoGlowRef.current, { scale: 0.3, opacity: 0 });
      if (words) {
        gsap.set(words, {
          opacity: 0,
          y: 35,
          rotateX: -30,
          filter: "blur(8px)",
          transformPerspective: 800,
        });
      }
      gsap.set(lineAccentRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 15 });
      gsap.set(skipBtnRef.current, { opacity: 0, y: -10 });

      // Orchestration Sequence
      // Step 1: Subtle reveal of Skip button
      tl.to(skipBtnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        // Step 2: Logo expands and blooms with subtle glow
        .to(
          logoGlowRef.current,
          {
            opacity: 0.8,
            scale: 1.2,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          logoWrapperRef.current,
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "back.out(1.4)",
          },
          "-=1.0"
        )
        // Step 3: Words in "Rangunia Students Forum IIUC" cascade in
        .to(
          words ?? [],
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.5"
        )
        // Step 4: Emerald accent line reveals
        .to(
          lineAccentRef.current,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.3"
        )
        // Step 5: Subtitle fades in
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Step 6: Dramatic hold for viewer intake
        .to({}, { duration: 1.0 })
        // Step 7: Logo gentle pulse before exit
        .to(
          logoWrapperRef.current,
          {
            scale: 1.05,
            duration: 0.5,
            ease: "sine.inOut",
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible, finishIntro]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#040907] px-4 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Intro Animation"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-[#040907]/90 to-[#040907]"
        aria-hidden="true"
      />

      {/* Accessible Skip Button */}
      <button
        ref={skipBtnRef}
        onClick={finishIntro}
        className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-950/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#040907]"
        aria-label="Skip intro animation"
      >
        <span>Skip Intro</span>
        <span aria-hidden="true">→</span>
      </button>

      {/* Center Cinematic Lockup */}
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Synchronized Logo with Aura */}
        <div className="relative mb-6">
          <div
            ref={logoGlowRef}
            className="pointer-events-none absolute -inset-4 rounded-full bg-emerald-500/25 blur-2xl"
            aria-hidden="true"
          />
          <div
            ref={logoWrapperRef}
            className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-2.5 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-xl sm:h-28 sm:w-28"
          >
            <Image
              src="/images/rsf_logo.png"
              alt="Rangunia Students Forum Logo"
              width={112}
              height={112}
              className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </div>

        {/* Cinematic Staggered Title Words */}
        <div
          ref={textWordsRef}
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-serif text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          <span className="intro-word inline-block bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Rangunia
          </span>
          <span className="intro-word inline-block bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Students
          </span>
          <span className="intro-word inline-block bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Forum
          </span>
          <span className="intro-word inline-block rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xl font-bold tracking-widest text-emerald-300 sm:text-3xl">
            IIUC
          </span>
        </div>

        {/* Elegant Horizon Line */}
        <div
          ref={lineAccentRef}
          className="my-5 h-[1.5px] w-44 origin-center bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-md text-xs font-medium tracking-widest text-emerald-100/70 uppercase sm:text-sm"
        >
          Unity • Welfare • Academic Excellence
        </p>
      </div>
    </div>
  );
}
