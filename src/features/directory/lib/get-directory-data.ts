import { prisma } from "@/lib/prisma";
import { Prisma, BloodGroup } from "@prisma/client";
import {
  MaskedDirectoryMember,
  DirectoryFilterParams,
  DirectoryFilterOptions,
} from "@/features/directory/types/directory.types";

export async function getDirectoryData(params: DirectoryFilterParams): Promise<{
  members: MaskedDirectoryMember[];
  counts: { total: number; students: number; alumni: number };
  options: DirectoryFilterOptions;
}> {
  const { search, tab = "students", batch, department, profession, bloodGroup, city } = params;

  const conditions: Prisma.UserWhereInput[] = [
    { approvalStatus: "APPROVED" },
    { isActive: true },
  ];

  // Tab Filtering: "students" vs "alumni" vs "all"
  if (tab === "students") {
    conditions.push({ alumniProfile: null });
  } else if (tab === "alumni") {
    conditions.push({ alumniProfile: { isNot: null } });
  }

  // Text Search: Name or Student ID
  if (search && search.trim()) {
    const q = search.trim();
    conditions.push({
      OR: [
        { fullName: { contains: q, mode: "insensitive" } },
        { studentId: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  // Batch Filter
  if (batch && batch !== "ALL") {
    conditions.push({
      OR: [
        { batch: { equals: batch, mode: "insensitive" } },
        { session: { contains: batch, mode: "insensitive" } },
      ],
    });
  }

  // Department Filter
  if (department && department !== "ALL") {
    conditions.push({
      department: { equals: department, mode: "insensitive" },
    });
  }

  // Blood Group Filter
  if (bloodGroup && bloodGroup !== "ALL") {
    conditions.push({
      bloodGroup: bloodGroup as BloodGroup,
    });
  }

  // Profession Filter (Matches jobPosition, company, or industry in alumniProfile)
  if (profession && profession !== "ALL") {
    conditions.push({
      alumniProfile: {
        OR: [
          { jobPosition: { contains: profession, mode: "insensitive" } },
          { company: { contains: profession, mode: "insensitive" } },
          { industry: { contains: profession, mode: "insensitive" } },
        ],
      },
    });
  }

  // Current City / Location Filter (Matches user addresses or alumni workLocation)
  if (city && city !== "ALL") {
    conditions.push({
      OR: [
        { permanentAddress: { contains: city, mode: "insensitive" } },
        { presentAddress: { contains: city, mode: "insensitive" } },
        { alumniProfile: { workLocation: { contains: city, mode: "insensitive" } } },
      ],
    });
  }

  // Parallel query for filtered members and tab counts
  const [rawUsers, studentCount, alumniCount] = await Promise.all([
    prisma.user.findMany({
      where: { AND: conditions },
      include: {
        studentProfile: true,
        alumniProfile: true,
      },
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.user.count({
      where: {
        approvalStatus: "APPROVED",
        isActive: true,
        alumniProfile: null,
      },
    }),
    prisma.user.count({
      where: {
        approvalStatus: "APPROVED",
        isActive: true,
        alumniProfile: { isNot: null },
      },
    }),
  ]);

  // CRITICAL SERVER-SIDE MASKING:
  // Never send unmasked phone, email, photo, social links, or address to the client.
  const members: MaskedDirectoryMember[] = rawUsers.map((u) => {
    return {
      id: u.id,
      fullName: u.fullName,
      studentId: u.studentId,
      department: u.department,
      session: u.session,
      batch: u.batch,
      bloodGroup: u.bloodGroup,
      bio: u.bio,
      isAlumni: Boolean(u.alumniProfile),

      // Strict privacy masking evaluated on server
      photoUrl: u.isPhotoVisible ? u.photoUrl : null,
      phone: u.isPhoneVisible ? u.phone : null,
      email: u.isEmailVisible ? u.email : null,
      permanentAddress: u.isAddressVisible ? u.permanentAddress : null,
      presentAddress: u.isAddressVisible ? u.presentAddress : null,
      socialLinks: u.isSocialVisible
        ? (u.socialLinks as Record<string, string> | null)
        : null,

      studentProfile: u.studentProfile
        ? {
            currentSemester: u.studentProfile.currentSemester,
            cgpa: u.studentProfile.cgpa,
            skills: u.studentProfile.skills,
            interestedSector: u.studentProfile.interestedSector,
            clubRole: u.studentProfile.clubRole,
            cvUrl: u.studentProfile.cvUrl,
          }
        : null,

      alumniProfile: u.alumniProfile
        ? {
            company: u.alumniProfile.company,
            jobPosition: u.alumniProfile.jobPosition,
            industry: u.alumniProfile.industry,
            workLocation: u.alumniProfile.workLocation,
            passingYear: u.alumniProfile.passingYear,
            graduationYear: u.alumniProfile.graduationYear,
            mentorshipAvailable: u.alumniProfile.mentorshipAvailable,
          }
        : null,
    };
  });

  const options: DirectoryFilterOptions = {
    departments: [
      "Computer Science & Engineering (CSE)",
      "Electrical & Electronic Engineering (EEE)",
      "Business Administration (BBA)",
      "Pharmacy",
      "Law",
      "Economics",
      "English Language & Literature",
      "Civil Engineering",
    ],
    batches: [
      "46th",
      "47th",
      "48th",
      "49th",
      "50th",
      "51st",
      "52nd",
      "53rd",
      "54th",
      "55th",
      "56th",
    ],
    bloodGroups: [
      { label: "A+", value: "A_POSITIVE" },
      { label: "A-", value: "A_NEGATIVE" },
      { label: "B+", value: "B_POSITIVE" },
      { label: "B-", value: "B_NEGATIVE" },
      { label: "AB+", value: "AB_POSITIVE" },
      { label: "AB-", value: "AB_NEGATIVE" },
      { label: "O+", value: "O_POSITIVE" },
      { label: "O-", value: "O_NEGATIVE" },
    ],
    professions: [
      "Software Engineer",
      "Lecturer / Faculty",
      "Data Scientist",
      "Banker",
      "Civil Service / Govt Officer",
      "Entrepreneur / Business",
      "Doctor / Pharmacist",
      "Researcher",
    ],
    cities: [
      "Rangunia",
      "Chittagong",
      "Dhaka",
      "Cox's Bazar",
      "Sylhet",
      "Remote / Abroad",
    ],
  };

  return {
    members,
    counts: {
      total: studentCount + alumniCount,
      students: studentCount,
      alumni: alumniCount,
    },
    options,
  };
}
