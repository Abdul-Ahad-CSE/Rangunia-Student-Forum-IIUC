import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { EventCard, PublicEventCardData } from "@/features/events/components/event-card";
import {
  Calendar,
  Sparkles,
  History,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Gatherings | Rangunia Students Forum (IIUC)",
  description:
    "Discover upcoming forum meetups, annual iftar, orientation, workshops, and historical photo recaps of Rangunia Students Forum at IIUC.",
};

async function EventsDataContent() {
  // Query all events ordered by eventDate ascending
  const rawEvents = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
  });

  const now = new Date();

  // Partition into upcoming and past events
  const upcomingEvents: PublicEventCardData[] = [];
  const pastEvents: PublicEventCardData[] = [];

  for (const ev of rawEvents) {
    const cardData: PublicEventCardData = {
      id: ev.id,
      title: ev.title,
      bannerUrl: ev.bannerUrl,
      eventDate: ev.eventDate,
      eventTime: ev.eventTime,
      venue: ev.venue,
      registrationDeadline: ev.registrationDeadline,
      description: ev.description,
      postEventRecap: ev.postEventRecap,
      postEventPhotos: ev.postEventPhotos,
    };

    if (new Date(ev.eventDate) >= now) {
      upcomingEvents.push(cardData);
    } else {
      pastEvents.push(cardData);
    }
  }

  // Sort past events descending (most recent first)
  pastEvents.sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  return (
    <div className="space-y-12">
      {/* Section 1: Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Upcoming Events</h2>
              <p className="text-xs text-zinc-400">
                Register and participate in forthcoming sessions
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            {upcomingEvents.length} Upcoming
          </span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="py-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300">
              No upcoming events scheduled right now
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Our executive committee is planning new sessions soon. Check back later or review our past event memories below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Past Events & Archival Recaps */}
      {pastEvents.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-200">Past Events &amp; Recaps</h2>
                <p className="text-xs text-zinc-400">
                  Archive of completed gatherings, symposiums, and photo highlights
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-white/10 px-2.5 py-1 rounded-full">
              {pastEvents.length} Concluded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Community Link */}
      <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-[#07130f] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-white text-base">Want to organize or suggest a community event?</h3>
          <p className="text-xs text-zinc-400">
            Connect with the executive panel or message an administrator through the member directory.
          </p>
        </div>
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-emerald-950/40 hover:border-emerald-500/40 text-xs font-semibold text-white transition-all shrink-0"
        >
          <span>Explore Directory</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </Link>
      </div>
    </div>
  );
}

export default function PublicEventsPage() {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <LandingNav />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-24">
        <Container className="space-y-12">
          {/* Header Banner */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus &amp; Community Gatherings</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Forum Events &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Engagements
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Stay connected with upcoming reunions, orientation programs, cultural evenings, and academic workshops organized by Rangunia Students Forum at IIUC.
            </p>
          </div>

          {/* Events Data in Suspense */}
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading forum events...</p>
              </div>
            }
          >
            <EventsDataContent />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
