/**
 * Simplified radial skill graph renderer.
 * Provides a small API compatible with the legacy implementation while
 * keeping the layout and interaction logic easy to reason about.
 */
(function skillGraphModule(window, document) {
  "use strict";

  if (!window || !document) {
    return;
  }

  const DEFAULT_SELECTORS = Object.freeze({
    graphRoot: "#perk-graph",
    nodesLayer: "#perk-nodes",
    linksLayer: "#perk-links",
    centerNode: "#perk-center",
    progressPanel: ".progress-panel",
  });

  const DEFAULT_LAYOUT_CONSTANTS = Object.freeze({
    RING_COUNT: 5,
    MIN_INNER_RADIUS_FACTOR: 0.18,
    MIN_INNER_ABSOLUTE: 64,
    OUTER_PADDING: 70,
    GROUP_GAP_DEG: 13,
    NODE_SIZE: 56,
    TOOLTIP_OFFSET: 16,
    ANGULAR_SPACING_MULTIPLIER: 66,
    LANE_SPACING_FACTOR: 0.8, // 1/3
  });

  let activeController = null;

  function initialize(options = {}) {
    if (activeController && typeof activeController.dispose === "function") {
      activeController.dispose();
    }

    const controller = createController(options);
    activeController = controller;
    return controller;
  }

  function createController(options) {
    const selectors = { ...DEFAULT_SELECTORS, ...(options.selectors || {}) };
    const layoutConstants = Object.freeze({
      ...DEFAULT_LAYOUT_CONSTANTS,
      ...(options.constants || {}),
    });

    const graphEl = document.querySelector(selectors.graphRoot);
    const nodesContainer = document.querySelector(selectors.nodesLayer);
    const linksSvg = document.querySelector(selectors.linksLayer);
    const centerEl = document.querySelector(selectors.centerNode);

    if (!graphEl || !nodesContainer || !linksSvg || !centerEl) {
      console.warn("SkillGraph: required DOM nodes not found. The skill tree cannot render.");
      return null;
    }

    const progressPanel = document.querySelector(selectors.progressPanel);
    const skillTree = options.skillTree || {};
    const perkData = options.perkData || skillTree.nodes || {};
    const nodesDef = options.nodesDef || skillTree.groupNodes || {};
    const groups = Array.isArray(options.groups) && options.groups.length
      ? options.groups
      : skillTree.groups || [];
    const relatedPairs = Array.isArray(options.relatedPairs) ? options.relatedPairs : [];
    const datasetValidation = options.datasetValidation || null;
    const isDevelopment = Boolean(options.isDevelopment);

    const relatedMap = (() => {
      const map = new Map();
      relatedPairs.forEach(([from, to]) => {
        if (!map.has(from)) {
          map.set(from, new Set());
        }
        if (!map.has(to)) {
          map.set(to, new Set());
        }
        map.get(from).add(to);
        map.get(to).add(from);
      });
      return map;
    })();

    const state = {
      selectors,
      layoutConstants,
      graphEl,
      nodesContainer,
      linksSvg,
      centerEl,
      progressPanel,
      skillTree,
      perkData,
      nodesDef,
      groups,
      relatedPairs,
      datasetValidation,
      isDevelopment,
      nodePositions: {},
      nodeMeta: {},
  prereqMap: {},
  dependentMap: {},
  relatedMap,
      groupAngles: {},
      disposeHandlers: [],
      tooltipEl: null,
      lastBounds: { width: 0, height: 0 },
      svgLayers: { related: null, prereqs: null },
      hoverPerkId: null,
      activePerkId: null,
    };

    const controller = buildController(state);
    controller.redraw();
    if (typeof controller.clearSelection === "function") {
      controller.clearSelection();
    }
    controller.enableResizeHandling();
    return controller;
  }

  function buildController(state) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const {
      layoutConstants,
      graphEl,
      nodesContainer,
      linksSvg,
      centerEl,
      progressPanel,
      groups,
      nodesDef,
      perkData,
      relatedPairs,
    } = state;

    const RELATED_VISIBLE_CLASS = "is-visible";

    const ringCount = Math.max(3, Number(layoutConstants.RING_COUNT) || 5);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const floatingPanelQuery = typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 768px)")
      : null;

    const applyPanelState = (isActive) => {
      if (!progressPanel) {
        return;
      }
      const active = Boolean(isActive);
      progressPanel.classList.toggle("is-active", active);
      progressPanel.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) {
        progressPanel.removeAttribute("inert");
        progressPanel.style.opacity = "1";
        progressPanel.style.visibility = "visible";
        progressPanel.style.transform = "translateY(0)";
        progressPanel.style.pointerEvents = "auto";
      } else {
        progressPanel.setAttribute("inert", "");
        progressPanel.style.opacity = "0";
        progressPanel.style.visibility = "hidden";
        progressPanel.style.transform = "translateY(24px)";
        progressPanel.style.pointerEvents = "none";
      }
    };

    applyPanelState(Boolean(state.activePerkId));

    if (floatingPanelQuery) {
      const handlePanelQueryChange = () => applyPanelState(Boolean(state.activePerkId));
      if (typeof floatingPanelQuery.addEventListener === "function") {
        floatingPanelQuery.addEventListener("change", handlePanelQueryChange);
        state.disposeHandlers.push(() => floatingPanelQuery.removeEventListener("change", handlePanelQueryChange));
      } else if (typeof floatingPanelQuery.addListener === "function") {
        floatingPanelQuery.addListener(handlePanelQueryChange);
        state.disposeHandlers.push(() => floatingPanelQuery.removeListener(handlePanelQueryChange));
      }
    }

    const detailsTitle = progressPanel?.querySelector(".progress-details h4") || null;
    const detailsDesc = progressPanel?.querySelector(".progress-details p") || null;
    const rewardSection = progressPanel?.querySelector(".reward-section") || null;
    const progressStatus = progressPanel?.querySelector(".progress-status") || null;
    const progressNumber = progressPanel?.querySelector(".progress-number") || null;
    const progressBar = progressPanel?.querySelector(".progress-svg .progress-bar") || null;

    function ensureSvgLayers() {
      linksSvg.innerHTML = "";
      state.svgLayers.related = document.createElementNS(SVG_NS, "g");
      state.svgLayers.related.setAttribute("id", "skill-related-links");
      state.svgLayers.prereqs = document.createElementNS(SVG_NS, "g");
      state.svgLayers.prereqs.setAttribute("id", "skill-prereq-links");
      linksSvg.appendChild(state.svgLayers.related);
      linksSvg.appendChild(state.svgLayers.prereqs);
    }

    function getTooltip() {
      if (state.tooltipEl) {
        return state.tooltipEl;
      }
      const tooltip = document.createElement("div");
      tooltip.className = "perk-tooltip";
      tooltip.style.display = "none";
      tooltip.setAttribute("role", "dialog");
      tooltip.setAttribute("aria-hidden", "true");
      document.body.appendChild(tooltip);
      state.tooltipEl = tooltip;
      return tooltip;
    }

    function hideTooltip() {
      if (state.tooltipEl) {
        state.tooltipEl.style.display = "none";
        state.tooltipEl.setAttribute("aria-hidden", "true");
      }
    }

    function renderTooltip(perkId) {
      if (!perkId) {
        return null;
      }
      const tooltip = getTooltip();
      tooltip.replaceChildren();

      const info = resolveMeta(perkId) || state.nodeMeta[perkId] || {};
      const title = document.createElement("div");
      title.className = "tt-title";
      title.textContent = info.title || state.nodeMeta[perkId]?.label || perkId;

      const subtitle = document.createElement("div");
      subtitle.className = "tt-sub";
      const groupLabel = groups.find((g) => g.id === state.nodeMeta[perkId]?.group)?.label;
      if (groupLabel) {
        subtitle.textContent = groupLabel;
      }

      const body = document.createElement("div");
      body.className = "tt-body";
      const bodyText = info.summary || info.description || "";
      if (bodyText) {
        body.textContent = bodyText;
      }

      tooltip.appendChild(title);
      if (subtitle.textContent) {
        tooltip.appendChild(subtitle);
      }
      if (body.textContent) {
        tooltip.appendChild(body);
      }

      tooltip.setAttribute("aria-hidden", tooltip.childElementCount ? "false" : "true");
      return tooltip;
    }

    function resolveMeta(perkId) {
      if (!perkId) {
        return null;
      }
      return perkData[perkId] || null;
    }

    function computeDepthMap() {
      const depthMap = {};
      const stack = new Set();

      function depthFor(id) {
        if (!id || stack.has(id)) {
          return 1;
        }
        if (depthMap[id]) {
          return depthMap[id];
        }
        stack.add(id);
        const meta = resolveMeta(id);
        const prereqs = Array.isArray(meta?.prereqs) ? meta.prereqs : [];
        if (!prereqs.length) {
          depthMap[id] = 1;
          stack.delete(id);
          return 1;
        }
        const depth = 1 + Math.max(...prereqs.map((req) => depthFor(req)), 0);
        depthMap[id] = depth;
        stack.delete(id);
        return depth;
      }

      Object.keys(perkData || {}).forEach((id) => depthFor(id));
      return depthMap;
    }

    function ringIndexForNode(id, depthMap) {
      const meta = resolveMeta(id);
      const prof = Number(meta?.prof ?? meta?.target ?? 1);
      const profIndex = Number.isFinite(prof) ? Math.max(1, Math.round(prof)) : 1;
      const depthIndex = depthMap[id] || profIndex;
      return Math.min(ringCount - 1, Math.max(0, depthIndex - 1));
    }

    function radiusForNode(id, radii, depthMap) {
      const ringIndex = ringIndexForNode(id, depthMap);
      return radii[ringIndex];
    }

    function minSpacingForRadius(radius) {
      const nodeSize = Number(layoutConstants.NODE_SIZE) || 68;
      const padding = nodeSize * 1.35;
      const radians = Math.min(Math.PI, padding / Math.max(radius, 36));
      return Math.max(10, radians * (180 / Math.PI));
    }

    function setRewardSection(text) {
      if (!rewardSection) return;
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
      value.textContent = text || "—";
    }

    function updateProgressRing(current, max) {
      if (!progressBar) return;
      const r = parseFloat(progressBar.getAttribute("r") || "50");
      const circumference = 2 * Math.PI * r;
      const safeMax = Math.max(1, max);
      const ratio = Math.max(0, Math.min(current / safeMax, 1));
      const offset = circumference * (1 - ratio);
      progressBar.setAttribute("stroke-dasharray", `${circumference.toFixed(2)}`);
      progressBar.setAttribute("stroke-dashoffset", `${offset.toFixed(2)}`);
      if (progressNumber) {
        progressNumber.innerHTML = `${current}<span class="progress-total">/${safeMax}</span>`;
      }
    }

    function clearPrereqLinks() {
      const layer = state.svgLayers.prereqs;
      if (!layer) return;
      while (layer.firstChild) {
        layer.removeChild(layer.firstChild);
      }
    }

    function resetNodeHighlights() {
      nodesContainer
        .querySelectorAll(
          ".perk-node.path-node, .perk-node.path-root, .perk-node.path-ancestor, .perk-node.path-descendant, .perk-node.path-related"
        )
        .forEach((node) => {
          node.classList.remove("path-node", "path-root", "path-ancestor", "path-descendant", "path-related");
          delete node.dataset.pathRole;
        });
    }

    function clearSkillPath() {
      clearPrereqLinks();
      resetNodeHighlights();
    }

    function collectPathData(perkId) {
      const ancestors = new Set();
      const descendants = new Set();
      const related = new Set();
      const edges = [];
      const visitedUp = new Set();
      const visitedDown = new Set();
      const edgeSet = new Set();

      const addEdge = (from, to, type) => {
        if (!state.nodePositions[from] || !state.nodePositions[to]) {
          return;
        }
        const key = `${from}->${to}`;
        if (edgeSet.has(key)) {
          return;
        }
        edgeSet.add(key);
        edges.push({ from, to, type });
      };

      const traverseAncestors = (nodeId) => {
        const prereqs = state.prereqMap[nodeId] || [];
        prereqs.forEach((reqId) => {
          if (!state.nodePositions[reqId]) {
            return;
          }
          ancestors.add(reqId);
          addEdge(reqId, nodeId, "ancestor");
          if (!visitedUp.has(reqId)) {
            visitedUp.add(reqId);
            traverseAncestors(reqId);
          }
        });
      };

      const traverseDescendants = (nodeId) => {
        const dependents = state.dependentMap[nodeId] || [];
        dependents.forEach((depId) => {
          if (!state.nodePositions[depId]) {
            return;
          }
          descendants.add(depId);
          addEdge(nodeId, depId, "descendant");
          if (!visitedDown.has(depId)) {
            visitedDown.add(depId);
            traverseDescendants(depId);
          }
        });
      };

      traverseAncestors(perkId);
      traverseDescendants(perkId);

      const relatedEntries = state.relatedMap?.get(perkId);
      if (relatedEntries && relatedEntries.size) {
        relatedEntries.forEach((relId) => {
          if (state.nodePositions[relId]) {
            related.add(relId);
          }
        });
      }

      return { ancestors, descendants, related, edges };
    }

    function highlightNodesFromData(rootId, pathData) {
      if (!rootId || !pathData) {
        return;
      }
      const { ancestors, descendants, related } = pathData;
      const getNode = (id) => nodesContainer.querySelector(`.perk-node[data-perk="${id}"]`);

      const rootNode = getNode(rootId);
      if (rootNode) {
        rootNode.classList.add("path-node", "path-root");
        rootNode.dataset.pathRole = "root";
      }

      ancestors.forEach((id) => {
        const node = getNode(id);
        if (node) {
          node.classList.add("path-node", "path-ancestor");
          node.dataset.pathRole = "ancestor";
        }
      });

      descendants.forEach((id) => {
        const node = getNode(id);
        if (node) {
          node.classList.add("path-node", "path-descendant");
          node.dataset.pathRole = node.dataset.pathRole
            ? `${node.dataset.pathRole} descendant`
            : "descendant";
        }
      });

      related.forEach((id) => {
        if (id === rootId || ancestors.has(id) || descendants.has(id)) {
          return;
        }
        const node = getNode(id);
        if (node) {
          node.classList.add("path-node", "path-related");
          node.dataset.pathRole = node.dataset.pathRole
            ? `${node.dataset.pathRole} related`
            : "related";
        }
      });
    }

    function drawPathLines(edges) {
      clearPrereqLinks();
      const layer = state.svgLayers.prereqs;
      if (!layer || !Array.isArray(edges)) {
        return;
      }
      edges.forEach(({ from, to, type }) => {
        const source = state.nodePositions[from];
        const target = state.nodePositions[to];
        if (!source || !target) {
          return;
        }
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(source.x));
        line.setAttribute("y1", String(source.y));
        line.setAttribute("x2", String(target.x));
        line.setAttribute("y2", String(target.y));
        line.setAttribute("stroke-linecap", "round");
        line.dataset.path = type;
        state.svgLayers.prereqs.appendChild(line);
      });
    }

    function drawPrereqLinks(perkId) {
      resetNodeHighlights();
      if (!perkId) {
        clearPrereqLinks();
        return;
      }
      const pathData = collectPathData(perkId);
      highlightNodesFromData(perkId, pathData);
      drawPathLines(pathData.edges);
    }

    function drawRelatedLinks() {
      const layer = state.svgLayers.related;
      if (!layer) return;
      while (layer.firstChild) {
        layer.removeChild(layer.firstChild);
      }
      relatedPairs.forEach(([from, to]) => {
        const a = state.nodePositions[from];
        const b = state.nodePositions[to];
        if (!a || !b) return;
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(a.x));
        line.setAttribute("y1", String(a.y));
        line.setAttribute("x2", String(b.x));
        line.setAttribute("y2", String(b.y));
        line.setAttribute("stroke", "rgba(200, 180, 140, 0.35)");
        line.setAttribute("stroke-width", "1.5");
        line.dataset.from = from;
        line.dataset.to = to;
        layer.appendChild(line);
      });
      if (state.hoverPerkId) {
        highlightRelatedLinks(state.hoverPerkId);
      } else if (state.activePerkId) {
        highlightRelatedLinks(state.activePerkId);
      } else {
        hideAllRelatedLinks();
      }
    }

    function hideAllRelatedLinks() {
      const layer = state.svgLayers.related;
      if (!layer) return;
      Array.from(layer.children).forEach((line) => {
        line.classList.remove(RELATED_VISIBLE_CLASS);
      });
    }

    function highlightRelatedLinks(perkId) {
      const layer = state.svgLayers.related;
      if (!layer) return;
      const targetId = perkId || "";
      Array.from(layer.children).forEach((line) => {
        const isRelated = line.dataset.from === targetId || line.dataset.to === targetId;
        line.classList.toggle(RELATED_VISIBLE_CLASS, isRelated);
      });
    }

    function drawGroupLabels(cx, cy, outerRadius) {
      let labelsContainer = graphEl.querySelector("#perk-labels");
      if (!labelsContainer) {
        labelsContainer = document.createElement("div");
        labelsContainer.id = "perk-labels";
        labelsContainer.style.position = "absolute";
        labelsContainer.style.left = "0";
        labelsContainer.style.top = "0";
        labelsContainer.style.width = "100%";
        labelsContainer.style.height = "100%";
        labelsContainer.style.pointerEvents = "none";
        graphEl.appendChild(labelsContainer);
      }
      labelsContainer.innerHTML = "";
      Object.entries(state.groupAngles).forEach(([groupId, meta]) => {
        const group = groups.find((g) => g.id === groupId);
        if (!group) return;
        const mid = meta.start + meta.span / 2;
        const rad = (mid * Math.PI) / 180;
        const label = document.createElement("div");
        label.className = "group-label";
        label.textContent = group.label;
        label.style.position = "absolute";
        label.style.left = `${cx + (outerRadius + 24) * Math.cos(rad)}px`;
        label.style.top = `${cy + (outerRadius + 24) * Math.sin(rad)}px`;
        label.style.transform = "translate(-50%, -50%)";
        label.style.fontSize = "12px";
        label.style.letterSpacing = "0.08em";
        label.style.textTransform = "uppercase";
        label.style.opacity = "0.8";
        labelsContainer.appendChild(label);
      });
    }

    function clearSelection() {
      state.activePerkId = null;
      state.hoverPerkId = null;
      hideAllRelatedLinks();
      nodesContainer.querySelectorAll(".perk-node.selected").forEach((el) => el.classList.remove("selected"));
      if (detailsTitle) {
        detailsTitle.textContent = "Select a perk";
      }
      if (detailsDesc) {
        detailsDesc.textContent = "Choose a node in the skill tree to see details and rewards.";
      }
      if (progressStatus) {
        progressStatus.innerHTML = '<span class="current-progress">Current: 0</span><span class="next-progress target">Target: 1</span>';
      }
      setRewardSection("—");
      updateProgressRing(0, 1);
      hideTooltip();
      clearSkillPath();
      applyPanelState(false);
    }

    function showPerk(perkId, nodeEl) {
      if (!perkId) {
        return;
      }
      state.activePerkId = perkId;
      highlightRelatedLinks(perkId);
      drawPrereqLinks(perkId);
      const meta = resolveMeta(perkId);
      const info = state.nodeMeta[perkId] || {};
      const title = meta?.title || info.label || perkId;
      const description = meta?.description || meta?.summary || info.summary || "Skill information pending documentation.";
      const reward = meta?.reward;
      const unlocked = Boolean(info.unlocked || meta?.unlocked);
      const current = unlocked ? Number(info.current ?? meta?.prof ?? 0) : 0;
      const target = Number(info.target ?? meta?.prof ?? 1);

      if (detailsTitle) {
        detailsTitle.textContent = title;
      }
      if (detailsDesc) {
        detailsDesc.textContent = description;
      }
      if (progressStatus) {
        const currentLabel = unlocked
          ? `<span class="current-progress">Current: ${current}</span>`
          : '<span class="current-progress locked">Locked</span>';
        const targetLabel = `<span class="next-progress target">Target: ${target}</span>`;
        progressStatus.innerHTML = `${currentLabel}${targetLabel}`;
      }
      setRewardSection(reward);
      updateProgressRing(current, target);

      nodesContainer.querySelectorAll(".perk-node.selected").forEach((el) => el.classList.remove("selected"));
      if (nodeEl) {
        nodeEl.classList.add("selected");
      }
      applyPanelState(true);
    }

    function buildNodes() {
      const bounds = graphEl.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) {
        return [];
      }
      state.lastBounds = { width: bounds.width, height: bounds.height };

      ensureSvgLayers();
      hideTooltip();
      state.nodePositions = {};
      state.nodeMeta = {};
      state.groupAngles = {};
      nodesContainer.innerHTML = "";

      const cx = bounds.width / 2;
      const cy = bounds.height / 2;
      const minDim = Math.min(bounds.width, bounds.height);
      const innerFactor = clamp(Number(layoutConstants.MIN_INNER_RADIUS_FACTOR) || 0.22, 0.12, 0.32);
      const minInnerAbsolute = clamp(Number(layoutConstants.MIN_INNER_ABSOLUTE) || 72, 48, 240);
      const innerRadius = Math.max(minInnerAbsolute, minDim * innerFactor);

      const outerPadding = clamp(
        Number(layoutConstants.OUTER_PADDING) || 56,
        24,
        Math.max(24, minDim / 2 - 48)
      );
      const maxAvailableRadius = Math.max(innerRadius + 96, minDim / 2 - outerPadding);
      const preferredBand = clamp(maxAvailableRadius - innerRadius, 120, 240);
      const outerRadius = Math.min(maxAvailableRadius, innerRadius + preferredBand);

      const radii = Array.from({ length: ringCount }, (_, index) => {
        if (ringCount === 1) {
          return innerRadius;
        }
        const t = index / (ringCount - 1);
        const eased = Math.pow(t, 0.85);
        return innerRadius + (outerRadius - innerRadius) * eased;
      });

      const ringEls = graphEl.querySelectorAll(".graph-ring");
      ringEls.forEach((ringEl, idx) => {
        const radius = radii[Math.min(idx, radii.length - 1)];
        const diameter = Math.round(radius * 2);
        ringEl.style.width = `${diameter}px`;
        ringEl.style.height = `${diameter}px`;
      });

      const depthMap = computeDepthMap();
      const activeGroups = groups
        .map((group) => ({
          group,
          nodes: (nodesDef[group.id] || []).filter((entry) => {
            const id = entry.id || entry.key;
            return Boolean(id && (perkData[id] || entry));
          }),
        }))
        .filter((entry) => entry.nodes.length);

      if (!activeGroups.length) {
        if (state.isDevelopment) {
          console.warn("SkillGraph: no nodes available to render.");
        }
        return [];
      }

  const baseGap = Number(layoutConstants.GROUP_GAP_DEG) || 12;
  const spacingMultiplier = Math.max(1, Number(layoutConstants.ANGULAR_SPACING_MULTIPLIER) || 1.35);
  const laneSpacingFactor = clamp(Number(layoutConstants.LANE_SPACING_FACTOR) || 0.9, 0.5, 1.5);

      const weightedGroups = activeGroups
        .map((entry) => {
          const layouts = entry.nodes
            .map((node) => {
              const id = node.id || node.key;
              const meta = resolveMeta(id) || node;
              if (!id || !meta) {
                return null;
              }
              const ringIndex = ringIndexForNode(id, depthMap);
              const radius = radii[ringIndex];
              const spacingDeg = minSpacingForRadius(radius);
              const unlocked = Boolean(meta.unlocked || meta.prof > 0);
              const current = Number(meta.current ?? (unlocked ? meta.prof ?? 0 : 0));
              const target = Number(meta.target ?? meta.prof ?? 1);
              return {
                id,
                meta,
                raw: node,
                groupId: entry.group.id,
                ringIndex,
                radius,
                spacingDeg,
                unlocked,
                current: Number.isFinite(current) ? Math.max(0, current) : 0,
                target: Number.isFinite(target) ? Math.max(1, target) : 1,
              };
            })
            .filter(Boolean);

          const totalSpacing = layouts.reduce((sum, layout) => sum + layout.spacingDeg, 0);
          const requiredSpacing = totalSpacing * spacingMultiplier;
          const weight = layouts.length ? requiredSpacing + layouts.length * 8 : 0;
          return {
            group: entry.group,
            layouts,
            totalSpacing,
            requiredSpacing,
            weight,
          };
        })
        .filter((entry) => entry.layouts.length);

      if (!weightedGroups.length) {
        return [];
      }

      const totalWeight = weightedGroups.reduce((sum, entry) => sum + entry.weight, 0) || 1;
      const perGroupGap = weightedGroups.length
        ? Math.max(3, baseGap / spacingMultiplier)
        : 0;
      const totalGap = Math.min(perGroupGap * weightedGroups.length, 360 * 0.42);
      const usable = Math.max(120, 360 - totalGap);

      let currentStart = -90;
      const created = [];
      const layoutNodes = [];

  weightedGroups.forEach((entry) => {
    const { group, layouts, totalSpacing, requiredSpacing } = entry;
    const weightRatio = entry.weight / totalWeight;
    const arcSpan = Math.max(32, usable * weightRatio);
    const innerGap = Math.min(perGroupGap, arcSpan * 0.25);
        const start = currentStart;
        const innerStart = start + innerGap / 2;
        let innerSpan = Math.max(arcSpan - innerGap, arcSpan * 0.4);
        if (requiredSpacing > innerSpan) {
          innerSpan = Math.min(arcSpan - innerGap / 2, requiredSpacing);
        }
        const innerEnd = innerStart + innerSpan;
        state.groupAngles[group.id] = { start, span: arcSpan, innerStart, innerEnd };

    const desiredSpacings = layouts.map((layout) => layout.spacingDeg * spacingMultiplier);
    const sumDesired = desiredSpacings.reduce((sum, value) => sum + value, 0);
    const scaling = sumDesired > 0 ? Math.min(1, innerSpan / sumDesired) : 0;
        const segments = layouts.map((layout, index) => {
          let delta;
          if (sumDesired > 0) {
            delta = desiredSpacings[index] * scaling;
          } else {
            delta = innerSpan / Math.max(layouts.length, 1);
          }
          if (!Number.isFinite(delta) || delta <= 0) {
            delta = innerSpan / Math.max(layouts.length, 1);
          }
          return { layout, delta, desired: desiredSpacings[index] || delta };
        });

        const totalUsed = segments.reduce((sum, segment) => sum + segment.delta, 0);
        const availableSlack = Math.max(0, innerSpan - totalUsed);
        let cursor = innerStart + availableSlack / 2;

        const laneCount = scaling < 0.95
          ? Math.min(4, Math.max(2, Math.ceil(1 / Math.max(scaling, 0.35))))
          : 1;
        const laneSpacingPx = (Number(layoutConstants.NODE_SIZE) || 64) * laneSpacingFactor;
        let lastAngle = null;
        let lastLane = 0;

        const minAngleForLayout = (layout) => {
          const radius = Math.max(layout.radius, 36);
          const size = Number(layoutConstants.NODE_SIZE) || 64;
          return (size / radius) * (180 / Math.PI);
        };

        segments.forEach(({ layout, delta }) => {
          const rawAngle = cursor + delta / 2;
          let lane = 0;
          if (laneCount > 1) {
            const minSeparation = minAngleForLayout(layout) * 0.9;
            if (lastAngle !== null && rawAngle - lastAngle < minSeparation) {
              lastLane = (lastLane + 1) % laneCount;
            } else if (lastLane !== 0 && (lastAngle === null || rawAngle - lastAngle >= minSeparation * 1.4)) {
              lastLane = 0;
            }
            lane = lastLane;
          }

          const laneOffset = laneCount > 1 ? laneSpacingPx * (lane - (laneCount - 1) / 2) : 0;
          layout.laneIndex = lane;
          layout.laneOffset = laneOffset;
          layout.angle = Math.max(innerStart, Math.min(rawAngle, innerEnd));
          layout.radiusWithLane = Math.max(32, layout.radius + laneOffset);
          layoutNodes.push(layout);
          lastAngle = layout.angle;
          cursor += delta;
        });

        currentStart += arcSpan + perGroupGap;
      });

      layoutNodes.forEach((layout) => {
        const { id, meta, raw, groupId, ringIndex, radius, radiusWithLane, angle, unlocked, current, target, laneIndex } = layout;
        const effectiveRadius = Math.max(32, radiusWithLane ?? radius);
        const angleRad = (angle * Math.PI) / 180;
        const x = cx + effectiveRadius * Math.cos(angleRad);
        const y = cy + effectiveRadius * Math.sin(angleRad);

        state.nodeMeta[id] = {
          id,
          group: groupId,
          label: meta.title || meta.label || id,
          summary: meta.summary || "",
          unlocked,
          current,
          target,
          prereqs: Array.isArray(meta.prereqs) ? Array.from(meta.prereqs) : [],
          metaSource: meta.metaSource || raw.metaSource || "canonical",
        };
  state.nodePositions[id] = { x, y, ringIndex, angle, radius: effectiveRadius, lane: laneIndex || 0 };

        const el = document.createElement("div");
        el.className = `perk-node ${unlocked ? "unlocked" : "locked"}`;
        el.dataset.perk = id;
        el.dataset.group = groupId;
        el.dataset.tier = String(state.nodeMeta[id].target);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", state.nodeMeta[id].label);

        const iconWrapper = document.createElement("div");
        iconWrapper.className = "perk-icon";
        if (meta.icon) {
          const img = document.createElement("img");
          img.src = meta.icon;
          img.alt = "";
          iconWrapper.appendChild(img);
        } else if (meta.emoji) {
          const emojiValue = String(meta.emoji).trim();
          const looksLikeIconClass = /\bfa[bsrl]?\b/.test(emojiValue) || emojiValue.includes("fa-");
          if (looksLikeIconClass) {
            const i = document.createElement("i");
            i.className = emojiValue;
            i.setAttribute("aria-hidden", "true");
            iconWrapper.appendChild(i);
          } else {
            const span = document.createElement("span");
            span.className = "emoji-icon";
            span.textContent = emojiValue;
            iconWrapper.appendChild(span);
          }
        } else {
          const span = document.createElement("span");
          span.className = "icon-placeholder";
          span.textContent = state.nodeMeta[id].label?.charAt(0) || "?";
          iconWrapper.appendChild(span);
        }
        el.appendChild(iconWrapper);

        if (laneIndex && laneIndex !== 0) {
          el.dataset.lane = String(laneIndex);
        }

        nodesContainer.appendChild(el);
        created.push(el);
      });

      state.prereqMap = {};
      state.dependentMap = {};
      Object.keys(state.nodeMeta).forEach((id) => {
        const meta = state.nodeMeta[id];
        const prereqs = Array.isArray(meta?.prereqs)
          ? meta.prereqs.filter((reqId) => Boolean(state.nodeMeta[reqId]))
          : [];
        state.prereqMap[id] = prereqs;
        prereqs.forEach((reqId) => {
          if (!state.dependentMap[reqId]) {
            state.dependentMap[reqId] = [];
          }
          if (!state.dependentMap[reqId].includes(id)) {
            state.dependentMap[reqId].push(id);
          }
        });
      });

      drawRelatedLinks();
      drawGroupLabels(cx, cy, radii[radii.length - 1]);
      return created;
    }

    function wireNodes(nodeEls) {
      nodeEls.forEach((el) => {
        const perkId = el.dataset.perk;

        el.addEventListener("mouseenter", () => {
          state.hoverPerkId = perkId;
          highlightRelatedLinks(perkId);
          const tooltip = renderTooltip(perkId);
          if (tooltip) {
            tooltip.style.display = "block";
          }
          drawPrereqLinks(perkId);
        });

        el.addEventListener("mousemove", (event) => {
          const tooltip = getTooltip();
          const offset = Number(layoutConstants.TOOLTIP_OFFSET) || 16;
          tooltip.style.left = `${event.pageX + offset}px`;
          tooltip.style.top = `${event.pageY + offset}px`;
        });

        el.addEventListener("mouseleave", () => {
          state.hoverPerkId = null;
          hideTooltip();
          if (state.activePerkId) {
            highlightRelatedLinks(state.activePerkId);
            drawPrereqLinks(state.activePerkId);
          } else {
            hideAllRelatedLinks();
            clearSkillPath();
          }
        });

        el.addEventListener("click", () => {
          showPerk(perkId, el);
        });

        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showPerk(perkId, el);
          }
        });
      });
    }

    function redraw() {
      const nodes = buildNodes();
      wireNodes(nodes);
      if (state.hoverPerkId) {
        highlightRelatedLinks(state.hoverPerkId);
        drawPrereqLinks(state.hoverPerkId);
      } else if (state.activePerkId) {
        const node = nodesContainer.querySelector(`.perk-node[data-perk="${state.activePerkId}"]`);
        if (node) {
          showPerk(state.activePerkId, node);
        } else {
          state.activePerkId = null;
          hideAllRelatedLinks();
          clearSkillPath();
        }
      } else {
        hideAllRelatedLinks();
        clearSkillPath();
      }
    }

    function focusSkill(perkId) {
      if (!perkId) return;
      const node = nodesContainer.querySelector(`.perk-node[data-perk="${perkId}"]`);
      if (!node) return;
      showPerk(perkId, node);
      node.focus({ preventScroll: false });
    }

    function handleResize() {
      const bounds = graphEl.getBoundingClientRect();
      if (
        Math.abs(bounds.width - state.lastBounds.width) < 32 &&
        Math.abs(bounds.height - state.lastBounds.height) < 32
      ) {
        return;
      }
      redraw();
    }

    function enableResizeHandling() {
      const resizeHandler = () => {
        window.requestAnimationFrame(() => handleResize());
      };
      window.addEventListener("resize", resizeHandler);
      state.disposeHandlers.push(() => window.removeEventListener("resize", resizeHandler));
    }

    if (centerEl) {
      centerEl.setAttribute("role", "button");
      const onCenterClick = () => clearSelection();
      const onCenterKey = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          clearSelection();
        }
      };
      centerEl.addEventListener("click", onCenterClick);
      centerEl.addEventListener("keydown", onCenterKey);
      state.disposeHandlers.push(() => {
        centerEl.removeEventListener("click", onCenterClick);
        centerEl.removeEventListener("keydown", onCenterKey);
      });
    }

    return {
      redraw,
      focusSkill,
      clearSelection,
      drawPrereqLinks,
      enableResizeHandling,
      layoutConstants,
      dispose() {
        hideTooltip();
        clearSkillPath();
        state.disposeHandlers.forEach((fn) => {
          try {
            fn();
          } catch (_) {
            /* noop */
          }
        });
        state.disposeHandlers = [];
      },
    };
  }

  function focusSkill(skillId) {
    activeController?.focusSkill?.(skillId);
  }

  function clearSelection() {
    activeController?.clearSelection?.();
  }

  function redraw() {
    activeController?.redraw?.();
  }

  window.SkillGraph = Object.freeze({
    initialize,
    focusSkill,
    clearSelection,
    redraw,
    getActiveController: () => activeController,
    constants: DEFAULT_LAYOUT_CONSTANTS,
  });
})(window, document);
