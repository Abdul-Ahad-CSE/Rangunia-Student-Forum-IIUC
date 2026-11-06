import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Heart, ShieldCheck, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020604] py-12 text-zinc-400">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-1">
              <Image
                src="/images/rsf_logo.png"
                alt="RSF Logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                Rangunia Students Forum
              </span>
              <p className="text-xs text-emerald-400">IIUC Chapter</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            A non-political, student-led organization fostering unity, academic
            excellence, career support, and voluntary blood donation among Rangunia
            students at IIUC.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Platform
            </span>
            <Link href="#about" className="hover:text-emerald-400 transition-colors">
              About Forum
            </Link>
            <Link
              href="#blood-network"
              className="hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              Blood Network
            </Link>
            <Link href="#events" className="hover:text-emerald-400 transition-colors">
              Forum Events
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Portal
            </span>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Student Login
            </Link>
            <Link href="/register" className="hover:text-emerald-400 transition-colors">
              New Registration
            </Link>
            <Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
              Admin Portal
            </Link>
          </div>

          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Affiliation
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Kumira, Chittagong</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>IIUC Campus</span>
            </span>
          </div>
        </div>
      </Container>

      <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-zinc-500">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Rangunia Students Forum (IIUC). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with dedication for Rangunia students</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </Container>
      </div>
    </footer>
  );
}
