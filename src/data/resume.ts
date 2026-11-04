import type { ResumeConfiguration } from "@/types/resume";

/** Content from the expanded developer résumé.
 * Unknown dates, project links, and media are intentionally absent.
 */
export const resume: ResumeConfiguration = {
  profile: {
    id: "dae-jay-donos",
    fullName: "Dae Jay B. Doños",
    headline: "Junior Software Developer | Backend Development",
    location: "Cagayan de Oro City, Philippines",
    email: "donos.daejay11@gmail.com",
    phone: "+63 976 262 8316",
    biography:
      "My work spans backend development, mobile applications, and booking systems. During my OJT at Appollotech Software, I contributed to Java and Spring Boot APIs for Asenso V2, worked on Docker containerization, and supported Kubernetes deployment tasks.\n\nI also bring experience in Excel data preparation and validation, alongside customer service work at Creamery Studios and client service and booking system development for a fashion business.",
    details: [
      {
        id: "education",
        label: "Education",
        value: "Bachelor of Science in Computer Science · USTP",
      },
      {
        id: "location",
        label: "Based in",
        value: "Cagayan de Oro City, Philippines",
      },
    ],
    socialLinks: [
      {
        id: "github",
        label: "github.com/DaeJayD",
        url: "https://github.com/DaeJayD",
      },
    ],
  },
  summary:
    "Computer Science student with Java and Spring Boot backend experience from OJT and projects spanning mobile applications, booking systems, and database-backed platforms. Experienced in Docker containerization, Kubernetes deployment support, and Excel-based data preparation. Seeking junior software and backend development opportunities.",
  skills: [
    {
      id: "development",
      category: "Development",
      skills: [
        "Java",
        "Spring Boot",
        "REST APIs",
        "Python",
        "JavaScript",
        "TypeScript",
        "Dart",
        "Flutter",
        "React",
        "Next.js",
      ],
    },
    {
      id: "databases-tools",
      category: "Databases & tools",
      skills: [
        "SQL",
        "PostgreSQL",
        "Supabase",
        "Firebase",
        "Docker",
        "Git",
        "GitHub",
        "Kubernetes deployment support",
        "Excel data cleaning and validation",
      ],
    },
  ],
  education: [
    {
      id: "ustp",
      institution:
        "University of Science and Technology of Southern Philippines (USTP), Cagayan de Oro City",
      program: "Bachelor of Science in Computer Science",
      startDate: "2023",
      endDate: "Present",
    },
  ],
  experience: [
    {
      id: "appollotech",
      employer: "Appollotech Software",
      title: "On-the-Job Trainee",
      startDate: "2026",
      responsibilities: [
        "Contributed to Java and Spring Boot backend APIs for Asenso V2.",
        "Worked on Docker containerization and supported Kubernetes deployment tasks.",
        "Cleaned and validated Excel data and supported the data preparation workflow for model training.",
        "Cross-checked ticket records, site identifiers, and device details; documented ambiguous cases and maintained work logs for team follow-up.",
      ],
    },
    {
      id: "creamery",
      employer: "Creamery Studios",
      title: "All-Around Employee",
      startDate: "2022",
      endDate: "2023",
      summary:
        "Handled customer orders and requests while supporting product preparation, inventory monitoring, restocking, and daily sales operations.",
    },
    {
      id: "fashion",
      employer: "Fashion Business",
      title: "Client Service and Booking System Development",
      summary:
        "Progressed from assisting clients and taking measurements to developing an online booking system.",
    },
  ],
  projects: [
    {
      id: "remittance",
      name: "Remittance Simulator",
      description:
        "Java and Spring Boot project specification with MariaDB, focused on persistent transaction state, gateway-specific API responses, and Flutter client integration.",
      technologies: ["Java", "Spring Boot", "MariaDB", "Flutter"],
      status: "Project specification",
      featured: true,
    },
    {
      id: "vasenizz",
      name: "VaseNizz POS",
      description:
        "Working mobile POS system with sales, inventory, attendance, and role-based staff and owner workflows.",
      technologies: ["Flutter", "Supabase", "PostgreSQL"],
      featured: true,
    },
    {
      id: "ryser",
      name: "Ryser",
      description:
        "Android alarm application with native alarm scheduling, wake missions, and persisted wake-session history.",
      technologies: ["Flutter", "Dart", "Kotlin", "Drift"],
      featured: true,
    },
    {
      id: "lumiere",
      name: "Lumière Lens",
      description:
        "Photography and videography booking platform with reservation handling, scheduling, and email notifications.",
      technologies: ["React", "Firebase"],
      featured: true,
    },
    {
      id: "boardr",
      name: "BoardR",
      description:
        "Student accommodation platform with structured boarding house listings for comparison and discovery.",
      technologies: ["TypeScript", "Supabase", "PostgreSQL"],
      featured: false,
    },
    {
      id: "arcana",
      name: "Arcana Archive",
      description:
        "Personal portfolio with tarot-inspired navigation, project portals, dedicated project pages, responsive layouts, and reduced-motion support.",
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
      ],
      featured: false,
    },
    {
      id: "roadready",
      name: "RoadReady PH",
      description:
        "Independent Philippine driving reviewer with practice attempts, full-bank access, unseen-first question coverage, road-sign illustrations, and saved progress.",
      technologies: ["HTML", "CSS", "JavaScript", "Browser local storage"],
      featured: false,
    },
    {
      id: "rererecon",
      name: "RERERECON",
      description:
        "Research proposal for query-condition-aware routing in sparse RAG, separating clarification decisions from automatic query transformation and defining an evaluation protocol.",
      status: "Undergraduate thesis proposal",
      featured: false,
    },
    {
      id: "calorie",
      name: "Daily Calorie Calculator",
      description:
        "BMI-based calculator for estimating daily calorie requirements using personal and activity inputs.",
      technologies: ["Python"],
      status: "Completed prototype · 2024",
      featured: false,
    },
    {
      id: "thryft",
      name: "ThryfT",
      description:
        "Early mobile marketplace for pre-loved items in Cagayan de Oro, including listing, seller, and local-discovery flows.",
      technologies: ["Flutter", "Dart", "MongoDB"],
      status: "Discontinued prototype · 2024",
      featured: false,
    },
    {
      id: "lyte",
      name: "LYTE",
      description:
        "Object-oriented desktop fitness planning module with reusable components for routines and progress tracking.",
      technologies: ["Java"],
      status: "Discontinued project · 2024",
      featured: false,
    },
    { id: "finance", name: "Finance Tracker", featured: false },
  ],
  theme: { accent: "#3f5548", paper: "#fffef9", typography: "editorial" },
  pages: [
    {
      id: "background",
      sections: [
        { id: "summary", kind: "summary", title: "Professional summary" },
        { id: "skills", kind: "skills", title: "Technical skills" },
        { id: "education", kind: "education", title: "Education" },
        {
          id: "technical-experience",
          kind: "experience",
          title: "Technical experience",
          itemIds: ["appollotech"],
        },
      ],
    },
    {
      id: "selected-work",
      sections: [
        {
          id: "selected-projects",
          kind: "projects",
          title: "Selected software projects",
          itemIds: ["remittance", "vasenizz", "ryser", "lumiere"],
        },
        {
          id: "professional-experience",
          kind: "experience",
          title: "Additional professional experience",
          itemIds: ["creamery", "fashion"],
        },
      ],
    },
    {
      id: "additional-work",
      sections: [
        {
          id: "additional-projects",
          kind: "projects",
          title: "Additional software projects",
          itemIds: [
            "boardr",
            "arcana",
            "roadready",
            "rererecon",
            "calorie",
            "thryft",
            "lyte",
            "finance",
          ],
        },
      ],
    },
  ],
};
