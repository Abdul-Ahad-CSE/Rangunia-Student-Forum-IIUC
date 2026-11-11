import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Footer } from "@/components/shared/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Building,
  Compass,
  FileCheck,
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Award,
  BookOpen,
} from "lucide-react";

interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { id } = await params;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: id },
        { studentId: { equals: id, mode: "insensitive" } },
      ],
      approvalStatus: "APPROVED",
      isActive: true,
    },
    select: { fullName: true, department: true },
  });

  if (!user) {
    return {
      title: "Member Not Found | Rangunia Students Forum (IIUC)",
    };
  }

  return {
    title: `${user.fullName} (${user.department}) | Rangunia Students Forum (IIUC)`,
    description: `Public member profile for ${user.fullName} on the Rangunia Students Forum (IIUC) directory platform.`,
  };
}

async function MemberProfileContent({ params }: PublicProfilePageProps) {
  const { id } = await params;

  // 1. Fetch member data strictly from Neon DB
  const rawUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: id },
        { studentId: { equals: id, mode: "insensitive" } },
      ],
      approvalStatus: "APPROVED",
      isActive: true,
    },
    include: {
      studentProfile: true,
      alumniProfile: true,
    },
  });

  if (!rawUser) {
    return (
      <div className="py-16 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-500 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Member Profile Not Found</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The requested member profile does not exist, has been made private, or is pending administrative approval.
          </p>
        </div>
        <Link href="/directory">
          <Button
            variant="outline"
            className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/50"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Directory</span>
          </Button>
        </Link>
      </div>
    );
  }

  // 2. CRITICAL SERVER-SIDE PRIVACY MASKING:
  // Mask sensitive attributes immediately before rendering
  const isAlumni = Boolean(rawUser.alumniProfile);
  const formattedBlood = formatBloodGroup(rawUser.bloodGroup);

  const member = {
    id: rawUser.id,
    fullName: rawUser.fullName,
    studentId: rawUser.studentId,
    department: rawUser.department,
    session: rawUser.session,
    batch: rawUser.batch,
    bloodGroup: rawUser.bloodGroup,
    gender: rawUser.gender,
    bio: rawUser.bio,
    isAlumni,

    // Strictly masked on server
    photoUrl: rawUser.isPhotoVisible ? rawUser.photoUrl : null,
    phone: rawUser.isPhoneVisible ? rawUser.phone : null,
    email: rawUser.isEmailVisible ? rawUser.email : null,
    permanentAddress: rawUser.isAddressVisible ? rawUser.permanentAddress : null,
    presentAddress: rawUser.isAddressVisible ? rawUser.presentAddress : null,
    socialLinks: rawUser.isSocialVisible
      ? (rawUser.socialLinks as Record<string, string> | null)
      : null,

    studentProfile: rawUser.studentProfile
      ? {
          currentSemester: rawUser.studentProfile.currentSemester,
          cgpa: rawUser.studentProfile.cgpa,
          skills: rawUser.studentProfile.skills,
          interestedSector: rawUser.studentProfile.interestedSector,
          clubRole: rawUser.studentProfile.clubRole,
          cvUrl: rawUser.studentProfile.cvUrl,
        }
      : null,

    alumniProfile: rawUser.alumniProfile
      ? {
          company: rawUser.alumniProfile.company,
          jobPosition: rawUser.alumniProfile.jobPosition,
          industry: rawUser.alumniProfile.industry,
          workLocation: rawUser.alumniProfile.workLocation,
          experienceYears: rawUser.alumniProfile.experienceYears,
          forumRole: rawUser.alumniProfile.forumRole,
          skills: rawUser.alumniProfile.skills,
          cgpa: rawUser.alumniProfile.cgpa,
          personalDetails: rawUser.alumniProfile.personalDetails,
          passingYear: rawUser.alumniProfile.passingYear,
          graduationYear: rawUser.alumniProfile.graduationYear,
          higherStudyUniversity: rawUser.alumniProfile.higherStudyUniversity,
          higherStudyCountry: rawUser.alumniProfile.higherStudyCountry,
          higherStudyDegree: rawUser.alumniProfile.higherStudyDegree,
          scholarshipInfo: rawUser.alumniProfile.scholarshipInfo,
          researchThesisTitle: rawUser.alumniProfile.researchThesisTitle,
          higherEducationDetails: rawUser.alumniProfile.higherEducationDetails,
          mentorshipAvailable: rawUser.alumniProfile.mentorshipAvailable,
        }
      : null,
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div>
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-300 transition-colors py-1 px-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* Top Identity Hero Card */}
      <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
        {/* Header Gradient */}
        <div className="h-28 bg-gradient-to-r from-emerald-950/90 via-emerald-900/40 to-teal-950/90 border-b border-white/5 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Sparkles className="w-3 h-3" />
                Verified Member
              </span>
            </Badge>
          </div>
        </div>

        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 mb-6">
            {/* Photo or Privacy Shield Avatar */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950 shadow-2xl shrink-0">
              {member.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photoUrl}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950/90 to-zinc-900 text-emerald-300">
                  <span className="text-2xl font-bold font-mono">
                    {member.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[9px] text-zinc-500 flex items-center gap-0.5 mt-0.5 font-sans">
                    <Lock className="w-2.5 h-2.5" /> Private
                  </span>
                </div>
              )}
            </div>

            {/* Name, Roles, and Department */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {member.fullName}
                </h1>
                <Badge
                  variant="outline"
                  className={
                    isAlumni
                      ? "border-teal-500/30 bg-teal-950/40 text-teal-300 text-[10px]"
                      : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px]"
                  }
                >
                  {isAlumni ? (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-2.5 h-2.5" /> IIUC Alumni
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-2.5 h-2.5" /> IIUC Student
                    </span>
                  )}
                </Badge>
                {isAlumni && member.alumniProfile?.forumRole && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-950/30 text-amber-300 text-[10px]"
                  >
                    {member.alumniProfile.forumRole}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-zinc-400 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{member.department}</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-emerald-400">
                  {member.batch ? `Batch ${member.batch}` : member.session}
                </span>
              </p>
            </div>
          </div>

          {/* Core Identity Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-2 border-t border-white/5">
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Student ID</span>
              <span className="font-mono font-semibold text-white truncate block">
                {member.studentId}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Session</span>
              <span className="text-white font-medium truncate block">
                {member.session}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-rose-400" />
                <span>Blood Group</span>
              </span>
              <span className="font-mono font-semibold text-rose-300 truncate block">
                {formattedBlood || "Unlisted"}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-emerald-400" />
                <span>Gender</span>
              </span>
              <span className="text-white font-medium truncate block">
                {member.gender === "FEMALE" ? "Female" : "Male"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic & Professional Trajectory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Card: Academic / Professional Details */}
        <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              {isAlumni ? (
                <>
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  <span>Professional Profile</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Academic Standing</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            {isAlumni && member.alumniProfile ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] text-zinc-500 block">Current Role &amp; Organization</span>
                  <p className="font-semibold text-white text-sm">
                    {member.alumniProfile.jobPosition || "Professional"}
                    {member.alumniProfile.company ? ` at ${member.alumniProfile.company}` : ""}
                  </p>
                  {member.alumniProfile.industry && (
                    <p className="text-[11px] text-zinc-400">Industry: {member.alumniProfile.industry}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {member.alumniProfile.workLocation && (
                    <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 block">Work Location</span>
                      <span className="text-white font-medium">{member.alumniProfile.workLocation}</span>
                    </div>
                  )}
                  {member.alumniProfile.experienceYears != null && member.alumniProfile.experienceYears > 0 && (
                    <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 block">Experience</span>
                      <span className="text-white font-medium">{member.alumniProfile.experienceYears} Years</span>
                    </div>
                  )}
                  {member.alumniProfile.cgpa && (
                    <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 block">Academic CGPA</span>
                      <span className="text-teal-400 font-mono font-semibold">{member.alumniProfile.cgpa}</span>
                    </div>
                  )}
                  {member.alumniProfile.graduationYear && (
                    <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 block">Graduation Year</span>
                      <span className="text-white font-medium">{member.alumniProfile.graduationYear}</span>
                    </div>
                  )}
                </div>

                {member.alumniProfile.skills && member.alumniProfile.skills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 block font-medium">Technical &amp; Professional Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.alumniProfile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-zinc-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.alumniProfile.personalDetails && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] space-y-1">
                    <span className="text-[10px] text-zinc-500 block">Personal &amp; Professional Summary</span>
                    <p className="text-zinc-300 text-xs leading-relaxed">{member.alumniProfile.personalDetails}</p>
                  </div>
                )}

                {member.alumniProfile.mentorshipAvailable && (
                  <div className="p-3 rounded-xl border border-teal-500/30 bg-teal-950/20 text-teal-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-xs font-medium">Available for Career &amp; Academic Mentorship</span>
                  </div>
                )}
              </div>
            ) : member.studentProfile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block">Current Semester</span>
                    <span className="text-white font-semibold">{member.studentProfile.currentSemester}</span>
                  </div>
                  {member.studentProfile.cgpa && (
                    <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] text-zinc-500 block">Academic CGPA</span>
                      <span className="text-emerald-400 font-mono font-semibold">{member.studentProfile.cgpa}</span>
                    </div>
                  )}
                </div>

                {member.studentProfile.clubRole && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Club / Forum Engagement</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 text-[10px]">
                      {member.studentProfile.clubRole}
                    </Badge>
                  </div>
                )}

                {member.studentProfile.interestedSector && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-400" />
                      <span>Career Focus Track</span>
                    </span>
                    <span className="text-zinc-200 font-medium">{member.studentProfile.interestedSector}</span>
                  </div>
                )}

                {/* Skills */}
                {member.studentProfile.skills && member.studentProfile.skills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 block font-medium">Technical &amp; Soft Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.studentProfile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-zinc-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Uploaded CV Document */}
                {member.studentProfile.cvUrl && (
                  <div className="pt-2">
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-emerald-200 truncate">Curriculum Vitae (PDF)</p>
                          <p className="text-[10px] text-zinc-400">Attached Student Resume</p>
                        </div>
                      </div>

                      <a
                        href={`/api/students/${member.id}/cv`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0 shadow-sm"
                      >
                        <span>View CV</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 italic">No academic details recorded.</p>
            )}
          </CardContent>
        </Card>

        {/* Right Card: Verified Contact & Origin (Privacy Masked) */}
        <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contact &amp; Origin</span>
            </CardTitle>
            <span className="text-[10px] text-zinc-500 font-mono">Privacy Governed</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            {/* Permanent Address */}
            <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Permanent Address (Rangunia Origin)</span>
              </span>
              {member.permanentAddress ? (
                <span className="text-white font-medium">{member.permanentAddress}</span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 italic">
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span>Confidential (Masked by member)</span>
                </span>
              )}
            </div>

            {/* Present Address */}
            <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Present Address (Campus / Hall)</span>
              </span>
              {member.presentAddress ? (
                <span className="text-white font-medium">{member.presentAddress}</span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 italic">
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span>Confidential (Masked by member)</span>
                </span>
              )}
            </div>

            {/* Contact Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Phone */}
              <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Phone Number</span>
                </span>
                {member.phone ? (
                  <a
                    href={`tel:${member.phone}`}
                    className="text-zinc-200 hover:text-emerald-300 font-mono truncate block"
                  >
                    {member.phone}
                  </a>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1 italic">
                    <Lock className="w-2.5 h-2.5 text-zinc-600" />
                    <span>Hidden</span>
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                <span className="text-[10px] text-zinc-500 block mb-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  <span>Email Address</span>
                </span>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-zinc-200 hover:text-emerald-300 truncate block"
                    title={member.email}
                  >
                    {member.email}
                  </a>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1 italic">
                    <Lock className="w-2.5 h-2.5 text-zinc-600" />
                    <span>Hidden</span>
                  </span>
                )}
              </div>
            </div>

            {/* Social Links */}
            {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
              <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] space-y-1.5">
                <span className="text-[10px] text-zinc-500 block font-mono">Social &amp; Professional Profiles</span>
                <div className="flex items-center gap-3">
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 text-xs transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {member.socialLinks.facebook && (
                    <a
                      href={member.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 text-xs transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 text-xs transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Higher Education & Research Section (If Alumni has postgraduate/study details) */}
      {isAlumni &&
        member.alumniProfile &&
        (member.alumniProfile.higherStudyUniversity ||
          member.alumniProfile.higherStudyDegree ||
          member.alumniProfile.higherStudyCountry ||
          member.alumniProfile.scholarshipInfo ||
          member.alumniProfile.researchThesisTitle ||
          member.alumniProfile.higherEducationDetails) && (
          <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white">
            <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span>Higher Education &amp; Research</span>
              </CardTitle>
              <Badge variant="outline" className="border-teal-500/30 bg-teal-950/20 text-teal-300 text-[10px]">
                Postgraduate / Global Academia
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {member.alumniProfile.higherStudyDegree && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block">Degree / Program</span>
                    <span className="text-white font-medium">{member.alumniProfile.higherStudyDegree}</span>
                  </div>
                )}
                {member.alumniProfile.higherStudyUniversity && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block">University / Institution</span>
                    <span className="text-white font-medium">{member.alumniProfile.higherStudyUniversity}</span>
                  </div>
                )}
                {member.alumniProfile.higherStudyCountry && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                      <Globe className="w-3 h-3 text-teal-400" />
                      <span>Country</span>
                    </span>
                    <span className="text-white font-medium">{member.alumniProfile.higherStudyCountry}</span>
                  </div>
                )}
                {member.alumniProfile.scholarshipInfo && (
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Scholarship / Fellowship</span>
                    </span>
                    <span className="text-white font-medium">{member.alumniProfile.scholarshipInfo}</span>
                  </div>
                )}
              </div>

              {member.alumniProfile.researchThesisTitle && (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-teal-400" />
                    <span>Research / Thesis Title</span>
                  </span>
                  <p className="text-zinc-200 font-medium text-xs sm:text-sm">{member.alumniProfile.researchThesisTitle}</p>
                </div>
              )}

              {member.alumniProfile.higherEducationDetails && (
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] text-zinc-500 block">Higher Education Notes &amp; Insights</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{member.alumniProfile.higherEducationDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Member Bio / Forum Statement */}
      {member.bio && (
        <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white">
          <CardHeader className="pb-2 border-b border-white/5">
            <CardTitle className="text-sm font-semibold text-zinc-300">About / Personal Bio</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
              &ldquo;{member.bio}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PublicProfilePage({ params }: PublicProfilePageProps) {
  return (
    <div className="min-h-screen bg-[#040907] text-white flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      <LandingNav />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <Container className="max-w-4xl space-y-6">
          <React.Suspense
            fallback={
              <div className="py-24 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm">Loading member profile...</p>
              </div>
            }
          >
            <MemberProfileContent params={params} />
          </React.Suspense>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
