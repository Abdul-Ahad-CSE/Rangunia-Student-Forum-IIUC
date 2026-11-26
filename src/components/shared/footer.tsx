import Image from "next/image";
import { Container } from "@/components/shared/container";
import { ShieldCheck, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#020604] pt-12 pb-0 text-zinc-600 dark:text-zinc-400 overflow-hidden transition-colors">
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
              <span className="font-bold text-zinc-900 dark:text-white text-sm">
                Rangunia Students Forum
              </span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">IIUC Chapter</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            A non-political, student-led organization fostering unity, academic
            excellence, and career support among Rangunia students at IIUC.
          </p>

          {/* Social & Creator Section */}
          <div className="flex flex-col gap-3 pt-2">
            {/* 1. Official Facebook Page Link */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/ranguniastudentsforumIIUC/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-sm"
                title="Visit Official RSF Facebook Page"
              >
                <svg
                  className="h-4 w-4 fill-current text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-semibold">Facebook Page</span>
              </a>
            </div>

            {/* 2. Design and Developed by IhsanX with Eye-Catching Motion */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              <span>Design and Developed by</span>
              <a
                href="https://www.ihsanx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-emerald-900/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-extrabold tracking-wide bg-gradient-to-r from-emerald-300 via-teal-100 to-emerald-400 bg-clip-text text-transparent">
                  IhsanX
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
            <span className="font-semibold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
              Affiliation
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Kumira, Chittagong</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>IIUC Campus</span>
            </span>
          </div>
        </div>
      </Container>

      <div className="mt-8 border-t border-zinc-200 dark:border-white/5 pt-6 text-center text-xs text-zinc-500">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Rangunia Students Forum (IIUC). All rights reserved.</p>
        </Container>
      </div>

      {/* 3. Full-Width News Ticker Tape (Chyron / Marquee Crawler) */}
      <div className="w-full overflow-hidden border-t border-zinc-300 dark:border-white/10 bg-zinc-200/90 dark:bg-black/90 py-2.5 backdrop-blur-md select-none mt-8">
        <div className="animate-ticker">
          {/* Track 1 */}
          <div className="flex items-center gap-8 shrink-0 pr-8 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-800 dark:text-zinc-300">
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
          </div>

          {/* Track 2 (Identical Clone for Infinite Seamless Loop) */}
          <div
            className="flex items-center gap-8 shrink-0 pr-8 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-zinc-800 dark:text-zinc-300"
            aria-hidden="true"
          >
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
            <span>Unity is strength. Rangunia Students Forum. International Islamic University Chittagong.</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
