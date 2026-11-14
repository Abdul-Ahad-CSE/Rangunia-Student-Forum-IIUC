"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Award,
  UploadCloud,
  CheckCircle2,
  Shield,
  PlusCircle,
  Edit3,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import {
  createCommitteeMemberAction,
  updateCommitteeMemberAction,
} from "../actions/committee-actions";
import { CommitteeMemberInput } from "../schemas/committee.schema";

export interface CommitteeFormData {
  id?: string;
  type: "ADVISOR" | "EXECUTIVE";
  name: string;
  photoUrl: string;
  gender: string;
  department: string;
  designation: string;
  quote: string;
  rank?: number | null;
}

interface CommitteeFormDialogProps {
  mode?: "create" | "edit";
  initialData?: CommitteeFormData;
  triggerButton?: React.ReactElement;
  onSuccess?: () => void;
}

export function CommitteeFormDialog({
  mode = "create",
  initialData,
  triggerButton,
  onSuccess,
}: CommitteeFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form Fields
  const [type, setType] = React.useState<"ADVISOR" | "EXECUTIVE">(
    initialData?.type || "EXECUTIVE"
  );
  const [name, setName] = React.useState(initialData?.name || "");
  const [gender, setGender] = React.useState(initialData?.gender || "Male");
  const [department, setDepartment] = React.useState(
    initialData?.department || ""
  );
  const [designation, setDesignation] = React.useState(
    initialData?.designation || ""
  );
  const [quote, setQuote] = React.useState(initialData?.quote || "");
  const [rank, setRank] = React.useState<string>(
    initialData?.rank !== undefined && initialData?.rank !== null
      ? String(initialData.rank)
      : "1.0"
  );
  const [photoUrl, setPhotoUrl] = React.useState<string>(
    initialData?.photoUrl || ""
  );

  const isFemale = gender.trim().toLowerCase() === "female";

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      if (initialData) {
        setType(initialData.type);
        setName(initialData.name);
        setGender(initialData.gender);
        setDepartment(initialData.department);
        setDesignation(initialData.designation);
        setQuote(initialData.quote);
        setRank(
          initialData.rank !== undefined && initialData.rank !== null
            ? String(initialData.rank)
            : "1.0"
        );
        const femaleCheck = initialData.gender.trim().toLowerCase() === "female";
        setPhotoUrl(femaleCheck ? "/hijabi.png" : initialData.photoUrl || "");
      } else if (mode === "create") {
        setType("EXECUTIVE");
        setName("");
        setGender("Male");
        setDepartment("");
        setDesignation("");
        setQuote("");
        setRank("1.0");
        setPhotoUrl("");
      }
    }
  };

  const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
    if (selectedGender.trim().toLowerCase() === "female") {
      // Force modesty avatar strictly
      setPhotoUrl("/hijabi.png");
    } else {
      // If switching back to Male and photo was hijabi, reset to empty or initial
      if (photoUrl === "/hijabi.png") {
        setPhotoUrl(initialData?.gender === "Male" ? initialData.photoUrl : "");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the member's full name.");
      return;
    }
    if (!department.trim()) {
      toast.error("Department is required (e.g., CSE, EEE).");
      return;
    }
    if (!designation.trim()) {
      toast.error("Designation is required (e.g., President, General Secretary).");
      return;
    }
    if (!quote.trim() || quote.trim().length < 5) {
      toast.error("Quote or statement must be at least 5 characters.");
      return;
    }

    let parsedRank: number | null = null;
    if (type === "EXECUTIVE") {
      if (!rank.trim()) {
        toast.error("Rank is required for executive members (e.g., 1.0, 1.1).");
        return;
      }
      parsedRank = parseFloat(rank);
      if (isNaN(parsedRank) || parsedRank <= 0) {
        toast.error("Please enter a valid numeric rank (e.g. 1.0, 1.1, 2.0).");
        return;
      }
    }

    // STRICT FEMALE PRIVACY OVERRIDE:
    // If Female, force photoUrl to strictly "/hijabi.png", regardless of anything else.
    const finalPhotoUrl = isFemale ? "/hijabi.png" : photoUrl.trim();

    if (!finalPhotoUrl) {
      toast.error("Please upload or provide a photo for this member.");
      return;
    }

    setIsSubmitting(true);

    const payload: CommitteeMemberInput = {
      type,
      name: name.trim(),
      photoUrl: finalPhotoUrl,
      gender: isFemale ? "Female" : gender.trim(),
      department: department.trim(),
      designation: designation.trim(),
      quote: quote.trim(),
      rank: parsedRank,
    };

    try {
      if (mode === "edit" && initialData?.id) {
        const res = await updateCommitteeMemberAction(initialData.id, payload);
        if (res.success) {
          toast.success("Committee member updated successfully.");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to update committee member.");
        }
      } else {
        const res = await createCommitteeMemberAction(payload);
        if (res.success) {
          toast.success("Committee member appointed successfully.");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to create committee member.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving committee member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          triggerButton ? (
            triggerButton
          ) : (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              {mode === "create" ? (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Committee Member</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Member</span>
                </>
              )}
            </Button>
          )
        }
      />

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#07130f] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>
              {mode === "create"
                ? "Appoint Committee Member"
                : `Edit Committee Member: ${initialData?.name || ""}`}
            </span>
          </DialogTitle>
          <p className="text-xs text-zinc-400 pt-1">
            Configure advisors or executive members with decimal rank-based tiering and strict privacy overrides.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Member Role / Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-300">
              Committee Role Type <span className="text-rose-400">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("EXECUTIVE")}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === "EXECUTIVE"
                    ? "border-emerald-500 bg-emerald-950/50 text-emerald-300 shadow-md shadow-emerald-950"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                <Award className="w-4 h-4" />
                <div className="text-left">
                  <div>Executive Member</div>
                  <div className="text-[10px] font-normal text-zinc-400">
                    Tiered by Decimal Rank
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("ADVISOR")}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === "ADVISOR"
                    ? "border-amber-500 bg-amber-950/40 text-amber-300 shadow-md shadow-amber-950"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div>Honorable Advisor</div>
                  <div className="text-[10px] font-normal text-zinc-400">
                    Pinned to Top Tier
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Full Name <span className="text-rose-400">*</span>
              </Label>
              <Input
                placeholder="e.g. Engr. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Gender <span className="text-rose-400">*</span>
              </Label>
              <select
                value={gender}
                onChange={(e) => handleGenderChange(e.target.value)}
                className="w-full h-9 rounded-md bg-black/40 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Male" className="bg-zinc-900 text-white">
                  Male
                </option>
                <option value="Female" className="bg-zinc-900 text-white">
                  Female (Privacy Protected)
                </option>
              </select>
            </div>
          </div>

          {/* Department & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Department <span className="text-rose-400">*</span>
              </Label>
              <Input
                placeholder="e.g. CSE, EEE, Pharmacy, BBA"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Designation <span className="text-rose-400">*</span>
              </Label>
              <Input
                placeholder={
                  type === "ADVISOR"
                    ? "e.g. Chief Advisor, Senior Patron"
                    : "e.g. President, Vice President, General Secretary"
                }
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* Rank Field - ONLY for EXECUTIVE members */}
          {type === "EXECUTIVE" ? (
            <div className="space-y-1.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Executive Rank (Decimal Float)</span>
                  <span className="text-rose-400">*</span>
                </Label>
                <span className="text-[11px] font-mono text-zinc-400">
                  Floor = Tier ({rank ? `Tier ${Math.floor(parseFloat(rank) || 0)}` : "Tier 1"})
                </span>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 1.0 (President), 1.1 (VP), 2.0 (General Sec)"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
                className="bg-black/50 border-white/10 text-white font-mono text-xs focus:border-emerald-500"
              />
              <p className="text-[11px] text-zinc-400 leading-tight">
                Executives sharing the same integer part (e.g. 1.0 and 1.1) are grouped horizontally into Tier 1 (Presidium).
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/10 flex items-center gap-2 text-xs text-amber-300/90 font-mono">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Advisors bypass rank ordering and are pinned to the top of the committee showcase.</span>
            </div>
          )}

          {/* Photo Management with Strict Female Privacy Override */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-300">
              Member Avatar Photo <span className="text-rose-400">*</span>
            </Label>

            {isFemale ? (
              // CRITICAL FEMALE PRIVACY OVERRIDE:
              // Completely hide/disable Cloudinary CldUploadWidget.
              // Display /hijabi.png preview and lockdown notice.
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>Strict Female Privacy Override Active</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Per the Rangunia Students Forum constitutional privacy policy, female committee member photos are strictly masked with the verified modesty avatar. Custom image uploading is permanently disabled.
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-rose-400/50 bg-black/60 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hijabi.png"
                      alt="Strict Female Avatar Override"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-950/60 text-[10px] font-mono text-rose-300 font-bold">
                      LOCKED: /hijabi.png
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Payload will be enforced to &quot;/hijabi.png&quot; on submission.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // MALE or OTHER: Standard Cloudinary Upload Widget
              <div className="space-y-3">
                {photoUrl && photoUrl !== "/hijabi.png" ? (
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-emerald-500/40 bg-zinc-950 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Photo Uploaded</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate max-w-xs font-mono">
                        {photoUrl}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPhotoUrl("")}
                      className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <React.Suspense
                      fallback={
                        <Button
                          type="button"
                          variant="outline"
                          disabled
                          className="h-10 border-dashed border-white/20 bg-white/[0.02] text-xs text-zinc-400 flex items-center justify-center gap-2"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Initializing Uploader...</span>
                        </Button>
                      }
                    >
                      <CldUploadWidget
                        signatureEndpoint="/api/cloudinary/sign"
                        config={{
                          cloud: {
                            cloudName:
                              process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                              "yoqifwb9",
                            apiKey:
                              process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
                              "171588185773459",
                          },
                        }}
                        options={{
                          sources: ["local", "url", "camera"],
                          multiple: false,
                          folder: "rsf_committee",
                          resourceType: "image",
                          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                          maxFileSize: 5000000,
                        }}
                        onSuccess={(result) => {
                          if (
                            typeof result.info === "object" &&
                            result.info &&
                            "secure_url" in result.info
                          ) {
                            setPhotoUrl(result.info.secure_url as string);
                            toast.success("Member photo uploaded successfully!");
                          }
                        }}
                        onError={(err) => {
                          console.error("Cloudinary Upload Error:", err);
                          toast.error("Failed to upload photo to Cloudinary.");
                        }}
                      >
                        {({ open }) => (
                          <Button
                            type="button"
                            onClick={() => open()}
                            variant="outline"
                            className="h-10 border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/50 text-xs text-zinc-300 flex items-center justify-center gap-2 flex-1"
                          >
                            <UploadCloud className="w-4 h-4 text-emerald-400" />
                            <span>Upload Avatar to Cloudinary</span>
                          </Button>
                        )}
                      </CldUploadWidget>
                    </React.Suspense>

                    <div className="flex-1">
                      <Input
                        placeholder="Or paste external/local image URL"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-xs h-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quote / Statement */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-300">
              Inspiring Quote or Statement <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              rows={3}
              placeholder="e.g. Dedicated to fostering student unity, academic excellence, and humanitarian service for the students of Rangunia."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-emerald-500 text-xs resize-none"
            />
            <p className="text-[10px] text-zinc-500">
              This quote is featured prominently on the public committee showcase card.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs min-w-[140px] shadow-md shadow-emerald-950 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : mode === "create" ? (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Appoint Member</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
