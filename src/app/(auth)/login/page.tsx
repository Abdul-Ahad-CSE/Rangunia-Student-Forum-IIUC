import { Container } from "@/components/shared/container";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Container className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">Student Login</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to access your Rangunia Students Forum profile and services.
        </p>
      </Container>
    </div>
  );
}
