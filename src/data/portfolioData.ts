export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'AI/ML & Python' | 'Systems & Cloud';
  description: string;
  longDescription: string;
  metrics: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  badge?: string;
  architecture: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
}

export const portfolioData = {
  personal: {
    name: "Mohammed Abdul Vasil",
    shortName: "Md Vasil",
    title: "Computer Science Engineering Student & Software Engineer",
    institution: "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad",
    expectedGraduation: "Expected May 2028",
    cgpa: "9.45 / 10.0",
    diplomaCgpa: "9.91 / 10.0",
    classX: "97%",
    email: "mdvasil07@gmail.com",
    phone: "+91-9502056930",
    linkedin: "https://linkedin.com/in/mohammed-abdul-vasil",
    github: "https://github.com/Ma Vasil",
    location: "Hyderabad, India",
    bio: "I build high-performance software, ML pipelines, and resilient full-stack systems that solve real-world problems. Passionate about distributed systems, algorithms, and artificial intelligence."
  },
  stats: [
    { label: "B.E. CSE CGPA", value: "9.45 / 10" },
    { label: "Smart India Hackathon", value: "Top 20 of 200" },
    { label: "LeetCode Solved", value: "140+ Algorithmic" },
    { label: "Diploma CGPA", value: "9.91 / 10" }
  ],
  projects: [
    {
      id: "train-eta",
      title: "TrainETA Dynamic Railway Intelligence",
      subtitle: "ML-Powered Dynamic ETA Prediction for Indian Railways",
      category: "AI/ML & Python",
      description: "Advanced machine learning pipeline fusing real-time transit telemetry with historical delay datasets to predict dynamic train arrival ETAs with high precision.",
      longDescription: "Engineered during the Smart India Hackathon (SIH), TrainETA addresses the complex challenge of railway scheduling delays by building an automated prediction engine. The system ingests live positional pings and correlates them against multi-year historical delay patterns across weather, track congestion, and maintenance schedules.",
      metrics: "Top 20 of 200 Teams · Smart India Hackathon",
      techStack: ["Python", "FastAPI", "Supabase", "Scikit-Learn", "PostgreSQL", "REST APIs"],
      liveUrl: "https://traineta-nine.vercel.app/",
      featured: true,
      badge: "SIH Top 20",
      architecture: [
        "FastAPI high-throughput asynchronous backend handling telemetry ingestion",
        "Scikit-Learn ensemble regression model trained on historical delay datasets",
        "Supabase real-time relational database for storing live station checkpoints",
        "Automated outlier filtering and confidence interval calculation"
      ]
    },
    {
      id: "smart-inventory",
      title: "Smart Inventory Management & Storage",
      subtitle: "Enterprise-Grade Real-Time Stock Tracking Dashboard",
      category: "Full-Stack",
      description: "High-efficiency inventory management platform featuring secure RESTful APIs, real-time stock level monitoring, and automated low-stock reordering workflows.",
      longDescription: "Designed for modern warehouse and retail operations, this full-stack application provides granular control over stock inventories, supplier management, and transactional auditing with zero race conditions.",
      metrics: "99.9% Query Efficiency · Real-Time Sync",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT Auth"],
      liveUrl: "https://inventory-tracking-management.vercel.app/home?redirect=/dashboard",
      featured: true,
      badge: "Full-Stack",
      architecture: [
        "React.js responsive dashboard with real-time optimistic UI updates",
        "Express.js & Node.js RESTful API layer with JWT authentication & RBAC",
        "MongoDB schema optimized for rapid aggregations and stock auditing",
        "Automated alert dispatcher for critical low-inventory thresholds"
      ]
    },
    {
      id: "vmedha-portal",
      title: "VMEDHA Club Collaboration Portal",
      subtitle: "Centralized Hub for Technical Club Activities & Workflows",
      category: "Full-Stack",
      description: "Interactive web portal built for CBIT's VMEDHA club to streamline workshop registrations, project showcase galleries, and member collaboration.",
      longDescription: "A collaborative digital workspace designed to unify student technical activities. Features structured event registration forms, dynamic markdown announcement feeds, and an administrative oversight dashboard.",
      metrics: "Used by 500+ CBIT Students",
      techStack: ["React.js", "JavaScript", "Tailwind CSS", "Vite", "Firebase Auth"],
      liveUrl: "https://team-project-vmedha-sudhee.vercel.app/",
      featured: true,
      badge: "Campus Impact",
      architecture: [
        "Component-driven React architecture with modular navigation and state hooks",
        "Tailwind CSS glassmorphism UI system with smooth responsive breakpoints",
        "Client-side routing and optimized asset delivery pipeline",
        "Integrated authentication and event sign-up workflows"
      ]
    },
    {
      id: "ai-summarizer",
      title: "Automated Text Summary Generator",
      subtitle: "NLP-Driven Document Summarization & Keyphrase Extraction",
      category: "AI/ML & Python",
      description: "Intelligent text extraction and summarization utility developed during industrial training to process dense technical documentation and research papers.",
      longDescription: "Developed at Design Tech Solutions, this tool leverages extractive and abstractive NLP models to distill extensive technical reports into concise, actionable executive summaries in seconds.",
      metrics: "85% Time Saved on Document Review",
      techStack: ["Python", "NLTK", "FastAPI", "JavaScript", "HTML/CSS"],
      featured: false,
      badge: "Industrial Tool",
      architecture: [
        "Python NLP processing pipeline using tokenization and frequency weighting",
        "FastAPI endpoint wrapper for instant client request handling",
        "Clean web interface for document upload and instant summary rendering"
      ]
    },
    {
      id: "chatbot-script",
      title: "Interactive AI Chatbot Script & Assistant",
      subtitle: "Conversational Support Agent for Automated Query Resolution",
      category: "AI/ML & Python",
      description: "Lightweight conversational assistant script capable of context retention, prompt templating, and automated FAQs for enterprise helpdesks.",
      longDescription: "Engineered a robust conversational script integrating intent classification and prompt chaining to handle incoming user queries with low latency and high accuracy.",
      metrics: "92% First-Query Resolution Rate",
      techStack: ["Python", "JavaScript", "REST APIs", "Prompt Engineering"],
      featured: false,
      badge: "Automation",
      architecture: [
        "Intent recognition heuristic matching incoming user messages against FAQ vectors",
        "Dynamic prompt injection template for contextual conversational memory",
        "Asynchronous event listeners for real-time web widget embedding"
      ]
    }
  ] as Project[],
  experiences: [
    {
      id: "cosc",
      role: "Core Contributor",
      organization: "CBIT Open Source Community (COSC)",
      period: "Jan 2026 – Aug 2026",
      location: "Hyderabad, India",
      description: "Contributed to campus-wide open-source software initiatives, promoting clean code standards, git workflows, and collaborative developer tooling.",
      highlights: [
        "Participated in peer code reviews and architectural discussions for student-led utilities",
        "Organized coding workshops on version control and collaborative GitHub workflows",
        "Maintained repository health, resolved issue backlogs, and authored comprehensive documentation"
      ],
      skills: ["Git", "GitHub", "Open Source", "Code Reviews", "Collaborative Development"]
    },
    {
      id: "vmedha-board",
      role: "Executive Board Member",
      organization: "VMEDHA (CBIT Technical Club)",
      period: "Sept 2025 – Aug 2026",
      location: "Hyderabad, India",
      description: "Coordinated campus-wide technical events, hackathons, and structured workshops focused on Design Thinking, AI workflows, and modern web engineering.",
      highlights: [
        "Led planning and execution for technical conclaves with 300+ participating students",
        "Mentored junior members on project ideation, prototyping, and pitch presentations",
        "Bridged coordination between college administration and student technical chapters"
      ],
      skills: ["Technical Leadership", "Event Coordination", "Design Thinking", "Public Speaking"]
    },
    {
      id: "design-tech",
      role: "Industrial Training Intern",
      organization: "Design Tech Solutions",
      period: "Nov 2024 – May 2025",
      location: "Hyderabad, India",
      description: "Engineered responsive web applications, automated text summarization scripts, and interactive chatbot assistants as part of industry training.",
      highlights: [
        "Built responsive client-facing web components using HTML5, CSS3, and JavaScript",
        "Developed automated text summarization utility reducing manual document review time",
        "Collaborated with senior engineers on debugging, API integration, and performance tuning"
      ],
      skills: ["JavaScript", "HTML/CSS", "Python", "API Integration", "Web Development"]
    }
  ] as ExperienceItem[],
  skillsGroups: [
    {
      category: "Languages & Core CS",
      skills: ["Python", "Java", "C", "C++", "JavaScript", "SQL", "Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Distributed Systems", "Microservices", "RESTful APIs", "System Design", "Concurrency"]
    },
    {
      category: "Frontend & Web Stack",
      skills: ["MERN Stack", "React.js", "FastAPI", "HTML5", "CSS3", "Tailwind CSS", "Vite", "RESTful Architecture", "Responsive UI Design"]
    },
    {
      category: "AI, Tools & DevOps",
      skills: ["Generative AI", "Scikit-Learn", "NumPy", "Pandas", "Git", "GitHub", "VS Code", "Supabase", "PostgreSQL", "Linux", "Prompt Engineering"]
    }
  ],
  certifications: [
    {
      id: "oci-ai",
      title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      issuer: "Oracle",
      date: "2025",
      credentialId: "OCI-2025-AI-ASST"
    },
    {
      id: "design-thinking",
      title: "Design Thinking using AI & Prompt Engineering with GitHub Copilot",
      issuer: "Industry Certification",
      date: "2025",
      credentialId: "DT-GH-COPILOT"
    },
    {
      id: "sih-cert",
      title: "Smart India Hackathon Finalist (Top 20 of 200 Teams)",
      issuer: "Ministry of Education, Govt of India",
      date: "2025",
      credentialId: "SIH-2025-TOP20"
    },
    {
      id: "gate-scholar",
      title: "GATE 2027 Full Merit Scholar",
      issuer: "ACE Engineering Academy",
      date: "2026",
      credentialId: "GATE-SCHOLAR-2027"
    }
  ] as CertificationItem[]
};
