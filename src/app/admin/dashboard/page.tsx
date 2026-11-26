import * as React from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Calendar,
  FileText,
  Activity,
  Award,
  Info,
  LogOut,
  ArrowRight,
  Loader2,
  Lock,
  Home,
} from "lucide-react";

async function AdminDashboardContent() {
  const session = await auth();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  let adminCapabilities = {
    canManageProfiles: isSuperAdmin,
    canManageEvents: isSuperAdmin,
    canManageNotices: isSuperAdmin,
    canManageActivities: isSuperAdmin,
    canManageCommittee: isSuperAdmin,
    canManageAbout: isSuperAdmin,
  };

  if (!isSuperAdmin && session?.user?.id) {
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: {
        canManageProfiles: true,
        canManageEvents: true,
        canManageNotices: true,
        canManageActivities: true,
        canManageCommittee: true,
        canManageAbout: true,
      },
    });

    if (adminUser) {
      adminCapabilities = {
        canManageProfiles: Boolean(adminUser.canManageProfiles),
        canManageEvents: Boolean(adminUser.canManageEvents),
        canManageNotices: Boolean(adminUser.canManageNotices),
        canManageActivities: Boolean(adminUser.canManageActivities),
        canManageCommittee: Boolean(adminUser.canManageCommittee),
        canManageAbout: Boolean(adminUser.canManageAbout),
      };
    }
  }

  // 6 Core Platform Modules
  const modules = [
    {
      id: "profiles",
      title: "Member Approvals & Directory",
      description: "Review pending registrations, verify student/alumni memberships, and moderate records.",
      icon: Users,
      href: "/admin/approvals",
      actionLabel: "Manage Approvals",
      flagName: "canManageProfiles",
      isAuthorized: adminCapabilities.canManageProfiles,
    },
    {
      id: "events",
      title: "Event Management",
      description: "Publish upcoming forum meetups, annual iftar, orientation, and manage participant registrations.",
      icon: Calendar,
      href: "/admin/events",
      actionLabel: "Manage Events",
      flagName: "canManageEvents",
      isAuthorized: adminCapabilities.canManageEvents,
    },
    {
      id: "notices",
      title: "Notice Management",
      description: "Broadcast important forum announcements, academic circulars, and official member notices.",
      icon: FileText,
      href: "/admin/notices",
      actionLabel: "Manage Notices",
      flagName: "canManageNotices",
      isAuthorized: adminCapabilities.canManageNotices,
    },
    {
      id: "activities",
      title: "Activity Management",
      description: "Coordinate ongoing projects, skill workshops, social initiatives, and community engagement.",
      icon: Activity,
      href: "/admin/activities",
      actionLabel: "Manage Activities",
      flagName: "canManageActivities",
      isAuthorized: adminCapabilities.canManageActivities,
    },
    {
      id: "committee",
      title: "Committee Management",
      description: "Manage executive committee appointments, advisory board rosters, and term records.",
      icon: Award,
      href: "/admin/committee",
      actionLabel: "Manage Committee",
      flagName: "canManageCommittee",
      isAuthorized: adminCapabilities.canManageCommittee,
    },
    {
      id: "about",
      title: "About Management",
      description: "Update forum history, constitution, mission vision, and general forum information pages.",
      icon: Info,
      href: "/admin/about",
      actionLabel: "Manage About",
      flagName: "canManageAbout",
      isAuthorized: adminCapabilities.canManageAbout,
    },
  ];

  return (
    <div className="py-10 bg-zinc-50 dark:bg-[#040907] min-h-[calc(100vh-65px)] w-full max-w-[100vw] overflow-x-hidden text-zinc-900 dark:text-white transition-colors duration-200">
      <Container className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-sans font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Admin Console
              </h1>
              <Badge
                className={
                  isSuperAdmin
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-mono"
                    : "bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40 font-mono"
                }
              >
                {session?.user?.role || "ADMIN"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Logged in as: <strong className="text-zinc-800 dark:text-zinc-200">{session?.user?.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isSuperAdmin && (
              <>
                <Link href="/admin/super/permissions">
                  <Button
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 font-semibold text-xs h-8 sm:h-9 px-2.5 sm:px-3 flex items-center shadow-xs"
                    title="Capability Controls"
                  >
                    <Lock className="w-3.5 h-3.5 sm:mr-1.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Capability Controls</span>
                  </Button>
                </Link>

                <Link href="/admin/super">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 sm:h-9 px-2.5 sm:px-3 shadow-xs flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Approval Center</span>
                    <span className="sm:hidden">Approvals</span>
                  </Button>
                </Link>
              </>
            )}

            {!isSuperAdmin && adminCapabilities.canManageProfiles && (
              <Link href="/admin/approvals">
                <Button
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 font-semibold text-xs h-9 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  <span>Member Approvals</span>
                </Button>
              </Link>
            )}

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 text-xs h-9 flex items-center gap-1.5 shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                className="border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-white/10 text-xs h-9 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Super Admin Special Notice / Shortcut */}
        {isSuperAdmin && (
          <div className="p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Super Admin Approvals &amp; Permissions</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                  Assistant administrators who applied via registration require root approval and capability configuration before accessing modules.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <Link href="/admin/super/permissions" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-500/30 bg-white dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-semibold shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  <span>Permissions</span>
                </Button>
              </Link>

              <Link href="/admin/super" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs">
                  <span>Manage Approvals</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* 6 Core Management Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Card
              key={m.id}
              className={`border transition-all flex flex-col justify-between ${
                m.isAuthorized
                  ? "border-zinc-200 dark:border-white/10 bg-white dark:bg-[#07130f]/70 hover:border-emerald-500/40 shadow-xs dark:shadow-lg"
                  : "border-zinc-200 dark:border-white/5 bg-zinc-100/60 dark:bg-white/[0.01] opacity-75"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                      m.isAuthorized
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                  </div>

                  {isSuperAdmin ? (
                    <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                      Root Authority
                    </Badge>
                  ) : m.isAuthorized ? (
                    <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                      Authorized
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-500 text-[10px] font-mono flex items-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {m.title}
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                  {m.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {m.isAuthorized ? (
                  <Link href={m.href} className="block w-full">
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                    >
                      <span>{m.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    disabled
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Requires &apos;{m.flagName}&apos; Access</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[calc(100vh-65px)] bg-zinc-50 dark:bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </React.Suspense>
  );
}
