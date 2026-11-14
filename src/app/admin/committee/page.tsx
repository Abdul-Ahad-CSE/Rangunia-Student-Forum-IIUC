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
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You do not possess the required{" "}
            <code className="text-rose-300 font-mono">canManageCommittee</code>{" "}
            capability flag to access the Committee Management Console.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-white/20 text-xs text-zinc-300 hover:text-white"
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
                className="w-full text-xs text-rose-400 hover:bg-rose-950/20"
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
    <div className="py-10 bg-[#040907] min-h-[calc(100vh-65px)] text-white">
      <Container className="space-y-8">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Admin Console</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-300 font-medium">
              Committee Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Home</span>
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
                size="sm"
                className="h-8 px-2 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20"
              >
                <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Console Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Committee Management
              </h1>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl pl-11">
              Appoint advisors and executive panel members. Rank executives with decimals (e.g., 1.0, 1.1) to automatically construct tiered horizontal organizational rows.
            </p>
          </div>

          <CommitteeFormDialog mode="create" />
        </div>

        {/* Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Roster</span>
            </div>
            <div className="text-2xl font-black text-white">{totalMembers}</div>
            <p className="text-[10px] text-zinc-500">All registered leaders</p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Honorable Advisors</span>
            </div>
            <div className="text-2xl font-black text-amber-400">
              {totalAdvisors}
            </div>
            <p className="text-[10px] text-zinc-500">Pinned to top section</p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>Executives</span>
            </div>
            <div className="text-2xl font-black text-teal-400">
              {totalExecutives}
            </div>
            <p className="text-[10px] text-zinc-500">Rank-driven positions</p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Active Tiers</span>
            </div>
            <div className="text-2xl font-black text-purple-400">
              {distinctTiers}
            </div>
            <p className="text-[10px] text-zinc-500">Distinct integer rows</p>
          </div>
        </div>

        {/* Data Table */}
        <AdminCommitteeTable initialMembers={members} />
      </Container>
    </div>
  );
}

export default function AdminCommitteePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#040907] flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono">Loading Committee Console...</p>
        </div>
      }
    >
      <AdminCommitteeContent />
    </React.Suspense>
  );
}
