"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdatePhotoResponse = {
  success: boolean;
  message?: string;
  error?: string;
  photoUrl?: string | null;
};

export async function updateProfilePhotoAction(
  photoUrl: string | null
): Promise<UpdatePhotoResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const userId = session.user.id;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { success: false, error: "Member account not found." };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        photoUrl: photoUrl || null,
      },
      select: {
        photoUrl: true,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");

    return {
      success: true,
      message: photoUrl ? "Profile photo updated successfully!" : "Profile photo removed.",
      photoUrl: updated.photoUrl,
    };
  } catch (error) {
    console.error("updateProfilePhotoAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile photo",
    };
  }
}
