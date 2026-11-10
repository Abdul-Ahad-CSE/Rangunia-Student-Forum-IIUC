import * as React from "react";
import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { DirectoryView } from "@/features/directory/components/directory-view";
import { getDirectoryData } from "@/features/directory/lib/get-directory-data";
import { Users, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Public Directory | Rangunia Students Forum (IIUC)",
  description:
    "Explore the verified directory of Rangunia students and alumni at IIUC with smart search, batch filtering, and privacy-shielded profiles.",
};

interface DirectoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function DirectoryDataContent({ searchParams }: DirectoryPageProps) {
  const resolvedParams = await searchParams;

  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const tab =
    resolvedParams.tab === "alumni" || resolvedParams.tab === "all"
      ? resolvedParams.tab
      : "students";
  const batch = typeof resolvedParams.batch === "string" ? resolvedParams.batch : undefined;
  const department =
    typeof resolvedParams.department === "string" ? resolvedParams.department : undefined;
  const profession =
    typeof resolvedParams.profession === "string" ? resolvedParams.profession : undefined;
  const bloodGroup =
    typeof resolvedParams.bloodGroup === "string" ? resolvedParams.bloodGroup : undefined;
  const city = typeof resolvedParams.city === "string" ? resolvedParams.city : undefined;

  // Server-side fetch with strict data masking
  const { members, counts, options } = await getDirectoryData({
    search,
    tab,
    batch,
    department,
    profession,
    bloodGroup,
    city,
  });

  return (
    <DirectoryView
      initialMembers={members}
      counts={counts}
      options={options}
    />
  );
}

export default function DirectoryPage({ searchParams }: DirectoryPageProps) {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <LandingNav />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <Container className="space-y-8">
          {/* Header Banner */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Users className="w-3.5 h-3.5" />
              <span>Community Network</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Students &amp; Alumni{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Connect with fellow Rangunia students and accomplished alumni at IIUC.
              All sensitive contact details are privacy-controlled by individual members.
            </p>
          </div>

          {/* Directory Coordinator with Smart Search & Filtering in Suspense */}
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading community directory...</p>
              </div>
            }
          >
            <DirectoryDataContent searchParams={searchParams} />
          </React.Suspense>
        </Container>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
