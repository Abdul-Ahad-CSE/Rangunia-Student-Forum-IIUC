import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { EventFormDialog } from "@/features/events/components/event-form-dialog";
import { AdminEventCard, AdminEventData } from "@/features/events/components/admin-event-card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Calendar,
  Users,
  ShieldAlert,
  ArrowLeft,
  Home,
  LogOut,
  Loader2,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Event Management | Rangunia Students Forum (IIUC)",
  description: "Administrative console for managing forum events, schedules, and member registrations.",
};

async function AdminEventsContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/events");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Check event management capability
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageEvents: true, approvalStatus: true },
    });
    hasCapability = Boolean(admin?.canManageEvents && admin?.approvalStatus === "APPROVED");
  }

  // Access Denied Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#040907] flex items-center justify-center p-4 text-zinc-900 dark:text-white transition-colors duration-200">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/30 dark:border-destructive/40 bg-rose-50/80 dark:bg-destructive/10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/40 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Event Management Access Denied</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Your administrative account does not possess the <code className="text-rose-600 dark:text-rose-300 font-mono font-medium">canManageEvents</code> permission.
            Please request event organizer capability from the Super Admin.
          </p>
          <div className="pt-2">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-white text-xs">
                ← Return to Admin Console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Query all events with registration count
  const rawEvents = await prisma.event.findMany({
    include: {
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { eventDate: "desc" },
  });

  const now = new Date();
  const upcomingCount = rawEvents.filter((e) => new Date(e.eventDate) >= now).length;
  const totalRegistrations = rawEvents.reduce((acc, curr) => acc + (curr._count?.registrations ?? 0), 0);

  const serializedEvents: AdminEventData[] = rawEvents.map((e) => ({
    id: e.id,
    title: e.title,
    bannerUrl: e.bannerUrl,
    eventDate: e.eventDate.toISOString(),
    eventTime: e.eventTime,
    venue: e.venue,
    registrationDeadline: e.registrationDeadline.toISOString(),
    description: e.description,
    postEventRecap: e.postEventRecap,
    postEventPhotos: e.postEventPhotos,
    _count: e._count,
  }));

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
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Events</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Event Management Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Create and publish official forum programs, monitor registrations, and update post-event galleries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Link href="/events" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 text-xs shadow-xs"
            >
              Live Events
            </Button>
          </Link>
          <EventFormDialog />
        </div>
      </div>

      {/* Quick Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Events Created</p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-mono">{rawEvents.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Upcoming Programs</p>
            <p className="text-xl sm:text-2xl font-bold text-teal-700 dark:text-teal-300 font-mono">{upcomingCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Member Registrations</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">{totalRegistrations}</p>
          </div>
        </div>
      </div>

      {/* Main Event Cards Grid */}
      {serializedEvents.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07130f]/50 backdrop-blur-xl space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">No Events Published Yet</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Click &ldquo;Create New Event&rdquo; above to publish your first forum program, seminar, or reunion meetup.
            </p>
          </div>
          <EventFormDialog />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">
              All Published Programs ({serializedEvents.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedEvents.map((evt) => (
              <AdminEventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEventsPage() {
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
              Event Panel
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
                <p className="text-sm">Loading event console...</p>
              </div>
            }
          >
            <AdminEventsContent />
          </React.Suspense>
        </Container>
      </main>
    </div>
  );
}
