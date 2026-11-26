"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TopEventItem } from "../lib/get-top-events";

interface TopEventsCarouselProps {
  events: TopEventItem[];
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 28,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  }),
};

export function TopEventsCarousel({ events }: TopEventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [isPaused, setIsPaused] = React.useState(false);

  const safeEvents = events.length > 0 ? events : [];
  const currentEvent = safeEvents[currentIndex] || safeEvents[0];

  const paginate = React.useCallback(
    (newDirection: number) => {
      if (safeEvents.length <= 1) return;
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex >= safeEvents.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = safeEvents.length - 1;
        return nextIndex;
      });
    },
    [safeEvents.length]
  );

  const goToSlide = React.useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Automated slide cycle every 5.5 seconds (left-to-right progression)
  React.useEffect(() => {
    if (isPaused || safeEvents.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, safeEvents.length, paginate]);

  if (!currentEvent) {
    return null;
  }

  const eDate = new Date(currentEvent.eventDate);
  const rDeadline = new Date(currentEvent.registrationDeadline);
  const now = new Date();

  const isCompleted = now > eDate;
  const isRegistrationOpen = now <= rDeadline;

  const formattedDate = !isNaN(eDate.getTime())
    ? eDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  const eventTargetHref = currentEvent.id.startsWith("mock-")
    ? "/events"
    : `/events/${currentEvent.id}`;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Cinematic Carousel Slide Window */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#091712]/90 via-[#06120e]/95 to-[#040c09] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentEvent.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-5 sm:p-7 lg:p-9 items-center"
          >
            {/* Banner Column (16:9 Aspect Ratio) */}
            <div className="lg:col-span-7 relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-inner">
              {currentEvent.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentEvent.bannerUrl}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-6 text-center">
                  <Calendar className="w-12 h-12 text-emerald-400/60 mb-2" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                    Forum Gathering
                  </span>
                </div>
              )}

              {/* Dark Gradient Overlay for High Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Status Badge Positioned on Banner */}
              <div className="absolute top-3.5 left-3.5 z-10">
                {isCompleted ? (
                  <Badge
                    variant="outline"
                    className="border-white/15 bg-black/60 backdrop-blur-md text-zinc-300 text-xs font-medium px-3 py-1"
                  >
                    Concluded
                  </Badge>
                ) : isRegistrationOpen ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Registration Open
                  </span>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-950/80 backdrop-blur-md text-amber-300 text-xs font-medium px-3 py-1"
                  >
                    Upcoming
                  </Badge>
                )}
              </div>
            </div>

            {/* Event Details Column */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full gap-5">
              <div className="space-y-3.5">
                {/* Meta Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{formattedDate}</span>
                  </span>
                  {currentEvent.eventTime && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>{currentEvent.eventTime}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight">
                  {currentEvent.title}
                </h3>

                {/* Venue */}
                <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{currentEvent.venue}</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/10">
                <Link href={eventTargetHref} className="w-full block">
                  <Button
                    size="lg"
                    className="w-full h-11 sm:h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Details & Register</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls: Sleek Floating Chevrons & Glowing Progress Pills */}
      <div className="flex items-center justify-between mt-5 px-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous event"
          className="h-9 w-9 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-emerald-950/60 hover:border-emerald-500/40 text-white transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dynamic Glowing Progress Pills */}
        <div className="flex items-center gap-2.5">
          {safeEvents.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "transition-all duration-500 cursor-pointer",
                currentIndex === idx
                  ? "w-8 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40 rounded-full"
              )}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next event"
          className="h-9 w-9 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-emerald-950/60 hover:border-emerald-500/40 text-white transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
