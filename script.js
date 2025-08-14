/**
 * Simple Portfolio JavaScript - Working Implementation
 */

document.addEventListener("DOMContentLoaded", function () {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("hide");
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }, 2000);

    // Navigation functionality
    const navTabs = document.querySelectorAll(".nav-tab");
    const sections = document.querySelectorAll(".game-section");

    navTabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionName = tab.dataset.section;

            // Remove active from all tabs and sections
            navTabs.forEach((t) => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            sections.forEach((s) => {
                s.classList.remove("active");
                s.setAttribute("hidden", "");
            });

            // Add active to clicked tab and corresponding section
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add("active");
                targetSection.removeAttribute("hidden");
            }
        });
    });

    // Project data
    const projects = {
        // Mind_Core (AI/ML LLM build)
        "ai-nexus": {
            title: "Mind_Core",
            image: "images/imgNexus.png",
            description:
                "Personal ML custom LLM build focused on efficient training, fine-tuning and local inference.",
            technologies: ["Python", "Ollama", "JAX", "Flax"],
            features: [
                "Custom tokenizer and training pipeline",
                "Local inference with quantization",
                "Experiment tracking and evaluation",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        // Agricultural Website
        "brain-simulation": {
            title: "Agricultural Website",
            image: "images/imgBrain.png",
            description:
                "Website for showcasing agricultural products and services with a modern, responsive UI.",
            technologies: ["React", "Firebase"],
            features: [
                "Product catalog and detail pages",
                "Realtime data with Firebase",
                "Responsive and accessible design",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        // Jewelry Shop
        "tech-hub": {
            title: "Jewelry Shop",
            image: "images/imgTech.png",
            description:
                "Online store for the advertisement of jewelry products with fast, SEO-friendly pages.",
            technologies: ["Next.js", "React", "Firebase"],
            features: [
                "SSR/SSG for performance",
                "Product galleries and filtering",
                "Secure auth and data with Firebase",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        // Custom Game Engine Injection
        "game-engine": {
            title: "Custom Game Engine Injection",
            image: "images/imgComp.png",
            description:
                "Lightweight C++ injection for adding mods/assets into an existing game engine.",
            technologies: ["C++", "Lua"],
            features: [
                "Runtime hooking and API exposure",
                "Lua scripting integration",
                "Asset pipeline for rapid iteration",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        // Automation Suite
        "automation-suite": {
            title: "Automation Suite",
            image: "images/imgbr.png",
            description:
                "Python tools for productivity automation across file, web, and reporting workflows.",
            technologies: [
                "Python",
                "Selenium",
                "BeautifulSoup",
                "Pandas",
                "Schedule",
                "SQLite",
            ],
            features: [
                "File organization and cleanup",
                "Scraping and data extraction",
                "Automated reports and notifications",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        // Gaming Portfolio Site
        "portfolio-site": {
            title: "Gaming Portfolio Site",
            image: "images/astro.png",
            description:
                "Gaming-themed portfolio focused on performance, accessibility, and UX.",
            technologies: ["HTML5", "CSS3", "JavaScript", "PWA"],
            features: [
                "Responsive layout",
                "PWA installability",
                "Smooth animations and transitions",
            ],
            demoLink: "https://xsolumx.github.io",
            githubLink: "https://github.com/xSolumx/xSolumx.github.io",
        },
        // Portfolio for an Architect
        "architect-portfolio": {
            title: "Portfolio for an Architect",
            image: "images/imgBrain.png",
            description:
                "A portfolio site to showcase architectural designs and projects.",
            technologies: ["Next.js", "React", "Firebase"],
            features: [
                "Project galleries and details",
                "Content management with Firebase",
                "Optimized images and SEO",
            ],
            githubLink: "https://github.com/xSolumx",
        },
    };

    // Modal functionality
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-project-image");
    const modalDescription = document.getElementById("modal-project-description");
    const modalTechTags = document.getElementById("modal-tech-tags");
    const modalFeaturesList = document.getElementById("modal-features-list");
    const modalDemoLink = document.getElementById("modal-demo-link");
    const modalGithubLink = document.getElementById("modal-github-link");
    const modalClose = document.querySelector(".modal-close");

    function openModal(projectKey) {
        const project = projects[projectKey];
        if (!project) {
            return;
        }

        if (
            !modal ||
            !modalTitle ||
            !modalImage ||
            !modalDescription ||
            !modalTechTags ||
            !modalFeaturesList
        ) {
            return;
        }

        // Populate modal content
        modalTitle.textContent = project.title;
        modalImage.src = project.image;
        modalImage.alt = `${project.title} Screenshot`;
        modalDescription.textContent = project.description;

        // Clear and populate tech tags
        modalTechTags.innerHTML = "";
        project.technologies.forEach((tech) => {
            const tag = document.createElement("span");
            tag.className = "tech-tag";
            tag.textContent = tech;
            modalTechTags.appendChild(tag);
        });

        // Clear and populate features
        modalFeaturesList.innerHTML = "";
        project.features.forEach((feature) => {
            const li = document.createElement("li");
            li.textContent = feature;
            modalFeaturesList.appendChild(li);
        });

        // Handle demo link
        if (project.demoLink && modalDemoLink) {
            modalDemoLink.href = project.demoLink;
            modalDemoLink.style.display = "inline-flex";
        } else if (modalDemoLink) {
            modalDemoLink.style.display = "none";
        }

        // Handle GitHub link
        if (project.githubLink && modalGithubLink) {
            modalGithubLink.href = project.githubLink;
            modalGithubLink.style.display = "inline-flex";
        } else if (modalGithubLink) {
            modalGithubLink.style.display = "none";
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Project card click handlers
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card, index) => {
        const projectKey = card.dataset.project;

        card.addEventListener("click", () => {
            openModal(projectKey);
        });

        // Add cursor pointer style
        card.style.cursor = "pointer";

        // Add keyboard support
        card.setAttribute("tabindex", "0");
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(projectKey);
            }
        });
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Perk interactions: data and radial graph
    // Perk interactions: data and radial graph
    const perkData = {
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
        'languages-6': {
            title: 'Bash Scripting',
            category: 'Core Languages',
            description: 'Shell scripting, automation, and system management.',
            reward: 'Unlocks advanced DevOps workflows'
        },
        'languages-7': {
            title: 'TypeScript Advanced',
            category: 'Core Languages',
            description: 'Advanced typing, generics, and large-scale application patterns.',
            reward: 'Unlocks robust and scalable JavaScript development'
        },
        'languages-8': {
            title: 'GraphQL APIs',
            category: 'Core Languages',
            description: 'Building and consuming GraphQL endpoints for efficient data querying.',
            reward: 'Unlocks modern API design and integration'
        },
        'languages-9': {
            title: 'Data Structures & Algorithms',
            category: 'Core Languages',
            description: 'Core DS&A concepts: arrays, hashes, trees, graphs, and complexity.',
            reward: 'Unlocks stronger problem solving and interview readiness'
        },
        'languages-10': {
            title: 'OOP & Design Patterns',
            category: 'Core Languages',
            description: 'SOLID, composition, and classic patterns (Factory, Strategy, Observer, etc.).',
            reward: 'Unlocks maintainable, extensible code architecture'
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
            description: "Designing and building RESTful endpoints with Express and middleware.",
            reward: "Unlocks robust backend services and integrations",
        },
        "web-12": {
            title: "State Management",
            category: "Web & Databases",
            description: "Managing complex client state (Redux/Zustand/Context) and side effects.",
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
        'tools-9': {
            title: 'Docker & Containerization',
            category: 'Tools & Design',
            description: 'Container-based development, deployment, and orchestration.',
            reward: 'Unlocks scalable, portable application environments'
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
            description: "Test frameworks and best practices (Jest, NUnit, PyTest) for reliable code.",
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

    // Graph elements
    const graphEl = document.getElementById("perk-graph");
    const nodesContainer = document.getElementById("perk-nodes");
    const linksSvg = document.getElementById("perk-links");
    const centerEl = document.getElementById("perk-center");
    // Tooltip element (created once)
    let tooltipEl = null;

    // SVG + graph state
    const SVG_NS = "http://www.w3.org/2000/svg";
    let nodePositions = {}; // key -> {x, y}
    let nodeMeta = {}; // key -> {unlocked, group, prof, prereqs: string[]}
    let svgLayers = { center: null, related: null, prereqs: null };

    const progressPanel = document.querySelector(".progress-panel");
    const detailsTitle = progressPanel?.querySelector(".progress-details h4");
    const detailsDesc = progressPanel?.querySelector(".progress-details p");
    const rewardSection = progressPanel?.querySelector(".reward-section");
    const progressStatus = progressPanel?.querySelector(".progress-status");
    const progressNumber = progressPanel?.querySelector(".progress-number");
    const progressBar = progressPanel?.querySelector(
        ".progress-svg .progress-bar"
    );

    function setRewardSection(text) {
        if (!rewardSection) return;
        // Ensure inner structure exists
        let label = rewardSection.querySelector(".reward-label");
        let value = rewardSection.querySelector(".reward-text");
        if (!label) {
            label = document.createElement("div");
            label.className = "reward-label";
            label.textContent = "REWARD";
            rewardSection.appendChild(label);
        }
        if (!value) {
            value = document.createElement("div");
            value.className = "reward-text";
            rewardSection.appendChild(value);
        }
        value.textContent = text;
    }

    function updateRing(proficiency) {
        if (!progressBar) return;
        const r = parseFloat(progressBar.getAttribute("r") || "50");
        const circumference = 2 * Math.PI * r;
        // Assume scale 0-5
        const max = 5;
        const ratio = Math.max(0, Math.min(proficiency / max, 1));
        const offset = circumference * (1 - ratio);
        progressBar.setAttribute("stroke-dasharray", `${circumference.toFixed(2)}`);
        progressBar.setAttribute("stroke-dashoffset", `${offset.toFixed(2)}`);
        if (progressNumber) {
            progressNumber.innerHTML = `${proficiency}<span class="progress-total">/${max}</span>`;
        }
    }

    // Helpers for inter-node links
    function ensureSvgLayers() {
        if (!linksSvg) return;
        linksSvg.innerHTML = "";
        svgLayers.center = document.createElementNS(SVG_NS, "g");
        svgLayers.center.setAttribute("id", "links-center");
        svgLayers.related = document.createElementNS(SVG_NS, "g");
        svgLayers.related.setAttribute("id", "links-related");
        svgLayers.prereqs = document.createElementNS(SVG_NS, "g");
        svgLayers.prereqs.setAttribute("id", "links-prereqs");
        linksSvg.appendChild(svgLayers.center);
        linksSvg.appendChild(svgLayers.related);
        linksSvg.appendChild(svgLayers.prereqs);
    }

    function clearPrereqLinks() {
        if (!svgLayers.prereqs) return;
        while (svgLayers.prereqs.firstChild) {
            svgLayers.prereqs.removeChild(svgLayers.prereqs.firstChild);
        }
    }

    function drawPrereqLinks(targetKey) {
        if (!svgLayers.prereqs) return;
        clearPrereqLinks();
        const meta = nodeMeta[targetKey];
        const targetPos = nodePositions[targetKey];
        if (!meta || !targetPos || !Array.isArray(meta.prereqs)) return;
        meta.prereqs.forEach((preKey) => {
            const prePos = nodePositions[preKey];
            const preMeta = nodeMeta[preKey];
            if (!prePos || !preMeta) return;
            const line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("x1", String(prePos.x));
            line.setAttribute("y1", String(prePos.y));
            line.setAttribute("x2", String(targetPos.x));
            line.setAttribute("y2", String(targetPos.y));
            // Style: dashed; muted if prereq locked
            const color = preMeta.unlocked ? "rgba(255,255,255,0.55)" : "rgba(160,160,160,0.5)";
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", "1.5");
            line.setAttribute("stroke-dasharray", "5 4");
            svgLayers.prereqs.appendChild(line);
        });
    }

    // Expanded graph configuration (arcs computed dynamically)
    const groups = [
        { id: "languages", label: "Core Languages" },
        { id: "web", label: "Web & Databases" },
        { id: "tools", label: "Tools & Design" },
        { id: "ai", label: "AI/ML" },
    ];

    const nodesDef = {
        languages: [
            {
                key: "languages-1",
                icon: "images/logo-python.png",
                prof: 3,
                unlocked: true,
                alt: "Python Fundamentals",
            },
            {
                key: "languages-2",
                icon: "images/logo-javascript.png",
                prof: 4,
                unlocked: true,
                alt: "JavaScript Fundamentals",
            },
            {
                key: "languages-3",
                icon: "images/logo-csharp.png",
                prof: 3,
                unlocked: true,
                alt: "C# OOP",
                prereqs: ["languages-2"],
            },
            {
                key: "languages-4",
                icon: "images/logo-java.png",
                prof: 2,
                unlocked: true,
                alt: "Java OOP",
            },
            {
                key: "languages-5",
                icon: "images/logo-Cplus.png",
                prof: 1,
                unlocked: true,
                alt: "C++ Systems",
            },
            {
                key: "languages-6",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "🐚", // Bash shell
                alt: "Bash Scripting",
                prereqs: ["languages-1"],
            },
            {
                key: "languages-7",
                icon: null,
                prof: 2,
                unlocked: true,
                emoji: "🌀", // Abstract/flow for TypeScript
                alt: "TypeScript Basics",
                prereqs: ["web-6"],
            },
            {
                key: "languages-8",
                icon: null,
                prof: 0,
                unlocked: false,
                emoji: "🔍", // Magnifying glass for querying (GraphQL)
                alt: "GraphQL APIs",
                prereqs: ["web-8"],
            },
            {
                key: "languages-9",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "📚",
                alt: "Data Structures & Algorithms",
                prereqs: ["languages-2"],
            },
            {
                key: "languages-10",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "📐",
                alt: "OOP & Design Patterns",
                prereqs: ["languages-3"],
            },
            

        ],
        web: [
            {
                key: "web-1",
                icon: "images/logo-htmlcss.png",
                prof: 5,
                unlocked: true,
                alt: "HTML & CSS",
            },
            {
                key: "web-2",
                icon: "images/logo-javascript.png",
                prof: 4,
                unlocked: true,
                alt: "JavaScript for Web",
                prereqs: ["web-1"],
            },
            {
                key: "web-3",
                icon: "images/react-1-logo-png-transparent.png",
                prof: 3,
                unlocked: true,
                alt: "React",
                prereqs: ["web-6"],
            },
            {
                key: "web-4",
                icon: null,
                prof: 1,
                unlocked: true,
                emoji: "🚀",
                alt: "PWA",
                prereqs: ["web-3"],
            },
            {
                key: "web-5",
                icon: "images/logo-sql.png",
                prof: 2,
                unlocked: true,
                alt: "SQL & Databases",
            },
            {
                key: "web-6",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🧩",
                alt: "TypeScript",
                prereqs: ["web-2"],
            },
            {
                key: "web-7",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "🟩",
                alt: "Node.js",
                prereqs: ["web-2"],
            },
            {
                key: "web-8",
                icon: "images/logo-graphql.png",
                prof: 0,
                unlocked: false,
                alt: "GraphQL Basics",
                prereqs: ["web-7"],
            },
            {
                key: "web-9",
                icon: "images/logo-nosql.png",
                prof: 1,
                unlocked: true,
                alt: "NoSQL Databases",
                prereqs: ["web-5"],
            },
            {
                key: "web-10",
                icon: null,
                prof: 2,
                unlocked: true,
                emoji: "🛡️",
                alt: "Web Security Fundamentals",
                prereqs: ["web-2"],
            },
            {
                key: "web-11",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "🧭",
                alt: "REST APIs (Express)",
                prereqs: ["web-7"],
            },
            {
                key: "web-12",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🧠",
                alt: "State Management",
                prereqs: ["web-3"],
            },
            {
                key: "web-13",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "🔥",
                alt: "Firebase",
                prereqs: ["web-2"],
            },
            {
                key: "web-14",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "⏭️",
                alt: "Next.js",
                prereqs: ["web-3", "web-6"],
            },
            {
                key: "web-15",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "☁️",
                alt: "Cloudflare Workers",
                prereqs: ["web-2"],
            },
            {
                key: "web-16",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🤖",
                alt: "Puppeteer",
                prereqs: ["web-7"],
            },
        ],
        tools: [
            {
                key: "tools-1",
                icon: "images/logo-github.png",
                prof: 3,
                unlocked: true,
                alt: "Git & GitHub",
            },
            {
                key: "tools-2",
                icon: null,
                prof: 2,
                unlocked: true,
                emoji: "🐧",
                alt: "Linux & Dev",
            },
            {
                key: "tools-3",
                icon: "images/logo-photoshop.png",
                prof: 5,
                unlocked: true,
                alt: "Photoshop",
            },
            {
                key: "tools-4",
                icon: "images/logo-blender.png",
                prof: 2,
                unlocked: true,
                alt: "Blender",
            },
            {
                key: "tools-5",
                icon: null,
                prof: 1,
                unlocked: true,
                emoji: "✅",
                alt: "QA & CI",
                prereqs: ["tools-1"],
            },
            {
                key: "tools-6",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🐳",
                alt: "Docker Basics",
                prereqs: ["tools-2"],
            },
            {
                key: "tools-7",
                icon: null,
                prof: 1,
                unlocked: true,
                emoji: "🔁",
                alt: "CI/CD Pipelines",
                prereqs: ["tools-5"],
            },
            {
                key: "tools-8",
                icon: "images/logo-figma.png",
                prof: 2,
                unlocked: true,
                alt: "Figma Basics",
            },
            {
                key: "tools-9",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "🐳", // Docker whale
                alt: "Docker & Containerization",
                prereqs: ["tools-6"],
            },
            {
                key: "tools-10",
                icon: "images/logo-kubernetes.png",
                prof: 0,
                unlocked: false,
                alt: "Kubernetes Basics",
                prereqs: ["tools-9"],
            },
            {
                key: "tools-11",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🧪",
                alt: "Unit Testing",
                prereqs: ["tools-5"],
            },
            {
                key: "tools-12",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🧭",
                alt: "Selenium",
                prereqs: ["languages-1", "tools-5"],
            },
            {
                key: "tools-13",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🛰️",
                alt: "Google Cloud Platform (GCP)",
                prereqs: ["tools-2", "tools-6"],
            },
        ],
        ai: [
            {
                key: "ai-3",
                icon: null,
                prof: 4,
                unlocked: true,
                emoji: "📊",
                alt: "NumPy",
                prereqs: ["languages-1"],
            },
            {
                key: "ai-1",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🧠",
                alt: "TensorFlow",
                prereqs: ["languages-1", "ai-3"],
            },
            {
                key: "ai-2",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "⚡",
                alt: "Flax & JAX",
                prereqs: ["languages-1", "ai-3"],
            },
            {
                key: "ai-4",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "🦙",
                alt: "Ollama",
                prereqs: ["languages-1"],
            },
            {
                key: "ai-5",
                icon: null,
                prof: 3,
                unlocked: true,
                emoji: "📚",
                alt: "LlamaIndex",
                prereqs: ["languages-1", "ai-1"],
            },
        ],
    };

    function degToRad(deg) {
        return (deg * Math.PI) / 180;
    }

    function buildNodes() {
        if (!graphEl || !nodesContainer || !linksSvg) return [];
        nodesContainer.innerHTML = "";
    ensureSvgLayers();
    nodePositions = {};
    nodeMeta = {};

        const rect = graphEl.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
    const minDim = Math.min(rect.width, rect.height);
    // Compute 5 rings (levels 1..5 from inner to outer). Keep padding so nodes don't clip.
    const nodeHalf = 32; // approx half of node size after CSS tweak
    const padding = 24 + nodeHalf; // visual margin + node radius
    const outerMax = Math.max(140, (minDim / 2) - padding);
    const innerMin = Math.max(90, minDim * 0.20);
    const ringCount = 5;
    const radii = Array.from({ length: ringCount }, (_, i) =>
        innerMin + ((outerMax - innerMin) * (i / (ringCount - 1)))
    );

        // Sync decorative rings to these radii (if present in DOM)
        const ringEls = graphEl.querySelectorAll('.graph-ring');
        ringEls.forEach((ringEl, idx) => {
            const r = radii[Math.min(idx, radii.length - 1)];
            const d = Math.round(r * 2);
            ringEl.style.width = `${d}px`;
            ringEl.style.height = `${d}px`;
        });

        // Map proficiency to ring: lower level closer to center (1->inner .. 5->outer). 0 treated as 1.
        const ringForProf = (p) => {
            const lvl = Math.min(5, Math.max(1, Math.round(Number(p) || 1)));
            return radii[lvl - 1];
        };

        const created = [];

        // Determine spacing based on total node count
        const totalNodes = groups.reduce((acc, g) => acc + (nodesDef[g.id]?.length || 0), 0);
        const spacing = (count) => {
            if (count <= 28) return { groupGap: 25, minSep: 2, marginFactor: 0.5 };
            if (count <= 40) return { groupGap: 18, minSep: 14, marginFactor: 0.1 };
            if (count <= 60) return { groupGap: 20, minSep: 12,  marginFactor: 0.1 };
            return { groupGap: 12, minSep: 6, marginFactor: 0.08 };
        };
        const { groupGap, minSep, marginFactor } = spacing(totalNodes);
        const available = 360 - groupGap * groups.length;
        let currentStart = -90; // start pointing up

    const groupColors = {
            languages: "rgba(101, 67, 33, 0.85)",
            web: "rgba(120, 75, 30, 0.8)",
            tools: "rgba(80, 60, 40, 0.85)",
            ai: "rgba(60, 90, 140, 0.85)",
        };

        groups.forEach((group) => {
            const list = nodesDef[group.id] || [];
            const nCount = list.length;
            if (nCount === 0) return;
            const span = available * (nCount / totalNodes);
            const margin = Math.min(12, span * marginFactor);
            // Compute evenly spaced angles within the span, honoring a minimum separation when possible
            let angles = [];
            if (nCount === 1) {
                angles = [currentStart + span / 2];
            } else {
                const effective = Math.max(0, span - 2 * margin);
                // desired step between nodes
                let step = minSep;
                const maxStepFit = effective / (nCount - 1);
                if (step > maxStepFit) step = maxStepFit; // can't exceed allocated span
                const used = step * (nCount - 1);
                const startA = currentStart + margin + (effective - used) / 2; // center within span
                for (let i = 0; i < nCount; i++) angles.push(startA + i * step);
            }
            list.forEach((n, idx) => {
                const angle = angles[idx];
                const rad = degToRad(angle);
                // Semantic ring based on proficiency
                const radius = ringForProf(Number(n.prof) || 0);
                const x = cx + radius * Math.cos(rad);
                const y = cy + radius * Math.sin(rad);

                const el = document.createElement("div");
                el.className = `perk-node ${n.unlocked ? "unlocked" : "locked"}`;
                el.dataset.perk = n.key;
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.setAttribute("tabindex", "0");
                el.setAttribute("role", "button");
                el.setAttribute("aria-label", perkData[n.key]?.title || n.alt || n.key);

                const icon = document.createElement("div");
                icon.className = "perk-icon";
                if (n.icon) {
                    const img = document.createElement("img");
                    img.src = n.icon;
                    img.alt = n.alt || "";
                    // Image fallback to emoji/placeholder on error
                    img.onerror = () => {
                        icon.innerHTML = "";
                        const span = document.createElement("span");
                        span.className = "icon-placeholder";
                        span.textContent = n.emoji || "★";
                        icon.appendChild(span);
                    };
                    icon.appendChild(img);
                } else {
                    const span = document.createElement("span");
                    span.className = "icon-placeholder";
                    span.textContent = n.emoji || "★";
                    icon.appendChild(span);
                }
                el.appendChild(icon);

                const badge = document.createElement("span");
                badge.className = "perk-number";
                badge.textContent = String(n.prof);
                el.appendChild(badge);

                nodesContainer.appendChild(el);

                // Track node positions and meta for inter-node links
                nodePositions[n.key] = { x, y };
                nodeMeta[n.key] = {
                    unlocked: !!n.unlocked,
                    group: group.id,
                    prof: Number(n.prof) || 0,
                    prereqs: Array.isArray(n.prereqs) ? n.prereqs : [],
                };

                // draw link
                const line = document.createElementNS(SVG_NS, "line");
                line.setAttribute("x1", String(cx));
                line.setAttribute("y1", String(cy));
                line.setAttribute("x2", String(x));
                line.setAttribute("y2", String(y));
                const linkColor = groupColors[group.id] || "rgba(101, 67, 33, 0.7)";
                line.setAttribute("stroke", n.unlocked ? linkColor : "rgba(139,139,139,0.6)");
                line.setAttribute("stroke-width", "1.5");
                if (svgLayers.center) svgLayers.center.appendChild(line);

                created.push(el);
            });
            currentStart += span + groupGap;
        });

        // Draw always-on related connections (adjacent nodes within each group + curated cross-group pairs)
        function drawRelatedLinks() {
            if (!svgLayers.related) return;
            // Clear related layer first
            while (svgLayers.related.firstChild) svgLayers.related.removeChild(svgLayers.related.firstChild);
            // Subtle adjacency within groups
            groups.forEach((group) => {
                const list = nodesDef[group.id] || [];
                for (let i = 0; i < list.length - 1; i++) {
                    const a = list[i];
                    const b = list[i + 1];
                    const pa = nodePositions[a.key];
                    const pb = nodePositions[b.key];
                    if (!pa || !pb) continue;
                    const l = document.createElementNS(SVG_NS, "line");
                    l.setAttribute("x1", String(pa.x));
                    l.setAttribute("y1", String(pa.y));
                    l.setAttribute("x2", String(pb.x));
                    l.setAttribute("y2", String(pb.y));
                    const base = group.id === "languages"
                        ? "rgba(101,67,33,0.25)"
                        : group.id === "web"
                        ? "rgba(120,75,30,0.22)"
                        : group.id === "tools"
                        ? "rgba(80,60,40,0.25)"
                        : "rgba(60,90,140,0.22)"; // ai
                    l.setAttribute("stroke", base);
                    l.setAttribute("stroke-width", "1");
                    svgLayers.related.appendChild(l);
                }
            });

            // Curated cross-group related pairs
            const relatedPairs = [
                ["web-1", "web-2"],       // HTML & CSS -> JS for Web
                ["web-2", "web-6"],       // JS -> TypeScript
                ["web-6", "web-3"],       // TypeScript -> React
                ["web-3", "web-12"],      // React -> State Management
                ["web-2", "web-7"],       // JS -> Node.js
                ["web-7", "web-11"],      // Node.js -> REST APIs
                ["web-7", "web-8"],       // Node.js -> GraphQL
                ["web-5", "web-9"],       // SQL -> NoSQL
                ["tools-9", "tools-10"],  // Docker -> Kubernetes
                ["languages-2", "languages-9"], // JS -> DS&A (problem solving)
                ["languages-3", "languages-10"], // C# -> Patterns
                ["languages-1", "ai-3"],  // Python -> NumPy
                ["ai-3", "ai-1"],        // NumPy -> TensorFlow
                ["ai-3", "ai-2"],        // NumPy -> Flax & JAX
                ["ai-1", "ai-5"],        // TensorFlow -> LlamaIndex
                ["web-2", "web-15"],      // JS -> Cloudflare Workers
                ["web-2", "web-13"],      // JS -> Firebase
                ["web-3", "web-14"],      // React -> Next.js
                ["web-7", "web-16"],      // Node.js -> Puppeteer
                ["tools-6", "tools-13"],  // Docker -> GCP (containers)
                ["tools-11", "tools-12"], // Testing -> Selenium
            ];
            relatedPairs.forEach(([aKey, bKey]) => {
                const pa = nodePositions[aKey];
                const pb = nodePositions[bKey];
                if (!pa || !pb) return;
                const l = document.createElementNS(SVG_NS, "line");
                l.setAttribute("x1", String(pa.x));
                l.setAttribute("y1", String(pa.y));
                l.setAttribute("x2", String(pb.x));
                l.setAttribute("y2", String(pb.y));
                l.setAttribute("stroke", "rgba(200,200,180,0.18)");
                l.setAttribute("stroke-width", "1");
                svgLayers.related.appendChild(l);
            });
        }

        drawRelatedLinks();

    // Draw group arc labels at mid-angles
        let labelsContainer = graphEl.querySelector('#perk-labels');
        if (!labelsContainer) {
            labelsContainer = document.createElement('div');
            labelsContainer.id = 'perk-labels';
            labelsContainer.style.position = 'absolute';
            labelsContainer.style.left = '0';
            labelsContainer.style.top = '0';
            labelsContainer.style.width = '100%';
            labelsContainer.style.height = '100%';
            labelsContainer.style.pointerEvents = 'none';
            graphEl.appendChild(labelsContainer);
        }
        labelsContainer.innerHTML = '';

    // recompute spans similar to placement for consistent label midpoints
        let startAngle = -90;
        const totalCount = groups.reduce((acc, g) => acc + ((nodesDef[g.id] || []).length), 0);
    const gap = groupGap;
        const avail = 360 - gap * groups.length;
        groups.forEach((g) => {
            const count = (nodesDef[g.id] || []).length;
            if (count === 0) return;
            const span = avail * (count / totalCount);
            const mid = startAngle + span / 2;
            const rad = (mid * Math.PI) / 180;
            const outerR = radii[radii.length - 1];
            const labelR = Math.max(outerR + 24, (minDim * 0.5) - 10);
            const lx = cx + labelR * Math.cos(rad);
            const ly = cy + labelR * Math.sin(rad);
            const label = document.createElement('div');
            label.className = 'group-label';
            label.textContent = g.label;
            label.style.position = 'absolute';
            label.style.left = `${lx}px`;
            label.style.top = `${ly}px`;
            label.style.transform = 'translate(-50%, -50%)';
            label.style.fontSize = '12px';
            label.style.letterSpacing = '0.08em';
            label.style.opacity = '0.8';
            label.style.color = '#ddd';
            labelsContainer.appendChild(label);
            startAngle += span + gap;
        });

        return created;
    }

    function getProficiencyFromNode(nodeEl) {
        const n = nodeEl.querySelector(".perk-number");
        return n ? parseInt(n.textContent || "0", 10) || 0 : 0;
    }

    function clearSelection() {
        nodesContainer
            .querySelectorAll(".perk-node.selected")
            .forEach((n) => n.classList.remove("selected"));
    }

    function showPerk(perkKey, nodeEl) {
        const data = perkData[perkKey];
        const proficiency = getProficiencyFromNode(nodeEl);
        if (!data || !progressPanel) return;
        if (detailsTitle) detailsTitle.textContent = data.title;
        if (detailsDesc) detailsDesc.textContent = data.description;
        setRewardSection(data.reward);
        if (progressStatus) {
            const next = Math.min(5, proficiency + 1);
            progressStatus.innerHTML = `<span class="current-progress">Current: ${proficiency}</span><span class="next-progress">Next: ${next}</span>`;
        }
        updateRing(proficiency);
    }

    function wireNodes(nodeEls) {
        nodeEls.forEach((el) => {
            // Tooltip interactions
            el.addEventListener("mouseenter", () => {
                const key = el.getAttribute("data-perk") || "";
                drawPrereqLinks(key);
            });
            el.addEventListener("mousemove", (ev) => {
                const key = el.getAttribute("data-perk") || "";
                const data = perkData[key];
                if (!data) return;
                if (!tooltipEl) {
                    tooltipEl = document.createElement("div");
                    tooltipEl.className = "perk-tooltip";
                    document.body.appendChild(tooltipEl);
                }
                tooltipEl.innerHTML = `<div class="tt-title">${data.title}</div><div class="tt-meta">${data.category}</div><div class="tt-desc">${data.description}</div>`;
                tooltipEl.style.left = `${ev.pageX + 12}px`;
                tooltipEl.style.top = `${ev.pageY + 12}px`;
                tooltipEl.style.display = "block";
            });
            el.addEventListener("mouseleave", () => {
                if (tooltipEl) tooltipEl.style.display = "none";
                clearPrereqLinks();
            });
            el.addEventListener("click", () => {
                clearSelection();
                el.classList.add("selected");
                const key = el.getAttribute("data-perk") || "";
                showPerk(key, el);
                drawPrereqLinks(key);
            });
            el.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    clearSelection();
                    el.classList.add("selected");
                    const key = el.getAttribute("data-perk") || "";
                    showPerk(key, el);
                    drawPrereqLinks(key);
                }
            });
        });
    }

    function redraw() {
        // rebuild to keep it simple and robust
        // preserve current selection
        const prevSelectedKey = nodesContainer.querySelector('.perk-node.selected')?.getAttribute('data-perk') || null;
        const els = buildNodes();
        wireNodes(els);
        // select first unlocked
        let target = null;
        if (prevSelectedKey) {
            target = els.find(e => e.getAttribute('data-perk') === prevSelectedKey) || null;
        }
        if (!target) {
            target = els.find((e) => e.classList.contains("unlocked")) || els[0];
        }
        if (target) {
            clearSelection();
            target.classList.add("selected");
            const key = target.getAttribute("data-perk") || "";
            showPerk(key, target);
            drawPrereqLinks(key);
        }
    }

    // Initial draw and resize handling
    if (graphEl) {
        redraw();
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => redraw(), 150);
        });
        // Center node resets view to first unlocked
        if (centerEl) {
            centerEl.addEventListener('click', () => {
                clearSelection();
                // force reselect default
                const els = buildNodes();
                wireNodes(els);
                const first = els.find((e) => e.classList.contains('unlocked')) || els[0];
                if (first) {
                    first.classList.add('selected');
                    const key = first.getAttribute('data-perk') || '';
                    showPerk(key, first);
                    drawPrereqLinks(key);
                }
            });
        }
    }
});
