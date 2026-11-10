"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BloodGroup } from "@prisma/client";
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
  bloodGroup?: string;
  jobPosition?: string;
  industry?: string;
  workLocation?: string;
  experienceYears?: string | number;
  details?: string;
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

    // Parse blood group
    let bloodGroupValue: BloodGroup | null = null;
    if (data.bloodGroup && data.bloodGroup !== "") {
      bloodGroupValue = data.bloodGroup as BloodGroup;
    }

    // Parse experience years
    let expNumber: number | null = null;
    if (data.experienceYears !== undefined && data.experienceYears !== "") {
      const parsed = parseInt(String(data.experienceYears).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed)) {
        expNumber = parsed;
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update User basic info
      await tx.user.update({
        where: { id: userId },
        data: {
          bloodGroup: bloodGroupValue,
          bio: data.details !== undefined ? data.details.trim() : user.bio,
        },
      });

      // 2. Upsert AlumniProfile
      await tx.alumniProfile.upsert({
        where: { userId },
        update: {
          jobPosition: data.jobPosition ? data.jobPosition.trim() : null,
          industry: data.industry ? data.industry.trim() : null,
          workLocation: data.workLocation ? data.workLocation.trim() : null,
          experienceYears: expNumber,
        },
        create: {
          userId,
          jobPosition: data.jobPosition ? data.jobPosition.trim() : null,
          industry: data.industry ? data.industry.trim() : null,
          workLocation: data.workLocation ? data.workLocation.trim() : null,
          experienceYears: expNumber,
        },
      });
    });

    revalidatePath("/profile");
    return { success: true, message: "Alumni profile updated successfully!" };
  } catch (error) {
    console.error("updateAlumniProfileAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
