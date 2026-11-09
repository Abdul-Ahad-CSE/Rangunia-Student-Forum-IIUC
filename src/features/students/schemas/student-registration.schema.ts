import { z } from "zod";

export const studentRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  studentId: z
    .string()
    .min(3, "IIUC Student ID is required (e.g. C213045)")
    .max(30, "Student ID too long"),
  email: z
    .string()
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  gender: z.literal("Male", {
    message:
      "Online self-registration is currently restricted to Male students. Female students please contact female executives.",
  }),
  photoUrl: z.string().optional().or(z.literal("")),
  department: z
    .string()
    .min(2, "Department is required (e.g. CSE, EEE, BBA, Pharmacy)"),
  university: z
    .string()
    .min(2, "University is required"),
  batch: z
    .string()
    .min(1, "Batch is required (e.g. 48th, 49th, 50th)"),
  session: z
    .string()
    .min(2, "Session is required (e.g. Autumn 2021, Spring 2024)"),
  currentSemester: z
    .string()
    .min(1, "Current semester is required (e.g. 1st, 4th, 8th)"),
  bloodGroup: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .min(6, "Phone number is required for emergency and contact purposes"),
  address: z
    .string()
    .min(3, "Address / Union in Rangunia is required (e.g. Betagi, Rangunia)"),
  facebook: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional().or(z.literal("")),
});

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
