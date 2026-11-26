import * as React from "react";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingHeroContainer } from "@/features/landing/components/landing-hero-container";
import { EventsShowcaseSection } from "@/features/events/components/events-showcase-section";
import { NoticesShowcaseSection } from "@/features/notices/components/notices-showcase-section";
import { ActivitiesShowcaseSection } from "@/features/activities/components/activities-showcase-section";
import { AboutShowcaseSection } from "@/features/about/components/about-showcase-section";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#040907]">
      {/* Global Server-Aware Navigation */}
      <LandingNav />

      {/* Main Landmark: Cinematic Intro + Hero Section + Events + Notices + Activities + About RSF */}
      <main className="flex-1 flex flex-col">
        <LandingHeroContainer />
        <React.Suspense fallback={<div className="min-h-[400px] bg-[#030806]" />}>
          <EventsShowcaseSection />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[300px] bg-[#040907]" />}>
          <NoticesShowcaseSection />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[400px] bg-[#020604]" />}>
          <ActivitiesShowcaseSection />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[400px] bg-[#030806]" />}>
          <AboutShowcaseSection />
        </React.Suspense>
      </main>

      {/* Global Community Footer */}
      <Footer />
    </div>
  );
}
