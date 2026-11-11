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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
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
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl transition-all">
      <Container className="flex h-16 sm:h-20 items-center justify-between">
        {/* Brand Lockup */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-1 shadow-md">
            <Image
              src="/images/rsf_logo.png"
              alt="RSF Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold tracking-tight text-white text-sm sm:text-base leading-tight">
              Rangunia Students Forum
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                IIUC Chapter
              </span>
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/directory"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Directory
          </Link>
          <Link
            href="/#events"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/#notices"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Notices
          </Link>
          <Link
            href="/#activities"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Activities
          </Link>
          <Link
            href="/#committee"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Committee
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            About
          </Link>
        </div>

        {/* Desktop Action Buttons: Dynamic based on Session State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href={dashboardHref}>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-3.5 shadow-md shadow-emerald-950 flex items-center gap-2 border border-emerald-400/30 transition-all hover:scale-[1.02]"
              >
                <RoleIcon className="w-3.5 h-3.5 text-emerald-200" />
                <span>{dashboardLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white transition-all text-xs"
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
          {user ? (
            <Link href={dashboardHref}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-emerald-300 h-9 px-2.5 border border-emerald-500/30 bg-emerald-950/40 font-medium flex items-center gap-1.5"
              >
                <RoleIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[100px] truncate">{dashboardLabel}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-200 h-9 px-3 border border-white/10 bg-white/5 font-medium"
              >
                Sign In
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-b border-white/10 bg-[#06100c]/95 backdrop-blur-2xl px-6 py-6 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/directory"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Directory</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="/#events"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Events</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="/#notices"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Notices</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="/#activities"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Activities</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="/#committee"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Committee</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>About</span>
              <span className="text-zinc-500">→</span>
            </Link>

            {/* Bottom Actions based on Session State */}
            {user ? (
              <div className="pt-4 flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold font-mono text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.name || "Logged In User"}</p>
                    <p className="text-[11px] text-emerald-400 font-mono">{roleBadgeText}</p>
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
                    className="w-full h-12 text-base font-medium border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-400" />
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
