import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { CommitteeFormDialog } from "@/features/committee/components/committee-form-dialog";
import {
  AdminCommitteeTable,
  CommitteeMemberItem,
} from "@/features/committee/components/admin-committee-table";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Users,
  ShieldAlert,
  ArrowLeft,
  Home,
  LogOut,
  Award,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";

export const metadata = {
  title: "Committee Management | Rangunia Students Forum (IIUC)",
  description:
    "Administrative console for appointing advisors and executive members with decimal rank-based tiering.",
};

async function AdminCommitteeContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/committee");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Check committee management capability
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageCommittee: true, approvalStatus: true },
    });
    hasCapability = Boolean(
      admin?.canManageCommittee && admin?.approvalStatus === "APPROVED"
    );
  }

  // Access Denied Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#040907] flex items-center justify-center p-4 text-zinc-900 dark:text-white transition-colors duration-200">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/30 dark:border-destructive/40 bg-rose-50/80 dark:bg-destructive/10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/40 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            You do not possess the required{" "}
            <code className="text-rose-600 dark:text-rose-300 font-mono font-medium">canManageCommittee</code>{" "}
            capability flag to access the Committee Management Console.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-zinc-300 dark:border-white/20 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              >
                Return to Admin Console
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                className="w-full text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all committee members
  const rawMembers = await prisma.committeeMember.findMany({
    orderBy: [{ type: "asc" }, { rank: "asc" }],
  });

  const members: CommitteeMemberItem[] = rawMembers.map((m) => ({
    id: m.id,
    type: m.type,
    name: m.name,
    photoUrl: m.photoUrl,
    gender: m.gender,
    department: m.department,
    designation: m.designation,
    quote: m.quote,
    rank: m.rank,
    createdAt: m.createdAt.toISOString(),
  }));

  // Calculate Metrics
  const totalMembers = members.length;
  const totalAdvisors = members.filter((m) => m.type === "ADVISOR").length;
  const totalExecutives = members.filter((m) => m.type === "EXECUTIVE").length;
  const distinctTiers = new Set(
    members
      .filter((m) => m.type === "EXECUTIVE" && m.rank !== null)
      .map((m) => Math.floor(m.rank as number))
  ).size;

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Committee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Committee Management Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Manage executive appointments, advisory board rosters, and tiered rank structures.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Link href="/committee" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 text-xs shadow-xs"
            >
              Live Committee
            </Button>
          </Link>
          <CommitteeFormDialog mode="create" />
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-1 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Total Roster</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{totalMembers}</div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">All registered leaders</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-1 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Honorable Advisors</span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalAdvisors}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Pinned to top section</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-1 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Executives</span>
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {totalExecutives}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Rank-driven positions</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-1 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Active Tiers</span>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {distinctTiers}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Distinct integer rows</p>
        </div>
      </div>

      {/* Data Table */}
      <AdminCommitteeTable initialMembers={members} />
    </div>
  );
}

export default function AdminCommitteePage() {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-zinc-50 dark:bg-[#040907] text-zinc-900 dark:text-white flex flex-col transition-colors duration-200 selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
      {/* Top System Bar */}
      <header className="border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Committee Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </Container>
      </header>

      {/* Main Content Area in Suspense */}
      <main className="flex-1 py-10">
        <Container>
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading committee console...</p>
              </div>
            }
          >
            <AdminCommitteeContent />
          </React.Suspense>
        </Container>
      </main>
    </div>
  );
}
