import { Role, VerificationStatus, BloodGroup } from "@prisma/client";

export type { Role, VerificationStatus, BloodGroup };

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  verificationStatus: VerificationStatus;
}
