import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Droplet,
  LogOut,
  Calendar,
  Building,
  Loader2,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";
import { StudentProfileForm } from "@/features/profile/components/student-profile-form";
import { AlumniProfileForm } from "@/features/profile/components/alumni-profile-form";

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

async function ProfileContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Handle Admin / Super Admin redirection if they land on /profile
  if (session.user.role === "SUPER_ADMIN") {
    redirect("/admin/super");
  }
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      alumniProfile: true,
    },
  });

  if (!user) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Profile Account Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested member profile could not be located in our records.
        </p>
        <Link href="/login">
          <Button variant="outline" className="border-white/10 text-white">
            Return to Login
          </Button>
        </Link>
      </div>
    );
  }

  const isAlumni = Boolean(user.alumniProfile);
  const formattedBlood = formatBloodGroup(user.bloodGroup);

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-teal-950/80 border-b border-white/5 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge
              className={
                user.verificationStatus === "APPROVED"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }
            >
              {user.verificationStatus === "APPROVED" ? (
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  Verified Member
                </span>
              ) : (
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3" />
                  Verification Pending
                </span>
              )}
            </Badge>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Sign Out</span>
              </Button>
            </form>
          </div>
        </div>

        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12 mb-6">
            {/* User Avatar / Photo */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-900 shadow-xl shrink-0">
              {user.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-300 text-2xl font-bold font-mono">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Member Details */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {user.fullName}
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
                      <Briefcase className="w-3 h-3" />
                      IIUC Alumni
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      IIUC Student
                    </span>
                  )}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-mono text-zinc-300">
                  <span className="text-emerald-400">ID:</span> {user.studentId}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-zinc-500" />
                  {user.department}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {user.session}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Email</span>
              <span className="text-zinc-200 truncate flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Contact</span>
              <span className="text-zinc-200 truncate flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{user.phone || "Not set"}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Blood Group</span>
              <span className="text-zinc-200 flex items-center gap-1 font-semibold">
                <Droplet className="w-3 h-3 text-rose-400 shrink-0" />
                <span>{formattedBlood || "Unspecified"}</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Rangunia Origin</span>
              <span className="text-zinc-200 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{user.address || "Rangunia"}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Update Section */}
      {isAlumni ? (
        <AlumniProfileForm
          initialData={{
            bloodGroup: user.bloodGroup,
            jobPosition: user.alumniProfile?.jobPosition,
            industry: user.alumniProfile?.industry,
            workLocation: user.alumniProfile?.workLocation,
            experienceYears: user.alumniProfile?.experienceYears,
            details: user.bio,
          }}
        />
      ) : (
        <StudentProfileForm
          initialData={{
            bloodGroup: user.bloodGroup,
            cgpa: user.studentProfile?.cgpa,
            skills: user.studentProfile?.skills,
            interestedSector: user.studentProfile?.interestedSector,
            clubRole: user.studentProfile?.clubRole,
            details: user.bio,
          }}
        />
      )}

      {/* Verification Notice Banner */}
      {user.verificationStatus === "PENDING" && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-300">Member Verification Pending</p>
            <p className="text-zinc-400 leading-relaxed">
              Your profile is currently under review by the forum administrative committee. You can freely update your profile details and skills anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#040907] text-white py-10 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-4xl">
        <React.Suspense
          fallback={
            <div className="py-20 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-xs">Loading member profile...</p>
            </div>
          }
        >
          <ProfileContent />
        </React.Suspense>
      </Container>
    </div>
  );
}
