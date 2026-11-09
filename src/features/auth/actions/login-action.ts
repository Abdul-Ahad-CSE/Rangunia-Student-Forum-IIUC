"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";

export type LoginResponse = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

export type LoginType = "SUPER_ADMIN" | "ADMIN" | "STUDENT" | "ALUMNI";

export async function loginWithCredentialsAction(
  emailInput: string,
  passwordInput: string,
  loginTypeInput: string = "STUDENT"
): Promise<LoginResponse> {
  try {
    const email = emailInput.toLowerCase().trim();
    const password = passwordInput;
    const loginType = (loginTypeInput || "STUDENT").toUpperCase().trim() as LoginType;

    // 1. Super Admin Strictly Scoped Check
    if (loginType === "SUPER_ADMIN") {
      const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "").toLowerCase().trim();
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "";

      if (email !== superAdminEmail || password !== superAdminPassword) {
        return { success: false, error: "Invalid credentials for Super Admin." };
      }

      try {
        await signIn("credentials", {
          email,
          password,
          loginType: "SUPER_ADMIN",
          redirect: false,
        });
        return { success: true, redirectTo: "/admin/super" };
      } catch (err) {
        console.error("Super Admin signIn error:", err);
        if (err instanceof AuthError) {
          return {
            success: false,
            error:
              err.type === "CredentialsSignin"
                ? "Invalid email or password."
                : "Authentication failed. Please verify credentials.",
          };
        }
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : "Authentication session could not be established.",
        };
      }
    }

    // 2. Executive Admin Strictly Scoped Check
    if (loginType === "ADMIN") {
      const admin = await prisma.adminUser.findUnique({
        where: { email },
      });

      if (!admin) {
        return { success: false, error: "No executive administrator account found with this email." };
      }

      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isPasswordValid) {
        return { success: false, error: "Invalid password provided." };
      }

      // Explicit approvalStatus checks
      if (admin.approvalStatus === "PENDING") {
        return {
          success: false,
          error: "Waiting for approval",
        };
      }

      if (admin.approvalStatus === "REJECTED") {
        return {
          success: false,
          error: "Registration request rejected",
        };
      }

      try {
        await signIn("credentials", {
          email,
          password,
          loginType: "ADMIN",
          redirect: false,
        });
        return { success: true, redirectTo: "/admin/dashboard" };
      } catch (err) {
        console.error("Admin signIn error:", err);
        const errMsg = err instanceof Error ? err.message : "";
        if (errMsg.includes("Waiting for approval")) {
          return { success: false, error: "Waiting for approval" };
        }
        if (errMsg.includes("Registration request rejected")) {
          return { success: false, error: "Registration request rejected" };
        }
        if (err instanceof AuthError) {
          return {
            success: false,
            error:
              err.type === "CredentialsSignin"
                ? "Invalid email or password."
                : "Authentication failed. Please verify credentials.",
          };
        }
        return {
          success: false,
          error: errMsg || "Authentication session could not be established.",
        };
      }
    }

    // 3. Student Member Strictly Scoped Check
    if (loginType === "STUDENT") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          studentProfile: true,
          alumniProfile: true,
        },
      });

      if (!user) {
        return { success: false, error: "No student account found with this email address." };
      }

      if (user.alumniProfile) {
        return {
          success: false,
          error: "This is an Alumni account. Please switch to the Alumni login portal.",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: "Your account is deactivated. Please contact forum administrators.",
        };
      }

      if (!user.passwordHash) {
        return {
          success: false,
          error: "No password configured for this account. Please reach out for support.",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return { success: false, error: "Invalid password provided." };
      }

      // Explicit approvalStatus checks
      if (user.approvalStatus === "PENDING") {
        return {
          success: false,
          error: "Waiting for approval",
        };
      }

      if (user.approvalStatus === "REJECTED") {
        return {
          success: false,
          error: "Registration request rejected",
        };
      }

      try {
        await signIn("credentials", {
          email,
          password,
          loginType: "STUDENT",
          redirect: false,
        });
        return { success: true, redirectTo: "/profile" };
      } catch (err) {
        console.error("Student signIn error:", err);
        const errMsg = err instanceof Error ? err.message : "";
        if (errMsg.includes("Waiting for approval")) {
          return { success: false, error: "Waiting for approval" };
        }
        if (errMsg.includes("Registration request rejected")) {
          return { success: false, error: "Registration request rejected" };
        }
        if (err instanceof AuthError) {
          return {
            success: false,
            error:
              err.type === "CredentialsSignin"
                ? "Invalid email or password."
                : "Authentication session could not be established.",
          };
        }
        return {
          success: false,
          error: errMsg || "Authentication session could not be established.",
        };
      }
    }

    // 4. Alumni Member Strictly Scoped Check
    if (loginType === "ALUMNI") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          studentProfile: true,
          alumniProfile: true,
        },
      });

      if (!user) {
        return { success: false, error: "No alumni account found with this email address." };
      }

      if (!user.alumniProfile) {
        return {
          success: false,
          error: "This is a Student account. Please switch to the Student login portal.",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: "Your account is deactivated. Please contact forum administrators.",
        };
      }

      if (!user.passwordHash) {
        return {
          success: false,
          error: "No password configured for this account. Please reach out for support.",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return { success: false, error: "Invalid password provided." };
      }

      // Explicit approvalStatus checks
      if (user.approvalStatus === "PENDING") {
        return {
          success: false,
          error: "Waiting for approval",
        };
      }

      if (user.approvalStatus === "REJECTED") {
        return {
          success: false,
          error: "Registration request rejected",
        };
      }

      try {
        await signIn("credentials", {
          email,
          password,
          loginType: "ALUMNI",
          redirect: false,
        });
        return { success: true, redirectTo: "/profile" };
      } catch (err) {
        console.error("Alumni signIn error:", err);
        const errMsg = err instanceof Error ? err.message : "";
        if (errMsg.includes("Waiting for approval")) {
          return { success: false, error: "Waiting for approval" };
        }
        if (errMsg.includes("Registration request rejected")) {
          return { success: false, error: "Registration request rejected" };
        }
        if (err instanceof AuthError) {
          return {
            success: false,
            error:
              err.type === "CredentialsSignin"
                ? "Invalid email or password."
                : "Authentication session could not be established.",
          };
        }
        return {
          success: false,
          error: errMsg || "Authentication session could not be established.",
        };
      }
    }

    return { success: false, error: "Invalid login category selected." };
  } catch (globalError) {
    console.error("Unexpected error in loginWithCredentialsAction:", globalError);
    return {
      success: false,
      error:
        globalError instanceof Error
          ? globalError.message
          : "An unexpected server error occurred during authentication.",
    };
  }
}
