// src/services/universeService.js

const STORAGE_KEY = "parallel.universes";
const INITIALIZED_KEY = "parallel.initialized";

export const SAMPLE_UNIVERSES = [
  {
    id: "uni-computer-eng-01",
    originalDecision: "Choose Computer Engineering",
    category: "Career",
    durationYears: 10,
    createdAt: Date.now() - 86400000 * 3,
    bookmarked: true,
    realities: [
      {
        id: "real-software-dev",
        universeId: "uni-computer-eng-01",
        name: "Software Developer",
        type: "original",
        parentRealityId: null,
        parentEventId: null,
        summary: "You stayed the course in computer engineering, scaling complex cloud systems and distributed web applications.",
        career: "Senior Software Developer",
        industry: "Tech Industry",
        location: "San Francisco, CA",
        skills: ["Distributed Systems", "TypeScript", "System Architecture", "Cloud Native"],
        opportunities: ["Staff Engineer at hypergrowth scale-up", "Open source protocol leadership"],
        challenges: ["Fast-paced framework churn", "Screen fatigue"],
        outcome: "Deep technical mastery and financial independence within the core software sector.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
        events: [
          {
            id: "evt-01",
            order: 1,
            year: 2026,
            age: 24,
            title: "First Backend Engineer Role",
            description: "Joined a seed-stage infrastructure company as employee #8.",
            category: "Career",
            skills: ["Distributed Systems"],
            opportunities: ["Rapid ownership"],
            challenges: ["14-hour days"],
            consequences: "Promoted to Senior Engineer in 2.5 years."
          },
          {
            id: "evt-02",
            order: 2,
            year: 2029,
            age: 27,
            title: "Cloud Infrastructure Lead",
            description: "Led migration to custom multi-region orchestrator.",
            category: "Career",
            skills: ["Kubernetes", "Architecture"],
            opportunities: ["Speaking at KubeCon"],
            challenges: ["Executive politics"],
            consequences: "Achieved principal engineer status."
          }
        ]
      },
      {
        id: "real-mechanical-eng",
        universeId: "uni-computer-eng-01",
        name: "Mechanical Engineer",
        type: "alternative",
        parentRealityId: "real-software-dev",
        parentEventId: "evt-01",
        summary: "Pivoted from pure code into physical computing, robotics actuators, and autonomous hardware engineering.",
        career: "Autonomous Systems Roboticist",
        industry: "Robotics",
        location: "Tokyo, Japan",
        skills: ["ROS 2", "Kinematics", "C++", "Computer Vision"],
        opportunities: ["Lead researcher on bipedal walking algorithms", "Global robotics summit speaker"],
        challenges: ["Hardware turnaround cycles", "International supply chain bottlenecks"],
        outcome: "Pioneered adaptive manipulation algorithms with international patents.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
        events: [
          {
            id: "evt-r1",
            order: 1,
            year: 2027,
            age: 25,
            title: "Robotics Lab Fellowship",
            description: "Accepted into Tokyo Robotics Institute research exchange.",
            category: "Education",
            skills: ["Kinematics", "ROS 2"],
            opportunities: ["Direct mentor under Prof. Takahashi"],
            challenges: ["Intense cultural adjustment"],
            consequences: "Co-authored high-impact paper on compliant actuators."
          }
        ]
      },
      {
        id: "real-product-manager",
        universeId: "uni-computer-eng-01",
        name: "Product Manager",
        type: "alternative",
        parentRealityId: "real-software-dev",
        parentEventId: null,
        summary: "You chose to lead products instead of building them. You're now a Product Manager at a top tech company, shaping the future of technology.",
        career: "Principal Product Manager",
        industry: "Tech Product",
        location: "New York, NY",
        skills: ["Strategy", "Leadership", "Business", "User Research"],
        opportunities: ["Product Leadership, Startup Founder Fellowship"],
        challenges: ["High Responsibility, Market Pressure"],
        outcome: "A fulfilling career with global impact.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        events: [
          {
            id: "evt-pm1",
            order: 1,
            year: 2027,
            age: 25,
            title: "Associate Product Manager",
            description: "Transitioned from engineering into product strategy, leading search infrastructure.",
            category: "Career",
            skills: ["Roadmapping"],
            opportunities: ["Executive mentorship"],
            challenges: ["Balancing user needs with timeline constraints"],
            consequences: "Launched feature utilized by 10M+ daily active users."
          },
          {
            id: "evt-pm2",
            order: 2,
            year: 2030,
            age: 28,
            title: "Director of Product Evolution",
            description: "Spearheaded autonomous collaborative platform vision across 4 continents.",
            category: "Milestone",
            skills: ["Executive Strategy"],
            opportunities: ["Board of advisors invitation"],
            challenges: ["Cross-timezone org friction"],
            consequences: "Grew product line annual recurring revenue by 340%."
          }
        ]
      }
    ]
  },
  {
    id: "uni-tokyo-02",
    originalDecision: "What if I moved to Kyoto to open a design studio?",
    category: "Lifestyle",
    durationYears: 5,
    createdAt: Date.now() - 86400000 * 7,
    bookmarked: false,
    realities: [
      {
        id: "real-kyoto-01",
        universeId: "uni-tokyo-02",
        name: "Kyoto Craft Studio",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Blended generative UI software with traditional Japanese woodcraft.",
        career: "Design Director",
        industry: "Creative Studio",
        location: "Kyoto, Japan",
        skills: ["Industrial Design", "Woodworking", "Branding"],
        opportunities: ["Exhibition in Milan Design Week"],
        challenges: ["Seasonal tourism revenue dips"],
        outcome: "Recognized as a leading minimalist atelier.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
        events: []
      }
    ]
  }
];

function getRaw() {
  if (typeof window === "undefined" || !window.localStorage) return SAMPLE_UNIVERSES;
  
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const hasInitialized = localStorage.getItem(INITIALIZED_KEY);
    if (!hasInitialized) {
      setRaw(SAMPLE_UNIVERSES);
      localStorage.setItem(INITIALIZED_KEY, "true");
      return SAMPLE_UNIVERSES;
    }
    return [];
  }
  
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function setRaw(arr) {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }
}

export const universeService = {
  getAll() {
    return getRaw();
  },
  getById(id) {
    return getRaw().find((u) => u.id === id);
  },
  save(universe) {
    const list = getRaw();
    const now = Date.now();
    const newUni = {
      id: universe.id ?? `u-${now}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: universe.createdAt ?? now,
      bookmarked: universe.bookmarked ?? false,
      realities: universe.realities ?? [],
      ...universe,
    };
    list.unshift(newUni);
    setRaw(list);
    return newUni;
  },
  update(id, patch) {
    const list = getRaw().map((u) => (u.id === id ? { ...u, ...patch } : u));
    setRaw(list);
    return list.find((u) => u.id === id);
  },
  remove(id) {
    const list = getRaw().filter((u) => u.id !== id);
    setRaw(list);
  },
  toggleBookmark(id) {
    const list = getRaw().map((u) =>
      u.id === id ? { ...u, bookmarked: !u.bookmarked } : u
    );
    setRaw(list);
    return list.find((u) => u.id === id);
  },
  resetToSample() {
    setRaw(SAMPLE_UNIVERSES);
    return SAMPLE_UNIVERSES;
  }
};
