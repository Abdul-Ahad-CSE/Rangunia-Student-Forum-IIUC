import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";
import { IdentityHeader } from "@/features/profile/components/identity-header";
import { StudentProfileForm } from "@/features/profile/components/student-profile-form";
import { AlumniProfileForm } from "@/features/profile/components/alumni-profile-form";
import { PrivacySettingsCard } from "@/features/profile/components/privacy-settings-card";

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

  return (
    <div className="space-y-8">
      {/* 1. Unchangeable Identity Header with Interactive Photo Click-to-Upload */}
      <IdentityHeader
        name={user.fullName}
        initialPhotoUrl={user.photoUrl}
        studentId={user.studentId}
        department={user.department}
        batch={user.batch}
        session={user.session}
        bloodGroup={user.bloodGroup}
        gender={user.gender}
        permanentAddress={user.permanentAddress}
        verificationStatus={user.verificationStatus}
        isAlumni={isAlumni}
        onSignOut={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      />

      {/* 2. Smart Privacy Settings Section */}
      <PrivacySettingsCard
        initialSettings={{
          isPhotoVisible: user.isPhotoVisible,
          isPhoneVisible: user.isPhoneVisible,
          isEmailVisible: user.isEmailVisible,
          isSocialVisible: user.isSocialVisible,
          isAddressVisible: user.isAddressVisible,
        }}
      />

      {/* 3. Academic & Personal Information (Directly Editable without admin approval) */}
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
            presentAddress: user.presentAddress,
            cgpa: user.studentProfile?.cgpa,
            skills: user.studentProfile?.skills,
            interestedSector: user.studentProfile?.interestedSector,
            clubRole: user.studentProfile?.clubRole,
            details: user.bio,
            cvUrl: user.studentProfile?.cvUrl,
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
