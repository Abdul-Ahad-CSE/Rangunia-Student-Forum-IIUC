import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Users,
  LogOut,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Loader2,
  Home,
} from "lucide-react";
import { MemberApprovalList } from "@/features/approvals/components/member-approval-list";
import type { SerializedPendingMember } from "@/features/approvals/types/approval.types";

export const metadata = {
  title: "Member Approvals | RSF Admin Console",
  description: "Review and approve pending student and alumni forum registrations.",
};

async function ApprovalsDashboardContent() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/approvals");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Check granular capability for regular admins
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageProfiles: true, approvalStatus: true },
    });
    hasCapability = Boolean(admin?.canManageProfiles && admin?.approvalStatus === "APPROVED");
  }

  // Access Denied Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrative Access Denied</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your executive account does not possess the <code className="text-rose-300 font-mono">canManageProfiles</code> permission.
            Please request approval capability access from the Super Admin.
          </p>
          <div className="pt-2">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="border-white/10 text-white text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>Return to Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all pending Users
  const pendingUsers = await prisma.user.findMany({
    where: { approvalStatus: "PENDING" },
    include: {
      studentProfile: true,
      alumniProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedMembers: SerializedPendingMember[] = pendingUsers.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    studentId: u.studentId,
    email: u.email,
    role: u.alumniProfile ? "ALUMNI" : "STUDENT",
    department: u.department,
    session: u.session,
    phone: u.phone,
    bloodGroup: u.bloodGroup,
    address: u.permanentAddress || u.presentAddress || null,
    approvalStatus: u.approvalStatus,
    verificationStatus: u.verificationStatus,
    photoUrl: u.photoUrl,
    createdAt: u.createdAt.toISOString(),
    isAlumni: Boolean(u.alumniProfile),
    jobPosition: u.alumniProfile?.jobPosition,
    company: u.alumniProfile?.company,
    currentSemester: u.studentProfile?.currentSemester,
  }));

  const pendingStudents = serializedMembers.filter((m) => !m.isAlumni).length;
  const pendingAlumni = serializedMembers.filter((m) => m.isAlumni).length;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#040907] text-white">
      {/* Top Header - 2-Tier Mobile Header Architecture */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
          {/* Row 1 on Mobile / Left Column on Desktop */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 shadow-md shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                    Member Approvals
                  </span>
                  <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400 shrink-0">
                    {isSuperAdmin ? "SUPER ADMIN" : "PROFILES"}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[170px] sm:max-w-none">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Mobile Quick Utility Actions */}
            <div className="flex items-center gap-1.5 sm:hidden shrink-0">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                  title="Home"
                >
                  <Home className="h-3.5 w-3.5 text-emerald-400" />
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
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Row 2 on Mobile: Dedicated Full-Width Back Button (< sm) | Desktop Actions (sm:) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="w-full sm:hidden pt-1 border-t border-white/5">
              <Link href={isSuperAdmin ? "/admin/super" : "/admin/dashboard"} className="w-full block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/50 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{isSuperAdmin ? "← Back to Authority Center" : "← Back to Admin Console"}</span>
                </Button>
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              {isSuperAdmin ? (
                <Link href="/admin/super">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    <span>Super Admin Panel</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    <span>Admin Dashboard</span>
                  </Button>
                </Link>
              )}

              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs px-3 h-9"
                >
                  <Home className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
                  <span>← Home</span>
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
                  variant="outline"
                  size="sm"
                  className="border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white text-xs px-3 h-9"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  <span>Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Workspace */}
      <main className="py-8 sm:py-10">
        <Container className="space-y-6 sm:space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
                Member Registration Approvals
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Review and approve newly registered IIUC students and alumni before their profiles become verified in the community directory.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:items-center sm:gap-3">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Students</p>
                  <p className="text-sm sm:text-base font-bold text-amber-300">{pendingStudents}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Alumni</p>
                  <p className="text-sm sm:text-base font-bold text-teal-300">{pendingAlumni}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Total Queue</p>
                  <p className="text-sm sm:text-base font-bold text-white">{serializedMembers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modular Member Approval List */}
          <MemberApprovalList initialMembers={serializedMembers} />
        </Container>
      </main>
    </div>
  );
}

export default function AdminApprovalsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <ApprovalsDashboardContent />
    </React.Suspense>
  );
}
