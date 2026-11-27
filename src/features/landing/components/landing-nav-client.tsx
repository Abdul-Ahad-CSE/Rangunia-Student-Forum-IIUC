"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  User,
  KeyRound,
  GraduationCap,
  Briefcase,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { Session } from "next-auth";

interface LandingNavClientProps {
  session: Session | null;
}

export function LandingNavClient({ session }: LandingNavClientProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Derive authenticated role properties
  const user = session?.user;
  const role = user?.role;

  let dashboardHref = "/profile";
  let dashboardLabel = "Go to Profile";
  let RoleIcon = User;
  let roleBadgeText = "Student Member";

  if (role === "SUPER_ADMIN") {
    dashboardHref = "/admin/super";
    dashboardLabel = "Super Admin Console";
    RoleIcon = KeyRound;
    roleBadgeText = "Super Admin";
  } else if (role === "ADMIN") {
    dashboardHref = "/admin/dashboard";
    dashboardLabel = "Admin Panel";
    RoleIcon = ShieldCheck;
    roleBadgeText = "General Executive";
  } else if (role === "ALUMNI") {
    dashboardHref = "/profile";
    dashboardLabel = "Go to Profile";
    RoleIcon = Briefcase;
    roleBadgeText = "IIUC Alumni";
  } else if (role === "STUDENT") {
    dashboardHref = "/profile";
    dashboardLabel = "Go to Profile";
    RoleIcon = GraduationCap;
    roleBadgeText = "Enrolled Student";
  }

  return (
    <nav className="fixed top-2.5 sm:top-4 left-3 right-3 sm:left-6 sm:right-6 max-w-6xl mx-auto z-40 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-[#f4f7f5]/90 dark:bg-[#07130f]/85 backdrop-blur-xl shadow-md shadow-zinc-950/[0.04] dark:shadow-black/40 transition-all">
      <Container className="flex h-14 sm:h-16 px-3.5 sm:px-6 items-center justify-between">
        {/* Brand Lockup */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1 shrink-0"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-1 shadow-md">
            <Image
              src="/images/rsf_logo.png"
              alt="RSF Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-sm sm:text-base md:text-lg leading-tight whitespace-nowrap">
              Rangunia Students Forum
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/directory"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Directory
          </Link>
          <Link
            href="/events"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/notices"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Notices
          </Link>
          <Link
            href="/activities"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Activities
          </Link>
          <Link
            href="/committee"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            Committee
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            About
          </Link>
        </div>

        {/* Desktop Action Buttons: Dynamic based on Session State */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link href={dashboardHref} title={dashboardLabel} aria-label={dashboardLabel}>
              <Button
                size="sm"
                className="h-9 w-9 p-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-950 flex items-center justify-center border border-emerald-400/30 transition-all hover:scale-[1.05]"
                aria-label={dashboardLabel}
              >
                <RoleIcon className="w-4 h-4 text-white" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-200 dark:border-white/15 bg-zinc-100/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/80 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all text-xs"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950 flex items-center gap-1.5 font-medium transition-all text-xs"
                >
                  <span>Join Forum</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Action & Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href={dashboardHref} title={dashboardLabel} aria-label={dashboardLabel}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                aria-label={dashboardLabel}
              >
                <RoleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            </Link>
          ) : (
            <Link href="/login" title="Sign In" aria-label="Sign In">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200/80 dark:hover:bg-white/10 flex items-center justify-center shadow-xs"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-100/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-[#f4f7f5]/95 dark:bg-[#06100c]/95 backdrop-blur-2xl p-5 shadow-2xl md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/directory"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>Directory</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>
            <Link
              href="/events"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>Events</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>
            <Link
              href="/notices"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>Notices</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>
            <Link
              href="/activities"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>Activities</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>
            <Link
              href="/committee"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>Committee</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400 py-2 border-b border-zinc-100 dark:border-white/5"
            >
              <span>About</span>
              <span className="text-zinc-400 dark:text-zinc-500">→</span>
            </Link>

            {/* Bottom Actions based on Session State */}
            {user ? (
              <div className="pt-4 flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-bold font-mono text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{user.name || "Logged In User"}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{roleBadgeText}</p>
                  </div>
                </div>

                <Link href={dashboardHref} onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full h-11 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 flex items-center justify-center gap-2">
                    <RoleIcon className="w-4 h-4" />
                    <span>{dashboardLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950">
                    Register as Student
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-zinc-200 dark:border-white/15 bg-zinc-100/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/80 dark:hover:bg-white/10"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Sign In to Portal
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
