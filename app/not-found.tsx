import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section-padding min-h-[60vh] flex items-center">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-display font-bold text-muted/30">404</p>
          <h1 className="mt-4 text-h1 font-bold text-foreground">
            Page not found
          </h1>
          <p className="mt-4 text-body text-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
