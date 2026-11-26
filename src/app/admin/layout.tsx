import * as React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-zinc-50 dark:bg-[#040907] text-zinc-900 dark:text-white transition-colors duration-200">{children}</div>;
}
