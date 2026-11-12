import { z } from "zod";

export const activitySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  date: z.coerce.date({
    message: "Please provide a valid activity date",
  }),
  time: z.string().min(2, "Activity time is required (e.g. 10:00 AM - 1:00 PM)"),
  location: z.string().min(2, "Activity location is required"),
  photos: z.array(z.string()).default([]),
  description: z.string().min(10, "Activity description must be at least 10 characters"),
});

export type ActivityInput = z.infer<typeof activitySchema>;
