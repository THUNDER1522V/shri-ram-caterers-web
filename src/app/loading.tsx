import { Container } from "@/components/common/container";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Container className="flex flex-col items-center justify-center space-y-4 text-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-gold-200 border-t-gold-600"
          role="status"
          aria-label="Loading content"
        />
        <span className="sr-only">Loading content...</span>
      </Container>
    </div>
  );
}
