"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MentorshipActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Student requests mentorship from an alumni.
 */
export async function requestMentorshipAction(input: {
  alumniId: string;
  notes?: string;
}): Promise<MentorshipActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in as a student to request mentorship." };
    }

    const studentId = session.user.id;

    if (studentId === input.alumniId) {
      return { success: false, error: "You cannot request mentorship from yourself." };
    }

    // Verify target alumni exists and is offering mentorship
    const targetAlumni = await prisma.user.findUnique({
      where: { id: input.alumniId },
      include: { alumniProfile: true },
    });

    if (!targetAlumni || !targetAlumni.alumniProfile) {
      return { success: false, error: "The requested alumni profile could not be found." };
    }

    if (!targetAlumni.alumniProfile.mentorshipAvailable) {
      return { success: false, error: "This alumni is not currently accepting new mentorship requests." };
    }

    // Check for existing pending or active sessions
    const existing = await prisma.mentorshipSession.findFirst({
      where: {
        studentId,
        alumniId: input.alumniId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });

    if (existing) {
      if (existing.status === "PENDING") {
        return { success: false, error: "You already have a pending mentorship request with this mentor." };
      }
      return { success: false, error: "You currently have an active mentorship session with this mentor." };
    }

    // Create the session
    await prisma.mentorshipSession.create({
      data: {
        studentId,
        alumniId: input.alumniId,
        status: "PENDING",
        notes: input.notes?.trim() || null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    revalidatePath(`/directory/${input.alumniId}`);

    return {
      success: true,
      message: "Mentorship request sent successfully! You will be notified when accepted.",
    };
  } catch (error) {
    console.error("requestMentorshipAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send mentorship request.",
    };
  }
}

/**
 * Alumni accepts a pending mentorship request.
 */
export async function acceptMentorshipAction(sessionId: string): Promise<MentorshipActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const mentorshipSession = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
    });

    if (!mentorshipSession) {
      return { success: false, error: "Mentorship session not found." };
    }

    if (mentorshipSession.alumniId !== session.user.id) {
      return { success: false, error: "Only the designated mentor can accept this request." };
    }

    if (mentorshipSession.status !== "PENDING") {
      return { success: false, error: `Request cannot be accepted because it is already ${mentorshipSession.status.toLowerCase()}.` };
    }

    await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data: {
        status: "ACTIVE",
        startedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    revalidatePath(`/directory/${mentorshipSession.studentId}`);
    revalidatePath(`/directory/${mentorshipSession.alumniId}`);

    return {
      success: true,
      message: "Mentorship request accepted! The session is now active.",
    };
  } catch (error) {
    console.error("acceptMentorshipAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to accept request.",
    };
  }
}

/**
 * Alumni declines a pending mentorship request.
 */
export async function declineMentorshipAction(sessionId: string): Promise<MentorshipActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const mentorshipSession = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
    });

    if (!mentorshipSession) {
      return { success: false, error: "Mentorship session not found." };
    }

    if (mentorshipSession.alumniId !== session.user.id) {
      return { success: false, error: "Only the designated mentor can decline this request." };
    }

    await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data: {
        status: "REJECTED",
        endedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");

    return {
      success: true,
      message: "Mentorship request declined.",
    };
  } catch (error) {
    console.error("declineMentorshipAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to decline request.",
    };
  }
}

/**
 * Either party (Student or Alumni) ends an active mentorship session.
 */
export async function endMentorshipSessionAction(sessionId: string): Promise<MentorshipActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const mentorshipSession = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
    });

    if (!mentorshipSession) {
      return { success: false, error: "Mentorship session not found." };
    }

    const isParty =
      mentorshipSession.studentId === session.user.id ||
      mentorshipSession.alumniId === session.user.id;

    if (!isParty) {
      return { success: false, error: "You are not authorized to conclude this session." };
    }

    if (mentorshipSession.status !== "ACTIVE") {
      return { success: false, error: "Only active sessions can be concluded." };
    }

    await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    revalidatePath(`/directory/${mentorshipSession.studentId}`);
    revalidatePath(`/directory/${mentorshipSession.alumniId}`);

    return {
      success: true,
      message: "Mentorship session concluded successfully. History has been logged.",
    };
  } catch (error) {
    console.error("endMentorshipSessionAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to end mentorship session.",
    };
  }
}

/**
 * Update alumni mentorship availability and details
 */
export async function updateMentorshipSettingsAction(input: {
  mentorshipAvailable: boolean;
  mentorshipDetails?: string;
}): Promise<MentorshipActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please sign in to continue." };
    }

    const userId = session.user.id;

    await prisma.alumniProfile.upsert({
      where: { userId },
      update: {
        mentorshipAvailable: input.mentorshipAvailable,
        mentorshipDetails: input.mentorshipDetails !== undefined ? (input.mentorshipDetails ? input.mentorshipDetails.trim() : null) : undefined,
      },
      create: {
        userId,
        mentorshipAvailable: input.mentorshipAvailable,
        mentorshipDetails: input.mentorshipDetails ? input.mentorshipDetails.trim() : null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/directory");
    revalidatePath(`/directory/${userId}`);

    return {
      success: true,
      message: "Mentorship settings updated successfully!",
    };
  } catch (error) {
    console.error("updateMentorshipSettingsAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings.",
    };
  }
}
