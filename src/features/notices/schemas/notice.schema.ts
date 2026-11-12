import { z } from "zod";

export const noticeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  date: z.coerce.date({
    message: "Please provide a valid publication date",
  }),
  bannerUrl: z.string().optional().nullable(),
  content: z.string().min(10, "Notice content must be at least 10 characters"),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
