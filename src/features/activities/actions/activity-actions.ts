"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { activitySchema, ActivityInput } from "../schemas/activity.schema";

export type ActivityActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Validate that the current session user has Activity Management permissions.
 */
async function verifyActivityManager() {
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
      select: { canManageActivities: true, approvalStatus: true },
    });
    if (admin?.canManageActivities && admin.approvalStatus === "APPROVED") {
      return session.user;
    }
  }

  throw new Error("Access Denied: You do not possess activity management capabilities.");
}

/**
 * Create a new Activity (Admin / Super Admin)
 */
export async function createActivityAction(
  input: ActivityInput
): Promise<ActivityActionResponse<{ id: string }>> {
  try {
    await verifyActivityManager();

    const parsed = activitySchema.parse(input);

    const activity = await prisma.activity.create({
      data: {
        title: parsed.title.trim(),
        date: parsed.date,
        time: parsed.time.trim(),
        location: parsed.location.trim(),
        photos: parsed.photos || [],
        description: parsed.description.trim(),
      },
    });

    revalidatePath("/admin/activities");
    revalidatePath("/activities");

    return {
      success: true,
      message: "Activity created successfully!",
      data: { id: activity.id },
    };
  } catch (error) {
    console.error("createActivityAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create activity",
    };
  }
}

/**
 * Update an existing Activity
 */
export async function updateActivityAction(
  id: string,
  input: ActivityInput
): Promise<ActivityActionResponse<{ id: string }>> {
  try {
    await verifyActivityManager();

    const parsed = activitySchema.parse(input);

    const existing = await prisma.activity.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Activity record not found." };
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        title: parsed.title.trim(),
        date: parsed.date,
        time: parsed.time.trim(),
        location: parsed.location.trim(),
        photos: parsed.photos || [],
        description: parsed.description.trim(),
      },
    });

    revalidatePath("/admin/activities");
    revalidatePath(`/activities/${id}`);
    revalidatePath("/activities");

    return {
      success: true,
      message: "Activity updated successfully!",
      data: { id: updated.id },
    };
  } catch (error) {
    console.error("updateActivityAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update activity",
    };
  }
}

/**
 * Delete an Activity
 */
export async function deleteActivityAction(
  id: string
): Promise<ActivityActionResponse> {
  try {
    await verifyActivityManager();

    const existing = await prisma.activity.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Activity not found." };
    }

    await prisma.activity.delete({
      where: { id },
    });

    revalidatePath("/admin/activities");
    revalidatePath("/activities");

    return {
      success: true,
      message: "Activity deleted successfully.",
    };
  } catch (error) {
    console.error("deleteActivityAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete activity",
    };
  }
}
