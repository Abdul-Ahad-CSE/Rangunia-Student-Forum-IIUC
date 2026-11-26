import * as React from "react";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingHeroContainer } from "@/features/landing/components/landing-hero-container";
import { EventsShowcaseSection } from "@/features/events/components/events-showcase-section";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#040907]">
      {/* Global Server-Aware Navigation */}
      <LandingNav />

      {/* Main Landmark: Cinematic Intro + Hero Section + Featured Events Showcase */}
      <main className="flex-1 flex flex-col">
        <LandingHeroContainer />
        <React.Suspense fallback={<div className="min-h-[400px] bg-[#030806]" />}>
          <EventsShowcaseSection />
        </React.Suspense>
      </main>

      {/* Global Community Footer */}
      <Footer />
    </div>
  );
}
