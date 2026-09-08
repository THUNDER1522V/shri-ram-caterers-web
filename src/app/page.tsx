import { Container } from "@/components/common/container";

export default function HomePage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      {/* Foundation shell: Prepared for section-by-section implementation per homepage_blueprints */}
      <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Shri Ram Caterers
        </h1>
        <p className="mt-4 font-body text-base text-muted-foreground md:text-lg">
          Production foundation ready.
        </p>
      </Container>
    </main>
  );
}
