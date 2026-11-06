import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Container className="flex flex-col items-center text-center space-y-6 py-20">
        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50">
          Rangunia Students Forum • IIUC
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
          Empowering the Rangunia Student Community at IIUC
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A secure, high-performance community platform connecting students, alumni, blood donors, and academic networks.
        </p>
        <div className="flex gap-4 pt-4">
          <Button variant="default" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </Container>
    </main>
  );
}
