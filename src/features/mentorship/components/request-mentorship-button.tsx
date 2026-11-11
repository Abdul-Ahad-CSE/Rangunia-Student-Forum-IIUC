"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Clock, CheckCircle2, Send, Loader2, UserCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { requestMentorshipAction } from "../actions/mentorship-actions";

interface RequestMentorshipButtonProps {
  alumniId: string;
  alumniName: string;
  isLoggedIn: boolean;
  isStudent: boolean;
  isSelf: boolean;
  existingStatus: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | null;
}

export function RequestMentorshipButton({
  alumniId,
  alumniName,
  isLoggedIn,
  isStudent,
  isSelf,
  existingStatus,
}: RequestMentorshipButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // If this is the logged-in user viewing their own profile
  if (isSelf) {
    return null;
  }

  // Not logged in: route to login
  if (!isLoggedIn) {
    return (
      <Link href={`/login?callbackUrl=/directory/${alumniId}`}>
        <Button
          variant="outline"
          className="border-teal-500/30 bg-teal-950/20 text-teal-300 hover:bg-teal-950/50 hover:text-white text-xs font-medium gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Log in to Request Mentorship</span>
        </Button>
      </Link>
    );
  }

  // If logged in as an alumni or admin (not student)
  if (!isStudent) {
    return null;
  }

  // Existing PENDING request
  if (existingStatus === "PENDING") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-medium">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Mentorship Requested</span>
      </div>
    );
  }

  // Existing ACTIVE session
  if (existingStatus === "ACTIVE") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Active Mentorship Partner</span>
      </div>
    );
  }

  // Eligible to request (None, REJECTED, or COMPLETED previous session)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await requestMentorshipAction({
        alumniId,
        notes,
      });

      if (res.success) {
        toast.success(res.message || "Mentorship request sent successfully!");
        setOpen(false);
        setNotes("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while sending your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold gap-1.5 shadow-md shadow-teal-950/50 transition-all hover:scale-[1.02]" />
        }
      >
        <Sparkles className="w-3.5 h-3.5 text-teal-200" />
        <span>Request Mentorship</span>
      </DialogTrigger>

      <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-400" />
            <span>Request Mentorship from {alumniName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 leading-relaxed pt-1">
            Connect with this alumni for academic guidance, career roadmap advice, or postgraduate preparation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>What specific guidance are you seeking?</span>
            </Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="e.g. Seeking advice regarding postgraduate applications in Europe, CV review for software roles, or thesis research guidance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500 text-xs resize-none"
            />
            <p className="text-[11px] text-zinc-500">
              Your student profile information will be shared with the mentor for their review.
            </p>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold gap-1.5 shadow-md shadow-teal-950/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
