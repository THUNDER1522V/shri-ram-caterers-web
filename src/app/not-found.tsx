import Link from "next/link";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center py-24">
      <Container className="text-center">
        <p className="font-heading text-sm uppercase tracking-widest text-gold-600">
          404 Error
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 font-body text-base text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
