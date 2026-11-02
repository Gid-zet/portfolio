export const profile = {
  name: "Gideon Adonteng",
  brand: "Gidzet",
  email: "adontenggideon57@gmail.com",
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

export const projects = [
  {
    name: "EverythingVA",
    tagline: "AI-Powered Email Automation Client",
    description:
      "Built an AI-powered email client utilizing Next.js to automate email management and response categorization. It streamlines digital workflows by intelligently sorting incoming communications and suggesting responses based on context.",
    client: "Winnck Enterprise",
    services: ["Full Stack Development", "AI Integration"],
    year: "2024",
    image: "/work/everythingva.jpg",
    accent: "#7c5cff",
    live: "https://everything-va2.vercel.app/",
    github: "https://github.com/Gid-zet7/everything-va2",
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
