import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionWrapper";

export async function CTA() {
  const t = await getTranslations("cta");

  return (
    <section className="section-padding bg-card border-y border-border" aria-labelledby="cta-heading">
      <Container>
        <Reveal variant="scale-in">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-heading" className="text-h3 sm:text-h2 lg:text-h1 font-bold text-foreground">
              {t("title")}
            </h2>
            <p className="mt-4 text-body text-muted">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
              >
                <Link href="/contact">{t("button")}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
