import * as React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EventFormDialog } from "@/features/events/components/event-form-dialog";
import { EventRecapDialog } from "@/features/events/components/event-recap-dialog";
import {
  EventRegistrationsTable,
  RegisteredUserItem,
} from "@/features/events/components/event-registrations-table";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  ArrowLeft,
  Home,
  ExternalLink,
  Edit3,
  Camera,
  Loader2,
  Sparkles,
} from "lucide-react";

interface AdminEventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminEventDetailPageProps) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { title: true },
  });
  return {
    title: event ? `${event.title} - Registrations | Admin Console` : "Event Detail | Admin Console",
  };
}

async function AdminEventDetailContent({ params }: AdminEventDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/admin/events/${id}`);
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

  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-zinc-300">
            You do not possess the <code className="text-rose-300 font-mono">canManageEvents</code> permission.
          </p>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border-white/10 text-white text-xs">
              Return to Console
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch event and registrations
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              studentId: true,
              department: true,
              session: true,
              batch: true,
              role: true,
              photoUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const eDate = new Date(event.eventDate);
  const rDeadline = new Date(event.registrationDeadline);
  const now = new Date();
  const isCompleted = now > eDate;
  const isRegistrationOpen = now <= rDeadline;

  const formattedDate = eDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedDeadline = rDeadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const registrations: RegisteredUserItem[] = event.registrations.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
  }));

  return (
    <div className="py-10 bg-[#040907] min-h-[calc(100vh-65px)] text-white">
      <Container className="space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Events</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate max-w-md sm:max-w-xl">
              {event.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <EventFormDialog
              initialData={{
                id: event.id,
                title: event.title,
                bannerUrl: event.bannerUrl,
                eventDate: event.eventDate,
                eventTime: event.eventTime,
                venue: event.venue,
                registrationDeadline: event.registrationDeadline,
                description: event.description,
              }}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 text-zinc-300 hover:text-white text-xs h-9 gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </Button>
              }
            />

            <EventRecapDialog
              eventId={event.id}
              eventTitle={event.title}
              initialRecap={event.postEventRecap}
              initialPhotos={event.postEventPhotos}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-500/30 bg-teal-950/20 text-teal-300 hover:bg-teal-950/40 text-xs h-9 gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Recap &amp; Gallery</span>
                </Button>
              }
            />

            <Link href={`/events/${event.id}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-zinc-300 hover:text-white text-xs h-9 gap-1.5"
              >
                <span>Live Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Button>
            </Link>

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
          </div>
        </div>

        {/* Event Summary Overview Card */}
        <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl overflow-hidden">
          {event.bannerUrl && (
            <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-black border-b border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{event.title}</h2>
                  {isCompleted ? (
                    <Badge variant="outline" className="border-white/10 bg-black/60 text-zinc-300 font-mono text-[10px]">
                      Concluded
                    </Badge>
                  ) : isRegistrationOpen ? (
                    <Badge className="bg-emerald-500/90 text-black font-semibold text-[10px]">
                      Registration Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-950/70 text-amber-300 font-mono text-[10px]">
                      Registration Closed
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="shrink-0 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-center min-w-[140px]">
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block mb-0.5">
                  Registrations
                </span>
                <span className="text-2xl font-bold text-emerald-300 font-mono">
                  {event.registrations.length}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Students &amp; Alumni</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs text-zinc-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 block">Date &amp; Time</span>
                  <span className="font-medium text-white">{formattedDate} ({event.eventTime})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 block">Venue Location</span>
                  <span className="font-medium text-white truncate block">{event.venue}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 block">Registration Deadline</span>
                  <span className="font-medium text-amber-300">{formattedDeadline}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Event Recap Preview if populated */}
        {event.postEventRecap && (
          <Card className="border border-teal-500/20 bg-teal-950/20 backdrop-blur-xl text-white">
            <CardHeader className="pb-2 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-teal-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Post-Event Recap &amp; Highlights</span>
              </CardTitle>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 font-mono text-[10px]">
                {event.postEventPhotos.length} Photos
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;{event.postEventRecap}&rdquo;
              </p>

              {event.postEventPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {event.postEventPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Recap photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Registration Tracking Data Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Registered Members Roster ({registrations.length})</span>
            </h3>
          </div>

          <EventRegistrationsTable
            registrations={registrations}
            eventTitle={event.title}
          />
        </div>
      </Container>
    </div>
  );
}

export default function AdminEventDetailPage({ params }: AdminEventDetailPageProps) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[calc(100vh-65px)] bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <AdminEventDetailContent params={params} />
    </React.Suspense>
  );
}
