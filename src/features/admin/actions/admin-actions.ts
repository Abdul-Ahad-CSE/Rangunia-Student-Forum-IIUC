"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  adminRegisterSchema,
  type AdminRegisterInput,
} from "@/features/admin/schemas/admin-register.schema";

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Public action for Assistant Admin registration.
 * Creates an admin record with PENDING approval status.
 */
export async function registerAdminAction(
  rawData: AdminRegisterInput
): Promise<ActionResponse> {
  const result = adminRegisterSchema.safeParse(rawData);

  if (!result.success) {
    const errorMsg =
      result.error.issues?.[0]?.message ||
      result.error.message ||
      "Invalid registration data";
    return { success: false, error: errorMsg };
  }

  const data = result.data;

  try {
    // 1. Check if an admin with the same email already exists
    const existingEmail = await prisma.adminUser.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existingEmail) {
      return {
        success: false,
        error: "An administrator with this email address is already registered.",
      };
    }

    // 2. Check if an admin with the same student ID already exists
    const existingStudentId = await prisma.adminUser.findUnique({
      where: { studentId: data.studentId.trim() },
    });

    if (existingStudentId) {
      return {
        success: false,
        error: "An administrator with this Student ID is already registered.",
      };
    }

    // 3. Hash the admin password securely
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 4. Create the Admin record with PENDING approval status
    await prisma.adminUser.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        photoUrl: data.photoUrl.trim(),
        studentId: data.studentId.trim(),
        department: data.department.trim(),
        section: data.section.trim(),
        phone: data.phone.trim(),
        position: data.position.trim(),
        enrollment: data.enrollment.trim(),
        currentAddress: data.currentAddress.trim(),
        permanentAddress: data.permanentAddress.trim(),
        gender: "Male",
        approvalStatus: "PENDING",
      },
    });

    return {
      success: true,
      message:
        "Admin registration submitted successfully! Your account is currently PENDING approval by the Super Admin.",
    };
  } catch (error) {
    console.error("Error during admin registration:", error);
    return {
      success: false,
      error: "A server error occurred while processing your registration. Please try again.",
    };
  }
}

/**
 * Super Admin action to approve a pending admin registration.
 */
export async function approveAdminAction(adminId: string): Promise<ActionResponse> {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    return {
      success: false,
      error: "Unauthorized: Super Admin credentials required.",
    };
  }

  try {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
      },
    });

    revalidatePath("/admin/super");
    return {
      success: true,
      message: "Admin approved successfully! They can now log in to the admin console.",
    };
  } catch (error) {
    console.error("Error approving admin:", error);
    return {
      success: false,
      error: "Failed to approve administrator.",
    };
  }
}

/**
 * Super Admin action to reject an admin registration.
 */
export async function rejectAdminAction(
  adminId: string,
  reason?: string
): Promise<ActionResponse> {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    return {
      success: false,
      error: "Unauthorized: Super Admin credentials required.",
    };
  }

  try {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: {
        approvalStatus: "REJECTED",
        rejectionReason: reason || "Rejected by Super Admin.",
      },
    });

    revalidatePath("/admin/super");
    return {
      success: true,
      message: "Admin registration has been marked as rejected.",
    };
  } catch (error) {
    console.error("Error rejecting admin:", error);
    return {
      success: false,
      error: "Failed to reject administrator.",
    };
  }
}
