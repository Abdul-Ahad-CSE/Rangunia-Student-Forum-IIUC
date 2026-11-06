import { Container } from "@/components/shared/container";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Container className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">Student Registration</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Create an account to join the Rangunia Students Forum (IIUC) network.
        </p>
      </Container>
    </div>
  );
}
