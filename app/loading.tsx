import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <section className="section-padding min-h-[60vh] flex items-center justify-center">
      <Container>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
        </div>
      </Container>
    </section>
  );
}
