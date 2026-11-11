"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ProfileUpdateResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type StudentProfileUpdateInput = {
  presentAddress?: string;
  cgpa?: string;
  skills?: string; // Comma-separated or tag list
  interestedSector?: string;
  clubRole?: string;
  details?: string;
  cvUrl?: string | null;
};

export async function updateStudentProfileAction(
  data: StudentProfileUpdateInput
): Promise<ProfileUpdateResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const userId = session.user.id;

    // Validate that user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { success: false, error: "User account not found." };
    }

    // Parse skills array
    const skillsArray = data.skills
      ? data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    await prisma.$transaction(async (tx) => {
      // 1. Directly update User present address & bio without admin approval
      await tx.user.update({
        where: { id: userId },
        data: {
          presentAddress:
            data.presentAddress !== undefined
              ? data.presentAddress.trim()
              : user.presentAddress,
          bio: data.details !== undefined ? data.details.trim() : user.bio,
        },
      });

      // 2. Directly upsert StudentProfile without admin approval
      await tx.studentProfile.upsert({
        where: { userId },
        update: {
          cgpa: data.cgpa ? data.cgpa.trim() : null,
          skills: skillsArray,
          interestedSector: data.interestedSector ? data.interestedSector.trim() : null,
          clubRole: data.clubRole ? data.clubRole.trim() : null,
          cvUrl: data.cvUrl !== undefined ? data.cvUrl : undefined,
        },
        create: {
          userId,
          currentSemester: "Active",
          cgpa: data.cgpa ? data.cgpa.trim() : null,
          skills: skillsArray,
          interestedSector: data.interestedSector ? data.interestedSector.trim() : null,
          clubRole: data.clubRole ? data.clubRole.trim() : null,
          cvUrl: data.cvUrl || null,
        },
      });
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    return { success: true, message: "Academic profile updated successfully!" };
  } catch (error) {
    console.error("updateStudentProfileAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export type AlumniProfileUpdateInput = {
  // Academic & Personal
  presentAddress?: string;
  forumRole?: string;
  skills?: string;
  cgpa?: string;
  jobPosition?: string;
  industry?: string;
  workLocation?: string;
  experienceYears?: string | number;
  personalDetails?: string;

  // Higher Education
  higherStudyUniversity?: string;
  higherStudyCountry?: string;
  higherStudyDegree?: string;
  scholarshipInfo?: string;
  researchThesisTitle?: string;
  higherEducationDetails?: string;

  // Mentorship Settings
  mentorshipAvailable?: boolean;
  mentorshipDetails?: string;
};

export async function updateAlumniProfileAction(
  data: AlumniProfileUpdateInput
): Promise<ProfileUpdateResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const userId = session.user.id;

    // Validate that user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { success: false, error: "User account not found." };
    }

    // Parse skills array
    const skillsArray = data.skills
      ? data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Parse experience years
    let expNumber: number | null = null;
    if (data.experienceYears !== undefined && data.experienceYears !== "") {
      const parsed = parseInt(String(data.experienceYears).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed)) {
        expNumber = parsed;
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update User basic info (presentAddress, bio)
      await tx.user.update({
        where: { id: userId },
        data: {
          presentAddress:
            data.presentAddress !== undefined
              ? (data.presentAddress ? data.presentAddress.trim() : null)
              : user.presentAddress,
          bio:
            data.personalDetails !== undefined
              ? (data.personalDetails ? data.personalDetails.trim() : null)
              : user.bio,
        },
      });

      // 2. Upsert AlumniProfile
      await tx.alumniProfile.upsert({
        where: { userId },
        update: {
          forumRole: data.forumRole !== undefined ? (data.forumRole ? data.forumRole.trim() : null) : undefined,
          skills: skillsArray,
          cgpa: data.cgpa !== undefined ? (data.cgpa ? data.cgpa.trim() : null) : undefined,
          jobPosition: data.jobPosition !== undefined ? (data.jobPosition ? data.jobPosition.trim() : null) : undefined,
          industry: data.industry !== undefined ? (data.industry ? data.industry.trim() : null) : undefined,
          workLocation: data.workLocation !== undefined ? (data.workLocation ? data.workLocation.trim() : null) : undefined,
          experienceYears: expNumber,
          personalDetails: data.personalDetails !== undefined ? (data.personalDetails ? data.personalDetails.trim() : null) : undefined,
          higherStudyUniversity: data.higherStudyUniversity !== undefined ? (data.higherStudyUniversity ? data.higherStudyUniversity.trim() : null) : undefined,
          higherStudyCountry: data.higherStudyCountry !== undefined ? (data.higherStudyCountry ? data.higherStudyCountry.trim() : null) : undefined,
          higherStudyDegree: data.higherStudyDegree !== undefined ? (data.higherStudyDegree ? data.higherStudyDegree.trim() : null) : undefined,
          scholarshipInfo: data.scholarshipInfo !== undefined ? (data.scholarshipInfo ? data.scholarshipInfo.trim() : null) : undefined,
          researchThesisTitle: data.researchThesisTitle !== undefined ? (data.researchThesisTitle ? data.researchThesisTitle.trim() : null) : undefined,
          higherEducationDetails: data.higherEducationDetails !== undefined ? (data.higherEducationDetails ? data.higherEducationDetails.trim() : null) : undefined,
          mentorshipAvailable: data.mentorshipAvailable !== undefined ? data.mentorshipAvailable : undefined,
          mentorshipDetails: data.mentorshipDetails !== undefined ? (data.mentorshipDetails ? data.mentorshipDetails.trim() : null) : undefined,
        },
        create: {
          userId,
          forumRole: data.forumRole ? data.forumRole.trim() : null,
          skills: skillsArray,
          cgpa: data.cgpa ? data.cgpa.trim() : null,
          jobPosition: data.jobPosition ? data.jobPosition.trim() : null,
          industry: data.industry ? data.industry.trim() : null,
          workLocation: data.workLocation ? data.workLocation.trim() : null,
          experienceYears: expNumber,
          personalDetails: data.personalDetails ? data.personalDetails.trim() : null,
          higherStudyUniversity: data.higherStudyUniversity ? data.higherStudyUniversity.trim() : null,
          higherStudyCountry: data.higherStudyCountry ? data.higherStudyCountry.trim() : null,
          higherStudyDegree: data.higherStudyDegree ? data.higherStudyDegree.trim() : null,
          scholarshipInfo: data.scholarshipInfo ? data.scholarshipInfo.trim() : null,
          researchThesisTitle: data.researchThesisTitle ? data.researchThesisTitle.trim() : null,
          higherEducationDetails: data.higherEducationDetails ? data.higherEducationDetails.trim() : null,
          mentorshipAvailable: data.mentorshipAvailable ?? false,
          mentorshipDetails: data.mentorshipDetails ? data.mentorshipDetails.trim() : null,
        },
      });
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    return { success: true, message: "Alumni profile updated successfully!" };
  } catch (error) {
    console.error("updateAlumniProfileAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
