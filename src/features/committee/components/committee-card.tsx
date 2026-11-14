"use client";

import * as React from "react";
import {
  Quote as QuoteIcon,
  Sparkles,
  Award,
  GraduationCap,
  User,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface PublicCommitteeMember {
  id: string;
  type: "ADVISOR" | "EXECUTIVE";
  name: string;
  photoUrl: string;
  gender: string;
  department: string;
  designation: string;
  quote: string;
  rank: number | null;
}

interface CommitteeCardProps {
  member: PublicCommitteeMember;
  priority?: boolean;
  className?: string;
}

export function CommitteeCard({ member, className }: CommitteeCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const isFemale = member.gender.trim().toLowerCase() === "female";
  const isAdvisor = member.type === "ADVISOR";

  // STRICT RENDER OVERRIDE:
  // If member is female, strictly override photoUrl to "/hijabi.png"
  const avatarSrc = isFemale ? "/hijabi.png" : member.photoUrl || "/hijabi.png";

  return (
    <>
      {/* INITIAL CARD VIEW:
          Shows Photo, Name, Designation, and Quote */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          "group relative flex flex-col justify-between p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left cursor-pointer outline-none hover:-translate-y-1 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]",
          isAdvisor
            ? "border-amber-500/20 bg-gradient-to-b from-amber-950/15 via-[#081510] to-[#040907] hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-950/30"
            : "border-white/10 bg-gradient-to-b from-white/[0.03] to-[#050e0a] hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/30",
          className
        )}
      >
        {/* Glow Accent Top Right */}
        <div
          className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity opacity-20 group-hover:opacity-40 ${
            isAdvisor ? "bg-amber-400" : "bg-emerald-400"
          }`}
        />

        <div className="space-y-2.5 sm:space-y-4">
          {/* Avatar & Role Badge */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="relative">
              <div
                className={`w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                  isAdvisor
                    ? "border-amber-400/50 bg-amber-950/30 shadow-amber-950/40"
                    : "border-emerald-500/40 bg-zinc-950 shadow-emerald-950/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {isAdvisor ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/40 bg-amber-950/40 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-amber-300 shadow-sm shrink-0">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                <span>Advisor</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider uppercase text-emerald-300 shrink-0">
                <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                <span>Executive</span>
              </span>
            )}
          </div>

          {/* Name & Designation */}
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight line-clamp-1 sm:line-clamp-none">
              {member.name}
            </h3>
            <p
              className={`text-[10px] sm:text-xs font-medium line-clamp-1 ${
                isAdvisor ? "text-amber-200/90" : "text-emerald-400/90"
              }`}
            >
              {member.designation}
            </p>
          </div>

          {/* Quote (Hidden on mobile to drastically reduce vertical scrolling) */}
          <div className="relative pt-1 hidden sm:block">
            <QuoteIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600 mb-1 opacity-60" />
            <p className="text-xs text-zinc-300 italic line-clamp-3 leading-relaxed pl-1">
              &quot;{member.quote}&quot;
            </p>
          </div>
        </div>

        {/* Card Footer: Subtle Hint to Click */}
        <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <span>View Details</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400 shrink-0" />
        </div>
      </div>

      {/* DETAILED VIEW MODAL:
          Dialog opening on card click, displaying full details without leaving page */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg bg-[#07130f]/95 backdrop-blur-2xl border border-white/15 text-white p-6 sm:p-8 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-xl ${
                    isAdvisor
                      ? "border-amber-400/60 bg-amber-950/40"
                      : "border-emerald-500/50 bg-zinc-950"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1.5 min-w-0">
                {isAdvisor && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/50 text-[10px] font-mono font-bold uppercase text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Advisory Board</span>
                    </span>
                  </div>
                )}

                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {member.name}
                </DialogTitle>

                <p
                  className={`text-xs font-semibold ${
                    isAdvisor ? "text-amber-300" : "text-emerald-400"
                  }`}
                >
                  {member.designation}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Member Details Breakdown */}
          <div className="space-y-5 pt-4">
            {/* Department & Gender Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-zinc-500">
                    Academic Department
                  </div>
                  <div className="font-semibold text-zinc-200">
                    {member.department}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg border ${
                    isFemale
                      ? "bg-rose-950/60 border-rose-500/30 text-rose-400"
                      : "bg-teal-950/60 border-teal-500/30 text-teal-400"
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-zinc-500">
                    Gender Identity
                  </div>
                  <div className="font-semibold text-zinc-200">
                    {member.gender}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Quote Statement */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <QuoteIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Message &amp; Perspective</span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-zinc-200 leading-relaxed italic border-l-4 border-l-emerald-500">
                &quot;{member.quote}&quot;
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
