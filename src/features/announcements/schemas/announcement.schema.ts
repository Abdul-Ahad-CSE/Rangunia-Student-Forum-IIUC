import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(10),
  isPinned: z.boolean().default(false),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
