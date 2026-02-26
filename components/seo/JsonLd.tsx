import { siteConfig } from "@/lib/constants";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  sameAs: string[];
  contactPoint: {
    "@type": "ContactPoint";
    email: string;
    telephone?: string;
    contactType: string;
    areaServed?: string[];
  };
  address?: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
}

interface ServiceSchema {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
  serviceType: string;
  areaServed: string;
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

type SchemaType =
  | OrganizationSchema
  | WebSiteSchema
  | ServiceSchema
  | FAQPageSchema
  | BreadcrumbSchema;

interface JsonLdProps {
  data: SchemaType | SchemaType[] | ReturnType<typeof getJobPostingSchema>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Pre-built schema generators
export function getOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      telephone: siteConfig.phones.map((p) => p.number.replace(/\s/g, "")).join(", "),
      contactType: "customer service",
      areaServed: siteConfig.offices.map((o) => o.country || o.address),
    },
    address: (() => {
      const primary = siteConfig.offices[0];
      return {
        "@type": "PostalAddress" as const,
        addressLocality: primary.city,
        ...(primary.region && { addressRegion: primary.region }),
        addressCountry: primary.country || primary.address,
      };
    })(),
  };
}

export function getWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function getServiceSchema(
  name: string,
  description: string,
  serviceType: string
): ServiceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    serviceType,
    areaServed: "Worldwide",
  };
}

export function getFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getJobPostingSchema(job: {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType: string;
  locationType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  city?: string;
  country?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    jobLocationType: job.locationType === "remote" ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.country || "US",
    },
    ...(job.salaryMin &&
      job.salaryMax && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: job.salaryCurrency || "USD",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: "YEAR",
          },
        },
      }),
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}
