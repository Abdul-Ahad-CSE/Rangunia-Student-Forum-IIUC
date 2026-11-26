import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { getAboutContent } from "../actions/about-actions";
import { AboutPhotoTriad } from "./about-photo-triad";

export async function AboutShowcaseSection() {
  await connection();

  const about = await getAboutContent();

  return (
    <section className="relative bg-[#030806] py-20 sm:py-28 border-t border-white/5 overflow-hidden text-white">
      {/* Subtle Ambient Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Column 1: Editorial Typography & RSF Official Seal */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header Identity Badge */}
            <div className="flex items-center gap-3.5">
              {/* High-Resolution RSF Official Logo Seal */}
              <div className="h-14 w-14 p-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 flex items-center justify-center shrink-0">
                <Image
                  src="/images/rsf_logo.png"
                  alt="RSF Official Seal"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>About Our Fraternity • IIUC Chapter</span>
                </div>
                {about.subtitle && (
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    {about.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white leading-[1.15]">
              {about.title}
            </h2>

            {/* Story / Narrative Body */}
            <div className="text-sm sm:text-base text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">
              {about.content}
            </div>

            {/* Link to Committee Directory */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/committee">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 group"
                >
                  <Users className="w-4 h-4 text-emerald-200" />
                  <span>Meet the Executive Committee</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Column 2: The 3 Photos with Floating Motion */}
          <div className="lg:col-span-6 flex justify-center">
            <AboutPhotoTriad photos={about.photos} />
          </div>
        </div>
      </Container>
    </section>
  );
}
