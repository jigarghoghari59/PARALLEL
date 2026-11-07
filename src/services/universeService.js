// src/services/universeService.js

const STORAGE_KEY = "parallel.universes";
const INITIALIZED_KEY = "parallel.initialized";

export const SAMPLE_UNIVERSES = [
  {
    id: "uni-robotics-01",
    originalDecision: "What if I had chosen Mechanical Engineering instead of Computer Engineering?",
    category: "Career",
    durationYears: 10,
    createdAt: Date.now() - 86400000 * 3,
    bookmarked: true,
    realities: [
      {
        id: "real-original",
        universeId: "uni-robotics-01",
        name: "Software Architecture Path",
        type: "original",
        parentRealityId: null,
        parentEventId: null,
        summary: "Continuing in computer engineering led to senior systems architecture in cloud tech.",
        career: "Cloud Architect",
        industry: "Enterprise Software",
        location: "San Francisco, CA",
        skills: ["Distributed Systems", "Kubernetes", "Go", "System Design"],
        opportunities: ["Tech Lead at high-growth startup", "Early equity buyout"],
        challenges: ["High burnout risk", "Sedentary routine"],
        outcome: "Financial security with rapid career progression in enterprise software.",
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
        id: "real-robotics",
        universeId: "uni-robotics-01",
        name: "The Robotics Path",
        type: "alternative",
        parentRealityId: "real-original",
        parentEventId: "evt-01",
        summary: "Pivoting into mechatronics and humanoid robotics engineering with hands-on hardware builds.",
        career: "Autonomous Systems Roboticist",
        industry: "Robotics & Automation",
        location: "Tokyo, Japan",
        skills: ["ROS 2", "Kinematics", "C++", "Computer Vision"],
        opportunities: ["Lead researcher on bipedal walking algorithms", "Global robotics summit speaker"],
        challenges: ["Hardware iteration cycles are long and capital-intensive", "Language barrier abroad"],
        outcome: "Groundbreaking patents in robotic manipulation and fulfilling cross-border career.",
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
          },
          {
            id: "evt-r2",
            order: 2,
            year: 2030,
            age: 28,
            title: "Senior Roboticist at Humanoid Lab",
            description: "Spearheaded autonomous manipulation for next-gen warehouse robots.",
            category: "Career",
            skills: ["Actuator Design", "Sensor Fusion"],
            opportunities: ["Venture funding offer for spin-off"],
            challenges: ["Supply chain bottlenecks"],
            consequences: "Filed 3 core utility patents in robotic dexterity."
          }
        ]
      },
      {
        id: "real-automotive",
        universeId: "uni-robotics-01",
        name: "EV Powertrain Researcher",
        type: "alternative",
        parentRealityId: "real-original",
        parentEventId: "evt-01",
        summary: "Focusing on electric vehicle battery cell simulation and thermal management.",
        career: "Battery Systems Engineer",
        industry: "CleanTech & Automotive",
        location: "Munich, Germany",
        skills: ["Thermal Modeling", "MATLAB", "SolidWorks"],
        opportunities: ["Formula E tech partnership"],
        challenges: ["Rigid automotive safety regulations"],
        outcome: "Key contributor to next-generation solid-state battery architecture.",
        events: []
      },
      {
        id: "real-aerospace",
        universeId: "uni-robotics-01",
        name: "Orbital Mechanics Specialist",
        type: "alternative",
        parentRealityId: "real-original",
        parentEventId: null,
        summary: "Designing satellite deployment mechanisms for private space propulsion ventures.",
        career: "Aerospace Systems Analyst",
        industry: "Space Technology",
        location: "Austin, TX",
        skills: ["Orbital Dynamics", "Nastran", "Aerodynamics"],
        opportunities: ["Launch control room lead"],
        challenges: ["Defense clearance delays"],
        outcome: "Instrumental in 4 successful orbital insertion missions.",
        events: []
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
        events: []
      },
      {
        id: "real-kyoto-02",
        universeId: "uni-tokyo-02",
        name: "Digital Nomad Agency",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Ran a remote creative agency from temples and machiyas across Kansai.",
        career: "Creative Technologist",
        industry: "Agency",
        location: "Osaka, Japan",
        skills: ["Remote Ops", "Creative Coding"],
        opportunities: ["Global clientele"],
        challenges: ["Timezone coordination"],
        outcome: "High freedom with diverse international portfolio.",
        events: []
      }
    ]
  },
  {
    id: "uni-biotech-03",
    originalDecision: "What if I went into Computational Biology instead of Tech?",
    category: "Education",
    durationYears: 10,
    createdAt: Date.now() - 86400000 * 14,
    bookmarked: true,
    realities: [
      {
        id: "real-bio-01",
        universeId: "uni-biotech-03",
        name: "Protein Folding AI Researcher",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Trained molecular dynamics transformers for targeted antibody therapeutics.",
        career: "Principal Bioinformatician",
        industry: "Biotech & AI",
        location: "Boston, MA",
        skills: ["PyTorch", "Structural Biology", "Cryo-EM"],
        opportunities: ["Clinical trial candidate synthesis"],
        challenges: ["Complex laboratory validation"],
        outcome: "Co-founded a clinical-stage drug discovery company.",
        events: []
      },
      {
        id: "real-bio-02",
        universeId: "uni-biotech-03",
        name: "Academic Professor",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Secured tenure track researching algorithmic genomics.",
        career: "Associate Professor",
        industry: "Higher Education",
        location: "Cambridge, UK",
        skills: ["Grant Writing", "Genomics", "Mentorship"],
        opportunities: ["EU Horizon Research Grant"],
        challenges: ["Academic administration"],
        outcome: "Trained 12 PhD candidates with 20+ published papers.",
        events: []
      }
    ]
  }
];

function getRaw() {
  if (typeof window === "undefined" || !window.localStorage) return SAMPLE_UNIVERSES;
  
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // Seed initial demo data so the app looks like the reference design out of the box
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
