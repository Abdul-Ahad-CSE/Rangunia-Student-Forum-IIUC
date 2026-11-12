import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import {
  ActivityCard,
  PublicActivityCardData,
} from "@/features/activities/components/activity-card";
import { Activity, ArrowRight, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Forum Activities & Initiatives | Rangunia Students Forum (IIUC)",
  description:
    "Explore social welfare projects, community relief programs, academic workshops, and volunteer initiatives organized by Rangunia Students Forum at IIUC.",
};

async function ActivitiesDataContent() {
  const rawActivities = await prisma.activity.findMany({
    orderBy: { date: "desc" },
  });

  const activities: PublicActivityCardData[] = rawActivities.map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    time: a.time,
    location: a.location,
    photos: a.photos || [],
    description: a.description,
  }));

  return (
    <div className="space-y-8">
      {activities.length === 0 ? (
        <div className="py-16 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-300">
            No activity records archived yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Our volunteers and executives are actively documenting forthcoming community projects. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-[#07130f] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-white text-base">Want to volunteer or suggest an activity?</h3>
          <p className="text-xs text-zinc-400">
            Reach out to our executive panel or get in touch with mentors in our verified directory.
          </p>
        </div>
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-emerald-950/40 hover:border-emerald-500/40 text-xs font-semibold text-white transition-all shrink-0"
        >
          <span>Find Members</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </Link>
      </div>
    </div>
  );
}

export default function PublicActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <LandingNav />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-24">
        <Container className="space-y-10">
          {/* Header Banner */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Social Welfare &amp; Community Impact</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Forum Activities &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Initiatives
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Discover the beneficial works, winter relief drives, tree plantations, student workshops, and humanitarian initiatives driven by Rangunia Students Forum at IIUC.
            </p>
          </div>

          {/* Activities Data in Suspense */}
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading forum activities...</p>
              </div>
            }
          >
            <ActivitiesDataContent />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
