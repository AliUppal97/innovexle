import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="section-padding bg-foreground text-background" aria-labelledby="cta-heading">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="cta-heading" className="text-h1 font-bold">
            Ready to scale?
          </h2>
          <p className="mt-4 text-body text-background/70">
            Let&apos;s discuss your infrastructure challenges and how we can help.
          </p>
          <div className="mt-8">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/contact">Talk to an engineer</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
