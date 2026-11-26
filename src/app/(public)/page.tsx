import * as React from "react";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingHeroContainer } from "@/features/landing/components/landing-hero-container";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#040907]">
      {/* Global Server-Aware Navigation */}
      <LandingNav />

      {/* Main Landmark: Cinematic Intro + Hero Section */}
      <main className="flex-1 flex flex-col">
        <LandingHeroContainer />
      </main>

      {/* Global Community Footer */}
      <Footer />
    </div>
  );
}
