import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container className="text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact me</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
