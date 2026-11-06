import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  location: z.string().min(2),
  eventDate: z.coerce.date(),
  registrationDeadline: z.coerce.date().optional(),
  isPublished: z.boolean().default(false),
});

export type EventInput = z.infer<typeof eventSchema>;
