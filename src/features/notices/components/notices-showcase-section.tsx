import * as React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Bell, ArrowRight, ArrowUpRight, FileText } from "lucide-react";

export async function NoticesShowcaseSection() {
  await connection();

  const notices = await prisma.notice.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });

  return (
    <section className="relative bg-[#040907] py-16 sm:py-24 border-t border-white/5 overflow-hidden text-white">
      {/* Subtle Ambient Emerald Aura */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Ambient Category Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Bell className="h-3.5 w-3.5 text-emerald-400" />
              <span>Official Circulars & Notices</span>
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-2xl sm:text-4xl font-sans font-bold tracking-tight text-white">
              Latest Forum Notices
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Important university announcements, scholarship notices, bus updates, and executive circulars.
            </p>
          </div>

          {/* Direct Link to Notices Archive */}
          <Link
            href="/notices"
            className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors gap-1.5 shrink-0 group self-start sm:self-end"
          >
            <span>View All Notices</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Digital Bulletin Board Feed */}
        {notices.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center flex flex-col items-center justify-center max-w-xl mx-auto">
            <Bell className="w-10 h-10 text-zinc-600 mb-3" />
            <h4 className="text-base font-semibold text-zinc-300">No official circulars published yet</h4>
            <p className="text-xs text-zinc-500 mt-1">Official memos, holiday notices, and executive decrees will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 sm:gap-4 max-w-5xl mx-auto w-full">
            {notices.map((notice) => {
              const nDate = new Date(notice.date);
              const day = !isNaN(nDate.getTime()) ? nDate.getDate() : "--";
              const month = !isNaN(nDate.getTime())
                ? nDate.toLocaleDateString("en-US", { month: "short" })
                : "---";
              const year = !isNaN(nDate.getTime()) ? nDate.getFullYear() : "";

              return (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#07130f]/60 hover:bg-[#07130f]/95 hover:border-emerald-500/35 backdrop-blur-xl transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)]"
                >
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                    {/* Calendar Date Block */}
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col items-center justify-center text-center shrink-0 shadow-inner group-hover:border-emerald-500/40 transition-colors">
                      <span className="text-base sm:text-lg font-bold text-emerald-300 leading-none">
                        {day}
                      </span>
                      <span className="text-[10px] sm:text-xs uppercase font-semibold text-zinc-400 mt-1 leading-none">
                        {month}
                      </span>
                      <span className="text-[9px] text-zinc-500 leading-none mt-0.5">
                        {year}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400/80 border border-white/5">
                          <FileText className="w-2.5 h-2.5" />
                          Official Memo
                        </span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {notice.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                  </div>

                  {/* Read Circular Action Button */}
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 shrink-0 self-end sm:self-center transition-transform group-hover:translate-x-0.5">
                    <span>Read Circular</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
