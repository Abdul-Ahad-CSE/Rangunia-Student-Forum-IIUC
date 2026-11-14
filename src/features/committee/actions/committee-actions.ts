"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  committeeMemberSchema,
  CommitteeMemberInput,
} from "../schemas/committee.schema";

export type CommitteeActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Validate that the current session user has Committee Management permissions.
 */
async function verifyCommitteeManager() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please sign in to continue.");
  }

  const role = session.user.role;
  if (role === "SUPER_ADMIN") {
    return session.user;
  }

  if (role === "ADMIN") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { canManageCommittee: true, approvalStatus: true },
    });
    if (admin?.canManageCommittee && admin.approvalStatus === "APPROVED") {
      return session.user;
    }
  }

  throw new Error("Access Denied: You do not possess committee management capabilities.");
}

/**
 * Create a new Committee Member (Admin / Super Admin)
 */
export async function createCommitteeMemberAction(
  input: CommitteeMemberInput
): Promise<CommitteeActionResponse<{ id: string }>> {
  try {
    await verifyCommitteeManager();

    const parsed = committeeMemberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data.",
      };
    }

    const data = parsed.data;

    // CRITICAL FEMALE PRIVACY OVERRIDE (Backend Guarantee)
    const isFemale = data.gender.trim().toLowerCase() === "female";
    const finalPhotoUrl = isFemale ? "/hijabi.png" : data.photoUrl.trim();
    const finalRank = data.type === "ADVISOR" ? null : data.rank;

    const created = await prisma.committeeMember.create({
      data: {
        type: data.type,
        name: data.name.trim(),
        photoUrl: finalPhotoUrl,
        gender: isFemale ? "Female" : data.gender.trim(),
        department: data.department.trim(),
        designation: data.designation.trim(),
        quote: data.quote.trim(),
        rank: finalRank,
      },
    });

    revalidatePath("/admin/committee");
    revalidatePath("/committee");

    return {
      success: true,
      message: `${data.type === "ADVISOR" ? "Advisor" : "Executive"} member added successfully.`,
      data: { id: created.id },
    };
  } catch (err: unknown) {
    console.error("Error creating committee member:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to create committee member.",
    };
  }
}

/**
 * Update an existing Committee Member (Admin / Super Admin)
 */
export async function updateCommitteeMemberAction(
  id: string,
  input: CommitteeMemberInput
): Promise<CommitteeActionResponse> {
  try {
    await verifyCommitteeManager();

    if (!id) {
      return { success: false, error: "Member ID is required for update." };
    }

    const parsed = committeeMemberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data.",
      };
    }

    const data = parsed.data;

    // CRITICAL FEMALE PRIVACY OVERRIDE (Backend Guarantee)
    const isFemale = data.gender.trim().toLowerCase() === "female";
    const finalPhotoUrl = isFemale ? "/hijabi.png" : data.photoUrl.trim();
    const finalRank = data.type === "ADVISOR" ? null : data.rank;

    await prisma.committeeMember.update({
      where: { id },
      data: {
        type: data.type,
        name: data.name.trim(),
        photoUrl: finalPhotoUrl,
        gender: isFemale ? "Female" : data.gender.trim(),
        department: data.department.trim(),
        designation: data.designation.trim(),
        quote: data.quote.trim(),
        rank: finalRank,
      },
    });

    revalidatePath("/admin/committee");
    revalidatePath("/committee");

    return {
      success: true,
      message: "Committee member updated successfully.",
    };
  } catch (err: unknown) {
    console.error("Error updating committee member:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update committee member.",
    };
  }
}

/**
 * Delete a Committee Member (Admin / Super Admin)
 */
export async function deleteCommitteeMemberAction(
  id: string
): Promise<CommitteeActionResponse> {
  try {
    await verifyCommitteeManager();

    if (!id) {
      return { success: false, error: "Member ID is required for deletion." };
    }

    await prisma.committeeMember.delete({
      where: { id },
    });

    revalidatePath("/admin/committee");
    revalidatePath("/committee");

    return {
      success: true,
      message: "Committee member removed successfully.",
    };
  } catch (err: unknown) {
    console.error("Error deleting committee member:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to delete committee member.",
    };
  }
}
