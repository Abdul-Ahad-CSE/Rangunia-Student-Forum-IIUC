import { Role } from "@prisma/client";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden: Insufficient privileges") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Validates that an actor holds one of the authorized roles.
 * Throws ForbiddenError if permission is denied.
 */
export function assertRole(actorRole: Role | undefined, allowedRoles: Role[]): void {
  if (!actorRole) {
    throw new UnauthorizedError();
  }

  if (!allowedRoles.includes(actorRole)) {
    throw new ForbiddenError();
  }
}

/**
 * Checks if actor can access administrative capabilities.
 */
export function isAdministrator(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.ADMIN;
}

/**
 * Enforces privacy boundaries on student profile data.
 * Contact details (phone, email, addresses) are omitted unless:
 * 1. The viewer is the owner of the profile.
 * 2. The viewer is an administrator (SUPER_ADMIN or ADMIN).
 * 3. The field is explicitly toggled public by the student.
 */
export function sanitizeStudentProfile<
  T extends {
    userId: string;
    phone?: string | null;
    whatsapp?: string | null;
    presentAddress?: string | null;
    permanentAddress?: string | null;
    isPhonePublic: boolean;
    isAddressPublic: boolean;
    isProfilePublic: boolean;
  }
>(
  profile: T,
  viewer: { id?: string; role?: Role } | null
): Partial<T> {
  const isOwner = viewer?.id === profile.userId;
  const isAdmin = viewer?.role ? isAdministrator(viewer.role) : false;

  if (isOwner || isAdmin) {
    return profile;
  }

  // If entire profile is marked private and viewer is neither owner nor admin
  if (!profile.isProfilePublic) {
    return {
      userId: profile.userId,
      isProfilePublic: false,
    } as unknown as Partial<T>;
  }

  return {
    ...profile,
    phone: profile.isPhonePublic ? profile.phone : null,
    whatsapp: profile.isPhonePublic ? profile.whatsapp : null,
    presentAddress: profile.isAddressPublic ? profile.presentAddress : null,
    permanentAddress: profile.isAddressPublic ? profile.permanentAddress : null,
  };
}
