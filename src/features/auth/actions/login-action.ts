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

export async function loginWithCredentialsAction(
  emailInput: string,
  passwordInput: string
): Promise<LoginResponse> {
  try {
    const email = emailInput.toLowerCase().trim();
    const password = passwordInput;

    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "").toLowerCase().trim();
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "";

    // 1. Super Admin Check
    if (email === superAdminEmail) {
      if (password !== superAdminPassword) {
        return { success: false, error: "Invalid credentials for Super Admin." };
      }

      try {
        await signIn("credentials", {
          email,
          password,
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

    // 2. Database Admin Check
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: "No account found with this email address." };
    }

    // Explicit approvalStatus checks
    if (admin.approvalStatus === "PENDING") {
      return {
        success: false,
        error: "Your account is awaiting Super Admin approval.",
      };
    }

    if (admin.approvalStatus === "REJECTED") {
      return {
        success: false,
        error:
          admin.rejectionReason ||
          "Your registration has been rejected by the Super Admin.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid password provided." };
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { success: true, redirectTo: "/admin/dashboard" };
    } catch (err) {
      console.error("Admin signIn error:", err);
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
        error:
          err instanceof Error
            ? err.message
            : "Authentication session could not be established.",
      };
    }
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
