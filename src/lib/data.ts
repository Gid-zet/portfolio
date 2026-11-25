export const profile = {
  name: "Gideon Adonteng",
  brand: "Gidzet",
  email: "adontenggideon57@gmail.com",
  phone: "+233 50 030 3230",
  location: "Accra, Ghana",
  timezone: "Africa/Accra",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gideon-adonteng-995322208/" },
    { label: "GitHub", href: "https://github.com/Gid-zet7" },
    { label: "Fiverr", href: "http://www.fiverr.com/s/vvpLZ2N" },
  ],
};

export const roles = ["Web Developer", "UI Designer", "Motion Designer", "Creative Technologist"];
export const principles = ["Clean Code", "Modular Design", "Pixel Perfect", "Fluid Motion"];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  client: string;
  services: string[];
  year: string;
  image: string;
  accent: string;
  live: string;
  /** Omitted for private client repositories. */
  github?: string;
};

export const projects: Project[] = [
  {
    name: "EverythingVA",
    tagline: "An AI workspace for mail, calendar, tasks and growth",
    description:
      "A full-stack AI assistant that brings Gmail, Outlook and iCloud together with a calendar, a Linear-style task manager with streaks and reminders, procurement bid tracking, lead generation and a job-search tracker. AI sorts and drafts mail, qualifies leads, scores tenders and tailors CVs, and always asks before it acts.",
    client: "Winnck Enterprise",
    services: ["Full Stack Development", "AI Integration", "Product Design"],
    year: "2026",
    image: "/work/everythingva-2026.jpg",
    accent: "#7c5cff",
    live: "https://everythingva-brown.vercel.app/",
    github: "https://github.com/Gid-zet/everythingVA",
  },
  {
    name: "Cummings Consulting & Management",
    tagline: "Interactive leadership-development website",
    description:
      "A scroll-driven storytelling site for a leadership consultancy: a 3D brain you can explore in the Leadership Lens tool, a Growth Compass assessment, an interactive DiSC model and a pinwheel that spins with your scroll. Every form feeds GoHighLevel, creating contacts, tags and pipeline opportunities automatically.",
    client: "Cummings Consulting & Management",
    services: ["Web Design", "3D & Motion", "CRM Integration"],
    year: "2026",
    image: "/work/ccm.jpg",
    accent: "#a0367c",
    live: "https://cummingscm.vercel.app/",
  },
  {
    name: "AI Bible",
    tagline: "Real-Time Audio-to-Scripture Processing",
    description:
      "Developed an application that processes live audio during sermons to display relevant Bible quotations in real-time. It leverages speech-to-text combined with search algorithms to provide an immersive scriptural experience during live events.",
    client: "Self-Initiated",
    services: ["Real-time Processing", "Speech AI"],
    year: "2025",
    image: "/work/aibible.jpg",
    accent: "#e9a23b",
    live: "https://aibible.app",
    github: "https://github.com/Gid-zet7/ai-bible",
  },
  {
    name: "Tillyn eCommerce",
    tagline: "Full-Stack Fashion Online Store",
    description:
      "Engineered a full-stack eCommerce platform featuring a functional dashboard for inventory and order management. Implemented data-driven analytics to track customer orders and update real-time fulfillment statuses.",
    client: "Tillyn Clothings",
    services: ["Dashboard Design", "Order Management", "Analytics"],
    year: "2024",
    image: "/work/tillyn.jpg",
    accent: "#ec4899",
    live: "https://tillyn.com",
    github: "https://github.com/Gid-zet7/tillyn-store",
  },
];

export type MotionPiece = {
  title: string;
  client: string;
  kind: string;
  src: string;
  poster: string;
  ratio: "16/9" | "9/16" | "1/1";
  duration: string;
  sound: boolean;
  blurb: string;
};

