// src/utils/layoutTree.js

const REALITY_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=85", // Developer / Code setup
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=85", // Precision Robotics
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=85", // Silicon Microchip
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=85", // Modern Metropolis
  "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=600&q=85", // Deep Space Explorer
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=85", // Strategy & Team
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

/**
 * Flexible signature helper: supports both
 *   generateTreeElements(universe, options)
 * and
 *   generateTreeElements({ universe, ...options })
 */
export function generateTreeElements(arg1, arg2) {
  let universe = null;
  let options = {};

  if (arg1 && arg1.realities) {
    universe = arg1;
    options = arg2 || {};
  } else if (arg1 && arg1.universe) {
    universe = arg1.universe;
    options = arg1;
  } else {
    universe = arg1 || null;
    options = arg2 || {};
  }

  if (!universe || !Array.isArray(universe.realities) || universe.realities.length === 0) {
    return {
      nodes: [],
      edges: [],
      initialNodes: [],
      initialEdges: [],
    };
  }

  const {
    selectedRealityId,
    onSelectReality,
    onNodeClick,
    onExploreMoreBranches,
    onAddBranchClick,
    viewMode = "tree", // "tree" | "timeline" | "branch" | "comparison"
    selectedCategory = "All",
  } = options;

  const handleSelect = onSelectReality || onNodeClick || (() => {});
  const handleBranch = onExploreMoreBranches || onAddBranchClick || (() => {});

  const nodes = [];
  const edges = [];

  const realities = universe.realities || [];
  const realityMap = new Map();
  realities.forEach((r) => realityMap.set(r.id, r));

  // Determine category match helper
  const isRealityMatchingCategory = (reality) => {
    if (!selectedCategory || selectedCategory === "All") return true;
    const cat = selectedCategory.toLowerCase();
    const realityCat = (reality.category || "").toLowerCase();
    const realityIndustry = (reality.industry || "").toLowerCase();
    const realityCareer = (reality.career || "").toLowerCase();
    const universeCat = (universe.category || "").toLowerCase();

    return (
      realityCat.includes(cat) ||
      realityIndustry.includes(cat) ||
      realityCareer.includes(cat) ||
      universeCat.includes(cat)
    );
  };

  // -------------------------------------------------------------
  // LAYOUT 1: TIMELINE VIEW (Horizontal progression across years)
  // -------------------------------------------------------------
  if (viewMode === "timeline") {
    const startX = 60;
    const centerY = 240;

    // Root node
    nodes.push({
      id: "root-decision",
      type: "decisionRoot",
      position: { x: startX, y: centerY - 45 },
      data: {
        title: universe.originalDecision || "Original Turning Point",
        year: new Date(universe.createdAt || Date.now()).getFullYear() - 1,
        category: universe.category || "Career",
        viewMode: "timeline",
      },
      draggable: true,
    });

    // Junction node
    nodes.push({
      id: "junction-node",
      type: "junction",
      position: { x: startX + 320, y: centerY },
      data: {
        label: "Divergence Vector",
      },
      draggable: true,
    });

    edges.push({
      id: "e-root-junction",
      source: "root-decision",
      target: "junction-node",
      type: "straight",
      style: {
        stroke: "#C8E9A9",
        strokeWidth: 2,
      },
    });

    realities.forEach((reality, idx) => {
      const isSelected = reality.id === selectedRealityId;
      const matches = isRealityMatchingCategory(reality);
      const letter = LETTERS[idx] || `${idx + 1}`;
      const badgeColor = idx === 0 ? "sage" : idx === 1 ? "purple" : "blue";
      const nodeImage = reality.image || REALITY_IMAGES[idx % REALITY_IMAGES.length];

      // Vertical offset for parallel lanes
      const laneOffset = (idx - (realities.length - 1) / 2) * 170;
      const posX = startX + 460 + (idx % 2 === 0 ? 0 : 50);
      const posY = centerY + laneOffset;

      nodes.push({
        id: reality.id,
        type: "realityCard",
        position: { x: posX, y: posY },
        data: {
          reality,
          name: reality.name,
          industry: reality.industry || reality.career || "Technology",
          subtitle: `${reality.industry || reality.career || "Tech"} • 2030+`,
          badgeLabel: `REALITY ${letter}`,
          badgeColor,
          image: nodeImage,
          isSelected,
          isDimmed: !matches,
          isCategoryMatch: matches,
          coherence: 95 - idx * 4,
          onSelect: () => handleSelect(reality.id || reality),
        },
        draggable: true,
      });

      const edgeColor = isSelected ? "#C8E9A9" : badgeColor === "purple" ? "#9678C9" : "#78a9c9";
      edges.push({
        id: `e-junction-${reality.id}`,
        source: "junction-node",
        target: reality.id,
        type: "default",
        style: {
          stroke: matches ? edgeColor : "rgba(100, 100, 100, 0.25)",
          strokeWidth: isSelected ? 2.5 : 1.5,
          opacity: matches ? (isSelected ? 1 : 0.85) : 0.25,
          filter: isSelected ? "drop-shadow(0 0 6px #C8E9A9)" : undefined,
        },
      });

      if (isSelected) {
        nodes.push({
          id: `add-branch-${reality.id}`,
          type: "addBranch",
          position: { x: posX + 35, y: posY + 120 },
          data: {
            onClick: () => handleBranch(reality),
          },
          draggable: true,
        });

        edges.push({
          id: `e-${reality.id}-add-branch`,
          source: reality.id,
          target: `add-branch-${reality.id}`,
          type: "straight",
          style: {
            stroke: "#C8E9A9",
            strokeWidth: 1.2,
            strokeDasharray: "4 4",
            opacity: 0.75,
          },
        });
      }
    });

    return { nodes, edges, initialNodes: nodes, initialEdges: edges };
  }

  // -------------------------------------------------------------
  // LAYOUT 2: COMPARISON VIEW (Side-by-side horizontal alignment)
  // -------------------------------------------------------------
  if (viewMode === "comparison") {
    const colWidth = 300;
    const totalWidth = realities.length * colWidth;
    const startX = Math.max(40, 500 - totalWidth / 2);
    const topY = 160;

    // Comparison anchor bar node
    nodes.push({
      id: "root-decision",
      type: "decisionRoot",
      position: { x: 380, y: 30 },
      data: {
        title: `Comparing ${realities.length} Parallel Trajectories`,
        year: new Date(universe.createdAt || Date.now()).getFullYear(),
        category: "Comparison Matrix",
        viewMode: "comparison",
      },
      draggable: true,
    });

    nodes.push({
      id: "junction-node",
      type: "junction",
      position: { x: 520, y: 110 },
      data: { label: "Multi-Timeline Divergence" },
      draggable: true,
    });

    edges.push({
      id: "e-root-junction",
      source: "root-decision",
      target: "junction-node",
      type: "straight",
      style: { stroke: "#C8E9A9", strokeWidth: 2 },
    });

    realities.forEach((reality, idx) => {
      const isSelected = reality.id === selectedRealityId;
      const matches = isRealityMatchingCategory(reality);
      const letter = LETTERS[idx] || `${idx + 1}`;
      const badgeColor = idx === 0 ? "sage" : idx === 1 ? "purple" : "blue";
      const nodeImage = reality.image || REALITY_IMAGES[idx % REALITY_IMAGES.length];
      const posX = startX + idx * colWidth;

      nodes.push({
        id: reality.id,
        type: "realityCard",
        position: { x: posX, y: topY },
        data: {
          reality,
          name: reality.name,
          industry: reality.industry || reality.career || "Technology",
          subtitle: `${reality.industry || reality.career || "Tech"} • 2030+`,
          badgeLabel: `REALITY ${letter}`,
          badgeColor,
          image: nodeImage,
          isSelected,
          isDimmed: !matches,
          isCategoryMatch: matches,
          coherence: 96 - idx * 5,
          onSelect: () => handleSelect(reality.id || reality),
        },
        draggable: true,
      });

      edges.push({
        id: `e-junction-${reality.id}`,
        source: "junction-node",
        target: reality.id,
        type: "default",
        style: {
          stroke: matches ? (isSelected ? "#C8E9A9" : "#9678C9") : "rgba(100, 100, 100, 0.25)",
          strokeWidth: isSelected ? 2.5 : 1.5,
          opacity: matches ? (isSelected ? 1 : 0.85) : 0.25,
        },
      });

      // Also render Add Branch below each card in comparison mode
      if (isSelected) {
        nodes.push({
          id: `add-branch-${reality.id}`,
          type: "addBranch",
          position: { x: posX + 35, y: topY + 120 },
          data: {
            onClick: () => handleBranch(reality),
          },
          draggable: true,
        });

        edges.push({
          id: `e-${reality.id}-add-branch`,
          source: reality.id,
          target: `add-branch-${reality.id}`,
          type: "straight",
          style: {
            stroke: "#C8E9A9",
            strokeWidth: 1.2,
            strokeDasharray: "4 4",
            opacity: 0.75,
          },
        });
      }
    });

    return { nodes, edges, initialNodes: nodes, initialEdges: edges };
  }

  // -------------------------------------------------------------
  // LAYOUT 3: TREE VIEW & BRANCH VIEW (Hierarchical DAG)
  // -------------------------------------------------------------
  const centerX = 380;

  // 1. Root Decision Node
  nodes.push({
    id: "root-decision",
    type: "decisionRoot",
    position: { x: centerX, y: 30 },
    data: {
      title: universe.originalDecision || "Turning Point Decision",
      year: new Date(universe.createdAt || Date.now()).getFullYear(),
      category: universe.category || "Career",
      viewMode,
    },
    draggable: true,
  });

  // 2. Central Junction Node
  nodes.push({
    id: "junction-node",
    type: "junction",
    position: { x: centerX + 152, y: 140 },
    data: {},
    draggable: true,
  });

  // Edge: Root Decision -> Junction
  edges.push({
    id: "e-root-junction",
    source: "root-decision",
    target: "junction-node",
    type: "straight",
    style: {
      stroke: "#C8E9A9",
      strokeWidth: 2,
    },
  });

  // Partition into root-level realities vs children
  const roots = [];
  const childrenByParent = new Map();

  realities.forEach((r) => {
    if (r.parentRealityId && realityMap.has(r.parentRealityId)) {
      if (!childrenByParent.has(r.parentRealityId)) {
        childrenByParent.set(r.parentRealityId, []);
      }
      childrenByParent.get(r.parentRealityId).push(r);
    } else {
      roots.push(r);
    }
  });

  const positions = new Map();
  const rootCount = roots.length;

  roots.forEach((reality, idx) => {
    let posX = centerX;
    let posY = 250;

    if (rootCount === 1) {
      posX = centerX + 25;
      posY = 245;
    } else if (rootCount === 2) {
      if (idx === 0) posX = centerX - 180;
      if (idx === 1) posX = centerX + 240;
      posY = 245;
    } else if (rootCount === 3) {
      if (idx === 0) {
        posX = centerX - 240;
        posY = 240;
      } else if (idx === 1) {
        posX = centerX + 280;
        posY = 240;
      } else if (idx === 2) {
        posX = centerX + 20;
        posY = 360;
      }
    } else {
      const offset = (idx - (rootCount - 1) / 2) * 290;
      posX = centerX + 25 + offset;
      posY = 245 + (idx % 2 === 0 ? 0 : 80);
    }

    positions.set(reality.id, { x: posX, y: posY });
  });

  function positionChildren(parentId, depth = 1) {
    const children = childrenByParent.get(parentId) || [];
    if (!children.length) return;

    const parentPos = positions.get(parentId) || { x: centerX, y: 250 };
    const numChildren = children.length;

    children.forEach((child, childIdx) => {
      const horizontalOffset =
        numChildren === 1
          ? 0
          : (childIdx - (numChildren - 1) / 2) * 290;

      const posX = parentPos.x + horizontalOffset;
      const posY = parentPos.y + 160;

      positions.set(child.id, { x: posX, y: posY });
      positionChildren(child.id, depth + 1);
    });
  }

  roots.forEach((root) => {
    positionChildren(root.id);
  });

  realities.forEach((reality, idx) => {
    const isSelected = reality.id === selectedRealityId;
    const matches = isRealityMatchingCategory(reality);
    const letter = LETTERS[idx] || `${idx + 1}`;
    const badgeColor = idx === 0 ? "sage" : idx === 1 ? "purple" : "blue";

    const pos = positions.get(reality.id) || {
      x: centerX + (idx - 1) * 270,
      y: 260 + idx * 120,
    };

    const nodeImage = reality.image || REALITY_IMAGES[idx % REALITY_IMAGES.length];

    nodes.push({
      id: reality.id,
      type: "realityCard",
      position: pos,
      data: {
        reality,
        name: reality.name,
        industry: reality.industry || reality.career || "Technology",
        subtitle: `${reality.industry || reality.career || "Tech"} • 2030+`,
        badgeLabel: `REALITY ${letter}`,
        badgeColor,
        image: nodeImage,
        isSelected,
        isDimmed: !matches,
        isCategoryMatch: matches,
        viewMode,
        coherence: 95 - idx * 4,
        onSelect: () => handleSelect(reality.id || reality),
      },
      draggable: true,
    });

    const edgeColor =
      isSelected || badgeColor === "sage"
        ? "#C8E9A9"
        : badgeColor === "blue"
        ? "#78a9c9"
        : "#9678C9";

    const isChild = reality.parentRealityId && realityMap.has(reality.parentRealityId);
    const sourceNodeId = isChild ? reality.parentRealityId : "junction-node";

    edges.push({
      id: `e-${sourceNodeId}-${reality.id}`,
      source: sourceNodeId,
      target: reality.id,
      type: "default",
      style: {
        stroke: matches ? edgeColor : "rgba(100, 100, 100, 0.25)",
        strokeWidth: isSelected ? 2.5 : 1.5,
        opacity: matches ? (isSelected ? 1 : 0.85) : 0.25,
        filter: isSelected ? "drop-shadow(0 0 6px #C8E9A9)" : undefined,
      },
    });

    // In Branch view, show Add Branch button for every leaf reality;
    // In Tree view, show Add Branch for selected reality
    const shouldShowAddBranch =
      (viewMode === "branch") || (isSelected);

    if (shouldShowAddBranch) {
      const branchId = `add-branch-${reality.id}`;
      nodes.push({
        id: branchId,
        type: "addBranch",
        position: { x: pos.x + 35, y: pos.y + 120 },
        data: {
          onClick: () => handleBranch(reality),
        },
        draggable: true,
      });

      edges.push({
        id: `e-${reality.id}-${branchId}`,
        source: reality.id,
        target: branchId,
        type: "straight",
        style: {
          stroke: "#C8E9A9",
          strokeWidth: 1.2,
          strokeDasharray: "4 4",
          opacity: 0.75,
        },
      });
    }
  });

  return { nodes, edges, initialNodes: nodes, initialEdges: edges };
}
