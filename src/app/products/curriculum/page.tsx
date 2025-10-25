"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Type definitions
interface Subtype {
  id: string;
  name: string;
  description: string;
  topics: string[];
}

interface Curriculum {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics: string[];
  outcomes: string;
  subtypes?: Subtype[];
}

interface CurriculumCategories {
  [key: string]: Curriculum;
}

// Curriculum data with SEO-optimized descriptions
const curriculumCategories: CurriculumCategories = {
  robotics: {
    id: "robotics",
    name: "Robotics Curriculum",
    icon: "🤖",
    color: "from-blue-500 to-blue-700",
    description:
      "Comprehensive robotics education program covering mechanical design, electronics, programming, and AI integration. Students learn to build, program, and deploy autonomous robots while developing critical thinking and problem-solving skills.",
    topics: [
      "Robot mechanics and kinematics",
      "Sensor integration and data processing",
      "Motor control and actuators",
      "Autonomous navigation systems",
      "Computer vision for robotics",
      "Robot operating systems (ROS)",
      "Competition preparation (FLL, WRO)",
      "Industry 4.0 applications",
    ],
    outcomes:
      "Students gain hands-on experience in robotics engineering, preparing them for careers in automation, AI, and advanced manufacturing.",
  },
  coding: {
    id: "coding",
    name: "Coding & Programming Curriculum",
    icon: "💻",
    color: "from-green-500 to-green-700",
    description:
      "Progressive coding curriculum from visual block-based programming to advanced text-based languages. Covers computational thinking, algorithms, data structures, and software development best practices.",
    subtypes: [
      {
        id: "block-based",
        name: "Block-Based Coding",
        description:
          "Visual programming using Scratch, Blockly, and Code.org for beginners",
        topics: [
          "Scratch programming",
          "MIT App Inventor",
          "Code.org courses",
          "Visual logic building",
        ],
      },
      {
        id: "text-based",
        name: "Text-Based Coding",
        description:
          "Python, JavaScript, Java, and C++ for intermediate to advanced learners",
        topics: [
          "Python fundamentals",
          "JavaScript & web development",
          "Java & object-oriented programming",
          "C++ and embedded systems",
        ],
      },
    ],
    topics: [
      "Computational thinking foundations",
      "Algorithm design and analysis",
      "Data structures and organization",
      "Object-oriented programming",
      "Functional programming concepts",
      "Software development lifecycle",
      "Debugging and testing strategies",
      "Version control with Git",
    ],
    outcomes:
      "Learners develop strong programming foundations applicable to web development, app creation, game design, and software engineering careers.",
  },
  gameDev: {
    id: "gameDev",
    name: "Game Development Curriculum",
    icon: "🎮",
    color: "from-purple-500 to-purple-700",
    description:
      "Complete game development program covering game design principles, programming, graphics, physics engines, and monetization strategies. Students create 2D and 3D games using industry-standard tools.",
    topics: [
      "Game design fundamentals",
      "Unity 3D game engine",
      "Unreal Engine basics",
      "2D game development with Godot",
      "Game physics and mathematics",
      "Character animation and rigging",
      "Level design and storytelling",
      "Multiplayer game architecture",
      "Game monetization strategies",
      "Publishing on app stores",
    ],
    outcomes:
      "Students build a portfolio of games while learning skills applicable to gaming industry, simulation development, and interactive media.",
  },
  pcb: {
    id: "pcb",
    name: "PCB Design & Electronics Curriculum",
    icon: "⚡",
    color: "from-yellow-500 to-orange-600",
    description:
      "Printed Circuit Board design curriculum teaching electronics fundamentals, circuit design, PCB layout, manufacturing processes, and IoT device creation.",
    topics: [
      "Electronic components and theory",
      "Circuit analysis and design",
      "Schematic capture techniques",
      "PCB layout with KiCad/Eagle",
      "Signal integrity and EMI",
      "Power supply design",
      "Microcontroller integration",
      "Prototyping and testing",
      "Manufacturing for production",
      "IoT hardware development",
    ],
    outcomes:
      "Learners gain practical electronics skills for creating custom hardware, IoT devices, and embedded systems for Industry 4.0 applications.",
  },
  dataScience: {
    id: "dataScience",
    name: "Data Science & Analytics Curriculum",
    icon: "📊",
    color: "from-indigo-500 to-indigo-700",
    description:
      "Comprehensive data science program covering statistics, data visualization, machine learning, big data technologies, and real-world analytics projects.",
    topics: [
      "Statistics and probability",
      "Data cleaning and preprocessing",
      "Exploratory data analysis",
      "Data visualization with Python",
      "Machine learning algorithms",
      "Deep learning fundamentals",
      "Natural language processing",
      "Big data with Spark",
      "SQL and database management",
      "Business intelligence tools",
      "Predictive analytics",
      "Data ethics and privacy",
    ],
    outcomes:
      "Students develop in-demand skills for careers in data science, business analytics, machine learning engineering, and AI research.",
  },
  ai: {
    id: "ai",
    name: "Artificial Intelligence Curriculum",
    icon: "🧠",
    color: "from-pink-500 to-rose-700",
    description:
      "Cutting-edge AI curriculum covering machine learning, neural networks, computer vision, NLP, and ethical AI development. Aligned with global AI education standards.",
    topics: [
      "AI fundamentals and history",
      "Machine learning algorithms",
      "Neural networks and deep learning",
      "Computer vision applications",
      "Natural language processing",
      "Reinforcement learning",
      "Generative AI and LLMs",
      "AI ethics and bias",
      "AI model deployment",
      "Edge AI and optimization",
      "AI in robotics",
      "Future of AI technology",
    ],
    outcomes:
      "Learners gain expertise in AI development, preparing them for careers in machine learning, AI research, and emerging technology fields.",
  },
  vr: {
    id: "vr",
    name: "Virtual Reality Curriculum",
    icon: "🥽",
    color: "from-cyan-500 to-blue-600",
    description:
      "Immersive VR curriculum teaching 3D modeling, VR programming, spatial computing, and creating educational and entertainment VR experiences.",
    topics: [
      "VR fundamentals and hardware",
      "3D modeling for VR",
      "Unity VR development",
      "Unreal Engine VR",
      "Spatial audio design",
      "User interaction in VR",
      "Metaverse concepts",
      "AR/VR hybrid applications",
      "VR accessibility design",
      "Performance optimization",
      "Educational VR experiences",
    ],
    outcomes:
      "Students create immersive VR applications, gaining skills for careers in VR development, metaverse creation, and spatial computing.",
  },
  appDev: {
    id: "appDev",
    name: "App Development Curriculum",
    icon: "📱",
    color: "from-teal-500 to-green-600",
    description:
      "Mobile and web app development curriculum covering iOS, Android, cross-platform frameworks, UI/UX design, and app monetization strategies.",
    topics: [
      "Mobile app fundamentals",
      "iOS development with Swift",
      "Android development with Kotlin",
      "React Native cross-platform",
      "Flutter development",
      "UI/UX design principles",
      "API integration and backend",
      "Firebase and cloud services",
      "App security best practices",
      "App store optimization",
      "Monetization strategies",
      "Progressive web apps",
    ],
    outcomes:
      "Learners build real-world apps for iOS and Android, preparing for careers in mobile development and software entrepreneurship.",
  },
  drone: {
    id: "drone",
    name: "Drone Technology Curriculum",
    icon: "🚁",
    color: "from-slate-500 to-gray-700",
    description:
      "Comprehensive drone curriculum covering aerodynamics, flight controllers, autonomous navigation, aerial photography, and commercial drone applications.",
    topics: [
      "Drone mechanics and aerodynamics",
      "Flight controller programming",
      "Autonomous flight systems",
      "GPS and navigation",
      "Aerial photography/videography",
      "Drone regulations and safety",
      "Agricultural applications",
      "Search and rescue operations",
      "Delivery drone systems",
      "Drone racing techniques",
      "Swarm robotics",
      "Commercial drone operations",
    ],
    outcomes:
      "Students gain expertise in UAV technology, preparing for careers in commercial drone operations, aerial surveying, and autonomous systems.",
  },
  webDev: {
    id: "webDev",
    name: "Web Development Curriculum",
    icon: "🌐",
    color: "from-orange-500 to-red-600",
    description:
      "Full-stack web development curriculum from HTML/CSS basics to advanced frameworks, databases, cloud deployment, and modern web technologies.",
    topics: [
      "HTML5 and semantic markup",
      "CSS3 and responsive design",
      "JavaScript fundamentals",
      "React and modern frameworks",
      "Backend with Node.js/Python",
      "Database design (SQL/NoSQL)",
      "RESTful API development",
      "Authentication and security",
      "Cloud deployment (AWS/Azure)",
      "DevOps basics",
      "Web performance optimization",
      "SEO best practices",
    ],
    outcomes:
      "Learners become full-stack developers capable of building modern web applications, e-commerce sites, and SaaS platforms.",
  },
  digitalDesign: {
    id: "digitalDesign",
    name: "Digital Design Curriculum",
    icon: "🎨",
    color: "from-fuchsia-500 to-purple-600",
    description:
      "Comprehensive digital design curriculum covering graphic design, UI/UX, 3D modeling, animation, and design thinking for technology products.",
    subtypes: [
      {
        id: "graphic-art",
        name: "Graphic Art & Illustration",
        description:
          "Visual arts using Adobe Creative Suite, Procreate, and digital illustration tools",
        topics: [
          "Digital illustration",
          "Adobe Photoshop mastery",
          "Vector graphics with Illustrator",
          "Brand identity design",
        ],
      },
      {
        id: "product-design",
        name: "Product Design",
        description:
          "UI/UX design for digital products, user research, and prototyping",
        topics: [
          "User research methods",
          "Wireframing and prototyping",
          "Figma and design tools",
          "Design systems",
        ],
      },
      {
        id: "technical-design",
        name: "Technical Design",
        description: "CAD design, 3D modeling for engineering and architecture",
        topics: [
          "AutoCAD fundamentals",
          "SolidWorks 3D CAD",
          "Fusion 360 modeling",
          "Technical drawing standards",
        ],
      },
      {
        id: "canva-design",
        name: "Canva Design",
        description:
          "Accessible design using Canva for marketing, education, and social media",
        topics: [
          "Canva fundamentals",
          "Social media graphics",
          "Presentation design",
          "Marketing materials",
        ],
      },
      {
        id: "pcb-design",
        name: "PCB Design",
        description:
          "Electronic circuit board design with KiCad, Eagle, and Altium",
        topics: [
          "Schematic design",
          "PCB layout techniques",
          "Component libraries",
          "Design for manufacturing",
        ],
      },
    ],
    topics: [
      "Design thinking methodology",
      "Color theory and typography",
      "Layout and composition",
      "3D modeling and rendering",
      "Animation principles",
      "Motion graphics",
      "Design for accessibility",
      "Portfolio development",
    ],
    outcomes:
      "Students develop a professional design portfolio and skills for careers in UI/UX design, graphic design, product design, and digital media.",
  },
};

