# GitHub Copilot Instructions

This document provides guidance for AI agents working on this portfolio website.

## Architecture Overview

This is a vanilla HTML, CSS, and JavaScript single-page application. There are no build steps or package management.

-   `index.html`: The main entry point containing the structure for all UI components, including navigation, content sections, and a project modal.
-   `style.css`: Contains all styles. It uses CSS variables for theming and layout, particularly for the skill tree.
-   `script.js`: The core of the application. It manages all dynamic behavior.
-   `skill-tree-data.js`: A static database containing all the data for the "Perks" skill tree.

## Key Components & Data Flow

### 1. Project Showcase

-   The "Projects" tab displays a grid of project cards.
-   Project data is hardcoded as a JavaScript object named `projects` inside `script.js`.
-   Clicking a project card opens a modal (`#project-modal`) which is populated with data from the `projects` object.
-   To add or modify a project, you must edit the `projects` object in `script.js`.

### 2. Interactive Skill Tree ("Perks")

This is the most complex feature of the application.

-   **Data Source**: The skill tree's structure and content are defined entirely within `skill-tree-data.js`. This file populates a global `window.skillTreeData` object.
    -   `skillTreeData.nodes`: A key-value store of all skills (perks). The key is a unique ID (e.g., `languages-1`), and the value contains metadata like `label`, `description`, and `prof` (proficiency).
    -   `skillTreeData.groupNodes`: Defines which skills belong to which category and in what order.
    -   `skillTreeData.groups`: Defines the skill categories themselves (e.g., "Core Languages").

-   **Rendering**: The graph is rendered dynamically in the browser by `script.js`.
    -   The `buildNodes()` function is the heart of the visualization. It reads from `window.skillTreeData` and calculates the position of each node in a circular, multi-ring layout using trigonometry. It creates and positions DOM elements for each node.
    -   SVG is used to draw the connecting lines between nodes.
    -   The layout is responsive and adapts to the number of nodes and groups.

-   **Interactivity**:
    -   `wireNodes()` attaches event listeners to the skill nodes.
    -   `showPerk()` is called on hover/click to display the selected skill's details in the side panel.

## Development Workflow

-   To run the website locally, serve the root directory with a static file server.
    ```bash
    npx serve .
    ```
-   There is no build process. Changes to the HTML, CSS, or JavaScript files are reflected immediately upon browser refresh.

## Coding Conventions

-   The codebase is written in vanilla JavaScript (ES6+).
-   DOM manipulation is done directly (e.g., `document.getElementById`, `element.classList.add`). There are no frameworks like React or Vue.
-   The skill tree visualization is a custom implementation. When modifying it, pay close attention to the `buildNodes()` function in `script.js` as it contains all the layout and positioning logic. Changes to `skill-tree-data.js` will alter the content and structure of the graph.
