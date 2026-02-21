import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { TechLogo } from "@/components/ui/TechLogo";
import { techStack } from "@/lib/constants";

export async function Trust() {
  const t = await getTranslations("trust");
  const testimonials = t.raw("testimonials") as Array<{ quote: string; author: string; role: string }>;

  return (
    <section className="section-padding" aria-labelledby="trust-heading">
      <Container>
        {/* Tech Stack */}
        <Reveal>
          <div className="text-center">
            <h2 id="trust-heading" className="text-small font-semibold text-muted uppercase tracking-wider">
              {t("techStackTitle")}
            </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 gap-y-4 sm:gap-x-8 sm:gap-y-6 md:gap-12">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
              >
                <TechLogo src={tech.logo} name={tech.name} />
                <span className="text-small font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Testimonials */}
        <div className="mt-20">
          <Reveal>
            <h3 className="text-center text-small font-semibold text-muted uppercase tracking-wider mb-12">
              {t("testimonialsTitle")}
            </h3>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
              <figure
                className="rounded-lg border border-border bg-card p-6 h-full flex flex-col justify-between"
              >
                <blockquote className="text-body text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 pt-4 border-t border-border">
                  <p className="text-small font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-small text-muted">{testimonial.role}</p>
                </figcaption>
              </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}

