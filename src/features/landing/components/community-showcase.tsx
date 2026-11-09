import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Heart, Award, ArrowUpRight } from "lucide-react";

const galleryItems = [
  {
    src: "/images/rsf1.jpg",
    alt: "RSF Annual Gathering & Reception",
    title: "Annual Student Gathering",
    category: "Community",
  },
  {
    src: "/images/rsf2.jpg",
    alt: "RSF Academic Discussion & Committee Meeting",
    title: "Academic Guidance Session",
    category: "Mentorship",
  },
  {
    src: "/images/rsf3.jpg",
    alt: "RSF Social & Cultural Initiative",
    title: "Campus Orientation Program",
    category: "Freshers Reception",
  },
  {
    src: "/images/rsf4.jpg",
    alt: "RSF Blood Donation & Welfare Activity",
    title: "Community Welfare Drive",
    category: "Social Service",
  },
];

export function CommunityShowcase() {
  return (
    <section id="about" className="relative bg-[#030806] py-20 sm:py-28 text-white border-t border-white/5">
      <Container className="flex flex-col gap-12 sm:gap-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400">
              <Award className="h-3.5 w-3.5" />
              <span>Living the Brotherhood</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-4xl font-sans font-bold tracking-tight text-white">
              Rooted in Rangunia, Thriving at IIUC
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              From freshers orientation to career guidance and emergency social
              action, Rangunia Students Forum stands as an unbreakable pillar of
              solidarity for students across all departments.
            </p>
          </div>

          <Link href="/register">
            <Button
              variant="outline"
              className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/50 hover:text-white"
            >
              <span>Join the Community</span>
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300 uppercase backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Blood Donation Section Teaser */}
        <div
          id="blood-network"
          className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/30 via-[#0a0708] to-[#040907] p-6 sm:p-10 backdrop-blur-xl"
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/50 px-3 py-1 text-xs font-semibold text-rose-300">
                <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>24/7 Lifeline Network</span>
              </div>
              <h3 className="mt-3 text-xl sm:text-3xl font-sans font-bold text-white">
                Emergency Blood Donor Network
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Whenever a patient from Rangunia or an IIUC family member needs
                urgent blood in Chittagong, our automated donor coordination system
                matches volunteer donors by blood group, availability, and area.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/register">
                <Button className="w-full sm:w-auto h-11 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-950">
                  Register as Blood Donor
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-11 border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
                >
                  Search Available Donors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
