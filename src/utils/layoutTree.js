// src/utils/layoutTree.js

const REALITY_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80", // Laptop / code
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80", // Robotic arm
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80", // Analytics / product
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80", // Deep tech / space
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80", // High tech chip
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

export function generateTreeElements({
  universe,
  selectedRealityId,
  onSelectReality,
  onExploreMoreBranches,
}) {
  if (!universe) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  const centerX = 360;

  // 1. Root Decision Node
  nodes.push({
    id: "root-decision",
    type: "decisionRoot",
    position: { x: centerX, y: 30 },
    data: {
      title: universe.originalDecision || "Choose Path",
      year: new Date(universe.createdAt || Date.now()).getFullYear(),
    },
    draggable: true,
  });

  // 2. Central Junction Node
  nodes.push({
    id: "junction-node",
    type: "junction",
    position: { x: centerX + 152, y: 150 },
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

  const realities = universe.realities || [];
  const realityMap = new Map();
  realities.forEach((r) => realityMap.set(r.id, r));

  // Partition into root-level realities vs children of existing realities
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

  // Calculate coordinates for nodes
  const positions = new Map();

  // Position root realities
  const rootCount = roots.length;
  roots.forEach((reality, idx) => {
    let posX = centerX;
    let posY = 260;

    if (rootCount === 1) {
      posX = centerX + 35;
      posY = 260;
    } else if (rootCount === 2) {
      if (idx === 0) posX = centerX - 180;
      if (idx === 1) posX = centerX + 240;
      posY = 250;
    } else if (rootCount === 3) {
      if (idx === 0) {
        posX = centerX - 220;
        posY = 245;
      } else if (idx === 1) {
        posX = centerX + 280;
        posY = 245;
      } else if (idx === 2) {
        posX = centerX + 30;
        posY = 365;
      }
    } else {
      // More than 3 roots: spread horizontally
      const offset = (idx - (rootCount - 1) / 2) * 270;
      posX = centerX + 30 + offset;
      posY = 250 + (idx % 2 === 0 ? 0 : 80);
    }

    positions.set(reality.id, { x: posX, y: posY });
  });

  // Recursively position children below their parent
  function positionChildren(parentId, depth = 1) {
    const children = childrenByParent.get(parentId) || [];
    if (!children.length) return;

    const parentPos = positions.get(parentId) || { x: centerX, y: 260 };
    const numChildren = children.length;

    children.forEach((child, childIdx) => {
      const horizontalOffset =
        numChildren === 1
          ? 0
          : (childIdx - (numChildren - 1) / 2) * 290;

      const posX = parentPos.x + horizontalOffset;
      const posY = parentPos.y + 155;

      positions.set(child.id, { x: posX, y: posY });
      positionChildren(child.id, depth + 1);
    });
  }

  roots.forEach((root) => {
    positionChildren(root.id);
  });

  // Now create the React Flow nodes and edges for all realities
  realities.forEach((reality, idx) => {
    const isSelected = reality.id === selectedRealityId;
    const letter = LETTERS[idx] || `${idx + 1}`;
    const badgeColor = idx === 0 ? "blue" : idx === 1 ? "purple" : "sage";

    const pos = positions.get(reality.id) || {
      x: centerX + (idx - 1) * 260,
      y: 280 + idx * 120,
    };

    const nodeImage = reality.image || REALITY_IMAGES[idx % REALITY_IMAGES.length];

    nodes.push({
      id: reality.id,
      type: "realityCard",
      position: pos,
      data: {
        reality,
        name: reality.name,
        industry: reality.industry || reality.career || "Tech",
        subtitle: `${reality.industry || reality.career || "Tech Product"} • 2030+`,
        badgeLabel: `REALITY ${letter}`,
        badgeColor,
        image: nodeImage,
        isSelected,
        onSelect: onSelectReality,
      },
      draggable: true,
    });

    // Determine Edge Color & Glow
    const edgeColor =
      isSelected || badgeColor === "sage"
        ? "#C8E9A9"
        : badgeColor === "blue"
        ? "#78a9c9"
        : "#9678C9";

    // Determine source node: if it has parentRealityId that exists, attach to parent!
    const isChild = reality.parentRealityId && realityMap.has(reality.parentRealityId);
    const sourceNodeId = isChild ? reality.parentRealityId : "junction-node";

    edges.push({
      id: `e-${sourceNodeId}-${reality.id}`,
      source: sourceNodeId,
      target: reality.id,
      type: "default", // smooth bezier
      style: {
        stroke: edgeColor,
        strokeWidth: isSelected ? 2.5 : 1.5,
        opacity: isSelected ? 1 : 0.85,
        filter: isSelected ? "drop-shadow(0 0 5px #C8E9A9)" : undefined,
      },
    });

    // If this reality is currently selected, add "+ Explore More Branches" beneath it
    if (isSelected) {
      nodes.push({
        id: "add-branch-node",
        type: "addBranch",
        position: { x: pos.x + 35, y: pos.y + 115 },
        data: {
          onClick: () => onExploreMoreBranches?.(reality),
        },
        draggable: true,
      });

      edges.push({
        id: `e-${reality.id}-add-branch`,
        source: reality.id,
        target: "add-branch-node",
        type: "straight",
        style: {
          stroke: "#C8E9A9",
          strokeWidth: 1.2,
          strokeDasharray: "4 4",
          opacity: 0.7,
        },
      });
    }
  });

  return { nodes, edges };
}
