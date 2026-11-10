"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DirectoryFilterOptions } from "@/features/directory/types/directory.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Filter,
} from "lucide-react";

interface SmartFilterBarProps {
  options: DirectoryFilterOptions;
}

export function SmartFilterBar({ options }: SmartFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current filter state from searchParams
  const search = searchParams.get("search") || "";
  const currentTab = searchParams.get("tab") || "students";
  const batch = searchParams.get("batch") || "";
  const department = searchParams.get("department") || "";
  const profession = searchParams.get("profession") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const city = searchParams.get("city") || "";

  // Local search text state for responsive typing
  const [prevSearch, setPrevSearch] = React.useState(search);
  const [searchInput, setSearchInput] = React.useState(search);

  // Sync state during render when URL query changes (React recommended pattern)
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    search || (batch && batch !== "ALL") ||
    (department && department !== "ALL") ||
    (profession && profession !== "ALL") ||
    (bloodGroup && bloodGroup !== "ALL") ||
    (city && city !== "ALL")
  );

  // Start expanded if user has active filters or clicked expand
  const [isExpanded, setIsExpanded] = React.useState(hasActiveFilters);

  // Update URL params helper
  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (!val || val === "ALL") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounced search input handler
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput ? searchInput.trim() : null });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, search, updateParams]);

  const handleReset = () => {
    setSearchInput("");
    const params = new URLSearchParams();
    if (currentTab) params.set("tab", currentTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [
    search,
    batch && batch !== "ALL",
    department && department !== "ALL",
    profession && profession !== "ALL",
    bloodGroup && bloodGroup !== "ALL",
    city && city !== "ALL",
  ].filter(Boolean).length;

  return (
    <div className="w-full space-y-3">
      {/* Collapsed Bar / Trigger Control */}
      {!isExpanded ? (
        <div className="flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex-1 flex items-center gap-3 text-left px-3 py-1.5 text-zinc-400 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-medium text-zinc-200">
                Search by Name or Student ID...
              </span>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                (Click to open Smart Filters)
              </span>
            </div>
          </button>

          <Button
            type="button"
            onClick={() => setIsExpanded(true)}
            size="sm"
            className="border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/80 hover:text-white flex items-center gap-1.5 h-9 px-3 rounded-xl"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      ) : (
        /* Expanded Search & Smart Filters Panel */
        <div className="rounded-2xl border border-emerald-500/30 bg-[#07130f]/95 p-4 sm:p-5 backdrop-blur-2xl shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Top Search Input Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <Input
                type="text"
                placeholder="Search by student full name or student ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-9 h-11 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                autoFocus
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/10 h-11 px-3 rounded-xl"
              title="Collapse filter menu"
            >
              <ChevronDown className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline ml-1 text-xs">Collapse</span>
            </Button>
          </div>

          {/* Dropdown Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-white/5">
            {/* 1. Batch */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Batch
              </label>
              <select
                value={batch || "ALL"}
                onChange={(e) => updateParams({ batch: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Batches</option>
                {options.batches.map((b) => (
                  <option key={b} value={b}>
                    Batch {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Department */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Department
              </label>
              <select
                value={department || "ALL"}
                onChange={(e) => updateParams({ department: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {options.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Profession / Title (Particularly relevant for alumni) */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Profession
              </label>
              <select
                value={profession || "ALL"}
                onChange={(e) => updateParams({ profession: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Professions</option>
                {options.professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Blood Group */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Blood Group
              </label>
              <select
                value={bloodGroup || "ALL"}
                onChange={(e) => updateParams({ bloodGroup: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Blood Groups</option>
                {options.bloodGroups.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Current City / Location */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Current City
              </label>
              <select
                value={city || "ALL"}
                onChange={(e) => updateParams({ city: e.target.value })}
                className="w-full h-10 rounded-xl border border-white/10 bg-zinc-900/80 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Locations</option>
                {options.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Pill Row & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-400" /> Active:
                </span>
                {search && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    <span>&quot;{search}&quot;</span>
                    <button onClick={() => updateParams({ search: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {batch && batch !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    <span>Batch {batch}</span>
                    <button onClick={() => updateParams({ batch: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {department && department !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    <span>{department}</span>
                    <button onClick={() => updateParams({ department: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {profession && profession !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-teal-950/60 border border-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full">
                    <span>{profession}</span>
                    <button onClick={() => updateParams({ profession: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {bloodGroup && bloodGroup !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-rose-950/60 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full">
                    <span>
                      {options.bloodGroups.find((bg) => bg.value === bloodGroup)?.label || bloodGroup}
                    </span>
                    <button onClick={() => updateParams({ bloodGroup: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {city && city !== "ALL" && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    <span>{city}</span>
                    <button onClick={() => updateParams({ city: null })}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-7 px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                <span>Reset All Filters</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
