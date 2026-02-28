export const siteConfig = {
  name: "Innovexle",
  description:
    "Your vision. Our craft. Full-stack engineering that ships. Fintech, SaaS, healthcare, AI  - we listen, build, and stick around.",
  url: "https://innovexle.com",
  ogImage: "https://innovexle.com/og-image.png",
  email: "hello@innovexle.com",
  phones: [
    { number: "+92 318 6618194", href: "tel:+923186618194" },
    { number: "+44 7501 701609", href: "tel:+447501701609" },
  ],
  offices: [
    { city: "Lahore", country: "Pakistan", address: "Lahore, Pakistan" },
    { city: "London", country: "UK", address: "London, UK" },
    { city: "Manchester", country: "UK", address: "Manchester, UK" },
    { city: "USA", address: "USA" },
  ],
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
      "We listen first. Your constraints, your goals, your reality. No assumptions.",
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "We design for where you're going  - not just where you are. Everything documented.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We ship. Production-ready, tested, monitored. Code you can actually maintain.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "We stick around. Iterate, optimize, fix what breaks. Your systems get better over time.",
  },
];

/** Only technologies with official logos. Stacks (MERN, Python, etc.) are in hero/services copy. */
export const techStack: { name: string; logo: string }[] = [
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
      "They rebuilt our API layer in 8 weeks. Zero downtime migration, 3x throughput improvement. The team communicated clearly at every step.",
    author: "Engineering Lead",
    role: "Series B Fintech",
  },
  {
    quote:
      "Finally, engineers who understand that reliability is a feature, not an afterthought. Our uptime went from 99.5% to 99.99%.",
    author: "CTO",
    role: "Healthcare Platform",
  },
  {
    quote:
      "Our infrastructure costs dropped 40% after their optimization work. ROI was immediate and the documentation they left behind was excellent.",
    author: "VP Engineering",
    role: "E-commerce Scale-up",
  },
  {
    quote:
      "The migration was seamless  - zero downtime, zero data loss. Our deployment frequency went from monthly to daily.",
    author: "Head of Platform",
    role: "SaaS Enterprise",
  },
  {
    quote:
      "They didn't just fix our performance issues  - they taught our team how to prevent them. That knowledge transfer was invaluable.",
    author: "Senior Architect",
    role: "AdTech Leader",
  },
  {
    quote:
      "From day one they challenged our assumptions and proposed a simpler architecture. Saved us six months of work we didn't need to do.",
    author: "Founder & CEO",
    role: "Cloud Startup",
  },
];
