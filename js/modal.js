/**
 * Modal Module
 * Handles project modal functionality with focus trap
 */

export function initModal() {
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-project-image");
    const modalDescription = document.getElementById("modal-project-description");
    const modalTechTags = document.getElementById("modal-tech-tags");
    const modalFeaturesList = document.getElementById("modal-features-list");
    const modalDemoLink = document.getElementById("modal-demo-link");
    const modalGithubLink = document.getElementById("modal-github-link");
    const modalClose = document.querySelector(".modal-close");

    let lastFocusedElement = null;
    let focusableElements = [];

    function getFocusableElements() {
        if (!modal) return [];
        return Array.from(
            modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.disabled && el.offsetParent !== null);
    }

    function trapFocus(e) {
        if (e.key !== 'Tab' || !modal.classList.contains('active')) return;

        focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    function openModal(project) {
        if (!project || !modal) return;

        // Store last focused element
        lastFocusedElement = document.activeElement;

        // Populate modal content
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalImage) {
            modalImage.src = project.image;
            modalImage.alt = `${project.title} Screenshot`;
        }
        if (modalDescription) modalDescription.textContent = project.description;

        // Clear and populate tech tags
        if (modalTechTags) {
            modalTechTags.innerHTML = "";
            project.technologies.forEach((tech) => {
                const tag = document.createElement("span");
                tag.className = "tech-tag";
                tag.textContent = tech;
                modalTechTags.appendChild(tag);
            });
        }

        // Clear and populate features
        if (modalFeaturesList) {
            modalFeaturesList.innerHTML = "";
            project.features.forEach((feature) => {
                const li = document.createElement("li");
                li.textContent = feature;
                modalFeaturesList.appendChild(li);
            });
        }

        // Handle demo link
        if (modalDemoLink) {
            if (project.demoLink) {
                modalDemoLink.href = project.demoLink;
                modalDemoLink.style.display = "inline-flex";
            } else {
                modalDemoLink.style.display = "none";
            }
        }

        // Handle GitHub link
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

        // Set focus trap
        document.addEventListener('keydown', trapFocus);
        
        // Focus close button
        setTimeout(() => {
            if (modalClose) modalClose.focus();
        }, 100);
    }

    function closeModal() {
        if (!modal) return;
        
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Remove focus trap
        document.removeEventListener('keydown', trapFocus);

        // Restore focus
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    // Close handlers
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

    // Escape key handler
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("active")) {
            closeModal();
        }
    });

    return { openModal, closeModal };
}
