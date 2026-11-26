import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export interface TopEventItem {
  id: string;
  title: string;
  bannerUrl: string | null;
  eventDate: string; // ISO string
  eventTime: string;
  venue: string;
  registrationDeadline: string; // ISO string
  description: string;
}

const fallbackMockEvents: TopEventItem[] = [
  {
    id: "mock-1",
    title: "Annual Grand Reunion & Cultural Iftar 2026",
    bannerUrl: "/images/rsf1.jpg",
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    eventTime: "04:30 PM - 08:30 PM",
    venue: "Central Auditorium, IIUC Campus, Kumira",
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    description:
      "Join hundreds of Rangunia students, distinguished faculty, and prominent alumni for an evening of lifelong brotherhood, memory sharing, and traditional feast.",
  },
  {
    id: "mock-2",
    title: "Freshers Orientation & Campus Reception",
    bannerUrl: "/images/rsf2.jpg",
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
    eventTime: "10:00 AM - 01:30 PM",
    venue: "Seminar Hall (Level 3), Central Library, IIUC",
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    description:
      "Welcoming the newly admitted Rangunia students across all departments with campus survival guides, senior-junior introductions, and academic kits.",
  },
  {
    id: "mock-3",
    title: "Career Guidance & Industry Tech Summit",
    bannerUrl: "/images/rsf3.jpg",
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    eventTime: "02:30 PM - 06:00 PM",
    venue: "IIUC Conference Center, Chittagong",
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40).toISOString(),
    description:
      "Connect with senior engineers, civil servants, and corporate leaders from Rangunia. Get 1-on-1 resume reviews and corporate interview referrals.",
  },
];

export async function getTopEvents(): Promise<TopEventItem[]> {
  await connection();
  try {
    const now = new Date();

    // 1. Fetch upcoming events
    const upcoming = await prisma.event.findMany({
      where: {
        eventDate: { gte: now },
      },
      orderBy: {
        eventDate: "asc",
      },
      take: 3,
    });

    let combined = [...upcoming];

    // 2. If fewer than 3, backfill with recent events
    if (combined.length < 3) {
      const remainingCount = 3 - combined.length;
      const recent = await prisma.event.findMany({
        where: {
          id: { notIn: combined.map((e) => e.id) },
        },
        orderBy: {
          eventDate: "desc",
        },
        take: remainingCount,
      });
      combined = [...combined, ...recent];
    }

    // 3. If database has 0 events, return full fallback mockups
    if (combined.length === 0) {
      return fallbackMockEvents;
    }

    // 4. If still fewer than 3, fill up with mockups
    if (combined.length < 3) {
      const needed = 3 - combined.length;
      const fillers = fallbackMockEvents.slice(0, needed);
      return [
        ...combined.map((e) => ({
          id: e.id,
          title: e.title,
          bannerUrl: e.bannerUrl,
          eventDate: e.eventDate.toISOString(),
          eventTime: e.eventTime,
          venue: e.venue,
          registrationDeadline: e.registrationDeadline.toISOString(),
          description: e.description,
        })),
        ...fillers,
      ];
    }

    return combined.map((e) => ({
      id: e.id,
      title: e.title,
      bannerUrl: e.bannerUrl,
      eventDate: e.eventDate.toISOString(),
      eventTime: e.eventTime,
      venue: e.venue,
      registrationDeadline: e.registrationDeadline.toISOString(),
      description: e.description,
    }));
  } catch (error) {
    console.error("[getTopEvents] Database query failed, returning fallback mockups:", error);
    return fallbackMockEvents;
  }
}
