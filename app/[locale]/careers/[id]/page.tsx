import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JobApplicationForm } from "@/components/sections/JobApplicationForm";
import { ShareJob } from "@/components/sections/ShareJob";
import { JsonLd, getJobPostingSchema, getBreadcrumbSchema } from "@/components/seo";
import { siteConfig } from "@/lib/constants";
import {
  jobs,
  getJobById,
  getActiveJobs,
  experienceLevelLabels,
  employmentTypeLabels,
  locationTypeLabels,
  formatSalary,
  formatDate,
  getRelativeTime,
} from "@/lib/data/jobs";

interface JobPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getActiveJobs().map((job) => ({ locale, id: job.id }))
  );
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const job = getJobById(id);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} - Careers`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} at Innovexle`,
      description: job.description.slice(0, 160),
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const job = getJobById(id);

  if (!job || !job.isActive) {
    notFound();
  }

  const isExpired = job.applicationDeadline
    ? new Date(job.applicationDeadline) < new Date()
    : false;

  return (
    <>
      <JsonLd
        data={getJobPostingSchema({
          title: job.title,
          description: job.description,
          datePosted: job.postedDate,
          validThrough: job.applicationDeadline,
          employmentType: job.employmentType,
          locationType: job.location.type,
          salaryMin: job.salary?.min,
          salaryMax: job.salary?.max,
          salaryCurrency: job.salary?.currency,
          city: job.location.city,
          country: job.location.country,
        })}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Careers", url: `${siteConfig.url}/careers` },
          { name: job.title },
        ])}
      />

      {/* Breadcrumb & Header */}
      <section className="section-padding pb-8">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-small text-muted">
              <li>
                <Link href="/careers" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
              <li className="text-foreground">{job.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {job.isUrgent && (
                  <Badge variant="accent">Hiring Urgently</Badge>
                )}
                <Badge variant="outline">{job.code}</Badge>
                <Badge variant="outline">{job.department}</Badge>
              </div>

              {/* Title */}
              <h1 className="text-h1 font-bold text-foreground">{job.title}</h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-body text-muted">
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {locationTypeLabels[job.location.type]}
                  {job.location.city && `, ${job.location.city}`}
                  {job.location.country && `, ${job.location.country}`}
                </span>

                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" />
                  </svg>
                  {employmentTypeLabels[job.employmentType]}
                </span>

                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  {experienceLevelLabels[job.level]}
                </span>
              </div>

              {job.location.timezone && (
                <p className="text-small text-muted">
                  Timezone: {job.location.timezone}
                </p>
              )}
            </div>

            {/* Salary & Apply */}
            <div className="lg:text-right space-y-4">
              {job.salary && (
                <div>
                  <p className="text-h2 font-bold text-foreground">
                    {formatSalary(job.salary)}
                  </p>
                  <p className="text-small text-muted capitalize">
                    per {job.salary.period.replace("ly", "")}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button asChild size="lg" disabled={isExpired}>
                  <a href="#apply">{isExpired ? "Position Closed" : "Apply Now"}</a>
                </Button>
                <p className="text-small text-muted">
                  Posted {getRelativeTime(job.postedDate)}
                </p>
                {job.applicationDeadline && (
                  <p className={`text-small ${isExpired ? "text-red-500" : "text-muted"}`}>
                    {isExpired ? "Deadline passed" : `Apply by ${formatDate(job.applicationDeadline)}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="section-padding pt-0">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-4">
                  About the Role
                </h2>
                <p className="text-body text-muted leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-4">
                  What You&apos;ll Do
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-body text-muted">
                      <svg
                        className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-body text-muted">
                      <svg
                        className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to Have */}
              {job.niceToHave.length > 0 && (
                <div>
                  <h2 className="text-h2 font-bold text-foreground mb-4">
                    Nice to Have
                  </h2>
                  <ul className="space-y-3">
                    {job.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-body text-muted">
                        <svg
                          className="h-5 w-5 text-muted flex-shrink-0 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application Form */}
              {!isExpired && (
                <div id="apply" className="scroll-mt-24">
                  <h2 className="text-h2 font-bold text-foreground mb-4">
                    Apply for this Position
                  </h2>
                  <JobApplicationForm jobId={job.id} jobTitle={job.title} jobCode={job.code} />
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Skills */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-h3 font-semibold text-foreground mb-4">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-h3 font-semibold text-foreground mb-4">
                  Benefits & Perks
                </h3>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-small text-muted">
                      <svg
                        className="h-4 w-4 text-accent flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Info */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-h3 font-semibold text-foreground mb-4">
                  Quick Info
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small font-medium text-muted">Job Code</dt>
                    <dd className="text-body text-foreground">{job.code}</dd>
                  </div>
                  <div>
                    <dt className="text-small font-medium text-muted">Department</dt>
                    <dd className="text-body text-foreground">
                      {job.department}
                      {job.team && ` · ${job.team}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small font-medium text-muted">Location</dt>
                    <dd className="text-body text-foreground">
                      {locationTypeLabels[job.location.type]}
                      {job.location.city && `, ${job.location.city}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small font-medium text-muted">Employment Type</dt>
                    <dd className="text-body text-foreground">
                      {employmentTypeLabels[job.employmentType]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small font-medium text-muted">Experience Level</dt>
                    <dd className="text-body text-foreground">
                      {experienceLevelLabels[job.level]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small font-medium text-muted">Posted</dt>
                    <dd className="text-body text-foreground">{formatDate(job.postedDate)}</dd>
                  </div>
                </dl>
              </div>

              {/* Share */}
              <ShareJob jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </Container>
      </section>

      {/* Related Jobs */}
      <section className="section-padding bg-card/50">
        <Container>
          <h2 className="text-h2 font-bold text-foreground mb-8">
            Other Open Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getActiveJobs()
              .filter((j) => j.id !== job.id)
              .slice(0, 3)
              .map((relatedJob) => (
                <Link
                  key={relatedJob.id}
                  href={`/careers/${relatedJob.id}`}
                  className="block group"
                >
                  <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg">
                    <Badge variant="outline" className="mb-3">
                      {relatedJob.department}
                    </Badge>
                    <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors">
                      {relatedJob.title}
                    </h3>
                    <p className="mt-2 text-small text-muted">
                      {locationTypeLabels[relatedJob.location.type]} ·{" "}
                      {employmentTypeLabels[relatedJob.employmentType]}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="secondary">
              <Link href="/careers#positions">View all positions</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
