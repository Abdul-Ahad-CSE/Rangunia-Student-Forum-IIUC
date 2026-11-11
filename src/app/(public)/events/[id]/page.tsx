import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { Badge } from "@/components/ui/badge";
import { EventRegisterButton } from "@/features/events/components/event-register-button";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Sparkles,
  Camera,
  Quote,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface PublicEventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicEventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!event) {
    return {
      title: "Event Not Found | Rangunia Students Forum (IIUC)",
    };
  }

  return {
    title: `${event.title} | Rangunia Students Forum (IIUC)`,
    description: event.description.slice(0, 160),
  };
}

async function EventDetailContent({ params }: PublicEventDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  // Check viewer's registration status if authenticated
  let isRegistered = false;
  if (session?.user?.id) {
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId: session.user.id,
        },
      },
    });
    isRegistered = Boolean(registration);
  }

  const now = new Date();
  const eDate = new Date(event.eventDate);
  const rDeadline = new Date(event.registrationDeadline);

  const isCompleted = now > eDate;
  const isRegistrationOpen = now <= rDeadline;

  const formattedEventDate = eDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedDeadline = rDeadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const hasRecap = Boolean(event.postEventRecap?.trim());
  const hasPhotos = event.postEventPhotos && event.postEventPhotos.length > 0;

  return (
    <div className="space-y-10">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all events</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <Badge
              variant="outline"
              className="border-white/10 bg-black/60 text-zinc-300 text-xs font-mono"
            >
              Concluded
            </Badge>
          ) : isRegistrationOpen ? (
            <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold text-xs shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Registration Open
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-950/70 text-amber-300 text-xs font-mono"
            >
              Registration Closed
            </Badge>
          )}
        </div>
      </div>

      {/* Banner Hero */}
      <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-950/90 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-8 text-center space-y-2">
            <Calendar className="w-14 h-14 text-emerald-400/60 mb-2" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
              Rangunia Students Forum (IIUC)
            </span>
            <p className="text-sm text-zinc-400 max-w-md">
              Community meetup, knowledge exchange, and cultural session
            </p>
          </div>
        )}
      </div>

      {/* Event Header Information */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {event.title}
        </h1>

        {/* Quick Metadata Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-400 font-mono uppercase">Event Date</p>
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
                {formattedEventDate}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-400 font-mono uppercase">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
                {event.eventTime}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-400 font-mono uppercase">Venue</p>
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
                {event.venue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Registration Panel */}
      <div className="p-6 sm:p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-[#07130f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Registration Window
            </span>
            {isRegistrationOpen && !isCompleted && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-300">
            Deadline: <strong className="text-white">{formattedDeadline}</strong>
          </p>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attendance is verified for forum members upon arrival.</span>
          </p>
        </div>

        {/* Dynamic Registration Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <EventRegisterButton
            eventId={event.id}
            registrationDeadline={event.registrationDeadline}
            isLoggedIn={Boolean(session?.user?.id)}
            isRegistered={isRegistered}
            size="lg"
          />
        </div>
      </div>

      {/* Event Description */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>About This Event</span>
        </h2>
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {event.description}
        </div>
      </div>

      {/* Post-Event Highlights & Photos Section (If Populated) */}
      {(hasRecap || hasPhotos) && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Event Recap &amp; Highlights
              </h2>
              <p className="text-xs text-zinc-400">
                Key takeaways and photo moments from the gathering
              </p>
            </div>
          </div>

          {/* Recap Summary Narrative */}
          {hasRecap && (
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 relative space-y-2">
              <Quote className="w-8 h-8 text-emerald-500/20 absolute top-4 right-4" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Executive Summary &amp; Review
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line pr-8">
                {event.postEventRecap}
              </p>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {hasPhotos && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Photo Gallery ({event.postEventPhotos.length} photos)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.postEventPhotos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-zinc-950 group shadow-md"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={`${event.title} photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Prompt */}
      <div className="pt-4 flex items-center justify-between border-t border-white/10">
        <Link
          href="/events"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse other upcoming events</span>
        </Link>

        <Link
          href="/directory"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <span>View Community Directory</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default function PublicEventDetailPage({
  params,
}: PublicEventDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <LandingNav />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-24">
        <Container className="space-y-10 max-w-4xl">
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading event details...</p>
              </div>
            }
          >
            <EventDetailContent params={params} />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
