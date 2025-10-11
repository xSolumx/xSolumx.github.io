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
            "Write clean Python scripts, manage virtual environments, and leverage the standard library for file, network, and data-heavy tasks. Practice automation patterns that glue together AI tooling, command-line utilities, and quick backend prototypes.",
          reward:
            "Unlocks the ability to spin up data pipelines, automation jobs, and ML experiments with minimal friction",
          icon: "images/logo-python.png",
          prof: 3,
          unlocked: true,
          tags: ["python", "automation", "scripting", "ai"],
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
            "Master ES6+ syntax, closures, prototypes, and modules while understanding how the event loop and async patterns shape application behavior. Structure maintainable browser features and Node-powered tooling with modern developer ergonomics.",
          reward:
            "Unlocks confident delivery of rich UI behaviors, API integrations, and cross-environment scripts",
          icon: "images/logo-javascript.png",
          prof: 4,
          unlocked: true,
          tags: ["javascript", "web", "runtime"],
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
            "Deepen object-oriented design with interfaces, generics, dependency injection, and async/await across the .NET ecosystem. Work with the CLR, solution organization, and production-ready patterns for desktop, web, and tooling projects.",
          reward:
            "Unlocks design of maintainable enterprise services, game tooling, and automation within the Microsoft stack",
          icon: "images/logo-csharp.png",
          prof: 3,
          unlocked: true,
          tags: ["csharp", "oop", ".net"],
          focusAreas: ["Backend", "Enterprise"],
          prereqs: [],
          related: ["languages-10"],
        },
        {
          id: "languages-4",
          title: "Java OOP",
          summary: "Strongly-typed OOP, JVM ecosystem, and enterprise patterns.",
          description:
            "Apply Java's type system, collections, streams, and concurrency utilities to build reliable services on the JVM. Utilize Maven/Gradle, testing frameworks, and performance profiling to keep enterprise applications resilient.",
          reward:
            "Unlocks building cross-platform backend APIs, Android services, and scalable enterprise integrations",
          icon: "images/logo-java.png",
          prof: 3,
          unlocked: true,
          tags: ["java", "oop", "jvm"],
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
            "Explore manual memory management, RAII, templates, and the STL while profiling and optimizing performance-critical code. Practice build tooling, debugging, and interoperability required for engines, embedded systems, and real-time apps.",
          reward:
            "Unlocks authoring native modules, game-engine extensions, and high-performance systems components",
          icon: "images/logo-Cplus.png",
          prof: 1,
          unlocked: true,
          tags: ["c++", "systems", "low-level"],
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
            "Implement arrays, trees, graphs, and hash-based structures while applying algorithmic paradigms such as divide-and-conquer, dynamic programming, and greedy approaches. Analyze time and space complexity to decide the right strategy under real constraints.",
          reward:
            "Unlocks designing efficient solutions, excelling in technical interviews, and raising performance awareness across projects",
          emoji: "📚",
          prof: 4,
          unlocked: true,
          tags: ["algorithms", "dsa", "problem-solving"],
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
            "Apply SOLID principles, composition over inheritance, and patterns like Factory, Strategy, Observer, and CQRS to real-world systems. Focus on refactoring, dependency management, and designing extensible modules that evolve gracefully.",
          reward:
            "Unlocks architecting modular codebases so teams can scale features without regressions",
          icon: "images/icons8-object-oriented-programming-64.png",
          prof: 5,
          unlocked: true,
          tags: ["oop", "patterns", "architecture"],
          focusAreas: ["Architecture"],
          prereqs: ["languages-3" , "languages-9"],
          related: ["automation-1,", "languages-2", "languages-3", "languages-4"],
        },
        {
          id: "languages-11",
          title: "Rust Systems Programming",
          summary: "Ownership, borrowing, and zero-cost abstractions for high safety.",
          description:
            "Dive into ownership, borrowing, lifetimes, and zero-cost abstractions to craft memory-safe systems in Rust. Leverage Cargo, async runtimes, and interoperability patterns for services, CLIs, and embedded tooling.",
          reward:
            "Unlocks delivering high-reliability services, embedded tooling, and WebAssembly components with confidence",
          emoji: "🦀",
          prof: 0,
          unlocked: false,
          tags: ["rust", "systems", "safety"],
          focusAreas: ["Safety", "Performance"],
          prereqs: ["languages-5"],
          related: ["devops-4"],
        },
        {
          id: "languages-12",
          title: "Go Concurrency",
          summary: "Goroutines, channels, and structured concurrency for services.",
          description:
            "Structure concurrent services with goroutines, channels, and context cancellation while modeling clean interfaces and packages. Cover testing, observability, and deployment practices that make Go shine in cloud-native workloads.",
          reward:
            "Unlocks building low-latency APIs, streaming workers, and distributed systems that scale horizontally",
          emoji: "🐹",
          prof: 0,
          unlocked: false,
          tags: ["golang", "concurrency", "cloud"],
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
            "Craft semantic HTML landmarks, responsive layouts with Flexbox/Grid, and modern CSS capabilities like custom properties and clamp(). Apply accessibility heuristics and cross-browser troubleshooting to ship resilient interfaces.",
          reward:
            "Unlocks shipping accessible UI foundations, prototypes, and marketing pages quickly",
          icon: "images/logo-htmlcss.png",
          prof: 5,
          unlocked: true,
          tags: ["html", "css", "accessibility"],
          focusAreas: ["UI", "Accessibility"],
          prereqs: [],
          related: ["web-2", "web-3", "web-6", "web-5", "web-7"],
        },
        {
          id: "web-2",
          title: "JavaScript for Web",
          summary: "DOM APIs, fetch, routing patterns, and client-side performance.",
          description:
            "Use DOM APIs, event delegation, fetch, and routing patterns to deliver dynamic web experiences. Tune performance, manage state, and integrate third-party services while staying mindful of progressive enhancement.",
          reward:
            "Unlocks interactive, data-driven UIs, API-driven dashboards, and progressive enhancements",
          icon: "images/logo-javascript.png",
          prof: 4,
          unlocked: true,
          tags: ["javascript", "frontend", "dom"],
          focusAreas: ["Interactivity"],
          prereqs: ["web-1"],
          related: ["web-6", "backend-1"],
        },
        {
          id: "web-6",
          title: "TypeScript Basics",
          summary: "Types, interfaces, generics, and compiling to JavaScript.",
          description:
            "Introduce TypeScript's type system, interfaces, generics, enums, and compiler configuration to harden JavaScript projects. Practice incremental adoption, type guards, and library interop for smoother developer workflows.",
          reward:
            "Unlocks safer refactors, richer tooling, and confidence shipping complex JavaScript code",
          icon: "images/icons8-typescript-480.png",
          prof: 3,
          unlocked: true,
          tags: ["typescript", "frontend"],
          focusAreas: ["Tooling"],
          prereqs: ["web-1", "web-2"],
          related: ["web-3", "frontend-4"],
        },
        {
          id: "web-5",
          title: "TypeScript Advanced",
          summary:
            "Advanced typing, generics, and large-scale application patterns.",
          description:
            "Develop mastery with mapped and conditional types, utility helpers, type-level programming, and monorepo patterns. Shape domain models, API clients, and large application architectures that stay maintainable over time.",
          reward:
            "Unlocks creation of large-scale, type-safe architectures and reusable design systems",
          icon: "images/icons8-typescript-480.png",
          prof: 2,
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
            "Design component-driven UIs with hooks, composition, context, and Suspense-driven data fetching. Cover accessibility, testing strategies, and performance profiling to keep production SPAs fast and maintainable.",
          reward:
            "Unlocks the ability to deliver maintainable React apps, reusable component libraries, and cross-platform experiences",
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
            "Evaluate Redux, Zustand, Context, and query libraries to orchestrate complex client state, caching, and asynchronous effects. Normalize data, craft selectors, and debug flows that keep teams aligned across surfaces.",
          reward:
            "Unlocks predictable data flows, offline support, and scalable front-end architectures",
          emoji: "🗃️",
          prof: 4,
          unlocked: true,
          tags: ["state", "frontend"],
          focusAreas: ["Architecture"],
          prereqs: ["web-3", "web-6"],
          related: ["web-14", "web-9", "web-3"],
        },
        {
          id: "web-4",
          title: "Progressive Web Apps (PWA)",
          summary: "Service workers, offline caching, installable experiences.",
          description:
            "Implement service workers, caching strategies, background sync, and push notifications to create resilient web experiences. Design app shell architectures, update strategies, and install prompts that feel native.",
          reward:
            "Unlocks shipping offline-first, installable web apps with native-like polish",
          emoji: "🚀",
          prof: 3,
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
            "Leverage utility classes, responsive variants, and design tokens to build consistent interfaces at speed. Customize themes, compose reusable components, and integrate Tailwind with design systems.",
          reward:
            "Unlocks accelerated styling workflows with built-in consistency and minimal CSS debt",
          icon: "images/icons8-tailwind-css-480.png",
          prof: 3,
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
            "Configure Vite/Webpack for bundling, hot module replacement, code splitting, and asset optimization across environments. Manage aliases, environment variables, and diagnostics to keep builds fast and reliable.",
          reward:
            "Unlocks fast developer feedback loops and lean production bundles",
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
            "Explore Single File Components, the Composition API, and Vue's reactivity system to craft maintainable applications. Utilize routing, state patterns, and tooling to deliver production-ready Vue experiences.",
          reward:
            "Unlocks delivering SPAs with Vue's approachable yet scalable architecture",
          emoji: "💚",
          prof: 0,
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
          description:
            "Build cross-platform mobile apps using React primitives, navigation stacks, and native modules while tailoring styling per platform. Debug, profile, and ship to app stores with confidence in performance and accessibility.",
          reward:
            "Unlocks shipping production mobile apps backed by a shared React codebase",
          icon: "images/icons8-react-native-500.png",
          prof: 3,
          unlocked: true,
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
            "Study platform heuristics, human interface guidelines, gestures, and accessibility expectations on iOS and Android. Prototype flows, animations, and micro-interactions that make mobile products feel intuitive and native.",
          reward:
            "Unlocks designing delightful, intuitive mobile journeys that complement mobile tech stacks",
          emoji: "📲",
          prof: 5,
          unlocked: true,
          tags: ["mobile", "ux"],
          focusAreas: ["Mobile", "Design"],
          prereqs: ["web-1", "web-10"],
          related: ["design-3"],
        },
        {
          id: "web-14",
          title: "Next.js",
          summary: "React framework for SSR/SSG, routing, and performance.",
          description:
            "Apply file-based routing, data fetching modes, server actions, and image/font optimizations to build performant React apps. Master incremental static regeneration, middleware, and deployment best practices.",
          reward:
            "Unlocks production-ready full-stack React apps with SEO, performance, and DX optimized",
          icon: "images/icons8-next.js-480.png",
          prof: 3,
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
            "Architect streaming SSR pipelines, middleware, and edge caching strategies that serve content close to users. Monitor cold starts, personalize per locale, and integrate with observability to keep latency low worldwide.",
          reward:
            "Unlocks blazingly fast global delivery and personalized experiences at the network edge",
          emoji: "🌍",
          prof: 2,
          unlocked: true,
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
          description:
            "Cover core Node runtime concepts, async I/O, module systems, and building HTTP servers with Express and native APIs. Work with the filesystem, streams, npm scripts, and debugging techniques for asynchronous code.",
          reward:
            "Unlocks the ability to deliver production-ready services, CLIs, and tooling on the Node runtime",
          icon: "images/nodejs.png",
          prof: 4,
          unlocked: true,
          tags: ["node", "backend", "nodejs"],
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
            "Design RESTful resources, middleware pipelines, validation layers, and error handling with Express. Implement pagination, versioning, logging, and documentation so clients can depend on your APIs.",
          reward:
            "Unlocks building dependable API surfaces that integrate with frontends, mobile apps, and partners",
          emoji: "🧭",
          prof: 4,
          unlocked: true,
          tags: ["rest", "backend", "express"],
          focusAreas: ["APIs"],
          prereqs: ["backend-1"],
          related: ["backend-1", "backend-6"],
        },
        {
          id: "backend-3",
          title: "GraphQL Basics",
          summary: "Schema design, resolvers, and API querying with GraphQL.",
          description:
            "Introduce GraphQL schemas, types, queries, mutations, and resolver design with tooling like Apollo. Compare against REST, address performance considerations, and evolve schemas safely as products grow.",
          reward:
            "Unlocks the ability to prototype flexible, client-driven APIs",
          icon: "images/icons8-graphql-480.png",
          prof: 1,
          unlocked: true,
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
            "Architect production GraphQL servers with schema stitching, federation, caching, and authorization patterns. Instrument resolvers, batch requests with DataLoader, and integrate clients for reliable GraphQL ecosystems.",
          reward:
            "Unlocks shipping scalable, observable GraphQL platforms across teams",
          icon: "images/icons8-graphql-480.png",
          prof: 1,
          unlocked: true,
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
            "Identify vulnerabilities such as XSS, CSRF, SQL injection, and clickjacking while implementing practical mitigations. Embrace HTTPS, security headers, dependency scanning, and secure coding habits.",
          reward:
            "Unlocks building products with defense-in-depth and fewer critical vulnerabilities",
          emoji: "🛡️",
          prof: 3,
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
            "Implement identity workflows using JWTs, OAuth 2.0, sessions, and external identity providers. Cover RBAC/ABAC, password hygiene, MFA, and secure session management from signup through logout.",
          reward:
            "Unlocks confident delivery of secure login flows, partner integrations, and enterprise access controls",
          emoji: "🔐",
          prof: 4,
          unlocked: true,
          tags: ["auth", "security", "identity"],
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
            "Establish API hardening strategies including rate limiting, token lifecycles, schema validation, and threat modeling. Emphasize least privilege, secrets management, and monitoring to detect abuse early.",
          reward:
            "Unlocks production API resilience against abuse, data leaks, and compliance issues",
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
            "Explore RabbitMQ, Kafka, and Redis streams to decouple services with pub/sub and work queues. Design for exactly-once semantics, dead-letter handling, and resilient event-driven microservices.",
          reward:
            "Unlocks the ability to scale workloads, smooth spikes, and design reactive systems",
          emoji: "📮",
          prof: 0,
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
            "Define service boundaries with domain-driven design, communication patterns, API gateways, and data consistency strategies. Address deployment, resilience patterns, and organizational considerations for distributed teams.",
          reward:
            "Unlocks designing distributed systems that evolve independently while staying operable",
          emoji: "🧩",
          prof: 1,
          unlocked: true,
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
          description:
            "Design relational schemas, enforce normalization, and optimize queries with indexes across engines like Postgres or MySQL. Understand ACID transactions, stored procedures, and reporting fundamentals for critical systems.",
          reward:
            "Unlocks reliable data persistence, analytics, and integration with business systems",
          icon: "images/logo-sql.png",
          prof: 3,
          unlocked: true,
          tags: ["sql", "database", "relational"],
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
            "Evaluate document, key-value, wide-column, and graph databases with modeling techniques tailored to unstructured data. Balance consistency trade-offs, sharding, and operational tooling for scalable workloads.",
          reward:
            "Unlocks flexible data storage that grows with varied workloads and real-time apps",
          emoji: "�️",
          prof: 4,
          unlocked: true,
          tags: ["nosql", "database", "scalability"],
          focusAreas: ["Data"],
          prereqs: ["backend-5"],
          related: ["backend-5", "backend-7"],
        },
        {
          id: "backend-7",
          title: "Firebase",
          summary: "Realtime database, auth, storage, and hosting for web apps.",
          description:
            "Leverage Firebase's realtime database, Firestore, authentication, storage, and hosting to prototype full-stack apps quickly. Configure security rules, Cloud Functions, and deployment automation for production readiness.",
          reward:
            "Unlocks shipping real-time experiences and MVPs without managing servers",
          icon: "images/firebase.png",
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
            "Design ETL/ELT workflows with Airflow or similar orchestrators to ingest, validate, transform, and load data reliably. Manage scheduling, monitoring, schema evolution, and lineage to keep stakeholders confident in their data.",
          reward:
            "Unlocks trustworthy data flows powering analytics dashboards, ML training, and compliance reporting",
          emoji: "🔄",
          prof: 2,
          unlocked: true,
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
            "Implement embedding storage, similarity search, and hybrid retrieval strategies with systems such as Pinecone or Weaviate. Tune indexing, filtering, and scaling considerations to power retrieval-augmented generation.",
          reward:
            "Unlocks semantic search, personalized assistants, and context-aware AI experiences",
          emoji: "🎯",
          prof: 2,
          unlocked: true,
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
            "Practice branching strategies, pull requests, code review etiquette, and conflict resolution. Explore Git internals, hooks, and GitHub features that keep collaboration smooth across teams.",
          reward:
            "Unlocks reliable version control, project history stewardship, and effective team collaboration",
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
          description:
            "Build fluency with shell navigation, package managers, processes, and environment configuration on Linux systems. Tune dotfiles, editors, containers, and troubleshooting techniques for consistent development setups.",
          reward:
            "Unlocks efficient, repeatable development workflows across machines and servers",
          icon: "images/icons8-linux-96.png",
          prof: 4,
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
          description:
            "Write portable shell scripts using pipes, conditionals, loops, and tools like sed and awk. Automate environment provisioning, CI steps, and operational runbooks with robust error handling and logging.",
          reward:
            "Unlocks automation of repetitive tasks, server orchestration, and glue code for DevOps pipelines",
          icon: "images/icons8-bash-96.png",
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
          description:
            "Automate builds, tests, and deployments using platforms like GitHub Actions, GitLab CI, or Jenkins. Design pipelines with artifact management, gating strategies, and rollback safety nets for resilient releases.",
          reward:
            "Unlocks faster shipping with confidence through repeatable, auditable delivery pipelines",
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
            "Create Dockerfiles, manage images, networks, and volumes to containerize applications and dependencies. Leverage multi-stage builds, layer caching, and local workflow parity to ship confidently.",
          reward:
            "Unlocks reproducible environments and simplified deployments across machines and clouds",
          icon: "images/imgComp.png",
          prof: 2,
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
            "Introduce cluster architecture, pods, deployments, services, and scaling workloads with Kubernetes. Work with manifests, Helm, and operational concerns like health checks, rolling updates, and secrets management.",
          reward:
            "Unlocks orchestrating containerized services with resilience, autoscaling, and self-healing",
          emoji: "☸️",
          prof: 1,
          unlocked: true,
          tags: ["kubernetes", "ops"],
          focusAreas: ["DevOps"],
          prereqs: ["devops-4", "devops-3"],
          related: ["devops-8", "devops-9"],
        },
        {
          id: "devops-6",
          title: "Cloudflare Workers",
          summary: "Edge compute for serverless functions and web APIs.",
          description:
            "Deploy serverless functions at the edge with Cloudflare Workers, KV, and Durable Objects. Craft caching strategies, routing, and secure integrations with downstream APIs for responsive applications.",
          reward:
            "Unlocks low-latency edge experiences, request customization, and serverless microservices",
          emoji: "☁️",
          prof: 2,
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
            "Design event-driven APIs and background jobs on platforms like Firebase, AWS Lambda, and Cloud Functions. Address cold starts, observability, and integrations with queues or schedulers to keep systems responsive.",
          reward:
            "Unlocks elastic scaling without managing servers, enabling quick feature delivery",
          emoji: "⚙️",
          prof: 3,
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
            "Navigate GCP compute, storage, networking, IAM, and managed services to deploy secure workloads. Implement billing controls, infrastructure design, and monitoring practices across projects.",
          reward:
            "Unlocks architecting scalable cloud environments while leveraging managed services efficiently",
          emoji: "🛰️",
          prof: 3,
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
            "Author infrastructure-as-code modules with Terraform to provision, version, and audit cloud resources. Manage state, enforce policies, and automate plan/apply workflows for safe, repeatable deployments.",
          reward:
            "Unlocks repeatable, reviewable infrastructure automation across environments",
          emoji: "🏗️",
          prof: 0,
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
            "Build dashboards, metrics, logs, and traces using Grafana, Prometheus, and OpenTelemetry to watch production health. Design alerting strategies, SLOs, and incident workflows grounded in actionable signals.",
          reward:
            "Unlocks proactive detection of issues and informed decision-making during on-call events",
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
            "Establish testing strategies, branching policies, and continuous integration checks that guard every release. Tackle flaky tests, environment parity, and reporting so teams maintain quality at speed.",
          reward:
            "Unlocks automation that enforces quality gates before code reaches users",
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
            "Implement unit tests with frameworks like Jest, NUnit, and PyTest using mocks, spies, and coverage analysis. Focus on fast feedback, naming, and maintainability to keep suites trustworthy.",
          reward:
            "Unlocks fearless refactoring and higher confidence in code behavior",
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
          description:
            "Use headless Chrome automation for end-to-end testing, scraping, and synthetic monitoring. Master selectors, waits, screenshots, and CI integration to keep web experiences stable.",
          reward:
            "Unlocks repeatable browser automation for QA, data collection, and regression catching",
          emoji: "🤖",
          prof: 3,
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
          description:
            "Build cross-browser test suites targeting Chrome, Firefox, Safari, and Edge with Selenium WebDriver. Scale via Selenium Grid, craft resilient selectors, and orchestrate suites through CI/CD.",
          reward:
            "Unlocks comprehensive UI regression coverage across browsers and devices",
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
            "Design tests that exercise APIs, databases, and message queues together using contract and system-level checks. Manage fixtures, test data, and boundary validation to ensure workflows behave in concert.",
          reward:
            "Unlocks confidence that complex workflows function end-to-end before release",
          emoji: "🔗",
          prof: 1,
          unlocked: true,
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
            "Apply load, stress, and soak testing with tools like k6, JMeter, and Lighthouse to measure latency, throughput, and stability. Surface bottlenecks, guide capacity planning, and maintain responsive user experiences.",
          reward:
            "Unlocks insight to tune systems for scale while keeping performance promises",
          emoji: "⚡",
          prof: 1,
          unlocked: true,
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
            "Cover non-destructive editing, masking, typography, and exporting optimized assets for web or apps. Manage color, automate actions, and organize files for collaboration with developers and designers.",
          reward:
            "Unlocks creation of polished UI assets, marketing visuals, and production-ready imagery",
          icon: "images/logo-photoshop.png",
          prof: 5,
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
          description:
            "Introduce modeling, sculpting, materials, lighting, and animation fundamentals for 3D asset creation. Learn to export to game engines, render efficiently, and streamline creative workflows.",
          reward:
            "Unlocks delivering bespoke 3D elements for games, motion graphics, and immersive visuals",
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
            "Teach component libraries, auto layout, prototyping, and design systems within Figma's collaborative canvas. Facilitate feedback loops, accessibility considerations, and developer handoff with precision.",
          reward:
            "Unlocks rapid UX iteration, stakeholder alignment, and precise developer handoff",
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
          description:
            "Manipulate multi-dimensional arrays, broadcasting, vectorized operations, and numerical routines using NumPy. Understand memory layout, performance considerations, and interoperability with SciPy and Pandas.",
          reward:
            "Unlocks fast numerical computation and a foundation for scientific Python ecosystems",
          icon: "images/icons8-numpy-480.png",
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
            "Build neural networks using TensorFlow's eager and graph execution, crafting data pipelines, training loops, and deployment targets like TFLite or TF Serving. Monitor metrics, run distributed training, and track experiments end-to-end.",
          reward:
            "Unlocks end-to-end deep learning projects from research to production",
          icon: "images/imgBrain.png",
          prof: 2,
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
            "Harness JAX's composable transformations (jit, vmap, pmap) and Flax's module system to create high-performance ML experiments. Focus on reproducibility, mixed precision, and scaling across accelerators with minimal boilerplate.",
          reward:
            "Unlocks cutting-edge research workflows with speed and composability",
          emoji: "⚡",
          prof: 2,
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
          description:
            "Run large language models locally with Ollama, managing model downloads, prompt templates, and integration with downstream tools. Explore fine-tuning, quantization, and orchestration for rapid, private prototyping.",
          reward:
            "Unlocks offline experimentation, secure demos, and fast iteration with LLMs",
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
            "Connect language models to structured and unstructured data sources using LlamaIndex indexes, retrievers, and query engines. Evaluate quality, add observability, and deploy retrieval-augmented generation pipelines.",
          reward:
            "Unlocks building data-aware assistants, copilots, and knowledge retrieval workflows",
          emoji: "📚",
          prof: 4,
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
            "Package models, manage experiment tracking, automate deployment, and monitor drift with modern MLOps platforms. Implement CI/CD for ML, feature stores, and feedback loops that keep models accurate in production.",
          reward:
            "Unlocks dependable ML services that stay accurate after launch",
          emoji: "🧬",
          prof: 3,
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
            "Perform data cleaning, transformation, aggregation, and reshaping with Pandas DataFrames. Tackle time-series, joins, vectorized operations, and exporting insights for dashboards or downstream ML tasks.",
          reward:
            "Unlocks efficient exploration and preparation of datasets for analysis and modeling",
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
            "Create compelling charts with Matplotlib, Seaborn, and Plotly while applying storytelling, annotations, and interactivity. Use design principles to surface trends, outliers, and comparisons that drive decisions.",
          reward:
            "Unlocks communicating insights to stakeholders with clarity and visual impact",
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
            "Apply preprocessing pipelines, feature engineering, and classical algorithms like regression, classification, and clustering with scikit-learn. Evaluate with cross-validation, tune hyperparameters, and plan deployments.",
          reward:
            "Unlocks rapid prototyping of predictive models and production-ready baselines",
          emoji: "🔬",
          prof: 2,
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
            "Construct neural networks with PyTorch's dynamic computation graphs, autograd, and modular APIs. Customize training loops, experiment with distributed training, and export models for inference.",
          reward:
            "Unlocks research flexibility, rapid experimentation, and deployment-ready deep learning solutions",
          icon: "images/icons8-pytorch-96.png",
          prof: 3,
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
            "Design prompt pipelines, evaluation harnesses, guardrails, and observability for LLM-powered products. Address safety reviews, automated regression testing, and feedback loops to iterate on prompts and models.",
          reward:
            "Unlocks trustworthy, measurable LLM experiences ready for real users",
          emoji: "🛡️",
          prof: 0,
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
