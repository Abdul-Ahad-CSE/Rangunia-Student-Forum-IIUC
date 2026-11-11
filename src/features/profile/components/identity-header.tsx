"use client";

import * as React from "react";
import {
  Camera,
  Loader2,
  Building,
  Calendar,
  Droplet,
  MapPin,
  Sparkles,
  Clock,
  LogOut,
  Hash,
  User as UserIcon,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { updateProfilePhotoAction } from "../actions/update-photo-action";
import { VerificationStatus } from "@prisma/client";

export interface IdentityHeaderProps {
  name: string;
  initialPhotoUrl: string | null;
  studentId: string;
  department: string;
  batch: string | null;
  session: string;
  bloodGroup: string | null;
  gender: string;
  permanentAddress: string | null;
  verificationStatus: VerificationStatus | string;
  isAlumni: boolean;
  onSignOut: () => Promise<void>;
}

function formatBloodGroup(bg: string | null) {
  if (!bg) return null;
  const map: Record<string, string> = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };
  return map[bg] || bg;
}

export function IdentityHeader({
  name,
  initialPhotoUrl,
  studentId,
  department,
  batch,
  session,
  bloodGroup,
  gender,
  permanentAddress,
  verificationStatus,
  isAlumni,
  onSignOut,
}: IdentityHeaderProps) {
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(initialPhotoUrl);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formattedBlood = formatBloodGroup(bloodGroup);

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size must be smaller than 3MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await updateProfilePhotoAction(base64);
        if (res.success) {
          setPhotoUrl(base64);
          toast.success(res.message || "Profile photo updated successfully!");
        } else {
          toast.error(res.error || "Failed to update profile photo.");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while uploading photo.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read image file.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
      {/* Decorative Brand Header Bar */}
      <div className="h-28 bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-teal-950/90 border-b border-white/5 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Badge
            className={
              verificationStatus === "APPROVED"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }
          >
            {verificationStatus === "APPROVED" ? (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Sparkles className="w-3 h-3" />
                Verified Member
              </span>
            ) : (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                Verification Pending
              </span>
            )}
          </Badge>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSignOut()}
            className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      <CardContent className="pt-0 pb-6 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 mb-6">
          {/* Interactive Profile Photo */}
          <div className="relative group shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploading}
              aria-label="Click to update profile photo"
              className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-zinc-950 shadow-2xl transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#07130f]"
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950 to-zinc-900 text-emerald-300 text-2xl font-bold font-mono">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Hover / Loading Overlay */}
              <div
                className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-200 ${
                  isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-emerald-400 mb-0.5" />
                    <span className="text-[10px] font-medium text-white tracking-wide">
                      Edit Photo
                    </span>
                  </>
                )}
              </div>
            </button>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-[#07130f] flex items-center justify-center text-white pointer-events-none shadow-md">
              <Camera className="w-3 h-3" />
            </div>
          </div>

          {/* Member Name & Status */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {name}
              </h1>
              <Badge
                variant="outline"
                className={
                  isAlumni
                    ? "border-teal-500/30 bg-teal-950/40 text-teal-300 text-[10px]"
                    : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px]"
                }
              >
                {isAlumni ? "IIUC Alumni" : "IIUC Student"}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-zinc-400 text-[10px] flex items-center gap-1 font-mono"
              >
                <Lock className="w-2.5 h-2.5 text-zinc-500" />
                <span>Verified Identity</span>
              </Badge>
            </div>

            <p className="text-xs text-zinc-400">
              International Islamic University Chittagong • Rangunia Students Forum
            </p>
          </div>
        </div>

        {/* Read-Only Unchangeable Identity Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Student Identity (Read-Only)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Permanent Record</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Student ID */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5">
                Student ID
              </span>
              <span className="text-white font-mono font-semibold truncate block">
                {studentId}
              </span>
            </div>

            {/* 2. Department */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <Building className="w-3 h-3 text-emerald-400" />
                <span>Department</span>
              </span>
              <span className="text-white font-medium truncate block">
                {department}
              </span>
            </div>

            {/* 3. Batch */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <Hash className="w-3 h-3 text-emerald-400" />
                <span>Batch</span>
              </span>
              <span className="text-white font-mono font-medium truncate block">
                {batch ? (batch.toLowerCase().startsWith("batch") ? batch : `Batch: ${batch}`) : "Batch: N/A"}
              </span>
            </div>

            {/* 4. Session */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>Session</span>
              </span>
              <span className="text-white font-medium truncate block">
                {session}
              </span>
            </div>

            {/* 5. Blood Group */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-rose-400" />
                <span>Blood Group</span>
              </span>
              <span className="text-rose-300 font-mono font-semibold truncate block">
                {formattedBlood || "Unlisted"}
              </span>
            </div>

            {/* 6. Gender (hardcoded/displayed as Male per forum privacy rules) */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-emerald-400" />
                <span>Gender</span>
              </span>
              <span className="text-white font-medium truncate block">
                {gender === "FEMALE" ? "Female" : "Male"}
              </span>
            </div>

            {/* 7. Permanent Address (Spans 2 columns on sm) */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] col-span-2">
              <span className="text-[10px] font-medium text-zinc-500 block mb-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Permanent Address (Rangunia Origin)</span>
              </span>
              <span className="text-white font-medium truncate block" title={permanentAddress || "Rangunia, Chittagong"}>
                {permanentAddress || "Rangunia, Chittagong"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
