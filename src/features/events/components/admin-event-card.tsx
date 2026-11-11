"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit3,
  Trash2,
  Camera,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { EventFormDialog } from "./event-form-dialog";
import { EventRecapDialog } from "./event-recap-dialog";
import { deleteEventAction } from "../actions/event-actions";

export interface AdminEventData {
  id: string;
  title: string;
  bannerUrl: string | null;
  eventDate: Date | string;
  eventTime: string;
  venue: string;
  registrationDeadline: Date | string;
  description: string;
  postEventRecap: string | null;
  postEventPhotos: string[];
  _count?: {
    registrations: number;
  };
}

interface AdminEventCardProps {
  event: AdminEventData;
}

export function AdminEventCard({ event }: AdminEventCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const eDate = new Date(event.eventDate);
  const rDeadline = new Date(event.registrationDeadline);
  const now = new Date();
  const isCompleted = now > eDate;
  const isRegistrationOpen = now <= rDeadline;

  const formattedDate = eDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedDeadline = rDeadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteEventAction(event.id);
      if (res.success) {
        toast.success(res.message || "Event deleted.");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete event.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between overflow-hidden">
        <div>
          {/* Banner */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
            {event.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-[#07130f] flex flex-col items-center justify-center p-6 text-center">
                <Calendar className="w-8 h-8 text-emerald-400/60 mb-1" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  Event Program
                </span>
              </div>
            )}

            {/* Badges on Banner */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                <Users className="w-3 h-3 mr-1 text-emerald-400" />
                {event._count?.registrations ?? 0} Registered
              </Badge>
            </div>

            <div className="absolute top-3 right-3">
              {isCompleted ? (
                <Badge variant="outline" className="border-white/10 bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-mono">
                  Concluded
                </Badge>
              ) : isRegistrationOpen ? (
                <Badge className="bg-emerald-500/90 text-black font-semibold text-[10px]">
                  Open
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500/40 bg-amber-950/70 text-amber-300 text-[10px] font-mono">
                  Closed
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-5 space-y-3.5">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white line-clamp-2">
                {event.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-medium text-white">{formattedDate}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{event.eventTime}</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Deadline: {formattedDeadline}</span>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-5 pt-0 border-t border-white/5 space-y-2 mt-2">
          <div className="grid grid-cols-2 gap-2 pt-3">
            {/* View Registrations Detail Page */}
            <Link href={`/admin/events/${event.id}`} className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs font-medium gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Registrations</span>
              </Button>
            </Link>

            {/* Public Preview */}
            <Link href={`/events/${event.id}`} target="_blank" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-medium gap-1.5"
              >
                <span>Live Page</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-1">
              {/* Edit Event Form Dialog */}
              <EventFormDialog
                initialData={{
                  id: event.id,
                  title: event.title,
                  bannerUrl: event.bannerUrl,
                  eventDate: event.eventDate,
                  eventTime: event.eventTime,
                  venue: event.venue,
                  registrationDeadline: event.registrationDeadline,
                  description: event.description,
                }}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-white hover:bg-white/5 h-8 px-2 gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Edit</span>
                  </Button>
                }
              />

              {/* Post Event Recap Dialog */}
              <EventRecapDialog
                eventId={event.id}
                eventTitle={event.title}
                initialRecap={event.postEventRecap}
                initialPhotos={event.postEventPhotos}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-teal-400 hover:text-teal-300 hover:bg-teal-950/20 h-8 px-2 gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Recap</span>
                  </Button>
                }
              />
            </div>

            {/* Delete Event Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-8 px-2"
              title="Delete Event"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Delete &ldquo;{event.title}&rdquo;?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
              Are you sure you want to permanently delete this event? All member registration records for this event will also be removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Confirm Delete</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
