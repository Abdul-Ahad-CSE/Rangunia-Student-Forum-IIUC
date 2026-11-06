import { Container } from "@/components/shared/container";

export default function StudentProfilePage() {
  return (
    <div className="py-10">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">Student Profile & Privacy Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information, privacy visibility, and student verification.
        </p>
      </Container>
    </div>
  );
}
