/**
 * Navigation Module
 * Handles tab navigation, section switching, and deep-linking
 */

export function initNavigation() {
    const navTabs = document.querySelectorAll(".nav-tab");
    const sections = document.querySelectorAll(".game-section");

    function activateSectionById(sectionId) {
        // expects full id like 'skills-section'
    const name = sectionId?.replace(/-section$/, "") || "profile";
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
            if (name === "perks") {
                if (typeof window.ensureSkillGraphInitialized === "function") {
                    window.ensureSkillGraphInitialized();
                }
                requestAnimationFrame(() => {
                    if (typeof window.redrawSkillTree === "function") {
                        window.redrawSkillTree();
                    } else if (window.SkillGraph && typeof window.SkillGraph.redraw === "function") {
                        window.SkillGraph.redraw();
                    }
                });
            }
        }
    }

    // Tab click handlers
    navTabs.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
            const sectionName = tab.dataset.section;
            if (!sectionName) {
                return;
            }
            e.preventDefault();
            activateSection(sectionName);
        });

        // Keyboard navigation
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
}
