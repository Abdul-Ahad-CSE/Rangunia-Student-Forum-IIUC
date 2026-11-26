import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  ArrowLeft,
  Info,
  CheckCircle2,
  Loader2,
  Home,
  LogOut,
} from "lucide-react";
import { getAboutContent } from "@/features/about/actions/about-actions";
import { AdminAboutForm } from "@/features/about/components/admin-about-form";

export const metadata = {
  title: "About Module Management | Rangunia Students Forum (IIUC)",
  description:
    "Super-Admin-Approved Content Console for configuring the forum history, mission statement, and photo gallery.",
};

async function AdminAboutContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/about");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Strict Super Admin Approval & canManageAbout Enforcement
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageAbout: true, approvalStatus: true },
    });
    hasCapability = Boolean(
      admin?.canManageAbout && admin?.approvalStatus === "APPROVED"
    );
  }

  // Access Denied Padlock Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You do not possess the required{" "}
            <code className="text-rose-300 font-mono bg-rose-950/60 px-1.5 py-0.5 rounded">
              canManageAbout
            </code>{" "}
            permission or your executive account has not yet received Super Admin verification.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-white/20 text-xs text-zinc-300 hover:text-white"
              >
                Return to Admin Console
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Query Initial About Data
  const initialData = await getAboutContent();

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
            <span className="text-xs text-emerald-400 font-medium">About</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Info className="w-7 h-7 text-emerald-400" />
            <span>About Module Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Curate the official RSF story, editorial mission statement, and featured 3-photo triad.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Link href="/#about" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs"
            >
              Live Portal
            </Button>
          </Link>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-2.5 py-1 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approved</span>
          </Badge>
        </div>
      </div>

      {/* Content Form Console */}
      <AdminAboutForm initialData={initialData} />
    </div>
  );
}

export default function AdminAboutPage() {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top System Bar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <Container className="h-14 sm:h-16 flex items-center justify-between">
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
              About Panel
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
        <Container className="max-w-5xl">
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm font-mono">Loading About Management Console...</p>
              </div>
            }
          >
            <AdminAboutContent />
          </React.Suspense>
        </Container>
      </main>
    </div>
  );
}

