/**
 * Projects Module
 * Handles project data and card interactions
 */

export const projects = {
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
    "Quicker-Swazi": {
        title: "Agricultural Website",
        image: "images/website_QS_Screenshot.png",
        description:
            "Website for showcasing agricultural products and services with a modern, responsive UI.",
        technologies: ["React", "Firebase"],
        features: [
            "Product catalog and detail pages",
            "Realtime data with Firebase",
            "Responsive and accessible design",
        ],
        demoLink: "https://swazitrac.com",
    },
    // Jewelry Shop
    "Heron-Copper": {
        title: "Jewelry Shop",
        image: "images/website_HC_Screenshot.png",
        description:
            "Online store for the advertisement of jewelry products with fast, SEO-friendly pages.",
        technologies: ["Next.js", "React", "Firebase"],
        features: [
            "SSR/SSG for performance",
            "Product galleries and filtering",
            "Secure auth and data with Firebase",
        ],
        demoLink: "https://heroncopper.com",
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
            "Python tools for productivity automation across file, web, and reporting workflows. Entire native application to handle data flows, ingestion from a wide variety of data structures, validation and conversions.",
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

export function initProjects(openModalFn) {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        const projectKey = card.dataset.project;
        const project = projects[projectKey];

        if (!project) return;

        card.addEventListener("click", () => {
            openModalFn(project);
        });

        // Add cursor pointer style
        card.style.cursor = "pointer";

        // Add keyboard support
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Open details for ${project.title}`);
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModalFn(project);
            }
        });

        // Image fallback for broken thumbnails
        const img = card.querySelector(".project-thumb img");
        if (img) {
            img.addEventListener("error", () => {
                if (img.dataset.fallbackApplied) return;
                img.dataset.fallbackApplied = "true";
                img.classList.add("img-error");
                img.src = "images/astro.png";
            });
        }

        // Add quick action badges for Demo/GitHub when available
        const badges = document.createElement("div");
        badges.className = "project-badges";

        if (project.demoLink) {
            const a = document.createElement("a");
            a.href = project.demoLink;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "badge demo";
            a.setAttribute("aria-label", `Open live demo for ${project.title}`);
            a.innerHTML = `<span class="badge-icon">🚀</span><span class="badge-text">Demo</span>`;
            a.addEventListener("click", (ev) => ev.stopPropagation());
            badges.appendChild(a);
        }
        if (project.githubLink) {
            const a = document.createElement("a");
            a.href = project.githubLink;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "badge code";
            a.setAttribute("aria-label", `View code for ${project.title}`);
            a.innerHTML = `<span class="badge-icon">📁</span><span class="badge-text">Code</span>`;
            a.addEventListener("click", (ev) => ev.stopPropagation());
            badges.appendChild(a);
        }
        
        if (badges.children.length > 0) {
            card.appendChild(badges);
        }

        // Add centered title overlay on the image
        const thumb = card.querySelector('.project-thumb');
        if (thumb) {
            const overlay = document.createElement('div');
            overlay.className = 'project-title-overlay';
            overlay.textContent = project.title;
            thumb.appendChild(overlay);
        }
    });
}
