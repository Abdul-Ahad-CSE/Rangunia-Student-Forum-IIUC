"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  MaskedDirectoryMember,
  DirectoryFilterOptions,
} from "@/features/directory/types/directory.types";
import { MemberCard } from "@/features/directory/components/member-card";
import { SmartFilterBar } from "@/features/directory/components/smart-filter-bar";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Briefcase,
  SearchX,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

interface DirectoryViewProps {
  initialMembers: MaskedDirectoryMember[];
  counts: {
    total: number;
    students: number;
    alumni: number;
  };
  options: DirectoryFilterOptions;
}

export function DirectoryView({
  initialMembers,
  counts,
  options,
}: DirectoryViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = (searchParams.get("tab") as "students" | "alumni" | "all") || "students";

  const handleTabChange = (newTab: "students" | "alumni" | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    params.set("tab", currentTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Directory Top Bar: Tabs + Smart Filter Bar */}
      <div className="space-y-4">
        {/* Tab Selection */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-white/5">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900/80 border border-white/10">
            {/* Students Tab */}
            <button
              type="button"
              onClick={() => handleTabChange("students")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === "students"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Current Students</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full font-mono text-[11px] ${
                  currentTab === "students"
                    ? "bg-emerald-700/80 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {counts.students}
              </span>
            </button>

            {/* Alumni Tab */}
            <button
              type="button"
              onClick={() => handleTabChange("alumni")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === "alumni"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-950/60"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Distinguished Alumni</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full font-mono text-[11px] ${
                  currentTab === "alumni"
                    ? "bg-teal-700/80 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {counts.alumni}
              </span>
            </button>
          </div>

          {/* Privacy Shield Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Server Masked: Confidential fields protected</span>
          </div>
        </div>

        {/* Smart Minimalist Search & Filter Bar */}
        <SmartFilterBar options={options} />
      </div>

      {/* Directory Member Cards Grid */}
      {initialMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-white/10 bg-[#07130f]/60 p-12 text-center backdrop-blur-xl space-y-4 max-w-md mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl border border-white/10 bg-zinc-900/80 flex items-center justify-center text-zinc-500 mx-auto">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Members Found</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No registered members match your current search queries and filters.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Clear Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
