import * as React from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Calendar,
  LogOut,
  ArrowRight,
  Droplet,
  Loader2,
  Lock,
  Home,
} from "lucide-react";

async function AdminDashboardContent() {
  const session = await auth();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  let canManageProfiles = isSuperAdmin;
  if (!isSuperAdmin && session?.user?.id) {
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageProfiles: true },
    });
    canManageProfiles = Boolean(adminUser?.canManageProfiles);
  }

  return (
    <div className="py-10 bg-[#040907] min-h-[calc(100vh-65px)] text-white">
      <Container className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white">
                Admin Console
              </h1>
              <Badge
                className={
                  isSuperAdmin
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/40 font-mono"
                }
              >
                {session?.user?.role || "ADMIN"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Logged in as: <strong className="text-zinc-200">{session?.user?.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <>
                <Link href="/admin/super/permissions">
                  <Button
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 font-semibold text-xs h-9 hidden md:flex"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" />
                    <span>Capability Controls</span>
                  </Button>
                </Link>

                <Link href="/admin/super">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-md shadow-emerald-950">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    <span>Approval Center</span>
                  </Button>
                </Link>
              </>
            )}

            {!isSuperAdmin && canManageProfiles && (
              <Link href="/admin/approvals">
                <Button
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 font-semibold text-xs h-9"
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

        {/* Super Admin Special Notice / Shortcut */}
        {isSuperAdmin && (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-900/40 text-emerald-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Super Admin Approvals Required</h2>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Assistant administrators who applied via the registration portal require root approval before accessing the console.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <Link href="/admin/super/permissions" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/50 text-xs font-semibold"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  <span>Permissions</span>
                </Button>
              </Link>

              <Link href="/admin/super" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs">
                  <span>Manage Approvals</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Management Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Members Module */}
          <Card className="border-white/10 bg-[#07130f]/60 backdrop-blur-md text-white hover:border-emerald-500/30 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Users className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Member Approvals & Directory</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Review pending registrations, verify forum memberships, and moderate student/alumni records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {canManageProfiles ? (
                <Link href="/admin/approvals">
                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5"
                  >
                    <span>Manage Approvals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/10 bg-white/5 text-zinc-400 text-xs cursor-not-allowed"
                  disabled
                >
                  <span>Requires &apos;canManageProfiles&apos; Access</span>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Events Module */}
          <Card className="border-white/10 bg-[#07130f]/60 backdrop-blur-md text-white hover:border-emerald-500/30 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Events & Noticeboard</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Publish upcoming forum meetups, annual iftar, orientation, and announcements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs"
                disabled
              >
                <span>Phase 4 In Development</span>
              </Button>
            </CardContent>
          </Card>

          {/* Blood Donors Module */}
          <Card className="border-white/10 bg-[#07130f]/60 backdrop-blur-md text-white hover:border-emerald-500/30 transition-all">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <Droplet className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Blood Network</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Urgent blood donation requests, donor index, and volunteer emergency coordination.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs"
                disabled
              >
                <span>Phase 4 In Development</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[calc(100vh-65px)] bg-[#040907] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </React.Suspense>
  );
}
