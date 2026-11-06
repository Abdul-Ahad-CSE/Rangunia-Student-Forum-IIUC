import * as React from "react";
import { Container } from "@/components/shared/container";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-6 py-4">
        <Container className="flex items-center justify-between">
          <span className="font-semibold text-lg">RSF Administration</span>
          <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded font-mono font-medium">
            RESTRICTED ACCESS
          </span>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
