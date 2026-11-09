"use client";

import * as React from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  approveAdminAction,
  rejectAdminAction,
} from "@/features/admin/actions/admin-actions";

export interface SerializedAdminUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  studentId: string;
  department: string;
  section: string;
  phone: string;
  position: string;
  enrollment: string;
  currentAddress: string;
  permanentAddress: string;
  gender: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AdminApprovalListProps {
  initialAdmins: SerializedAdminUser[];
}

export function AdminApprovalList({ initialAdmins }: AdminApprovalListProps) {
  const [admins, setAdmins] = React.useState<SerializedAdminUser[]>(initialAdmins);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const pendingAdmins = admins.filter((a) => a.approvalStatus === "PENDING");
  const processedAdmins = admins.filter((a) => a.approvalStatus !== "PENDING");

  const handleApprove = async (adminId: string) => {
    setProcessingId(adminId);
    setFeedback(null);

    const res = await approveAdminAction(adminId);
    setProcessingId(null);

    if (res.success) {
      setFeedback({ text: res.message || "Admin approved successfully!", type: "success" });
      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? { ...a, approvalStatus: "APPROVED" } : a))
      );
    } else {
      setFeedback({ text: res.error || "Failed to approve admin", type: "error" });
    }
  };

  const handleReject = async (adminId: string) => {
    setProcessingId(adminId);
    setFeedback(null);

    const res = await rejectAdminAction(adminId, "Rejected by Super Admin.");
    setProcessingId(null);

    if (res.success) {
      setFeedback({ text: res.message || "Admin rejected successfully.", type: "success" });
      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? { ...a, approvalStatus: "REJECTED" } : a))
      );
    } else {
      setFeedback({ text: res.error || "Failed to reject admin", type: "error" });
    }
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
              : "border-destructive/40 bg-destructive/20 text-rose-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PENDING APPROVAL QUEUE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Pending Approval Queue</h2>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              {pendingAdmins.length} Pending
            </Badge>
          </div>
        </div>

        {pendingAdmins.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center text-zinc-400">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-base font-medium text-white">All caught up!</p>
            <p className="text-xs text-zinc-500 mt-1">There are no pending admin registration applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-2xl border border-amber-500/30 bg-[#07130f]/90 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4"
              >
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0 flex items-center justify-center">
                    {admin.photoUrl ? (
                      <Image
                        src={admin.photoUrl}
                        alt={admin.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-8 h-8 text-zinc-500" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-white truncate">{admin.name}</h3>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-emerald-400">{admin.position}</p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{admin.department} • Sec {admin.section} • {admin.enrollment}</span>
                    </p>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-b border-white/5 py-3 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ID: <strong className="text-white">{admin.studentId}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{admin.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-zinc-400">
                      <p><span className="text-zinc-300">Current:</span> {admin.currentAddress}</p>
                      <p><span className="text-zinc-300">Permanent:</span> {admin.permanentAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Approval Action Controls */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied: {new Date(admin.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(admin.id)}
                      disabled={processingId === admin.id}
                      className="border-rose-500/30 text-rose-300 hover:bg-rose-950/40 hover:text-white h-9 px-3 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Reject</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleApprove(admin.id)}
                      disabled={processingId === admin.id}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-9 px-4 text-xs shadow-md shadow-emerald-950"
                    >
                      {processingId === admin.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      )}
                      <span>Approve Admin</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROCESSED EXECUTIVES ARCHIVE */}
      {processedAdmins.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Registered Executives Directory</h2>
            <Badge variant="outline" className="text-zinc-400 border-white/15">
              {processedAdmins.length} Total
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAdmins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0 flex items-center justify-center">
                  {admin.photoUrl ? (
                    <Image
                      src={admin.photoUrl}
                      alt={admin.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-6 h-6 text-zinc-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-white truncate">{admin.name}</p>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 ${
                        admin.approvalStatus === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {admin.approvalStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{admin.position}</p>
                  <p className="text-[11px] text-zinc-500">{admin.studentId} • {admin.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
