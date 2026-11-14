"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Loader2,
  PlusCircle,
  Edit3,
  X,
  UploadCloud,
  CheckCircle2,
  FileText,
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
import { createNoticeAction, updateNoticeAction } from "../actions/notice-actions";

export interface NoticeFormData {
  id?: string;
  title: string;
  date: Date | string;
  bannerUrl?: string | null;
  content: string;
}

interface NoticeFormDialogProps {
  mode?: "create" | "edit";
  initialData?: NoticeFormData;
  triggerButton?: React.ReactElement;
  onSuccess?: () => void;
}

export function NoticeFormDialog({
  mode = "create",
  initialData,
  triggerButton,
  onSuccess,
}: NoticeFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Helper: Format Date for <input type="date"> (YYYY-MM-DD)
  const formatDateForInput = (d?: Date | string) => {
    if (!d) return new Date().toISOString().split("T")[0];
    const dateObj = new Date(d);
    return !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  };

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [date, setDate] = React.useState(formatDateForInput(initialData?.date));
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(initialData?.bannerUrl || null);
  const [content, setContent] = React.useState(initialData?.content || "");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDate(formatDateForInput(initialData.date));
        setBannerUrl(initialData.bannerUrl || null);
        setContent(initialData.content);
      } else if (mode === "create") {
        setTitle("");
        setDate(new Date().toISOString().split("T")[0]);
        setBannerUrl(null);
        setContent("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Notice title is required.");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      toast.error("Notice content must be at least 10 characters.");
      return;
    }
    if (!date) {
      toast.error("Please specify a publication date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        date: new Date(date),
        bannerUrl: bannerUrl || null,
        content: content.trim(),
      };

      if (mode === "edit" && initialData?.id) {
        const res = await updateNoticeAction(initialData.id, payload);
        if (res.success) {
          toast.success(res.message || "Notice updated!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to update notice.");
        }
      } else {
        const res = await createNoticeAction(payload);
        if (res.success) {
          toast.success(res.message || "Notice published!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to create notice.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving notice.");
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
                  <span>Publish Notice</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Notice</span>
                </>
              )}
            </Button>
          )
        }
      />

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#07130f] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>{mode === "create" ? "Publish Official Notice" : "Edit Notice"}</span>
          </DialogTitle>
          <p className="text-xs text-zinc-400">
            {mode === "create"
              ? "Broadcast an announcement, academic update, or forum circular."
              : "Update notice details, publication date, or banner image."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="notice-title" className="text-xs font-semibold text-zinc-300">
              Notice Title <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="notice-title"
              placeholder="e.g. Schedule for Annual General Meeting & Iftar Mahfil 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-sm"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="notice-date" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Publication Date</span> <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="notice-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-white/10 bg-white/5 text-white focus-visible:border-emerald-500 text-xs [color-scheme:dark]"
              required
            />
          </div>

          {/* Banner Photo (Cloudinary) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Notice Banner / Circular Image</span>
              <span className="text-[10px] text-zinc-400 font-normal">Optional</span>
            </Label>

            {bannerUrl ? (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-emerald-500/30 bg-zinc-950 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setBannerUrl(null)}
                    className="text-xs h-8 px-3"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Remove Banner</span>
                  </Button>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Stored</span>
                </div>
              </div>
            ) : (
              <React.Suspense
                fallback={
                  <div className="h-28 w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
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
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                    maxFileSize: 5 * 1024 * 1024,
                  }}
                  onSuccess={(result) => {
                    if (
                      result.info &&
                      typeof result.info === "object" &&
                      "secure_url" in result.info
                    ) {
                      setBannerUrl(result.info.secure_url);
                      toast.success("Banner photo uploaded to cloud successfully!");
                    }
                  }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open?.()}
                      className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all cursor-pointer group text-center space-y-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                          Upload Notice Banner / Circular
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          PNG, JPG, WebP up to 5MB (Signed Cloudinary Storage)
                        </p>
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              </React.Suspense>
            )}
          </div>

          {/* Notice Content */}
          <div className="space-y-2">
            <Label htmlFor="notice-content" className="text-xs font-semibold text-zinc-300">
              Notice Content / Full Statement <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="notice-content"
              rows={6}
              placeholder="Write the full announcement, guidelines, instructions, or meeting agenda..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs resize-y"
              required
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              className="border-white/10 text-zinc-300 hover:text-white text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{mode === "create" ? "Publish Notice" : "Save Changes"}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
