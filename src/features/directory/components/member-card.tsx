"use client";

import * as React from "react";
import Link from "next/link";
import { MaskedDirectoryMember } from "@/features/directory/types/directory.types";
import { ArrowUpRight, Building } from "lucide-react";

interface MemberCardProps {
  member: MaskedDirectoryMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      href={`/directory/${member.id}`}
      className="group relative block rounded-2xl border border-white/10 bg-[#07130f]/80 p-4 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0a1a14]/95 hover:shadow-[0_8px_28px_rgba(16,185,129,0.12)] hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          {/* Member Name */}
          <h3 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-emerald-300 transition-colors">
            {member.fullName}
          </h3>

          {/* Department */}
          <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
            <Building className="w-3 h-3 text-emerald-400/80 shrink-0" />
            <span className="truncate">{member.department}</span>
          </p>
        </div>

        {/* Subtle navigation affordance icon */}
        <div className="w-7 h-7 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 group-hover:text-emerald-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
