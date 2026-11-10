export interface MaskedDirectoryMember {
  id: string;
  fullName: string;
  studentId: string;
  department: string;
  session: string;
  batch: string | null;
  bloodGroup: string | null;
  bio: string | null;
  isAlumni: boolean;

  // Server-masked sensitive attributes
  photoUrl: string | null;
  phone: string | null;
  email: string | null;
  permanentAddress: string | null;
  presentAddress: string | null;
  socialLinks: Record<string, string> | null;

  studentProfile?: {
    currentSemester: string;
    cgpa: string | null;
    skills: string[];
    interestedSector: string | null;
    clubRole: string | null;
    cvUrl: string | null;
  } | null;

  alumniProfile?: {
    company: string | null;
    jobPosition: string | null;
    industry: string | null;
    workLocation: string | null;
    passingYear: string | null;
    graduationYear: string | null;
    mentorshipAvailable: boolean;
  } | null;
}

export interface DirectoryFilterParams {
  search?: string;
  tab?: "students" | "alumni" | "all";
  batch?: string;
  department?: string;
  profession?: string;
  bloodGroup?: string;
  city?: string;
}

export interface DirectoryFilterOptions {
  departments: string[];
  batches: string[];
  bloodGroups: Array<{ label: string; value: string }>;
  professions: string[];
  cities: string[];
}
