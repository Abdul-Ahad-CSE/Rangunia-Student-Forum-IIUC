"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export interface UpdatePermissionsInput {
  adminId: string;
  canManageProfiles: boolean;
  canManageEvents: boolean;
  canManageNotices: boolean;
  canManageActivities: boolean;
  canManageCommittee: boolean;
  canManageAbout: boolean;
}

export type PermissionActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Super Admin action to update granular capability flags for an approved administrator.
 */
export async function updateAdminPermissionsAction(
  input: UpdatePermissionsInput
): Promise<PermissionActionResponse> {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    return {
      success: false,
      error: "Unauthorized: Super Admin credentials required to modify administrator capabilities.",
    };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: input.adminId },
    });

    if (!admin) {
      return {
        success: false,
        error: "Target administrator record was not found.",
      };
    }

    if (admin.approvalStatus !== "APPROVED") {
      return {
        success: false,
        error: "Cannot assign permissions to an administrator whose account is not approved.",
      };
    }

    await prisma.adminUser.update({
      where: { id: input.adminId },
      data: {
        canManageProfiles: input.canManageProfiles,
        canManageEvents: input.canManageEvents,
        canManageNotices: input.canManageNotices,
        canManageActivities: input.canManageActivities,
        canManageCommittee: input.canManageCommittee,
        canManageAbout: input.canManageAbout,
      },
    });

    revalidatePath("/admin/super/permissions");
    revalidatePath("/admin/super");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Permissions updated successfully for ${admin.name}.`,
    };
  } catch (error) {
    console.error("Error updating admin permissions:", error);
    return {
      success: false,
      error: "An unexpected error occurred while saving administrator permissions.",
    };
  }
}
