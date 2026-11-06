"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Droplet, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function LandingNav() {
  const [isOpen, setIsOpen] = React.useState(false);

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
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#about"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="#blood-network"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Droplet className="h-3.5 w-3.5 text-rose-400 fill-rose-400/20" />
            Blood Network
          </Link>
          <Link
            href="#events"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="#community"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Community
          </Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
            >
              Student Portal
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950 flex items-center gap-1"
            >
              <span>Join Forum</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-zinc-200 h-9 px-3 border border-white/10 bg-white/5"
            >
              Portal
            </Button>
          </Link>
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
              href="#about"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>About the Forum</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="#blood-network"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-rose-300 hover:text-rose-200 py-2 border-b border-white/5"
            >
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 fill-rose-500 text-rose-500" />
                <span>Emergency Blood Donors</span>
              </div>
              <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                Live
              </span>
            </Link>
            <Link
              href="#events"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Events & Gatherings</span>
              <span className="text-zinc-500">→</span>
            </Link>
            <Link
              href="#community"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-base font-medium text-zinc-200 hover:text-emerald-400 py-2 border-b border-white/5"
            >
              <span>Student Community Directory</span>
              <span className="text-zinc-500">→</span>
            </Link>

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
          </div>
        </div>
      )}
    </nav>
  );
}
