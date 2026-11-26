"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Activity,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  AlertTriangle,
  Loader2,
  Camera,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ActivityFormDialog } from "./activity-form-dialog";
import { deleteActivityAction } from "../actions/activity-actions";

export interface ActivityItem {
  id: string;
  title: string;
  date: Date | string;
  time: string;
  location: string;
  photos: string[];
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface AdminActivitiesTableProps {
  activities: ActivityItem[];
}

export function AdminActivitiesTable({ activities }: AdminActivitiesTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<ActivityItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!searchTerm.trim()) return activities;
    const q = searchTerm.toLowerCase();
    return activities.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [activities, searchTerm]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteActivityAction(deleteTarget.id);
      if (res.success) {
        toast.success(res.message || "Activity deleted.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete activity.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while deleting activity.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search activities by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:border-emerald-500 h-9 shadow-xs"
          />
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono self-end sm:self-center">
          Showing <span className="text-zinc-900 dark:text-white font-bold">{filtered.length}</span> of{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activities.length}</span> activities
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
            <Activity className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No activities found</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {searchTerm
                ? "Try adjusting your search query."
                : "Record your first forum social or volunteer activity using the button above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-zinc-500 dark:text-zinc-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Photos</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {filtered.map((activity) => {
                  const pDate = new Date(activity.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const primaryPhoto = activity.photos?.[0] || null;

                  return (
                    <tr
                      key={activity.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Photo + Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 shrink-0">
                            {primaryPhoto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={primaryPhoto}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                                <Activity className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 dark:text-white truncate max-w-sm">
                              {activity.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-700 dark:text-zinc-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{pDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px]">
                            <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{activity.location}</span>
                        </div>
                      </td>

                      {/* Photos Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                          <Camera className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{activity.photos?.length || 0}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/activities/${activity.id}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                              title="View Public Activity"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          <ActivityFormDialog
                            mode="edit"
                            initialData={activity}
                            triggerButton={
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-500/40 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white shadow-xs"
                              >
                                Edit
                              </Button>
                            }
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(activity)}
                            className="h-7 px-2 text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md bg-white dark:bg-[#07130f] border border-destructive/20 dark:border-destructive/40 text-zinc-900 dark:text-white p-6 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Delete Activity Record?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-zinc-600 dark:text-zinc-300">
              Are you sure you want to permanently delete{" "}
              <strong className="text-zinc-900 dark:text-white">&ldquo;{deleteTarget?.title}&rdquo;</strong>?
              This will remove all associated highlights and photos from the public activities portal.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
