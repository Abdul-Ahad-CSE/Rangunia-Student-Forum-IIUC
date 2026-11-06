import { z } from "zod";

export const bloodGroupEnum = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

export const studentProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  studentId: z.string().min(6, "Valid IIUC student ID required").max(30),
  department: z.string().min(2, "Department is required").max(50),
  academicSession: z.string().min(4, "Session is required (e.g., Autumn 2021)"),
  batch: z.string().optional(),
  phone: z.string().regex(/^(\+8801|01)[3-9]\d{8}$/, "Valid Bangladesh phone number required").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  presentAddress: z.string().max(255).optional(),
  permanentAddress: z.string().max(255).optional(),
  upazila: z.string().default("Rangunia"),
  unionWard: z.string().optional(),
  bloodGroup: bloodGroupEnum.optional(),

  // Privacy controls: default to strictly private
  isProfilePublic: z.boolean().default(false),
  isPhonePublic: z.boolean().default(false),
  isEmailPublic: z.boolean().default(false),
  isAddressPublic: z.boolean().default(false),
  showInDirectory: z.boolean().default(false),
});

export const studentVerificationSchema = z.object({
  idCardImageUrl: z.string().url("Valid ID card document URL required"),
  supportingDocUrl: z.string().url().optional().or(z.literal("")),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type StudentVerificationInput = z.infer<typeof studentVerificationSchema>;
