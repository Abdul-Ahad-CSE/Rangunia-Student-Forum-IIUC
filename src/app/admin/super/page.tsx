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
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#040907] text-white">
      {/* Super Admin Top Navigation */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white leading-tight">
                  RSF Super Admin Authority
                </span>
                <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                Authenticated as: {session?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Navigation Links */}
            <Link href="/admin/approvals">
              <Button
                variant="outline"
                size="sm"
                className="border-teal-500/30 bg-teal-950/20 text-teal-300 hover:bg-teal-950/40 text-xs hidden md:flex"
              >
                <Users className="h-3.5 w-3.5 mr-1.5" />
                <span>Member Approvals ({pendingMemberCount})</span>
              </Button>
            </Link>

            <Link href="/admin/super/permissions">
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs hidden sm:flex"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                <span>Admin Permissions</span>
              </Button>
            </Link>

            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs hidden sm:flex"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                <span>Admin Dashboard</span>
              </Button>
            </Link>

            {/* Responsive Home Trigger */}
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs px-2.5 sm:px-3 h-8 sm:h-9"
                title="Home"
              >
                <Home className="h-3.5 w-3.5 text-emerald-400 sm:mr-1.5" />
                <span className="hidden sm:inline">← Home</span>
              </Button>
            </Link>

            {/* Responsive Sign Out Trigger */}
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
                className="border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white text-xs px-2.5 sm:px-3 h-8 sm:h-9"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </Container>
      </header>

      {/* Main Authority Workspace */}
      <main className="py-8 sm:py-10">
        <Container className="space-y-6 sm:space-y-8">
          {/* Header Summary & Mobile Quick-Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
                Forum Authority Center
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Oversee executive admin appointments, review pending member registrations, and manage system privileges.
              </p>

              {/* Mobile Executive Quick-Actions Matrix (Visible strictly on mobile < sm) */}
              <div className="grid grid-cols-2 gap-2 sm:hidden pt-3">
                <Link href="/admin/super/permissions" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs h-9 px-2.5 shadow-md"
                  >
                    <Lock className="h-3.5 w-3.5 mr-1.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate">Permissions</span>
                  </Button>
                </Link>

                <Link href="/admin/approvals" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-between border-teal-500/30 bg-teal-950/20 text-teal-300 hover:bg-teal-950/40 text-xs h-9 px-2.5 shadow-md"
                  >
                    <div className="flex items-center truncate mr-1">
                      <Users className="h-3.5 w-3.5 mr-1.5 text-teal-400 shrink-0" />
                      <span className="font-semibold truncate">Approvals</span>
                    </div>
                    {pendingMemberCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-teal-500/30 text-teal-200 border border-teal-500/40">
                        {pendingMemberCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link href="/admin/dashboard" className="w-full col-span-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs h-9 px-2.5 shadow-md"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5 text-zinc-400 shrink-0" />
                    <span className="font-semibold truncate">Go to Main Admin Console</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:items-center sm:gap-3">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Pending Admins</p>
                  <p className="text-sm sm:text-base font-bold text-amber-300">{pendingAdminCount}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <Users className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Pending Members</p>
                  <p className="text-sm sm:text-base font-bold text-teal-300">{pendingMemberCount}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:px-4 sm:py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0 w-full sm:w-auto">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 truncate w-full">Approved Admins</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-300">{approvedAdminCount}</p>
                </div>
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
        <div className="min-h-screen bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <SuperAdminDashboardContent />
    </React.Suspense>
  );
}
