"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center py-24">
      <Container className="text-center">
        <p className="font-heading text-sm uppercase tracking-widest text-gold-600">
          Unexpected Error
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 font-body text-base text-muted-foreground">
          An error occurred while loading this page. Please try again.
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
        </div>
      </Container>
    </main>
  );
}
