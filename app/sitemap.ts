import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getActiveJobs } from "@/lib/data/jobs";

interface SitemapEntry {
  route: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastModified?: Date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: SitemapEntry[] = [
    { route: "", priority: 1, changeFrequency: "weekly" },
    { route: "/services", priority: 0.9, changeFrequency: "weekly" },
    { route: "/case-studies", priority: 0.9, changeFrequency: "weekly" },
    { route: "/careers", priority: 0.9, changeFrequency: "weekly" },
    { route: "/about", priority: 0.8, changeFrequency: "monthly" },
    { route: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { route: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { route: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  // Dynamic job pages
  const jobs = getActiveJobs();
  const jobRoutes: SitemapEntry[] = jobs.map((job) => ({
    route: `/careers/${job.id}`,
    priority: 0.7,
    changeFrequency: "weekly",
    lastModified: new Date(job.postedDate),
  }));

  const allRoutes = [...staticRoutes, ...jobRoutes];

  return allRoutes.map(({ route, priority, changeFrequency, lastModified }) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  }));
}
