import * as React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import {
  CommitteeCard,
  PublicCommitteeMember,
} from "@/features/committee/components/committee-card";
import {
  Users,
  Sparkles,
  Award,
  Layers,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Committee & Advisory Board | Rangunia Students Forum (IIUC)",
  description:
    "Meet the honorable advisory panel and tiered executive leadership of Rangunia Students Forum at International Islamic University Chittagong.",
};

async function CommitteeDataContent() {
  const rawMembers = await prisma.committeeMember.findMany({
    orderBy: [{ type: "asc" }, { rank: "asc" }, { createdAt: "asc" }],
  });

  const members: PublicCommitteeMember[] = rawMembers.map((m) => ({
    id: m.id,
    type: m.type,
    name: m.name,
    photoUrl: m.photoUrl,
    gender: m.gender,
    department: m.department,
    designation: m.designation,
    quote: m.quote,
    rank: m.rank,
  }));

  // 1. ADVISORS SECTION: Filter where type === 'ADVISOR'
  const advisors = members.filter((m) => m.type === "ADVISOR");

  // 2. EXECUTIVES SECTION: Filter where type === 'EXECUTIVE' and sort by rank ascending
  const executives = members
    .filter((m) => m.type === "EXECUTIVE")
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

  // 3. TIERING ALGORITHM:
  // Group them into rows based on the integer of their rank:
  // Math.floor(exec.rank) -> 1.0, 1.1, 1.2 both become Tier 1
  const tiers = executives.reduce<Record<number, PublicCommitteeMember[]>>(
    (acc, exec) => {
      const tier = Math.floor(exec.rank ?? 0);
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(exec);
      return acc;
    },
    {}
  );

  const sortedTierKeys = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b);

  if (members.length === 0) {
    return (
      <div className="py-20 px-6 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-zinc-200">
          Committee Roster In Formation
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The executive committee and advisory board appointments for the upcoming term are currently being finalized. Please check back shortly for the official announcement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* 1. ADVISORS SECTION (Pinned to Top) */}
      {advisors.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 shadow-md shadow-amber-950/50">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Advisory Board</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300">
                    Honorable Mentors
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Respected senior patrons, faculty advisors, and foundational guidance mentors.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-amber-400/80 bg-amber-950/20 px-3 py-1 rounded-lg border border-amber-500/20 self-start sm:self-auto">
              {advisors.length} {advisors.length === 1 ? "Advisor" : "Advisors"} Pinned
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              <CommitteeCard key={advisor.id} member={advisor} priority />
            ))}
          </div>
        </section>
      )}

      {/* 2. EXECUTIVES SECTION (Tiered Integer Rows) */}
      {sortedTierKeys.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Executive Council</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
                  {executives.length} Leaders
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Elected and appointed executive body grouped by hierarchical decimal ranking tiers.
              </p>
            </div>
          </div>

          {/* Render each distinct Tier as its own horizontal row */}
          <div className="space-y-12">
            {sortedTierKeys.map((tierNum) => {
              const tierMembers = tiers[tierNum];
              const isPresidium = tierNum === 1;

              return (
                <div
                  key={tierNum}
                  className="space-y-5 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.015] relative overflow-hidden"
                >
                  {/* Subtle Background Glow for Presidium / Tier 1 */}
                  {isPresidium && (
                    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                  )}

                  {/* Tier Header Banner */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
                        {tierNum}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        {isPresidium
                          ? "Tier 1: Presidium Leadership"
                          : `Tier ${tierNum} Executive Panel`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {tierMembers.length}{" "}
                        {tierMembers.length === 1 ? "Officer" : "Officers"}
                      </span>
                    </div>
                  </div>

                  {/* Tier Grid Row */}
                  <div
                    className={`grid gap-6 ${
                      tierMembers.length === 1
                        ? "grid-cols-1 max-w-md mx-auto"
                        : tierMembers.length === 2
                        ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {tierMembers.map((member) => (
                      <CommitteeCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Constitutional Privacy Guarantee Notice */}
      <div className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-zinc-950 to-[#07130f] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Strict Constitutional Privacy Guarantee
            </h4>
            <p className="text-xs text-zinc-400">
              Female executive members and advisors are protected by the automated modesty silhouette override across all public directory views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicCommitteePage() {
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
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Leadership &amp; Governance</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Executive Committee &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-teal-200 bg-clip-text text-transparent">
                Advisory Board
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Meet the visionary minds, faculty advisors, and student executives steering the Rangunia Students Forum at International Islamic University Chittagong.
            </p>
          </div>

          {/* Committee Roster with Suspense PPR Streaming */}
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm font-mono">
                  Loading executive committee &amp; advisory board...
                </p>
              </div>
            }
          >
            <CommitteeDataContent />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
