export const categories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Applications" },
  { id: "interactive", label: "Interactive Experiences" },
  { id: "experiments", label: "Tools & Experiments" }
];

export const projects = [
  {
    id: "chrezaa",
    number: "01",
    title: "Chrezaa Atelier",
    subtitle: "Luxury Women's Fashion & Boutique E-Commerce",
    category: "Web Applications",
    categorySlug: "web",
    year: "2026",
    status: "Production Live",
    accentColor: "#FF8066", // Coral
    accentBg: "rgba(255, 128, 102, 0.1)",
    accentBorder: "rgba(255, 128, 102, 0.28)",
    cardTint: "#FFF8F6",
    layout: "featured",
    image: "/projects/chrezaa.jpg",
    liveUrl: "https://6ad435c390ed2d78279911b9--chrezaa.netlify.app/",
    alternateUrl: "https://chrezaa.netlify.app/",
    githubUrl: "https://github.com/ymitesh760-star/Womens-Fashion-",
    description:
      "A high-end luxury fashion boutique and e-commerce experience tailored for contemporary women's wear, featuring editorial product cataloging, cart mechanics, fluid micro-interactions, and WhatsApp direct checkout order pipeline.",
    overview:
      "Chrezaa represents an editorial approach to contemporary boutique retail. Built to eliminate checkout friction, it blends the luxury visual language of Parisian fashion ateliers with lightning-fast static delivery and an instant WhatsApp-powered conversational ordering pipeline.",
    technologies: [
      "React.js",
      "Vite",
      "Tailwind CSS",
      "WhatsApp Cloud API",
      "Cart State Management",
      "Netlify Edge"
    ],
    highlights: [
      "Direct-to-WhatsApp instant order dispatch with detailed itemized cart summaries",
      "Editorial product grid with fluid hover previews, quick views, and category filters",
      "Sub-second load times on Netlify global edge network with zero layout shifts",
      "Accessible touch-first design crafted for mobile shoppers and desktop connoisseurs"
    ]
  },
  {
    id: "pathfinding",
    number: "02",
    title: "Pathfinding Visualizer",
    subtitle: "Interactive Graph Algorithms & Traversal Sandbox",
    category: "Tools & Experiments",
    categorySlug: "experiments",
    year: "2026",
    status: "Production Live",
    accentColor: "#14B8A6", // Mint/Teal
    accentBg: "rgba(20, 184, 166, 0.1)",
    accentBorder: "rgba(20, 184, 166, 0.28)",
    cardTint: "#F4FBFA",
    layout: "interactive",
    image: null,
    hasSimulation: true,
    liveUrl: "https://pathfinding-visualizer-react-js-pro.vercel.app/",
    githubUrl: "https://github.com/ymitesh760-star/pathfinding-visualizer-React.js-Project-",
    description:
      "An interactive algorithm sandbox built to simulate, benchmark, and visualize shortest-path search heuristics and real-time maze traversal between coordinates with weighted graph exploration.",
    overview:
      "Built to demystify complex computer science graph algorithms, Pathfinding Visualizer allows students and engineers to benchmark how A* Search, Dijkstra's algorithm, BFS, and DFS traverse discrete coordinate grids under obstacle constraints.",
    technologies: [
      "React.js",
      "JavaScript (ES6+)",
      "A* Heuristic Search",
      "Dijkstra's Algorithm",
      "BFS & DFS",
      "CSS Grid Engine",
      "Vercel"
    ],
    highlights: [
      "Heuristic comparisons highlighting Manhattan distance traversal efficiency",
      "Interactive obstacle creation, dynamic wall placement, and reset controls",
      "Accurate telemetry: visited node count, shortest path length, and latency benchmarking",
      "Frame-by-frame traversal visualization tuned for smooth 60fps performance"
    ]
  },
  {
    id: "milletmorn",
    number: "03",
    title: "MilletMorn Platform",
    subtitle: "DTC Health-Tech Breakfast & Launch Platform",
    category: "Interactive Experiences",
    categorySlug: "interactive",
    year: "2026",
    status: "Production Live",
    accentColor: "#E08736", // Warm Amber
    accentBg: "rgba(224, 135, 54, 0.1)",
    accentBorder: "rgba(224, 135, 54, 0.28)",
    cardTint: "#FFFBF5",
    layout: "featured",
    image: "/projects/milletmorn-product.png",
    liveUrl: "https://milletmorn-app.vercel.app/",
    githubUrl: "https://github.com/ymitesh760-star/GTM-Case-Study-",
    description:
      "A modern DTC web platform and digital launch experience for a ready-to-cook 500g millet breakfast mix designed for busy mornings, featuring product storytelling and nutrition metrics.",
    overview:
      "Created as an end-to-end Go-To-Market (GTM) case study, MilletMorn marries direct-to-consumer digital commerce with nutritional transparency. The application presents interactive health metric calculators, origin storytelling, and a conversion-tailored pre-order funnel.",
    technologies: [
      "React.js",
      "Tailwind CSS",
      "GTM Funnel Strategy",
      "Product Storytelling",
      "Nutrition Calculator",
      "Vercel Deployment"
    ],
    highlights: [
      "High-converting landing architecture centered around morning productivity pain points",
      "Interactive nutritional comparison slider evaluating millets against conventional grains",
      "Mobile-optimized pre-order pipeline with instant customer feedback",
      "Organic color palette grounded in warm parchment and golden wheat tones"
    ]
  },
  {
    id: "portfolio",
    number: "04",
    title: "Portfolio Architecture",
    subtitle: "Creative Developer Identity & Motion Showcase",
    category: "Interactive Experiences",
    categorySlug: "interactive",
    year: "2026",
    status: "Production Live",
    accentColor: "#4169E1", // Cobalt Blue
    accentBg: "rgba(65, 105, 225, 0.1)",
    accentBorder: "rgba(65, 105, 225, 0.28)",
    cardTint: "#F7F9FF",
    layout: "standard",
    image: null,
    previewType: "portfolio-brand",
    liveUrl: "https://mitesh-s-portfolio-ebon.vercel.app/",
    githubUrl: "https://github.com/ymitesh760-star/Mitesh-s-Portfolio",
    description:
      "An editorial personal portfolio featuring fluid scroll dynamics, bespoke typography, smooth transitions, and interactive showcase mechanisms.",
    overview:
      "The flagship digital identity of Mitesh Yadav. Crafted with meticulous attention to typography, micro-interactions, and spatial layout, it features smooth inertial scroll choreography and refined aesthetic balance.",
    technologies: [
      "React.js",
      "Vite",
      "Framer Motion",
      "Lenis Smooth Scroll",
      "Modern CSS",
      "Vercel"
    ],
    highlights: [
      "Smooth micro-interactions and scroll dynamics engineered with Framer Motion",
      "Carefully chosen typography pairing Syne with Plus Jakarta Sans",
      "Responsive accessibility compliance including automatic reduced-motion detection",
      "Clean modular code structure and fast production bundle"
    ]
  },
  {
    id: "careerhub",
    number: "05",
    title: "CareerHub Engine",
    subtitle: "Full-Stack Job Application Portal & Candidate Pipeline",
    category: "Web Applications",
    categorySlug: "web",
    year: "2025",
    status: "Code Repository",
    accentColor: "#6366F1", // Indigo
    accentBg: "rgba(99, 102, 241, 0.1)",
    accentBorder: "rgba(99, 102, 241, 0.28)",
    cardTint: "#F8F9FE",
    layout: "standard",
    image: null,
    previewType: "dashboard-portal",
    liveUrl: null,
    githubUrl: "https://github.com/ymitesh760-star/careerhub",
    description:
      "A comprehensive career portal engineered with Express.js and RESTful architecture, facilitating job postings, applicant tracking, resume filtering, and status pipelines.",
    overview:
      "CareerHub solves the friction between applicants and hiring teams by offering a clean, unified platform for vacancy listings, applicant submissions, and recruiter review stages. Built using modular MVC conventions for robust backend extensibility.",
    technologies: [
      "Node.js",
      "Express.js",
      "RESTful API Design",
      "JavaScript (ES6+)",
      "MVC Architecture",
      "Authentication"
    ],
    highlights: [
      "Structured MVC backend architecture with clean separation of services and routes",
      "Secure RESTful endpoint routing for candidate submissions and recruiter workflows",
      "Comprehensive data validation middleware preventing malformed submissions",
      "Scalable database schemas for persistent application lifecycle management"
    ]
  },
  {
    id: "chess-game",
    number: "06",
    title: "Chess Engine & 3D AI",
    subtitle: "Tactical Game State Tree & Real-Time 3D Simulation",
    category: "Tools & Experiments",
    categorySlug: "experiments",
    year: "2025",
    status: "Code Repository",
    accentColor: "#8B5CF6", // Lavender / Purple
    accentBg: "rgba(139, 92, 246, 0.1)",
    accentBorder: "rgba(139, 92, 246, 0.28)",
    cardTint: "#FAF8FF",
    layout: "standard",
    image: null,
    has3DCanvas: true,
    is3DChess: true,
    previewType: "chess-3d",
    liveUrl: null,
    githubUrl: "https://github.com/ymitesh760-star/c-Case-study-Chess-Game",
    description:
      "A real-time 3D WebGL tactical chessboard paired with a C++ chess simulation and engine exploring game-tree traversal, position evaluation matrices, move validation, and optimal AI decision-making.",
    overview:
      "A deep dive into systems programming, 3D visualization, and heuristic decision theory. Implemented in modern C++ with an interactive Three.js 3D board interface, this engine models 8x8 chessboard bitwise state representation, legal move generation (including castling, en passant, promotion), and recursive Minimax lookahead.",
    technologies: [
      "Three.js",
      "WebGL Engine",
      "C++ (C++17)",
      "Minimax Algorithm",
      "Alpha-Beta Pruning",
      "Procedural Geometry"
    ],
    highlights: [
      "Procedural 3D checkered board with turned wooden pieces and soft contact shadows",
      "Tactical board state highlighting active engine outposts and move evaluations",
      "Multi-point studio lighting with directional sun, fill, rim light, and soft contact shadows",
      "Interactive 3D board rotation with pointer dragging and mouse parallax tracking",
      "Telemetry insights: search depth, alpha-beta evaluation score, and node throughput"
    ]
  },
  {
    id: "elibrary",
    number: "07",
    title: "E-Library Digital System",
    subtitle: "Digital Catalog, Borrowing Workflow & Management System",
    category: "Web Applications",
    categorySlug: "web",
    year: "2025",
    status: "Code Repository",
    accentColor: "#E11D48", // Rosewood / Coral
    accentBg: "rgba(225, 29, 72, 0.08)",
    accentBorder: "rgba(225, 29, 72, 0.25)",
    cardTint: "#FFF8F9",
    layout: "standard",
    image: null,
    previewType: "library-system",
    liveUrl: null,
    githubUrl: "https://github.com/ymitesh760-star/E-Library",
    description:
      "An intuitive web-based library management platform providing real-time book cataloging, user borrowing records, search indexing, and return tracking.",
    overview:
      "Designed to streamline institutional cataloging, E-Library offers librarians and members a zero-friction interface for browsing, loaning, and tracking literary volumes. Leverages local persistence for instant state recall without external database dependencies.",
    technologies: [
      "HTML5 Semantic Markup",
      "Modern CSS3 Layouts",
      "JavaScript (Vanilla ES6+)",
      "LocalStorage API",
      "DOM Architecture"
    ],
    highlights: [
      "Client-side catalog search with multi-parameter filtering across author and ISBN",
      "Dynamic loan duration calculator with visual indicators for overdue returns",
      "Persistent user borrowing cart backed by browser LocalStorage",
      "Clean editorial card catalog design inspired by classic university archival indexes"
    ]
  }
];

