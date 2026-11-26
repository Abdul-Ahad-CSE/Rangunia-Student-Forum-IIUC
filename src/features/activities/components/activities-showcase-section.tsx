import * as React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Camera, MapPin, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";

export async function ActivitiesShowcaseSection() {
  await connection();

  const activities = await prisma.activity.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });

  return (
    <section className="relative bg-zinc-50 dark:bg-[#020604] py-16 sm:py-24 border-t border-zinc-200/80 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-white transition-colors">
      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-950/5 dark:from-teal-950/20 via-transparent to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Ambient Category Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <Camera className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Community Memories &amp; Action</span>
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-2xl sm:text-4xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white">
              Recent Forum Activities
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Reliving social initiatives, sports tournaments, study sessions, and campus life with Rangunia students.
            </p>
          </div>

          {/* Direct Link to Activities Archive */}
          <Link
            href="/activities"
            className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors gap-1.5 shrink-0 group self-start sm:self-end"
          >
            <span>Explore All Activities</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Quantity Handling for Asymmetric Bento Photo Grid */}
        {activities.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center flex flex-col items-center justify-center max-w-xl mx-auto">
            <Camera className="w-10 h-10 text-zinc-600 mb-3" />
            <h4 className="text-base font-semibold text-zinc-300">No activity records archived yet</h4>
            <p className="text-xs text-zinc-500 mt-1">Photo highlights of forum gatherings and social drives will be showcased here.</p>
          </div>
        ) : activities.length === 1 ? (
          /* Single Widescreen Showcase Card */
          <div className="max-w-4xl mx-auto w-full">
            <ActivityBentoCard activity={activities[0]} isLead aspectRatio="aspect-[16/9] sm:aspect-[21/9]" />
          </div>
        ) : activities.length === 2 ? (
          /* Balanced 2-Column Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
            {activities.map((activity) => (
              <ActivityBentoCard key={activity.id} activity={activity} aspectRatio="aspect-[16/10]" />
            ))}
          </div>
        ) : (
          /* 3 Items: Asymmetric Bento Photo Grid (1-large + 2-stacked) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
            {/* Card 1: Lead Activity (Span 7) */}
            <div className="md:col-span-7 flex">
              <ActivityBentoCard
                activity={activities[0]}
                isLead
                aspectRatio="aspect-[16/10] md:aspect-auto md:h-full"
              />
            </div>

            {/* Cards 2 & 3: Stacked Highlights (Span 5) */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
              <ActivityBentoCard activity={activities[1]} aspectRatio="aspect-[16/9]" />
              <ActivityBentoCard activity={activities[2]} aspectRatio="aspect-[16/9]" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

interface ActivityBentoCardProps {
  activity: {
    id: string;
    title: string;
    date: Date;
    time: string;
    location: string;
    photos: string[];
    description: string;
  };
  isLead?: boolean;
  aspectRatio?: string;
}

function ActivityBentoCard({
  activity,
  isLead = false,
  aspectRatio = "aspect-[16/9]",
}: ActivityBentoCardProps) {
  const primaryPhoto = activity.photos?.[0] || "/images/rsf4.jpg";
  const aDate = new Date(activity.date);
  const formattedDate = !isNaN(aDate.getTime())
    ? aDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  return (
    <Link
      href={`/activities/${activity.id}`}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-xl transition-all hover:border-teal-500/40 hover:shadow-[0_15px_40px_rgba(20,184,166,0.12)] w-full ${aspectRatio} flex flex-col justify-end p-5 sm:p-7`}
    >
      {/* Background Cover Photo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryPhoto}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
      </div>

      {/* Top Bar Badges */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {activity.photos && activity.photos.length > 1 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200 shadow-md">
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>+{activity.photos.length} Photos</span>
          </span>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 space-y-2">
        {/* Meta Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-950/60 px-2.5 py-1 text-teal-300 font-medium backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="line-clamp-1">{activity.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-zinc-300 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-white group-hover:text-teal-300 transition-colors leading-tight ${
            isLead ? "text-xl sm:text-2xl md:text-3xl line-clamp-2" : "text-base sm:text-lg line-clamp-2"
          }`}
        >
          {activity.title}
        </h3>

        {/* Description Preview (Only on Lead or larger cards) */}
        {isLead && (
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        )}

        {/* Link Arrow */}
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 pt-1 group-hover:text-teal-300">
          <span>View Activity Archive</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
