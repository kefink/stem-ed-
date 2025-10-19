"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
interface VRExperience {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  subjectArea: string;
  gradeLevel: string[];
  platform: string[];
  learningMode: string[];
  thumbnail?: string;
}

interface SubjectCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  experimentCount: number;
  highlights: string[];
  gradeLevels?: string[]; // For CBC subjects with specific grades
}

interface PricingTier {
  id: string;
  name: string;
  type: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  includes?: string;
}

// Subject Categories including Kenya CBC subjects
const subjectCategories: SubjectCategory[] = [
  {
    id: "chemistry",
    name: "Chemistry Lab",
    icon: "🧪",
    color: "from-green-500 to-emerald-600",
    description:
      "Explore chemical reactions, molecular structures, and lab techniques in a safe virtual environment. Handle dangerous chemicals without risk.",
    experimentCount: 20,
    highlights: [
      "Virtual chemical reactions",
      "3D molecular structure manipulation",
      "Lab equipment training",
      "Periodic table exploration",
      "Safe handling of dangerous materials",
    ],
  },
  {
    id: "physics",
    name: "Physics Laboratory",
    icon: "⚛️",
    color: "from-blue-500 to-indigo-600",
    description:
      "Visualize abstract physics concepts through interactive simulations. From mechanics to quantum physics, see theory come alive.",
    experimentCount: 25,
    highlights: [
      "Mechanics & motion simulation",
      "Electricity & magnetism fields",
      "Optics & light behavior",
      "Thermodynamics visualization",
      "Quantum physics exploration",
    ],
  },
  {
    id: "biology",
    name: "Biology & Life Sciences",
    icon: "🧬",
    color: "from-teal-500 to-cyan-600",
    description:
      "Journey inside the human body, explore cells at molecular level, and witness ecosystems in action through immersive VR.",
    experimentCount: 15,
    highlights: [
      "Human anatomy walkthrough",
      "Cell biology at molecular scale",
      "Ecosystem simulations",
      "Genetics & DNA manipulation",
      "Microbiology exploration",
    ],
  },
  {
    id: "engineering",
    name: "Engineering & Design",
    icon: "🏗️",
    color: "from-orange-500 to-red-600",
    description:
      "Design, build, and test engineering projects in virtual space. Create structures, mechanisms, and systems without material costs.",
    experimentCount: 20,
    highlights: [
      "3D CAD modeling in VR",
      "Structural engineering tests",
      "Mechanical systems design",
      "Robotics simulation",
      "Architecture walkthroughs",
    ],
  },
  {
    id: "earth-space",
    name: "Earth & Space Science",
    icon: "🌍",
    color: "from-purple-500 to-pink-600",
    description:
      "Travel through space, witness geological phenomena, and experience weather systems from inside. The universe is your classroom.",
    experimentCount: 15,
    highlights: [
      "Solar system exploration",
      "Geological formations",
      "Weather systems inside view",
      "Climate zones experience",
      "Astronomy & galaxies",
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics Visualization",
    icon: "🔢",
    color: "from-yellow-500 to-amber-600",
    description:
      "Transform abstract mathematical concepts into tangible 3D visualizations. See calculus, geometry, and statistics in new dimensions.",
    experimentCount: 10,
    highlights: [
      "3D geometry manipulation",
      "Calculus visualization",
      "Statistics in 3D space",
      "Fractals and patterns",
      "Graph theory exploration",
    ],
  },
  {
    id: "pre-technical",
    name: "Pre-Technical Studies (CBC)",
    icon: "🔧",
    color: "from-gray-700 to-slate-800",
    description:
      "Kenya CBC curriculum for Junior School. Learn practical technical skills through virtual workshops, tools, and projects.",
    experimentCount: 18,
    highlights: [
      "Workshop safety training",
      "Tool identification & usage",
      "Basic carpentry in VR",
      "Metalwork fundamentals",
      "Electrical wiring basics",
      "Technical drawing practice",
    ],
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
  },
  {
    id: "integrated-science",
    name: "Integrated Science (CBC)",
    icon: "🔬",
    color: "from-indigo-600 to-blue-700",
    description:
      "Kenya CBC Junior School integrated science curriculum. Combines biology, chemistry, and physics concepts for holistic understanding.",
    experimentCount: 22,
    highlights: [
      "Matter & materials",
      "Energy & electricity",
      "Living organisms study",
      "Environment & conservation",
      "Scientific investigation skills",
      "Health & nutrition",
    ],
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
  },
  {
    id: "agriculture",
    name: "Agriculture (CBC)",
    icon: "🌾",
    color: "from-lime-600 to-green-700",
    description:
      "Kenya CBC agricultural science for Junior School. Virtual farming experiences, crop management, and animal husbandry without leaving the classroom.",
    experimentCount: 16,
    highlights: [
      "Crop farming simulation",
      "Soil science & testing",
      "Animal husbandry practices",
      "Farm tools & machinery",
      "Pest & disease management",
      "Agribusiness basics",
    ],
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
  },
];

// Pricing tiers including VR bundles
const pricingTiers: PricingTier[] = [
  {
    id: "student",
    name: "Individual Student",
    type: "license",
    price: "KES 2,000/year",
    description: "Perfect for homeschoolers and individual learners",
    features: [
      "Access to all 150+ VR experiences",
      "Works on 5 devices",
      "Desktop mode included (no VR needed)",
      "Progress tracking",
      "Certificates & badges",
      "Email support",
    ],
  },
  {
    id: "school",
    name: "School License",
    type: "license",
    price: "KES 150,000/year",
    description: "Comprehensive solution for entire schools",
    features: [
      "Unlimited students & teachers",
      "All 150+ VR experiences",
      "10 concurrent VR sessions",
      "Teacher dashboard & analytics",
      "2-day teacher training",
      "Technical support",
      "Monthly content updates",
      "Curriculum integration guides",
    ],
    popular: true,
  },
  {
    id: "district",
    name: "District License",
    type: "license",
    price: "Custom pricing",
    description: "Enterprise solution for multiple schools",
    features: [
      "Multiple schools coverage",
      "Dedicated cloud server",
      "Custom content creation",
      "Priority support team",
      "On-site training",
      "Advanced analytics",
      "API access",
      "White-label option",
    ],
  },
  {
    id: "starter-bundle",
    name: "Starter VR Bundle",
    type: "bundle",
    price: "KES 400,000",
    description: "Get started with VR hardware and software",
    features: [
      "5 Meta Quest 3 headsets",
      "1-year school license",
      "Charging station",
      "Protective cases",
      "Setup & training (1 day)",
      "All VR experiences included",
    ],
    includes: "Hardware + Software",
  },
  {
    id: "classroom-bundle",
    name: "Classroom VR Kit",
    type: "bundle",
    price: "KES 1,000,000",
    description: "Full classroom VR setup for 15 students",
    features: [
      "15 Meta Quest 3 headsets",
      "1-year school license",
      "Multi-device charging station",
      "Storage & transport case",
      "WiFi router (VR optimized)",
      "Setup & training (2 days)",
      "Extended warranty",
    ],
    includes: "Hardware + Software",
    popular: true,
  },
  {
    id: "school-bundle",
    name: "Whole School Bundle",
    type: "bundle",
    price: "KES 1,800,000",
    description: "Complete school VR lab with 30 headsets",
    features: [
      "30 Meta Quest 3 headsets",
      "2-year school license",
      "Professional charging stations",
      "Dedicated VR room setup",
      "Enterprise WiFi 6 router",
      "Setup & training (5 days)",
      "3-year warranty",
      "Quarterly on-site support",
    ],
    includes: "Hardware + Software + Setup",
  },
];

// Filter options
const gradeOptions = [
  "All Grades",
  "Primary (Grade 4-6)",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Secondary (Form 1-4)",
  "College/Advanced",
];

const difficultyOptions = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const durationOptions = [
  "All Durations",
  "Quick (5-10 min)",
  "Medium (15-30 min)",
  "Deep Dive (45+ min)",
];

const platformOptions = [
  "All Platforms",
  "Meta Quest",
  "PC VR",
  "Mobile VR",
  "Desktop (No VR)",
];

const learningModeOptions = [
  "All Modes",
  "Solo Learning",
  "Collaborative",
  "Guided Tour",
  "Free Exploration",
];

export default function VRLabPage() {
  // Prevent hydration errors
  const [mounted, setMounted] = useState(false);

  // Filter States
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("All Grades");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("All Levels");
  const [selectedDuration, setSelectedDuration] =
    useState<string>("All Durations");
  const [selectedPlatform, setSelectedPlatform] =
    useState<string>("All Platforms");
  const [selectedMode, setSelectedMode] = useState<string>("All Modes");

  // VR Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const vrSlides = [
    {
      id: 1,
      image: "/vr1.jpeg",
      title: "VR Lab Experience",
      subtitle:
        "Step into science with immersive virtual reality. Explore 150+ VR experiments across 9 subjects including Kenya CBC curriculum.",
    },
    {
      id: 2,
      image: "/vr2.jpeg",
      title: "Immersive Learning",
      subtitle:
        "Experience what textbooks can't show - safe, engaging virtual environments for hands-on STEM education.",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vrSlides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, [mounted, vrSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % vrSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + vrSlides.length) % vrSlides.length);
  };

  // Filter subject categories based on selected grade (for CBC subjects)
  const filteredSubjects =
    selectedGrade === "All Grades" ||
    selectedGrade === "Primary (Grade 4-6)" ||
    selectedGrade === "Secondary (Form 1-4)" ||
    selectedGrade === "College/Advanced"
      ? subjectCategories
      : subjectCategories.filter(
          (subject) =>
            !subject.gradeLevels || subject.gradeLevels.includes(selectedGrade)
        );

  const displayedSubjects =
    selectedSubject === "all"
      ? filteredSubjects
      : filteredSubjects.filter((subject) => subject.id === selectedSubject);

  // Prevent hydration errors - show loading state until mounted
  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🥽</div>
          <div className="text-[#5ce1e6] font-bebas text-2xl">
            Loading VR Lab Experience...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] -mt-20 pt-20"
      suppressHydrationWarning
    >
      {/* Hero Section with Animated Slider */}
      <section
        className="relative h-screen w-full overflow-hidden -mt-20"
        suppressHydrationWarning
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image with Enhanced Visibility */}
            <Image
              src={vrSlides[currentSlide].image}
              alt={vrSlides[currentSlide].title}
              fill
              priority
              quality={95}
              className="object-cover brightness-110 contrast-110"
            />

            {/* Lighter Gradient Overlay for Better Image Visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/75 via-[#0a0a0a]/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(92,225,230,0.1),transparent_50%)]"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-24">
              <div className="max-w-7xl mx-auto w-full">
                <Link
                  href="/products"
                  className="inline-flex items-center text-[#5ce1e6] hover:text-[#4dd4d9] mb-8 transition-colors"
                >
                  <span className="mr-2">←</span> Back to Products
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <motion.h1
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                    >
                      {vrSlides[currentSlide].title}
                    </motion.h1>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="w-24 h-1 bg-[#5ce1e6] mb-6 origin-left shadow-lg shadow-[#5ce1e6]/50"
                    ></motion.div>

                    <motion.p
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-xl md:text-2xl font-lato text-white leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    >
                      {vrSlides[currentSlide].subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          150+
                        </div>
                        <div className="text-sm font-lato text-white">
                          VR Experiments
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          9
                        </div>
                        <div className="text-sm font-lato text-white">
                          Subject Areas
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          30
                        </div>
                        <div className="text-sm font-lato text-white">
                          Students
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          80%
                        </div>
                        <div className="text-sm font-lato text-white">
                          Better Retention
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="flex flex-wrap gap-4 text-sm md:text-base"
                    >
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        🥽 VR & Desktop Mode
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        🇰🇪 CBC Curriculum
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        👥 Collaborative
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        📊 Analytics
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative"
                  >
                    <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-3xl p-8 border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-2xl">
                      <div className="text-center mb-6">
                        <div className="text-8xl mb-4 drop-shadow-[0_4px_8px_rgba(92,225,230,0.3)]">
                          🥽
                        </div>
                        <h3 className="text-2xl font-bebas mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          Immersive Learning
                        </h3>
                        <p className="text-sm text-white font-lato drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          Experience what textbooks can't show
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🧪</div>
                          <p className="text-xs font-lato text-white">
                            Safe Chemistry
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🌍</div>
                          <p className="text-xs font-lato text-white">
                            Space Travel
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🧬</div>
                          <p className="text-xs font-lato text-white">
                            Molecular Level
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">⚡</div>
                          <p className="text-xs font-lato text-white">
                            Physics in Action
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-[#0a0a0a]/80 hover:bg-[#5ce1e6] backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6] shadow-xl"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-[#0a0a0a]/80 hover:bg-[#5ce1e6] backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 hover:scale-110 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6] shadow-xl"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-3 bg-[#0a0a0a]/70 backdrop-blur-md px-6 py-3 rounded-full border border-[#5ce1e6]/30">
          {vrSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#5ce1e6] w-12 shadow-lg shadow-[#5ce1e6]/70"
                  : "bg-white/50 hover:bg-white/80 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center text-[#5ce1e6] drop-shadow-[0_2px_8px_rgba(92,225,230,0.8)]">
            <span className="font-lato text-sm mb-2 font-semibold">
              Scroll to explore
            </span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="bg-[#0a0a0a] border-b border-[#5ce1e6]/20 py-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bebas text-white mb-6">
            Filter VR Experiences
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grade Level Filter */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-2">
                Grade Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#5ce1e6]/30 bg-[#1f1f1f] text-white focus:border-[#5ce1e6] focus:outline-none font-lato"
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade} className="bg-[#1a1a1a]">
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#5ce1e6]/30 bg-[#1f1f1f] text-white focus:border-[#5ce1e6] focus:outline-none font-lato"
              >
                {difficultyOptions.map((level) => (
                  <option key={level} value={level} className="bg-[#1a1a1a]">
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-2">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#5ce1e6]/30 bg-[#1f1f1f] text-white focus:border-[#5ce1e6] focus:outline-none font-lato"
              >
                {durationOptions.map((duration) => (
                  <option
                    key={duration}
                    value={duration}
                    className="bg-[#1a1a1a]"
                  >
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-2">
                VR Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#5ce1e6]/30 bg-[#1f1f1f] text-white focus:border-[#5ce1e6] focus:outline-none font-lato"
              >
                {platformOptions.map((platform) => (
                  <option
                    key={platform}
                    value={platform}
                    className="bg-[#1a1a1a]"
                  >
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Mode Filter */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-2">
                Learning Mode
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-[#5ce1e6]/30 bg-[#1f1f1f] text-white focus:border-[#5ce1e6] focus:outline-none font-lato"
              >
                {learningModeOptions.map((mode) => (
                  <option key={mode} value={mode} className="bg-[#1a1a1a]">
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Category Pills */}
          <div className="mt-6">
            <label className="block text-sm font-montserrat font-semibold text-gray-300 mb-3">
              Subject Area
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubject("all")}
                className={`px-4 py-2 rounded-full font-montserrat font-semibold transition-all duration-300 ${
                  selectedSubject === "all"
                    ? "bg-[#5ce1e6] text-black shadow-lg shadow-[#5ce1e6]/50 scale-105"
                    : "bg-[#1f1f1f] text-gray-300 border border-[#5ce1e6]/30 hover:bg-[#2a2a2a] hover:border-[#5ce1e6]/60"
                }`}
              >
                All Subjects
              </button>
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`px-4 py-2 rounded-full font-montserrat font-semibold transition-all duration-300 ${
                    selectedSubject === subject.id
                      ? "bg-[#5ce1e6] text-black shadow-lg shadow-[#5ce1e6]/50 scale-105"
                      : "bg-[#1f1f1f] text-gray-300 border border-[#5ce1e6]/30 hover:bg-[#2a2a2a] hover:border-[#5ce1e6]/60"
                  }`}
                >
                  <span className="mr-2">{subject.icon}</span>
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subject Categories Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              {selectedSubject === "all"
                ? "All VR Subject Areas"
                : displayedSubjects[0]?.name}
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-400 max-w-3xl mx-auto">
              {selectedSubject === "all"
                ? `Showing ${filteredSubjects.length} subject area${
                    filteredSubjects.length !== 1 ? "s" : ""
                  } with ${filteredSubjects.reduce(
                    (sum, s) => sum + s.experimentCount,
                    0
                  )}+ total VR experiences`
                : displayedSubjects[0]?.description}
            </p>
            {selectedGrade !== "All Grades" && (
              <p className="text-lg font-montserrat font-semibold text-[#5ce1e6] mt-4">
                Filtered for: {selectedGrade}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedSubjects.map((subject) => (
              <div
                key={subject.id}
                className="group bg-[#1f1f1f]/90 rounded-2xl shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60"
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} text-white p-6 text-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[#0a0a0a]/30"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {subject.icon}
                    </div>
                    <h3 className="text-xl font-bebas tracking-wide mb-2">
                      {subject.name}
                    </h3>
                    <div className="bg-[#5ce1e6]/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-montserrat inline-block border border-[#5ce1e6]/40">
                      {subject.experimentCount}+ Experiments
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="font-lato text-gray-300 text-sm leading-relaxed mb-4">
                    {subject.description}
                  </p>

                  {subject.gradeLevels && (
                    <div className="mb-4 pb-4 border-b border-[#5ce1e6]/20">
                      <p className="text-xs font-montserrat font-semibold text-[#5ce1e6] mb-2">
                        🇰🇪 Kenya CBC Curriculum:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subject.gradeLevels.map((grade) => (
                          <span
                            key={grade}
                            className="bg-[#5ce1e6]/20 text-[#5ce1e6] text-xs px-2 py-1 rounded-full font-montserrat border border-[#5ce1e6]/40"
                          >
                            {grade}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h4 className="font-montserrat font-semibold text-white text-sm mb-3">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {subject.highlights.slice(0, 5).map((highlight, idx) => (
                      <li key={idx} className="flex items-start text-xs">
                        <span className="text-[#5ce1e6] mr-2 flex-shrink-0">
                          ✓
                        </span>
                        <span className="font-lato text-gray-400">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Why Choose VR Learning?
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                80% Better Retention
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Students remember concepts 80% better in VR compared to
                traditional textbook learning. Learning by doing creates lasting
                memory.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Cost Savings
              </h3>
              <p className="text-sm font-lato text-gray-400">
                No expensive lab equipment, chemical consumables, or broken
                glassware. Unlimited experiments at a fraction of traditional
                lab costs.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bebas text-white mb-3">100% Safe</h3>
              <p className="text-sm font-lato text-gray-400">
                Handle dangerous chemicals, witness explosions, explore extreme
                environments - all without any physical risk to students.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Access Anywhere
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Rural schools get the same world-class lab experiences as urban
                schools. Level the educational playing field across Kenya.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Collaborative Learning
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Up to 30 students can work together in the same virtual lab,
                practicing teamwork and communication skills.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Curriculum Aligned
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Fully aligned with Kenya CBC, Cambridge, and IB curricula.
                Includes lesson plans and learning objectives for each
                experiment.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Teachers see live student progress, time spent, completion
                rates, and assessment scores from intuitive dashboard.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Impossible Experiences
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Shrink to molecular size, visit Mars, witness geological
                phenomena, see inside organs - experiences impossible in real
                life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Works on Multiple Platforms
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300">
              No VR headset? No problem! Access on desktop, mobile, or dedicated
              VR devices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20">
              <div className="text-4xl mb-3">🥽</div>
              <h3 className="text-lg font-bebas text-white mb-2">
                Meta Quest 2/3
              </h3>
              <p className="text-sm font-lato text-gray-400 mb-3">
                Best VR experience with standalone headsets. No computer needed.
              </p>
              <div className="text-xs text-[#5ce1e6] font-montserrat font-semibold bg-[#5ce1e6]/10 px-2 py-1 rounded-full inline-block border border-[#5ce1e6]/40">
                Recommended
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-purple-400/40 hover:border-purple-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-purple-500/20">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="text-lg font-bebas text-white mb-2">
                PC VR (SteamVR)
              </h3>
              <p className="text-sm font-lato text-gray-400 mb-3">
                Enhanced graphics with PC-powered VR headsets like HTC Vive,
                Valve Index.
              </p>
              <div className="text-xs text-purple-400 font-montserrat font-semibold bg-purple-500/10 px-2 py-1 rounded-full inline-block border border-purple-400/40">
                High Quality
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-green-400/40 hover:border-green-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-green-500/20">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bebas text-white mb-2">Mobile VR</h3>
              <p className="text-sm font-lato text-gray-400 mb-3">
                Budget-friendly option using smartphone with Google Cardboard or
                similar.
              </p>
              <div className="text-xs text-green-400 font-montserrat font-semibold bg-green-500/10 px-2 py-1 rounded-full inline-block border border-green-400/40">
                Budget Option
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-orange-400/40 hover:border-orange-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-orange-500/20">
              <div className="text-4xl mb-3">🖥️</div>
              <h3 className="text-lg font-bebas text-white mb-2">
                Desktop Mode
              </h3>
              <p className="text-sm font-lato text-gray-400 mb-3">
                Access all experiences on regular computers without any VR
                headset required.
              </p>
              <div className="text-xs text-orange-400 font-montserrat font-semibold bg-orange-500/10 px-2 py-1 rounded-full inline-block border border-orange-400/40">
                No VR Needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Flexible Pricing Options
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300">
              Software licenses, VR hardware bundles, or complete solutions -
              choose what fits your needs
            </p>
          </div>

          {/* Software Licenses */}
          <div className="mb-12">
            <h3 className="text-2xl font-bebas text-white mb-6 text-center">
              Software Licenses
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers
                .filter((tier) => tier.type === "license")
                .map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative bg-[#1f1f1f]/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/50 hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                      tier.popular
                        ? "border-[#5ce1e6] scale-105 shadow-[#5ce1e6]/30"
                        : "border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-[#5ce1e6] text-black px-4 py-1 text-xs font-montserrat font-bold rounded-bl-lg shadow-lg shadow-[#5ce1e6]/50">
                        POPULAR
                      </div>
                    )}

                    <div className="p-8">
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-bebas text-white mb-2">
                          {tier.name}
                        </h4>
                        <p className="text-sm font-lato text-gray-400 mb-4">
                          {tier.description}
                        </p>
                        <div className="text-3xl font-bebas text-[#5ce1e6]">
                          {tier.price}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <span className="text-[#5ce1e6] mr-2 flex-shrink-0">
                              ✓
                            </span>
                            <span className="font-lato text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contact"
                        className={`block w-full text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300 ${
                          tier.popular
                            ? "bg-[#5ce1e6] text-black hover:bg-[#4dd4d9] shadow-lg shadow-[#5ce1e6]/50"
                            : "bg-[#1a1a1a] text-white hover:bg-[#5ce1e6] hover:text-black border border-[#5ce1e6]/40"
                        }`}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* VR Hardware Bundles */}
          <div>
            <h3 className="text-2xl font-bebas text-white mb-6 text-center">
              VR Hardware Bundles (Software + Headsets)
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers
                .filter((tier) => tier.type === "bundle")
                .map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-2xl shadow-lg shadow-black/50 hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                      tier.popular
                        ? "border-[#5ce1e6] scale-105 shadow-[#5ce1e6]/30"
                        : "border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#5ce1e6] to-[#4dd4d9] text-black px-4 py-1 text-xs font-montserrat font-bold rounded-bl-lg shadow-lg shadow-[#5ce1e6]/50">
                        BEST VALUE
                      </div>
                    )}

                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div className="inline-block bg-[#5ce1e6] text-black px-3 py-1 rounded-full text-xs font-montserrat font-bold mb-3 shadow-lg shadow-[#5ce1e6]/30">
                          {tier.includes}
                        </div>
                        <h4 className="text-2xl font-bebas text-white mb-2">
                          {tier.name}
                        </h4>
                        <p className="text-sm font-lato text-gray-400 mb-4">
                          {tier.description}
                        </p>
                        <div className="text-3xl font-bebas text-[#5ce1e6]">
                          {tier.price}
                        </div>
                        <div className="text-xs text-gray-500 font-lato mt-1">
                          One-time payment
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <span className="text-[#5ce1e6] mr-2 flex-shrink-0">
                              ✓
                            </span>
                            <span className="font-lato text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contact"
                        className={`block w-full text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300 ${
                          tier.popular
                            ? "bg-gradient-to-r from-[#5ce1e6] to-[#4dd4d9] text-black hover:from-[#4dd4d9] hover:to-[#5ce1e6] shadow-lg shadow-[#5ce1e6]/50"
                            : "bg-[#1a1a1a] text-white hover:bg-[#5ce1e6] hover:text-black border border-[#5ce1e6]/40"
                        }`}
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-lato text-gray-300 mb-4">
              Need a custom solution or financing options? We offer flexible
              payment plans for schools.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#1a1a1a] text-white border-2 border-[#5ce1e6] hover:bg-[#5ce1e6] hover:text-black font-montserrat font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#5ce1e6]/50"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Real-World Success Stories
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-8 border-2 border-green-400/40 hover:border-green-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-green-500/20">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Chemistry Safety Training
              </h3>
              <p className="font-lato text-gray-300 text-sm mb-4 italic">
                "Before students handle real acids and bases, they practice in
                VR, learning lab safety, proper handling techniques, and what
                reactions to expect - all without risk."
              </p>
              <div className="text-xs text-green-400 font-montserrat font-semibold">
                - St. Mary's Secondary School, Nairobi
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-8 border-2 border-blue-400/40 hover:border-blue-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-blue-500/20">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Rural School Access
              </h3>
              <p className="font-lato text-gray-300 text-sm mb-4 italic">
                "Our school had no physics lab equipment. Now with VR, our
                students get hands-on experience with expensive apparatus,
                leveling the educational playing field."
              </p>
              <div className="text-xs text-blue-400 font-montserrat font-semibold">
                - Kipsigak Primary School, Bomet County
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-8 border-2 border-purple-400/40 hover:border-purple-400/80 transition-all shadow-lg shadow-black/50 hover:shadow-purple-500/20">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Abstract Concepts Made Clear
              </h3>
              <p className="font-lato text-gray-300 text-sm mb-4 italic">
                "Quantum physics was always difficult to teach. In VR, students
                visualize wave-particle duality and understand concepts that
                were previously impossible to demonstrate."
              </p>
              <div className="text-xs text-purple-400 font-montserrat font-semibold">
                - Brookhouse International School, Karen
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-8 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                CBC Pre-Technical Training
              </h3>
              <p className="font-lato text-gray-300 text-sm mb-4 italic">
                "Grade 7 students learn workshop safety and tool handling in VR
                before touching real equipment. Accidents have reduced to zero,
                and confidence has increased dramatically."
              </p>
              <div className="text-xs text-[#5ce1e6] font-montserrat font-semibold">
                - Moi Forces Academy, Nairobi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-[#5ce1e6]/40 shadow-xl shadow-[#5ce1e6]/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎥</div>
              <h2 className="text-4xl font-bebas text-white mb-4">
                Experience VR Learning Yourself
              </h2>
              <p className="text-xl font-lato text-gray-300">
                Book a free demo and see how VR can transform your STEM
                education
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50">
                <div className="text-4xl mb-3">🥽</div>
                <h4 className="font-bebas text-lg text-white mb-2">
                  Try VR Headset
                </h4>
                <p className="text-sm font-lato text-gray-400">
                  We bring VR headsets to your school for hands-on demo
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50">
                <div className="text-4xl mb-3">💻</div>
                <h4 className="font-bebas text-lg text-white mb-2">
                  Virtual Demo
                </h4>
                <p className="text-sm font-lato text-gray-400">
                  Online demonstration via Zoom with screen share
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50">
                <div className="text-4xl mb-3">🎁</div>
                <h4 className="font-bebas text-lg text-white mb-2">
                  Free Trial
                </h4>
                <p className="text-sm font-lato text-gray-400">
                  7-day free trial with 10 VR experiences included
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-[#5ce1e6] to-[#4dd4d9] text-black font-montserrat font-bold text-lg px-10 py-4 rounded-xl shadow-xl shadow-[#5ce1e6]/50 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Schedule Free Demo
              </Link>
              <p className="text-sm text-gray-400 font-lato mt-4">
                No credit card required • Instant booking confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Technical Requirements
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-gray-400/40 hover:border-gray-400/80 transition-all shadow-lg shadow-black/50">
              <h3 className="text-xl font-bebas text-white mb-4 flex items-center">
                <span className="mr-2">📋</span> Minimum Requirements
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  VR Headset (Meta Quest 2/3) OR PC/Smartphone
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Internet: 10 Mbps (streaming mode)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Storage: 5GB per device
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  PC: Windows 10+, 8GB RAM, GTX 1060 (for PC VR)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Smartphone: 2018+ model (for Mobile VR)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20">
              <h3 className="text-xl font-bebas text-white mb-4 flex items-center">
                <span className="mr-2">⭐</span> Recommended Setup
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Meta Quest 3 headsets (best value & quality)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  WiFi 6 router for school
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  50 Mbps internet connection
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Charging station for multiple headsets
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Dedicated VR room with padded play area
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#5ce1e6]/10 border-l-4 border-[#5ce1e6] p-6 rounded-r-xl backdrop-blur-sm">
            <p className="font-lato text-sm text-gray-300">
              <span className="font-bold text-[#5ce1e6]">💡 Good News:</span>{" "}
              Offline mode is available for schools with limited internet.
              Download VR experiences once and use them without internet
              connection. Desktop mode works on any computer without VR headset.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(92,225,230,0.2),transparent_70%)]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Ready to Transform STEM Education with VR?
          </h2>
          <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join 10+ schools across Kenya already using VR to provide
            world-class STEM education to their students
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#5ce1e6] to-[#4dd4d9] hover:from-[#4dd4d9] hover:to-[#5ce1e6] text-black font-montserrat font-bold text-lg px-10 py-4 rounded-xl shadow-2xl shadow-[#5ce1e6]/50 hover:shadow-[#5ce1e6]/80 transition-all duration-300 hover:scale-105"
            >
              Schedule Free Demo
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-[#1a1a1a] text-white border-2 border-[#5ce1e6] hover:bg-[#5ce1e6] hover:text-black font-montserrat font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300"
            >
              Request Quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#5ce1e6] font-lato">
            🎁 Limited time offer: First 5 schools get 20% discount on hardware
            bundles
          </p>
        </div>
      </section>
    </div>
  );
}
