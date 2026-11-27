import { PrismaClient } from "@prisma/client";

function sanitizeDatabaseUrl(): string | undefined {
  if (!process.env.DATABASE_URL) return undefined;

  let url = process.env.DATABASE_URL.trim();
  // Strip surrounding single or double quotes
  url = url.replace(/^["']|["']$/g, "").trim();
  // Strip accidental spaces, tabs, or newlines that can happen when pasting into Vercel
  url = url.replace(/[\r\n\t\s]+/g, "");

  // Update process.env.DATABASE_URL so Prisma's Rust engine sees the clean string
  process.env.DATABASE_URL = url;
  return url;
}

const sanitizedUrl = sanitizeDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: sanitizedUrl
      ? {
          db: {
            url: sanitizedUrl,
          },
        }
      : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
