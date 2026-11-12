import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ActivityFormDialog } from "@/features/activities/components/activity-form-dialog";
import {
  AdminActivitiesTable,
  ActivityItem,
} from "@/features/activities/components/admin-activities-table";
import {
  Activity,
  ShieldAlert,
  ArrowLeft,
  Home,
  LogOut,
  MapPin,
  Camera,
  Loader2,
} from "lucide-react";

export const metadata = {
  title: "Activity Management | Rangunia Students Forum (IIUC)",
  description: "Administrative console for managing social initiatives, workshops, and volunteer activities.",
};

async function AdminActivitiesContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/activities");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Check activity management capability
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageActivities: true, approvalStatus: true },
    });
    hasCapability = Boolean(admin?.canManageActivities && admin?.approvalStatus === "APPROVED");
  }

  // Access Denied Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Activity Management Access Denied</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your administrative account does not possess the{" "}
            <code className="text-rose-300 font-mono">canManageActivities</code> capability.
            Please request activity management permissions from the Super Admin.
          </p>
          <div className="pt-2">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="border-white/10 text-white text-xs">
                ← Return to Admin Console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Query all activities ordered by date descending
  const rawActivities = await prisma.activity.findMany({
    orderBy: { date: "desc" },
  });

  const activities: ActivityItem[] = rawActivities.map((a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    time: a.time,
    location: a.location,
    photos: a.photos || [],
    description: a.description,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  const totalActivities = activities.length;
  const totalPhotos = activities.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);
  const uniqueLocations = new Set(activities.map((a) => a.location.toLowerCase().trim())).size;

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-emerald-400 font-medium">Activities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-emerald-400" />
            <span>Activity Management Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Coordinate and archive volunteer drives, social initiatives, workshops, and student projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Link href="/activities" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs"
            >
              Live Activities
            </Button>
          </Link>
          <ActivityFormDialog mode="create" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Total Activities</p>
            <p className="text-xl font-bold text-white font-mono">{totalActivities}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Unique Locations</p>
            <p className="text-xl font-bold text-white font-mono">{uniqueLocations}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Archived Photos</p>
            <p className="text-xl font-bold text-white font-mono">{totalPhotos}</p>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <AdminActivitiesTable activities={activities} />
    </div>
  );
}

export default function AdminActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top System Bar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <span className="text-zinc-600">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Activity Panel
            </span>
          </div>

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
              className="text-xs text-zinc-400 hover:text-rose-300 hover:bg-rose-950/20"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign Out</span>
            </Button>
          </form>
        </Container>
      </header>

      {/* Main Content Area in Suspense */}
      <main className="flex-1 py-10">
        <Container>
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading activity console...</p>
              </div>
            }
          >
            <AdminActivitiesContent />
          </React.Suspense>
        </Container>
      </main>
    </div>
  );
}
