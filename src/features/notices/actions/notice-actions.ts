"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { noticeSchema, NoticeInput } from "../schemas/notice.schema";

export type NoticeActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Validate that the current session user has Notice Management permissions.
 */
async function verifyNoticeManager() {
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
      select: { canManageNotices: true, approvalStatus: true },
    });
    if (admin?.canManageNotices && admin.approvalStatus === "APPROVED") {
      return session.user;
    }
  }

  throw new Error("Access Denied: You do not possess notice management capabilities.");
}

/**
 * Create a new Notice (Admin / Super Admin)
 */
export async function createNoticeAction(
  input: NoticeInput
): Promise<NoticeActionResponse<{ id: string }>> {
  try {
    await verifyNoticeManager();

    const parsed = noticeSchema.parse(input);

    const notice = await prisma.notice.create({
      data: {
        title: parsed.title.trim(),
        date: parsed.date,
        bannerUrl: parsed.bannerUrl || null,
        content: parsed.content.trim(),
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/notices");

    return {
      success: true,
      message: "Notice published successfully!",
      data: { id: notice.id },
    };
  } catch (error) {
    console.error("createNoticeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create notice",
    };
  }
}

/**
 * Update an existing Notice
 */
export async function updateNoticeAction(
  id: string,
  input: NoticeInput
): Promise<NoticeActionResponse<{ id: string }>> {
  try {
    await verifyNoticeManager();

    const parsed = noticeSchema.parse(input);

    const existing = await prisma.notice.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Notice record not found." };
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        title: parsed.title.trim(),
        date: parsed.date,
        bannerUrl: parsed.bannerUrl !== undefined ? parsed.bannerUrl : existing.bannerUrl,
        content: parsed.content.trim(),
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath(`/notices/${id}`);
    revalidatePath("/notices");

    return {
      success: true,
      message: "Notice updated successfully!",
      data: { id: updated.id },
    };
  } catch (error) {
    console.error("updateNoticeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update notice",
    };
  }
}

/**
 * Delete a Notice
 */
export async function deleteNoticeAction(
  id: string
): Promise<NoticeActionResponse> {
  try {
    await verifyNoticeManager();

    const existing = await prisma.notice.findUnique({
      where: { id },
    });
    if (!existing) {
      return { success: false, error: "Notice not found." };
    }

    await prisma.notice.delete({
      where: { id },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/notices");

    return {
      success: true,
      message: "Notice removed successfully.",
    };
  } catch (error) {
    console.error("deleteNoticeAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete notice",
    };
  }
}
