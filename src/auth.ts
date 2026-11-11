import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      approvalStatus?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    approvalStatus?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const loginType = credentials?.loginType
          ? String(credentials.loginType).trim().toUpperCase()
          : null;

        // Strict Scoping Gate: LoginType is strictly required to prevent cross-portal authentication
        if (!loginType) {
          return null;
        }

        // 1. Super Admin Hardcoded Verification (Strictly Scoped)
        if (loginType === "SUPER_ADMIN") {
          const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
          const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "";

          if (email === superAdminEmail && password === superAdminPassword) {
            return {
              id: "super-admin",
              name: "Super Admin",
              email: superAdminEmail,
              role: "SUPER_ADMIN",
              approvalStatus: "APPROVED",
            };
          }
          return null;
        }

        // 2. Database Admin Verification (Strictly Scoped)
        if (loginType === "ADMIN" || loginType === "EXECUTIVE") {
          const admin = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (!admin) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
          if (!isPasswordValid) {
            return null;
          }

          // Check approval status: Pending admins are strictly blocked
          if (admin.approvalStatus === "PENDING") {
            throw new Error("Waiting for approval");
          }

          if (admin.approvalStatus === "REJECTED") {
            throw new Error("Registration request rejected");
          }

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            approvalStatus: admin.approvalStatus,
          };
        }

        // 3. Database Student Member Verification (Strictly Scoped)
        if (loginType === "STUDENT") {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              studentProfile: true,
              alumniProfile: true,
            },
          });

          // Must be a user without an alumni profile
          if (!user || user.alumniProfile || !user.passwordHash) {
            return null;
          }

          if (!user.isActive) {
            throw new Error("Your account is currently deactivated. Please contact support.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) {
            return null;
          }

          // Check approval status: Pending students are strictly blocked
          if (user.approvalStatus === "PENDING") {
            throw new Error("Waiting for approval");
          }

          if (user.approvalStatus === "REJECTED") {
            throw new Error("Registration request rejected");
          }

          return {
            id: user.id,
            name: user.fullName || user.name || "Student Member",
            email: user.email,
            role: "STUDENT",
            approvalStatus: user.approvalStatus,
          };
        }

        // 4. Database Alumni Member Verification (Strictly Scoped)
        if (loginType === "ALUMNI") {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              studentProfile: true,
              alumniProfile: true,
            },
          });

          // Must be a user with an alumni profile
          if (!user || !user.alumniProfile || !user.passwordHash) {
            return null;
          }

          if (!user.isActive) {
            throw new Error("Your account is currently deactivated. Please contact support.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) {
            return null;
          }

          // Check approval status: Pending alumni are strictly blocked
          if (user.approvalStatus === "PENDING") {
            throw new Error("Waiting for approval");
          }

          if (user.approvalStatus === "REJECTED") {
            throw new Error("Registration request rejected");
          }

          return {
            id: user.id,
            name: user.fullName || user.name || "Alumni Member",
            email: user.email,
            role: "ALUMNI",
            approvalStatus: user.approvalStatus,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approvalStatus = user.approvalStatus;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.approvalStatus = token.approvalStatus as string;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
