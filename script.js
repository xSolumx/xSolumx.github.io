/**
 * Simple Portfolio JavaScript - Working Implementation
 */

document.addEventListener("DOMContentLoaded", function () {
    const hideLoadingScreen = () => {
        const loadingScreen = document.getElementById("loading-screen");
        if (!loadingScreen || loadingScreen.dataset.dismissed === "true") {
            return;
        }
        loadingScreen.dataset.dismissed = "true";
        loadingScreen.classList.add("hide");
        window.setTimeout(() => loadingScreen.remove(), 500);
    };

    const prefersReducedMotion = typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (prefersReducedMotion) {
        hideLoadingScreen();
    } else if (document.readyState === "complete") {
        window.setTimeout(hideLoadingScreen, 600);
    } else {
        window.addEventListener("load", () => {
            window.setTimeout(hideLoadingScreen, 800);
        });
        // Safety timeout in case the load event is delayed
        window.setTimeout(hideLoadingScreen, 3500);
    }

    // Navigation functionality with deep-link support
    const navTabs = document.querySelectorAll(".nav-tab");
    const sections = document.querySelectorAll(".game-section");

    function activateSectionById(sectionId) {
        // expects full id like 'skills-section'
        const name = sectionId?.replace(/-section$/, "") || "perks";
        activateSection(name, false);
    }

    function activateSection(name, pushHash = true) {
        // Remove active from all tabs and sections
        navTabs.forEach((t) => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });
        sections.forEach((s) => {
            s.classList.remove("active");
            s.setAttribute("hidden", "");
        });

        const tab = document.querySelector(`.nav-tab[data-section="${name}"]`);
        const targetSection = document.getElementById(`${name}-section`);
        if (tab) {
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
        }
        if (targetSection) {
            targetSection.classList.add("active");
            targetSection.removeAttribute("hidden");
            if (pushHash) {
                const id = targetSection.getAttribute("id");
                if (id) {
                    history.replaceState(null, "", `#${id}`);
                }
            }
            if (name === "perks" && typeof redraw === "function") {
                requestAnimationFrame(() => redraw());
            }
        }
    }

    navTabs.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionName = tab.dataset.section;
            activateSection(sectionName);
        });

        tab.addEventListener("keydown", (event) => {
            let targetIndex = null;
            switch (event.key) {
                case "ArrowRight":
                case "ArrowDown":
                    targetIndex = (index + 1) % navTabs.length;
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    targetIndex = (index - 1 + navTabs.length) % navTabs.length;
                    break;
                case "Home":
                    targetIndex = 0;
                    break;
                case "End":
                    targetIndex = navTabs.length - 1;
                    break;
                default:
                    break;
            }

            if (targetIndex !== null) {
                event.preventDefault();
                const nextTab = navTabs[targetIndex];
                nextTab.focus();
                activateSection(nextTab.dataset.section);
            }
        });
    });

    // On load, honor hash if present
    const initialHash = (location.hash || "").replace(/^#/, "");
    if (initialHash && document.getElementById(initialHash)) {
        activateSectionById(initialHash);
    }

    // Respond to hash changes (e.g., back/forward)
    window.addEventListener("hashchange", () => {
        const h = (location.hash || "").replace(/^#/, "");
        if (h && document.getElementById(h)) {
            activateSectionById(h);
        }
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
        const project = projects[projectKey];

        card.addEventListener("click", () => {
            openModal(projectKey);
        });

        // Add cursor pointer style
        card.style.cursor = "pointer";

        // Add keyboard support
        card.setAttribute("tabindex", "0");
        if (project?.title) {
            card.setAttribute("aria-label", `Open details for ${project.title}`);
        }
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(projectKey);
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
        if (project && (project.demoLink || project.githubLink)) {
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
            card.appendChild(badges);
        }

        // Add centered title overlay on the image
        const thumb = card.querySelector('.project-thumb');
        if (thumb && project?.title) {
            const overlay = document.createElement('div');
            overlay.className = 'project-title-overlay';
            overlay.textContent = project.title;
            thumb.appendChild(overlay);
        }
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
    const perkData = window.perkData || {};

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
    let orderedGroupNodes = {};
    let groupAngles = {};

    // Spacing configuration: thresholds selected by total node count, then scaled by CSS vars
    const SPACING_THRESHOLDS = [
        // upTo, groupGap (deg), minSep (deg), marginFactor
        { upTo: 28, groupGap: 32, minSep: 8, marginFactor: 0.55 },
        { upTo: 40, groupGap: 26, minSep: 18, marginFactor: 0.25 },
        { upTo: 60, groupGap: 24, minSep: 16, marginFactor: 0.18 },
        { upTo: Infinity, groupGap: 22, minSep: 14, marginFactor: 0.12 },
    ];

    function cssScale(varName, fallback = 1) {
        try {
            const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            if (!val) return fallback;
            const n = parseFloat(val);
            return Number.isFinite(n) ? n : fallback;
        } catch {
            return fallback;
        }
    }

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

    const nodesDef = window.perkNodes || {};

    function degToRad(deg) {
        return (deg * Math.PI) / 180;
    }

    function buildNodes() {
        if (!graphEl || !nodesContainer || !linksSvg) return [];
        nodesContainer.innerHTML = "";
        ensureSvgLayers();
        nodePositions = {};
        nodeMeta = {};
    orderedGroupNodes = {};
    groupAngles = {};

        const rect = graphEl.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
    const minDim = Math.min(rect.width, rect.height);
    // Compute 5 rings (levels 1..5 from inner to outer). Keep padding so nodes don't clip.
    const nodeHalf = 34; // approx half of the enlarged node size including border
    const padding = 32 + nodeHalf; // visual margin + node radius
    const innerMin = Math.max(120, minDim * 0.28);
    const outerMax = Math.max(innerMin + 180, (minDim / 2) - padding + 40);
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

    // Determine spacing based on total node count + CSS-variable scaling
    const totalNodes = groups.reduce((acc, g) => acc + (nodesDef[g.id]?.length || 0), 0);
    const base = SPACING_THRESHOLDS.find(t => totalNodes <= t.upTo) || SPACING_THRESHOLDS[SPACING_THRESHOLDS.length - 1];
    const scaleGap = cssScale("--perk-group-gap-scale", 1);
    const scaleSep = cssScale("--perk-node-sep-scale", 1);
    const scaleMargin = cssScale("--perk-margin-scale", 1);
    const groupGap = base.groupGap * scaleGap;
    const minSep = base.minSep * scaleSep;
    const marginFactor = base.marginFactor * scaleMargin;
        const available = 360 - groupGap * groups.length;
        let currentStart = -90; // start pointing up

    const groupColors = {
            languages: "rgba(101, 67, 33, 0.85)",
            web: "rgba(120, 75, 30, 0.8)",
            tools: "rgba(80, 60, 40, 0.85)",
            ai: "rgba(60, 90, 140, 0.85)",
        };

        const groupData = groups.map((group) => {
            const nodes = nodesDef[group.id] || [];
            const weight = nodes.length + 6;
            return { group, nodes, count: nodes.length, weight };
        });
        const totalWeight = groupData.reduce((acc, item) => acc + item.weight, 0) || 1;

        groupData.forEach((entry) => {
            const { group, nodes, count, weight } = entry;
            if (count === 0) {
                return;
            }

            const wedgeStart = currentStart;
            const spanShare = available * (weight / totalWeight);
            const span = Math.max(50, spanShare);
            const margin = Math.min(32, span * marginFactor);
            const baseStart = wedgeStart + margin;
            let baseEnd = wedgeStart + span - margin;
            if (baseEnd <= baseStart) {
                baseEnd = baseStart + 10;
            }

            const profBuckets = new Map();
            nodes.forEach((node) => {
                const profLevel = Math.max(0, Math.min(5, Math.round(Number(node.prof) || 0)));
                if (!profBuckets.has(profLevel)) {
                    profBuckets.set(profLevel, []);
                }
                profBuckets.get(profLevel).push(node);
            });
            const profLevels = Array.from(profBuckets.keys()).sort((a, b) => a - b);
            const totalWidth = baseEnd - baseStart;
            const arranged = [];
            const minLaneWidth = Math.min(60, totalWidth / Math.max(1, profLevels.length));

            let laneCursor = baseStart;
            profLevels.forEach((profKey, laneIdx) => {
                const laneNodes = (profBuckets.get(profKey) || []).slice();
                if (!laneNodes.length) return;
                laneNodes.sort((a, b) => {
                    const aLabel = (a.alt || a.title || a.key || "").toLowerCase();
                    const bLabel = (b.alt || b.title || b.key || "").toLowerCase();
                    return aLabel.localeCompare(bLabel);
                });
                const remainingLanes = profLevels.length - laneIdx - 1;
                const remainingWidth = baseEnd - laneCursor;
                const proportionalWidth = totalWidth * (laneNodes.length / count);
                let laneWidth = Math.max(minLaneWidth, proportionalWidth);
                laneWidth = Math.min(laneWidth, remainingWidth - remainingLanes * minLaneWidth);
                if (laneIdx === profLevels.length - 1) {
                    laneWidth = Math.max(laneWidth, remainingWidth);
                }
                const localStart = laneCursor;
                const localEnd = laneCursor + laneWidth;
                laneCursor = localEnd;

                const localWidth = Math.max(0, localEnd - localStart);
                const pad = Math.min(12, localWidth / 6);
                const effectiveStart = localStart + pad;
                const effectiveEnd = localEnd - pad;
                const usableWidth = Math.max(0, effectiveEnd - effectiveStart);
                const rawStep = laneNodes.length > 1 ? usableWidth / (laneNodes.length - 1) : 0;
                const minNodeStep = Math.max(minSep, usableWidth / Math.max(1, laneNodes.length));
                const step = laneNodes.length > 1 ? Math.max(rawStep, minNodeStep) : 0;
                const usedWidth = laneNodes.length > 1 ? step * (laneNodes.length - 1) : 0;
                const startAngle = laneNodes.length > 1
                    ? effectiveStart + (usableWidth - usedWidth) / 2
                    : effectiveStart + usableWidth / 2;

                laneNodes.forEach((node, idx) => {
                    arranged.push(node);
                    const angle = laneNodes.length === 1 ? startAngle : startAngle + step * idx;
                    const rad = degToRad(angle);
                    const profBase = ringForProf(profKey || 1);
                    const laneOffset = (laneIdx - (profLevels.length - 1) / 2) * 24;
                    const intraLaneOffset = laneNodes.length > 1
                        ? (idx - (laneNodes.length - 1) / 2) * Math.min(18, localWidth / Math.max(2, laneNodes.length))
                        : 0;
                    let radius = profBase + laneOffset + intraLaneOffset;
                    radius = Math.max(innerMin * 0.7, Math.min(outerMax, radius));
                    const x = cx + radius * Math.cos(rad);
                    const y = cy + radius * Math.sin(rad);

                    const el = document.createElement("div");
                    el.className = `perk-node ${node.unlocked ? "unlocked" : "locked"}`;
                    el.dataset.perk = node.key;
                    el.style.left = `${x}px`;
                    el.style.top = `${y}px`;
                    el.setAttribute("tabindex", "0");
                    el.setAttribute("role", "button");
                    el.setAttribute("aria-label", perkData[node.key]?.title || node.alt || node.key);

                    const icon = document.createElement("div");
                    icon.className = "perk-icon";
                    if (node.icon) {
                        const img = document.createElement("img");
                        img.src = node.icon;
                        img.alt = node.alt || "";
                    // Image fallback to emoji/placeholder on error
                    img.onerror = () => {
                        icon.innerHTML = "";
                        const span = document.createElement("span");
                        span.className = "icon-placeholder";
                        span.textContent = node.emoji || "★";
                        icon.appendChild(span);
                    };
                    icon.appendChild(img);
                } else {
                    const span = document.createElement("span");
                    span.className = "icon-placeholder";
                    span.textContent = node.emoji || "★";
                    icon.appendChild(span);
                }
                el.appendChild(icon);

                const badge = document.createElement("span");
                badge.className = "perk-number";
                badge.textContent = String(node.prof);
                el.appendChild(badge);

                nodesContainer.appendChild(el);

                    // Track node positions and meta for inter-node links
                    nodePositions[node.key] = { x, y };
                    nodeMeta[node.key] = {
                        unlocked: !!node.unlocked,
                        group: group.id,
                        prof: Number(node.prof) || 0,
                        prereqs: Array.isArray(node.prereqs) ? node.prereqs : [],
                    };

                    // draw link
                    const line = document.createElementNS(SVG_NS, "line");
                    line.setAttribute("x1", String(cx));
                    line.setAttribute("y1", String(cy));
                    line.setAttribute("x2", String(x));
                    line.setAttribute("y2", String(y));
                    const linkColor = groupColors[group.id] || "rgba(101, 67, 33, 0.7)";
                    line.setAttribute("stroke", node.unlocked ? linkColor : "rgba(139,139,139,0.6)");
                    line.setAttribute("stroke-width", "1.5");
                    if (svgLayers.center) svgLayers.center.appendChild(line);

                    created.push(el);
                });
            });

            orderedGroupNodes[group.id] = arranged;
            groupAngles[group.id] = { start: wedgeStart, span };
            currentStart += span + groupGap;
        });

        // Draw always-on related connections (adjacent nodes within each group + curated cross-group pairs)
        function drawRelatedLinks() {
            if (!svgLayers.related) return;
            // Clear related layer first
            while (svgLayers.related.firstChild) svgLayers.related.removeChild(svgLayers.related.firstChild);
            // Subtle adjacency within groups
            groups.forEach((group) => {
                const list = orderedGroupNodes[group.id] || nodesDef[group.id] || [];
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
        groups.forEach((g) => {
            const meta = groupAngles[g.id];
            if (!meta) return;
            const mid = meta.start + meta.span / 2;
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
                // clamp to viewport
                const pad = 12;
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const tw = 260; // approx max width
                const th = 140; // approx height
                let left = ev.pageX + pad;
                let top = ev.pageY + pad;
                if (left + tw > window.scrollX + vw) left = ev.pageX - tw - pad;
                if (top + th > window.scrollY + vh) top = ev.pageY - th - pad;
                tooltipEl.style.left = `${left}px`;
                tooltipEl.style.top = `${top}px`;
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
