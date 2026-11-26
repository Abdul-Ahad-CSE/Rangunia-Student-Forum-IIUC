"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface AboutContentData {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  photos: string[];
}

const DEFAULT_ABOUT: AboutContentData = {
  id: "singleton",
  title: "Rangunia Students Forum (IIUC)",
  subtitle: "Rooted in Rangunia, Thriving at IIUC",
  content:
    "Established as an unbreakable pillar of brotherhood, Rangunia Students Forum (IIUC Chapter) unites students, faculty, and alumni across all fifteen unions and municipalities of Rangunia.\n\nFrom academic orientation and peer mentorship to urgent community welfare and professional career referrals, the forum stands as a lifelong fraternity committed to fostering university success, unity, and shared leadership at International Islamic University Chittagong.",
  photos: ["/images/rsf1.jpg", "/images/rsf2.jpg", "/images/rsf3.jpg"],
};

export async function getAboutContent(): Promise<AboutContentData> {
  try {
    const record = await prisma.aboutContent.findFirst();
    if (!record) {
      return DEFAULT_ABOUT;
    }
    return {
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      content: record.content,
      photos:
        record.photos && record.photos.length > 0
          ? record.photos
          : DEFAULT_ABOUT.photos,
    };
  } catch (error) {
    console.error("[getAboutContent] Error fetching about content:", error);
    return DEFAULT_ABOUT;
  }
}

export async function updateAboutContentAction(formData: {
  title: string;
  subtitle?: string | null;
  content: string;
  photos: string[];
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized: Please sign in to proceed." };
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { approvalStatus: true, canManageAbout: true },
    });

    if (admin?.approvalStatus !== "APPROVED" || !admin?.canManageAbout) {
      return {
        success: false,
        error:
          "Access Denied: You must be an APPROVED admin with the 'canManageAbout' permission granted by Super Admin.",
      };
    }
  }

  try {
    const updated = await prisma.aboutContent.upsert({
      where: { id: "singleton" },
      update: {
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || null,
        content: formData.content.trim(),
        photos: formData.photos || [],
      },
      create: {
        id: "singleton",
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || null,
        content: formData.content.trim(),
        photos: formData.photos || [],
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateAboutContentAction] Error saving about content:", error);
    return {
      success: false,
      error: "Failed to update About content. Please try again.",
    };
  }
}
