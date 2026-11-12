import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { ActivityPhotoGallery } from "@/features/activities/components/activity-photo-gallery";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Activity as ActivityIcon,
  Loader2,
  CalendarDays,
} from "lucide-react";

interface PublicActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicActivityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!activity) {
    return {
      title: "Activity Not Found | Rangunia Students Forum (IIUC)",
    };
  }

  return {
    title: `${activity.title} | Activities | Rangunia Students Forum (IIUC)`,
    description: activity.description.slice(0, 160),
  };
}

async function ActivityDetailContent({ params }: PublicActivityDetailPageProps) {
  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    notFound();
  }

  const pDate = new Date(activity.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const primaryPhoto =
    activity.photos && activity.photos.length > 0 ? activity.photos[0] : null;

  return (
    <div className="space-y-8">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all activities</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{pDate}</span>
        </div>
      </div>

      {/* Primary Cover Photo Hero if available */}
      {primaryPhoto && (
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryPhoto}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title & Metadata Pills */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-300">
          <ActivityIcon className="w-3.5 h-3.5" />
          <span>Forum Activity &amp; Social Initiative</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {activity.title}
        </h1>

        {/* Schedule & Location Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{pDate}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{activity.time}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      {/* Description Body */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Activity Overview &amp; Report
        </h3>
        <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-line shadow-lg">
          {activity.description}
        </div>
      </div>

      {/* Photo Gallery & Lightbox */}
      {activity.photos && activity.photos.length > 0 && (
        <div className="pt-4">
          <ActivityPhotoGallery
            photos={activity.photos}
            title={activity.title}
          />
        </div>
      )}

      {/* Bottom Navigation Prompt */}
      <div className="pt-6 flex items-center justify-between border-t border-white/10">
        <Link
          href="/activities"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse all activities</span>
        </Link>

        <Link
          href="/events"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>View Upcoming Events</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default function PublicActivityDetailPage({
  params,
}: PublicActivityDetailPageProps) {
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
                <p className="text-sm">Loading activity details...</p>
              </div>
            }
          >
            <ActivityDetailContent params={params} />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}