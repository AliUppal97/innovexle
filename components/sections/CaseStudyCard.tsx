import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Counter } from "@/components/ui/Counter";
import type { CaseStudy } from "@/lib/data/case-studies";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  featured?: boolean;
}

export async function CaseStudyCard({ caseStudy, featured = false }: CaseStudyCardProps) {
  const t = await getTranslations("caseStudies");

  return (
    <Card hover className={`h-full ${featured ? "lg:col-span-1" : ""}`}>
      <CardHeader>
        <Badge variant="outline" className="mb-3 w-fit">
          {caseStudy.industry}
        </Badge>
        <CardTitle className="group-hover:text-accent transition-colors">
          {caseStudy.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-2">
            {t("problem")}
          </h4>
          <p className="text-small text-muted line-clamp-3">{caseStudy.problem}</p>
        </div>

        <div>
          <h4 className="text-small font-semibold text-foreground uppercase tracking-wider mb-3">
            {t("results")}
          </h4>
          <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-3">
            {caseStudy.results.map((result) => (
              <div key={result.metric} className="text-center">
                <Counter value={result.value} className="text-h3 font-bold text-accent" />
                <p className="text-small text-muted">{result.metric}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {caseStudy.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-small font-medium text-foreground group-hover:text-accent transition-colors">
          {t("readMore")}
          <svg
            className="h-4 w-4 group-hover:translate-x-1 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
