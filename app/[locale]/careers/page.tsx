"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  jobs,
  getActiveJobs,
  departments,
  experienceLevelLabels,
  employmentTypeLabels,
  locationTypeLabels,
  formatSalary,
  getRelativeTime,
  type Job,
  type LocationType,
  type ExperienceLevel,
  type EmploymentType,
} from "@/lib/data/jobs";

export default function CareersPage() {
  const t = useTranslations("careers");
  const tA11y = useTranslations("a11y");
  const activeJobs = getActiveJobs();

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<LocationType | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((job) => {
      const matchesDepartment =
        selectedDepartment === "all" || job.department === selectedDepartment;
      const matchesLocation =
        selectedLocation === "all" || job.location.type === selectedLocation;
      const matchesLevel = selectedLevel === "all" || job.level === selectedLevel;
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesDepartment && matchesLocation && matchesLevel && matchesSearch;
    });
  }, [activeJobs, selectedDepartment, selectedLocation, selectedLevel, searchQuery]);

  const clearFilters = () => {
    setSelectedDepartment("all");
    setSelectedLocation("all");
    setSelectedLevel("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedDepartment !== "all" ||
    selectedLocation !== "all" ||
    selectedLevel !== "all" ||
    searchQuery !== "";

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-card border-b border-border">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-h1 font-bold text-foreground">{t("title")}</h1>
            <p className="mt-4 text-h3 font-normal text-muted">
              {t("subtitle")}
            </p>
            <p className="mt-6 text-body text-muted">
              {t("description")}
            </p>
          </div>
        </Container>
      </section>

      {/* Why Join Us */}
      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-h2 font-bold text-foreground text-center mb-12">
              {t("whyUs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t("remoteFirst"),
                  description: t("remoteFirstDesc"),
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  ),
                },
                {
                  title: t("meaningfulWork"),
                  description: t("meaningfulWorkDesc"),
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  ),
                },
                {
                  title: t("growthFocus"),
                  description: t("growthFocusDesc"),
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: t("workLifeBalance"),
                  description: t("workLifeBalanceDesc"),
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" strokeLinecap="round" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                    {item.icon}
                  </div>
                  <h3 className="text-h3 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-small text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Job Listings */}
      <section className="section-padding bg-card/50" id="positions">
        <Container>
          <div className="mb-8">
            <h2 className="text-h2 font-bold text-foreground">{t("openPositions")}</h2>
            <p className="mt-2 text-body text-muted">
              {t("roles", { count: activeJobs.length })}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                aria-label={tA11y("filterByDepartment")}
              >
                <option value="all">{t("allDepartments")}</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as LocationType | "all")}
                className="h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                aria-label={tA11y("filterByLocation")}
              >
                <option value="all">{t("allLocations")}</option>
                {(Object.keys(locationTypeLabels) as LocationType[]).map((loc) => (
                  <option key={loc} value={loc}>
                    {locationTypeLabels[loc]}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as ExperienceLevel | "all")}
                className="h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                aria-label={tA11y("filterByLevel")}
              >
                <option value="all">{t("allLevels")}</option>
                {(Object.keys(experienceLevelLabels) as ExperienceLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {experienceLevelLabels[level]}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-10 px-4 text-small text-muted hover:text-foreground transition-colors"
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>
          </div>

          {/* Job Cards */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <h3 className="mt-4 text-h3 font-semibold text-foreground">
                {t("noPositions")}
              </h3>
              <p className="mt-2 text-body text-muted">
                {t("noPositionsHint")}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-accent hover:underline"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Don't See a Fit */}
      <section className="section-padding">
        <Container size="sm">
          <div className="text-center">
            <h2 className="text-h2 font-bold text-foreground">
              {t("dontSeeRole")}
            </h2>
            <p className="mt-4 text-body text-muted">
              {t("dontSeeRoleDesc")}
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/contact">{t("getInTouch")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function JobCard({ job, t }: { job: Job; t: ReturnType<typeof useTranslations<"careers">> }) {
  return (
    <Link href={`/careers/${job.id}`} className="block group">
      <Card hover className="p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              {job.isUrgent && (
                <Badge variant="accent" className="text-xs">
                  {t("urgent")}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {job.code}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors">
              {job.title}
            </h3>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-muted">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
                {job.department}
                {job.team && ` · ${job.team}`}
              </span>

              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {locationTypeLabels[job.location.type]}
                {job.location.city && ` · ${job.location.city}`}
              </span>

              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
                {employmentTypeLabels[job.employmentType]}
              </span>

              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {experienceLevelLabels[job.level]}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="default" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-start lg:items-end gap-2 lg:min-w-[180px]">
            {job.salary && (
              <p className="text-body font-medium text-foreground">
                {formatSalary(job.salary)}
              </p>
            )}
            <p className="text-small text-muted">
              {t("posted", { time: getRelativeTime(job.postedDate) })}
            </p>
            <span className="text-accent text-small font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              {t("viewDetails")}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
