"use client";

import * as React from "react";
import {
  GraduationCap,
  Briefcase,
  Check,
  X,
  Loader2,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Droplet,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  approveMemberAction,
  rejectMemberAction,
  deleteMemberAction,
} from "../actions/approval-actions";
import type { SerializedPendingMember } from "../types/approval.types";

type Props = {
  initialMembers: SerializedPendingMember[];
  onActionComplete?: () => void;
};

export function MemberApprovalList({ initialMembers, onActionComplete }: Props) {
  const [members, setMembers] = React.useState<SerializedPendingMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<"ALL" | "STUDENT" | "ALUMNI">("ALL");
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const res = await approveMemberAction(id);
      if (res.success) {
        toast.success(res.message || `${name} has been approved.`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (onActionComplete) onActionComplete();
      } else {
        toast.error(res.error || "Failed to approve member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const res = await rejectMemberAction(id);
      if (res.success) {
        toast.success(res.message || `${name} application has been rejected.`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (onActionComplete) onActionComplete();
      } else {
        toast.error(res.error || "Failed to reject member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the registration record for ${name}?`)) {
      return;
    }
    setProcessingId(id);
    try {
      const res = await deleteMemberAction(id);
      if (res.success) {
        toast.success(res.message || `${name} has been permanently deleted.`);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        if (onActionComplete) onActionComplete();
      } else {
        toast.error(res.error || "Failed to delete member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter members based on search and category
  const filteredMembers = members.filter((m) => {
    const matchesCategory =
      filterRole === "ALL" ||
      (filterRole === "ALUMNI" && m.isAlumni) ||
      (filterRole === "STUDENT" && !m.isAlumni);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.fullName.toLowerCase().includes(q) ||
      m.studentId.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.phone && m.phone.includes(q)) ||
      (m.address && m.address.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const studentCount = members.filter((m) => !m.isAlumni).length;
  const alumniCount = members.filter((m) => m.isAlumni).length;

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by name, student ID, department, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-black/40 text-xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterRole("ALL")}
            className={`h-8 px-3 rounded-lg text-xs font-semibold ${
              filterRole === "ALL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>All ({members.length})</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterRole("STUDENT")}
            className={`h-8 px-3 rounded-lg text-xs font-semibold ${
              filterRole === "STUDENT"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            <span>Students ({studentCount})</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFilterRole("ALUMNI")}
            className={`h-8 px-3 rounded-lg text-xs font-semibold ${
              filterRole === "ALUMNI"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 mr-1" />
            <span>Alumni ({alumniCount})</span>
          </Button>
        </div>
      </div>

      {/* Member Cards / Queue */}
      {filteredMembers.length === 0 ? (
        <Card className="border border-white/10 bg-[#07130f]/60 backdrop-blur-md text-white text-center py-16 px-4">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Pending Registrations</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchQuery || filterRole !== "ALL"
                ? "No pending members match your active filters or search terms."
                : "All submitted student and alumni registrations have been reviewed and processed."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMembers.map((member) => {
            const isProcessing = processingId === member.id;
            return (
              <Card
                key={member.id}
                className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white transition-all hover:border-white/20 shadow-lg"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Member Profile Snapshot */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
                        {member.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-950/60 text-emerald-300 font-bold font-mono text-lg">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info Details */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-base text-white tracking-tight truncate">
                            {member.fullName}
                          </h4>
                          <Badge
                            variant="outline"
                            className={
                              member.isAlumni
                                ? "border-teal-500/40 bg-teal-950/40 text-teal-300 text-[10px] font-semibold"
                                : "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px] font-semibold"
                            }
                          >
                            {member.isAlumni ? (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                Alumni
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                Student
                              </span>
                            )}
                          </Badge>

                          <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300">
                            {member.studentId}
                          </span>

                          {member.bloodGroup && (
                            <span className="text-[10px] font-semibold text-rose-300 bg-rose-950/30 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                              <Droplet className="w-2.5 h-2.5 fill-rose-500" />
                              <span>{member.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</span>
                            </span>
                          )}
                        </div>

                        {/* Meta Line */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-zinc-500" />
                            {member.department} ({member.session})
                          </span>

                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span className="truncate max-w-[200px]">{member.email}</span>
                          </span>

                          {member.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-zinc-500" />
                              <span>{member.phone}</span>
                            </span>
                          )}

                          {member.address && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-500" />
                              <span className="truncate max-w-[180px]">{member.address}</span>
                            </span>
                          )}
                        </div>

                        {/* Role-Specific Detail Snippet */}
                        {member.isAlumni && (member.jobPosition || member.company) && (
                          <p className="text-[11px] text-teal-300/90 pt-0.5">
                            💼 {member.jobPosition || "Professional"}
                            {member.company ? ` at ${member.company}` : ""}
                          </p>
                        )}
                        {!member.isAlumni && member.currentSemester && (
                          <p className="text-[11px] text-emerald-300/90 pt-0.5">
                            📚 Enrolled Semester: {member.currentSemester}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0 w-full sm:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      <Button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDelete(member.id, member.fullName)}
                        variant="ghost"
                        size="sm"
                        className="h-9 px-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs shrink-0"
                        title="Delete record permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleReject(member.id, member.fullName)}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white text-xs h-9"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 mr-1" />
                            <span>Reject</span>
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleApprove(member.id, member.fullName)}
                        size="sm"
                        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-md shadow-emerald-950"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            <span>Approve</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