export const profileInfo = {
  name: "Mitesh Yadav",
  shortName: "MY",
  title: "Frontend Developer & Creative Coder",
  location: "Mumbai, Maharashtra, India",
  timezone: "Asia/Kolkata",
  email: "ymitesh760@gmail.com",
  github: "https://github.com/ymitesh760-star",
  linkedin: "https://www.linkedin.com/in/mitesh-yadav-b89192415/",
  portfolio: "https://mitesh-s-portfolio-ebon.vercel.app/",
  tagline: "Building lively, high-performance web applications with craft, care, and clean code.",
  statusText: "Open to full-time frontend developer roles & creative collaborations",
  aboutBio: [
    "Hi, I'm Mitesh Yadav—a frontend developer and Computer Science student based in Mumbai. I enjoy building lively, high-performance web applications that combine clean code with thoughtful design.",
    "Rather than treating interfaces as mere code templates, I care about how they feel to real people: snappy load times, intuitive typography, smooth natural animations, and balanced negative space.",
    "From launching full-stack boutique retail platforms like Chrezaa to building interactive graph algorithm simulators and C++ game engines, I am constantly learning, refining my craft, and shipping real projects."
  ],
  skills: [
    {
      category: "Frontend Core",
      color: "#4169E1", // Cobalt
      items: ["React.js", "JavaScript (ES6+)", "TypeScript", "HTML5 & Modern CSS", "Tailwind CSS", "Vite"]
    },
    {
      category: "Animation & Interactivity",
      color: "#B9A7F5", // Soft Lavender
      items: ["Framer Motion", "CSS Choreography", "Three.js / WebGL", "Canvas API", "Responsive Layouts"]
    },
    {
      category: "Backend & Systems",
      color: "#FF8066", // Coral
      items: ["Node.js", "Express.js", "RESTful APIs", "C++ Systems", "Algorithms & Data Structures", "Git & GitHub"]
    }
  ]
};
