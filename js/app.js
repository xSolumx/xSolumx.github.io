/**
 * Main Application Entry Point
 * Initializes all modules and handles loading screen
 */

// Development mode flag - set to false for production
const isDevelopment = false;

import { initNavigation } from './js/navigation.js';
import { initModal } from './js/modal.js';
import { initProjects } from './js/projects.js';

document.addEventListener("DOMContentLoaded", function () {
    // Loading screen management
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

    // Initialize modules
    try {
        initNavigation();
        const { openModal } = initModal();
        initProjects(openModal);

        // Skill tree initialization is in the main script.js for now
        // Will be refactored in a future update
        
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoadingScreen();
        
        // Show error message to user
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef476f;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: sans-serif;
        `;
        errorMsg.textContent = 'An error occurred loading the portfolio. Please refresh the page.';
        document.body.appendChild(errorMsg);
    }

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    if (isDevelopment) {
                        console.log('Service Worker registered:', registration.scope);
                    }

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, show update notification
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    if (isDevelopment) {
                        console.error('Service Worker registration failed:', error);
                    }
                });
        });
    }

    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ffa2, #00d4aa);
            color: #0a0a0a;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: sans-serif;
            box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
            display: flex;
            gap: 1rem;
            align-items: center;
        `;
        notification.innerHTML = `
            <span>A new version is available!</span>
            <button style="
                background: #0a0a0a;
                color: #00ffa2;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            ">Update</button>
        `;
        
        const updateBtn = notification.querySelector('button');
        updateBtn.addEventListener('click', () => {
            window.location.reload();
        });
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }

    // Add analytics events for user interactions
    if (typeof gtag === 'function') {
        // Track section views
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                gtag('event', 'view_section', {
                    'event_category': 'navigation',
                    'event_label': tab.dataset.section
                });
            });
        });

        // Track project views
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                gtag('event', 'view_project', {
                    'event_category': 'projects',
                    'event_label': card.dataset.project
                });
            });
        });

        // Track external link clicks
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', () => {
                gtag('event', 'click_external_link', {
                    'event_category': 'engagement',
                    'event_label': link.href
                });
            });
        });
    }
});
