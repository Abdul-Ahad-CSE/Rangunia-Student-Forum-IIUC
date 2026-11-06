import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rangunia Students Forum (IIUC) | Official Platform",
  description:
    "The official university platform uniting Rangunia students and alumni at International Islamic University Chittagong (IIUC). Community connection, emergency blood donor network, events, and academic mentorship.",
  keywords: [
    "Rangunia Students Forum",
    "IIUC",
    "International Islamic University Chittagong",
    "Rangunia",
    "Student Community",
    "Blood Donor Network",
    "Chittagong",
  ],
  authors: [{ name: "Rangunia Students Forum" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06130d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
