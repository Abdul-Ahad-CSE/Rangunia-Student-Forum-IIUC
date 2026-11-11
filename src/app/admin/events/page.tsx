import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventFormDialog } from "@/features/events/components/event-form-dialog";
import { AdminEventCard, AdminEventData } from "@/features/events/components/admin-event-card";
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
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Event Management Access Denied</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your administrative account does not possess the <code className="text-rose-300 font-mono">canManageEvents</code> permission.
            Please request event organizer capability from the Super Admin.
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
    <div className="py-10 bg-[#040907] min-h-[calc(100vh-65px)] text-white">
      <Container className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Console</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
                Event Management
              </h1>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-xs">
                {isSuperAdmin ? "Super Admin" : "Event Organizer"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Create and publish official forum programs, monitor participant registrations, and update post-event galleries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <EventFormDialog />

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs h-9 flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
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
                className="border-white/15 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs h-9"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Events Created</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{rawEvents.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Upcoming Programs</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-300">{upcomingCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Member Registrations</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">{totalRegistrations}</p>
            </div>
          </div>
        </div>

        {/* Main Event Cards Grid */}
        {serializedEvents.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-white/10 bg-[#07130f]/50 backdrop-blur-xl space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-white">No Events Published Yet</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click &ldquo;Create New Event&rdquo; above to publish your first forum program, seminar, or reunion meetup.
              </p>
            </div>
            <EventFormDialog />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider font-mono">
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
      </Container>
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[calc(100vh-65px)] bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <AdminEventsContent />
    </React.Suspense>
  );
}
