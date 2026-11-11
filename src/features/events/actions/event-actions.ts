"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { eventSchema, EventInput } from "../schemas/event.schema";

export type EventActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

/**
 * Validate that the current session user has Event Management permissions.
 */
async function verifyEventManager() {
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
      select: { canManageEvents: true, approvalStatus: true },
    });
    if (admin?.canManageEvents && admin.approvalStatus === "APPROVED") {
      return session.user;
    }
  }

  throw new Error("Access Denied: You do not possess event management capabilities.");
}

/**
 * Create a new Event (Admin / Super Admin)
 */
export async function createEventAction(input: EventInput): Promise<EventActionResponse<{ id: string }>> {
  try {
    await verifyEventManager();

    const parsed = eventSchema.parse(input);

    const event = await prisma.event.create({
      data: {
        title: parsed.title.trim(),
        bannerUrl: parsed.bannerUrl || null,
        eventDate: parsed.eventDate,
        eventTime: parsed.eventTime.trim(),
        venue: parsed.venue.trim(),
        registrationDeadline: parsed.registrationDeadline,
        description: parsed.description.trim(),
        postEventRecap: parsed.postEventRecap ? parsed.postEventRecap.trim() : null,
        postEventPhotos: parsed.postEventPhotos || [],
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Event created successfully!",
      data: { id: event.id },
    };
  } catch (error) {
    console.error("createEventAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event.",
    };
  }
}

/**
 * Update an existing Event
 */
export async function updateEventAction(
  id: string,
  input: Partial<EventInput>
): Promise<EventActionResponse> {
  try {
    await verifyEventManager();

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Event not found." };
    }

    await prisma.event.update({
      where: { id },
      data: {
        title: input.title !== undefined ? input.title.trim() : undefined,
        bannerUrl: input.bannerUrl !== undefined ? input.bannerUrl : undefined,
        eventDate: input.eventDate,
        eventTime: input.eventTime !== undefined ? input.eventTime.trim() : undefined,
        venue: input.venue !== undefined ? input.venue.trim() : undefined,
        registrationDeadline: input.registrationDeadline,
        description: input.description !== undefined ? input.description.trim() : undefined,
        postEventRecap: input.postEventRecap !== undefined ? (input.postEventRecap ? input.postEventRecap.trim() : null) : undefined,
        postEventPhotos: input.postEventPhotos !== undefined ? input.postEventPhotos : undefined,
      },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);

    return {
      success: true,
      message: "Event details updated successfully!",
    };
  } catch (error) {
    console.error("updateEventAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event.",
    };
  }
}

/**
 * Delete an Event
 */
export async function deleteEventAction(id: string): Promise<EventActionResponse> {
  try {
    await verifyEventManager();

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event removed successfully.",
    };
  } catch (error) {
    console.error("deleteEventAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event.",
    };
  }
}

/**
 * Save Post-Event Recap and Gallery Photos
 */
export async function updateEventRecapAction(
  id: string,
  data: {
    postEventRecap: string;
    postEventPhotos: string[];
  }
): Promise<EventActionResponse> {
  try {
    await verifyEventManager();

    await prisma.event.update({
      where: { id },
      data: {
        postEventRecap: data.postEventRecap.trim() || null,
        postEventPhotos: data.postEventPhotos || [],
      },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);

    return {
      success: true,
      message: "Event recap and gallery updated successfully!",
    };
  } catch (error) {
    console.error("updateEventRecapAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event recap.",
    };
  }
}

/**
 * Public User Registration for an Event
 */
export async function registerForEventAction(eventId: string): Promise<EventActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Please sign in to register for this event.",
      };
    }

    const userId = session.user.id;

    // Verify event exists and registration is open
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false, error: "The requested event could not be found." };
    }

    const now = new Date();
    if (now > event.registrationDeadline) {
      return {
        success: false,
        error: "Registration has closed for this event.",
      };
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingRegistration) {
      return {
        success: false,
        error: "You have already registered for this event.",
      };
    }

    await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
      },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${eventId}`);

    return {
      success: true,
      message: "Congratulations! You have successfully registered for this event.",
    };
  } catch (error) {
    console.error("registerForEventAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register for event.",
    };
  }
}
