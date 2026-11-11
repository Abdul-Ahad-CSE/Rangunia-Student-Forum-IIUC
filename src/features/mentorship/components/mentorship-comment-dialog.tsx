"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Edit3, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { saveMentorshipCommentAction } from "../actions/mentorship-actions";

interface MentorshipCommentDialogProps {
  sessionId: string;
  partnerName: string;
  isAlumni: boolean;
  currentComment?: string | null;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerClassName?: string;
}

export function MentorshipCommentDialog({
  sessionId,
  partnerName,
  isAlumni,
  currentComment,
  triggerVariant = "outline",
  triggerClassName,
}: MentorshipCommentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [commentText, setCommentText] = React.useState(currentComment || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setCommentText(currentComment || "");
    }
    setOpen(isOpen);
  };

  const hasComment = Boolean(currentComment && currentComment.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await saveMentorshipCommentAction({
        sessionId,
        comment: commentText,
      });

      if (res.success) {
        toast.success(res.message || "Feedback saved successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save comment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size="sm"
        onClick={() => handleOpenChange(true)}
        className={
          triggerClassName ||
          "border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-emerald-950/20 text-zinc-300 hover:text-emerald-200 text-xs font-medium gap-1.5"
        }
      >
        {hasComment ? (
          <>
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Comment</span>
          </>
        ) : (
          <>
            <MessageSquarePlus className="w-3.5 h-3.5 text-teal-400" />
            <span>Leave a Comment</span>
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-emerald-400" />
                <span>{hasComment ? "Edit Mentorship Feedback" : "Mentorship Experience & Testimonial"}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
                {isAlumni
                  ? `Share your thoughts and feedback regarding mentoring ${partnerName}. This will be publicly showcased on both profile cards as an official testimonial.`
                  : `Share your thoughts on the guidance and assistance received from ${partnerName}. This will be publicly showcased on both profile cards as an official testimonial.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="mentorship-comment" className="text-xs font-medium text-zinc-300 block">
                Your Public Testimonial / Feedback
              </label>
              <Textarea
                id="mentorship-comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  isAlumni
                    ? `e.g., "${partnerName} showed exceptional dedication, quick learning, and completed their project roadmap ahead of schedule..."`
                    : `e.g., "${partnerName} provided invaluable career insights, CV review, and clear guidance for getting into tech..."`
                }
                rows={4}
                className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl"
              />
              <p className="text-[11px] text-zinc-500">
                You can write or edit this at any point. Clearing the text and saving will remove the comment.
              </p>
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Feedback</span>
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
