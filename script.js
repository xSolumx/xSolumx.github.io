/**
 * Simple Portfolio JavaScript - Working Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hide');
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }, 2000);

    // Navigation functionality
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.game-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = tab.dataset.section;
            
            // Remove active from all tabs and sections
            navTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            sections.forEach(s => {
                s.classList.remove('active');
                s.setAttribute('hidden', '');
            });
            
            // Add active to clicked tab and corresponding section
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.removeAttribute('hidden');
            }
        });
    });

    // Project data
    const projects = {
        // Mind_Core (AI/ML LLM build)
        'ai-nexus': {
            title: 'Mind_Core',
            image: 'images/imgNexus.png',
            description: 'Personal ML custom LLM build focused on efficient training, fine-tuning and local inference.',
            technologies: ['Python', 'Ollama', 'JAX', 'Flax'],
            features: [
                'Custom tokenizer and training pipeline',
                'Local inference with quantization',
                'Experiment tracking and evaluation'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        // Agricultural Website
        'brain-simulation': {
            title: 'Agricultural Website',
            image: 'images/imgBrain.png',
            description: 'Website for showcasing agricultural products and services with a modern, responsive UI.',
            technologies: ['React', 'Firebase'],
            features: [
                'Product catalog and detail pages',
                'Realtime data with Firebase',
                'Responsive and accessible design'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        // Jewelry Shop
        'tech-hub': {
            title: 'Jewelry Shop',
            image: 'images/imgTech.png',
            description: 'Online store for the advertisement of jewelry products with fast, SEO-friendly pages.',
            technologies: ['Next.js', 'React', 'Firebase'],
            features: [
                'SSR/SSG for performance',
                'Product galleries and filtering',
                'Secure auth and data with Firebase'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        // Custom Game Engine Injection
        'game-engine': {
            title: 'Custom Game Engine Injection',
            image: 'images/imgComp.png',
            description: 'Lightweight C++ injection for adding mods/assets into an existing game engine.',
            technologies: ['C++', 'Lua'],
            features: [
                'Runtime hooking and API exposure',
                'Lua scripting integration',
                'Asset pipeline for rapid iteration'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        // Automation Suite
        'automation-suite': {
            title: 'Automation Suite',
            image: 'images/imgbr.png',
            description: 'Python tools for productivity automation across file, web, and reporting workflows.',
            technologies: ['Python', 'Selenium', 'BeautifulSoup', 'Pandas', 'Schedule', 'SQLite'],
            features: [
                'File organization and cleanup',
                'Scraping and data extraction',
                'Automated reports and notifications'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        // Gaming Portfolio Site
        'portfolio-site': {
            title: 'Gaming Portfolio Site',
            image: 'images/astro.png',
            description: 'Gaming-themed portfolio focused on performance, accessibility, and UX.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PWA'],
            features: [
                'Responsive layout',
                'PWA installability',
                'Smooth animations and transitions'
            ],
            demoLink: 'https://xsolumx.github.io',
            githubLink: 'https://github.com/xSolumx/xSolumx.github.io'
        },
        // Portfolio for an Architect
        'architect-portfolio': {
            title: 'Portfolio for an Architect',
            image: 'images/imgBrain.png',
            description: 'A portfolio site to showcase architectural designs and projects.',
            technologies: ['Next.js', 'React', 'Firebase'],
            features: [
                'Project galleries and details',
                'Content management with Firebase',
                'Optimized images and SEO'
            ],
            githubLink: 'https://github.com/xSolumx'
        }
    };

    // Modal functionality
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-project-image');
    const modalDescription = document.getElementById('modal-project-description');
    const modalTechTags = document.getElementById('modal-tech-tags');
    const modalFeaturesList = document.getElementById('modal-features-list');
    const modalDemoLink = document.getElementById('modal-demo-link');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalClose = document.querySelector('.modal-close');


    function openModal(projectKey) {
        const project = projects[projectKey];
        if (!project) {
            return;
        }

        if (!modal || !modalTitle || !modalImage || !modalDescription || !modalTechTags || !modalFeaturesList) {
            return;
        }

        // Populate modal content
        modalTitle.textContent = project.title;
        modalImage.src = project.image;
        modalImage.alt = `${project.title} Screenshot`;
        modalDescription.textContent = project.description;

        // Clear and populate tech tags
        modalTechTags.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            modalTechTags.appendChild(tag);
        });

        // Clear and populate features
        modalFeaturesList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeaturesList.appendChild(li);
        });

        // Handle demo link
        if (project.demoLink && modalDemoLink) {
            modalDemoLink.href = project.demoLink;
            modalDemoLink.style.display = 'inline-flex';
        } else if (modalDemoLink) {
            modalDemoLink.style.display = 'none';
        }

        // Handle GitHub link
        if (project.githubLink && modalGithubLink) {
            modalGithubLink.href = project.githubLink;
            modalGithubLink.style.display = 'inline-flex';
        } else if (modalGithubLink) {
            modalGithubLink.style.display = 'none';
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Project card click handlers
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const projectKey = card.dataset.project;
        
        card.addEventListener('click', () => {
            openModal(projectKey);
        });
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(projectKey);
            }
        });
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Perk interactions: click to show details in the progress panel
    const perkData = {
        // Core Languages
        'languages-1': {
            title: 'Python Fundamentals',
            category: 'Core Languages',
            description: 'Scripting, data handling and automation for AI/ML and tooling.',
            reward: 'Unlocks data wrangling and automation workflows'
        },
        'languages-2': {
            title: 'JavaScript Fundamentals',
            category: 'Core Languages',
            description: 'Core JS concepts including ES modules, functions, objects, and async.',
            reward: 'Unlocks modern web interactivity and tooling'
        },
        'languages-3': {
            title: 'C# OOP',
            category: 'Core Languages',
            description: 'Object-oriented design, .NET ecosystem, and application architecture.',
            reward: 'Unlocks backend services and tooling in .NET'
        },
        'languages-4': {
            title: 'Java OOP',
            category: 'Core Languages',
            description: 'Strongly-typed OOP, JVM ecosystem, and enterprise patterns.',
            reward: 'Unlocks scalable backend systems on the JVM'
        },
        'languages-5': {
            title: 'C++ Systems Programming',
            category: 'Core Languages',
            description: 'Memory management, performance tuning, and engine-level development.',
            reward: 'Unlocks engine/game modding and high-performance modules'
        },
        // Web & Databases
        'web-1': {
            title: 'HTML & CSS',
            category: 'Web & Databases',
            description: 'Semantic HTML, responsive design, and modern CSS layouts.',
            reward: 'Unlocks clean, accessible UI foundations'
        },
        'web-2': {
            title: 'JavaScript for Web',
            category: 'Web & Databases',
            description: 'DOM APIs, fetch, routing patterns, and client-side performance.',
            reward: 'Unlocks interactive, data-driven UIs'
        },
        'web-3': {
            title: 'React',
            category: 'Web & Databases',
            description: 'Component-driven UIs, hooks, state management, and composition.',
            reward: 'Unlocks scalable SPA development'
        },
        'web-4': {
            title: 'Progressive Web Apps (PWA)',
            category: 'Web & Databases',
            description: 'Service workers, offline caching, installable experiences.',
            reward: 'Unlocks offline-first and installable apps'
        },
        'web-5': {
            title: 'SQL & Databases',
            category: 'Web & Databases',
            description: 'Relational modeling, querying, and performance basics.',
            reward: 'Unlocks robust data persistence and reporting'
        },
        // Tools & Design
        'tools-1': {
            title: 'Git & GitHub',
            category: 'Tools & Design',
            description: 'Branching, PR workflows, and collaboration best practices.',
            reward: 'Unlocks reliable versioning and teamwork'
        },
        'tools-2': {
            title: 'Linux & Dev Environment',
            category: 'Tools & Design',
            description: 'Shell, package managers, and developer environment setup.',
            reward: 'Unlocks efficient development workflows'
        },
        'tools-3': {
            title: 'Photoshop Basics',
            category: 'Tools & Design',
            description: 'Raster editing, asset optimization, and export pipelines.',
            reward: 'Unlocks clean visual assets for apps'
        },
        'tools-4': {
            title: 'Blender Basics',
            category: 'Tools & Design',
            description: 'Modeling, materials, and export formats for 3D assets.',
            reward: 'Unlocks 3D assets for games and visuals'
        },
        'tools-5': {
            title: 'QA & CI',
            category: 'Tools & Design',
            description: 'Testing fundamentals and CI pipelines for reliable releases.',
            reward: 'Unlocks automated quality gates'
        }
    };

    const perkItems = document.querySelectorAll('.perk-item');
    const progressPanel = document.querySelector('.progress-panel');
    const detailsTitle = progressPanel?.querySelector('.progress-details h4');
    const detailsDesc = progressPanel?.querySelector('.progress-details p');
    const rewardSection = progressPanel?.querySelector('.reward-section');
    const progressStatus = progressPanel?.querySelector('.progress-status');
    const progressNumber = progressPanel?.querySelector('.progress-number');
    const progressBar = progressPanel?.querySelector('.progress-svg .progress-bar');

    function getProficiencyFromItem(item) {
        const n = item.querySelector('.perk-number');
        return n ? parseInt(n.textContent || '0', 10) || 0 : 0;
    }

    function setRewardSection(text) {
        if (!rewardSection) return;
        // Ensure inner structure exists
        let label = rewardSection.querySelector('.reward-label');
        let value = rewardSection.querySelector('.reward-text');
        if (!label) {
            label = document.createElement('div');
            label.className = 'reward-label';
            label.textContent = 'REWARD';
            rewardSection.appendChild(label);
        }
        if (!value) {
            value = document.createElement('div');
            value.className = 'reward-text';
            rewardSection.appendChild(value);
        }
        value.textContent = text;
    }

    function updateRing(proficiency) {
        if (!progressBar) return;
        const r = parseFloat(progressBar.getAttribute('r') || '50');
        const circumference = 2 * Math.PI * r;
        // Assume scale 0-3
        const max = 3;
        const ratio = Math.max(0, Math.min(proficiency / max, 1));
        const offset = circumference * (1 - ratio);
        progressBar.setAttribute('stroke-dasharray', `${circumference.toFixed(2)}`);
        progressBar.setAttribute('stroke-dashoffset', `${offset.toFixed(2)}`);
        if (progressNumber) {
            progressNumber.innerHTML = `${proficiency}<span class="progress-total">/${max}</span>`;
        }
    }

    function selectPerk(item) {
        // Clear selection
        perkItems.forEach(pi => pi.classList.remove('selected'));
        item.classList.add('selected');
    }

    function showPerkInPanel(perkKey, item) {
        const data = perkData[perkKey];
        const proficiency = getProficiencyFromItem(item);
        if (!data || !progressPanel) return;

        if (detailsTitle) detailsTitle.textContent = data.title;
        if (detailsDesc) detailsDesc.textContent = data.description;
        setRewardSection(data.reward);
        if (progressStatus) {
            progressStatus.innerHTML = `<span class="current-progress">Proficiency: ${proficiency}</span>`;
        }
        updateRing(proficiency);
    }

    // Wire up events for perk items
    perkItems.forEach((item) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('click', () => {
            const key = item.getAttribute('data-perk') || '';
            selectPerk(item);
            showPerkInPanel(key, item);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const key = item.getAttribute('data-perk') || '';
                selectPerk(item);
                showPerkInPanel(key, item);
            }
        });
    });

    // Initialize panel with first unlocked perk if available
    const firstUnlocked = Array.from(perkItems).find(i => i.classList.contains('unlocked')) || perkItems[0];
    if (firstUnlocked) {
        const key = firstUnlocked.getAttribute('data-perk') || '';
        selectPerk(firstUnlocked);
        showPerkInPanel(key, firstUnlocked);
    }
});
