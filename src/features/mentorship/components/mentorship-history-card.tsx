"use client";

import * as React from "react";
import Link from "next/link";
import { History, Calendar, ExternalLink, CheckCircle2, Quote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMentorshipDuration } from "../lib/format-duration";
import { MentorshipCommentDialog } from "./mentorship-comment-dialog";

export interface CompletedSessionItem {
  id: string;
  startedAt: Date | string | null;
  endedAt: Date | string | null;
  createdAt: Date | string;
  studentComment?: string | null;
  alumniComment?: string | null;
  student: {
    id: string;
    fullName: string;
    department: string;
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

interface MentorshipHistoryCardProps {
  sessions: CompletedSessionItem[];
  isAlumni: boolean;
}

export function MentorshipHistoryCard({ sessions, isAlumni }: MentorshipHistoryCardProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl">
      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Mentorship History</span>
            <Badge variant="outline" className="border-white/10 text-zinc-400 font-mono text-[10px]">
              {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"}
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400 pt-0.5">
            Record of completed mentorship engagements and collaborative partnerships.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {sessions.map((sess) => {
          const partnerName = isAlumni ? sess.student.fullName : sess.alumni.fullName;
          const partnerId = isAlumni ? sess.student.id : sess.alumni.id;
          const partnerPhoto = isAlumni ? sess.student.photoUrl : sess.alumni.photoUrl;
          const partnerDept = isAlumni ? sess.student.department : sess.alumni.department;

          const durationText = formatMentorshipDuration(sess.startedAt || sess.createdAt, sess.endedAt);

          const formattedRange = sess.startedAt && sess.endedAt
            ? `${new Date(sess.startedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })} — ${new Date(sess.endedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
            : "Completed";

          return (
            <div
              key={sess.id}
              className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0 flex items-center justify-center text-zinc-300 font-bold font-mono text-xs">
                    {partnerPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={partnerPhoto} alt={partnerName} className="w-full h-full object-cover" />
                    ) : (
                      partnerName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">
                        {isAlumni ? "Mentored" : "Mentored by"}
                      </span>
                      <Link
                        href={`/directory/${partnerId}`}
                        className="font-semibold text-white hover:text-emerald-300 transition-colors flex items-center gap-1 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="truncate">{partnerName}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                      </Link>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 text-[11px]">{partnerDept}</span>
                    </div>

                    <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedRange}</span>
                    </p>
                  </div>
                </div>

                {/* Formatted Duration Badge & Leave/Edit Feedback Action */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 font-mono text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{durationText}</span>
                  </span>

                  <MentorshipCommentDialog
                    sessionId={sess.id}
                    partnerName={partnerName}
                    isAlumni={isAlumni}
                    currentComment={isAlumni ? sess.alumniComment : sess.studentComment}
                  />
                </div>
              </div>

              {/* Render Public Testimonials & Feedback */}
              {(sess.alumniComment || sess.studentComment) && (
                <div className="mt-1 pt-2.5 border-t border-white/5 space-y-2 text-xs">
                  {sess.alumniComment && (
                    <div className="p-2.5 rounded-lg border border-teal-500/15 bg-teal-950/20 space-y-1">
                      <span className="text-[10px] text-teal-400 font-mono flex items-center gap-1 uppercase tracking-wide">
                        <Quote className="w-3 h-3 text-teal-400" />
                        <span>Alumni Mentorship Note ({sess.alumni.fullName})</span>
                      </span>
                      <p className="text-zinc-200 text-xs italic leading-relaxed">
                        &ldquo;{sess.alumniComment}&rdquo;
                      </p>
                    </div>
                  )}

                  {sess.studentComment && (
                    <div className="p-2.5 rounded-lg border border-emerald-500/15 bg-emerald-950/20 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 uppercase tracking-wide">
                        <Quote className="w-3 h-3 text-emerald-400" />
                        <span>Student Experience Note ({sess.student.fullName})</span>
                      </span>
                      <p className="text-zinc-200 text-xs italic leading-relaxed">
                        &ldquo;{sess.studentComment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
