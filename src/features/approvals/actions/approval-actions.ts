"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ApprovalActionResponse } from "../types/approval.types";

/**
 * Security Gate Validator:
 * Ensures the actor is either the Super Admin or an Executive Admin with canManageProfiles flag.
 */
async function verifyApprovalPermission(): Promise<{ authorized: boolean; error?: string }> {
  const session = await auth();

  if (!session?.user) {
    return { authorized: false, error: "Unauthenticated. Please sign in." };
  }

  // 1. Super Admin is always authorized
  if (session.user.role === "SUPER_ADMIN") {
    return { authorized: true };
  }

  // 2. Executive Admin must possess canManageProfiles privilege
  if (session.user.role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageProfiles: true, approvalStatus: true },
    });

    if (!admin || admin.approvalStatus !== "APPROVED") {
      return { authorized: false, error: "Your executive account is not active." };
    }

    if (!admin.canManageProfiles) {
      return {
        authorized: false,
        error: "Access Denied: You do not possess the 'canManageProfiles' administrative capability.",
      };
    }

    return { authorized: true };
  }

  return { authorized: false, error: "Access Denied: Administrative authority required." };
}

/**
 * Approve a pending student or alumni member.
 */
export async function approveMemberAction(userId: string): Promise<ApprovalActionResponse> {
  try {
    const authCheck = await verifyApprovalPermission();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "Member record not found." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "APPROVED",
        verificationStatus: "APPROVED",
      },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin/super");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `${user.fullName} has been approved as an active forum member.`,
    };
  } catch (err) {
    console.error("approveMemberAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to approve member.",
    };
  }
}

/**
 * Reject a pending student or alumni member.
 */
export async function rejectMemberAction(
  userId: string
): Promise<ApprovalActionResponse> {
  try {
    const authCheck = await verifyApprovalPermission();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "Member record not found." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "REJECTED",
        verificationStatus: "REJECTED",
      },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin/super");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Application for ${user.fullName} has been rejected.`,
    };
  } catch (err) {
    console.error("rejectMemberAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reject member.",
    };
  }
}

/**
 * Delete a user record (e.g. for rejected applications or spam submissions).
 */
export async function deleteMemberAction(userId: string): Promise<ApprovalActionResponse> {
  try {
    const authCheck = await verifyApprovalPermission();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/approvals");
    revalidatePath("/admin/super");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Member registration record permanently deleted.",
    };
  } catch (err) {
    console.error("deleteMemberAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete record.",
    };
  }
}
