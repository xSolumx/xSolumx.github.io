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
            githubLink: "https://swazitrac.com",
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
            githubLink: "https://heroncopper.com",
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
    const skillTree = window.skillTreeData || {};
    const perkData = skillTree.nodes || window.perkData || {};
    const nodesDef = skillTree.groupNodes || window.perkNodes || {};

    const groups = (Array.isArray(skillTree.groups) && skillTree.groups.length
        ? skillTree.groups
        : [
              { id: "languages", label: "Core Languages", color: "rgba(101, 67, 33, 0.85)" },
              { id: "web", label: "Web & Databases", color: "rgba(120, 75, 30, 0.8)" },
              { id: "tools", label: "Tools & Design", color: "rgba(80, 60, 40, 0.85)" },
              { id: "ai", label: "AI/ML", color: "rgba(60, 90, 140, 0.85)" },
          ]).map((group) => ({
        id: group.id,
        label: group.label || group.id,
        color: group.color || null,
        description: group.description || "",
        order: Number.isFinite(group.order) ? group.order : 0,
    }));

    const groupLabelMap = groups.reduce((acc, group) => {
        acc[group.id] = group.label;
        return acc;
    }, {});

    const RELATED_PAIRS = Array.isArray(skillTree.curatedPairs)
        ? skillTree.curatedPairs
        : Array.isArray(window.skillTreeConnections)
        ? window.skillTreeConnections
        : [
              ["web-1", "web-2"],
              ["web-2", "web-6"],
              ["web-6", "web-3"],
              ["web-3", "web-12"],
              ["web-2", "web-7"],
              ["web-7", "web-11"],
              ["web-7", "web-8"],
              ["web-5", "web-9"],
              ["tools-9", "tools-10"],
              ["languages-2", "languages-9"],
              ["languages-3", "languages-10"],
              ["languages-1", "ai-3"],
              ["ai-3", "ai-1"],
              ["ai-3", "ai-2"],
              ["ai-1", "ai-5"],
              ["web-2", "web-15"],
              ["web-2", "web-13"],
              ["web-3", "web-14"],
              ["web-7", "web-16"],
              ["tools-6", "tools-13"],
              ["tools-11", "tools-12"],
          ];

    const datasetValidation = validateSkillDatasets({
        perkMeta: perkData,
        nodeGroups: nodesDef,
        groupLabels: groupLabelMap,
        relatedPairs: RELATED_PAIRS,
    });

    reportSkillValidation(datasetValidation);
    if (typeof window !== "undefined") {
        window.__perkValidation = datasetValidation;
    }

    function resolvePerkMeta(key) {
        return (perkData && perkData[key]) || null;
    }

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
    let nodeMeta = {}; // key -> {unlocked, group, current, target, prereqs: string[]}
    let svgLayers = { center: null, related: null, prereqs: null };
    let orderedGroupNodes = {};
    let groupAngles = {};

    const GRAPH_LAYOUT = Object.freeze({
        ringCount: 6,
        minInnerRadiusFactor: 0.20,  // Increased from 0.17 for more inner space
        minInnerAbsolute: 95,         // Increased from 80 for larger inner radius
        outerPadding: 85,             // Increased from 75 for more outer padding
        laneJitter: 28,               // Increased from 18 for more radial spread
        laneIntraOffset: 38,          // Increased from 26 for more spacing within lanes
    });

    // Spacing configuration: significantly improved thresholds to eliminate overlap
    const SPACING_THRESHOLDS = [
        // upTo, groupGap (deg), minSep (deg), marginFactor
        { upTo: 28, groupGap: 75, minSep: 34, marginFactor: 0.80 },      // More aggressive for small sets
        { upTo: 40, groupGap: 68, minSep: 36, marginFactor: 0.52 },      // Increased separation
        { upTo: 60, groupGap: 60, minSep: 34, marginFactor: 0.45 },      // Wider spacing
        { upTo: Infinity, groupGap: 52, minSep: 32, marginFactor: 0.38 }, // More room for large sets
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

    function validateSkillDatasets({ perkMeta, nodeGroups, groupLabels, relatedPairs }) {
        const warnings = [];
        const errors = [];
        const groupCounts = {};
        const duplicateKeys = new Set();
        const missingMeta = [];
        const nodeIndex = new Map();

        if (!nodeGroups || typeof nodeGroups !== "object") {
            errors.push("Skill tree data is missing a valid groupNodes structure.");
            return {
                totalNodes: 0,
                groupCounts: {},
                warnings,
                errors,
                duplicateKeys: [],
                missingMeta,
                unusedMetaKeys: Object.keys(perkMeta || {}),
                stats: { unlocked: 0, locked: 0, averageProficiency: 0 },
            };
        }

        Object.entries(nodeGroups).forEach(([groupId, entries]) => {
            if (!Array.isArray(entries)) {
                errors.push(`Group "${groupId}" should be an array of node definitions.`);
                groupCounts[groupId] = 0;
                return;
            }
            groupCounts[groupId] = entries.length;
            if (!groupLabels || !groupLabels[groupId]) {
                warnings.push(`Group "${groupId}" is not defined in the group list.`);
            }

            entries.forEach((node, index) => {
                const key = node?.key || node?.id;
                if (!key) {
                    errors.push(`nodes[${groupId}][${index}] is missing a key/id.`);
                    return;
                }
                if (nodeIndex.has(key)) {
                    duplicateKeys.add(key);
                    warnings.push(`Duplicate node identifier "${key}" detected.`);
                } else {
                    nodeIndex.set(key, { node, groupId });
                }

                const meta = perkMeta ? perkMeta[key] : undefined;
                if (!meta) {
                    missingMeta.push(key);
                    warnings.push(`Metadata missing for node "${key}".`);
                }

                const prof = Number(node?.prof ?? node?.proficiency);
                if (!Number.isFinite(prof) || prof < 0 || prof > 5) {
                    warnings.push(`Proficiency value for "${key}" should be between 0-5 (received "${node?.prof}").`);
                }

                if (typeof node?.unlocked !== "boolean") {
                    warnings.push(`Node "${key}" has non-boolean unlocked flag (${node?.unlocked}).`);
                }

                if (node?.group && node.group !== groupId) {
                    warnings.push(`Node "${key}" declares group "${node.group}" but is stored in "${groupId}".`);
                }

                if (Array.isArray(node?.prereqs)) {
                    node.prereqs.forEach((pr) => {
                        if (pr === key) {
                            errors.push(`Node "${key}" cannot list itself as a prerequisite.`);
                        } else if (!nodeIndex.has(pr) && !(perkMeta && perkMeta[pr])) {
                            warnings.push(`Prerequisite "${pr}" referenced by "${key}" is not present in the dataset.`);
                        }
                    });
                }
            });
        });

        const unusedMetaKeys = [];
        if (perkMeta && typeof perkMeta === "object") {
            Object.keys(perkMeta).forEach((key) => {
                if (!nodeIndex.has(key)) {
                    unusedMetaKeys.push(key);
                }
            });
        }

        if (Array.isArray(relatedPairs)) {
            relatedPairs.forEach((pair) => {
                const [aKey, bKey] = Array.isArray(pair) ? pair : [pair?.from, pair?.to];
                if (!aKey || !bKey) return;
                if (!nodeIndex.has(aKey) || !nodeIndex.has(bKey)) {
                    warnings.push(`Related pair references missing node(s): ${aKey} ↔ ${bKey}`);
                }
            });
        }

        const gradientWarnings = new Set();
        nodeIndex.forEach(({ node }, key) => {
            const nodeProf = Number(node?.prof ?? node?.proficiency ?? 0);
            const prereqs = Array.isArray(node?.prereqs) ? node.prereqs : [];
            if (!prereqs.length || !Number.isFinite(nodeProf) || nodeProf === 0) {
                return;
            }
            prereqs.forEach((prKey) => {
                const prereqEntry = nodeIndex.get(prKey) || (perkMeta && perkMeta[prKey] ? { node: perkMeta[prKey] } : null);
                if (!prereqEntry) return;
                const prereqNode = prereqEntry.node || prereqEntry;
                const prereqProf = Number(prereqNode?.prof ?? prereqNode?.proficiency ?? 0);
                if (!Number.isFinite(prereqProf)) return;
                if (prereqProf > nodeProf) {
                    const signature = `${prKey}->${key}`;
                    if (!gradientWarnings.has(signature)) {
                        gradientWarnings.add(signature);
                        warnings.push(`Prerequisite "${prKey}" (skill ${prereqProf}) exceeds "${key}" (skill ${nodeProf}). Adjust the proficiency gradient or dependencies.`);
                    }
                }
            });
        });

        const stats = {
            totalNodes: nodeIndex.size,
            unlocked: 0,
            locked: 0,
            averageProficiency: 0,
            tierCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };

        if (nodeIndex.size > 0) {
            let profSum = 0;
            nodeIndex.forEach(({ node }, key) => {
                const meta = perkMeta && perkMeta[key] ? perkMeta[key] : node;
                const prof = Number(meta?.prof ?? meta?.proficiency ?? node?.prof ?? 0);
                profSum += prof;
                const unlocked = meta?.unlocked ?? node?.unlocked ?? false;
                if (unlocked) stats.unlocked += 1;
                else stats.locked += 1;
                if (Number.isFinite(prof)) {
                    const tierKey = Math.max(0, Math.min(5, Math.round(prof)));
                    if (tierKey in stats.tierCounts) {
                        stats.tierCounts[tierKey] += 1;
                    }
                }
            });
            stats.averageProficiency = Number((profSum / nodeIndex.size).toFixed(2));
        }

        return {
            totalNodes: stats.totalNodes,
            groupCounts,
            warnings,
            errors,
            duplicateKeys: Array.from(duplicateKeys),
            missingMeta,
            unusedMetaKeys,
            stats,
        };
    }

    function reportSkillValidation(report) {
        if (!report || typeof console === "undefined") return;
        const groupEntries = Object.entries(report.groupCounts || {});
        const canGroup = Boolean(console.groupCollapsed || console.group);
        if (console.groupCollapsed) {
            console.groupCollapsed("Skill tree data validation");
        } else if (console.group) {
            console.group("Skill tree data validation");
        } else {
            console.log("Skill tree data validation");
        }
        console.log(`Total nodes: ${report.totalNodes}`);
        if (report.stats) {
            console.log(
                `Unlocked: ${report.stats.unlocked} | Locked: ${report.stats.locked} | Avg proficiency: ${report.stats.averageProficiency}`
            );
            if (report.stats.tierCounts) {
                console.log(
                    `Tier distribution: ${Object.entries(report.stats.tierCounts)
                        .map(([tier, count]) => `${tier}:${count}`)
                        .join(" | ")}`
                );
            }
        }
        groupEntries.forEach(([id, count]) => {
            console.log(` - ${id}: ${count}`);
        });
        if (Array.isArray(report.duplicateKeys) && report.duplicateKeys.length) {
            console.warn(`Duplicate node keys detected: ${report.duplicateKeys.join(", ")}`);
        }
        if (Array.isArray(report.missingMeta) && report.missingMeta.length) {
            console.warn(`Nodes missing metadata entries: ${report.missingMeta.join(", ")}`);
        }
        if (Array.isArray(report.unusedMetaKeys) && report.unusedMetaKeys.length) {
            console.warn(`Metadata without nodes: ${report.unusedMetaKeys.join(", ")}`);
        }
        if (Array.isArray(report.errors)) {
            report.errors.forEach((msg) => console.error(msg));
        }
        if (Array.isArray(report.warnings)) {
            report.warnings.forEach((msg) => console.warn(msg));
        }
        if (canGroup && console.groupEnd) {
            console.groupEnd();
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

    function updateRing(proficiency, target = 5) {
        if (!progressBar) return;
        const r = parseFloat(progressBar.getAttribute("r") || "50");
        const circumference = 2 * Math.PI * r;
        const max = Math.max(1, target);
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
        
        // Add gradient definitions for progress rings
        const defs = document.createElementNS(SVG_NS, "defs");
        const gradient = document.createElementNS(SVG_NS, "linearGradient");
        gradient.setAttribute("id", "progressGradient");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "100%");
        
        const stop1 = document.createElementNS(SVG_NS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#00ff88");
        gradient.appendChild(stop1);
        
        const stop2 = document.createElementNS(SVG_NS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#00ffa2");
        gradient.appendChild(stop2);
        
        defs.appendChild(gradient);
        linksSvg.appendChild(defs);
        
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
        if (!meta || !targetPos) return;
        
        // Draw INCOMING connections (prerequisites -> this node)
        if (Array.isArray(meta.prereqs)) {
            meta.prereqs.forEach((preKey) => {
                const prePos = nodePositions[preKey];
                const preMeta = nodeMeta[preKey];
                if (!prePos || !preMeta) return;
                
                // Calculate control point for curved prerequisite line
                const midX = (prePos.x + targetPos.x) / 2;
                const midY = (prePos.y + targetPos.y) / 2;
                const dx = targetPos.x - prePos.x;
                const dy = targetPos.y - prePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Perpendicular offset (opposite direction from related links)
                const offsetAmount = dist * 0.18;
                const perpX = dy / dist * offsetAmount;
                const perpY = -dx / dist * offsetAmount;
                const ctrlX = midX + perpX;
                const ctrlY = midY + perpY;
                
                const path = document.createElementNS(SVG_NS, "path");
                const pathD = `M ${prePos.x} ${prePos.y} Q ${ctrlX} ${ctrlY} ${targetPos.x} ${targetPos.y}`;
                path.setAttribute("d", pathD);
                
                // Style: dashed curve; colored based on unlock status
                const color = preMeta.unlocked 
                    ? "rgba(0,255,136,0.65)" 
                    : "rgba(255,100,100,0.55)";
                path.setAttribute("stroke", color);
                path.setAttribute("stroke-width", "2.5");
                path.setAttribute("stroke-dasharray", "6 4");
                path.setAttribute("fill", "none");
                path.setAttribute("stroke-linecap", "round");
                
                // Add arrow marker at the end
                const marker = document.createElementNS(SVG_NS, "circle");
                marker.setAttribute("cx", String(targetPos.x));
                marker.setAttribute("cy", String(targetPos.y));
                marker.setAttribute("r", "4");
                marker.setAttribute("fill", color);
                
                svgLayers.prereqs.appendChild(path);
                svgLayers.prereqs.appendChild(marker);
            });
        }
        
        // Draw OUTGOING connections (this node -> nodes that depend on it)
        // Find all nodes that list targetKey in their prereqs
        Object.keys(nodeMeta).forEach((dependentKey) => {
            if (dependentKey === targetKey) return;
            const dependentMeta = nodeMeta[dependentKey];
            const dependentPos = nodePositions[dependentKey];
            
            if (!dependentMeta || !dependentPos || !Array.isArray(dependentMeta.prereqs)) return;
            
            // Check if this node depends on targetKey
            if (dependentMeta.prereqs.includes(targetKey)) {
                // Calculate control point for curved line
                const midX = (targetPos.x + dependentPos.x) / 2;
                const midY = (targetPos.y + dependentPos.y) / 2;
                const dx = dependentPos.x - targetPos.x;
                const dy = dependentPos.y - targetPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Perpendicular offset (same direction as incoming)
                const offsetAmount = dist * 0.18;
                const perpX = dy / dist * offsetAmount;
                const perpY = -dx / dist * offsetAmount;
                const ctrlX = midX + perpX;
                const ctrlY = midY + perpY;
                
                const path = document.createElementNS(SVG_NS, "path");
                const pathD = `M ${targetPos.x} ${targetPos.y} Q ${ctrlX} ${ctrlY} ${dependentPos.x} ${dependentPos.y}`;
                path.setAttribute("d", pathD);
                
                // Style: solid curve; colored based on target unlock status
                const color = dependentMeta.unlocked 
                    ? "rgba(100,180,255,0.65)" 
                    : "rgba(255,200,100,0.55)";
                path.setAttribute("stroke", color);
                path.setAttribute("stroke-width", "2.5");
                path.setAttribute("fill", "none");
                path.setAttribute("stroke-linecap", "round");
                
                // Add arrow marker at the dependent end
                const marker = document.createElementNS(SVG_NS, "circle");
                marker.setAttribute("cx", String(dependentPos.x));
                marker.setAttribute("cy", String(dependentPos.y));
                marker.setAttribute("r", "4");
                marker.setAttribute("fill", color);
                
                svgLayers.prereqs.appendChild(path);
                svgLayers.prereqs.appendChild(marker);
            }
        });
    }
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
        // Compute ring radii (levels 1..6 from inner to outer). Keep padding so nodes don't clip.
        const baseNodeSize = cssScale("--perk-node-size", 68);
        const nodeHalf = baseNodeSize / 2;
        const padding = GRAPH_LAYOUT.outerPadding + nodeHalf;
        const innerMin = Math.max(GRAPH_LAYOUT.minInnerAbsolute, minDim * GRAPH_LAYOUT.minInnerRadiusFactor);
        const ringCount = GRAPH_LAYOUT.ringCount;
        const outerMax = Math.max(innerMin + 200, (minDim / 2) - padding + 25);
        // Use gentle exponential distribution for balanced spacing
        const radii = Array.from({ length: ringCount }, (_, i) => {
            const t = i / (ringCount - 1);
            // Gentle ease-out curve for more natural spacing
            const eased = 1 - Math.pow(1 - t, 1.35);
            return innerMin + ((outerMax - innerMin) * eased);
        });

        // Sync decorative rings to these radii (if present in DOM)
        const ringEls = graphEl.querySelectorAll('.graph-ring');
        ringEls.forEach((ringEl, idx) => {
            const r = radii[Math.min(idx, radii.length - 1)];
            const d = Math.round(r * 2);
            ringEl.style.width = `${d}px`;
            ringEl.style.height = `${d}px`;
        });
        
        // Add group background arcs
        const arcLayer = document.createElementNS(SVG_NS, "g");
        arcLayer.setAttribute("id", "group-arcs");
        arcLayer.setAttribute("opacity", "0.08");
        if (svgLayers.center) {
            linksSvg.insertBefore(arcLayer, svgLayers.center);
        }

        // Map proficiency to ring: use prerequisite depth for hierarchy
        // Calculate depth based on prerequisites (foundational skills = low depth = inner rings)
        const calculateDepth = (nodeKey, visited = new Set()) => {
            if (visited.has(nodeKey)) return 0; // Circular dependency guard
            visited.add(nodeKey);
            
            const meta = resolvePerkMeta(nodeKey);
            if (!meta || !meta.prereqs || meta.prereqs.length === 0) {
                return 1; // Foundational skill (no prereqs)
            }
            
            // Depth is 1 + max depth of prerequisites
            const prereqDepths = meta.prereqs.map(prereq => calculateDepth(prereq, new Set(visited)));
            return 1 + Math.max(...prereqDepths, 0);
        };
        
        // Create depth map for all nodes
        const nodeDepthMap = {};
        Object.keys(perkData).forEach(key => {
            nodeDepthMap[key] = calculateDepth(key);
        });
        
        // Log depth distribution for debugging
        const depthStats = {};
        Object.entries(nodeDepthMap).forEach(([key, depth]) => {
            if (!depthStats[depth]) depthStats[depth] = [];
            depthStats[depth].push(key);
        });
        console.log('Skill Tree Depth Hierarchy:');
        Object.keys(depthStats).sort((a, b) => a - b).forEach(depth => {
            const skills = depthStats[depth];
            console.log(`  Depth ${depth} (${skills.length} skills):`, skills.slice(0, 5).join(', ') + (skills.length > 5 ? '...' : ''));
        });
        
        // Map depth to ring indices (1-5 depth levels mapped to 6 rings)
        const ringForProf = (p, nodeKey) => {
            // Use calculated depth if available, otherwise fall back to proficiency
            const depth = nodeDepthMap[nodeKey] || Math.round(Number(p) || 1);
            const clampedDepth = Math.min(5, Math.max(1, depth));
            
            // Map depth 1-5 to ring indices 0-5
            // Depth 1: innermost (foundational), Depth 5: outermost (advanced)
            const ringMapping = {
                1: 0,  // innermost - foundational skills
                2: 1,  // basic intermediate
                3: 3,  // intermediate
                4: 4,  // advanced
                5: 5   // outermost - specialized/expert
            };
            const ringIdx = ringMapping[clampedDepth] || 0;
            return radii[ringIdx];
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

        const defaultGroupPalette = {
            languages: "rgba(101, 67, 33, 0.85)",
            web: "rgba(120, 75, 30, 0.8)",
            tools: "rgba(80, 60, 40, 0.85)",
            ai: "rgba(60, 90, 140, 0.85)",
        };
        const groupColors = groups.reduce((acc, group) => {
            acc[group.id] = group.color || defaultGroupPalette[group.id] || "rgba(101, 67, 33, 0.7)";
            return acc;
        }, {});

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
            const span = Math.max(62, spanShare);  // Increased minimum span from 58
            const margin = Math.min(32, span * marginFactor);  // Increased max margin from 26
            const baseStart = wedgeStart + margin;
            let baseEnd = wedgeStart + span - margin;
            if (baseEnd <= baseStart) {
                baseEnd = baseStart + 18;  // Increased minimum gap from 14
            }
            
            // Draw group arc background
            const arcPath = document.createElementNS(SVG_NS, "path");
            const innerRadius = innerMin * 0.4;
            const outerRadius = outerMax + 5;
            const startAngleRad = degToRad(wedgeStart);
            const endAngleRad = degToRad(wedgeStart + span);
            
            const x1 = cx + innerRadius * Math.cos(startAngleRad);
            const y1 = cy + innerRadius * Math.sin(startAngleRad);
            const x2 = cx + outerRadius * Math.cos(startAngleRad);
            const y2 = cy + outerRadius * Math.sin(startAngleRad);
            const x3 = cx + outerRadius * Math.cos(endAngleRad);
            const y3 = cy + outerRadius * Math.sin(endAngleRad);
            const x4 = cx + innerRadius * Math.cos(endAngleRad);
            const y4 = cy + innerRadius * Math.sin(endAngleRad);
            
            const largeArc = span > 180 ? 1 : 0;
            const pathData = `
                M ${x1} ${y1}
                L ${x2} ${y2}
                A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
                L ${x4} ${y4}
                A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
                Z
            `;
            
            arcPath.setAttribute("d", pathData);
            arcPath.setAttribute("fill", groupColors[group.id] || "rgba(101, 67, 33, 0.5)");
            arcLayer.appendChild(arcPath);

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
            // Increased minimum lane width to prevent cramping
            const minLaneWidth = Math.min(78, totalWidth / Math.max(1, profLevels.length));

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
                const pad = Math.min(12, localWidth / 7);  // Increased padding from 8 to 12
                const effectiveStart = localStart + pad;
                const effectiveEnd = localEnd - pad;
                const usableWidth = Math.max(0, effectiveEnd - effectiveStart);
                const rawStep = laneNodes.length > 1 ? usableWidth / (laneNodes.length - 1) : 0;
                // More aggressive minimum step calculation to prevent overlap
                const minNodeStep = Math.max(minSep * 1.35, usableWidth / Math.max(1, laneNodes.length));
                const step = laneNodes.length > 1 ? Math.max(rawStep, minNodeStep) : 0;
                const usedWidth = laneNodes.length > 1 ? step * (laneNodes.length - 1) : 0;
                const startAngle = laneNodes.length > 1
                    ? effectiveStart + (usableWidth - usedWidth) / 2
                    : effectiveStart + usableWidth / 2;

                laneNodes.forEach((node, idx) => {
                    arranged.push(node);
                    const angle = laneNodes.length === 1 ? startAngle : startAngle + step * idx;
                    const rad = degToRad(angle);
                    const profBase = ringForProf(profKey || 1, node.key);
                    // Enhanced jitter to spread nodes radially - removed 0.7 multiplier
                    const laneOffset = (laneIdx - (profLevels.length - 1) / 2) * GRAPH_LAYOUT.laneJitter;
                    const intraLaneOffset = laneNodes.length > 1
                        ? (idx - (laneNodes.length - 1) / 2) * Math.min(GRAPH_LAYOUT.laneIntraOffset * 0.85, localWidth / Math.max(2, laneNodes.length))
                        : 0;
                    let radius = profBase + laneOffset + intraLaneOffset;
                    radius = Math.max(innerMin * 0.75, Math.min(outerMax * 1.0, radius));
                    const x = cx + radius * Math.cos(rad);
                    const y = cy + radius * Math.sin(rad);

                    const el = document.createElement("div");
                    const metaInfo = resolvePerkMeta(node.key) || node;
                    const targetTier = Math.max(1, Math.min(5, Math.round(Number(metaInfo?.target ?? node.prof ?? 1))));
                    const currentTier = node.unlocked
                        ? targetTier
                        : Math.max(0, Math.min(5, Math.round(Number(metaInfo?.current ?? 0))));
                    el.className = `perk-node ${node.unlocked ? "unlocked" : "locked"}`;
                    el.dataset.perk = node.key;
                    el.dataset.metaSource = metaInfo && metaInfo.metaSource ? metaInfo.metaSource : "unknown";
                    el.dataset.tier = String(targetTier);
                    el.classList.add(`tier-${targetTier}`);
                    if (el.dataset.metaSource === "fallback") {
                        el.classList.add("perk-node-fallback");
                    }
                    el.style.left = `${x}px`;
                    el.style.top = `${y}px`;
                    
                    // Add staggered animation delay based on creation order
                    const animDelay = created.length * 0.015;
                    el.style.animationDelay = `${animDelay}s`;
                    
                    el.setAttribute("tabindex", "0");
                    el.setAttribute("role", "button");
                    el.setAttribute("aria-label", (metaInfo && metaInfo.title) || node.alt || node.key);

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
                badge.textContent = node.unlocked ? String(targetTier) : "—";
                badge.setAttribute("title", `Target skill tier: ${targetTier}`);
                el.appendChild(badge);

                // Add progress ring SVG
                const progressRing = document.createElementNS(SVG_NS, "svg");
                progressRing.classList.add("perk-progress-ring");
                progressRing.setAttribute("viewBox", "0 0 76 76");
                
                const bgCircle = document.createElementNS(SVG_NS, "circle");
                bgCircle.classList.add("ring-bg");
                bgCircle.setAttribute("cx", "38");
                bgCircle.setAttribute("cy", "38");
                bgCircle.setAttribute("r", "35");
                progressRing.appendChild(bgCircle);
                
                if (node.unlocked) {
                    const progressCircle = document.createElementNS(SVG_NS, "circle");
                    progressCircle.classList.add("ring-progress");
                    progressCircle.setAttribute("cx", "38");
                    progressCircle.setAttribute("cy", "38");
                    progressCircle.setAttribute("r", "35");
                    const circumference = 2 * Math.PI * 35;
                    const progress = targetTier / 5;
                    const offset = circumference * (1 - progress);
                    progressCircle.setAttribute("stroke-dasharray", circumference);
                    progressCircle.setAttribute("stroke-dashoffset", offset);
                    progressRing.appendChild(progressCircle);
                }
                
                el.appendChild(progressRing);

                // Add tier stars
                const starsContainer = document.createElement("div");
                starsContainer.className = "perk-stars";
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement("div");
                    star.className = i < targetTier ? "star" : "star empty";
                    starsContainer.appendChild(star);
                }
                el.appendChild(starsContainer);

                nodesContainer.appendChild(el);

                    // Track node positions and meta for inter-node links
                    nodePositions[node.key] = { x, y };
                    nodeMeta[node.key] = {
                        unlocked: !!node.unlocked,
                        group: group.id,
                        prof: currentTier,
                        current: currentTier,
                        target: targetTier,
                        prereqs: Array.isArray(node.prereqs) ? node.prereqs : [],
                        metaSource: el.dataset.metaSource,
                    };

                    // draw link from center with improved visuals
                    const line = document.createElementNS(SVG_NS, "line");
                    line.setAttribute("x1", String(cx));
                    line.setAttribute("y1", String(cy));
                    line.setAttribute("x2", String(x));
                    line.setAttribute("y2", String(y));
                    const linkColor = groupColors[group.id] || "rgba(101, 67, 33, 0.7)";
                    
                    // Different opacity/width based on unlock status and tier
                    if (node.unlocked) {
                        const alpha = 0.25 + (targetTier * 0.08); // Higher tiers more visible
                        line.setAttribute("stroke", linkColor.replace(/[\d.]+\)$/, `${alpha})`));
                        line.setAttribute("stroke-width", "2");
                    } else {
                        line.setAttribute("stroke", "rgba(120,120,120,0.15)");
                        line.setAttribute("stroke-width", "1");
                        line.setAttribute("stroke-dasharray", "3 3");
                    }
                    
                    if (svgLayers.center) svgLayers.center.appendChild(line);

                    created.push(el);
                });
            });

            orderedGroupNodes[group.id] = arranged;
            groupAngles[group.id] = { start: wedgeStart, span };
            currentStart += span + groupGap;
        });

        // Draw always-on related connections (subtle, curved lines)
        function drawRelatedLinks() {
            if (!svgLayers.related) return;
            // Clear related layer first
            while (svgLayers.related.firstChild) svgLayers.related.removeChild(svgLayers.related.firstChild);
            
            // Only draw curated cross-group connections (skip adjacent within-group to reduce clutter)
            RELATED_PAIRS.forEach(([aKey, bKey]) => {
                const pa = nodePositions[aKey];
                const pb = nodePositions[bKey];
                const metaA = nodeMeta[aKey];
                const metaB = nodeMeta[bKey];
                if (!pa || !pb || !metaA || !metaB) return;
                
                // Only draw if both nodes are unlocked (reduce visual noise)
                if (!metaA.unlocked || !metaB.unlocked) return;
                
                // Calculate control point for quadratic curve (slight arc)
                const midX = (pa.x + pb.x) / 2;
                const midY = (pa.y + pb.y) / 2;
                const dx = pb.x - pa.x;
                const dy = pb.y - pa.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Perpendicular offset for curve (20% of distance)
                const offsetAmount = dist * 0.15;
                const perpX = -dy / dist * offsetAmount;
                const perpY = dx / dist * offsetAmount;
                const ctrlX = midX + perpX;
                const ctrlY = midY + perpY;
                
                const path = document.createElementNS(SVG_NS, "path");
                const pathD = `M ${pa.x} ${pa.y} Q ${ctrlX} ${ctrlY} ${pb.x} ${pb.y}`;
                path.setAttribute("d", pathD);
                path.setAttribute("stroke", "rgba(200,180,140,0.15)");
                path.setAttribute("stroke-width", "1.5");
                path.setAttribute("fill", "none");
                svgLayers.related.appendChild(path);
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

        if (typeof window !== "undefined") {
            try {
                window.__perkGraphState = {
                    nodePositions: { ...nodePositions },
                    nodeMeta: JSON.parse(JSON.stringify(nodeMeta)),
                    groupAngles: { ...groupAngles },
                    orderedGroupNodes: Object.fromEntries(Object.entries(orderedGroupNodes).map(([id, list]) => [id, list.map((item) => item.key || item)])),
                    validation: datasetValidation,
                };
            } catch (err) {
                console.warn("Unable to snapshot perk graph state", err);
            }
        }

        return created;
    }

    function getProficiencyFromNode(nodeEl) {
        if (!nodeEl) return 0;
        const key = nodeEl.getAttribute("data-perk") || "";
        const info = key ? nodeMeta[key] : null;
        return info && Number.isFinite(info.current) ? info.current : 0;
    }

    function clearSelection() {
        if (!nodesContainer) return;
        nodesContainer
            .querySelectorAll(".perk-node.selected")
            .forEach((n) => n.classList.remove("selected"));
    }

    function highlightRelatedNodes(nodeKey) {
        // Highlighting disabled - nodes remain at normal opacity
        // This function is kept for compatibility but does nothing
        return;
    }

    function clearHighlights() {
        // Highlighting disabled - no cleanup needed
        // This function is kept for compatibility but does nothing
        return;
    }

    function showPerk(perkKey, nodeEl) {
        if (!progressPanel) return;
        const meta = resolvePerkMeta(perkKey);
        const info = nodeMeta[perkKey] || {};
        const currentTier = info.current ?? getProficiencyFromNode(nodeEl);
        const targetTier = info.target ?? Math.max(currentTier, Number(meta?.prof ?? meta?.target ?? 0));
        const fallbackTitle = nodeEl?.getAttribute("aria-label") || perkKey;
        if (detailsTitle) detailsTitle.textContent = (meta && meta.title) || fallbackTitle;
        if (detailsDesc) detailsDesc.textContent = (meta && (meta.description || meta.summary)) || "Metadata pending documentation.";
        setRewardSection((meta && meta.reward) || "—");
        if (progressStatus) {
            const metaSource = meta && meta.metaSource ? meta.metaSource : (perkData && perkData[perkKey] ? "canonical" : "unknown");
            progressStatus.dataset.metaSource = metaSource;
            if (metaSource === "fallback") {
                progressStatus.setAttribute("title", "Metadata auto-generated from legacy dataset");
            } else {
                progressStatus.removeAttribute("title");
            }
            const isUnlocked = !!info.unlocked;
            const currentLabel = isUnlocked
                ? `<span class="current-progress">Current: ${currentTier}</span>`
                : '<span class="current-progress locked">Locked</span>';
            const targetLabel = `<span class="next-progress target">Target: ${targetTier}</span>`;
            progressStatus.innerHTML = `${currentLabel}${targetLabel}`;
        }
        updateRing(currentTier, targetTier);
    }

    function wireNodes(nodeEls) {
        nodeEls.forEach((el) => {
            // Tooltip and highlight interactions
            el.addEventListener("mouseenter", () => {
                const key = el.getAttribute("data-perk") || "";
                drawPrereqLinks(key);
                highlightRelatedNodes(key);
            });
            el.addEventListener("mousemove", (ev) => {
                const key = el.getAttribute("data-perk") || "";
                const data = resolvePerkMeta(key);
                if (!data) return;
                if (!tooltipEl) {
                    tooltipEl = document.createElement("div");
                    tooltipEl.className = "perk-tooltip";
                    document.body.appendChild(tooltipEl);
                }
                const metaInfo = nodeMeta[key] || {};
                const groupId = metaInfo.group;
                const groupLabel = (groupLabelMap && groupLabelMap[groupId]) || data.category || groupId || "Skill";
                const note = data.metaSource === "fallback" ? '<div class="tt-note">⚠ Metadata auto-generated</div>' : "";
                const currentTier = metaInfo.unlocked ? metaInfo.current ?? 0 : 0;
                const targetTier = metaInfo.target ?? Math.max(currentTier, Number(data.prof ?? data.target ?? 0));
                
                // Enhanced tooltip with tags
                const tags = Array.isArray(data.tags) ? data.tags : [];
                const tagsHTML = tags.length ? `<div class="tt-tags">${tags.map(t => `<span class="tt-tag">${t}</span>`).join('')}</div>` : '';
                
                tooltipEl.innerHTML = `
                    <div class="tt-title">${data.title}</div>
                    <div class="tt-meta">
                        <span>${groupLabel}</span>
                        <span>Tier ${targetTier}/5</span>
                    </div>
                    <div class="tt-desc">${data.description || data.summary || 'No description available.'}</div>
                    ${tagsHTML}
                    ${note}
                `;
                
                // clamp to viewport
                const pad = 12;
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const tw = 300; // approx max width
                const th = 160; // approx height
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
                clearHighlights();
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

    // Initial draw and optimized resize handling with RAF
    if (graphEl) {
        redraw();
        let resizeTimer = null;
        let rafId = null;
        
        window.addEventListener("resize", () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            if (rafId) cancelAnimationFrame(rafId);
            
            resizeTimer = setTimeout(() => {
                rafId = requestAnimationFrame(() => redraw());
            }, 200);
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
