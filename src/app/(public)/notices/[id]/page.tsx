import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { Calendar, ArrowLeft, FileText, Loader2 } from "lucide-react";

interface PublicNoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicNoticeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({
    where: { id },
    select: { title: true, content: true },
  });

  if (!notice) {
    return {
      title: "Notice Not Found | Rangunia Students Forum (IIUC)",
    };
  }

  return {
    title: `${notice.title} | Notice | Rangunia Students Forum (IIUC)`,
    description: notice.content.slice(0, 160),
  };
}

async function NoticeDetailContent({ params }: PublicNoticeDetailPageProps) {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!notice) {
    notFound();
  }

  const pDate = new Date(notice.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all notices</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{pDate}</span>
        </div>
      </div>

      {/* Banner Hero if present */}
      {notice.bannerUrl && (
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={notice.bannerUrl}
            alt={notice.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Notice Title & Metadata */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-300">
          <FileText className="w-3.5 h-3.5" />
          <span>Official Circular</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {notice.title}
        </h1>

        <p className="text-xs text-zinc-400 flex items-center gap-2">
          <span>Published on {pDate}</span>
          <span className="text-zinc-600">•</span>
          <span>By Executive Committee</span>
        </p>
      </div>

      {/* Notice Content */}
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-line shadow-lg">
        {notice.content}
      </div>

      {/* Bottom Navigation Prompt */}
      <div className="pt-4 flex items-center justify-between border-t border-white/10">
        <Link
          href="/notices"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse all notices</span>
        </Link>

        <Link
          href="/activities"
          className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
        >
          <span>View Forum Activities</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default function PublicNoticeDetailPage({
  params,
}: PublicNoticeDetailPageProps) {
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
                <p className="text-sm">Loading notice details...</p>
              </div>
            }
          >
            <NoticeDetailContent params={params} />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
