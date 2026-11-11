"use client";

import * as React from "react";
import { CinematicIntro } from "./cinematic-intro";
import { HeroSection } from "./hero-section";

export function LandingHeroContainer() {
  const [introFinished, setIntroFinished] = React.useState(false);

  return (
    <>
      {/* Session-Aware GSAP Cinematic Intro Sequence (rendered on SSR to prevent FOUC) */}
      {!introFinished && (
        <CinematicIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* Main Hero Section: Hard-hides text wrapper until intro completes */}
      <HeroSection introFinished={introFinished} />
    </>
  );
}
