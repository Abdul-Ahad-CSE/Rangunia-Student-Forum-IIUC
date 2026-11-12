import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NoticeFormDialog } from "@/features/notices/components/notice-form-dialog";
import { AdminNoticesTable, NoticeItem } from "@/features/notices/components/admin-notices-table";
import {
  FileText,
  ShieldAlert,
  ArrowLeft,
  Home,
  LogOut,
  Calendar,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export const metadata = {
  title: "Notice Management | Rangunia Students Forum (IIUC)",
  description: "Administrative console for managing official forum announcements and notices.",
};

async function AdminNoticesContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/notices");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  // Check notice management capability
  let hasCapability = isSuperAdmin;
  if (!isSuperAdmin && session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageNotices: true, approvalStatus: true },
    });
    hasCapability = Boolean(admin?.canManageNotices && admin?.approvalStatus === "APPROVED");
  }

  // Access Denied Gate
  if (!hasCapability) {
    return (
      <div className="min-h-screen bg-[#040907] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/40 bg-destructive/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Notice Management Access Denied</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your administrative account does not possess the{" "}
            <code className="text-rose-300 font-mono">canManageNotices</code> capability.
            Please request notice publishing permissions from the Super Admin.
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

  // Query all notices ordered by date descending
  const rawNotices = await prisma.notice.findMany({
    orderBy: { date: "desc" },
  });

  const notices: NoticeItem[] = rawNotices.map((n) => ({
    id: n.id,
    title: n.title,
    date: n.date,
    bannerUrl: n.bannerUrl,
    content: n.content,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  }));

  const totalNotices = notices.length;
  const withBanners = notices.filter((n) => Boolean(n.bannerUrl)).length;
  const now = new Date();
  const thisMonth = notices.filter((n) => {
    const d = new Date(n.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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
            <span className="text-xs text-emerald-400 font-medium">Notices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-400" />
            <span>Notice Management Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Publish official forum circulars, academic notices, and public announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <Link href="/notices" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs"
            >
              Live Notices
            </Button>
          </Link>
          <NoticeFormDialog mode="create" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Total Notices</p>
            <p className="text-xl font-bold text-white font-mono">{totalNotices}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Published This Month</p>
            <p className="text-xl font-bold text-white font-mono">{thisMonth}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">With Banner Photos</p>
            <p className="text-xl font-bold text-white font-mono">{withBanners}</p>
          </div>
        </div>
      </div>

      {/* Notices Table */}
      <AdminNoticesTable notices={notices} />
    </div>
  );
}

export default function AdminNoticesPage() {
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
              Notice Panel
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
                <p className="text-sm">Loading notice console...</p>
              </div>
            }
          >
            <AdminNoticesContent />
          </React.Suspense>
        </Container>
      </main>
    </div>
  );
}
