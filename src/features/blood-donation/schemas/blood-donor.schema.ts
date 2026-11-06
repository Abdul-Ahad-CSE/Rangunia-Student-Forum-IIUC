import { z } from "zod";
import { bloodGroupEnum } from "@/features/students/schemas/student-profile.schema";

export const bloodDonorSchema = z.object({
  bloodGroup: bloodGroupEnum,
  isAvailable: z.boolean().default(false),
  lastDonationDate: z.coerce.date().optional().nullable(),
  totalDonations: z.number().int().min(0).default(0),
  emergencyContact: z
    .string()
    .regex(/^(\+8801|01)[3-9]\d{8}$/, "Valid Bangladesh phone number required")
    .optional()
    .or(z.literal("")),
  preferredDonationArea: z.string().max(100).default("Rangunia"),
  hideContactUnlessEmergency: z.boolean().default(true),
  medicalNotes: z.string().max(500).optional(),
});

export type BloodDonorInput = z.infer<typeof bloodDonorSchema>;
