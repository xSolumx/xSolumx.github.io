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
    MIN_INNER_RADIUS_FACTOR: 0.32,
    MIN_INNER_ABSOLUTE: 120,
    OUTER_PADDING: 64,
    GROUP_GAP_DEG: 12,
    NODE_SIZE: 68,
    TOOLTIP_OFFSET: 16,
    ANGULAR_SPACING_MULTIPLIER: 10,
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
      groupAngles: {},
      disposeHandlers: [],
      tooltipEl: null,
      lastBounds: { width: 0, height: 0 },
      svgLayers: { related: null, prereqs: null },
    };

    const controller = buildController(state);
    controller.redraw();
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

    const ringCount = Math.max(3, Number(layoutConstants.RING_COUNT) || 5);

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
      document.body.appendChild(tooltip);
      state.tooltipEl = tooltip;
      return tooltip;
    }

    function hideTooltip() {
      if (state.tooltipEl) {
        state.tooltipEl.style.display = "none";
      }
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

    function drawPrereqLinks(perkId) {
      clearPrereqLinks();
      const meta = state.nodeMeta[perkId];
      const target = state.nodePositions[perkId];
      if (!meta || !target || !Array.isArray(meta.prereqs)) {
        return;
      }
      meta.prereqs.forEach((req) => {
        const source = state.nodePositions[req];
        if (!source) return;
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(source.x));
        line.setAttribute("y1", String(source.y));
        line.setAttribute("x2", String(target.x));
        line.setAttribute("y2", String(target.y));
        line.setAttribute("stroke", "rgba(120, 180, 255, 0.6)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-linecap", "round");
        state.svgLayers.prereqs.appendChild(line);
      });
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
        layer.appendChild(line);
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
      clearPrereqLinks();
    }

    function showPerk(perkId, nodeEl) {
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
      const innerRadius = Math.max(
        Number(layoutConstants.MIN_INNER_ABSOLUTE) || 120,
        minDim * (Number(layoutConstants.MIN_INNER_RADIUS_FACTOR) || 0.32)
      );
      const outerRadius = Math.max(innerRadius + 160, minDim / 2 - (Number(layoutConstants.OUTER_PADDING) || 64));
      const radii = Array.from({ length: ringCount }, (_, index) => {
        if (ringCount === 1) {
          return innerRadius;
        }
        const t = index / (ringCount - 1);
        return innerRadius + (outerRadius - innerRadius) * t;
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
          return { layout, delta };
        });

        const totalUsed = segments.reduce((sum, segment) => sum + segment.delta, 0);
        const availableSlack = Math.max(0, innerSpan - totalUsed);
        let cursor = innerStart + availableSlack / 2;

        segments.forEach(({ layout, delta }) => {
          const angle = cursor + delta / 2;
          layout.angle = Math.max(innerStart, Math.min(angle, innerEnd));
          layoutNodes.push(layout);
          cursor += delta;
        });

        currentStart += arcSpan + perGroupGap;
      });

      layoutNodes.forEach((layout) => {
        const { id, meta, raw, groupId, ringIndex, radius, angle, unlocked, current, target } = layout;
        const angleRad = (angle * Math.PI) / 180;
        const x = cx + radius * Math.cos(angleRad);
        const y = cy + radius * Math.sin(angleRad);

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
        state.nodePositions[id] = { x, y, ringIndex, angle };

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
          const span = document.createElement("span");
          span.className = "icon-placeholder";
          span.textContent = meta.emoji;
          iconWrapper.appendChild(span);
        } else {
          const span = document.createElement("span");
          span.className = "icon-placeholder";
          span.textContent = state.nodeMeta[id].label?.charAt(0) || "?";
          iconWrapper.appendChild(span);
        }
        el.appendChild(iconWrapper);

        const badge = document.createElement("span");
        badge.className = "perk-number";
        badge.textContent = unlocked ? String(state.nodeMeta[id].target) : "—";
        el.appendChild(badge);

        nodesContainer.appendChild(el);
        created.push(el);
      });

      drawRelatedLinks();
      drawGroupLabels(cx, cy, radii[radii.length - 1]);
      return created;
    }

    function wireNodes(nodeEls) {
      nodeEls.forEach((el) => {
        const perkId = el.dataset.perk;

        el.addEventListener("mouseenter", () => {
          const tooltip = getTooltip();
          const info = resolveMeta(perkId) || state.nodeMeta[perkId];
          tooltip.innerHTML = `
            <div class="tt-title">${info?.title || state.nodeMeta[perkId]?.label || perkId}</div>
            <div class="tt-sub">${groups.find((g) => g.id === state.nodeMeta[perkId]?.group)?.label || ""}</div>
            <div class="tt-body">${info?.summary || info?.description || ""}</div>
          `;
          tooltip.style.display = "block";
          drawPrereqLinks(perkId);
        });

        el.addEventListener("mousemove", (event) => {
          const tooltip = getTooltip();
          const offset = Number(layoutConstants.TOOLTIP_OFFSET) || 16;
          tooltip.style.left = `${event.pageX + offset}px`;
          tooltip.style.top = `${event.pageY + offset}px`;
        });

        el.addEventListener("mouseleave", () => {
          hideTooltip();
          clearPrereqLinks();
        });

        el.addEventListener("click", () => {
          showPerk(perkId, el);
          drawPrereqLinks(perkId);
        });

        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showPerk(perkId, el);
            drawPrereqLinks(perkId);
          }
        });
      });
    }

    function redraw() {
      const nodes = buildNodes();
      wireNodes(nodes);
    }

    function focusSkill(perkId) {
      if (!perkId) return;
      const node = nodesContainer.querySelector(`.perk-node[data-perk="${perkId}"]`);
      if (!node) return;
      showPerk(perkId, node);
      drawPrereqLinks(perkId);
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
        clearPrereqLinks();
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
