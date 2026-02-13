import { Container } from "@/components/ui/Container";
import { processSteps } from "@/lib/constants";

export function Process() {
  return (
    <section className="section-padding" aria-labelledby="process-heading">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="process-heading" className="text-h1 font-bold text-foreground">
            How we work
          </h2>
          <p className="mt-4 text-body text-muted">
            A structured approach that delivers predictable outcomes.
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Connection line */}
          <div
            className="absolute top-8 left-8 right-8 h-px bg-border hidden lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  {/* Step number */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-background text-foreground font-bold text-h3 relative z-10">
                    {step.step}
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-h3 font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-body text-muted">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < processSteps.length - 1 && (
                  <div className="flex justify-center mt-8 lg:hidden" aria-hidden="true">
                    <svg
                      className="h-6 w-6 text-border"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
