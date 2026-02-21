import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionWrapper";

export async function CTA() {
  const t = await getTranslations("cta");

  return (
    <section className="section-padding bg-foreground text-background" aria-labelledby="cta-heading">
      <Container>
        <Reveal variant="scale-in">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-h1 font-bold">
              {t("title")}
            </h2>
            <p className="mt-4 text-body text-background/70">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
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
