"use client";

import * as React from "react";
import { CinematicIntro } from "@/features/landing/components/cinematic-intro";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { HeroSection } from "@/features/landing/components/hero-section";
import { CommunityShowcase } from "@/features/landing/components/community-showcase";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  const [introFinished, setIntroFinished] = React.useState(false);

  return (
    <>
      {/* Session-Aware GSAP Cinematic Intro Sequence (rendered on SSR to prevent FOUC) */}
      {!introFinished && (
        <CinematicIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* Responsive Navigation */}
      <LandingNav />

      {/* Main Hero Section: Hard-hides text wrapper until intro completes */}
      <main className="flex-1">
        <HeroSection introFinished={introFinished} />
        <CommunityShowcase />
      </main>

      {/* Global Community Footer */}
      <Footer />
    </>
  );
}
