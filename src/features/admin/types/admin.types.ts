import { Role, VerificationStatus } from "@/types";

export interface UserManagementRecord {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface VerificationReviewPayload {
  verificationId: string;
  userId: string;
  decision: "APPROVED" | "REJECTED";
  reviewerNotes?: string;
}
