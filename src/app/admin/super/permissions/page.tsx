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
import { ThemeToggle } from "@/components/shared/theme-toggle";
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
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-zinc-50 dark:bg-[#040907] text-zinc-900 dark:text-white transition-colors duration-200">
      {/* Super Admin Top Navigation - 2-Tier Mobile Header Architecture */}
      <header className="border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
          {/* Row 1 on Mobile / Left Column on Desktop */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-md shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white tracking-tight truncate">
                    Permissions Control
                  </span>
                  <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    ROOT
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[170px] sm:max-w-none">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Mobile Quick Utility Actions */}
            <div className="flex items-center gap-1.5 sm:hidden shrink-0">
              <ThemeToggle />
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10"
                  title="Home"
                >
                  <Home className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
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
                  className="h-8 w-8 p-0 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-900 dark:hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Row 2 on Mobile: Dedicated Full-Width Back Button (< sm) | Desktop Actions (sm:) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="w-full sm:hidden pt-1 border-t border-zinc-200 dark:border-white/5">
              <Link href="/admin/super" className="w-full block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>← Back to Authority Center</span>
                </Button>
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-2.5">
              <Link href="/admin/super">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 text-xs shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Approval Center</span>
                </Button>
              </Link>

              <Link href="/admin/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 text-xs shadow-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  <span>Admin Dashboard</span>
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 text-xs px-3 h-9 shadow-xs"
                >
                  <Home className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mr-1.5" />
                  <span>← Home</span>
                </Button>
              </Link>

              <ThemeToggle />

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
                  className="border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-900 dark:hover:text-white text-xs px-3 h-9 shadow-xs"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  <span>Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Authority Workspace */}
      <main className="py-8 sm:py-10">
        <Container className="space-y-6 sm:space-y-8">
          {/* Header Summary Cards */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  Granular Admin Capabilities
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-medium">
                  Phase 4
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Assign module-level authority to approved executives. Permissions determine which administrative portals and actions are unlocked for each administrator.
              </p>

              {/* Mobile Quick-Navigation Matrix */}
              <div className="grid grid-cols-2 gap-2 sm:hidden pt-3">
                <Link href="/admin/super" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-xs h-9 px-2.5 shadow-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate">Authority Center</span>
                  </Button>
                </Link>

                <Link href="/admin/dashboard" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 text-xs h-9 px-2.5 shadow-xs"
                  >
                    <Home className="h-3.5 w-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate">Admin Console</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 shrink-0">
              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Approved</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{totalAdmins}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Profiles</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{profileManagers}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Events</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{eventManagers}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <FileText className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Notices</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{noticeManagers}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Activities</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{activityManagers}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Committee</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{committeeManagers}</p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 text-[11px] mb-0.5">
                  <Info className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>About</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{aboutManagers}</p>
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
        <div className="min-h-screen bg-zinc-50 dark:bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <SuperAdminPermissionsContent />
    </React.Suspense>
  );
}
