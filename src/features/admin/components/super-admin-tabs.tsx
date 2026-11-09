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
      <div className="flex border-b border-white/10 pb-px gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("admins")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "admins"
              ? "border-emerald-400 text-white bg-white/[0.03] rounded-t-xl"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Executive Admins</span>
          {pendingAdminsCount > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pendingAdminsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "members"
              ? "border-emerald-400 text-white bg-white/[0.03] rounded-t-xl"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Users className="w-4 h-4 text-teal-400" />
          <span>Forum Members (Students & Alumni)</span>
          {pendingMembersCount > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
