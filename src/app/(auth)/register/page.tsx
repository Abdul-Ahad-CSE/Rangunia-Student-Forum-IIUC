import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RegisterHubPage() {
  const options = [
    {
      id: "student",
      title: "IIUC Student Member",
      badge: "Current Enrolled Students",
      badgeColor: "border-emerald-500/30 bg-emerald-950/40 text-emerald-300",
      icon: GraduationCap,
      description:
        "For active IIUC students originating from Rangunia. Access emergency blood donor networks, department communities, and campus forum activities.",
      benefits: [
        "Verified member profile & student directory",
        "Emergency blood donation request & volunteer access",
        "Campus notices, events & transport coordination",
      ],
      href: "/register/student",
      cta: "Register as Student",
      highlight: true,
    },
    {
      id: "alumni",
      title: "IIUC Alumni Network",
      badge: "Graduates & Professionals",
      badgeColor: "border-teal-500/30 bg-teal-950/40 text-teal-300",
      icon: Briefcase,
      description:
        "For graduated IIUC alumni from Rangunia working across diverse industries. Offer mentorship, share career pathways, and connect with juniors.",
      benefits: [
        "Alumni directory & career network visibility",
        "Student mentorship & CV review participation",
        "Professional networking & forum reunions",
      ],
      href: "/register/alumni",
      cta: "Register as Alumni",
      highlight: false,
    },
    {
      id: "executive",
      title: "General Executive",
      badge: "Forum Committee",
      badgeColor: "border-amber-500/30 bg-amber-950/40 text-amber-300",
      icon: ShieldCheck,
      description:
        "For appointed executive committee officers applying for forum management credentials. Requires Super Admin verification prior to access.",
      benefits: [
        "Administrative dashboard & audit visibility",
        "Moderation capabilities (profile, events, blood)",
        "Official executive committee portfolio listing",
      ],
      href: "/admin/register",
      cta: "Apply for Executive",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#040907] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-white">
            Choose Your Registration Role
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl">
            Join the Rangunia Students Forum (IIUC Chapter) platform. Select your membership
            category to start your customized registration.
          </p>
        </div>

        {/* Super Admin Exclusion Notice Banner */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs sm:text-sm flex items-start gap-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Super Admin Registration Strictly Excluded
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Super Admin root credentials are never generated through public registration forms.
              They are authenticated exclusively via secure environment infrastructure.
            </p>
          </div>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Card
                key={opt.id}
                className={`relative flex flex-col justify-between border bg-[#07130f]/80 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                  opt.highlight
                    ? "border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                    : "border-white/10 hover:border-white/20 shadow-xl"
                }`}
              >
                <div>
                  <CardHeader className="space-y-3 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-white">
                      {opt.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 leading-relaxed min-h-[48px]">
                      {opt.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Included Privileges:
                      </p>
                      {opt.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <Link href={opt.href} className="w-full block">
                    <Button
                      className={`w-full h-11 font-semibold flex items-center justify-center gap-2 transition-all ${
                        opt.highlight
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950"
                          : "border border-white/15 bg-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      <span>{opt.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Existing Member Sign In Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-zinc-400">
            Already have an active account or executive credentials?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 ml-1"
            >
              Sign In to Your Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
