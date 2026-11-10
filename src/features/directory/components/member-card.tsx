"use client";

import * as React from "react";
import { MaskedDirectoryMember } from "@/features/directory/types/directory.types";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Lock,
  Globe,
  Sparkles,
  Calendar,
  Building,
  Award,
  Compass,
  FileCheck,
} from "lucide-react";

interface MemberCardProps {
  member: MaskedDirectoryMember;
}

function formatBloodGroup(bg: string | null) {
  if (!bg) return null;
  const map: Record<string, string> = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };
  return map[bg] || bg;
}

export function MemberCard({ member }: MemberCardProps) {
  const formattedBlood = formatBloodGroup(member.bloodGroup);

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-[#07130f]/85 p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0a1a14]/90 hover:shadow-[0_12px_36px_rgba(16,185,129,0.12)] flex flex-col justify-between">
      {/* Top Section: Photo + Identity */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar / Photo */}
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-md">
            {member.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={member.fullName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-emerald-950/60 text-emerald-300 font-bold font-mono text-xl">
                <span>{member.fullName.charAt(0).toUpperCase()}</span>
                <span className="text-[9px] text-zinc-500 flex items-center gap-0.5 mt-0.5 font-sans">
                  <Lock className="w-2.5 h-2.5" />
                </span>
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-white text-base truncate group-hover:text-emerald-300 transition-colors">
                {member.fullName}
              </h3>
              <Badge
                variant="outline"
                className={
                  member.isAlumni
                    ? "border-teal-500/30 bg-teal-950/40 text-teal-300 text-[10px] font-medium"
                    : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px] font-medium"
                }
              >
                {member.isAlumni ? (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-2.5 h-2.5" /> Alumni
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-2.5 h-2.5" /> Student
                  </span>
                )}
              </Badge>
            </div>

            {/* Department & Batch / Session */}
            <p className="text-xs text-zinc-300 flex items-center gap-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{member.department}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="font-mono text-emerald-400">
                {member.batch ? `Batch ${member.batch}` : member.session}
              </span>
            </p>

            {/* Student ID */}
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              ID: {member.studentId}
            </p>
          </div>
        </div>

        {/* Alumni Specific Professional Callout */}
        {member.isAlumni && member.alumniProfile && (
          <div className="mb-4 p-2.5 rounded-xl border border-teal-500/20 bg-teal-950/20 text-xs text-teal-200">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                {member.alumniProfile.jobPosition || "Professional"}
                {member.alumniProfile.company ? ` at ${member.alumniProfile.company}` : ""}
              </span>
            </p>
            {member.alumniProfile.workLocation && (
              <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                <span>{member.alumniProfile.workLocation}</span>
              </p>
            )}
            {member.alumniProfile.mentorshipAvailable && (
              <div className="mt-1.5 pt-1.5 border-t border-teal-500/20 flex items-center gap-1 text-[10px] text-emerald-300 font-mono">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Available for Career Mentorship</span>
              </div>
            )}
          </div>
        )}

        {/* Student Specific Skills & Academic Tags */}
        {!member.isAlumni && member.studentProfile && (
          <div className="mb-4 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>Semester: {member.studentProfile.currentSemester}</span>
              </span>
              {member.studentProfile.cgpa && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <Award className="w-3 h-3 text-emerald-400" />
                    <span>CGPA: {member.studentProfile.cgpa}</span>
                  </span>
                </>
              )}
              {member.studentProfile.clubRole && (
                <>
                  <span className="text-zinc-600">•</span>
                  <Badge variant="outline" className="border-white/10 text-[10px] text-zinc-300">
                    {member.studentProfile.clubRole}
                  </Badge>
                </>
              )}
            </div>

            {/* Interested Sector */}
            {member.studentProfile.interestedSector && (
              <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Track: <span className="text-zinc-200">{member.studentProfile.interestedSector}</span></span>
              </p>
            )}

            {/* Skills chips */}
            {member.studentProfile.skills && member.studentProfile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {member.studentProfile.skills.slice(0, 4).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/5 bg-white/[0.03] text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
                {member.studentProfile.skills.length > 4 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 text-zinc-500">
                    +{member.studentProfile.skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Student PDF CV Button */}
            {member.studentProfile.cvUrl && (
              <div className="pt-1">
                <a
                  href={member.studentProfile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View CV (PDF)</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Bio if provided */}
        {member.bio && (
          <p className="text-xs text-zinc-400 line-clamp-2 italic mb-4 leading-relaxed">
            &ldquo;{member.bio}&rdquo;
          </p>
        )}
      </div>

      {/* Bottom Section: Privacy-Masked Contact Info & Badges */}
      <div className="pt-3 border-t border-white/5 space-y-2.5 text-xs">
        {/* Addresses and Blood Group */}
        <div className="space-y-1.5 text-[11px]">
          {/* Blood Group */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Droplet className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
              </div>
              <span className="font-semibold text-rose-300 font-mono">
                {formattedBlood || "Unlisted"}
              </span>
            </div>

            {/* Permanent Address / Origin */}
            <div className="flex items-center gap-1 text-zinc-400 truncate max-w-[170px]" title={member.permanentAddress || "Masked"}>
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              {member.permanentAddress ? (
                <span className="truncate">{member.permanentAddress}</span>
              ) : (
                <span className="text-zinc-600 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Private
                </span>
              )}
            </div>
          </div>

          {/* Present Address (if unmasked) */}
          {member.presentAddress && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 truncate pt-0.5 border-t border-white/5">
              <span className="text-zinc-500 shrink-0">Present:</span>
              <span className="truncate text-zinc-300" title={member.presentAddress}>
                {member.presentAddress}
              </span>
            </div>
          )}
        </div>

        {/* Contact Links Bar (Strict Server Masked) */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
          {/* Phone */}
          <div className="flex items-center gap-1 truncate">
            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
            {member.phone ? (
              <a
                href={`tel:${member.phone}`}
                className="hover:text-emerald-300 text-zinc-200 font-mono truncate"
              >
                {member.phone}
              </a>
            ) : (
              <span className="text-zinc-600 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Hidden
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="hover:text-emerald-300 text-zinc-200 truncate"
                title={member.email}
              >
                {member.email}
              </a>
            ) : (
              <span className="text-zinc-600 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Hidden
              </span>
            )}
          </div>
        </div>

        {/* Social Links if unmasked */}
        {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[10px] text-zinc-500 font-mono">Social:</span>
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                title="LinkedIn"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {member.socialLinks.facebook && (
              <a
                href={member.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                title="Facebook"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                title="GitHub"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
