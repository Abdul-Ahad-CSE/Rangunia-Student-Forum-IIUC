import { CinematicIntro } from "@/features/landing/components/cinematic-intro";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { HeroSection } from "@/features/landing/components/hero-section";
import { CommunityShowcase } from "@/features/landing/components/community-showcase";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <>
      {/* Session-Aware GSAP Cinematic Intro Sequence */}
      <CinematicIntro />

      {/* Responsive Navigation */}
      <LandingNav />

      {/* Main Hero Section */}
      <main className="flex-1">
        <HeroSection />
        <CommunityShowcase />
      </main>

      {/* Global Community Footer */}
      <Footer />
    </>
  );
}
