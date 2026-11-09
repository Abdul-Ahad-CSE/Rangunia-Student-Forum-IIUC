import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  photoUrl: z
    .string()
    .min(1, "Profile photo URL is required")
    .url("Please provide a valid photo URL (e.g. https://...)"),
  studentId: z
    .string()
    .min(3, "IIUC Student ID is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Student ID can only contain letters, numbers, and dashes"),
  department: z.string().min(2, "Department is required (e.g., CSE, EEE, BBA)"),
  section: z.string().min(1, "Section/Semester is required (e.g., 5A, 4B)"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
  position: z
    .string()
    .min(2, "Position in forum is required (e.g., General Executive)"),
  enrollment: z
    .string()
    .min(3, "Enrollment session is required (e.g., Spring 24, Autumn 23)"),
  currentAddress: z
    .string()
    .min(3, "Current address in Chittagong/Kumira is required"),
  permanentAddress: z
    .string()
    .min(3, "Permanent address in Rangunia is required"),
  // Gender feature: strictly enforces "Male" at schema level
  gender: z.literal("Male", {
    message:
      "Only male executives can register directly online. We care about privacy, please contact female executive coordinators.",
  }),
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
