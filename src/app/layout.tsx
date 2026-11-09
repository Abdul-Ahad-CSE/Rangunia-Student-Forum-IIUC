import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
