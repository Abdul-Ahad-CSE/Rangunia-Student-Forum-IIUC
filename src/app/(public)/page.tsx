import * as React from "react";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingHeroContainer } from "@/features/landing/components/landing-hero-container";
import { CommunityShowcase } from "@/features/landing/components/community-showcase";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <>
      {/* Session-Aware GSAP Cinematic Intro Sequence + Hero Section */}
      <LandingHeroContainer />

      {/* Global Server-Aware Navigation */}
      <LandingNav />

      {/* Community Showcase Section */}
      <main className="flex-1">
        <CommunityShowcase />
      </main>

      {/* Global Community Footer */}
      <Footer />
    </>
  );
}
