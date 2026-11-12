"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  PlusCircle,
  Edit3,
  X,
  UploadCloud,
  Activity,
  Star,
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
  createActivityAction,
  updateActivityAction,
} from "../actions/activity-actions";

export interface ActivityFormData {
  id?: string;
  title: string;
  date: Date | string;
  time: string;
  location: string;
  photos: string[];
  description: string;
}

interface ActivityFormDialogProps {
  mode?: "create" | "edit";
  initialData?: ActivityFormData;
  triggerButton?: React.ReactElement;
  onSuccess?: () => void;
}

export function ActivityFormDialog({
  mode = "create",
  initialData,
  triggerButton,
  onSuccess,
}: ActivityFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formatDateForInput = (d?: Date | string) => {
    if (!d) return new Date().toISOString().split("T")[0];
    const dateObj = new Date(d);
    return !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  };

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [date, setDate] = React.useState(formatDateForInput(initialData?.date));
  const [time, setTime] = React.useState(initialData?.time || "");
  const [location, setLocation] = React.useState(initialData?.location || "");
  const [photos, setPhotos] = React.useState<string[]>(initialData?.photos || []);
  const [description, setDescription] = React.useState(initialData?.description || "");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDate(formatDateForInput(initialData.date));
        setTime(initialData.time);
        setLocation(initialData.location);
        setPhotos(initialData.photos || []);
        setDescription(initialData.description);
      } else if (mode === "create") {
        setTitle("");
        setDate(new Date().toISOString().split("T")[0]);
        setTime("");
        setLocation("");
        setPhotos([]);
        setDescription("");
      }
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Activity title is required.");
      return;
    }
    if (!time.trim()) {
      toast.error("Activity time is required.");
      return;
    }
    if (!location.trim()) {
      toast.error("Activity location is required.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast.error("Activity description must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        date: new Date(date),
        time: time.trim(),
        location: location.trim(),
        photos,
        description: description.trim(),
      };

      if (mode === "edit" && initialData?.id) {
        const res = await updateActivityAction(initialData.id, payload);
        if (res.success) {
          toast.success(res.message || "Activity updated successfully!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to update activity.");
        }
      } else {
        const res = await createActivityAction(payload);
        if (res.success) {
          toast.success(res.message || "Activity published successfully!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to create activity.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving activity.");
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
                  <span>Create Activity</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Activity</span>
                </>
              )}
            </Button>
          )
        }
      />

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#07130f] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>{mode === "create" ? "Document New Forum Activity" : "Edit Activity"}</span>
          </DialogTitle>
          <p className="text-xs text-zinc-400">
            {mode === "create"
              ? "Publish social initiatives, workshops, volunteer drives, or relief activities."
              : "Update activity details, schedule, location, or photo gallery."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="activity-title" className="text-xs font-semibold text-zinc-300">
              Activity Title <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="activity-title"
              placeholder="e.g. Winter Clothes Distribution in Rangunia & Betagi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-sm"
              required
            />
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity-date" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Date</span> <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="activity-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-white/10 bg-white/5 text-white focus-visible:border-emerald-500 text-xs [color-scheme:dark]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-time" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Time Span</span> <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="activity-time"
                placeholder="e.g. 10:00 AM - 3:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-location" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Location</span> <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="activity-location"
                placeholder="e.g. Rangunia College Premises"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Multiple Photos Upload (Cloudinary) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-300">
                Activity Photos &amp; Highlights ({photos.length} uploaded)
              </Label>
              <span className="text-[10px] text-zinc-400">
                First photo acts as the primary cover
              </span>
            </div>

            {/* Cloudinary Multi-Photo Widget */}
            <React.Suspense
              fallback={
                <div className="h-20 w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
              }
            >
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign"
                options={{
                  multiple: true,
                  maxFiles: 10,
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
                    const newUrl = result.info.secure_url;
                    setPhotos((prev) => {
                      if (!prev.includes(newUrl)) {
                        return [...prev, newUrl];
                      }
                      return prev;
                    });
                    toast.success("Photo added to activity gallery!");
                  }
                }}
              >
                {({ open }) => (
                  <div
                    onClick={() => open?.()}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                          Upload Activity Photos
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Select one or multiple photos (PNG, JPG, WebP up to 5MB each)
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-white/10 bg-white/5 text-zinc-300 pointer-events-none group-hover:border-emerald-500/40"
                    >
                      Add Photos
                    </Button>
                  </div>
                )}
              </CldUploadWidget>
            </React.Suspense>

            {/* Photo Grid Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-zinc-950 group shadow-md"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Activity Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge for index 0 */}
                    {idx === 0 && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-500 text-black font-semibold text-[9px] flex items-center gap-0.5 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        <span>Cover</span>
                      </div>
                    )}

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="activity-description" className="text-xs font-semibold text-zinc-300">
              Activity Description &amp; Impact <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="activity-description"
              rows={6}
              placeholder="Describe what occurred, beneficiaries reached, volunteer involvement, and community impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs resize-y"
              required
            />
          </div>

          {/* Action Buttons */}
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
                <span>{mode === "create" ? "Publish Activity" : "Save Changes"}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
