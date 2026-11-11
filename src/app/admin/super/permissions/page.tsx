import * as React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  AdminPermissionsManager,
  type SerializedAdminPermissionUser,
} from "@/features/admin/components/admin-permissions-manager";
import {
  Shield,
  LogOut,
  ArrowLeft,
  Users,
  CheckCircle2,
  UserCheck,
  FileText,
  Calendar,
  Activity,
  Info,
  Loader2,
  Home,
} from "lucide-react";

export const metadata = {
  title: "Admin Permissions & Access Control | Rangunia Students Forum",
  description: "Granular executive permission management and capability governance.",
};

async function SuperAdminPermissionsContent() {
  // 1. Strict Server-Side Session Validation
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/login?callbackUrl=/admin/super/permissions");
  }

  // 2. Query all approved administrators from Neon DB
  const approvedAdmins = await prisma.adminUser.findMany({
    where: { approvalStatus: "APPROVED" },
    orderBy: [{ name: "asc" }, { createdAt: "desc" }],
  });

  const serializedAdmins: SerializedAdminPermissionUser[] = approvedAdmins.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    photoUrl: a.photoUrl,
    studentId: a.studentId,
    department: a.department,
    section: a.section,
    position: a.position,
    enrollment: a.enrollment,
    canManageProfiles: a.canManageProfiles,
    canManageEvents: a.canManageEvents,
    canManageNotices: a.canManageNotices,
    canManageActivities: a.canManageActivities,
    canManageCommittee: a.canManageCommittee,
    canManageAbout: a.canManageAbout,
    createdAt: a.createdAt.toISOString(),
  }));

  const totalAdmins = serializedAdmins.length;
  const profileManagers = serializedAdmins.filter((a) => a.canManageProfiles).length;
  const eventManagers = serializedAdmins.filter((a) => a.canManageEvents).length;
  const noticeManagers = serializedAdmins.filter((a) => a.canManageNotices).length;
  const activityManagers = serializedAdmins.filter((a) => a.canManageActivities).length;
  const committeeManagers = serializedAdmins.filter((a) => a.canManageCommittee).length;
  const aboutManagers = serializedAdmins.filter((a) => a.canManageAbout).length;

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
                Authenticated as: {session.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/super">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs hidden sm:flex"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                <span>Approval Center</span>
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

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5"
              >
                <Home className="h-3.5 w-3.5 text-emerald-400" />
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white">
                  Granular Admin Capabilities
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 px-2.5 py-0.5 text-xs font-medium">
                  Phase 4
                </span>
              </div>
              <p className="text-sm text-zinc-400 max-w-2xl">
                Assign module-level authority to approved executives. Permissions determine which administrative portals and actions are unlocked for each administrator.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 shrink-0">
              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Approved</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{totalAdmins}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Profiles</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{profileManagers}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>Events</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{eventManagers}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Notices</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{noticeManagers}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Activities</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{activityManagers}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Committee</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{committeeManagers}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-0.5">
                  <Info className="w-3 h-3 text-emerald-400" />
                  <span>About</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{aboutManagers}</p>
              </div>
            </div>
          </div>

          {/* Interactive Permission Management */}
          <AdminPermissionsManager initialAdmins={serializedAdmins} />
        </Container>
      </main>
    </div>
  );
}

export default function SuperAdminPermissionsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <SuperAdminPermissionsContent />
    </React.Suspense>
  );
}
