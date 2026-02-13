export interface Service {
  id: string;
  title: string;
  description: string;
  outcomes: string[];
  technologies: string[];
}

export const services: Service[] = [
  {
    id: "api-architecture",
    title: "API Architecture",
    description:
      "Design and implementation of robust, scalable APIs that handle millions of requests. RESTful and GraphQL architectures built for longevity.",
    outcomes: [
      "Sub-100ms response times at scale",
      "Comprehensive API documentation",
      "Versioning strategy that prevents breaking changes",
      "Rate limiting and security hardening",
    ],
    technologies: ["Node.js", "Go", "PostgreSQL", "Redis", "OpenAPI"],
  },
  {
    id: "database-design",
    title: "Database Design",
    description:
      "Data modeling and database architecture that scales with your business. We optimize for both read-heavy and write-heavy workloads.",
    outcomes: [
      "Query performance optimization",
      "Horizontal scaling strategies",
      "Data migration with zero downtime",
      "Backup and disaster recovery plans",
    ],
    technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "TimescaleDB"],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure",
    description:
      "Infrastructure as code, container orchestration, and cloud-native architectures. We build systems that are reproducible and reliable.",
    outcomes: [
      "99.99% uptime SLAs",
      "Auto-scaling that responds to demand",
      "Cost optimization without compromising reliability",
      "Multi-region deployment capabilities",
    ],
    technologies: ["AWS", "GCP", "Kubernetes", "Terraform", "Docker"],
  },
  {
    id: "system-integration",
    title: "System Integration",
    description:
      "Connect disparate systems with reliable, maintainable integrations. We handle the complexity so your team can focus on product.",
    outcomes: [
      "Event-driven architectures",
      "Reliable message queuing",
      "Third-party API integrations",
      "Legacy system modernization",
    ],
    technologies: ["Kafka", "RabbitMQ", "gRPC", "REST", "GraphQL"],
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    description:
      "Identify bottlenecks, optimize critical paths, and reduce infrastructure costs. Data-driven improvements with measurable results.",
    outcomes: [
      "Detailed performance profiling",
      "Caching strategy implementation",
      "Database query optimization",
      "Infrastructure cost reduction",
    ],
    technologies: ["Datadog", "Prometheus", "Grafana", "Redis", "CDN"],
  },
  {
    id: "security-audits",
    title: "Security Audits",
    description:
      "Comprehensive security reviews of your backend systems. We identify vulnerabilities before they become incidents.",
    outcomes: [
      "Penetration testing reports",
      "Security best practices implementation",
      "Compliance readiness (SOC 2, HIPAA)",
      "Incident response planning",
    ],
    technologies: ["OWASP", "Vault", "AWS Security Hub", "Snyk", "SonarQube"],
  },
];
