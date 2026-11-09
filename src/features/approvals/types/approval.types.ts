export type SerializedPendingMember = {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  role: string;
  department: string;
  session: string;
  phone: string | null;
  bloodGroup: string | null;
  address: string | null;
  approvalStatus: string;
  verificationStatus: string;
  photoUrl: string | null;
  createdAt: string;
  isAlumni: boolean;
  jobPosition?: string | null;
  company?: string | null;
  currentSemester?: string | null;
};

export type ApprovalActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};
