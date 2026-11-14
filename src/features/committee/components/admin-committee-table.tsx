"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Award,
  Sparkles,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteCommitteeMemberAction } from "../actions/committee-actions";
import {
  CommitteeFormDialog,
  CommitteeFormData,
} from "./committee-form-dialog";

export interface CommitteeMemberItem {
  id: string;
  type: "ADVISOR" | "EXECUTIVE";
  name: string;
  photoUrl: string;
  gender: string;
  department: string;
  designation: string;
  quote: string;
  rank: number | null;
  createdAt: string | Date;
}

interface AdminCommitteeTableProps {
  initialMembers: CommitteeMemberItem[];
}

export function AdminCommitteeTable({
  initialMembers,
}: AdminCommitteeTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"ALL" | "ADVISOR" | "EXECUTIVE">(
    "ALL"
  );
  const [memberToDelete, setMemberToDelete] =
    React.useState<CommitteeMemberItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter members based on search and type tab
  const filteredMembers = React.useMemo(() => {
    return initialMembers
      .filter((m) => {
        if (activeTab !== "ALL" && m.type !== activeTab) return false;
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.quote.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Advisors first, then Executives sorted by rank ascending
        if (a.type !== b.type) {
          return a.type === "ADVISOR" ? -1 : 1;
        }
        if (a.type === "EXECUTIVE" && b.type === "EXECUTIVE") {
          return (a.rank ?? 999) - (b.rank ?? 999);
        }
        return a.name.localeCompare(b.name);
      });
  }, [initialMembers, activeTab, searchTerm]);

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteCommitteeMemberAction(memberToDelete.id);
      if (res.success) {
        toast.success("Committee member removed successfully.");
        setMemberToDelete(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to remove committee member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while deleting member.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Bar & Type Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name, role, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500"
          />
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
              activeTab === "ALL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All ({initialMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ADVISOR")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
              activeTab === "ADVISOR"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Advisors ({initialMembers.filter((m) => m.type === "ADVISOR").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("EXECUTIVE")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
              activeTab === "EXECUTIVE"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Executives ({initialMembers.filter((m) => m.type === "EXECUTIVE").length})
          </button>
        </div>
      </div>

      {/* Committee Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.01] shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
              <th className="py-3.5 px-4 font-semibold">Member</th>
              <th className="py-3.5 px-4 font-semibold">Role Type</th>
              <th className="py-3.5 px-4 font-semibold">Rank / Tier</th>
              <th className="py-3.5 px-4 font-semibold">Department</th>
              <th className="py-3.5 px-4 font-semibold">Quote Excerpt</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-zinc-600" />
                    <p className="text-sm font-medium">No committee members found</p>
                    <p className="text-xs text-zinc-600">
                      Try adjusting your search criteria or appoint a new member above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const isFemale = member.gender.trim().toLowerCase() === "female";
                // RENDER OVERRIDE: strictly enforce /hijabi.png for female
                const avatarSrc = isFemale ? "/hijabi.png" : member.photoUrl || "/hijabi.png";

                const formData: CommitteeFormData = {
                  id: member.id,
                  type: member.type,
                  name: member.name,
                  photoUrl: member.photoUrl,
                  gender: member.gender,
                  department: member.department,
                  designation: member.designation,
                  quote: member.quote,
                  rank: member.rank,
                };

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Member Name + Photo + Designation */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-zinc-950 shrink-0 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={avatarSrc}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {isFemale && (
                              <span
                                title="Female Member Privacy Override (/hijabi.png)"
                                className="inline-flex items-center text-[10px] text-rose-400 font-mono"
                              >
                                <Shield className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {member.designation}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Type */}
                    <td className="py-3.5 px-4">
                      {member.type === "ADVISOR" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-[11px] font-mono text-amber-300">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Advisor</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[11px] font-mono text-emerald-300">
                          <Award className="w-3 h-3 text-emerald-400" />
                          <span>Executive</span>
                        </span>
                      )}
                    </td>

                    {/* Rank / Tier */}
                    <td className="py-3.5 px-4 font-mono">
                      {member.type === "ADVISOR" ? (
                        <span className="text-zinc-500 text-[11px]">Pinned (Top)</span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-400 font-bold text-[11px]">
                            Tier {Math.floor(member.rank ?? 0)}
                          </span>
                          <div className="text-[10px] text-zinc-400">
                            Rank {member.rank?.toFixed(1)}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Department & Gender */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-200">{member.department}</div>
                      <div className="text-[10px] text-zinc-500">
                        {isFemale ? "Female (Masked)" : member.gender}
                      </div>
                    </td>

                    {/* Quote Excerpt */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-zinc-400 italic line-clamp-2 text-[11px]">
                        &quot;{member.quote}&quot;
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <CommitteeFormDialog
                          mode="edit"
                          initialData={formData}
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToDelete(member)}
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={memberToDelete !== null}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <DialogContent className="max-w-md bg-[#07130f] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-white">
              Remove Committee Member?
            </DialogTitle>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white">
                {memberToDelete?.name}
              </span>{" "}
              ({memberToDelete?.designation}) from the committee? This will delete their record and remove them from the public showcase.
            </p>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={() => setMemberToDelete(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Removing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Removal</span>
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
