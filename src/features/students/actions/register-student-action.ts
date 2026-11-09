"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  studentRegisterSchema,
  type StudentRegisterInput,
} from "../schemas/student-registration.schema";
import { BloodGroup } from "@prisma/client";

export type StudentRegisterResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function registerStudentAction(
  rawInput: StudentRegisterInput
): Promise<StudentRegisterResponse> {
  try {
    const parseResult = studentRegisterSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues?.[0]?.message ||
        parseResult.error.message ||
        "Invalid registration data";
      return { success: false, error: firstError };
    }

    const data = parseResult.data;
    const email = data.email.toLowerCase().trim();
    const studentId = data.studentId.toUpperCase().trim();

    // 1. Check for Duplicate Email in User and AdminUser
    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserEmail) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const existingAdminEmail = await prisma.adminUser.findUnique({
      where: { email },
    });
    if (existingAdminEmail) {
      return { success: false, error: "This email address is already registered as an executive administrator." };
    }

    // 2. Check for Duplicate Student ID
    const existingUserStudentId = await prisma.user.findUnique({
      where: { studentId },
    });
    if (existingUserStudentId) {
      return { success: false, error: "A member account with this IIUC Student ID already exists." };
    }

    const existingAdminStudentId = await prisma.adminUser.findUnique({
      where: { studentId },
    });
    if (existingAdminStudentId) {
      return { success: false, error: "This IIUC Student ID is already registered under the executive administration." };
    }

    // 3. Hash Password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 4. Map Blood Group
    let bloodGroupValue: BloodGroup | null = null;
    if (data.bloodGroup && Object.values(BloodGroup).includes(data.bloodGroup as BloodGroup)) {
      bloodGroupValue = data.bloodGroup as BloodGroup;
    }

    // 5. Build Social Links JSON
    const socialLinks: Record<string, string> = {};
    if (data.facebook && data.facebook.trim()) {
      socialLinks.facebook = data.facebook.trim();
    }
    if (data.linkedin && data.linkedin.trim()) {
      socialLinks.linkedin = data.linkedin.trim();
    }

    // 6. Transactionally create User and 1:1 StudentProfile
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          studentId,
          email,
          passwordHash,
          fullName: data.fullName.trim(),
          name: data.fullName.trim(),
          photoUrl: data.photoUrl || null,
          gender: "MALE",
          department: data.department.trim(),
          session: data.session.trim(),
          bloodGroup: bloodGroupValue,
          phone: data.phone.trim(),
          address: data.address.trim(),
          socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
          bio: data.bio ? data.bio.trim() : null,
          role: "STUDENT",
          approvalStatus: "PENDING",
          verificationStatus: "PENDING",
          isActive: true,
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: newUser.id,
          currentSemester: data.currentSemester.trim(),
          cgpa: null,
          skills: [],
          interestedSector: null,
          clubRole: "Member",
        },
      });
    });

    return {
      success: true,
      message: "Student registration submitted successfully! You can now sign in to your profile.",
    };
  } catch (error) {
    console.error("registerStudentAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "A server error occurred during registration.",
    };
  }
}
