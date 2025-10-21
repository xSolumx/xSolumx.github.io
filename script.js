(function (window, document) {
    "use strict";

    const isDevelopment = false;
    const STORAGE_KEYS = Object.freeze({
        activeSection: "portfolio-active-section",
    });
    const MAX_SKILLS_PER_GROUP = 12;
    const STAT_SIGNS_THRESHOLD = 12;
    const VIEWPORT_BREAKPOINTS = Object.freeze({
        phoneSmall: 480,
        phone: 1024,
        tablet: 1280,
    });

    let skillGraphViewportState = null;
    let skillGraphResizeHandler = null;
    let skillGraphScrollHintCleanup = null;
    let skillGraphZoomState = null;
    let skillGraphInitPayload = null;
    let skillGraphInitialized = false;
    const SKILL_GRAPH_LAYOUT_MAX_RETRIES = 8;
    let skillGraphLayoutRetryCount = 0;
    let skillGraphInitRafId = 0;
    let skillGraphInitTimeoutId = 0;

    function debounce(fn, wait = 200) {
        let timerId = null;
        return function debounced(...args) {
            const context = this;
            window.clearTimeout(timerId);
            timerId = window.setTimeout(() => fn.apply(context, args), wait);
        };
    }

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
        skillGraphInitPayload = {
            skillTree,
            relatedPairs: curatedPairs,
            datasetValidation,
        };

        if (document.getElementById("perks-section")?.classList.contains("active")) {
            ensureSkillGraphInitialized();
        }

        document.querySelectorAll("[data-open-section]").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                const targetSection = trigger.getAttribute("data-open-section");
                if (!targetSection || typeof window.navigateToSection !== "function") {
                    return;
                }
                event.preventDefault();
                window.navigateToSection(targetSection);
            });
        });

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
        const navContainer = document.querySelector(".game-nav");
        const navToggle = document.getElementById("nav-toggle");
        const navList = document.getElementById("main-navigation");
        const navToggleLabel = navToggle
            ? navToggle.querySelector(".nav-toggle-label")
            : null;
        const mobileQuery = typeof window.matchMedia === "function"
            ? window.matchMedia("(max-width: 1024)")
            : null;
        if (!navTabs.length || !sections.length) {
            return;
        }

        const setNavState = (open) => {
            const state = open ? "true" : "false";
            if (navContainer) {
                navContainer.dataset.navOpen = state;
            }
            if (navToggle) {
                navToggle.setAttribute("aria-expanded", state);
            }
            if (navToggleLabel) {
                navToggleLabel.textContent = open ? "Close" : "Menu";
            }
            if (navList) {
                const isMobileMenu = Boolean(mobileQuery && mobileQuery.matches);
                const shouldHide = isMobileMenu && !open;
                if (isMobileMenu) {
                    navList.setAttribute("aria-hidden", shouldHide ? "true" : "false");
                } else {
                    navList.removeAttribute("aria-hidden");
                }
                if (typeof navList.toggleAttribute === "function") {
                    navList.toggleAttribute("inert", shouldHide);
                } else if (shouldHide) {
                    navList.setAttribute("inert", "");
                } else {
                    navList.removeAttribute("inert");
                }
            }
        };

        const collapseNavOnMobile = () => {
            if (mobileQuery && mobileQuery.matches) {
                setNavState(false);
                if (navToggle && typeof navToggle.focus === "function") {
                    navToggle.focus();
                }
            }
        };

        if (navToggle) {
            navToggle.addEventListener("click", () => {
                const willOpen = !navContainer || navContainer.dataset.navOpen !== "true";
                setNavState(willOpen);
            });
        }

        if (navContainer && navToggle) {
            document.addEventListener("click", (event) => {
                if (!mobileQuery || !mobileQuery.matches) {
                    return;
                }
                if (navContainer.dataset.navOpen !== "true") {
                    return;
                }
                if (navContainer.contains(event.target)) {
                    return;
                }
                setNavState(false);
            });
        }

        if (mobileQuery) {
            const handleViewportChange = (event) => {
                if (event.matches) {
                    setNavState(false);
                } else {
                    setNavState(true);
                }
            };

            if (typeof mobileQuery.addEventListener === "function") {
                mobileQuery.addEventListener("change", handleViewportChange);
            } else if (typeof mobileQuery.addListener === "function") {
                mobileQuery.addListener(handleViewportChange);
            }

            if (mobileQuery.matches) {
                setNavState(false);
            } else {
                setNavState(true);
            }
        } else {
            setNavState(true);
        }

        function setActiveSection(name, { updateHash = true, persist = true } = {}) {
            const targetName = name || "profile";

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
                    section.setAttribute("aria-hidden", "false");
                } else {
                    section.setAttribute("hidden", "");
                    section.setAttribute("aria-hidden", "true");
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

            if (targetName === "perks") {
                ensureSkillGraphInitialized();
                window.requestAnimationFrame(() => {
                    if (typeof window.redrawSkillTree === "function") {
                        window.redrawSkillTree();
                    } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                        window.SkillGraph.redraw();
                    }
                });
            }
        }

        window.navigateToSection = (targetName, options = {}) => {
            if (!targetName) {
                return;
            }
            setActiveSection(targetName, options);
        };

        function getInitialSection() {
            const hash = (window.location.hash || "").replace(/^#/, "");
            if (hash && document.getElementById(hash)) {
                return hash.replace(/-section$/, "");
            }
            return "profile";
        }

        navTabs.forEach((tab, index) => {
            tab.addEventListener("click", (event) => {
                const sectionName = tab.dataset.section;
                if (!sectionName) {
                    return;
                }
                event.preventDefault();
                setActiveSection(sectionName);
                collapseNavOnMobile();
            });

            tab.addEventListener("keydown", (event) => {
                if (!tab.dataset.section) {
                    return;
                }
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
                        collapseNavOnMobile();
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

            const fragment = document.createDocumentFragment();
            cards.forEach((card) => {
                const stat = document.createElement("div");
                stat.className = "skills-stat";

                const valueEl = document.createElement("span");
                valueEl.className = "stat-number";
                valueEl.textContent = `${card.value}`;

                const labelEl = document.createElement("span");
                labelEl.className = "stat-label";
                labelEl.textContent = card.label;

                stat.appendChild(valueEl);
                stat.appendChild(labelEl);
                fragment.appendChild(stat);
            });

            statsContainer.replaceChildren(fragment);
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
        container.replaceChildren();

        if (!groups.length) {
            const placeholder = document.createElement("div");
            placeholder.className = "skills-placeholder";
            placeholder.textContent = "Skill data is syncing...";
            container.appendChild(placeholder);
            container.setAttribute("aria-busy", "false");
            return;
        }

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
                    if (node?.id) {
                        button.dataset.skillId = node.id;
                    }

                    const label = document.createElement("span");
                    label.className = "chip-label";
                    label.textContent = node.title || node.id || "Untitled Skill";

                    const tier = document.createElement("span");
                    tier.className = "chip-tier";
                    tier.setAttribute("aria-hidden", "true");
                    const tierScore = Number(node.prof);
                    const tierValue = Number.isFinite(tierScore) ? tierScore : 0;
                    tier.textContent = `Tier ${tierValue}/5`;

                    button.appendChild(label);
                    button.appendChild(tier);
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

    function computeSkillGraphViewportState() {
        const viewportWidth = window.innerWidth
            || document.documentElement.clientWidth
            || (VIEWPORT_BREAKPOINTS.tablet + 1);
        const screenWidth = window.screen && window.screen.width
            ? window.screen.width
            : viewportWidth;
        const effectiveWidth = Math.min(viewportWidth, screenWidth);

        if (effectiveWidth <= VIEWPORT_BREAKPOINTS.phoneSmall) {
            return {
                key: "mobile-xs",
                constants: {
                    NODE_SIZE: 40,
                    MIN_INNER_RADIUS_FACTOR: 0.24,
                    MIN_INNER_ABSOLUTE: 72,
                    OUTER_PADDING: 16,
                    GROUP_GAP_DEG: 18,
                    ANGULAR_SPACING_MULTIPLIER: 1.65,
                    LANE_SPACING_FACTOR: 1.05,
                    TOOLTIP_OFFSET: 12,
                },
            };
        }

        if (effectiveWidth <= VIEWPORT_BREAKPOINTS.phone) {
            return {
                key: "mobile",
                constants: {
                    NODE_SIZE: 46,
                    MIN_INNER_RADIUS_FACTOR: 0.25,
                    MIN_INNER_ABSOLUTE: 82,
                    OUTER_PADDING: 18,
                    GROUP_GAP_DEG: 16,
                    ANGULAR_SPACING_MULTIPLIER: 1.72,
                    LANE_SPACING_FACTOR: 1.15,
                    TOOLTIP_OFFSET: 14,
                },
            };
        }

        if (effectiveWidth <= VIEWPORT_BREAKPOINTS.tablet) {
            return {
                key: "tablet",
                constants: {
                    NODE_SIZE: 54,
                    MIN_INNER_RADIUS_FACTOR: 0.24,
                    MIN_INNER_ABSOLUTE: 96,
                    OUTER_PADDING: 28,
                    GROUP_GAP_DEG: 14,
                    ANGULAR_SPACING_MULTIPLIER: 1.58,
                    LANE_SPACING_FACTOR: 0.9,
                    TOOLTIP_OFFSET: 16,
                },
            };
        }

        return {
            key: "desktop",
            constants: {},
        };
    }

    function applySkillGraphDensityClass(key) {
        const perksSection = document.getElementById("perks-section");
        if (!perksSection) {
            return;
        }
        if (key) {
            perksSection.dataset.skillDensity = key;
        } else if (perksSection.dataset.skillDensity) {
            delete perksSection.dataset.skillDensity;
        }
    }

    function setupSkillGraphZoom({ graphWrapper, graphElement, controller, viewportState, centerGraphViewport }) {
        if (skillGraphZoomState && typeof skillGraphZoomState.cleanup === "function") {
            skillGraphZoomState.cleanup();
            skillGraphZoomState.cleanup = null;
        }

        if (!graphWrapper || !graphElement || !controller) {
            skillGraphZoomState = null;
            return;
        }

        if (!skillGraphZoomState) {
            skillGraphZoomState = {
                scale: 1,
                baseWidth: null,
                baseHeight: null,
                viewportKey: viewportState.key,
                cleanup: null,
            };
        }

        const zoomState = skillGraphZoomState;
        if (zoomState.viewportKey !== viewportState.key) {
            zoomState.scale = 1;
            zoomState.baseWidth = null;
            zoomState.baseHeight = null;
            zoomState.viewportKey = viewportState.key;
        }

        const rect = graphElement.getBoundingClientRect();
        const currentScale = zoomState.scale || 1;
        const fallbackSize = viewportState.key.startsWith("mobile")
            ? Math.max(rect.width, rect.height, 540)
            : Math.max(rect.width, rect.height, 680);

        const measuredWidth = rect.width || fallbackSize;
        const measuredHeight = rect.height || fallbackSize;
        const safeCurrentScale = currentScale > 0 ? currentScale : 1;
        zoomState.baseWidth = measuredWidth / safeCurrentScale;
        zoomState.baseHeight = measuredHeight / safeCurrentScale;
        zoomState.scale = safeCurrentScale;

        graphElement.style.maxWidth = "none";
        graphElement.style.maxHeight = "none";

        const zoomControls = document.getElementById("perk-zoom-controls");
        if (zoomControls) {
            zoomControls.dataset.scale = zoomState.scale.toFixed(2);
        }
        const isMobileDensity = viewportState.key.startsWith("mobile");
        const minScale = isMobileDensity ? 0.55 : 0.75;
        const maxScale = isMobileDensity ? 2.5 : 2.2;

        let redrawScheduled = false;
        let shouldRecentre = false;
        const scheduleScaleUpdate = (recentre = false) => {
            shouldRecentre = shouldRecentre || recentre;
            if (redrawScheduled) {
                return;
            }
            redrawScheduled = true;
            window.requestAnimationFrame(() => {
                redrawScheduled = false;
                if (controller && typeof controller.setScale === "function") {
                    controller.setScale(zoomState.scale);
                } else if (controller && typeof controller.redraw === "function") {
                    controller.redraw();
                } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                    window.SkillGraph.redraw();
                }
                if (shouldRecentre && typeof centerGraphViewport === "function") {
                    centerGraphViewport();
                }
                shouldRecentre = false;
            });
        };

        const clampScale = (value) => Math.min(maxScale, Math.max(minScale, value));
        const getFittedScale = () => {
            if (!graphWrapper || !zoomState.baseWidth) {
                return zoomState.scale;
            }
            const availableWidth = graphWrapper.clientWidth || 0;
            if (!availableWidth) {
                return zoomState.scale;
            }
            const fit = availableWidth / zoomState.baseWidth;
            if (!isFinite(fit) || fit <= 0) {
                return zoomState.scale;
            }
            return clampScale(isMobileDensity ? Math.min(1, fit) : zoomState.scale);
        };

        const applyScale = (value, { immediate = false, preserveViewport = false } = {}) => {
            const next = clampScale(value);
            zoomState.scale = next;
            const widthPx = Math.max(1, zoomState.baseWidth * next);
            const heightPx = Math.max(1, zoomState.baseHeight * next);
            graphWrapper.dataset.zoomScale = next.toFixed(2);
            if (zoomControls) {
                zoomControls.dataset.scale = next.toFixed(2);
            }
            if (immediate) {
                if (controller && typeof controller.setScale === "function") {
                    controller.setScale(next);
                } else if (controller && typeof controller.redraw === "function") {
                    controller.redraw();
                } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                    window.SkillGraph.redraw();
                } else {
                    graphElement.style.width = `${widthPx}px`;
                    graphElement.style.height = `${heightPx}px`;
                }
                if (!preserveViewport && typeof centerGraphViewport === "function") {
                    centerGraphViewport();
                }
            } else {
                if (!(controller && typeof controller.setScale === "function")) {
                    graphElement.style.width = `${widthPx}px`;
                    graphElement.style.height = `${heightPx}px`;
                }
                scheduleScaleUpdate(!preserveViewport);
            }
        };

        const initialScale = clampScale(getFittedScale());
        applyScale(initialScale, { immediate: true, preserveViewport: true });

        let fitObserver = null;
        let pendingFitTimeout = null;

        const ensureGraphFitsWidth = () => {
            if (!isMobileDensity) {
                return;
            }
            const fitted = clampScale(getFittedScale());
            if (Math.abs(fitted - zoomState.scale) > 0.01) {
                applyScale(fitted, { immediate: true, preserveViewport: true });
            }
        };

        if (isMobileDensity) {
            if (graphWrapper.clientWidth) {
                ensureGraphFitsWidth();
            } else if (typeof window.ResizeObserver === "function") {
                fitObserver = new window.ResizeObserver(() => {
                    if (!graphWrapper.clientWidth) {
                        return;
                    }
                    ensureGraphFitsWidth();
                    if (fitObserver) {
                        fitObserver.disconnect();
                        fitObserver = null;
                    }
                });
                fitObserver.observe(graphWrapper);
            } else {
                let fallbackAttempts = 0;
                const tryFitLater = () => {
                    if (!graphWrapper.clientWidth) {
                        if (fallbackAttempts < 6) {
                            fallbackAttempts += 1;
                            if (pendingFitTimeout) {
                                window.clearTimeout(pendingFitTimeout);
                            }
                            pendingFitTimeout = window.setTimeout(tryFitLater, 220);
                        }
                        return;
                    }
                    ensureGraphFitsWidth();
                    if (pendingFitTimeout) {
                        window.clearTimeout(pendingFitTimeout);
                        pendingFitTimeout = null;
                    }
                };
                window.requestAnimationFrame(tryFitLater);
            }
        }

        const activePointers = new Map();
        let pinchStartDistance = null;
        let pinchStartScale = zoomState.scale;
        let lastTapTime = 0;

        const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const resetTapClock = () => {
            lastTapTime = 0;
        };
        const getResetScale = () => clampScale(isMobileDensity ? getFittedScale() : 1);
        const capturePointerIfNeeded = (pointerId, info) => {
            if (!info || info.captured || typeof graphWrapper.setPointerCapture !== "function") {
                return;
            }
            try {
                graphWrapper.setPointerCapture(pointerId);
                info.captured = true;
            } catch (_) {
                info.captured = false;
            }
        };

        const pointerDown = (event) => {
            if (zoomControls && zoomControls.contains(event.target)) {
                return;
            }
            const isTouchLike = event.pointerType === "touch" || event.pointerType === "pen";
            const isPrimaryMouse = event.pointerType === "mouse" && event.button === 0;
            if (!isTouchLike && !isPrimaryMouse) {
                return;
            }
            const pointerTarget = event.target;
            const isInteractiveTarget = Boolean(
                pointerTarget
                && pointerTarget.closest(".perk-node, .perk-center")
            );
            const pointerInfo = {
                x: event.clientX,
                y: event.clientY,
                prevX: event.clientX,
                prevY: event.clientY,
                initialX: event.clientX,
                initialY: event.clientY,
                allowClick: isInteractiveTarget,
            };
            pointerInfo.captured = false;
            if (!pointerInfo.allowClick) {
                capturePointerIfNeeded(event.pointerId, pointerInfo);
            }
            activePointers.set(event.pointerId, pointerInfo);
            if (activePointers.size === 1) {
                pinchStartDistance = null;
                pinchStartScale = zoomState.scale;
            } else if (activePointers.size === 2) {
                activePointers.forEach((meta, id) => {
                    meta.allowClick = false;
                    capturePointerIfNeeded(id, meta);
                });
                const points = Array.from(activePointers.values());
                pinchStartDistance = getDistance(points[0], points[1]) || 1;
                pinchStartScale = zoomState.scale;
            }
            if (!pointerInfo.allowClick) {
                graphWrapper.classList.add("is-interacting");
                event.preventDefault();
            }
        };

        const pointerMove = (event) => {
            if (!activePointers.has(event.pointerId)) {
                return;
            }
            const pointerInfo = activePointers.get(event.pointerId);
            const nextPoint = { x: event.clientX, y: event.clientY };
            const deltaFromStartX = nextPoint.x - pointerInfo.initialX;
            const deltaFromStartY = nextPoint.y - pointerInfo.initialY;
            const dragThreshold = 6;
            let handled = false;

            if (
                pointerInfo.allowClick
                && (Math.abs(deltaFromStartX) > dragThreshold || Math.abs(deltaFromStartY) > dragThreshold)
            ) {
                pointerInfo.allowClick = false;
                capturePointerIfNeeded(event.pointerId, pointerInfo);
            }

            pointerInfo.x = nextPoint.x;
            pointerInfo.y = nextPoint.y;

            if (activePointers.size === 1 && !pointerInfo.allowClick) {
                const deltaX = nextPoint.x - pointerInfo.prevX;
                const deltaY = nextPoint.y - pointerInfo.prevY;
                graphWrapper.scrollLeft -= deltaX;
                graphWrapper.scrollTop -= deltaY;
                handled = true;
            } else if (activePointers.size === 2) {
                const points = Array.from(activePointers.entries());
                points.forEach(([id, meta]) => {
                    meta.allowClick = false;
                    capturePointerIfNeeded(id, meta);
                });
                const distance = getDistance(points[0][1], points[1][1]);
                if (!pinchStartDistance) {
                    pinchStartDistance = distance || 1;
                    pinchStartScale = zoomState.scale;
                }
                if (distance > 0 && pinchStartDistance) {
                    const ratio = distance / pinchStartDistance;
                    applyScale(pinchStartScale * ratio, { preserveViewport: true });
                    handled = true;
                }
            }

            pointerInfo.prevX = nextPoint.x;
            pointerInfo.prevY = nextPoint.y;

            if (handled) {
                graphWrapper.classList.add("is-interacting");
                event.preventDefault();
            }
        };

        const pointerUp = (event) => {
            if (!activePointers.has(event.pointerId)) {
                return;
            }
            const pointerInfo = activePointers.get(event.pointerId);
            const shouldAllowClick = pointerInfo ? pointerInfo.allowClick : false;

            if (pointerInfo && pointerInfo.captured) {
                if (typeof graphWrapper.hasPointerCapture === "function") {
                    if (graphWrapper.hasPointerCapture(event.pointerId)) {
                        graphWrapper.releasePointerCapture(event.pointerId);
                    }
                } else {
                    try {
                        graphWrapper.releasePointerCapture(event.pointerId);
                    } catch (_) {
                        /* ignore */
                    }
                }
            }
            activePointers.delete(event.pointerId);

            if (activePointers.size === 0) {
                graphWrapper.classList.remove("is-interacting");
                pinchStartDistance = null;
                pinchStartScale = zoomState.scale;
                if (event.pointerType === "touch" && !shouldAllowClick) {
                    const now = Date.now();
                    if (now - lastTapTime < 320) {
                        applyScale(getResetScale(), { immediate: true, preserveViewport: true });
                        resetTapClock();
                    } else {
                        lastTapTime = now;
                    }
                } else if (event.pointerType === "touch" && shouldAllowClick) {
                    resetTapClock();
                }
            } else if (activePointers.size === 1) {
                pinchStartDistance = null;
                pinchStartScale = zoomState.scale;
            }

            if (!shouldAllowClick) {
                event.preventDefault();
            }
        };

        const wheelHandler = (event) => {
            if (!event.ctrlKey) {
                return;
            }
            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.12 : 0.12;
            applyScale(zoomState.scale + delta, { preserveViewport: true });
        };

        const handleZoomControl = (event) => {
            const trigger = event.target.closest("[data-zoom]");
            if (!trigger) {
                return;
            }
            event.preventDefault();
            switch (trigger.dataset.zoom) {
                case "in":
                    applyScale(zoomState.scale + 0.15);
                    break;
                case "out":
                    applyScale(zoomState.scale - 0.15);
                    break;
                case "reset":
                    applyScale(getResetScale(), { immediate: true, preserveViewport: true });
                    break;
                default:
                    break;
            }
        };

        const handleZoomKeydown = (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }
            const trigger = event.target.closest("[data-zoom]");
            if (!trigger) {
                return;
            }
            event.preventDefault();
            trigger.click();
        };

        graphWrapper.addEventListener("pointerdown", pointerDown);
        graphWrapper.addEventListener("pointermove", pointerMove);
        graphWrapper.addEventListener("pointerup", pointerUp);
        graphWrapper.addEventListener("pointercancel", pointerUp);
        graphWrapper.addEventListener("lostpointercapture", pointerUp);
        graphWrapper.addEventListener("wheel", wheelHandler, { passive: false });

        if (zoomControls) {
            zoomControls.addEventListener("click", handleZoomControl);
            zoomControls.addEventListener("keydown", handleZoomKeydown);
        }

        zoomState.cleanup = () => {
            graphWrapper.classList.remove("is-interacting");
            activePointers.clear();
            graphWrapper.removeEventListener("pointerdown", pointerDown);
            graphWrapper.removeEventListener("pointermove", pointerMove);
            graphWrapper.removeEventListener("pointerup", pointerUp);
            graphWrapper.removeEventListener("pointercancel", pointerUp);
            graphWrapper.removeEventListener("lostpointercapture", pointerUp);
            graphWrapper.removeEventListener("wheel", wheelHandler);
            if (fitObserver) {
                fitObserver.disconnect();
                fitObserver = null;
            }
            if (pendingFitTimeout) {
                window.clearTimeout(pendingFitTimeout);
                pendingFitTimeout = null;
            }
            if (zoomControls) {
                zoomControls.removeEventListener("click", handleZoomControl);
                zoomControls.removeEventListener("keydown", handleZoomKeydown);
            }
        };
    }

    function cancelPendingSkillGraphInit() {
        if (skillGraphInitRafId) {
            window.cancelAnimationFrame(skillGraphInitRafId);
            skillGraphInitRafId = 0;
        }
        if (skillGraphInitTimeoutId) {
            window.clearTimeout(skillGraphInitTimeoutId);
            skillGraphInitTimeoutId = 0;
        }
    }

    function scheduleSkillGraphInitializationRetry() {
        cancelPendingSkillGraphInit();
        const useTimeout = skillGraphLayoutRetryCount > 2;
        if (useTimeout) {
            skillGraphInitTimeoutId = window.setTimeout(() => {
                skillGraphInitTimeoutId = 0;
                ensureSkillGraphInitialized();
            }, 50);
        } else {
            skillGraphInitRafId = window.requestAnimationFrame(() => {
                skillGraphInitRafId = 0;
                ensureSkillGraphInitialized();
            });
        }
    }

    function ensureSkillGraphInitialized() {
        if (skillGraphInitialized) {
            return true;
        }
        if (!skillGraphInitPayload) {
            return false;
        }

        const graphEl = document.getElementById("perk-graph");
        if (!graphEl) {
            return false;
        }

        const bounds = graphEl.getBoundingClientRect();
        const hasSize = bounds.width > 0 && bounds.height > 0;
        if (!hasSize) {
            if (skillGraphLayoutRetryCount < SKILL_GRAPH_LAYOUT_MAX_RETRIES) {
                skillGraphLayoutRetryCount += 1;
            }
            scheduleSkillGraphInitializationRetry();
            return false;
        }

        skillGraphLayoutRetryCount = 0;

        cancelPendingSkillGraphInit();
        const { skillTree, relatedPairs, datasetValidation } = skillGraphInitPayload;
        initializeSkillGraph(skillTree, relatedPairs, datasetValidation);
        return skillGraphInitialized;
    }

    window.ensureSkillGraphInitialized = ensureSkillGraphInitialized;

    function initializeSkillGraph(skillTree, relatedPairs, datasetValidation) {
        cancelPendingSkillGraphInit();
        skillGraphLayoutRetryCount = 0;

        if (!window.SkillGraph || typeof window.SkillGraph.initialize !== "function") {
            console.error("SkillGraph library not found or is invalid.");
            const perksSection = document.getElementById("perks-section");
            if (perksSection) {
                perksSection.innerHTML = `<div class="error-message">Error: Skill Tree component failed to load.</div>`;
            }
            skillGraphInitialized = false;
            return;
        }

        skillGraphInitPayload = {
            skillTree,
            relatedPairs,
            datasetValidation,
        };

        if (skillGraphResizeHandler) {
            window.removeEventListener("resize", skillGraphResizeHandler);
            skillGraphResizeHandler = null;
        }

        if (skillGraphScrollHintCleanup) {
            skillGraphScrollHintCleanup();
            skillGraphScrollHintCleanup = null;
        }

        // Cache the initial viewport state
        skillGraphViewportState = computeSkillGraphViewportState();
        applySkillGraphDensityClass(skillGraphViewportState.key);

        const controller = window.SkillGraph.initialize({
            skillTree,
            perkData: skillTree.nodes || {},
            nodesDef: skillTree.groupNodes || {},
            groups: skillTree.groups || [],
            relatedPairs,
            datasetValidation,
            isDevelopment,
            constants: skillGraphViewportState.constants,
        });

        let centerGraphViewport = () => {};

        if (!controller || typeof controller.redraw !== "function") {
            console.error("SkillGraph controller is invalid or missing a redraw method.");
            const graphElement = document.getElementById("perk-graph");
            if (graphElement) {
                graphElement.innerHTML = `<div class="error-message">Could not render skill tree.</div>`;
            }
            skillGraphInitialized = false;
            return;
        }

        skillGraphInitialized = true;

        window.focusSkillInTree = (skillId) => focusSkill(skillId);

        const graphWrapper = document.getElementById("perk-graph-wrapper");
        const scrollHint = document.getElementById("perk-scroll-hint");
        const nodesLayer = document.getElementById("perk-nodes");
        const graphElement = document.getElementById("perk-graph");

        centerGraphViewport = () => {
            if (!graphWrapper) {
                return;
            }
            window.requestAnimationFrame(() => {
                const maxScrollLeft = Math.max(0, graphWrapper.scrollWidth - graphWrapper.clientWidth);
                const maxScrollTop = Math.max(0, graphWrapper.scrollHeight - graphWrapper.clientHeight);
                const targetLeft = maxScrollLeft > 0 ? maxScrollLeft / 2 : 0;
                const targetTop = 0;
                if (Math.abs(graphWrapper.scrollLeft - targetLeft) > 1) {
                    graphWrapper.scrollLeft = targetLeft;
                }
                if (Math.abs(graphWrapper.scrollTop - targetTop) > 1) {
                    graphWrapper.scrollTop = targetTop;
                }
            });
        };

        window.redrawSkillTree = () => {
            if (controller && typeof controller.redraw === "function") {
                controller.redraw();
                if (controller && typeof controller.setScale === "function" && skillGraphZoomState) {
                    controller.setScale(skillGraphZoomState.scale || 1);
                }
                centerGraphViewport();
            } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                window.SkillGraph.redraw();
                centerGraphViewport();
            }
        };

        if (graphWrapper && scrollHint) {
            const hasOverflow = graphWrapper.scrollWidth > graphWrapper.clientWidth
                || graphWrapper.scrollHeight > graphWrapper.clientHeight;
            const shouldShowHint = skillGraphViewportState.key.startsWith("mobile") && hasOverflow;
            scrollHint.classList.toggle("is-visible", shouldShowHint);
            scrollHint.classList.toggle("is-hidden", !shouldShowHint);
            scrollHint.setAttribute("aria-hidden", shouldShowHint ? "false" : "true");

            if (shouldShowHint) {
                let hintDismissed = false;
                const handleInteraction = () => {
                    if (hintDismissed) {
                        return;
                    }
                    hintDismissed = true;
                    scrollHint.classList.add("is-hidden");
                    scrollHint.classList.remove("is-visible");
                    scrollHint.setAttribute("aria-hidden", "true");
                    if (skillGraphScrollHintCleanup) {
                        skillGraphScrollHintCleanup();
                        skillGraphScrollHintCleanup = null;
                    }
                };

                const interactionNotifier = () => {
                    window.requestAnimationFrame(handleInteraction);
                };

                graphWrapper.addEventListener("scroll", interactionNotifier, { passive: true });
                graphWrapper.addEventListener("pointerdown", interactionNotifier, { passive: true });
                graphWrapper.addEventListener("touchstart", interactionNotifier, { passive: true });

                if (nodesLayer) {
                    nodesLayer.addEventListener("click", interactionNotifier);
                    nodesLayer.addEventListener("focusin", interactionNotifier);
                }

                skillGraphScrollHintCleanup = () => {
                    graphWrapper.removeEventListener("scroll", interactionNotifier);
                    graphWrapper.removeEventListener("pointerdown", interactionNotifier);
                    graphWrapper.removeEventListener("touchstart", interactionNotifier);
                    if (nodesLayer) {
                        nodesLayer.removeEventListener("click", interactionNotifier);
                        nodesLayer.removeEventListener("focusin", interactionNotifier);
                    }
                };
            } else {
                skillGraphScrollHintCleanup = null;
            }
        }

        setupSkillGraphZoom({
            graphWrapper,
            graphElement,
            controller,
            viewportState: skillGraphViewportState,
            centerGraphViewport,
        });

        centerGraphViewport();

        const debouncedResize = debounce(() => {
            const nextState = computeSkillGraphViewportState();
            const previousKey = skillGraphViewportState ? skillGraphViewportState.key : null;
            skillGraphViewportState = nextState;
            applySkillGraphDensityClass(nextState.key);
            if (!previousKey || nextState.key !== previousKey) {
                initializeSkillGraph(skillTree, relatedPairs, datasetValidation);
                return;
            }

            if (controller && typeof controller.redraw === "function") {
                controller.redraw();
                if (controller && typeof controller.setScale === "function" && skillGraphZoomState) {
                    controller.setScale(skillGraphZoomState.scale || 1);
                }
                centerGraphViewport();
            } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                window.SkillGraph.redraw();
                centerGraphViewport();
            }
        }, 250);

        window.addEventListener("resize", debouncedResize);
        skillGraphResizeHandler = debouncedResize;
    }

    function focusSkill(skillId) {
        ensureSkillGraphInitialized();
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

            const projectTitle = project.title || "Project";
            const projectImage = project.image || "images/astro.png";
            const technologies = Array.isArray(project.technologies) ? project.technologies : [];
            const features = Array.isArray(project.features) ? project.features : [];

            if (modalTitle) {
                modalTitle.textContent = projectTitle;
            }
            if (modalImage) {
                modalImage.src = projectImage;
                modalImage.alt = `${projectTitle} Screenshot`;
            }
            if (modalDescription) {
                modalDescription.textContent = project.description || "Details coming soon.";
            }
            if (modalTechTags) {
                modalTechTags.innerHTML = "";
                technologies.forEach((tech) => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag";
                    tag.textContent = tech;
                    modalTechTags.appendChild(tag);
                });
            }
            if (modalFeaturesList) {
                modalFeaturesList.innerHTML = "";
                features.forEach((feature) => {
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
        if (typeof openModal !== "function") {
            return;
        }
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
            card.setAttribute("aria-label", `Open details for ${project.title || projectKey}`);
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
                    const demoIcon = document.createElement("span");
                    demoIcon.className = "badge-icon";
                    demoIcon.setAttribute("aria-hidden", "true");
                    const rocket = document.createElement("i");
                    rocket.classList.add("fas", "fa-rocket");
                    rocket.setAttribute("aria-hidden", "true");
                    demoIcon.appendChild(rocket);
                    const demoLabel = document.createElement("span");
                    demoLabel.className = "badge-text";
                    demoLabel.textContent = "Demo";
                    demo.appendChild(demoIcon);
                    demo.appendChild(demoLabel);
                    demo.addEventListener("click", (event) => event.stopPropagation());
                    badges.appendChild(demo);
                }

                if (project.githubLink) {
                    const code = document.createElement("a");
                    code.href = project.githubLink;
                    code.className = "badge code";
                    code.target = "_blank";
                    code.rel = "noopener noreferrer";
                    const codeIcon = document.createElement("span");
                    codeIcon.className = "badge-icon";
                    codeIcon.setAttribute("aria-hidden", "true");
                    codeIcon.textContent = "📁";
                    const codeLabel = document.createElement("span");
                    codeLabel.className = "badge-text";
                    codeLabel.textContent = "Code";
                    code.appendChild(codeIcon);
                    code.appendChild(codeLabel);
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
