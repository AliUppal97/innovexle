import { MetadataRoute } from "next";
import { siteConfig, careersEnabled } from "@/lib/constants";
import { getActiveJobs } from "@/lib/data/jobs";
import { services } from "@/lib/data/services";
import { caseStudies } from "@/lib/data/case-studies";
import { locales, defaultLocale } from "@/i18n/config";

interface SitemapEntry {
  route: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastModified?: Date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: SitemapEntry[] = [
    { route: "", priority: 1, changeFrequency: "weekly" },
    { route: "/services", priority: 0.9, changeFrequency: "weekly" },
    { route: "/case-studies", priority: 0.9, changeFrequency: "weekly" },
    ...(careersEnabled ? [{ route: "/careers", priority: 0.9, changeFrequency: "weekly" }] as const : []),
    { route: "/about", priority: 0.8, changeFrequency: "monthly" },
    { route: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { route: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
    { route: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { route: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const serviceRoutes: SitemapEntry[] = services.map((service) => ({
    route: `/services/${service.id}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const caseStudyRoutes: SitemapEntry[] = caseStudies.map((cs) => ({
    route: `/case-studies/${cs.id}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const jobs = careersEnabled ? getActiveJobs() : [];
  const jobRoutes: SitemapEntry[] = jobs.map((job) => ({
    route: `/careers/${job.id}`,
    priority: 0.7,
    changeFrequency: "weekly",
    lastModified: new Date(job.postedDate),
  }));

  const allRoutes = [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...jobRoutes];

  const entries: MetadataRoute.Sitemap = [];

  for (const { route, priority, changeFrequency, lastModified } of allRoutes) {
    const alternates: Record<string, string> = {};
    for (const locale of locales) {
      const prefix = locale === defaultLocale ? "" : `/${locale}`;
      alternates[locale] = `${baseUrl}${prefix}${route}`;
    }

    entries.push({
      url: `${baseUrl}${route}`,
      lastModified: lastModified || new Date(),
      changeFrequency,
      priority,
      alternates: { languages: alternates },
    });
  }

  return entries;
}
