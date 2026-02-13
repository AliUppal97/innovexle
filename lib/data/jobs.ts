export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
export type LocationType = "remote" | "hybrid" | "on-site";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "principal";

export interface JobLocation {
  type: LocationType;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: "yearly" | "monthly" | "hourly";
}

export interface Job {
  id: string;
  code: string;
  title: string;
  department: string;
  team?: string;
  role: string;
  level: ExperienceLevel;
  location: JobLocation;
  employmentType: EmploymentType;
  salary?: SalaryRange;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  skills: string[];
  postedDate: string;
  applicationDeadline?: string;
  isActive: boolean;
  isUrgent?: boolean;
}

export const departments = [
  "Engineering",
  "Product",
  "Design",
  "Operations",
  "Sales",
] as const;

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const locationTypeLabels: Record<LocationType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

export const jobs: Job[] = [
  {
    id: "senior-backend-engineer",
    code: "ENG-2024-001",
    title: "Senior Backend Engineer",
    department: "Engineering",
    team: "Platform",
    role: "Software Engineer",
    level: "senior",
    location: {
      type: "remote",
      timezone: "UTC-5 to UTC+2",
    },
    employmentType: "full-time",
    salary: {
      min: 150000,
      max: 200000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "We're looking for a Senior Backend Engineer to join our Platform team. You'll be responsible for designing and building the core infrastructure that powers our client projects. This is a high-impact role where you'll work directly with our most demanding enterprise clients.",
    responsibilities: [
      "Design and implement scalable backend services and APIs",
      "Lead technical architecture decisions for client projects",
      "Mentor junior engineers and conduct code reviews",
      "Collaborate with clients to understand their technical requirements",
      "Write comprehensive documentation and technical specifications",
      "Participate in on-call rotation for production systems",
      "Contribute to our internal tools and frameworks",
    ],
    requirements: [
      "7+ years of professional software development experience",
      "Strong proficiency in Go, Node.js, or Python",
      "Deep experience with PostgreSQL and Redis",
      "Proven track record of building systems that handle high traffic",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Strong understanding of distributed systems concepts",
      "Excellent written and verbal communication skills",
      "Bachelor's degree in Computer Science or equivalent experience",
    ],
    niceToHave: [
      "Experience with Kubernetes and container orchestration",
      "Familiarity with infrastructure as code (Terraform, Pulumi)",
      "Previous consulting or agency experience",
      "Open source contributions",
      "Experience with real-time systems or event-driven architectures",
    ],
    benefits: [
      "Competitive salary with equity options",
      "Fully remote work with flexible hours",
      "Unlimited PTO policy",
      "Health, dental, and vision insurance",
      "$5,000 annual learning & development budget",
      "Home office setup stipend",
      "Annual team retreats",
      "401(k) with 4% company match",
    ],
    skills: ["Go", "Node.js", "PostgreSQL", "Redis", "AWS", "Kubernetes", "Docker"],
    postedDate: "2026-01-15",
    applicationDeadline: "2026-03-15",
    isActive: true,
    isUrgent: true,
  },
  {
    id: "backend-engineer",
    code: "ENG-2024-002",
    title: "Backend Engineer",
    department: "Engineering",
    team: "Client Services",
    role: "Software Engineer",
    level: "mid",
    location: {
      type: "remote",
      timezone: "Americas (UTC-8 to UTC-3)",
    },
    employmentType: "full-time",
    salary: {
      min: 120000,
      max: 160000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Join our Client Services team as a Backend Engineer. You'll work on diverse projects across fintech, healthcare, and e-commerce, building reliable backend systems that solve real business problems.",
    responsibilities: [
      "Build and maintain backend services for client projects",
      "Write clean, tested, and well-documented code",
      "Participate in technical design discussions",
      "Debug and optimize performance issues",
      "Collaborate with cross-functional teams",
      "Contribute to technical documentation",
    ],
    requirements: [
      "4+ years of backend development experience",
      "Proficiency in at least one of: Go, Node.js, Python, or Java",
      "Experience with relational databases (PostgreSQL, MySQL)",
      "Understanding of RESTful API design principles",
      "Familiarity with cloud services (AWS, GCP)",
      "Good problem-solving and debugging skills",
      "Strong communication skills",
    ],
    niceToHave: [
      "Experience with message queues (Kafka, RabbitMQ)",
      "Knowledge of GraphQL",
      "Experience with CI/CD pipelines",
      "Exposure to microservices architecture",
    ],
    benefits: [
      "Competitive salary with equity options",
      "Fully remote work with flexible hours",
      "Unlimited PTO policy",
      "Health, dental, and vision insurance",
      "$3,000 annual learning & development budget",
      "Home office setup stipend",
      "Annual team retreats",
    ],
    skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker", "REST APIs"],
    postedDate: "2026-01-20",
    isActive: true,
  },
  {
    id: "devops-engineer",
    code: "ENG-2024-003",
    title: "DevOps Engineer",
    department: "Engineering",
    team: "Infrastructure",
    role: "DevOps Engineer",
    level: "senior",
    location: {
      type: "hybrid",
      city: "San Francisco",
      country: "United States",
    },
    employmentType: "full-time",
    salary: {
      min: 160000,
      max: 210000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "We're seeking a Senior DevOps Engineer to build and maintain our infrastructure. You'll work on automating deployments, improving reliability, and helping our engineering team ship faster with confidence.",
    responsibilities: [
      "Design and maintain cloud infrastructure using IaC",
      "Build and optimize CI/CD pipelines",
      "Implement monitoring, alerting, and observability solutions",
      "Manage Kubernetes clusters and container orchestration",
      "Automate security and compliance processes",
      "Respond to and resolve production incidents",
      "Document infrastructure and runbooks",
    ],
    requirements: [
      "5+ years of DevOps or SRE experience",
      "Expert-level knowledge of AWS or GCP",
      "Strong experience with Terraform or Pulumi",
      "Proficiency with Kubernetes and Helm",
      "Experience with CI/CD tools (GitHub Actions, GitLab CI, CircleCI)",
      "Scripting skills in Python, Bash, or Go",
      "Strong understanding of networking and security",
    ],
    niceToHave: [
      "Experience with multi-cloud environments",
      "Knowledge of service mesh (Istio, Linkerd)",
      "Database administration experience",
      "SOC 2 or HIPAA compliance experience",
    ],
    benefits: [
      "Competitive salary with equity options",
      "Hybrid work (3 days in office)",
      "Unlimited PTO policy",
      "Premium health, dental, and vision insurance",
      "$5,000 annual learning & development budget",
      "Commuter benefits",
      "Annual team retreats",
      "401(k) with 4% company match",
    ],
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Prometheus", "Grafana"],
    postedDate: "2026-01-10",
    applicationDeadline: "2026-02-28",
    isActive: true,
  },
  {
    id: "solutions-architect",
    code: "ENG-2024-004",
    title: "Solutions Architect",
    department: "Engineering",
    team: "Architecture",
    role: "Solutions Architect",
    level: "lead",
    location: {
      type: "remote",
      timezone: "Flexible",
    },
    employmentType: "full-time",
    salary: {
      min: 180000,
      max: 240000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "As a Solutions Architect, you'll be the technical face of Innovexle. You'll work with clients to understand their challenges, design elegant solutions, and guide projects from inception to delivery.",
    responsibilities: [
      "Lead technical discovery and requirements gathering",
      "Design system architectures for complex client needs",
      "Create technical proposals and architecture documents",
      "Present solutions to technical and non-technical stakeholders",
      "Guide engineering teams during implementation",
      "Evaluate and recommend technologies and tools",
      "Build relationships with key client stakeholders",
    ],
    requirements: [
      "10+ years of software engineering experience",
      "5+ years in a solutions architecture or technical leadership role",
      "Deep expertise in distributed systems and cloud architecture",
      "Experience with multiple programming languages and paradigms",
      "Strong presentation and communication skills",
      "Ability to translate business requirements into technical solutions",
      "Experience in a client-facing role",
    ],
    niceToHave: [
      "Previous consulting experience",
      "Industry certifications (AWS SA, GCP PCA)",
      "Experience in specific verticals (fintech, healthcare)",
      "Published technical writing or speaking experience",
    ],
    benefits: [
      "Competitive salary with significant equity",
      "Fully remote work",
      "Unlimited PTO policy",
      "Premium health, dental, and vision insurance",
      "$7,500 annual learning & development budget",
      "Conference speaking support",
      "Annual team retreats",
      "401(k) with 4% company match",
    ],
    skills: ["System Design", "AWS", "GCP", "Kubernetes", "Microservices", "Technical Leadership"],
    postedDate: "2026-01-25",
    isActive: true,
  },
  {
    id: "technical-project-manager",
    code: "OPS-2024-001",
    title: "Technical Project Manager",
    department: "Operations",
    team: "Delivery",
    role: "Project Manager",
    level: "senior",
    location: {
      type: "remote",
      timezone: "Americas or Europe",
    },
    employmentType: "full-time",
    salary: {
      min: 130000,
      max: 170000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "We're looking for a Technical Project Manager to lead our client engagements. You'll work closely with engineering teams and clients to ensure projects are delivered on time, within scope, and with exceptional quality.",
    responsibilities: [
      "Manage multiple client projects simultaneously",
      "Create and maintain project plans and timelines",
      "Facilitate communication between clients and engineering teams",
      "Identify and mitigate project risks",
      "Run agile ceremonies (standups, planning, retrospectives)",
      "Track and report on project health and metrics",
      "Ensure documentation and handoffs are complete",
    ],
    requirements: [
      "5+ years of technical project management experience",
      "Strong understanding of software development lifecycle",
      "Experience with agile methodologies (Scrum, Kanban)",
      "Excellent communication and stakeholder management skills",
      "Ability to understand and discuss technical concepts",
      "Experience with project management tools (Jira, Linear, Asana)",
      "PMP, CSM, or similar certification preferred",
    ],
    niceToHave: [
      "Previous software development experience",
      "Agency or consulting background",
      "Experience managing distributed teams",
      "Familiarity with backend technologies",
    ],
    benefits: [
      "Competitive salary",
      "Fully remote work with flexible hours",
      "Unlimited PTO policy",
      "Health, dental, and vision insurance",
      "$3,000 annual learning & development budget",
      "Home office setup stipend",
      "Annual team retreats",
    ],
    skills: ["Agile", "Scrum", "Jira", "Stakeholder Management", "Risk Management"],
    postedDate: "2026-01-18",
    isActive: true,
  },
  {
    id: "junior-backend-engineer",
    code: "ENG-2024-005",
    title: "Junior Backend Engineer",
    department: "Engineering",
    team: "Client Services",
    role: "Software Engineer",
    level: "entry",
    location: {
      type: "remote",
      timezone: "Americas",
    },
    employmentType: "full-time",
    salary: {
      min: 80000,
      max: 110000,
      currency: "USD",
      period: "yearly",
    },
    description:
      "Start your backend engineering career at Innovexle. You'll learn from experienced engineers while contributing to real client projects. This is an ideal role for recent graduates or early-career developers ready to level up.",
    responsibilities: [
      "Write and maintain backend code under senior guidance",
      "Participate in code reviews and learn best practices",
      "Write tests and documentation",
      "Debug issues and fix bugs",
      "Attend technical discussions and planning sessions",
      "Continuously learn and improve technical skills",
    ],
    requirements: [
      "0-2 years of professional development experience",
      "Bachelor's degree in CS or equivalent (bootcamp, self-taught)",
      "Basic knowledge of at least one backend language (Node.js, Python, Go)",
      "Understanding of databases and SQL",
      "Familiarity with Git and version control",
      "Strong desire to learn and grow",
      "Good communication skills",
    ],
    niceToHave: [
      "Personal projects or portfolio",
      "Open source contributions",
      "Internship experience",
      "Knowledge of cloud platforms",
    ],
    benefits: [
      "Competitive entry-level salary",
      "Structured mentorship program",
      "Fully remote work",
      "Unlimited PTO policy",
      "Health, dental, and vision insurance",
      "$2,000 annual learning & development budget",
      "Home office setup stipend",
    ],
    skills: ["Node.js", "Python", "SQL", "Git", "REST APIs"],
    postedDate: "2026-01-28",
    isActive: true,
  },
];

// Helper functions
export function getActiveJobs(): Job[] {
  return jobs.filter((job) => job.isActive);
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

export function getJobByCode(code: string): Job | undefined {
  return jobs.find((job) => job.code === code);
}

export function getJobsByDepartment(department: string): Job[] {
  return jobs.filter((job) => job.isActive && job.department === department);
}

export function getJobsByLocation(locationType: LocationType): Job[] {
  return jobs.filter((job) => job.isActive && job.location.type === locationType);
}

export function getJobsByLevel(level: ExperienceLevel): Job[] {
  return jobs.filter((job) => job.isActive && job.level === level);
}

export function formatSalary(salary: SalaryRange): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: salary.currency,
    maximumFractionDigits: 0,
  });

  const min = formatter.format(salary.min);
  const max = formatter.format(salary.max);

  return `${min} - ${max}`;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getDaysAgo(dateString: string): number {
  const posted = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - posted.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getRelativeTime(dateString: string): string {
  const days = getDaysAgo(dateString);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  return `${Math.floor(days / 30)} months ago`;
}