// Filter levels
const educationLevels = [
  { id: "elementary", name: "Elementary (K-5)", ages: "5-11 years" },
  { id: "middle", name: "Middle School (6-8)", ages: "11-14 years" },
  { id: "high", name: "High School (9-12)", ages: "14-18 years" },
  { id: "college", name: "College/University", ages: "18+ years" },
  { id: "adult", name: "Adult Learning", ages: "Any age" },
];

const skillLevels = [
  {
    id: "beginner",
    name: "Beginner",
    description: "No prior experience required",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Some foundational knowledge needed",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Strong foundation required",
  },
  {
    id: "expert",
    name: "Expert",
    description: "Professional-level curriculum",
  },
];

export default function CurriculumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [pageTitle, setPageTitle] = useState<string>("STEM Curriculum Kits");
  const [pageSubtitle, setPageSubtitle] = useState<string>(
    "Industry-aligned, SEO-optimized, and globally competitive STEM curriculum packages designed for 21st-century learners. From robotics to AI, game development to digital design."
  );
  const [heroBadges, setHeroBadges] = useState<string[]>([
    "✓ CBC/Cambridge/IB Aligned",
    "✓ 300+ Lesson Plans",
    "✓ Industry-Standard Tools",
    "✓ Teacher Training Included",
  ]);
  const [dynamicCategories, setDynamicCategories] = useState<
    CurriculumCategories | null
  >(null);

  const selectedCurriculum = selectedCategory
    ? curriculumCategories[
        selectedCategory as keyof typeof curriculumCategories
      ]
    : null;
  // Resolve currently selected curriculum from dynamic override if available
  const selectedMap = (dynamicCategories ?? curriculumCategories) as any;
  const selectedDynamic = selectedCategory ? (selectedMap[selectedCategory] as Curriculum | undefined) : undefined;

  // Load optional dynamic content from backend Product Page: slug "curriculum"
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "/api/v1/public/product-pages/curriculum",
          { cache: "no-store" }
        );
        if (!res.ok) return; // keep static content
        const page = await res.json();

        // Override title/subtitle if present
        if (page.title) setPageTitle(page.title);
        if (page.subtitle) setPageSubtitle(page.subtitle);
        if (page.hero_content?.description && !page.subtitle) {
          setPageSubtitle(page.hero_content.description);
        }
        if (Array.isArray(page.hero_content?.badges)) {
          setHeroBadges(page.hero_content.badges.filter(Boolean));
        }

        // Map page.products (array) into our curriculumCategories shape if provided
        if (Array.isArray(page.products) && page.products.length) {
          const mapped: CurriculumCategories = {};
          for (const item of page.products) {
            const id = String(item.id || item.slug || item.key || item.name || Math.random());
            mapped[id] = {
              id,
              name: item.name || "",
              icon: item.icon || "🎓",
              color: item.color || "from-blue-500 to-blue-700",
              description: item.description || "",
              topics: Array.isArray(item.topics) ? item.topics : [],
              outcomes: item.outcomes || "",
              subtypes: Array.isArray(item.subtypes)
                ? item.subtypes.map((s: any) => ({
                    id: String(s.id || s.key || s.name || Math.random()),
                    name: s.name || "",
                    description: s.description || "",
                    topics: Array.isArray(s.topics) ? s.topics : [],
                  }))
                : undefined,
            };
          }
          setDynamicCategories(mapped);
        }
      } catch (e) {
        // Silent fallback to static content
        console.warn("Curriculum page: using static content (", (e as Error)?.message, ")");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center text-orange hover:text-orange-light mb-6 transition-colors"
          >
            <span className="mr-2">←</span> Back to Products
          </Link>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide">
            {pageTitle}
          </h1>
          <div className="w-24 h-1 bg-orange mb-6"></div>
          <p className="text-xl md:text-2xl font-lato max-w-4xl text-white/95 leading-relaxed mb-8">
            {pageSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            {heroBadges.map((b, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Curriculum Categories Grid */}
          {!selectedCategory && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
                  Choose Your Curriculum Path
                </h2>
                <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
                <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
                  Select from our comprehensive range of STEM curriculum
                  packages, each designed to meet global education standards and
                  industry demands.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {Object.values(dynamicCategories ?? curriculumCategories).map((curriculum) => (
                  <button
                    key={curriculum.id}
                    onClick={() => setSelectedCategory(curriculum.id)}
                    className="group text-left bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-transparent hover:border-orange/30"
                  >
                    <div
                      className={`bg-gradient-to-br ${curriculum.color} text-white p-6 text-center`}
                    >
                      <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {curriculum.icon}
                      </div>
                      <h3 className="text-2xl font-bebas tracking-wide">
                        {curriculum.name}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="font-lato text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {curriculum.description}
                      </p>
                      <div className="mt-4 text-orange font-montserrat font-semibold flex items-center">
                        Learn More{" "}
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Curriculum View */}
          {selectedCategory && (selectedDynamic || selectedCurriculum) && (
            <div className="animate-fade-in">
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubtype(null);
                }}
                className="mb-8 flex items-center text-orange hover:text-orange-dark font-montserrat font-semibold transition-colors"
              >
                <span className="mr-2">←</span> Back to All Curricula
              </button>

              {/* Curriculum Header */}
              <div
                className={`bg-gradient-to-br ${(selectedDynamic ?? selectedCurriculum)!.color} text-white rounded-3xl p-8 md:p-12 mb-8 shadow-2xl`}
              >
                <div className="flex items-start gap-6">
                  <div className="text-7xl md:text-8xl">{(selectedDynamic ?? selectedCurriculum)!.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-6xl font-bebas mb-4 tracking-wide">
                      {(selectedDynamic ?? selectedCurriculum)!.name}
                    </h2>
                    <p className="text-lg md:text-xl font-lato leading-relaxed text-white/95">
                      {(selectedDynamic ?? selectedCurriculum)!.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtypes (if applicable) */}
              {(selectedDynamic ?? selectedCurriculum)?.subtypes && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bebas text-navy mb-4">
                    Choose Specialization:
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(selectedDynamic ?? selectedCurriculum)!.subtypes!.map((subtype) => (
                      <button
                        key={subtype.id}
                        onClick={() => setSelectedSubtype(subtype.id)}
                        className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedSubtype === subtype.id
                            ? "border-orange bg-orange/5 shadow-lg"
                            : "border-gray-200 bg-white hover:border-orange/50 hover:shadow-md"
                        }`}
                      >
                        <h4 className="text-xl font-bebas text-navy mb-2">
                          {subtype.name}
                        </h4>
                        <p className="font-lato text-gray-600 text-sm mb-3">
                          {subtype.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {subtype.topics.slice(0, 3).map((topic, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                <h3 className="text-3xl font-bebas text-navy mb-6">
                  Filter Your Curriculum
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Education Level Filter */}
                  <div>
                    <label className="block font-montserrat font-semibold text-navy mb-3">
                      Educational Level
                    </label>
                    <select
                      value={selectedEducation}
                      onChange={(e) => setSelectedEducation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg font-lato focus:outline-none focus:border-orange transition-colors"
                    >
                      <option value="all">All Levels</option>
                      {educationLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skill Level Filter */}
                  <div>
                    <label className="block font-montserrat font-semibold text-navy mb-3">
                      Skill Level
                    </label>
                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg font-lato focus:outline-none focus:border-orange transition-colors"
                    >
                      <option value="all">All Levels</option>
                      {skillLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Age Filter */}
                  <div>
                    <label className="block font-montserrat font-semibold text-navy mb-3">
                      Age Range
                    </label>
                    <select
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg font-lato focus:outline-none focus:border-orange transition-colors"
                    >
                      <option value="all">All Ages</option>
                      {educationLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.ages}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Filters Display */}
                {(selectedEducation !== "all" ||
                  selectedSkill !== "all" ||
                  selectedAge !== "all") && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="font-montserrat text-sm text-gray-600 mb-3">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEducation !== "all" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-montserrat">
                          {
                            educationLevels.find(
                              (l) => l.id === selectedEducation
                            )?.name
                          }
                        </span>
                      )}
                      {selectedSkill !== "all" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-montserrat">
                          {
                            skillLevels.find((l) => l.id === selectedSkill)
                              ?.name
                          }
                        </span>
                      )}
                      {selectedAge !== "all" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-montserrat">
                          {
                            educationLevels.find((l) => l.id === selectedAge)
                              ?.ages
                          }
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedEducation("all");
                          setSelectedSkill("all");
                          setSelectedAge("all");
                        }}
                        className="text-sm text-gray-500 hover:text-orange transition-colors underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Curriculum Content */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Topics Covered */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-3xl font-bebas text-navy mb-6">
                    Topics Covered
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(selectedDynamic ?? selectedCurriculum)!.topics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/5 transition-colors"
                      >
                        <span className="text-orange text-xl flex-shrink-0">
                          ✓
                        </span>
                        <span className="font-lato text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes & CTA */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange/10 to-orange/5 rounded-2xl p-6 border border-orange/20">
                    <h3 className="text-2xl font-bebas text-navy mb-4">
                      Learning Outcomes
                    </h3>
                    <p className="font-lato text-gray-700 leading-relaxed">
                      {(selectedDynamic ?? selectedCurriculum)!.outcomes}
                    </p>
                  </div>

                  <div className="bg-navy text-white rounded-2xl p-6">
                    <h4 className="text-2xl font-bebas mb-3">
                      What's Included
                    </h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          300+ lesson plans
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          Teacher training & support
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          Student workbooks & resources
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          Assessment tools & rubrics
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          Digital learning platform access
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange">✓</span>
                        <span className="font-lato text-sm">
                          Certificate of completion
                        </span>
                      </li>
                    </ul>
                    <Link
                      href="/contact"
                      className="block w-full bg-orange hover:bg-orange-dark text-center font-montserrat font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO-Optimized Footer Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Ready to Transform Your STEM Education?
          </h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
          <p className="text-xl font-lato mb-8 text-white/90 max-w-3xl mx-auto">
            Get access to industry-aligned, globally competitive STEM curriculum
            packages that prepare students for tomorrow's careers in technology,
            engineering, and innovation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary bg-orange hover:bg-orange-dark text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-orange/50 transition-all duration-300"
            >
              Request Curriculum Demo
            </Link>
            <Link
              href="/products"
              className="btn-outline border-2 border-white text-white hover:bg-white hover:text-navy text-lg px-10 py-4 rounded-xl transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
