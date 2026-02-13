export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  problem: string;
  solution: string;
  results: {
    metric: string;
    value: string;
  }[];
  technologies: string[];
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fintech-api-rebuild",
    title: "API Infrastructure Rebuild",
    industry: "Fintech",
    problem:
      "A Series B fintech company was experiencing API latency issues during peak trading hours. Their monolithic architecture couldn't handle the growing user base, resulting in failed transactions and customer complaints.",
    solution:
      "We redesigned their API layer using a microservices architecture with proper load balancing and caching strategies. Implemented circuit breakers and graceful degradation patterns to maintain service during partial outages.",
    results: [
      { metric: "Response Time", value: "3x faster" },
      { metric: "Uptime", value: "99.99%" },
      { metric: "Failed Transactions", value: "-95%" },
    ],
    technologies: ["Node.js", "PostgreSQL", "Redis", "Kubernetes", "AWS"],
    featured: true,
  },
  {
    id: "healthcare-data-platform",
    title: "HIPAA-Compliant Data Platform",
    industry: "Healthcare",
    problem:
      "A healthcare platform needed to process and store sensitive patient data while maintaining HIPAA compliance. Their existing infrastructure lacked proper encryption, audit trails, and access controls.",
    solution:
      "Built a secure data platform with end-to-end encryption, comprehensive audit logging, and role-based access control. Implemented automated compliance checks and security monitoring.",
    results: [
      { metric: "Compliance", value: "HIPAA Certified" },
      { metric: "Audit Time", value: "-80%" },
      { metric: "Security Incidents", value: "Zero" },
    ],
    technologies: ["Go", "PostgreSQL", "AWS", "Vault", "Terraform"],
    featured: true,
  },
  {
    id: "ecommerce-scale",
    title: "Infrastructure Cost Optimization",
    industry: "E-commerce",
    problem:
      "An e-commerce scale-up was spending heavily on cloud infrastructure with inefficient resource utilization. Their architecture wasn't optimized for their traffic patterns, leading to over-provisioning.",
    solution:
      "Performed comprehensive infrastructure audit and implemented auto-scaling, spot instances, and caching layers. Optimized database queries and implemented CDN for static assets.",
    results: [
      { metric: "Infrastructure Cost", value: "-40%" },
      { metric: "Page Load Time", value: "-60%" },
      { metric: "Throughput", value: "5x increase" },
    ],
    technologies: ["AWS", "CloudFront", "Redis", "PostgreSQL", "Docker"],
    featured: true,
  },
  {
    id: "saas-migration",
    title: "Legacy System Migration",
    industry: "SaaS",
    problem:
      "A mature SaaS company was running on aging infrastructure with a monolithic application. Deployment cycles were slow, and the system was difficult to maintain and scale.",
    solution:
      "Executed a phased migration to a modern microservices architecture using strangler fig pattern. Zero downtime migration with comprehensive testing and rollback capabilities.",
    results: [
      { metric: "Deployment Frequency", value: "10x faster" },
      { metric: "System Downtime", value: "Zero" },
      { metric: "Developer Productivity", value: "+50%" },
    ],
    technologies: ["Kubernetes", "Go", "PostgreSQL", "Kafka", "Terraform"],
    featured: false,
  },
  {
    id: "realtime-analytics",
    title: "Real-time Analytics Pipeline",
    industry: "AdTech",
    problem:
      "An AdTech company needed to process millions of events per second for real-time bidding decisions. Their batch processing system couldn't meet the latency requirements.",
    solution:
      "Designed and implemented a stream processing pipeline capable of handling high-throughput, low-latency data processing. Built custom aggregation and windowing logic for real-time analytics.",
    results: [
      { metric: "Processing Latency", value: "<50ms" },
      { metric: "Events/Second", value: "2M+" },
      { metric: "Data Loss", value: "Zero" },
    ],
    technologies: ["Kafka", "Flink", "ClickHouse", "Kubernetes", "Go"],
    featured: false,
  },
];

export const featuredCaseStudies = caseStudies.filter((cs) => cs.featured);
