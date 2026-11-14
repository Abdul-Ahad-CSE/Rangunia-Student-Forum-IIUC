import { z } from "zod";

export const committeeMemberSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(["ADVISOR", "EXECUTIVE"], {
      message: "Please select member type (Advisor or Executive)",
    }),
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Name is too long"),
    photoUrl: z.string().min(1, "Photo URL is required"),
    gender: z.string().min(1, "Please specify gender"),
    department: z
      .string()
      .min(2, "Department is required (e.g., CSE, EEE, Pharmacy)"),
    designation: z
      .string()
      .min(2, "Designation is required (e.g., President, Advisor, General Secretary)"),
    quote: z
      .string()
      .min(5, "Inspiring quote or statement must be at least 5 characters")
      .max(600, "Quote is too long (maximum 600 characters)"),
    rank: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = Number(val);
        return isNaN(parsed) ? null : parsed;
      },
      z.number().nullable().optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "EXECUTIVE") {
      if (data.rank === null || data.rank === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rank is required for executive members (e.g. 1.0, 1.1, 2.0)",
          path: ["rank"],
        });
      } else if (data.rank <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rank must be a positive number greater than 0",
          path: ["rank"],
        });
      }
    }
  });

export type CommitteeMemberInput = z.infer<typeof committeeMemberSchema>;
