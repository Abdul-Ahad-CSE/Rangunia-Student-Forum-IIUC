import { Container } from "@/components/shared/container";

export default function AdminDashboardPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground mt-2">
          Manage student verifications, role assignments, audit logs, and system configuration.
        </p>
      </Container>
    </div>
  );
}
