// src/utils/layoutTree.js

const REALITY_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80", // Laptop / code
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80", // Robotic arm
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80", // Analytics / product
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80", // Deep tech / space
];

const BADGE_COLORS = ["blue", "purple", "sage", "blue"];
const LETTERS = ["A", "B", "C", "D", "E", "F"];

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
  const count = realities.length;

  // Position realities with layout matching the screenshot
  // In reference UI: Reality A (left), Reality B (right), Reality C (center below)
  realities.forEach((reality, idx) => {
    const isSelected = reality.id === selectedRealityId;
    const letter = LETTERS[idx] || `${idx + 1}`;
    const badgeColor = idx === 0 ? "blue" : idx === 1 ? "purple" : "sage";

    let posX = centerX;
    let posY = 260;

    if (count === 1) {
      posX = centerX + 35;
      posY = 260;
    } else if (count === 2) {
      if (idx === 0) posX = centerX - 180;
      if (idx === 1) posX = centerX + 240;
    } else if (count >= 3) {
      if (idx === 0) {
        // Left branch (Reality A)
        posX = centerX - 220;
        posY = 245;
      } else if (idx === 1) {
        // Right branch (Reality B)
        posX = centerX + 280;
        posY = 245;
      } else if (idx === 2) {
        // Center/lower branch (Reality C)
        posX = centerX + 30;
        posY = 365;
      } else {
        // Additional reality
        posX = centerX - 180 + (idx - 2) * 200;
        posY = 500;
      }
    }

    const nodeImage = reality.image || REALITY_IMAGES[idx % REALITY_IMAGES.length];

    nodes.push({
      id: reality.id,
      type: "realityCard",
      position: { x: posX, y: posY },
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

    edges.push({
      id: `e-junction-${reality.id}`,
      source: "junction-node",
      target: reality.id,
      type: "default", // smooth bezier
      style: {
        stroke: edgeColor,
        strokeWidth: isSelected ? 2.5 : 1.5,
        opacity: isSelected ? 1 : 0.85,
        filter: isSelected ? "drop-shadow(0 0 4px #C8E9A9)" : undefined,
      },
    });

    // If this reality is currently selected, add "+ Explore More Branches" beneath it
    if (isSelected) {
      nodes.push({
        id: "add-branch-node",
        type: "addBranch",
        position: { x: posX + 40, y: posY + 130 },
        data: {
          onClick: onExploreMoreBranches,
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
          opacity: 0.6,
        },
      });
    }
  });

  return { nodes, edges };
}
