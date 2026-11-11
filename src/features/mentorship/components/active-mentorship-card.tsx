"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Calendar, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { endMentorshipSessionAction } from "../actions/mentorship-actions";

export interface ActiveSessionItem {
  id: string;
  startedAt: Date | string | null;
  student: {
    id: string;
    fullName: string;
    department: string;
    session: string;
    photoUrl: string | null;
  };
  alumni: {
    id: string;
    fullName: string;
    department: string;
    photoUrl: string | null;
    alumniProfile?: {
      jobPosition: string | null;
      company: string | null;
    } | null;
  };
}

interface ActiveMentorshipCardProps {
  sessions: ActiveSessionItem[];
  isAlumni: boolean;
}

export function ActiveMentorshipCard({ sessions, isAlumni }: ActiveMentorshipCardProps) {
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);
  const [isEnding, setIsEnding] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (sessions.length === 0) {
    return null;
  }

  const handleEndSession = async () => {
    if (!selectedSessionId) return;
    setIsEnding(true);

    try {
      const res = await endMentorshipSessionAction(selectedSessionId);
      if (res.success) {
        toast.success(res.message || "Mentorship session concluded.");
        setDialogOpen(false);
        setSelectedSessionId(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to end session.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while ending the session.");
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <>
      <Card className="border border-teal-500/30 bg-[#07130f]/90 backdrop-blur-xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-teal-500/10 blur-3xl pointer-events-none" />

        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{isAlumni ? "Active Mentoring Engagements" : "Active Mentorship Program"}</span>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 font-mono text-[10px]">
                Active ({sessions.length})
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 pt-0.5">
              {isAlumni
                ? "Students you are currently mentoring and advising in their academic/professional journey."
                : "Your official forum mentorship partnership."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {sessions.map((sess) => {
            const partnerName = isAlumni ? sess.student.fullName : sess.alumni.fullName;
            const partnerId = isAlumni ? sess.student.id : sess.alumni.id;
            const partnerPhoto = isAlumni ? sess.student.photoUrl : sess.alumni.photoUrl;
            const partnerDept = isAlumni ? sess.student.department : sess.alumni.department;

            const startedDate = sess.startedAt
              ? new Date(sess.startedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Active";

            return (
              <div
                key={sess.id}
                className="p-4 rounded-xl border border-teal-500/20 bg-teal-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Partner Avatar */}
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-teal-500/30 bg-zinc-900 shrink-0 flex items-center justify-center text-teal-300 font-bold font-mono text-base">
                    {partnerPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={partnerPhoto} alt={partnerName} className="w-full h-full object-cover" />
                    ) : (
                      partnerName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] text-teal-400 font-mono uppercase tracking-wider">
                        {isAlumni ? "Currently Mentoring" : "Mentored by"}
                      </p>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>Started {startedDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/directory/${partnerId}`}
                        className="font-bold text-white text-sm sm:text-base hover:text-teal-300 transition-colors flex items-center gap-1 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="truncate">{partnerName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-teal-400 shrink-0" />
                      </Link>

                      <Badge variant="outline" className="border-white/10 text-zinc-300 text-[10px]">
                        {partnerDept}
                      </Badge>
                    </div>

                    {!isAlumni && sess.alumni.alumniProfile?.jobPosition && (
                      <p className="text-xs text-zinc-400">
                        {sess.alumni.alumniProfile.jobPosition}
                        {sess.alumni.alumniProfile.company ? ` at ${sess.alumni.alumniProfile.company}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Politely Worded End Session Button */}
                <div className="w-full sm:w-auto shrink-0 flex justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSessionId(sess.id);
                      setDialogOpen(true);
                    }}
                    className="border-white/10 hover:border-amber-500/40 bg-white/5 hover:bg-amber-950/20 text-zinc-300 hover:text-amber-200 text-xs font-medium"
                  >
                    <span>End Mentorship Session</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border border-white/10 bg-[#07130f]/95 backdrop-blur-2xl text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Conclude Mentorship Session?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-300 leading-relaxed pt-1">
              Are you sure you would like to end this active mentorship engagement? This will mark the session as
              completed and record the full duration in both member mentorship histories.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isEnding}
              onClick={() => setDialogOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Keep Session Active
            </Button>
            <Button
              type="button"
              disabled={isEnding}
              onClick={handleEndSession}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold gap-1.5"
            >
              {isEnding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Concluding...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Log History</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
