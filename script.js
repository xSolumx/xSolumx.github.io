(function (window, document) {
    "use strict";

    const isDevelopment = false;
    const STORAGE_KEYS = Object.freeze({
        activeSection: "portfolio-active-section",
    });
    const MAX_SKILLS_PER_GROUP = 12;
    const STAT_SIGNS_THRESHOLD = 12;

    const projects = Object.freeze({
        "ai-nexus": {
            title: "Mind_Core",
            image: "images/imgNexus.png",
            description: "Personal ML custom LLM build focused on efficient training, fine-tuning and local inference.",
            technologies: ["Python", "Ollama", "JAX", "Flax"],
            features: [
                "Custom tokenizer and training pipeline",
                "Local inference with quantization",
                "Experiment tracking and evaluation",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        "Quicker-Swazi": {
            title: "Agricultural Website",
            image: "images/website_QS_Screenshot.png",
            description: "Website for showcasing agricultural products and services with a modern, responsive UI.",
            technologies: ["React", "Firebase"],
            features: [
                "Product catalog and detail pages",
                "Realtime data with Firebase",
                "Responsive and accessible design",
                "SEO best practices",
                "Admin panel, with full products and news management"
            ],
            demoLink: "https://swazitrac.com",
        },
        "Heron-Copper": {
            title: "Jewelry Shop",
            image: "images/website_HC_Screenshot.png",
            description: "Online store for the advertisement of jewelry products with fast, SEO-friendly pages.",
            technologies: ["Next.js", "React", "Firebase"],
            features: [
                "SSR/SSG for performance",
                "Product galleries and filtering",
                "Secure auth and data with Firebase",
            ],
            demoLink: "https://heroncopper.com",
        },
        "game-engine": {
            title: "Custom Game Engine Injection",
            image: "images/imgComp.png",
            description: "Lightweight C++ injection for adding mods/assets into an existing game engine.",
            technologies: ["C++", "Lua"],
            features: [
                "Runtime hooking and API exposure",
                "Lua scripting integration",
                "Asset pipeline for rapid iteration",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        "automation-suite": {
            title: "Automation Suite",
            image: "images/imgbr.png",
            description: "Python tools for productivity automation across file, web, and reporting workflows.",
            technologies: ["Python", "Selenium", "BeautifulSoup", "Pandas", "Schedule", "SQLite"],
            features: [
                "File organization and cleanup",
                "Scraping and data extraction",
                "Automated reports and notifications",
            ],
            githubLink: "https://github.com/xSolumx",
        },
        "portfolio-site": {
            title: "Gaming Portfolio Site",
            image: "images/astro.png",
            description: "Gaming-themed portfolio focused on performance, accessibility, and UX.",
            technologies: ["HTML5", "CSS3", "JavaScript", "PWA"],
            features: [
                "Responsive layout",
                "PWA installability",
                "Smooth animations and transitions",
            ],
            demoLink: "https://xsolumx.github.io",
            githubLink: "https://github.com/xSolumx/xSolumx.github.io",
        },
        "architect-portfolio": {
            title: "Portfolio for an Architect",
            image: "images/imgBrain.png",
            description: "A portfolio site to showcase architectural designs and projects.",
            technologies: ["Next.js", "React", "Firebase"],
            features: [
                "Project galleries and details",
                "Content management with Firebase",
                "Optimized images and SEO",
            ],
            githubLink: "https://github.com/xSolumx",
        },
    });

    document.addEventListener("DOMContentLoaded", () => {
        const skillTree = window.skillTreeData || {};
        const datasetValidation = validateSkillDatasets(skillTree);
        const curatedPairs = deriveRelatedPairs(skillTree);

        const hideLoadingScreen = setupLoadingScreen();
        const modalApi = initModal();
        initProjects(projects, modalApi.openModal);
        initNavigation();
        renderSkillOverview(skillTree, datasetValidation, projects);
        renderSkillCategories(skillTree);
        initializeSkillGraph(skillTree, curatedPairs, datasetValidation);

        if (typeof hideLoadingScreen === "function") {
            hideLoadingScreen();
        }
    });

    function setupLoadingScreen() {
        const loadingScreen = document.getElementById("loading-screen");
        if (!loadingScreen) {
            return () => {};
        }

        const hide = () => {
            if (!loadingScreen || loadingScreen.dataset.dismissed === "true") {
                return;
            }
            loadingScreen.dataset.dismissed = "true";
            loadingScreen.classList.add("hide");
            window.setTimeout(() => {
                if (loadingScreen.parentElement) {
                    loadingScreen.parentElement.removeChild(loadingScreen);
                }
            }, 500);
        };

        const prefersReducedMotion = typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;

        if (prefersReducedMotion) {
            hide();
        } else if (document.readyState === "complete") {
            window.setTimeout(hide, 600);
        } else {
            window.addEventListener("load", () => window.setTimeout(hide, 800));
            window.setTimeout(hide, 3500);
        }

        return hide;
    }

    function initNavigation() {
        const navTabs = Array.from(document.querySelectorAll(".nav-tab"));
        const sections = Array.from(document.querySelectorAll(".game-section"));
        if (!navTabs.length || !sections.length) {
            return;
        }

        function setActiveSection(name, { updateHash = true, persist = true } = {}) {
            const targetName = name || "perks";

            navTabs.forEach((tab) => {
                const isActive = tab.dataset.section === targetName;
                tab.classList.toggle("active", isActive);
                tab.setAttribute("aria-selected", isActive ? "true" : "false");
            });

            sections.forEach((section) => {
                const sectionName = section.id.replace(/-section$/, "");
                const isActive = sectionName === targetName;
                section.classList.toggle("active", isActive);
                if (isActive) {
                    section.removeAttribute("hidden");
                } else {
                    section.setAttribute("hidden", "");
                }
            });

            if (persist) {
                try {
                    window.localStorage.setItem(STORAGE_KEYS.activeSection, targetName);
                } catch (err) {
                    if (isDevelopment) {
                        console.warn("Navigation persistence failed", err);
                    }
                }
            }

            if (updateHash) {
                const sectionEl = document.getElementById(`${targetName}-section`);
                if (sectionEl && sectionEl.id) {
                    history.replaceState(null, "", `#${sectionEl.id}`);
                }
            }

            if (targetName === "perks" && window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                window.requestAnimationFrame(() => window.SkillGraph.redraw());
            }
        }

        function getInitialSection() {
            const hash = (window.location.hash || "").replace(/^#/, "");
            if (hash && document.getElementById(hash)) {
                return hash.replace(/-section$/, "");
            }
            try {
                const stored = window.localStorage.getItem(STORAGE_KEYS.activeSection);
                if (stored && document.querySelector(`.nav-tab[data-section="${stored}"]`)) {
                    return stored;
                }
            } catch (err) {
                if (isDevelopment) {
                    console.warn("Unable to read stored section", err);
                }
            }
            return "perks";
        }

        navTabs.forEach((tab, index) => {
            tab.addEventListener("click", (event) => {
                event.preventDefault();
                setActiveSection(tab.dataset.section);
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
                    case "Enter":
                    case " ":
                        event.preventDefault();
                        setActiveSection(tab.dataset.section);
                        return;
                    default:
                        break;
                }

                if (targetIndex !== null) {
                    event.preventDefault();
                    const nextTab = navTabs[targetIndex];
                    nextTab.focus();
                    setActiveSection(nextTab.dataset.section);
                }
            });
        });

        setActiveSection(getInitialSection(), { updateHash: false });

        window.addEventListener("hashchange", () => {
            const hash = (window.location.hash || "").replace(/^#/, "");
            if (hash && document.getElementById(hash)) {
                setActiveSection(hash.replace(/-section$/, ""), { persist: false });
            }
        });
    }

    function deriveRelatedPairs(skillTree) {
        const nodes = skillTree.nodes || {};
        const pairSet = new Set();
        const results = [];

        const curatedConnections = Array.isArray(skillTree.curatedConnections) ? skillTree.curatedConnections : [];
        curatedConnections.forEach((conn) => {
            const from = conn && (conn.from || (Array.isArray(conn) ? conn[0] : null));
            const to = conn && (conn.to || (Array.isArray(conn) ? conn[1] : null));
            if (!from || !to || !nodes[from] || !nodes[to]) {
                return;
            }
            const key = `${from}->${to}`;
            if (!pairSet.has(key)) {
                pairSet.add(key);
                results.push([from, to]);
            }
        });

        if (results.length) {
            return results;
        }

        Object.values(nodes).forEach((node) => {
            if (!Array.isArray(node.related)) {
                return;
            }
            node.related.forEach((target) => {
                if (!nodes[target]) {
                    return;
                }
                const key = `${node.id}->${target}`;
                if (!pairSet.has(key)) {
                    pairSet.add(key);
                    results.push([node.id, target]);
                }
            });
        });

        return results;
    }

    function validateSkillDatasets(skillTree) {
        const nodes = skillTree.nodes || {};
        const groupNodes = skillTree.groupNodes || {};
        const groups = Array.isArray(skillTree.groups) ? skillTree.groups : [];

        const errors = [];
        const warnings = [];

        groups.forEach((group) => {
            if (!groupNodes[group.id] || !groupNodes[group.id].length) {
                warnings.push(`Group "${group.id}" has no documented nodes.`);
            }
        });

        Object.entries(groupNodes).forEach(([groupId, nodeList]) => {
            nodeList.forEach((entry) => {
                if (!nodes[entry.id]) {
                    errors.push(`Group "${groupId}" references missing node "${entry.id}".`);
                }
            });
        });

        Object.values(nodes).forEach((node) => {
            const prereqs = Array.isArray(node.prereqs) ? node.prereqs : [];
            prereqs.forEach((req) => {
                if (!nodes[req]) {
                    warnings.push(`Node "${node.id}" lists unknown prerequisite "${req}".`);
                }
            });
        });

        const curatedPairs = Array.isArray(skillTree.curatedPairs) ? skillTree.curatedPairs : [];
        curatedPairs.forEach((pair) => {
            const [from, to] = Array.isArray(pair) ? pair : [pair.from, pair.to];
            if (!from || !to) {
                return;
            }
            if (!nodes[from] || !nodes[to]) {
                warnings.push(`Curated connection references missing nodes: ${from} -> ${to}`);
            }
        });

        const summary = {
            generatedAt: new Date().toISOString(),
            totalGroups: groups.length,
            totalNodes: Object.keys(nodes).length,
            errorCount: errors.length,
            warningCount: warnings.length,
            errors,
            warnings,
        };

        if (isDevelopment && (errors.length || warnings.length)) {
            console.groupCollapsed("Skill dataset validation results");
            if (errors.length) {
                console.error("Validation errors:", errors);
            }
            if (warnings.length) {
                console.warn("Validation warnings:", warnings);
            }
            console.groupEnd();
        }

        return summary;
    }

    function renderSkillOverview(skillTree, datasetValidation, projectMap) {
        const statsContainer = document.getElementById("skills-stats");
        if (statsContainer) {
            const stats = skillTree.stats || {};
            const cards = [
                {
                    label: "Documented Skills",
                    value: stats.totalNodes || 0,
                },
                {
                    label: "Unlocked Skills",
                    value: stats.unlocked || 0,
                },
                {
                    label: "Average Tier",
                    value: stats.averageProficiency ? stats.averageProficiency.toFixed(2) : "0.00",
                },
                {
                    label: "Prerequisite Links",
                    value: stats.prerequisites || 0,
                },
            ];

            statsContainer.innerHTML = cards
                .map((card) => {
                    return `
                        <div class="skills-stat">
                            <span class="stat-number">${card.value}</span>
                            <span class="stat-label">${card.label}</span>
                        </div>
                    `;
                })
                .join("");
            statsContainer.setAttribute("aria-busy", "false");
        }

        updateProfileStat("languages", formatStatValue((skillTree.groupNodes && skillTree.groupNodes.languages && skillTree.groupNodes.languages.length) || 0));
        updateProfileStat("projects", formatStatValue(Object.keys(projectMap || {}).length));
        updateProfileStat("skills", formatStatValue((skillTree.stats && skillTree.stats.totalNodes) || 0));
        updateProfileStat("experience", formatStatValue(Math.max(8, (skillTree.stats && Math.round(skillTree.stats.averageProficiency * 2)) || 0)));

        if (datasetValidation.warningCount > 0) {
            const skillsSection = document.getElementById("skills-section");
            if (skillsSection && !skillsSection.querySelector(".skills-warning")) {
                const warning = document.createElement("div");
                warning.className = "skills-warning";
                warning.setAttribute("role", "status");
                warning.textContent = `Note: ${datasetValidation.warningCount} dataset warning${datasetValidation.warningCount === 1 ? "" : "s"} detected. View console for details.`;
                skillsSection.insertBefore(warning, skillsSection.firstChild);
            }
        }
    }

    function renderSkillCategories(skillTree) {
        const container = document.getElementById("skills-categories");
        if (!container) {
            return;
        }

        const groups = Array.isArray(skillTree.groups) ? skillTree.groups : [];
        if (!groups.length) {
            container.innerHTML = '<div class="skills-placeholder">Skill data is syncing...</div>';
            return;
        }

        container.innerHTML = "";
        const fragment = document.createDocumentFragment();

        groups.forEach((group, index) => {
            const details = document.createElement("details");
            details.className = "skill-category";
            if (index === 0) {
                details.open = true;
            }

            const summary = document.createElement("summary");
            summary.textContent = group.label || group.id;
            details.appendChild(summary);

            if (group.description) {
                const description = document.createElement("p");
                description.textContent = group.description;
                details.appendChild(description);
            }

            if (Array.isArray(group.focus) && group.focus.length) {
                const focus = document.createElement("p");
                focus.className = "category-focus-text";
                focus.textContent = `Focus: ${group.focus.join(", ")}`;
                details.appendChild(focus);
            }

            const groupNodes = (skillTree.groupNodes && skillTree.groupNodes[group.id]) || [];
            if (groupNodes.length) {
                const grid = document.createElement("div");
                grid.className = "skills-grid";

                groupNodes.slice(0, MAX_SKILLS_PER_GROUP).forEach((node) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "skill-chip";
                    button.dataset.skillId = node.id;
                    button.innerHTML = `
                        <span class="chip-label">${node.title}</span>
                        <span class="chip-tier" aria-hidden="true">Tier ${node.prof}/5</span>
                    `;
                    button.addEventListener("click", () => focusSkill(node.id));
                    button.addEventListener("keydown", (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            focusSkill(node.id);
                        }
                    });
                    grid.appendChild(button);
                });

                details.appendChild(grid);

                if (groupNodes.length > MAX_SKILLS_PER_GROUP) {
                    const remainder = document.createElement("div");
                    remainder.className = "skills-placeholder";
                    remainder.textContent = `+ ${groupNodes.length - MAX_SKILLS_PER_GROUP} more documented skills`;
                    details.appendChild(remainder);
                }
            } else {
                const placeholder = document.createElement("div");
                placeholder.className = "skills-placeholder";
                placeholder.textContent = "Skill entries coming soon.";
                details.appendChild(placeholder);
            }

            fragment.appendChild(details);
        });

        container.appendChild(fragment);
        container.setAttribute("aria-busy", "false");
    }

    function initializeSkillGraph(skillTree, relatedPairs, datasetValidation) {
        if (!window.SkillGraph || typeof window.SkillGraph.initialize !== "function") {
            if (isDevelopment) {
                console.warn("SkillGraph module unavailable; radial skill tree will not render.");
            }
            return;
        }

        const controller = window.SkillGraph.initialize({
            skillTree,
            perkData: skillTree.nodes || {},
            nodesDef: skillTree.groupNodes || {},
            groups: skillTree.groups || [],
            relatedPairs,
            datasetValidation,
            isDevelopment,
        });

        if (controller && typeof controller.redraw === "function") {
            window.redrawSkillTree = () => controller.redraw();
        } else {
            window.redrawSkillTree = () => window.SkillGraph.redraw && window.SkillGraph.redraw();
        }

        window.focusSkillInTree = (skillId) => focusSkill(skillId);
    }

    function focusSkill(skillId) {
        if (!skillId || !window.SkillGraph || typeof window.SkillGraph.focusSkill !== "function") {
            return;
        }
        window.SkillGraph.focusSkill(skillId);
        const perksTab = document.querySelector('.nav-tab[data-section="perks"]');
        if (perksTab && !perksTab.classList.contains("active")) {
            perksTab.click();
        }
    }

    function initModal() {
        const modal = document.getElementById("project-modal");
        const modalTitle = document.getElementById("modal-title");
        const modalImage = document.getElementById("modal-project-image");
        const modalDescription = document.getElementById("modal-project-description");
        const modalTechTags = document.getElementById("modal-tech-tags");
        const modalFeaturesList = document.getElementById("modal-features-list");
        const modalDemoLink = document.getElementById("modal-demo-link");
        const modalGithubLink = document.getElementById("modal-github-link");
        const modalClose = modal ? modal.querySelector(".modal-close") : null;

        let lastFocusedElement = null;

        function getFocusableElements() {
            if (!modal) {
                return [];
            }
            return Array.from(
                modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            ).filter((el) => !el.disabled && el.offsetParent !== null);
        }

        function trapFocus(event) {
            if (event.key !== "Tab" || !modal || !modal.classList.contains("active")) {
                return;
            }
            const focusable = getFocusableElements();
            if (!focusable.length) {
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        function openModal(project) {
            if (!project || !modal) {
                return;
            }

            lastFocusedElement = document.activeElement;

            if (modalTitle) {
                modalTitle.textContent = project.title;
            }
            if (modalImage) {
                modalImage.src = project.image;
                modalImage.alt = `${project.title} Screenshot`;
            }
            if (modalDescription) {
                modalDescription.textContent = project.description;
            }
            if (modalTechTags) {
                modalTechTags.innerHTML = "";
                project.technologies.forEach((tech) => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag";
                    tag.textContent = tech;
                    modalTechTags.appendChild(tag);
                });
            }
            if (modalFeaturesList) {
                modalFeaturesList.innerHTML = "";
                project.features.forEach((feature) => {
                    const li = document.createElement("li");
                    li.textContent = feature;
                    modalFeaturesList.appendChild(li);
                });
            }
            if (modalDemoLink) {
                if (project.demoLink) {
                    modalDemoLink.href = project.demoLink;
                    modalDemoLink.style.display = "inline-flex";
                } else {
                    modalDemoLink.style.display = "none";
                }
            }
            if (modalGithubLink) {
                if (project.githubLink) {
                    modalGithubLink.href = project.githubLink;
                    modalGithubLink.style.display = "inline-flex";
                } else {
                    modalGithubLink.style.display = "none";
                }
            }

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", trapFocus);

            window.setTimeout(() => {
                if (modalClose) {
                    modalClose.focus();
                }
            }, 100);
        }

        function closeModal() {
            if (!modal) {
                return;
            }
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
            document.removeEventListener("keydown", trapFocus);
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        }

        if (modalClose) {
            modalClose.addEventListener("click", closeModal);
        }
        if (modal) {
            modal.addEventListener("click", (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal && modal.classList.contains("active")) {
                closeModal();
            }
        });

        return { openModal, closeModal };
    }

    function initProjects(projectMap, openModal) {
        const projectCards = document.querySelectorAll(".project-card");
        if (!projectCards.length) {
            return;
        }

        projectCards.forEach((card) => {
            const projectKey = card.dataset.project;
            const project = projectMap[projectKey];
            if (!project) {
                return;
            }

            const handleOpen = (event) => {
                event.preventDefault();
                openModal(project);
            };

            card.addEventListener("click", handleOpen);
            card.style.cursor = "pointer";
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Open details for ${project.title}`);
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(project);
                }
            });

            if (!card.querySelector(".project-badges")) {
                const badges = document.createElement("div");
                badges.className = "project-badges";

                if (project.demoLink) {
                    const demo = document.createElement("a");
                    demo.href = project.demoLink;
                    demo.className = "badge demo";
                    demo.target = "_blank";
                    demo.rel = "noopener noreferrer";
                    demo.innerHTML = '<span class="badge-icon"><i class="fas fa-rocket"></i></span><span class="badge-text">Demo</span>';
                    demo.addEventListener("click", (event) => event.stopPropagation());
                    badges.appendChild(demo);
                }

                if (project.githubLink) {
                    const code = document.createElement("a");
                    code.href = project.githubLink;
                    code.className = "badge code";
                    code.target = "_blank";
                    code.rel = "noopener noreferrer";
                    code.innerHTML = '<span class="badge-icon">📁</span><span class="badge-text">Code</span>';
                    code.addEventListener("click", (event) => event.stopPropagation());
                    badges.appendChild(code);
                }

                if (badges.children.length) {
                    card.appendChild(badges);
                }
            }

            const thumbnail = card.querySelector(".project-thumb img");
            if (thumbnail) {
                thumbnail.addEventListener("error", () => {
                    if (thumbnail.dataset.fallbackApplied) {
                        return;
                    }
                    thumbnail.dataset.fallbackApplied = "true";
                    thumbnail.classList.add("img-error");
                    thumbnail.src = "images/astro.png";
                });
            }
        });
    }

    function updateProfileStat(name, value) {
        const el = document.querySelector(`[data-profile-stat="${name}"]`);
        if (el) {
            el.textContent = value;
        }
    }

    function formatStatValue(value) {
        if (!Number.isFinite(value)) {
            return "—";
        }
        return value >= STAT_SIGNS_THRESHOLD ? `${value}+` : String(value);
    }
})(window, document);