/** Motion work rendered in code (HyperFrames / GSAP) and compressed for the web. */
export const motionWork: MotionPiece[] = [
  {
    title: "How your brain creates your reality",
    client: "CCM · Leadership Lens",
    kind: "Explainer film",
    src: "/motion/work/leadership-lens-brain.mp4",
    poster: "/motion/work/leadership-lens-brain.jpg",
    ratio: "16/9",
    duration: "1:39",
    sound: true,
    blurb: "An explainer for the Leadership Lens tool on how the brain turns events into interpretation, with a glowing neural model and kinetic type.",
  },
  {
    title: "CalMe brand film",
    client: "CalMe",
    kind: "Brand film",
    src: "/motion/work/calme-film.mp4",
    poster: "/motion/work/calme-film.jpg",
    ratio: "16/9",
    duration: "0:20",
    sound: true,
    blurb: "A playful identity film for a mental-wellness brand, with doodles, stickers and the CalMe logo reveal.",
  },
  {
    title: "Training that sticks",
    client: "Cummings Consulting & Management",
    kind: "Social story · 9:16",
    src: "/motion/work/ccm-training-story.mp4",
    poster: "/motion/work/ccm-training-story.jpg",
    ratio: "9/16",
    duration: "0:21",
    sound: true,
    blurb: "A vertical story ad with an animated phone UI browsing leadership and team trainings.",
  },
  {
    title: "Dims Premium Services promo",
    client: "DPS",
    kind: "Promo · 9:16",
    src: "/motion/work/dps-promo.mp4",
    poster: "/motion/work/dps-promo.jpg",
    ratio: "9/16",
    duration: "0:32",
    sound: true,
    blurb: "Clean spaces, zero stress: a bright vertical promo for a cleaning company, with a glassy logo card and soft bubbles.",
  },
  {
    title: "GRIT: something you build",
    client: "CCM · GRIT Leadership Series",
    kind: "Concept film",
    src: "/motion/work/grit-pinwheel.mp4",
    poster: "/motion/work/grit-pinwheel.jpg",
    ratio: "16/9",
    duration: "1:08",
    sound: false,
    blurb: "A moody 3D pinwheel film for the GRIT Leadership Series: grit isn't something you simply have, it's something you build.",
  },
  {
    title: "Strata: every home, layer by layer",
    client: "Strata Homes",
    kind: "Product animation",
    src: "/motion/work/strata-exploded-view.mp4",
    poster: "/motion/work/strata-exploded-view.jpg",
    ratio: "16/9",
    duration: "0:27",
    sound: false,
    blurb: "An exploded 3D view of a modern house for a real-estate platform: every home, layer by layer.",
  },
  {
    title: "Forgotten by Monday",
    client: "CCM · GRIT Leadership Series",
    kind: "Social ad · 1:1",
    src: "/motion/work/grit-square.mp4",
    poster: "/motion/work/grit-square.jpg",
    ratio: "1/1",
    duration: "0:42",
    sound: true,
    blurb: "A voiced square ad with strike-through kinetic type that questions one-day leadership trainings.",
  },
];

export const skills = [
  {
    title: "Motion Graphics",
    items: ["After Effects", "Premiere Pro", "Framer Motion", "GSAP", "Lottie", "Kinetic Typography"],
    featured: true,
  },
  {
    title: "Modern Web",
    items: ["React.js", "Next.js", "TypeScript", "Node.js", "Express", "Tailwind CSS"],
  },
  {
    title: "Data & Cloud",
    items: ["PostgreSQL", "Prisma", "MongoDB", "AWS", "Vercel", "REST APIs"],
  },
  {
    title: "Automation & CMS",
    items: ["WordPress", "Squarespace", "Hostinger", "GoHighLevel", "Zoho", "CRM Integrations", "AI-driven Workflows"],
  },
  {
    title: "The Psychology Edge",
    items: ["User Cognition", "Decision Science", "UX Research", "Empathy-Driven Design"],
    psych: true,
  },
];

export const services = [
  {
    title: "Front-End Design",
    body: "Crafting beautiful, responsive, and user-friendly web experiences that engage your users. Specializing in modern frameworks and pixel-perfect implementations.",
    tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Back-End Development",
    body: "Building robust, secure, and scalable server-side solutions. Focused on optimizing performance and delivering high-quality solutions that meet business needs.",
    tags: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
  },
  {
    title: "Full-Stack Development",
    body: "Delivering end-to-end web solutions that combine stunning interfaces with powerful functionality. Expert in both client and server-side technologies.",
    tags: ["TypeScript", "Docker", "AWS", "CI/CD"],
  },
  {
    title: "UI/UX Design",
    body: "Creating intuitive, user-centric designs through deep research and psychology-driven interface patterns. Ensuring seamless navigation and high user engagement.",
    tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
  },
  {
    title: "Motion Graphics",
    body: "Bringing brands and interfaces to life with purposeful motion, from animated logos and social videos to micro-interactions and scroll-driven web animation.",
    tags: ["After Effects", "Premiere Pro", "GSAP", "Lottie"],
  },
  {
    title: "Graphic Designing",
    body: "Developing cohesive visual identities and stunning marketing materials. From logo design to digital brochures, bringing brands to life through artistic excellence.",
    tags: ["Illustrator", "Photoshop", "Branding", "Canva"],
  },
];

export const designs = [
  { name: "Success Quote Illustration", src: "/designs/success_quote.jpg", w: 1024, h: 1024, kind: "Illustration" },
  { name: "Theresa Cummings Branding", src: "/designs/theresa_brochure.jpg", w: 1024, h: 791, kind: "Brand Identity" },
  { name: "Anehin Autolink Tip", src: "/designs/car_inspection_tip.jpg", w: 819, h: 1024, kind: "Social Media" },
  { name: "Cycles of Life Poster", src: "/designs/cycles_of_life.jpg", w: 682, h: 1024, kind: "Event Poster" },
  { name: "The Leadership Consultant's Playbook", src: "/designs/leadership_playbook.jpg", w: 512, h: 1024, kind: "Book Cover" },
  { name: "Cycles of Life: Panel Discussions", src: "/designs/cycles_of_life_panel.jpg", w: 682, h: 1024, kind: "Event Poster" },
];
