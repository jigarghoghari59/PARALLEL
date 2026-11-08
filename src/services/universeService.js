// src/services/universeService.js

const STORAGE_KEY = "parallel.universes";
const INITIALIZED_KEY = "parallel.initialized_v2";

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
        name: "Mechanical Engineering",
        type: "alternative",
        parentRealityId: "real-software-dev",
        parentEventId: "evt-01",
        summary: "A different path, a different you. You pivoted from pure software into physical computing, robotics and intelligent automation.",
        career: "Robotics Engineer",
        industry: "Automation",
        location: "Bangalore, India",
        skills: ["Robotics", "AI", "Engineering", "Mechanical Design"],
        opportunities: ["Research", "Startups", "Innovation"],
        challenges: ["High Technical Demands"],
        outcome: "A Pioneer in Robotics Field",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
        events: [
          {
            id: "evt-m1",
            order: 1,
            year: 2026,
            age: 18,
            title: "You Choose Mechanical Engineering",
            description: "A new chapter begins at college, where you explore the world of machines and design.",
            category: "Milestone",
            skills: ["Mechanical Design", "CAD Modeling", "Thermodynamics"],
            opportunities: ["Hands-on fabrication labs", "University robotics club lead"],
            challenges: ["Intense technical curriculum"],
            consequences: "Built exceptional mechanical intuitions that set the foundation for your career."
          },
          {
            id: "evt-m2",
            order: 2,
            year: 2028,
            age: 20,
            title: "Discover Robotics",
            description: "You fall in love with robotics and automation during a major project.",
            category: "Growth",
            skills: ["Robotics", "ROS 2", "Embedded Systems", "Sensor Fusion"],
            opportunities: ["Autonomous rover challenge finalist", "Faculty lab fellowship"],
            challenges: ["Balancing software bugs with physical wiring burnouts"],
            consequences: "Permanently shifted career trajectory toward intelligent physical automation."
          },
          {
            id: "evt-m3",
            order: 3,
            year: 2030,
            age: 22,
            title: "Join an Automation Startup",
            description: "You start working at a rising robotics startup in Bangalore.",
            category: "Career",
            skills: ["Industrial Automation", "Control Systems", "C++", "Python"],
            opportunities: ["Direct prototype ownership", "Commercial warehouse deployments"],
            challenges: ["High-stakes client deadlines and supply chain lead times"],
            consequences: "Scaled initial fleet of 40 autonomous transport robots across Indian logistics hubs."
          },
          {
            id: "evt-m4",
            order: 4,
            year: 2032,
            age: 24,
            title: "Lead a Research Team",
            description: "You lead a team working on next-gen AI robots for industrial use.",
            category: "Achievement",
            skills: ["AI Vision", "Manipulator Kinematics", "Technical Leadership"],
            opportunities: ["First author on robotic manipulation patent", "Global automation summit speaker"],
            challenges: ["High Technical Demands", "Managing cross-functional engineers"],
            consequences: "Pioneered sub-millimeter vision-guided pick-and-place precision at scale."
          },
          {
            id: "evt-m5",
            order: 5,
            year: 2035,
            age: 27,
            title: "Build a Global Impact",
            description: "Your innovations help automate industries across the world.",
            category: "Legacy",
            skills: ["System Architecture", "Global Strategy", "Ethical AI Robotics"],
            opportunities: ["Founding consortium advisor", "Multi-national industrial partnerships"],
            challenges: ["Navigating international standards and workforce displacement ethics"],
            consequences: "Cemented status as an internationally recognized pioneer in building intelligent machines."
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
    setRaw(SAMPLE_UNIVERSES);
    localStorage.setItem(INITIALIZED_KEY, "true");
    return SAMPLE_UNIVERSES;
  }
  
  try {
    const parsed = JSON.parse(raw);
    // Ensure sample universe has the rich events if still using old sample
    if (Array.isArray(parsed)) {
      const sample = parsed.find((u) => u.id === "uni-computer-eng-01");
      if (sample) {
        const mech = sample.realities?.find((r) => r.id === "real-mechanical-eng");
        if (mech && (!mech.events || mech.events.length < 5)) {
          const freshSample = SAMPLE_UNIVERSES.find((u) => u.id === "uni-computer-eng-01");
          if (freshSample) {
            const freshMech = freshSample.realities.find((r) => r.id === "real-mechanical-eng");
            if (freshMech) {
              mech.events = freshMech.events;
              mech.name = freshMech.name;
              mech.summary = freshMech.summary;
              mech.career = freshMech.career;
              mech.industry = freshMech.industry;
              mech.skills = freshMech.skills;
              mech.opportunities = freshMech.opportunities;
              mech.challenges = freshMech.challenges;
              mech.outcome = freshMech.outcome;
              setRaw(parsed);
            }
          }
        }
      }
    }
    return parsed;
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
  addReality(universeId, reality) {
    const list = getRaw();
    const uni = list.find((u) => u.id === universeId);
    if (!uni) return null;
    if (!Array.isArray(uni.realities)) uni.realities = [];
    const existingIndex = uni.realities.findIndex((r) => r.id === reality.id);
    if (existingIndex >= 0) {
      uni.realities[existingIndex] = { ...uni.realities[existingIndex], ...reality };
    } else {
      uni.realities.push(reality);
    }
    setRaw(list);
    return uni;
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
