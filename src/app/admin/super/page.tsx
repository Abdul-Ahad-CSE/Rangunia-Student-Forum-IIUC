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
import { Shield, LogOut, ArrowLeft, Users, CheckCircle2, Clock, Loader2, Lock } from "lucide-react";

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
    <div className="min-h-screen bg-[#040907] text-white">
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
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                Authenticated as: {session?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
                className="border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </Container>
      </header>

      {/* Main Authority Workspace */}
      <main className="py-10">
        <Container className="space-y-8">
          {/* Header Summary Cards */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white">
                Forum Authority Center
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Oversee executive admin appointments, review pending member registrations, and manage system privileges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Pending Admins</p>
                  <p className="text-sm font-bold text-amber-300">{pendingAdminCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Users className="w-4 h-4 text-teal-400" />
                <div className="text-left">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Pending Members</p>
                  <p className="text-sm font-bold text-teal-300">{pendingMemberCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Approved Admins</p>
                  <p className="text-sm font-bold text-emerald-300">{approvedAdminCount}</p>
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
