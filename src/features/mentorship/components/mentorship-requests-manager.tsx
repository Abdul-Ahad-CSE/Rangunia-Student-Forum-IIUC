"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, Clock, ExternalLink, Loader2, MessageSquare, UserCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { acceptMentorshipAction, declineMentorshipAction } from "../actions/mentorship-actions";

export interface PendingMentorshipRequest {
  id: string;
  studentId: string;
  notes: string | null;
  createdAt: Date | string;
  student: {
    id: string;
    fullName: string;
    studentId: string;
    department: string;
    session: string;
    photoUrl: string | null;
  };
}

interface MentorshipRequestsManagerProps {
  requests: PendingMentorshipRequest[];
}

export function MentorshipRequestsManager({ requests }: MentorshipRequestsManagerProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleAccept = async (id: string, studentName: string) => {
    setProcessingId(id);
    try {
      const res = await acceptMentorshipAction(id);
      if (res.success) {
        toast.success(`You are now mentoring ${studentName}!`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to accept request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while accepting the request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await declineMentorshipAction(id);
      if (res.success) {
        toast.info("Mentorship request declined.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to decline request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while declining the request.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-xl">
      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>Mentorship Requests</span>
            {requests.length > 0 && (
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 font-mono text-[10px] px-1.5 py-0">
                {requests.length} New
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400 pt-0.5">
            Review and respond to mentorship requests from university students.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {requests.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-xs">No pending mentorship requests at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const isBusy = processingId === req.id;
              const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Student Avatar */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shrink-0 flex items-center justify-center text-teal-300 font-bold font-mono text-sm">
                      {req.student.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={req.student.photoUrl}
                          alt={req.student.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        req.student.fullName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/directory/${req.student.id}`}
                          className="font-semibold text-white text-xs sm:text-sm hover:text-teal-300 transition-colors flex items-center gap-1 group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="truncate">{req.student.fullName}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-teal-400 shrink-0" />
                        </Link>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-[10px] font-normal"
                        >
                          {req.student.department}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span>Session: {req.student.session}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                      </p>

                      {req.notes && (
                        <div className="pt-1">
                          <p className="text-[11px] text-zinc-300 bg-black/30 p-2 rounded-lg border border-white/5 flex items-start gap-1.5 leading-relaxed">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span>&ldquo;{req.notes}&rdquo;</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accept / Decline Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleDecline(req.id)}
                      className="h-8 px-2.5 text-xs border border-white/10 bg-white/5 hover:bg-rose-950/30 hover:border-rose-500/30 hover:text-rose-300 text-zinc-300 transition-colors"
                    >
                      {isBusy ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                          <span>Decline</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => handleAccept(req.id, req.student.fullName)}
                      className="h-8 px-3 text-xs bg-teal-600 hover:bg-teal-500 text-white font-medium shadow-sm transition-all"
                    >
                      {isBusy ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" />
                          <span>Accept Request</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
