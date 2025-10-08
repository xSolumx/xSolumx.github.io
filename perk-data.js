/**
 * Skill tree perk metadata extracted into a dedicated module.
 * Exposes a `perkData` global so legacy scripts can consume it without bundlers.
 */
(function (global) {
  const data = {
    // Core Languages
    "languages-1": {
      title: "Python Fundamentals",
      category: "Core Languages",
      description:
        "Scripting, data handling and automation for AI/ML and tooling.",
      reward: "Unlocks data wrangling and automation workflows",
    },
    "languages-2": {
      title: "JavaScript Fundamentals",
      category: "Core Languages",
      description:
        "Core JS concepts including ES modules, functions, objects, and async.",
      reward: "Unlocks modern web interactivity and tooling",
    },
    "languages-3": {
      title: "C# OOP",
      category: "Core Languages",
      description:
        "Object-oriented design, .NET ecosystem, and application architecture.",
      reward: "Unlocks backend services and tooling in .NET",
    },
    "languages-4": {
      title: "Java OOP",
      category: "Core Languages",
      description:
        "Strongly-typed OOP, JVM ecosystem, and enterprise patterns.",
      reward: "Unlocks scalable backend systems on the JVM",
    },
    "languages-5": {
      title: "C++ Systems Programming",
      category: "Core Languages",
      description:
        "Memory management, performance tuning, and engine-level development.",
      reward: "Unlocks engine/game modding and high-performance modules",
    },
    "languages-6": {
      title: "Bash Scripting",
      category: "Core Languages",
      description: "Shell scripting, automation, and system management.",
      reward: "Unlocks advanced DevOps workflows",
    },
    "languages-7": {
      title: "TypeScript Advanced",
      category: "Core Languages",
      description:
        "Advanced typing, generics, and large-scale application patterns.",
      reward: "Unlocks robust and scalable JavaScript development",
    },
    "languages-8": {
      title: "GraphQL APIs",
      category: "Core Languages",
      description:
        "Building and consuming GraphQL endpoints for efficient data querying.",
      reward: "Unlocks modern API design and integration",
    },
    "languages-9": {
      title: "Data Structures & Algorithms",
      category: "Core Languages",
      description:
        "Core DS&A concepts: arrays, hashes, trees, graphs, and complexity.",
      reward: "Unlocks stronger problem solving and interview readiness",
    },
    "languages-10": {
      title: "OOP & Design Patterns",
      category: "Core Languages",
      description:
        "SOLID, composition, and classic patterns (Factory, Strategy, Observer, etc.).",
      reward: "Unlocks maintainable, extensible code architecture",
    },

    // Web & Databases
    "web-1": {
      title: "HTML & CSS",
      category: "Web & Databases",
      description: "Semantic HTML, responsive design, and modern CSS layouts.",
      reward: "Unlocks clean, accessible UI foundations",
    },
    "web-2": {
      title: "JavaScript for Web",
      category: "Web & Databases",
      description:
        "DOM APIs, fetch, routing patterns, and client-side performance.",
      reward: "Unlocks interactive, data-driven UIs",
    },
    "web-3": {
      title: "React",
      category: "Web & Databases",
      description:
        "Component-driven UIs, hooks, state management, and composition.",
      reward: "Unlocks scalable SPA development",
    },
    "web-4": {
      title: "Progressive Web Apps (PWA)",
      category: "Web & Databases",
      description: "Service workers, offline caching, installable experiences.",
      reward: "Unlocks offline-first and installable apps",
    },
    "web-5": {
      title: "SQL & Databases",
      category: "Web & Databases",
      description: "Relational modeling, querying, and performance basics.",
      reward: "Unlocks robust data persistence and reporting",
    },
    "web-6": {
      title: "TypeScript Basics",
      category: "Web & Databases",
      description: "Types, interfaces, generics, and compiling to JavaScript.",
      reward: "Unlocks safer, scalable JS codebases",
    },
    "web-7": {
      title: "Node.js Fundamentals",
      category: "Web & Databases",
      description:
        "Building APIs, working with filesystem, and async patterns.",
      reward: "Unlocks full-stack JavaScript development",
    },
    "web-8": {
      title: "GraphQL Basics",
      category: "Web & Databases",
      description: "Schema design, resolvers, and API querying with GraphQL.",
      reward: "Unlocks flexible, client-driven APIs",
    },
    "web-9": {
      title: "NoSQL Databases",
      category: "Web & Databases",
      description:
        "Document, key-value, and graph databases for unstructured data.",
      reward: "Unlocks scalable, flexible data storage",
    },
    "web-10": {
      title: "Web Security Fundamentals",
      category: "Web & Databases",
      description:
        "XSS, CSRF, SQL injection prevention, and HTTPS best practices.",
      reward: "Unlocks secure application development",
    },
    "web-11": {
      title: "REST APIs (Express)",
      category: "Web & Databases",
      description:
        "Designing and building RESTful endpoints with Express and middleware.",
      reward: "Unlocks robust backend services and integrations",
    },
    "web-12": {
      title: "State Management",
      category: "Web & Databases",
      description:
        "Managing complex client state (Redux/Zustand/Context) and side effects.",
      reward: "Unlocks scalable front-end architectures",
    },
    "web-13": {
      title: "Firebase",
      category: "Web & Databases",
      description: "Realtime database, auth, storage, and hosting for web apps.",
      reward: "Unlocks serverless backends and rapid prototypes",
    },
    "web-14": {
      title: "Next.js",
      category: "Web & Databases",
      description: "React framework for SSR/SSG, routing, and performance.",
      reward: "Unlocks production-grade React apps",
    },
    "web-15": {
      title: "Cloudflare Workers",
      category: "Web & Databases",
      description: "Edge compute for serverless functions and web APIs.",
      reward: "Unlocks low-latency edge deployments",
    },
    "web-16": {
      title: "Puppeteer",
      category: "Web & Databases",
      description: "Headless Chrome automation for testing and scraping.",
      reward: "Unlocks robust browser automation",
    },

    // Tools & Design
    "tools-1": {
      title: "Git & GitHub",
      category: "Tools & Design",
      description: "Branching, PR workflows, and collaboration best practices.",
      reward: "Unlocks reliable versioning and teamwork",
    },
    "tools-2": {
      title: "Linux & Dev Environment",
      category: "Tools & Design",
      description: "Shell, package managers, and developer environment setup.",
      reward: "Unlocks efficient development workflows",
    },
    "tools-3": {
      title: "Photoshop Basics",
      category: "Tools & Design",
      description: "Raster editing, asset optimization, and export pipelines.",
      reward: "Unlocks clean visual assets for apps",
    },
    "tools-4": {
      title: "Blender Basics",
      category: "Tools & Design",
      description: "Modeling, materials, and export formats for 3D assets.",
      reward: "Unlocks 3D assets for games and visuals",
    },
    "tools-5": {
      title: "QA & CI",
      category: "Tools & Design",
      description:
        "Testing fundamentals and CI pipelines for reliable releases.",
      reward: "Unlocks automated quality gates",
    },
    "tools-6": {
      title: "Docker Basics",
      category: "Tools & Design",
      description:
        "Containerization, images, and local development environments.",
      reward: "Unlocks reproducible dev and deployments",
    },
    "tools-7": {
      title: "CI/CD Pipelines",
      category: "Tools & Design",
      description: "Automated builds, tests, and deployments with pipelines.",
      reward: "Unlocks rapid, reliable releases",
    },
    "tools-8": {
      title: "Figma Basics",
      category: "Tools & Design",
      description: "Collaborative UI/UX design, prototyping, and asset export.",
      reward: "Unlocks rapid interface design and collaboration",
    },
    "tools-9": {
      title: "Docker & Containerization",
      category: "Tools & Design",
      description:
        "Container-based development, deployment, and orchestration.",
      reward: "Unlocks scalable, portable application environments",
    },
    "tools-10": {
      title: "Kubernetes Basics",
      category: "Tools & Design",
      description:
        "Container orchestration, deployments, and scaling services.",
      reward: "Unlocks scalable, automated service management",
    },
    "tools-11": {
      title: "Unit Testing",
      category: "Tools & Design",
      description:
        "Test frameworks and best practices (Jest, NUnit, PyTest) for reliable code.",
      reward: "Unlocks safer refactors and higher quality",
    },
    "tools-12": {
      title: "Selenium",
      category: "Tools & Design",
      description: "Cross-browser automation for end-to-end testing.",
      reward: "Unlocks UI regression and E2E coverage",
    },
    "tools-13": {
      title: "Google Cloud Platform (GCP)",
      category: "Tools & Design",
      description: "Compute, storage, networking, and managed services on GCP.",
      reward: "Unlocks scalable cloud deployments",
    },

    // AI/ML
    "ai-1": {
      title: "TensorFlow",
      category: "AI/ML",
      description: "Deep learning framework for building and training neural networks.",
      reward: "Unlocks model training and deployment",
    },
    "ai-2": {
      title: "Flax & JAX",
      category: "AI/ML",
      description: "High-performance ML with JAX and neural networks via Flax.",
      reward: "Unlocks fast, composable research workflows",
    },
    "ai-3": {
      title: "NumPy",
      category: "AI/ML",
      description: "Fundamental package for scientific computing in Python.",
      reward: "Unlocks vectorized numerical computing",
    },
    "ai-4": {
      title: "Ollama",
      category: "AI/ML",
      description: "Local LLM runner for fast prototyping and inference.",
      reward: "Unlocks local LLM experimentation",
    },
    "ai-5": {
      title: "LlamaIndex",
      category: "AI/ML",
      description: "Data framework for augmenting LLMs with private or external data.",
      reward: "Unlocks RAG pipelines and data connectors",
    },
  };

  Object.freeze(data);
  global.perkData = data;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;
  }
})(typeof window !== "undefined" ? window : globalThis);
