"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Camera,
  X,
  UploadCloud,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateEventRecapAction } from "../actions/event-actions";

interface EventRecapDialogProps {
  eventId: string;
  eventTitle: string;
  initialRecap?: string | null;
  initialPhotos?: string[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EventRecapDialog({
  eventId,
  eventTitle,
  initialRecap,
  initialPhotos = [],
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: EventRecapDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;

  const [recap, setRecap] = React.useState(initialRecap || "");
  const [photos, setPhotos] = React.useState<string[]>(initialPhotos || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setRecap(initialRecap || "");
    setPhotos(initialPhotos || []);
  }, [initialRecap, initialPhotos]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }
    setOpen(nextOpen);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not a supported image file.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 5MB file size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read "${file.name}".`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await updateEventRecapAction(eventId, {
        postEventRecap: recap,
        postEventPhotos: photos,
      });

      if (res.success) {
        toast.success(res.message || "Event recap & photos updated!");
        setOpen(false);
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to update recap.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving recap.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {trigger ? (
        <span onClick={() => handleOpenChange(true)} className="inline-block cursor-pointer">
          {trigger}
        </span>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenChange(true)}
          className="border-teal-500/30 bg-teal-950/20 text-teal-300 hover:bg-teal-950/40 text-xs font-medium gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Post-Event Recap</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>Post-Event Recap &amp; Gallery</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
                Document outcomes, attendance highlights, key moments, and upload official gallery photos for &ldquo;{eventTitle}&rdquo;.
              </DialogDescription>
            </DialogHeader>

            {/* Recap Text */}
            <div className="space-y-1.5">
              <Label htmlFor="post-event-recap" className="text-xs font-medium text-zinc-200">
                Event Summary &amp; Outcomes
              </Label>
              <Textarea
                id="post-event-recap"
                value={recap}
                onChange={(e) => setRecap(e.target.value)}
                placeholder="Share how the event went, notable guests, community participation, and forum accomplishments..."
                rows={5}
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs focus-visible:border-teal-500 rounded-xl leading-relaxed"
              />
            </div>

            {/* Gallery Photos Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-teal-400" />
                  <span>Event Photo Gallery ({photos.length})</span>
                </Label>
                {photos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPhotos([])}
                    className="text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    Clear all photos
                  </button>
                )}
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center h-24 w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal-500/40 cursor-pointer transition-all">
                <div className="flex items-center gap-2 text-center p-3">
                  <UploadCloud className="w-5 h-5 text-teal-400" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-zinc-200">
                      Upload recap photos (select multiple)
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      PNG, JPG, WebP up to 5MB each
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {/* Photo Thumbnails Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/60 group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Recap photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-950/80 text-zinc-300 hover:text-rose-300 border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Recap...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Recap &amp; Gallery</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
