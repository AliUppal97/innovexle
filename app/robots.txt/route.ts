import { siteConfig } from "@/lib/constants";

export function GET() {
  const robots = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
  ].join("\n");

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
