import { z } from "zod";

export const alumniRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  studentId: z
    .string()
    .min(3, "IIUC Student ID is required (e.g. C173045)")
    .max(30, "Student ID too long"),
  email: z
    .string()
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  gender: z.literal("Male", {
    message:
      "Online self-registration is currently restricted to Male members. Female alumni please contact female executives.",
  }),
  photoUrl: z.string().optional().or(z.literal("")),
  department: z
    .string()
    .min(2, "Graduated Department is required (e.g. CSE, EEE, BBA, Pharmacy)"),
  session: z
    .string()
    .min(2, "Enrollment Session is required (e.g. Autumn 2016, Spring 2018)"),
  batch: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .min(6, "Phone number is required"),
  permanentAddress: z
    .string()
    .min(3, "Permanent address in Rangunia is required"),
  presentAddress: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional().or(z.literal("")),
});

export type AlumniRegisterInput = z.infer<typeof alumniRegisterSchema>;
