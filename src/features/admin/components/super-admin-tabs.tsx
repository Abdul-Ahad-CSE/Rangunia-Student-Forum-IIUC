"use client";

import * as React from "react";
import { ShieldCheck, Users } from "lucide-react";
import { AdminApprovalList, type SerializedAdminUser } from "./admin-approval-cards";
import { MemberApprovalList } from "@/features/approvals/components/member-approval-list";
import type { SerializedPendingMember } from "@/features/approvals/types/approval.types";

type Props = {
  initialAdmins: SerializedAdminUser[];
  initialMembers: SerializedPendingMember[];
};

export function SuperAdminTabs({ initialAdmins, initialMembers }: Props) {
  const [activeTab, setActiveTab] = React.useState<"admins" | "members">("admins");

  const pendingAdminsCount = initialAdmins.filter((a) => a.approvalStatus === "PENDING").length;
  const pendingMembersCount = initialMembers.length;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 w-full sm:flex sm:w-auto border-b border-zinc-200 dark:border-white/10 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("admins")}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "admins"
              ? "border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-white bg-emerald-50/50 dark:bg-white/[0.03] rounded-t-xl"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">Executive Admins</span>
          {pendingAdminsCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
              {pendingAdminsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "members"
              ? "border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-white bg-emerald-50/50 dark:bg-white/[0.03] rounded-t-xl"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">Members</span>
            <span className="hidden sm:inline">Forum Members (Students & Alumni)</span>
          </span>
          {pendingMembersCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
              {pendingMembersCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "admins" ? (
        <AdminApprovalList initialAdmins={initialAdmins} />
      ) : (
        <MemberApprovalList initialMembers={initialMembers} />
      )}
    </div>
  );
}
