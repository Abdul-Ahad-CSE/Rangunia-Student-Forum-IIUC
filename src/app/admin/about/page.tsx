import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ArrowLeft, Info, CheckCircle2, Loader2 } from "lucide-react";
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
    <div className="py-10 bg-[#040907] min-h-[calc(100vh-65px)] text-white">
      <Container className="space-y-8 max-w-5xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white">
                  About Module Management
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Curate the official RSF story, editorial mission statement, and featured 3-photo triad.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-3 py-1 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Super Admin Approved</span>
            </Badge>
          </div>
        </div>

        {/* Content Form Console */}
        <AdminAboutForm initialData={initialData} />
      </Container>
    </div>
  );
}

export default function AdminAboutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#040907] flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-mono">Loading About Management Console...</p>
        </div>
      }
    >
      <AdminAboutContent />
    </React.Suspense>
  );
}

