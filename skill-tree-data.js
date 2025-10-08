/**
 * Unified skill tree dataset combining metadata and node layout information.
 * Exposes a single canonical data source (`skillTreeData`) consumed by the UI.
 */
(function (global) {
  const rawGroups = [
    {
      id: "languages",
      label: "Core Languages & Paradigms",
      order: 1,
      color: "rgba(101, 67, 33, 0.85)",
      description:
        "Foundational programming languages and paradigms used across systems, backend, and automation work.",
      focus: ["Backend", "Automation", "Systems"],
      nodes: [
        {
          id: "languages-1",
          title: "Python Fundamentals",
          summary: "Scripting, data handling and automation for AI/ML and tooling.",
          description:
            "Scripting, data handling and automation for AI/ML and tooling.",
          reward: "Unlocks data wrangling and automation workflows",
          icon: "images/logo-python.png",
          prof: 3,
          unlocked: true,
          tags: ["python", "automation", "ai"],
          focusAreas: ["Automation", "AI Tooling"],
          prereqs: [],
          related: ["languages-9", "ai-3"],
        },
        {
          id: "languages-2",
          title: "JavaScript Fundamentals",
          summary:
            "Core JS concepts including ES modules, functions, objects, and async.",
          description:
            "Core JS concepts including ES modules, functions, objects, and async.",
          reward: "Unlocks modern web interactivity and tooling",
          icon: "images/logo-javascript.png",
          prof: 3,
          unlocked: true,
          tags: ["javascript", "web"],
          focusAreas: ["Frontend", "Tooling"],
          prereqs: [],
          related: ["web-2", "web-6"],
        },
        {
          id: "languages-3",
          title: "C# OOP",
          summary:
            "Object-oriented design, .NET ecosystem, and application architecture.",
          description:
            "Object-oriented design, .NET ecosystem, and application architecture.",
          reward: "Unlocks backend services and tooling in .NET",
          icon: "images/logo-csharp.png",
          prof: 4,
          unlocked: true,
          tags: ["csharp", "oop"],
          focusAreas: ["Backend", "Enterprise"],
          prereqs: [],
          related: ["languages-10"],
        },
        {
          id: "languages-4",
          title: "Java OOP",
          summary: "Strongly-typed OOP, JVM ecosystem, and enterprise patterns.",
          description:
            "Strongly-typed OOP, JVM ecosystem, and enterprise patterns.",
          reward: "Unlocks scalable backend systems on the JVM",
          icon: "images/logo-java.png",
          prof: 3,
          unlocked: true,
          tags: ["java", "oop"],
          focusAreas: ["Backend", "Enterprise"],
          prereqs: [],
          related: ["languages-10"],
        },
        {
          id: "languages-5",
          title: "C++ Systems Programming",
          summary:
            "Memory management, performance tuning, and engine-level development.",
          description:
            "Memory management, performance tuning, and engine-level development.",
          reward: "Unlocks engine/game modding and high-performance modules",
          icon: "images/logo-Cplus.png",
          prof: 4,
          unlocked: true,
          tags: ["c++", "systems"],
          focusAreas: ["Engines", "Performance"],
          prereqs: [],
          related: ["languages-11"],
        },
        {
          id: "languages-9",
          title: "Data Structures & Algorithms",
          summary:
            "Core DS&A concepts: arrays, hashes, trees, graphs, and complexity.",
          description:
            "Core DS&A concepts: arrays, hashes, trees, graphs, and complexity.",
          reward: "Unlocks stronger problem solving and interview readiness",
          emoji: "📚",
          prof: 4,
          unlocked: true,
          tags: ["algorithms", "dsa"],
          focusAreas: ["Problem Solving"],
          prereqs: ["languages-2"],
          related: ["languages-10", "ai-3"],
        },
        {
          id: "languages-10",
          title: "OOP & Design Patterns",
          summary:
            "SOLID, composition, and classic patterns (Factory, Strategy, Observer, etc.).",
          description:
            "SOLID, composition, and classic patterns (Factory, Strategy, Observer, etc.).",
          reward: "Unlocks maintainable, extensible code architecture",
          emoji: "📐",
          prof: 5,
          unlocked: true,
          tags: ["oop", "patterns"],
          focusAreas: ["Architecture"],
          prereqs: ["languages-3"],
          related: ["automation-1"],
        },
        {
          id: "languages-11",
          title: "Rust Systems Programming",
          summary: "Ownership, borrowing, and zero-cost abstractions for high safety.",
          description:
            "Ownership, borrowing, and zero-cost abstractions for building reliable, high-performance services.",
          reward: "Unlocks memory-safe systems programming",
          emoji: "🦀",
          prof: 5,
          unlocked: false,
          tags: ["rust", "systems"],
          focusAreas: ["Safety", "Performance"],
          prereqs: ["languages-5"],
          related: ["devops-4"],
        },
        {
          id: "languages-12",
          title: "Go Concurrency",
          summary: "Goroutines, channels, and structured concurrency for services.",
          description:
            "Goroutines, channels, and structured concurrency for modern cloud services.",
          reward: "Unlocks scalable service backends",
          emoji: "🐹",
          prof: 4,
          unlocked: false,
          tags: ["golang", "concurrency"],
          focusAreas: ["Cloud", "Services"],
          prereqs: ["languages-4"],
          related: ["backend-2", "devops-8"],
        },
      ],
    },
    {
      id: "web",
      label: "Web & Frontend",
      order: 2,
      color: "rgba(120, 75, 30, 0.8)",
      description:
        "Client-side frameworks, advanced TypeScript, and delivery patterns for modern interfaces.",
      focus: ["Frontend", "UX", "Performance"],
      nodes: [
        {
          id: "web-1",
          title: "HTML & CSS",
          summary: "Semantic HTML, responsive design, and modern CSS layouts.",
          description:
            "Semantic HTML, responsive design, and modern CSS layouts.",
          reward: "Unlocks clean, accessible UI foundations",
          icon: "images/logo-htmlcss.png",
          prof: 2,
          unlocked: true,
          tags: ["html", "css"],
          focusAreas: ["UI", "Accessibility"],
          prereqs: [],
          related: ["web-2", "web-3"],
        },
        {
          id: "web-2",
          title: "JavaScript for Web",
          summary: "DOM APIs, fetch, routing patterns, and client-side performance.",
          description: "DOM APIs, fetch, routing patterns, and client-side performance.",
          reward: "Unlocks interactive, data-driven UIs",
          icon: "images/logo-javascript.png",
          prof: 4,
          unlocked: true,
          tags: ["javascript", "frontend"],
          focusAreas: ["Interactivity"],
          prereqs: ["web-1"],
          related: ["web-6", "backend-1"],
        },
        {
          id: "web-6",
          title: "TypeScript Basics",
          summary: "Types, interfaces, generics, and compiling to JavaScript.",
          description: "Types, interfaces, generics, and compiling to JavaScript.",
          reward: "Unlocks safer, scalable JS codebases",
          emoji: "🧩",
          prof: 4,
          unlocked: true,
          tags: ["typescript", "frontend"],
          focusAreas: ["Tooling"],
          prereqs: ["web-2"],
          related: ["web-3", "frontend-4"],
        },
        {
          id: "web-5",
          title: "TypeScript Advanced",
          summary:
            "Advanced typing, generics, and large-scale application patterns.",
          description:
            "Advanced typing, generics, and large-scale application patterns.",
          reward: "Unlocks robust and scalable JavaScript development",
          emoji: "🌀",
          prof: 5,
          unlocked: true,
          tags: ["typescript", "web"],
          focusAreas: ["Frontend", "Tooling"],
          prereqs: ["web-6"],
          related: ["web-14", "web-12"],
        },
        {
          id: "web-3",
          title: "React",
          summary: "Component-driven UIs, hooks, state management, and composition.",
          description:
            "Component-driven UIs, hooks, state management, and composition.",
          reward: "Unlocks scalable SPA development",
          icon: "images/react-1-logo-png-transparent.png",
          prof: 4,
          unlocked: true,
          tags: ["react", "frontend"],
          focusAreas: ["SPA", "Components"],
          prereqs: ["web-1", "web-6"],
          related: ["web-12", "web-14"],
        },
        {
          id: "web-12",
          title: "State Management",
          summary:
            "Managing complex client state (Redux/Zustand/Context) and side effects.",
          description:
            "Managing complex client state (Redux/Zustand/Context) and side effects.",
          reward: "Unlocks scalable front-end architectures",
          emoji: "🗃️",
          prof: 4,
          unlocked: true,
          tags: ["state", "frontend"],
          focusAreas: ["Architecture"],
          prereqs: ["web-3", "web-6"],
          related: ["web-14", "web-9"],
        },
        {
          id: "web-4",
          title: "Progressive Web Apps (PWA)",
          summary: "Service workers, offline caching, installable experiences.",
          description: "Service workers, offline caching, installable experiences.",
          reward: "Unlocks offline-first and installable apps",
          emoji: "🚀",
          prof: 4,
          unlocked: true,
          tags: ["pwa", "frontend"],
          focusAreas: ["Offline", "UX"],
          prereqs: ["web-1", "web-3"],
          related: ["web-14"],
        },
        {
          id: "web-7",
          title: "Tailwind CSS",
          summary: "Utility-first CSS framework for rapid UI development.",
          description:
            "Responsive design with utility classes, custom themes, and plugins.",
          reward: "Unlocks fast, consistent styling workflows",
          emoji: "🎨",
          prof: 4,
          unlocked: true,
          tags: ["tailwind", "css"],
          focusAreas: ["Styling", "UI"],
          prereqs: ["web-1"],
          related: ["web-3", "web-14"],
        },
        {
          id: "web-8",
          title: "Build Tools (Vite/Webpack)",
          summary:
            "Modern bundlers for fast development and optimized production builds.",
          description:
            "Module bundling, HMR, code splitting, and asset optimization.",
          reward: "Unlocks optimized build pipelines",
          emoji: "⚡",
          prof: 4,
          unlocked: true,
          tags: ["vite", "webpack", "tooling"],
          focusAreas: ["Build", "Performance"],
          prereqs: ["web-2"],
          related: ["web-14", "backend-1"],
        },
        {
          id: "web-9",
          title: "Vue.js",
          summary: "Progressive JavaScript framework for building UIs.",
          description:
            "Components, Composition API, and reactive state management.",
          reward: "Unlocks alternative SPA development path",
          emoji: "💚",
          prof: 3,
          unlocked: false,
          tags: ["vue", "frontend"],
          focusAreas: ["SPA", "Components"],
          prereqs: ["web-2"],
          related: ["web-3", "web-12"],
        },
        {
          id: "web-10",
          title: "React Native",
          summary: "Cross-platform mobile development with React.",
          description: "Native mobile apps using React patterns and components.",
          reward: "Unlocks iOS and Android development",
          emoji: "📱",
          prof: 4,
          unlocked: false,
          tags: ["react-native", "mobile"],
          focusAreas: ["Mobile", "Cross-platform"],
          prereqs: ["web-3"],
          related: ["web-11"],
        },
        {
          id: "web-11",
          title: "Mobile UI/UX Patterns",
          summary: "Platform-specific design patterns and native interactions.",
          description:
            "iOS and Android design guidelines, gestures, and navigation.",
          reward: "Unlocks native-feeling mobile experiences",
          emoji: "📲",
          prof: 3,
          unlocked: false,
          tags: ["mobile", "ux"],
          focusAreas: ["Mobile", "Design"],
          prereqs: ["web-1", "web-10"],
          related: ["design-3"],
        },
        {
          id: "web-14",
          title: "Next.js",
          summary: "React framework for SSR/SSG, routing, and performance.",
          description: "React framework for SSR/SSG, routing, and performance.",
          reward: "Unlocks production-grade React apps",
          emoji: "⏭️",
          prof: 5,
          unlocked: true,
          tags: ["nextjs", "frontend"],
          focusAreas: ["SSR", "Performance"],
          prereqs: ["web-3", "web-6"],
          related: ["web-12", "web-18"],
        },
        {
          id: "web-18",
          title: "Edge Rendering",
          summary: "Streaming SSR and edge rendering strategies for modern apps.",
          description:
            "Streaming SSR pipelines, middleware, and edge rendering for low-latency experiences.",
          reward: "Unlocks near-instant global delivery",
          emoji: "🌍",
          prof: 5,
          unlocked: false,
          tags: ["edge", "performance"],
          focusAreas: ["Performance", "Deployment"],
          prereqs: ["web-14", "devops-6"],
          related: ["devops-7"],
        },
      ],
    },
    {
      id: "backend",
      label: "Backend & APIs",
      order: 3,
      color: "rgba(140, 90, 45, 0.82)",
      description:
        "Server-side runtimes, API design patterns, and security for building robust services.",
      focus: ["APIs", "Services", "Security"],
      nodes: [
        {
          id: "backend-1",
          title: "Node.js Fundamentals",
          summary: "Building APIs, working with filesystem, and async patterns.",
          description: "Building APIs, working with filesystem, and async patterns.",
          reward: "Unlocks full-stack JavaScript development",
          emoji: "🟩",
          prof: 4,
          unlocked: true,
          tags: ["node", "backend"],
          focusAreas: ["APIs", "Runtime"],
          prereqs: ["web-2"],
          related: ["backend-2", "automation-2"],
        },
        {
          id: "backend-2",
          title: "REST APIs (Express)",
          summary:
            "Designing and building RESTful endpoints with Express and middleware.",
          description:
            "Designing and building RESTful endpoints with Express and middleware.",
          reward: "Unlocks robust backend services and integrations",
          emoji: "🧭",
          prof: 5,
          unlocked: true,
          tags: ["rest", "backend"],
          focusAreas: ["APIs"],
          prereqs: ["backend-1"],
          related: ["backend-1", "backend-6"],
        },
        {
          id: "backend-3",
          title: "GraphQL Basics",
          summary: "Schema design, resolvers, and API querying with GraphQL.",
          description: "Schema design, resolvers, and API querying with GraphQL.",
          reward: "Unlocks flexible, client-driven APIs",
          emoji: "🔺",
          prof: 4,
          unlocked: false,
          tags: ["graphql", "api"],
          focusAreas: ["APIs"],
          prereqs: ["backend-1", "web-6"],
          related: ["backend-4", "backend-2"],
        },
        {
          id: "backend-4",
          title: "GraphQL APIs",
          summary:
            "Building and consuming GraphQL endpoints for efficient data querying.",
          description:
            "Building and consuming GraphQL endpoints for efficient data querying.",
          reward: "Unlocks modern API design and integration",
          emoji: "🔍",
          prof: 4,
          unlocked: false,
          tags: ["graphql", "api"],
          focusAreas: ["APIs"],
          prereqs: ["backend-3", "backend-5"],
          related: ["backend-1", "backend-6"],
        },
        {
          id: "backend-8",
          title: "Web Security Fundamentals",
          summary:
            "XSS, CSRF, SQL injection prevention, and HTTPS best practices.",
          description:
            "XSS, CSRF, SQL injection prevention, and HTTPS best practices.",
          reward: "Unlocks secure application development",
          emoji: "🛡️",
          prof: 4,
          unlocked: true,
          tags: ["security", "web"],
          focusAreas: ["Security"],
          prereqs: ["web-2"],
          related: ["backend-2"],
        },
        {
          id: "backend-9",
          title: "Authentication & Authorization",
          summary: "JWT, OAuth2, session management, and identity providers.",
          description:
            "Secure user authentication, role-based access control, and SSO integration.",
          reward: "Unlocks secure user management",
          emoji: "🔐",
          prof: 5,
          unlocked: true,
          tags: ["auth", "security"],
          focusAreas: ["Security", "Backend"],
          prereqs: ["backend-2", "backend-8"],
          related: ["backend-10"],
        },
        {
          id: "backend-10",
          title: "API Security",
          summary:
            "Rate limiting, API keys, token management, and threat prevention.",
          description:
            "Securing APIs with authentication, authorization, and input validation.",
          reward: "Unlocks production-grade API protection",
          emoji: "🛡️",
          prof: 4,
          unlocked: true,
          tags: ["security", "api"],
          focusAreas: ["Security", "APIs"],
          prereqs: ["backend-2", "backend-8"],
          related: ["backend-9"],
        },
        {
          id: "backend-11",
          title: "Message Queues",
          summary: "Asynchronous processing with RabbitMQ, Kafka, and Redis.",
          description:
            "Event-driven architectures, pub/sub patterns, and job queues.",
          reward: "Unlocks scalable async workflows",
          emoji: "📮",
          prof: 4,
          unlocked: false,
          tags: ["queues", "async"],
          focusAreas: ["Architecture", "Scalability"],
          prereqs: ["backend-2", "backend-6"],
          related: ["backend-12", "database-4"],
        },
        {
          id: "backend-12",
          title: "Microservices Architecture",
          summary: "Service decomposition, API gateways, and distributed systems.",
          description:
            "Building and orchestrating microservices with proper patterns.",
          reward: "Unlocks scalable system design",
          emoji: "🧩",
          prof: 5,
          unlocked: false,
          tags: ["microservices", "architecture"],
          focusAreas: ["Architecture", "Scalability"],
          prereqs: ["backend-2", "backend-11", "languages-10"],
          related: ["devops-5", "backend-4", "backend-9"],
        },
      ],
    },
    {
      id: "database",
      label: "Data & Databases",
      order: 4,
      color: "rgba(100, 75, 50, 0.82)",
      description:
        "Data modeling, persistence strategies, and real-time data systems.",
      focus: ["Data", "Persistence", "Realtime"],
      nodes: [
        {
          id: "backend-5",
          title: "SQL & Databases",
          summary: "Relational modeling, querying, and performance basics.",
          description: "Relational modeling, querying, and performance basics.",
          reward: "Unlocks robust data persistence and reporting",
          icon: "images/logo-sql.png",
          prof: 3,
          unlocked: true,
          tags: ["sql", "database"],
          focusAreas: ["Data"],
          prereqs: ["backend-1"],
          related: ["backend-6", "backend-2"],
        },
        {
          id: "backend-6",
          title: "NoSQL Databases",
          summary:
            "Document, key-value, and graph databases for unstructured data.",
          description:
            "Document, key-value, and graph databases for unstructured data.",
          reward: "Unlocks scalable, flexible data storage",
          emoji: "�️",
          prof: 4,
          unlocked: true,
          tags: ["nosql", "database"],
          focusAreas: ["Data"],
          prereqs: ["backend-5"],
          related: ["backend-5", "backend-7"],
        },
        {
          id: "backend-7",
          title: "Firebase",
          summary: "Realtime database, auth, storage, and hosting for web apps.",
          description:
            "Realtime database, auth, storage, and hosting for web apps.",
          reward: "Unlocks serverless backends and rapid prototypes",
          emoji: "�",
          prof: 4,
          unlocked: true,
          tags: ["firebase", "serverless"],
          focusAreas: ["Backend", "Prototyping"],
          prereqs: ["web-2"],
          related: ["backend-6", "devops-7"],
        },
        {
          id: "database-4",
          title: "Data Pipelines",
          summary: "ETL workflows, data validation, and orchestration.",
          description:
            "Building reliable data pipelines with Airflow or similar tools.",
          reward: "Unlocks automated data workflows",
          emoji: "🔄",
          prof: 4,
          unlocked: false,
          tags: ["etl", "data-engineering"],
          focusAreas: ["Data", "Engineering"],
          prereqs: ["backend-5", "languages-1"],
          related: ["ai-8", "backend-11"],
        },
        {
          id: "database-5",
          title: "Vector Databases",
          summary: "Embedding storage and similarity search for AI applications.",
          description:
            "Pinecone, Weaviate, and vector search for RAG systems.",
          reward: "Unlocks semantic search capabilities",
          emoji: "🎯",
          prof: 4,
          unlocked: false,
          tags: ["vector-db", "ai"],
          focusAreas: ["AI", "Data"],
          prereqs: ["backend-6", "ai-3"],
          related: ["ai-5", "ai-7"],
        },
      ],
    },
    {
      id: "devops",
      label: "DevOps & Infrastructure",
      order: 5,
      color: "rgba(95, 70, 45, 0.85)",
      description:
        "Version control, containerization, orchestration, and infrastructure automation for scalable deployments.",
      focus: ["Infrastructure", "Deployment", "Automation"],
      nodes: [
        {
          id: "devops-1",
          title: "Git & GitHub",
          summary: "Branching, PR workflows, and collaboration best practices.",
          description:
            "Branching, PR workflows, and collaboration best practices.",
          reward: "Unlocks reliable versioning and teamwork",
          icon: "images/logo-github.png",
          prof: 3,
          unlocked: true,
          tags: ["git", "version-control"],
          focusAreas: ["Collaboration"],
          prereqs: [],
          related: ["devops-3"],
        },
        {
          id: "devops-2",
          title: "Linux & Dev Environment",
          summary: "Shell, package managers, and developer environment setup.",
          description: "Shell, package managers, and developer environment setup.",
          reward: "Unlocks efficient development workflows",
          emoji: "🐧",
          prof: 3,
          unlocked: true,
          tags: ["linux", "environment"],
          focusAreas: ["Tooling"],
          prereqs: [],
          related: ["languages-6", "devops-4"],
        },
        {
          id: "languages-6",
          title: "Bash Scripting",
          summary: "Shell scripting, automation, and system management.",
          description: "Shell scripting, automation, and system management.",
          reward: "Unlocks advanced DevOps workflows",
          emoji: "🐚",
          prof: 4,
          unlocked: true,
          tags: ["bash", "automation", "scripting"],
          focusAreas: ["Automation", "DevOps"],
          prereqs: ["devops-2"],
          related: ["devops-4", "automation-1"],
        },
        {
          id: "devops-3",
          title: "CI/CD Pipelines",
          summary: "Automated builds, tests, and deployments with pipelines.",
          description: "Automated builds, tests, and deployments with pipelines.",
          reward: "Unlocks rapid, reliable releases",
          emoji: "🔁",
          prof: 4,
          unlocked: true,
          tags: ["ci", "cd"],
          focusAreas: ["Delivery"],
          prereqs: ["devops-1"],
          related: ["automation-1"],
        },
        {
          id: "devops-4",
          title: "Docker Basics",
          summary: "Containerization, images, and local development environments.",
          description:
            "Containerization, images, and local development environments.",
          reward: "Unlocks reproducible dev and deployments",
          emoji: "🐳",
          prof: 4,
          unlocked: true,
          tags: ["docker", "containers"],
          focusAreas: ["DevOps"],
          prereqs: ["devops-2"],
          related: ["devops-5", "ai-6"],
        },
        {
          id: "devops-5",
          title: "Kubernetes Basics",
          summary: "Container orchestration, deployments, and scaling services.",
          description:
            "Container orchestration, deployments, and scaling services.",
          reward: "Unlocks scalable, automated service management",
          emoji: "☸️",
          prof: 5,
          unlocked: false,
          tags: ["kubernetes", "ops"],
          focusAreas: ["DevOps"],
          prereqs: ["devops-4", "devops-3"],
          related: ["devops-8", "devops-9"],
        },
        {
          id: "devops-6",
          title: "Cloudflare Workers",
          summary: "Edge compute for serverless functions and web APIs.",
          description: "Edge compute for serverless functions and web APIs.",
          reward: "Unlocks low-latency edge deployments",
          emoji: "☁️",
          prof: 4,
          unlocked: true,
          tags: ["edge", "serverless"],
          focusAreas: ["Performance", "Deployment"],
          prereqs: ["web-2"],
          related: ["web-18"],
        },
        {
          id: "devops-7",
          title: "Serverless Functions",
          summary: "API routes and background jobs on serverless platforms.",
          description:
            "API routes, jobs, and workflows deployed on serverless providers (Vercel, AWS Lambda).",
          reward: "Unlocks elastic backend scaling",
          emoji: "⚙️",
          prof: 5,
          unlocked: true,
          tags: ["serverless", "backend"],
          focusAreas: ["Scalability"],
          prereqs: ["backend-2"],
          related: ["devops-8", "ai-6"],
        },
        {
          id: "devops-8",
          title: "Google Cloud Platform (GCP)",
          summary: "Compute, storage, networking, and managed services on GCP.",
          description:
            "Compute, storage, networking, and managed services on GCP.",
          reward: "Unlocks scalable cloud deployments",
          emoji: "🛰️",
          prof: 4,
          unlocked: true,
          tags: ["gcp", "cloud"],
          focusAreas: ["Cloud", "Infrastructure"],
          prereqs: ["devops-2", "devops-4"],
          related: ["devops-7", "devops-9"],
        },
        {
          id: "devops-9",
          title: "Terraform & IaC",
          summary: "Infrastructure as code for repeatable cloud architecture.",
          description:
            "Infrastructure as code workflows to provision, version, and audit cloud infrastructure.",
          reward: "Unlocks reproducible infrastructure automation",
          emoji: "🏗️",
          prof: 5,
          unlocked: false,
          tags: ["iac", "terraform"],
          focusAreas: ["DevOps", "Cloud"],
          prereqs: ["devops-5", "devops-8", "languages-6"],
          related: ["devops-5", "backend-5"],
        },
      ],
    },
    {
      id: "monitoring",
      label: "Monitoring & Observability",
      order: 7,
      color: "rgba(180, 100, 60, 0.8)",
      description:
        "Production monitoring, observability, and testing practices for maintaining reliable systems.",
      focus: ["Monitoring", "Quality", "Reliability"],
      nodes: [
        {
          id: "devops-10",
          title: "Observability (Grafana)",
          summary: "Dashboards, metrics, and alerting for production systems.",
          description:
            "Dashboards, metrics, tracing, and alerting to maintain healthy production systems.",
          reward: "Unlocks proactive monitoring and SLO tracking",
          emoji: "📈",
          prof: 4,
          unlocked: true,
          tags: ["observability", "monitoring"],
          focusAreas: ["Reliability"],
          prereqs: ["automation-1"],
          related: ["devops-3", "ai-6"],
        },
        {
          id: "automation-1",
          title: "QA & CI",
          summary: "Testing fundamentals and CI pipelines for reliable releases.",
          description:
            "Testing fundamentals and CI pipelines for reliable releases.",
          reward: "Unlocks automated quality gates",
          emoji: "✅",
          prof: 4,
          unlocked: true,
          tags: ["testing", "ci"],
          focusAreas: ["Quality"],
          prereqs: ["devops-1"],
          related: ["automation-2", "devops-3"],
        },
        {
          id: "automation-2",
          title: "Unit Testing",
          summary:
            "Test frameworks and best practices (Jest, NUnit, PyTest) for reliable code.",
          description:
            "Test frameworks and best practices (Jest, NUnit, PyTest) for reliable code.",
          reward: "Unlocks safer refactors and higher quality",
          emoji: "🧪",
          prof: 4,
          unlocked: true,
          tags: ["testing", "quality"],
          focusAreas: ["Quality"],
          prereqs: ["automation-1", "languages-2"],
          related: ["automation-3", "automation-4", "devops-10"],
        },
        {
          id: "automation-3",
          title: "Puppeteer",
          summary: "Headless Chrome automation for testing and scraping.",
          description: "Headless Chrome automation for testing and scraping.",
          reward: "Unlocks robust browser automation",
          emoji: "🤖",
          prof: 4,
          unlocked: true,
          tags: ["automation", "testing"],
          focusAreas: ["Testing", "Tooling"],
          prereqs: ["backend-1", "web-2"],
          related: ["automation-2", "automation-4", "web-3"],
        },
        {
          id: "automation-4",
          title: "Selenium",
          summary: "Cross-browser automation for end-to-end testing.",
          description: "Cross-browser automation for end-to-end testing.",
          reward: "Unlocks UI regression and E2E coverage",
          emoji: "🚗",
          prof: 4,
          unlocked: true,
          tags: ["testing", "automation"],
          focusAreas: ["Quality"],
          prereqs: ["languages-1", "automation-1"],
          related: ["automation-3"],
        },
        {
          id: "automation-5",
          title: "Integration Testing",
          summary: "Testing component interactions and API contracts.",
          description:
            "End-to-end flows, database integration, and service mocking.",
          reward: "Unlocks comprehensive test coverage",
          emoji: "🔗",
          prof: 4,
          unlocked: false,
          tags: ["testing", "integration"],
          focusAreas: ["Quality", "Testing"],
          prereqs: ["automation-2"],
          related: ["automation-6"],
        },
        {
          id: "automation-6",
          title: "Performance Testing",
          summary: "Load testing, stress testing, and performance profiling.",
          description:
            "JMeter, k6, and Lighthouse for performance validation.",
          reward: "Unlocks scalability assurance",
          emoji: "⚡",
          prof: 3,
          unlocked: false,
          tags: ["testing", "performance"],
          focusAreas: ["Performance", "Quality"],
          prereqs: ["automation-1"],
          related: ["devops-10"],
        },
      ],
    },
    {
      id: "design",
      label: "Design & Experience",
      order: 8,
      color: "rgba(138, 43, 226, 0.7)",
      description:
        "Creative tooling for visual and experiential asset production across media.",
      focus: ["Design", "3D", "UX"],
      nodes: [
        {
          id: "design-1",
          title: "Photoshop Basics",
          summary: "Raster editing, asset optimization, and export pipelines.",
          description:
            "Raster editing, asset optimization, and export pipelines.",
          reward: "Unlocks clean visual assets for apps",
          icon: "images/logo-photoshop.png",
          prof: 4,
          unlocked: true,
          tags: ["design", "photoshop"],
          focusAreas: ["Design"],
          prereqs: [],
          related: ["web-1", "web-3"],
        },
        {
          id: "design-2",
          title: "Blender Basics",
          summary: "Modeling, materials, and export formats for 3D assets.",
          description: "Modeling, materials, and export formats for 3D assets.",
          reward: "Unlocks 3D assets for games and visuals",
          icon: "images/logo-blender.png",
          prof: 3,
          unlocked: true,
          tags: ["3d", "blender"],
          focusAreas: ["Design"],
          prereqs: [],
          related: [],
        },
        {
          id: "design-3",
          title: "Figma Basics",
          summary: "Collaborative UI/UX design, prototyping, and asset export.",
          description:
            "Collaborative UI/UX design, prototyping, and asset export.",
          reward: "Unlocks rapid interface design and collaboration",
          emoji: "🎨",
          prof: 3,
          unlocked: true,
          tags: ["figma", "design"],
          focusAreas: ["Design", "Collaboration"],
          prereqs: ["web-1"],
          related: ["web-3", "web-11"],
        },
      ],
    },
    {
      id: "ai",
      label: "AI/ML",
      order: 9,
      color: "rgba(60, 90, 140, 0.85)",
      description:
        "Machine learning libraries, tooling, and applied AI workflows.",
      focus: ["Machine Learning", "LLMs", "Data"],
      nodes: [
        {
          id: "ai-3",
          title: "NumPy",
          summary: "Fundamental package for scientific computing in Python.",
          description: "Fundamental package for scientific computing in Python.",
          reward: "Unlocks vectorized numerical computing",
          emoji: "📊",
          prof: 4,
          unlocked: true,
          tags: ["numpy", "python"],
          focusAreas: ["Numerical", "Data"],
          prereqs: ["languages-1"],
          related: ["ai-1", "ai-2"],
        },
        {
          id: "ai-1",
          title: "TensorFlow",
          summary: "Deep learning framework for building and training neural networks.",
          description:
            "Deep learning framework for building and training neural networks.",
          reward: "Unlocks model training and deployment",
          emoji: "🧠",
          prof: 5,
          unlocked: true,
          tags: ["tensorflow", "deep-learning"],
          focusAreas: ["Modeling"],
          prereqs: ["languages-1", "ai-3"],
          related: ["ai-5", "ai-6"],
        },
        {
          id: "ai-2",
          title: "Flax & JAX",
          summary: "High-performance ML with JAX and neural networks via Flax.",
          description:
            "High-performance ML with JAX and neural networks via Flax.",
          reward: "Unlocks fast, composable research workflows",
          emoji: "⚡",
          prof: 5,
          unlocked: true,
          tags: ["jax", "flax"],
          focusAreas: ["Research", "Modeling"],
          prereqs: ["languages-1", "ai-3"],
          related: ["ai-6"],
        },
        {
          id: "ai-4",
          title: "Ollama",
          summary: "Local LLM runner for fast prototyping and inference.",
          description: "Local LLM runner for fast prototyping and inference.",
          reward: "Unlocks local LLM experimentation",
          emoji: "🦙",
          prof: 4,
          unlocked: true,
          tags: ["ollama", "llm"],
          focusAreas: ["Inference"],
          prereqs: ["languages-1"],
          related: ["ai-7"],
        },
        {
          id: "ai-5",
          title: "LlamaIndex",
          summary:
            "Data framework for augmenting LLMs with private or external data.",
          description:
            "Data framework for augmenting LLMs with private or external data.",
          reward: "Unlocks RAG pipelines and data connectors",
          emoji: "📚",
          prof: 5,
          unlocked: true,
          tags: ["llamaindex", "rag"],
          focusAreas: ["RAG", "Data"],
          prereqs: ["languages-1", "ai-1"],
          related: ["ai-7"],
        },
        {
          id: "ai-6",
          title: "MLOps Pipelines",
          summary: "Model packaging, deployment, and continuous retraining workflows.",
          description:
            "Model packaging, deployment, monitoring, and continuous retraining workflows.",
          reward: "Unlocks production-grade ML services",
          emoji: "🧬",
          prof: 5,
          unlocked: true,
          tags: ["mlops", "deployment"],
          focusAreas: ["Operations", "Automation"],
          prereqs: ["ai-1", "devops-4"],
          related: ["devops-10", "ai-7"],
        },
        {
          id: "ai-8",
          title: "Pandas & Data Analysis",
          summary: "Data manipulation, cleaning, and analysis with Pandas DataFrames.",
          description:
            "DataFrame operations, data cleaning, transformation, and exploratory data analysis.",
          reward: "Unlocks efficient data wrangling workflows",
          emoji: "🐼",
          prof: 4,
          unlocked: true,
          tags: ["pandas", "data-science"],
          focusAreas: ["Data", "Analysis"],
          prereqs: ["ai-3"],
          related: ["ai-9", "ai-1"],
        },
        {
          id: "ai-9",
          title: "Data Visualization",
          summary:
            "Creating insights through Matplotlib, Seaborn, and Plotly visualizations.",
          description:
            "Statistical plots, interactive dashboards, and data storytelling.",
          reward: "Unlocks visual data communication",
          emoji: "📊",
          prof: 3,
          unlocked: true,
          tags: ["visualization", "analytics"],
          focusAreas: ["Visualization", "Analysis"],
          prereqs: ["ai-8"],
          related: ["ai-3"],
        },
        {
          id: "ai-10",
          title: "Scikit-learn",
          summary: "Classical ML algorithms, preprocessing, and model evaluation.",
          description:
            "Supervised/unsupervised learning, pipelines, and cross-validation.",
          reward: "Unlocks traditional ML workflows",
          emoji: "🔬",
          prof: 4,
          unlocked: true,
          tags: ["scikit-learn", "ml"],
          focusAreas: ["ML", "Modeling"],
          prereqs: ["ai-8", "languages-9"],
          related: ["ai-1", "ai-11", "ai-6"],
        },
        {
          id: "ai-11",
          title: "PyTorch",
          summary: "Dynamic neural networks and deep learning research framework.",
          description:
            "Tensors, autograd, and flexible model architectures for research.",
          reward: "Unlocks research-grade deep learning",
          emoji: "🔥",
          prof: 5,
          unlocked: true,
          tags: ["pytorch", "deep-learning"],
          focusAreas: ["Deep Learning", "Research"],
          prereqs: ["ai-3", "ai-8"],
          related: ["ai-1", "ai-2", "ai-6"],
        },
        {
          id: "ai-7",
          title: "LLM Ops & Evaluation",
          summary: "Prompt pipelines, evaluation loops, and guardrails for LLMs.",
          description:
            "Prompt pipelines, evaluation loops, guardrails, and observability for production LLM systems.",
          reward: "Unlocks reliable LLM-backed products",
          emoji: "🛡️",
          prof: 5,
          unlocked: false,
          tags: ["llm", "evaluation"],
          focusAreas: ["LLM", "Operations"],
          prereqs: ["ai-4", "ai-6", "backend-2"],
          related: ["ai-5", "backend-10"],
        },
      ],
    },
  ];

  const curatedConnections = [
    // Web progression and specialization
    { from: "web-1", to: "web-2", type: "progression" },
    { from: "web-2", to: "web-6", type: "progression" },
    { from: "web-6", to: "web-3", type: "progression" },
    { from: "web-6", to: "web-5", type: "expansion" },
    { from: "web-3", to: "web-12", type: "architecture" },
    { from: "web-3", to: "web-14", type: "expansion" },
    { from: "web-4", to: "web-14", type: "experience" },
    { from: "web-5", to: "web-14", type: "synergy" },
    { from: "web-14", to: "web-18", type: "performance" },
    { from: "web-1", to: "web-4", type: "styling" },
    { from: "web-2", to: "web-7", type: "framework" },
    { from: "web-7", to: "web-8", type: "framework" },
    { from: "web-6", to: "web-7", type: "related" },
    { from: "web-3", to: "web-10", type: "mobile" },

    // Backend & API progression
    { from: "web-2", to: "backend-1", type: "progression" },
    { from: "backend-1", to: "backend-2", type: "progression" },
    { from: "backend-1", to: "backend-3", type: "branch" },
    { from: "backend-3", to: "backend-4", type: "progression" },
    { from: "backend-2", to: "backend-8", type: "security" },
    { from: "web-2", to: "backend-8", type: "foundation" },
    { from: "backend-2", to: "web-3", type: "fullstack" },
    { from: "backend-4", to: "backend-9", type: "pattern" },
    { from: "languages-1", to: "backend-1", type: "runtime" },
    { from: "languages-1", to: "backend-3", type: "runtime" },

    // Data & Databases cluster
    { from: "backend-5", to: "backend-6", type: "branch" },
    { from: "backend-6", to: "backend-7", type: "expansion" },
    { from: "web-2", to: "backend-7", type: "progression" },
    { from: "backend-1", to: "database-1", type: "persistence" },
    { from: "backend-1", to: "database-2", type: "persistence" },
    { from: "database-1", to: "database-2", type: "paradigm" },
    { from: "database-2", to: "database-3", type: "cloud" },
    { from: "database-3", to: "database-5", type: "integration" },
    { from: "database-5", to: "web-3", type: "integration" },
    { from: "database-2", to: "ai-5", type: "vectordb" },

    // Language foundations and crossovers
    { from: "languages-1", to: "ai-3", type: "progression" },
    { from: "languages-1", to: "automation-4", type: "automation" },
    { from: "languages-2", to: "web-2", type: "foundation" },
    { from: "languages-2", to: "languages-9", type: "synergy" },
    { from: "languages-3", to: "languages-10", type: "architecture" },
    { from: "languages-4", to: "languages-10", type: "architecture" },
    { from: "languages-4", to: "languages-12", type: "expansion" },
    { from: "languages-5", to: "languages-11", type: "expansion" },
    { from: "languages-9", to: "ai-3", type: "analysis" },
    { from: "languages-9", to: "languages-10", type: "architecture" },
    { from: "languages-3", to: "languages-4", type: "related" },
    { from: "languages-5", to: "languages-7", type: "related" },
    { from: "languages-1", to: "web-2", type: "ecosystem" },

    // DevOps & Infrastructure evolution
    { from: "devops-1", to: "devops-3", type: "progression" },
    { from: "devops-2", to: "languages-6", type: "tooling" },
    { from: "languages-6", to: "devops-4", type: "automation" },
    { from: "devops-2", to: "devops-4", type: "platform" },
    { from: "devops-4", to: "devops-5", type: "progression" },
    { from: "devops-4", to: "devops-8", type: "platform" },
    { from: "devops-5", to: "devops-9", type: "expansion" },
    { from: "devops-8", to: "devops-9", type: "synergy" },
    { from: "devops-1", to: "backend-6", type: "containerization" },
    { from: "devops-3", to: "backend-10", type: "orchestration" },
    { from: "devops-5", to: "devops-7", type: "related" },
    { from: "languages-6", to: "devops-9", type: "scripting" },
    { from: "tools-6", to: "devops-1", type: "vcs" },

    // Cloud & Serverless cluster
    { from: "web-2", to: "devops-6", type: "expansion" },
    { from: "devops-6", to: "web-18", type: "synergy" },
    { from: "devops-6", to: "devops-7", type: "branch" },
    { from: "backend-2", to: "devops-7", type: "expansion" },
    { from: "backend-7", to: "devops-7", type: "synergy" },
    { from: "devops-7", to: "devops-8", type: "platform" },
    { from: "devops-8", to: "devops-9", type: "expansion" },
    { from: "cloud-1", to: "cloud-2", type: "platform" },
    { from: "cloud-2", to: "backend-3", type: "deployment" },
    { from: "cloud-3", to: "cloud-4", type: "infrastructure" },
    { from: "cloud-4", to: "devops-3", type: "automation" },
    { from: "backend-6", to: "cloud-1", type: "edge" },
    { from: "cloud-3", to: "backend-3", type: "platform" },
    { from: "devops-5", to: "cloud-4", type: "iac" },
    { from: "cloud-2", to: "ai-6", type: "deployment" },

    // Monitoring & Testing cluster
    { from: "devops-1", to: "automation-1", type: "quality" },
    { from: "automation-1", to: "devops-3", type: "delivery" },
    { from: "automation-1", to: "automation-2", type: "quality" },
    { from: "automation-1", to: "devops-10", type: "observability" },
    { from: "automation-2", to: "automation-3", type: "tooling" },
    { from: "automation-2", to: "automation-4", type: "tooling" },
    { from: "automation-3", to: "automation-4", type: "synergy" },
    { from: "backend-1", to: "automation-3", type: "tooling" },
    { from: "devops-3", to: "devops-10", type: "observability" },
    { from: "devops-10", to: "automation-2", type: "quality" },
    { from: "languages-10", to: "automation-1", type: "quality" },
    { from: "web-2", to: "automation-1", type: "testing" },
    { from: "backend-2", to: "automation-2", type: "testing" },
    { from: "devops-2", to: "automation-1", type: "observability" },

    // Tools & Design connections
    { from: "tools-1", to: "tools-2", type: "related" },
    { from: "tools-3", to: "tools-4", type: "related" },
    { from: "tools-8", to: "web-1", type: "tooling" },
    { from: "tools-9", to: "web-6", type: "workflow" },

    // AI & ML workflows
    { from: "ai-3", to: "ai-1", type: "progression" },
    { from: "ai-3", to: "ai-2", type: "progression" },
    { from: "ai-1", to: "ai-5", type: "application" },
    { from: "ai-1", to: "ai-6", type: "deployment" },
    { from: "languages-1", to: "ai-4", type: "tooling" },
    { from: "ai-4", to: "ai-7", type: "expansion" },
    { from: "ai-5", to: "ai-7", type: "synergy" },
    { from: "ai-6", to: "ai-7", type: "progression" },
    { from: "devops-4", to: "ai-6", type: "platform" },
    { from: "devops-10", to: "ai-6", type: "observability" },
    { from: "ai-3", to: "ai-4", type: "related" },
    { from: "backend-4", to: "ai-5", type: "architecture" },

    // === NEW CONNECTIONS ===
    
    // Design → Frontend workflows
    { from: "design-3", to: "web-1", type: "workflow" },
    { from: "design-3", to: "web-7", type: "tooling" },
    { from: "design-1", to: "web-1", type: "assets" },

    // AI → Backend (ML Serving)
    { from: "ai-1", to: "backend-2", type: "deployment" },
    { from: "ai-6", to: "backend-2", type: "serving" },
    { from: "ai-6", to: "devops-7", type: "serverless-ml" },

    // Data Science Pipeline
    { from: "ai-3", to: "ai-8", type: "progression" },
    { from: "ai-8", to: "ai-9", type: "visualization" },
    { from: "ai-8", to: "ai-10", type: "modeling" },
    { from: "ai-10", to: "ai-1", type: "deep-learning" },
    { from: "ai-10", to: "ai-11", type: "alternative" },
    { from: "ai-11", to: "ai-1", type: "related" },
    { from: "languages-1", to: "ai-8", type: "data" },

    // Frontend Tooling
    { from: "web-1", to: "web-7", type: "styling" },
    { from: "web-2", to: "web-8", type: "tooling" },
    { from: "web-7", to: "web-3", type: "integration" },
    { from: "web-7", to: "web-14", type: "integration" },
    { from: "web-8", to: "web-3", type: "build" },
    { from: "web-8", to: "web-14", type: "build" },

    // Mobile Development
    { from: "web-3", to: "web-10", type: "expansion" },
    { from: "web-10", to: "web-11", type: "progression" },
    { from: "design-3", to: "web-11", type: "design" },

    // Alternative Frameworks
    { from: "web-2", to: "web-9", type: "alternative" },
    { from: "web-9", to: "web-12", type: "state" },
    { from: "web-3", to: "web-9", type: "comparison" },

    // Backend Security & Auth
    { from: "backend-2", to: "backend-9", type: "security" },
    { from: "backend-8", to: "backend-9", type: "progression" },
    { from: "backend-9", to: "backend-10", type: "api-security" },
    { from: "backend-2", to: "backend-10", type: "security" },

    // Microservices & Messaging
    { from: "backend-2", to: "backend-11", type: "async" },
    { from: "backend-11", to: "backend-12", type: "architecture" },
    { from: "backend-12", to: "devops-5", type: "orchestration" },
    { from: "backend-12", to: "backend-4", type: "api-gateway" },

    // Advanced Testing
    { from: "automation-2", to: "automation-5", type: "progression" },
    { from: "automation-5", to: "backend-2", type: "api-testing" },
    { from: "automation-1", to: "automation-6", type: "performance" },
    { from: "automation-6", to: "devops-10", type: "monitoring" },

    // Data Engineering
    { from: "backend-5", to: "database-4", type: "pipelines" },
    { from: "database-4", to: "ai-8", type: "data-prep" },
    { from: "database-4", to: "backend-11", type: "orchestration" },
    { from: "backend-6", to: "database-5", type: "vector-search" },
    { from: "database-5", to: "ai-5", type: "rag" },
    { from: "database-5", to: "ai-7", type: "llm-data" },
    { from: "languages-1", to: "database-4", type: "automation" },

    // === REINFORCED CONNECTIONS - More Bidirectional & Cross-Domain ===
    
    // TypeScript → Backend & Frameworks
    { from: "web-6", to: "backend-1", type: "type-safety" },
    { from: "web-5", to: "backend-2", type: "type-safety" },
    { from: "web-5", to: "backend-3", type: "type-safety" },
    { from: "web-5", to: "web-12", type: "architecture" },
    
    // Build Tools → All Frameworks
    { from: "web-8", to: "web-9", type: "build" },
    { from: "web-8", to: "web-4", type: "build" },
    { from: "web-8", to: "web-10", type: "build" },
    
    // Databases → Backend APIs (bidirectional awareness)
    { from: "backend-5", to: "backend-2", type: "persistence" },
    { from: "backend-6", to: "backend-2", type: "persistence" },
    { from: "backend-6", to: "backend-3", type: "persistence" },
    { from: "backend-6", to: "backend-4", type: "persistence" },
    { from: "backend-5", to: "backend-3", type: "persistence" },
    { from: "backend-7", to: "web-3", type: "backend" },
    { from: "backend-7", to: "web-14", type: "backend" },
    
    // Testing → Domain Applications
    { from: "automation-3", to: "web-3", type: "testing" },
    { from: "automation-3", to: "web-14", type: "testing" },
    { from: "automation-4", to: "web-3", type: "testing" },
    { from: "automation-5", to: "web-14", type: "testing" },
    { from: "automation-5", to: "backend-12", type: "testing" },
    { from: "automation-6", to: "backend-2", type: "testing" },
    { from: "automation-6", to: "web-18", type: "testing" },
    
    // Security → All API Types
    { from: "backend-8", to: "backend-2", type: "security" },
    { from: "backend-8", to: "backend-3", type: "security" },
    { from: "backend-8", to: "backend-4", type: "security" },
    { from: "backend-10", to: "backend-3", type: "security" },
    { from: "backend-10", to: "backend-4", type: "security" },
    { from: "backend-10", to: "devops-6", type: "security" },
    { from: "backend-10", to: "devops-7", type: "security" },
    
    // Languages → Backend Frameworks (runtime awareness)
    { from: "languages-2", to: "backend-1", type: "runtime" },
    { from: "languages-2", to: "backend-2", type: "runtime" },
    { from: "languages-2", to: "devops-6", type: "runtime" },
    { from: "languages-3", to: "backend-2", type: "alternative" },
    { from: "languages-4", to: "backend-2", type: "alternative" },
    { from: "languages-11", to: "backend-2", type: "alternative" },
    { from: "languages-12", to: "backend-2", type: "alternative" },
    
    // Design Tools → Implementation
    { from: "design-2", to: "web-3", type: "assets" },
    { from: "design-1", to: "web-3", type: "assets" },
    { from: "design-3", to: "web-3", type: "design" },
    { from: "design-3", to: "web-14", type: "design" },
    { from: "design-3", to: "web-4", type: "design" },
    
    // State Management → Frameworks
    { from: "web-12", to: "web-14", type: "architecture" },
    { from: "web-12", to: "web-4", type: "state" },
    { from: "web-12", to: "web-10", type: "state" },
    
    // Mobile → Design Patterns
    { from: "web-10", to: "web-4", type: "offline" },
    { from: "web-11", to: "web-1", type: "foundation" },
    { from: "web-11", to: "design-3", type: "feedback" },
    
    // DevOps → Deployment Targets
    { from: "devops-3", to: "web-14", type: "deployment" },
    { from: "devops-3", to: "backend-2", type: "deployment" },
    { from: "devops-3", to: "web-18", type: "deployment" },
    { from: "devops-4", to: "backend-2", type: "containerization" },
    { from: "devops-4", to: "web-14", type: "containerization" },
    { from: "devops-5", to: "backend-2", type: "orchestration" },
    { from: "devops-5", to: "backend-12", type: "orchestration" },
    
    // Cloud Platforms → Services
    { from: "devops-8", to: "backend-2", type: "hosting" },
    { from: "devops-8", to: "web-14", type: "hosting" },
    { from: "devops-8", to: "backend-5", type: "managed-db" },
    { from: "devops-8", to: "backend-6", type: "managed-db" },
    { from: "devops-8", to: "ai-6", type: "ml-platform" },
    
    // Serverless → Edge Computing
    { from: "devops-7", to: "web-18", type: "edge" },
    { from: "devops-7", to: "devops-6", type: "edge" },
    { from: "devops-7", to: "backend-3", type: "deployment" },
    { from: "devops-7", to: "backend-4", type: "deployment" },
    
    // Monitoring → All Production Systems
    { from: "devops-10", to: "backend-2", type: "monitoring" },
    { from: "devops-10", to: "backend-12", type: "monitoring" },
    { from: "devops-10", to: "web-14", type: "monitoring" },
    { from: "devops-10", to: "web-18", type: "monitoring" },
    { from: "devops-10", to: "devops-5", type: "monitoring" },
    { from: "devops-10", to: "devops-8", type: "monitoring" },
    
    // Advanced Languages → Systems
    { from: "languages-11", to: "devops-4", type: "tooling" },
    { from: "languages-11", to: "devops-5", type: "tooling" },
    { from: "languages-12", to: "devops-5", type: "tooling" },
    { from: "languages-12", to: "backend-11", type: "messaging" },
    { from: "languages-12", to: "backend-12", type: "services" },
    
    // Data Science → Visualization
    { from: "ai-9", to: "web-3", type: "visualization" },
    { from: "ai-9", to: "backend-2", type: "api" },
    
    // ML Frameworks → Deployment
    { from: "ai-11", to: "ai-6", type: "deployment" },
    { from: "ai-10", to: "ai-6", type: "deployment" },
    { from: "ai-2", to: "ai-6", type: "deployment" },
    
    // LLM Tools → Infrastructure
    { from: "ai-4", to: "devops-4", type: "containerization" },
    { from: "ai-4", to: "devops-8", type: "deployment" },
    { from: "ai-7", to: "backend-2", type: "api" },
    { from: "ai-7", to: "backend-10", type: "security" },
    { from: "ai-7", to: "devops-10", type: "monitoring" },
    
    // Auth → All Application Types
    { from: "backend-9", to: "web-3", type: "integration" },
    { from: "backend-9", to: "web-14", type: "integration" },
    { from: "backend-9", to: "web-10", type: "integration" },
    { from: "backend-9", to: "backend-7", type: "integration" },
    
    // Microservices → Testing & Monitoring
    { from: "backend-12", to: "automation-5", type: "testing" },
    { from: "backend-12", to: "automation-6", type: "testing" },
    { from: "backend-12", to: "devops-10", type: "observability" },
    
    // Message Queues → Use Cases
    { from: "backend-11", to: "backend-2", type: "async" },
    { from: "backend-11", to: "ai-6", type: "async" },
    { from: "backend-11", to: "database-4", type: "streaming" },
    
    // Data Pipelines → ML Training
    { from: "database-4", to: "ai-1", type: "training-data" },
    { from: "database-4", to: "ai-10", type: "training-data" },
    { from: "database-4", to: "ai-11", type: "training-data" },
    
    // Vector DBs → AI Applications
    { from: "database-5", to: "ai-4", type: "embeddings" },
    { from: "database-5", to: "backend-2", type: "search" },
    
    // Performance Testing → Critical Paths
    { from: "automation-6", to: "backend-12", type: "load-testing" },
    { from: "automation-6", to: "database-4", type: "load-testing" },
    { from: "automation-6", to: "web-3", type: "load-testing" },
    
    // Integration Testing → System Boundaries
    { from: "automation-5", to: "backend-9", type: "testing" },
    { from: "automation-5", to: "backend-11", type: "testing" },
    { from: "automation-5", to: "database-4", type: "testing" },
    
    // IaC → All Infrastructure
    { from: "devops-9", to: "backend-2", type: "provisioning" },
    { from: "devops-9", to: "backend-5", type: "provisioning" },
    { from: "devops-9", to: "backend-6", type: "provisioning" },
    { from: "devops-9", to: "devops-10", type: "provisioning" },
    
    // Bash Scripting → Automation Everywhere
    { from: "languages-6", to: "automation-1", type: "automation" },
    { from: "languages-6", to: "devops-3", type: "automation" },
    { from: "languages-6", to: "devops-8", type: "automation" },
    { from: "languages-6", to: "database-4", type: "automation" },
    
    // OOP/Patterns → Framework Understanding
    { from: "languages-10", to: "web-3", type: "architecture" },
    { from: "languages-10", to: "backend-2", type: "architecture" },
    { from: "languages-10", to: "backend-12", type: "architecture" },
    
    // DSA → Performance Critical Code
    { from: "languages-9", to: "backend-2", type: "optimization" },
    { from: "languages-9", to: "database-4", type: "optimization" },
    { from: "languages-9", to: "ai-10", type: "algorithms" },
    
    // Progressive Enhancement
    { from: "web-4", to: "web-18", type: "performance" },
    { from: "web-4", to: "web-10", type: "offline" },
    
    // Alternative Stacks
    { from: "web-9", to: "web-14", type: "comparison" },
    { from: "languages-11", to: "languages-5", type: "modernization" },
    { from: "languages-12", to: "languages-4", type: "modernization" },
    
    // Full-Stack Connections
    { from: "web-14", to: "backend-5", type: "fullstack" },
    { from: "web-14", to: "backend-6", type: "fullstack" },
    { from: "web-3", to: "backend-3", type: "fullstack" },
    { from: "web-3", to: "backend-4", type: "fullstack" },
  ];

  const groupIndex = {};
  const groupNodes = {};
  const nodeMap = {};
  const nodeOrder = [];

  rawGroups.forEach((group) => {
    const processedNodes = group.nodes.map((node, idx) => {
      if (!node.id) {
        throw new Error(`Node missing id in group ${group.id}`);
      }
      const prereqs = Array.isArray(node.prereqs)
        ? node.prereqs.slice()
        : Array.isArray(node.prerequisites)
        ? node.prerequisites.slice()
        : [];
      const related = Array.isArray(node.related) ? node.related.slice() : [];
      const tags = Array.isArray(node.tags) ? node.tags.slice() : [];
      const focusAreas = Array.isArray(node.focusAreas)
        ? node.focusAreas.slice()
        : [];
      const profValue = Number.isFinite(node.prof)
        ? node.prof
        : Number(node.proficiency) || 0;
      const prof = Math.max(0, Math.min(5, Math.round(profValue)));
      const unlocked = node.unlocked !== undefined ? !!node.unlocked : prof > 0;

      const normalized = Object.freeze({
        id: node.id,
        key: node.id,
        slug: node.slug || node.id,
        title: node.title,
        label: node.label || node.title,
        alt: node.alt || node.title,
        summary: node.summary || node.description || "",
        description: node.description || node.summary || "",
        reward: node.reward || "",
        category: node.category || group.label,
        group: group.id,
        icon: node.icon || null,
        emoji: node.emoji || null,
        unlocked,
        prof,
        proficiency: prof,
        complexity:
          node.complexity || (prof >= 4 ? "advanced" : prof <= 2 ? "foundation" : "intermediate"),
        xp: Number.isFinite(node.xp) ? node.xp : null,
        tags: Object.freeze(tags),
        focusAreas: Object.freeze(focusAreas),
        track: node.track || group.track || null,
        metaSource: "canonical",
        prereqs: Object.freeze(prereqs),
        prerequisites: Object.freeze(prereqs),
        related: Object.freeze(related),
        links: Object.freeze({
          docs: node.links?.docs || null,
          demo: node.links?.demo || null,
          code: node.links?.code || null,
        }),
        order: node.order || idx + 1,
      });

      nodeMap[normalized.id] = normalized;
      nodeOrder.push(normalized);
      return normalized;
    });

    groupNodes[group.id] = Object.freeze(processedNodes);
    groupIndex[group.id] = Object.freeze({
      id: group.id,
      label: group.label,
      color: group.color || null,
      order: Number.isFinite(group.order) ? group.order : 0,
      description: group.description || "",
      focus: Object.freeze(group.focus || []),
      icon: group.icon || null,
      track: group.track || null,
      nodeIds: Object.freeze(processedNodes.map((n) => n.id)),
    });
  });

  const processedGroups = Object.freeze(
    Object.values(groupIndex).sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label)
    )
  );

  const curatedPairs = Object.freeze(
    curatedConnections.map((conn) =>
      Array.isArray(conn) ? conn.slice(0, 2) : [conn.from, conn.to]
    )
  );

  const stats = Object.freeze({
    totalGroups: processedGroups.length,
    totalNodes: nodeOrder.length,
    unlocked: nodeOrder.filter((n) => n.unlocked).length,
    locked: nodeOrder.filter((n) => !n.unlocked).length,
    averageProficiency:
      nodeOrder.length === 0
        ? 0
        : Number(
            (
              nodeOrder.reduce((sum, n) => sum + (Number(n.prof) || 0), 0) /
              nodeOrder.length
            ).toFixed(2)
          ),
    prerequisites: nodeOrder.reduce((sum, n) => sum + n.prereqs.length, 0),
    focusIndex: Object.freeze(
      processedGroups.map((group) => ({
        groupId: group.id,
        label: group.label,
        count: group.nodeIds.length,
      }))
    ),
  });

  const skillTreeData = Object.freeze({
    groups: processedGroups,
    groupIndex: Object.freeze({ ...groupIndex }),
    groupNodes: Object.freeze({ ...groupNodes }),
    nodes: Object.freeze({ ...nodeMap }),
    nodesList: Object.freeze(nodeOrder.slice()),
    curatedConnections: Object.freeze(
      curatedConnections.map((conn) =>
        Object.freeze({
          from: conn.from || conn[0],
          to: conn.to || conn[1],
          type: conn.type || "synergy",
          weight: conn.weight || 1,
        })
      )
    ),
    curatedPairs,
    stats,
    generatedAt: new Date().toISOString(),
  });

  global.skillTreeData = skillTreeData;
  global.perkData = skillTreeData.nodes;
  global.perkNodes = skillTreeData.groupNodes;
  global.skillTreeConnections = skillTreeData.curatedPairs;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = skillTreeData;
  }
})(typeof window !== "undefined" ? window : globalThis);
