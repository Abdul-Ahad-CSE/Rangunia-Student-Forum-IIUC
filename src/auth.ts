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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "";

        // 1. Super Admin Hardcoded Verification (Bypasses Database)
        if (email === superAdminEmail && password === superAdminPassword) {
          return {
            id: "super-admin",
            name: "Super Admin",
            email: superAdminEmail,
            role: "SUPER_ADMIN",
            approvalStatus: "APPROVED",
          };
        }

        // 2. Database Admin Verification
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!admin) {
          return null;
        }

        // Check approval status: Pending admins are explicitly blocked
        if (admin.approvalStatus === "PENDING") {
          throw new Error("Your account is awaiting Super Admin approval.");
        }

        if (admin.approvalStatus === "REJECTED") {
          throw new Error("Your registration has been rejected by Super Admin.");
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          approvalStatus: admin.approvalStatus,
        };
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
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
