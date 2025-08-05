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
        'ai-nexus': {
            title: 'AI Nexus',
            image: 'images/imgNexus.png',
            description: 'A comprehensive machine learning platform designed for data scientists and researchers. AI Nexus provides an intuitive interface for building, training, and deploying machine learning models with advanced data visualization and analysis capabilities.',
            technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Flask', 'React', 'PostgreSQL'],
            features: [
                'Interactive data visualization and exploration tools',
                'Automated feature engineering and selection',
                'Support for multiple ML algorithms',
                'Real-time model performance monitoring',
                'Collaborative workspace for team projects'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        'brain-simulation': {
            title: 'Neural Network Simulator',
            image: 'images/imgBrain.png',
            description: 'An interactive educational tool that visualizes how neural networks learn and process information. This simulator allows users to build custom network architectures and observe the training process in real-time.',
            technologies: ['JavaScript', 'WebGL', 'Three.js', 'D3.js', 'HTML5 Canvas'],
            features: [
                'Real-time neural network visualization',
                'Interactive network architecture builder',
                'Step-by-step training process animation',
                'Multiple activation functions and optimizers',
                'Educational tutorials and guided examples'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        'tech-hub': {
            title: 'Tech Hub Platform',
            image: 'images/imgTech.png',
            description: 'A full-stack social platform where tech enthusiasts can showcase their projects, collaborate on ideas, and learn from each other. Features real-time collaboration tools and project galleries.',
            technologies: ['C#', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'React', 'TypeScript', 'SignalR'],
            features: [
                'User profiles with skill showcasing',
                'Project portfolio and collaboration tools',
                'Real-time messaging and video chat',
                'Skill-based project recommendations',
                'Community forums and knowledge sharing'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        'game-engine': {
            title: 'Custom Game Engine',
            image: 'images/imgComp.png',
            description: 'A lightweight, high-performance 2D game engine built from scratch in C++. This engine focuses on simplicity and efficiency, providing essential game development tools.',
            technologies: ['C++', 'OpenGL', 'GLFW', 'OpenAL', 'Box2D', 'CMake'],
            features: [
                'Efficient 2D sprite rendering system',
                'Integrated physics engine with collision detection',
                'Multi-channel audio system with 3D positioning',
                'Scene graph management and entity-component system',
                'Cross-platform compatibility (Windows, Linux, macOS)'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        'automation-suite': {
            title: 'Automation Suite',
            image: 'images/imgbr.png',
            description: 'A comprehensive collection of Python automation tools designed to streamline repetitive tasks and improve productivity. Each tool is designed with a focus on reliability and ease of use.',
            technologies: ['Python', 'Selenium', 'BeautifulSoup', 'Pandas', 'Schedule', 'Tkinter', 'SQLite'],
            features: [
                'Intelligent file organization and cleanup',
                'Web scraping and data extraction tools',
                'System monitoring and health checks',
                'Automated report generation',
                'Email and notification systems'
            ],
            githubLink: 'https://github.com/xSolumx'
        },
        'portfolio-site': {
            title: 'Gaming Portfolio Site',
            image: 'images/astro.png',
            description: 'This modern, gaming-themed portfolio website showcases my development skills and projects. Built with a focus on performance, accessibility, and user experience.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PWA', 'Web Workers'],
            features: [
                'Responsive design for all device sizes',
                'Progressive Web App (PWA) functionality',
                'Smooth animations and transitions',
                'Accessibility-first design approach',
                'Gaming-themed UI with cyberpunk aesthetics'
            ],
            demoLink: 'https://xsolumx.github.io',
            githubLink: 'https://github.com/xSolumx/xSolumx.github.io'
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

    console.log('Modal elements found:', {
        modal: !!modal,
        modalTitle: !!modalTitle,
        modalImage: !!modalImage,
        modalDescription: !!modalDescription,
        modalTechTags: !!modalTechTags,
        modalFeaturesList: !!modalFeaturesList,
        modalDemoLink: !!modalDemoLink,
        modalGithubLink: !!modalGithubLink,
        modalClose: !!modalClose
    });

    function openModal(projectKey) {
        console.log('Opening modal for project:', projectKey);
        const project = projects[projectKey];
        if (!project) {
            console.error('Project not found:', projectKey);
            return;
        }

        // Check if modal elements exist
        if (!modal || !modalTitle || !modalImage || !modalDescription || !modalTechTags || !modalFeaturesList) {
            console.error('Modal elements not found:', {
                modal: !!modal,
                modalTitle: !!modalTitle,
                modalImage: !!modalImage,
                modalDescription: !!modalDescription,
                modalTechTags: !!modalTechTags,
                modalFeaturesList: !!modalFeaturesList
            });
            return;
        }

        console.log('Populating modal with project data:', project.title);

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

        console.log('Showing modal...');
        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible');
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Project card click handlers
    const projectCards = document.querySelectorAll('.project-card');
    console.log('Found project cards:', projectCards.length);
    
    projectCards.forEach((card, index) => {
        const projectKey = card.dataset.project;
        console.log(`Setting up card ${index + 1}: ${projectKey}`);
        
        card.addEventListener('click', () => {
            console.log('Project card clicked:', projectKey);
            openModal(projectKey);
        });
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Project card keyboard activated:', projectKey);
                openModal(projectKey);
            }
        });
    });

    // Test: Add a simple click test to the first project card
    if (projectCards.length > 0) {
        console.log('Adding test click listener to first project card');
        const firstCard = projectCards[0];
        firstCard.addEventListener('click', () => {
            console.log('TEST: First project card was clicked!');
        });
    }

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
    } else {
        console.error('Modal element not found!');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    console.log('Portfolio initialized successfully');

    // Add test button for modal
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Modal';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#00ff88';
    testButton.style.color = '#000';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
        console.log('Test button clicked - opening modal');
        openModal('ai-nexus');
    });
    
    document.body.appendChild(testButton);

    // Add test button to navigate to projects
    const projectsButton = document.createElement('button');
    projectsButton.textContent = 'Go to Projects';
    projectsButton.style.position = 'fixed';
    projectsButton.style.top = '60px';
    projectsButton.style.right = '10px';
    projectsButton.style.zIndex = '9999';
    projectsButton.style.padding = '10px';
    projectsButton.style.backgroundColor = '#ff6b35';
    projectsButton.style.color = '#000';
    projectsButton.style.border = 'none';
    projectsButton.style.borderRadius = '5px';
    projectsButton.style.cursor = 'pointer';
    
    projectsButton.addEventListener('click', () => {
        console.log('Projects button clicked - navigating to projects');
        // Find and click the projects tab
        const projectsTab = document.querySelector('[data-section="projects"]');
        if (projectsTab) {
            projectsTab.click();
        }
    });
    
    document.body.appendChild(projectsButton);
});
