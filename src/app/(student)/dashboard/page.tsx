import { Container } from "@/components/shared/container";

export default function StudentDashboardPage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the student portal. Access announcements, events, and community features.
        </p>
      </Container>
    </div>
  );
}
