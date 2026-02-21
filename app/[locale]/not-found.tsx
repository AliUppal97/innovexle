import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Page not found",
};

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <section className="section-padding min-h-[60vh] flex items-center">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-h1 sm:text-display font-bold text-accent">404</p>
          <h1 className="mt-4 text-h3 sm:text-h1 font-bold text-foreground">
            {t("notFound")}
          </h1>
          <p className="mt-4 text-body text-muted">
            {t("notFoundDesc")}
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">{t("backToHome")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
