import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title is too long"),
  bannerUrl: z.string().optional().nullable(),
  eventDate: z.coerce.date({
    message: "Please provide a valid event date",
  }),
  eventTime: z.string().min(2, "Event time is required (e.g. 3:00 PM - 6:00 PM)"),
  venue: z.string().min(2, "Venue is required"),
  registrationDeadline: z.coerce.date({
    message: "Please provide a valid registration deadline",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  postEventRecap: z.string().optional().nullable(),
  postEventPhotos: z.array(z.string()).default([]),
});

export type EventInput = z.infer<typeof eventSchema>;

export const eventRecapSchema = z.object({
  postEventRecap: z.string().min(5, "Recap summary must be at least 5 characters"),
  postEventPhotos: z.array(z.string()).default([]),
});

export type EventRecapInput = z.infer<typeof eventRecapSchema>;
