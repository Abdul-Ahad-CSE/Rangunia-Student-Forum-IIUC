import * as React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { SuperAdminTabs } from "@/features/admin/components/super-admin-tabs";
import type { SerializedAdminUser } from "@/features/admin/components/admin-approval-cards";
import type { SerializedPendingMember } from "@/features/approvals/types/approval.types";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Shield, LogOut, ArrowLeft, Users, CheckCircle2, Clock, Loader2, Lock, Home } from "lucide-react";

export const metadata = {
  title: "Super Admin Control Panel | Rangunia Students Forum",
  description: "Executive approval workflow and system authority console.",
};

async function SuperAdminDashboardContent() {
  // 1. Strict Server-Side Session Validation
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/login?callbackUrl=/admin/super");
  }

  // 2. Fetch all registered admins from database
  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedAdmins: SerializedAdminUser[] = admins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    photoUrl: admin.photoUrl,
    studentId: admin.studentId,
    department: admin.department,
    section: admin.section,
    phone: admin.phone,
    position: admin.position,
    enrollment: admin.enrollment,
    currentAddress: admin.currentAddress,
    permanentAddress: admin.permanentAddress,
    gender: admin.gender,
    approvalStatus: admin.approvalStatus,
    createdAt: admin.createdAt.toISOString(),
  }));

  // 3. Fetch all pending forum members (Students & Alumni)
  const pendingMembersRaw = await prisma.user.findMany({
    where: { approvalStatus: "PENDING" },
    include: {
      studentProfile: true,
      alumniProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedMembers: SerializedPendingMember[] = pendingMembersRaw.map((u) => ({
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

  const pendingAdminCount = serializedAdmins.filter((a) => a.approvalStatus === "PENDING").length;
  const approvedAdminCount = serializedAdmins.filter((a) => a.approvalStatus === "APPROVED").length;
  const pendingMemberCount = serializedMembers.length;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-zinc-50 dark:bg-[#040907] text-zinc-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Top System Bar (Matches Notice Management Pattern) */}
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
              Super Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Quick Nav Links */}
            <Link href="/admin/dashboard" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs h-8 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>Admin Console</span>
              </Button>
            </Link>

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
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-8"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </Container>
      </header>

      {/* Main Authority Workspace */}
      <main className="py-8 sm:py-10">
        <Container className="space-y-6 sm:space-y-8">
          {/* Header Summary & Actions (Matches Notice Management Pattern) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
            <div className="space-y-1">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </Link>
                <span className="text-zinc-400 dark:text-zinc-600">/</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Super Admin Authority</span>
              </div>

              {/* Prominent Title with Shield Icon */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Forum Authority Center</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Oversee executive appointments, review pending member registrations, and govern platform capabilities.
              </p>
            </div>

            {/* Mobile & Desktop Action Triggers */}
            <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
              <Link href="/admin/super/permissions">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-xs h-9 px-3.5 font-semibold shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Admin Permissions</span>
                </Button>
              </Link>

              <Link href="/admin/approvals">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-500/30 bg-teal-50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/40 text-xs h-9 px-3.5 font-semibold shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
                  <span>Member Approvals ({pendingMemberCount})</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:items-center sm:gap-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-2 sm:px-4 sm:py-2 shadow-xs">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="min-w-0 w-full sm:w-auto">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate w-full">Pending Admins</p>
                <p className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300">{pendingAdminCount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-2 sm:px-4 sm:py-2 shadow-xs">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <div className="min-w-0 w-full sm:w-auto">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate w-full">Pending Members</p>
                <p className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">{pendingMemberCount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-2 sm:px-4 sm:py-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0 w-full sm:w-auto">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate w-full">Approved Admins</p>
                <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300">{approvedAdminCount}</p>
              </div>
            </div>
          </div>

          {/* Interactive Dual Approval Tabs */}
          <SuperAdminTabs
            initialAdmins={serializedAdmins}
            initialMembers={serializedMembers}
          />
        </Container>
      </main>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 dark:bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <SuperAdminDashboardContent />
    </React.Suspense>
  );
}
