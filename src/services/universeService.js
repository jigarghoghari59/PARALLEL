// src/services/universeService.js

const STORAGE_KEY = "parallel.universes";
const INITIALIZED_KEY = "parallel.initialized_v3";

export const SAMPLE_UNIVERSES = [
  {
    id: "uni-computer-eng-01",
    title: "My Actual Timeline",
    originalDecision: "Choose Computer Engineering",
    pathText: "Computer Engineering → Software Development",
    category: "Career",
    status: "original",
    badgeColor: "sage",
    durationYears: 10,
    createdAt: 1761480000000, // Oct 26, 2025
    bookmarked: true,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
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
    id: "uni-mech-eng-02",
    title: "Mechanical Engineer",
    originalDecision: "Specialize in Autonomous Systems & Robotics",
    pathText: "Mechanical Engineering → Robotics Engineer",
    category: "Career",
    status: "alternative",
    badgeColor: "purple",
    durationYears: 10,
    createdAt: 1761393600000, // Oct 25, 2025
    bookmarked: false,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    realities: [
      {
        id: "real-mech-core",
        universeId: "uni-mech-eng-02",
        name: "Robotics Engineer",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Focused on precision kinematics and industrial automation solutions.",
        career: "Robotics Engineer",
        industry: "Automation",
        location: "Bangalore, India",
        skills: ["Kinematics", "ROS 2", "Mechanical Design"],
        opportunities: ["Commercial robotics lead"],
        challenges: ["High technical demands"],
        outcome: "Pioneered industrial arm automation.",
        events: [
          { id: "e-m1", order: 1, year: 2026, title: "Robotics Initiation", description: "Began automation prototyping.", category: "Milestone" },
          { id: "e-m2", order: 2, year: 2029, title: "Industrial Deployment", description: "Deployed 20+ automated workcells.", category: "Career" }
        ]
      },
      {
        id: "real-mech-lead",
        universeId: "uni-mech-eng-02",
        name: "Autonomous Systems Lead",
        type: "alternative",
        parentRealityId: "real-mech-core",
        parentEventId: "e-m1",
        summary: "Led bipedal and mobile robotics initiatives.",
        career: "Autonomous Systems Lead",
        industry: "Automation",
        location: "Tokyo, Japan",
        skills: ["Embedded C++", "Sensor Fusion"],
        opportunities: ["Global AI robotics consortium"],
        challenges: ["Real-time synchronization"],
        outcome: "Key patent author in autonomous navigation.",
        events: [
          { id: "e-m3", order: 1, year: 2028, title: "Sensor Fusion Milestone", description: "Achieved zero-latency obstacle avoidance.", category: "Achievement" }
        ]
      }
    ]
  },
  {
    id: "uni-auto-path-03",
    title: "Automotive Path",
    originalDecision: "Join High-Performance EV Automotive Studio",
    pathText: "Mechanical Engineering → Automotive Design",
    category: "Career",
    status: "alternative",
    badgeColor: "sage",
    durationYears: 8,
    createdAt: 1761393600000, // Oct 25, 2025
    bookmarked: true,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    realities: [
      {
        id: "real-auto-aero",
        universeId: "uni-auto-path-03",
        name: "Automotive Design Specialist",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Sculpted aerodynamic silhouettes for electric hypercars.",
        career: "EV Aerodynamicist",
        industry: "Automotive",
        location: "Stuttgart, Germany",
        skills: ["CFD Aerodynamics", "Industrial Clay Modeling", "Carbon Fiber Composite Design"],
        opportunities: ["Le Mans prototype team"],
        challenges: ["Extreme drag vs cooling trade-offs"],
        outcome: "Designed record-breaking aerodynamic chassis.",
        events: [
          { id: "e-a1", order: 1, year: 2026, title: "Wind Tunnel Lead", description: "Optimized downforce coefficient by 18%.", category: "Milestone" }
        ]
      },
      {
        id: "real-auto-motorsport",
        universeId: "uni-auto-path-03",
        name: "Motorsport Technical Lead",
        type: "alternative",
        parentRealityId: "real-auto-aero",
        parentEventId: "e-a1",
        summary: "Trackside engineering for electric formula racing.",
        career: "Race Team Technical Director",
        industry: "Motorsport",
        location: "Monaco",
        skills: ["Telemetry Analytics", "Chassis Dynamics"],
        opportunities: ["World Championship podium"],
        challenges: ["Split-second decisions under high pressure"],
        outcome: "Led team to first international championship title.",
        events: [
          { id: "e-a2", order: 1, year: 2029, title: "Championship Victory", description: "Clinched title at season finale.", category: "Achievement" }
        ]
      }
    ]
  },
  {
    id: "uni-tech-ent-04",
    title: "Tech Entrepreneur",
    originalDecision: "Drop out of Corporate Tech to Build an AI Startup",
    pathText: "Computer Engineering → Startup Founder",
    category: "Career",
    status: "alternative",
    badgeColor: "blue",
    durationYears: 10,
    createdAt: 1760961600000, // Oct 20, 2025
    bookmarked: false,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
    realities: [
      {
        id: "real-seed-founder",
        universeId: "uni-tech-ent-04",
        name: "Startup Founder & CEO",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Bootstrapped from a bedroom into an international developer platform.",
        career: "Startup Founder",
        industry: "Venture Tech",
        location: "San Francisco, CA",
        skills: ["Product Vision", "Fundraising", "GTM Strategy"],
        opportunities: ["Y Combinator batch lead", "Tier-1 VC funding"],
        challenges: ["Cash runway volatility", "Rapid hiring scaling pains"],
        outcome: "Built an enduring tech infrastructure company with 100k+ developers.",
        events: [
          { id: "e-t1", order: 1, year: 2026, title: "YC Demo Day", description: "Closed $3M seed round within 48 hours.", category: "Milestone" },
          { id: "e-t2", order: 2, year: 2028, title: "Series A Expansion", description: "Expanded to 45 distributed engineers.", category: "Growth" }
        ]
      },
      {
        id: "real-venture-partner",
        universeId: "uni-tech-ent-04",
        name: "Venture Partner",
        type: "alternative",
        parentRealityId: "real-seed-founder",
        parentEventId: "e-t2",
        summary: "Transitioned from operator to early-stage deep-tech investor.",
        career: "Venture Capital Partner",
        industry: "Venture Capital",
        location: "Palo Alto, CA",
        skills: ["Market Diligence", "Board Advisory"],
        opportunities: ["Backing the next generation of founders"],
        challenges: ["Portfolio risk management"],
        outcome: "Recognized as a Forbes Midas List emerging investor.",
        events: [
          { id: "e-t3", order: 1, year: 2031, title: "Fund Inauguration", description: "Launched $80M inaugural developer tools fund.", category: "Achievement" }
        ]
      },
      {
        id: "real-angel-investor",
        universeId: "uni-tech-ent-04",
        name: "Angel Syndicate Lead",
        type: "alternative",
        parentRealityId: "real-seed-founder",
        parentEventId: "e-t1",
        summary: "Supported 30+ early stage technical founders.",
        career: "Angel Investor",
        industry: "Angel Investing",
        location: "Austin, TX",
        skills: ["Deal Sourcing", "Mentorship"],
        opportunities: ["High-impact advisory"],
        challenges: ["Early failure rates"],
        outcome: "Portfolio returned 12x net capital.",
        events: []
      },
      {
        id: "real-growth-ceo",
        universeId: "uni-tech-ent-04",
        name: "Enterprise Cloud CEO",
        type: "alternative",
        parentRealityId: "real-seed-founder",
        parentEventId: "e-t2",
        summary: "Scaled enterprise revenue past $50M ARR.",
        career: "Enterprise CEO",
        industry: "Enterprise SaaS",
        location: "New York, NY",
        skills: ["Enterprise Sales", "Executive Leadership"],
        opportunities: ["Global customer expansion"],
        challenges: ["Macro tech contraction"],
        outcome: "Prepared company for Nasdaq public listing.",
        events: []
      }
    ]
  },
  {
    id: "uni-peaceful-05",
    title: "Peaceful Life",
    originalDecision: "Leave Corporate Grind for Alpine Living",
    pathText: "Career Change → Travel Blogger",
    category: "Lifestyle",
    status: "alternative",
    badgeColor: "sage",
    durationYears: 6,
    createdAt: 1760788800000, // Oct 18, 2025
    bookmarked: true,
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
    realities: [
      {
        id: "real-alpine-writer",
        universeId: "uni-peaceful-05",
        name: "Travel & Wilderness Chronicler",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Swapped screen glare for mountain air, writing essays and capturing remote landscapes.",
        career: "Travel Blogger & Nature Writer",
        industry: "Creative Publishing",
        location: "Interlaken, Switzerland",
        skills: ["Landscape Photography", "Long-form Prose", "Slow Living"],
        opportunities: ["National Geographic feature contributor"],
        challenges: ["Seasonal connectivity and isolation"],
        outcome: "Cultivated a loyal global readership of 400k mindful explorers.",
        events: [
          { id: "e-p1", order: 1, year: 2026, title: "First Alpine Cabin", description: "Set up sustainable solar-powered writing studio.", category: "Milestone" },
          { id: "e-p2", order: 2, year: 2028, title: "Book Publication", description: "Bestselling memoir on intentional deceleration.", category: "Legacy" }
        ]
      }
    ]
  },
  {
    id: "uni-space-06",
    title: "Space Researcher",
    originalDecision: "Pursue Deep Space Exploration Fellowship",
    pathText: "Aerospace Engineering → Space Scientist",
    category: "Education",
    status: "alternative",
    badgeColor: "purple",
    durationYears: 12,
    createdAt: 1760529600000, // Oct 15, 2025
    bookmarked: false,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    realities: [
      {
        id: "real-orbital-mechanics",
        universeId: "uni-space-06",
        name: "Space Scientist",
        type: "alternative",
        parentRealityId: null,
        parentEventId: null,
        summary: "Calculating gravitational slingshots and orbital insertion vectors for outer-solar exploration.",
        career: "Space Scientist",
        industry: "Aerospace Research",
        location: "Pasadena, CA",
        skills: ["Astrodynamics", "Radio Astronomy", "Orbital Kinematics"],
        opportunities: ["Lead trajectory designer on Europa mission"],
        challenges: ["Extreme precision tolerances with decade-long flight times"],
        outcome: "Pioneered novel low-energy lunar transfer trajectories.",
        events: [
          { id: "e-s1", order: 1, year: 2026, title: "JPL Fellowship", description: "Joined Outer Planets mission trajectory group.", category: "Milestone" },
          { id: "e-s2", order: 2, year: 2030, title: "Europa Trajectory Lock", description: "Finalized flight path with zero orbital margin of error.", category: "Achievement" }
        ]
      },
      {
        id: "real-planetary-geo",
        universeId: "uni-space-06",
        name: "Planetary Geologist",
        type: "alternative",
        parentRealityId: "real-orbital-mechanics",
        parentEventId: "e-s1",
        summary: "Analyzing subsurface ice radar scans from Martian probes.",
        career: "Planetary Geologist",
        industry: "Space Science",
        location: "Boulder, CO",
        skills: ["Spectroscopy", "Remote Sensing"],
        opportunities: ["First author on astrobiology paper"],
        challenges: ["Incomplete spectral sensor data"],
        outcome: "Identified high-probability subsurface aquifer candidate.",
        events: []
      },
      {
        id: "real-deep-space-lead",
        universeId: "uni-space-06",
        name: "Deep Space Mission Director",
        type: "alternative",
        parentRealityId: "real-orbital-mechanics",
        parentEventId: "e-s2",
        summary: "Directing deep space probe operations at the flight control desk.",
        career: "Mission Director",
        industry: "Space Operations",
        location: "Houston, TX",
        skills: ["Crisis Management", "Spacecraft Telemetry"],
        opportunities: ["Directing historical probe flybys"],
        challenges: ["45-minute light-speed communication delays"],
        outcome: "Delivered probe into Jovian orbit without anomalies.",
        events: []
      }
    ]
  }
];

let memoryStore = null;

function getRaw() {
  if (typeof window === "undefined" || !window.localStorage) {
    if (!memoryStore) {
      memoryStore = JSON.parse(JSON.stringify(SAMPLE_UNIVERSES));
    }
    return memoryStore;
  }
  
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    setRaw(SAMPLE_UNIVERSES);
    localStorage.setItem(INITIALIZED_KEY, "true");
    return JSON.parse(JSON.stringify(SAMPLE_UNIVERSES));
  }
  
  try {
    const parsed = JSON.parse(raw);
    const hasInitializedV3 = localStorage.getItem(INITIALIZED_KEY);
    if (!hasInitializedV3) {
      // Reset to updated 6 rich universes matching the reference UI
      setRaw(SAMPLE_UNIVERSES);
      localStorage.setItem(INITIALIZED_KEY, "true");
      return JSON.parse(JSON.stringify(SAMPLE_UNIVERSES));
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function setRaw(arr) {
  memoryStore = arr;
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
