export const siteConfig = {
  name: "Innovexle",
  description:
    "Backend engineering for companies that can't afford downtime. We build systems that scale.",
  url: "https://innovexle.com",
  ogImage: "https://innovexle.com/og-image.png",
  email: "hello@innovexle.com",
  links: {
    github: "https://github.com/innovexle",
    linkedin: "https://linkedin.com/company/innovexle",
    twitter: "https://twitter.com/innovexle",
  },
};

export const navigation = [
  { name: "Services", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Careers", href: "/careers" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const footerNavigation = {
  company: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by understanding your constraints, scale requirements, and business objectives. No assumptions.",
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "We design systems that anticipate growth. Every decision is documented and justified.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We ship production-ready code with comprehensive testing, monitoring, and documentation.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "We monitor, iterate, and optimize. Your systems improve continuously.",
  },
];

export const techStack = [
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "Google Cloud", logo: "/logos/gcp.svg" },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
  { name: "Redis", logo: "/logos/redis.svg" },
  { name: "Kubernetes", logo: "/logos/kubernetes.svg" },
  { name: "Docker", logo: "/logos/docker.svg" },
];

export const testimonials = [
  {
    quote:
      "They rebuilt our API layer in 8 weeks. Zero downtime migration, 3x throughput improvement.",
    author: "Engineering Lead",
    company: "Series B Fintech",
  },
  {
    quote:
      "Finally, engineers who understand that reliability is a feature, not an afterthought.",
    author: "CTO",
    company: "Healthcare Platform",
  },
  {
    quote:
      "Our infrastructure costs dropped 40% after their optimization work. ROI was immediate.",
    author: "VP Engineering",
    company: "E-commerce Scale-up",
  },
];
