import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getTopEvents } from "../lib/get-top-events";
import { TopEventsCarousel } from "./top-events-carousel";

export async function EventsShowcaseSection() {
  const events = await getTopEvents();

  return (
    <section className="relative bg-zinc-50 dark:bg-[#030806] pt-10 pb-16 sm:py-24 border-t border-b border-zinc-200/80 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-white transition-colors">
      {/* Ambient Radial Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/5 dark:from-emerald-950/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Ambient Category Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Forum Gatherings &amp; Sessions</span>
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-2xl sm:text-4xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white">
              Upcoming &amp; Featured Events
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stay connected with campus gatherings, academic workshops, and reunions organized by Rangunia Students Forum.
            </p>
          </div>

          {/* Direct Link to Archive */}
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors gap-1.5 shrink-0 group self-start sm:self-end"
          >
            <span>Explore All Events</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Left-to-Right Events Carousel */}
        <TopEventsCarousel events={events} />
      </Container>
    </section>
  );
}
