"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface PrivacySettingsInput {
  isPhotoVisible: boolean;
  isPhoneVisible: boolean;
  isEmailVisible: boolean;
  isSocialVisible: boolean;
  isAddressVisible: boolean;
}

export interface PrivacySettingsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updatePrivacySettingsAction(
  data: PrivacySettingsInput
): Promise<PrivacySettingsResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const userId = session.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        isPhotoVisible: Boolean(data.isPhotoVisible),
        isPhoneVisible: Boolean(data.isPhoneVisible),
        isEmailVisible: Boolean(data.isEmailVisible),
        isSocialVisible: Boolean(data.isSocialVisible),
        isAddressVisible: Boolean(data.isAddressVisible),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");

    return {
      success: true,
      message: "Privacy settings updated successfully.",
    };
  } catch (error) {
    console.error("updatePrivacySettingsAction error:", error);
    return {
      success: false,
      error: "Failed to update privacy settings. Please try again.",
    };
  }
}
