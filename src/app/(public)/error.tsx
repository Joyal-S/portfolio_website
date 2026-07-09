"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <Container className="text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </div>
  );
}
