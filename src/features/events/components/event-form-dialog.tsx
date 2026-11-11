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
  CheckCircle2,
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createEventAction, updateEventAction } from "../actions/event-actions";

export interface EventFormData {
  id?: string;
  title: string;
  bannerUrl?: string | null;
  eventDate: string | Date;
  eventTime: string;
  venue: string;
  registrationDeadline: string | Date;
  description: string;
}

interface EventFormDialogProps {
  initialData?: EventFormData;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EventFormDialog({
  initialData,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: EventFormDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;

  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(initialData?.bannerUrl || null);
  const [eventDate, setEventDate] = React.useState(
    initialData?.eventDate
      ? new Date(initialData.eventDate).toISOString().split("T")[0]
      : ""
  );
  const [eventTime, setEventTime] = React.useState(initialData?.eventTime || "");
  const [venue, setVenue] = React.useState(initialData?.venue || "");
  const [registrationDeadline, setRegistrationDeadline] = React.useState(
    initialData?.registrationDeadline
      ? new Date(initialData.registrationDeadline).toISOString().slice(0, 16)
      : ""
  );
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync state if initialData changes
  const resetForm = React.useCallback(() => {
    setTitle(initialData?.title || "");
    setBannerUrl(initialData?.bannerUrl || null);
    setEventDate(
      initialData?.eventDate
        ? new Date(initialData.eventDate).toISOString().split("T")[0]
        : ""
    );
    setEventTime(initialData?.eventTime || "");
    setVenue(initialData?.venue || "");
    setRegistrationDeadline(
      initialData?.registrationDeadline
        ? new Date(initialData.registrationDeadline).toISOString().slice(0, 16)
        : ""
    );
    setDescription(initialData?.description || "");
  }, [initialData]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }
    setOpen(nextOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBannerUrl(event.target?.result as string);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide an event title.");
      return;
    }
    if (!eventDate) {
      toast.error("Please specify the event date.");
      return;
    }
    if (!eventTime.trim()) {
      toast.error("Please specify the event time.");
      return;
    }
    if (!venue.trim()) {
      toast.error("Please specify the event venue.");
      return;
    }
    if (!registrationDeadline) {
      toast.error("Please specify the registration deadline.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please write an event description.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        const res = await updateEventAction(initialData.id, {
          title: title.trim(),
          bannerUrl,
          eventDate: new Date(eventDate),
          eventTime: eventTime.trim(),
          venue: venue.trim(),
          registrationDeadline: new Date(registrationDeadline),
          description: description.trim(),
        });

        if (res.success) {
          toast.success(res.message || "Event updated successfully!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to update event.");
        }
      } else {
        const res = await createEventAction({
          title: title.trim(),
          bannerUrl,
          eventDate: new Date(eventDate),
          eventTime: eventTime.trim(),
          venue: venue.trim(),
          registrationDeadline: new Date(registrationDeadline),
          description: description.trim(),
          postEventPhotos: [],
        });

        if (res.success) {
          toast.success(res.message || "Event created successfully!");
          setOpen(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.error || "Failed to create event.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving the event.");
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
          onClick={() => handleOpenChange(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-md shadow-emerald-950 flex items-center gap-1.5"
        >
          {isEditing ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{isEditing ? "Edit Event" : "Create New Event"}</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>{isEditing ? "Edit Event Details" : "Create Forum Event"}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
                Configure event dates, venue location, registration deadline, and promotional banner.
              </DialogDescription>
            </DialogHeader>

            {/* Event Title */}
            <div className="space-y-1.5">
              <Label htmlFor="event-title" className="text-xs font-medium text-zinc-200">
                Event Title *
              </Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Iftar & Grand Reunion 2026"
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs sm:text-sm focus-visible:border-emerald-500 rounded-xl"
                required
              />
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-200 flex items-center justify-between">
                <span>Event Banner Image (Optional)</span>
                {bannerUrl && (
                  <button
                    type="button"
                    onClick={() => setBannerUrl(null)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove banner</span>
                  </button>
                )}
              </Label>

              {bannerUrl ? (
                <div className="relative h-40 w-full rounded-xl overflow-hidden border border-emerald-500/30 bg-black/60 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerUrl}
                    alt="Event banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-md">
                      <span>Change Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 cursor-pointer transition-all">
                  <div className="flex flex-col items-center justify-center space-y-1.5 text-center p-4">
                    <UploadCloud className="w-7 h-7 text-emerald-400 mb-1" />
                    <p className="text-xs font-medium text-zinc-300">
                      Upload high-resolution event banner
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      PNG, JPG, or WebP up to 5MB (16:9 recommended)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* Date, Time, Venue Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event Date */}
              <div className="space-y-1.5">
                <Label htmlFor="event-date" className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Event Date *</span>
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-black/40 border-white/10 text-white text-xs focus-visible:border-emerald-500 rounded-xl"
                  required
                />
              </div>

              {/* Event Time */}
              <div className="space-y-1.5">
                <Label htmlFor="event-time" className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Event Time *</span>
                </Label>
                <Input
                  id="event-time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 3:30 PM - 7:00 PM"
                  className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs focus-visible:border-emerald-500 rounded-xl"
                  required
                />
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <Label htmlFor="event-venue" className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Venue Location *</span>
                </Label>
                <Input
                  id="event-venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. IIUC Central Auditorium, Kumira"
                  className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs focus-visible:border-emerald-500 rounded-xl"
                  required
                />
              </div>

              {/* Registration Deadline */}
              <div className="space-y-1.5">
                <Label htmlFor="registration-deadline" className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Registration Deadline *</span>
                </Label>
                <Input
                  id="registration-deadline"
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="bg-black/40 border-white/10 text-white text-xs focus-visible:border-emerald-500 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="event-description" className="text-xs font-medium text-zinc-200">
                Detailed Description &amp; Schedule *
              </Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose, agenda, guest speakers, dress code, and participation guidelines..."
                rows={5}
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs focus-visible:border-emerald-500 rounded-xl leading-relaxed"
                required
              />
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Event...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isEditing ? "Update Event" : "Publish Event"}</span>
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
