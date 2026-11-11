"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Users, ExternalLink, GraduationCap, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface RegisteredUserItem {
  id: string;
  createdAt: Date | string;
  user: {
    id: string;
    fullName: string;
    studentId: string;
    department: string;
    session: string;
    batch: string | null;
    role: string;
    photoUrl: string | null;
  };
}

interface EventRegistrationsTableProps {
  registrations: RegisteredUserItem[];
  eventTitle: string;
}

export function EventRegistrationsTable({
  registrations,
  eventTitle,
}: EventRegistrationsTableProps) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return registrations;
    return registrations.filter((r) => {
      const u = r.user;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.studentId.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.session.toLowerCase().includes(q) ||
        (u.batch && u.batch.toLowerCase().includes(q))
      );
    });
  }, [registrations, query]);

  return (
    <div className="space-y-4">
      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search registrations by name, student ID, department..."
            className="pl-9.5 border-white/10 bg-black/40 text-white placeholder:text-zinc-500 text-xs sm:text-sm focus-visible:border-emerald-500 rounded-xl h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-xs px-3 py-1">
            <Users className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            <span>Total Registered: {registrations.length}</span>
          </Badge>
        </div>
      </div>

      {/* Registrations List / Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <Users className="w-10 h-10 text-zinc-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white">
            {registrations.length === 0
              ? "No member registrations recorded yet"
              : "No registrations match your search filter"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {registrations.length === 0
              ? `Member registrations for "${eventTitle}" will appear here as users sign up.`
              : "Try searching with a different name or student ID."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Student ID</th>
                  <th className="py-3.5 px-4 font-semibold">Department &amp; Session</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Registered At</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((item, idx) => {
                  const u = item.user;
                  const regDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 font-mono text-[10px] w-5 text-right">
                            {idx + 1}.
                          </span>
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0 flex items-center justify-center font-bold text-white text-xs">
                            {u.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.photoUrl} alt={u.fullName} className="w-full h-full object-cover" />
                            ) : (
                              u.fullName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="font-semibold text-white truncate max-w-[180px]">
                            {u.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {u.studentId}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="text-white font-medium">{u.department}</p>
                          <p className="text-[11px] text-zinc-500">
                            {u.session} {u.batch ? `• Batch ${u.batch}` : ""}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            u.role === "ALUMNI"
                              ? "border-teal-500/30 bg-teal-950/20 text-teal-300 text-[10px]"
                              : "border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-[10px]"
                          }
                        >
                          {u.role === "ALUMNI" ? (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-2.5 h-2.5" /> Alumni
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-2.5 h-2.5" /> Student
                            </span>
                          )}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-zinc-400 text-[11px] font-mono">
                        {regDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/directory/${u.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                        >
                          <span>Directory</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
