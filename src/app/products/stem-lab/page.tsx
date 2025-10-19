"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function STEMLabPage() {
  // Prevent hydration errors
  const [mounted, setMounted] = useState(false);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const labSlides = [
    {
      id: 1,
      image: "/hero/h2.jpg", // Replace with actual STEM lab image
      title: "Complete STEM Lab Solutions",
      subtitle:
        "From consultation to installation - we engineer fully-equipped STEM laboratories tailored to your curriculum, space, and budget.",
    },
    {
      id: 2,
      image: "/hero/h4.jpg", // Replace with actual STEM lab image
      title: "Turn Any Classroom Into a STEM Innovation Hub",
      subtitle:
        "Professional lab setup, equipment, training, and ongoing support - everything you need for world-class STEM education.",
    },
  ];

  // Filter States
  const [selectedPackage, setSelectedPackage] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % labSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [mounted, labSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % labSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + labSlides.length) % labSlides.length);
  };

  // Equipment Categories
  const equipmentCategories = [
    {
      id: "robotics",
      name: "Robotics Equipment",
      icon: "🤖",
      color: "from-blue-500 to-cyan-500",
      description:
        "Complete robotics ecosystem from basic to competition-level systems",
      items: [
        "LEGO Education SPIKE Prime",
        "Arduino & Raspberry Pi kits",
        "Competition robots (WRO, FLL)",
        "Sensors & motors collection",
        "Robot assembly tools",
      ],
      priceRange: "KES 50,000 - 500,000",
    },
    {
      id: "fabrication",
      name: "Digital Fabrication",
      icon: "🖨️",
      color: "from-purple-500 to-pink-500",
      description: "3D printing, laser cutting, and modern prototyping tools",
      items: [
        "3D printers (FDM & resin)",
        "Laser cutters",
        "CNC machines",
        "3D scanners",
        "Filament & materials",
      ],
      priceRange: "KES 100,000 - 800,000",
    },
    {
      id: "electronics",
      name: "Electronics & Coding",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
      description: "Circuit design, coding stations, and electronics workbench",
      items: [
        "Circuit boards & components",
        "Soldering stations",
        "Breadboards & multimeters",
        "Coding workstations",
        "Power supplies & testing equipment",
      ],
      priceRange: "KES 75,000 - 400,000",
    },
    {
      id: "science",
      name: "Science Equipment",
      icon: "🔬",
      color: "from-green-500 to-teal-500",
      description:
        "Biology, chemistry, and physics laboratory equipment and supplies",
      items: [
        "Microscopes (digital & traditional)",
        "Lab glassware & chemicals",
        "Biology dissection kits",
        "Physics experiment kits",
        "Safety equipment",
      ],
      priceRange: "KES 100,000 - 600,000",
    },
    {
      id: "workshop",
      name: "Workshop Tools",
      icon: "🛠️",
      color: "from-red-500 to-orange-500",
      description: "Hand tools, power tools, and complete workshop setup",
      items: [
        "Hand tools collection",
        "Power tools (drills, saws)",
        "Safety equipment & PPE",
        "Tool storage systems",
        "Workbenches & vices",
      ],
      priceRange: "KES 80,000 - 500,000",
    },
    {
      id: "computers",
      name: "Computer Stations",
      icon: "💻",
      color: "from-indigo-500 to-blue-500",
      description: "CAD workstations, programming stations, and networking",
      items: [
        "CAD-ready workstations",
        "Dual monitors setup",
        "Programming software licenses",
        "Network infrastructure",
        "Backup & security systems",
      ],
      priceRange: "KES 200,000 - 1,500,000",
    },
    {
      id: "design",
      name: "Design & Prototyping",
      icon: "📐",
      color: "from-pink-500 to-purple-500",
      description: "Engineering design tools and rapid prototyping equipment",
      items: [
        "Engineering drawing tools",
        "Drafting tables",
        "Modeling materials",
        "Testing equipment",
        "Project documentation tools",
      ],
      priceRange: "KES 60,000 - 300,000",
    },
    {
      id: "green-energy",
      name: "Green Energy Lab",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
      description: "Renewable energy systems and sustainability projects",
      items: [
        "Solar panel kits",
        "Wind turbine models",
        "Energy monitoring systems",
        "Sustainability projects",
        "Environmental sensors",
      ],
      priceRange: "KES 50,000 - 400,000",
    },
    {
      id: "storage",
      name: "Storage & Organization",
      icon: "🧰",
      color: "from-gray-600 to-gray-800",
      description:
        "Professional storage solutions and lab organization systems",
      items: [
        "Component drawers",
        "Tool cabinets",
        "Project storage",
        "Safety lockers",
        "Mobile carts",
      ],
      priceRange: "KES 40,000 - 250,000",
    },
  ];

  // Lab Packages
  const labPackages = [
    {
      id: "starter",
      name: "Starter Lab Package",
      price: "KES 500,000",
      type: "package",
      description: "Perfect for schools starting their STEM journey",
      features: [
        "Basic robotics kits (5 sets)",
        "Essential tools & safety equipment",
        "10 workstations with chairs",
        "Storage solutions & cabinets",
        "1-day professional setup",
        "2-day teacher training",
        "3 months support",
        "Basic lab furniture",
      ],
      popular: false,
      includes: "STARTER",
      budget: "low",
    },
    {
      id: "standard",
      name: "Standard Lab Package",
      price: "KES 1,500,000",
      type: "package",
      description: "Most popular choice for comprehensive STEM education",
      features: [
        "Advanced robotics (15 sets)",
        "Electronics & coding stations",
        "3D printer (FDM)",
        "20 workstations with ergonomic chairs",
        "Complete safety equipment",
        "Professional lab furniture",
        "3-day setup + 1-week training",
        "6 months support",
        "Curriculum integration guide",
      ],
      popular: true,
      includes: "POPULAR",
      budget: "medium",
    },
    {
      id: "professional",
      name: "Professional Lab Package",
      price: "KES 3,500,000",
      type: "package",
      description: "Premium lab for schools serious about STEM excellence",
      features: [
        "Complete robotics ecosystem (30 sets)",
        "Multiple 3D printers (FDM & resin)",
        "Laser cutter system",
        "Electronics lab station",
        "CAD workstations (10 units)",
        "30 workstations + full furniture",
        "Complete lab design & renovation",
        "1-week setup + 2-week intensive training",
        "12 months premium support",
        "Competition preparation program",
      ],
      popular: false,
      includes: "PREMIUM",
      budget: "high",
    },
    {
      id: "innovation",
      name: "Innovation Hub",
      price: "Custom Pricing",
      type: "package",
      description: "Ultimate STEM innovation space for leading schools",
      features: [
        "Everything in Professional +",
        "Makerspace tools & equipment",
        "AI/ML workstations",
        "IoT lab equipment",
        "Green energy lab",
        "Complete renovation & interior design",
        "Custom furniture & branding",
        "Ongoing support & curriculum",
        "Quarterly training workshops",
        "24/7 technical support",
        "Equipment upgrade path",
      ],
      popular: false,
      includes: "BEST VALUE",
      budget: "premium",
    },
  ];

  // Success Stories
  const successStories = [
    {
      id: 1,
      icon: "🏫",
      school: "Brookhouse School, Karen",
      testimonial:
        "Transformed our dated lab into a state-of-the-art innovation space. Student engagement increased 300%",
      setup: "Professional Lab Package",
      results: "3x Engagement, 5 Competition Wins",
    },
    {
      id: 2,
      icon: "🎓",
      school: "Makini School, Nairobi",
      testimonial:
        "The training was exceptional. Teachers now confidently lead robotics clubs and competitions",
      setup: "Standard Lab Package",
      results: "Teacher Confidence Up 400%",
    },
    {
      id: 3,
      icon: "🌟",
      school: "St. Mary's, Nairobi",
      testimonial:
        "Best investment we made. Students won 1st place at WRO Kenya thanks to the equipment and training",
      setup: "Innovation Hub",
      results: "WRO Kenya Champions 2024",
    },
    {
      id: 4,
      icon: "🔬",
      school: "Alliance Girls, Kikuyu",
      testimonial:
        "Professional setup, excellent support. The lab has become our school's crown jewel",
      setup: "Professional Lab Package",
      results: "98% Parent Satisfaction",
    },
  ];

  // Setup Process Timeline
  const setupProcess = [
    {
      phase: "Phase 1",
      title: "Consultation",
      duration: "Week 1",
      icon: "📋",
      activities: [
        "Needs assessment",
        "Space evaluation",
        "Budget planning",
        "Equipment selection",
      ],
    },
    {
      phase: "Phase 2",
      title: "Design",
      duration: "Week 2-3",
      icon: "✏️",
      activities: [
        "Lab layout blueprints",
        "Equipment list finalization",
        "Safety compliance review",
        "Quote approval",
      ],
    },
    {
      phase: "Phase 3",
      title: "Procurement",
      duration: "Week 4-8",
      icon: "📦",
      activities: [
        "Equipment ordering",
        "Custom fabrication",
        "Quality checks",
        "Delivery coordination",
      ],
    },
    {
      phase: "Phase 4",
      title: "Installation",
      duration: "Week 9-10",
      icon: "🔧",
      activities: [
        "Renovation works",
        "Furniture installation",
        "Equipment setup",
        "Safety systems",
      ],
    },
    {
      phase: "Phase 5",
      title: "Training",
      duration: "Week 11-12",
      icon: "👨‍🏫",
      activities: [
        "Teacher training",
        "Documentation handover",
        "Initial student sessions",
        "Ongoing support setup",
      ],
    },
  ];

  // Prevent hydration errors - show loading state until mounted
  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <div className="text-[#5ce1e6] font-bebas text-2xl">
            Loading STEM Lab Setup...
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
            {/* Background Image */}
            <Image
              src={labSlides[currentSlide].image}
              alt={labSlides[currentSlide].title}
              fill
              priority
              quality={95}
              className="object-cover brightness-110 contrast-110"
            />

            {/* Dark Gradient Overlay */}
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
                      {labSlides[currentSlide].title}
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
                      {labSlides[currentSlide].subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          50+
                        </div>
                        <div className="text-sm font-lato text-white">
                          Labs Built
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          15
                        </div>
                        <div className="text-sm font-lato text-white">
                          Equipment Types
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          6
                        </div>
                        <div className="text-sm font-lato text-white">
                          Months Training
                        </div>
                      </div>
                      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-xl p-4 text-center border border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg">
                        <div className="text-3xl font-bebas text-[#5ce1e6] drop-shadow-[0_2px_4px_rgba(92,225,230,0.5)]">
                          100%
                        </div>
                        <div className="text-sm font-lato text-white">
                          CBC Aligned
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
                        🏗️ Turnkey Solution
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        👨‍🏫 Teacher Training
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        🔧 Ongoing Support
                      </div>
                      <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#5ce1e6]/50 shadow-lg text-white">
                        💰 Flexible Financing
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
                          🔬
                        </div>
                        <h3 className="text-2xl font-bebas mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          Complete Lab Setup
                        </h3>
                        <p className="text-sm text-white font-lato drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          Everything you need for world-class STEM education
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🤖</div>
                          <p className="text-xs font-lato text-white">
                            Robotics
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🖨️</div>
                          <p className="text-xs font-lato text-white">
                            3D Printing
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">💻</div>
                          <p className="text-xs font-lato text-white">
                            CAD Stations
                          </p>
                        </div>
                        <div className="bg-[#0a0a0a]/95 rounded-xl p-4 text-center border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg">
                          <div className="text-3xl mb-2">🛠️</div>
                          <p className="text-xs font-lato text-white">
                            Workshop Tools
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
          {labSlides.map((_, index) => (
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

      {/* Equipment Categories Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Equipment Categories
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300 max-w-3xl mx-auto">
              Choose from 9 specialized equipment categories to build your
              perfect STEM lab
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentCategories.map((category) => (
              <div
                key={category.id}
                className="group bg-[#1f1f1f]/90 rounded-2xl shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60"
              >
                <div
                  className={`bg-gradient-to-br ${category.color} text-white p-6 text-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[#0a0a0a]/30"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bebas tracking-wide mb-2">
                      {category.name}
                    </h3>
                    <div className="bg-[#5ce1e6]/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-montserrat inline-block border border-[#5ce1e6]/40">
                      {category.priceRange}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="font-lato text-gray-300 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>

                  <h4 className="font-montserrat font-semibold text-white text-sm mb-3">
                    Includes:
                  </h4>
                  <ul className="space-y-2">
                    {category.items.slice(0, 5).map((item, idx) => (
                      <li key={idx} className="flex items-start text-xs">
                        <span className="text-[#5ce1e6] mr-2 flex-shrink-0">
                          ✓
                        </span>
                        <span className="font-lato text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Packages Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Complete Lab Packages
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300">
              From starter to innovation hub - choose the package that fits your
              vision and budget
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {labPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-[#1f1f1f]/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/50 hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                  pkg.popular
                    ? "border-[#5ce1e6] scale-105 shadow-[#5ce1e6]/30"
                    : "border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[#5ce1e6] text-black px-4 py-1 text-xs font-montserrat font-bold rounded-bl-lg shadow-lg shadow-[#5ce1e6]/50">
                    {pkg.includes}
                  </div>
                )}
                {!pkg.popular && pkg.includes && (
                  <div className="absolute top-0 right-0 bg-[#5ce1e6]/20 text-[#5ce1e6] px-4 py-1 text-xs font-montserrat font-bold rounded-bl-lg border border-[#5ce1e6]/40">
                    {pkg.includes}
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bebas text-white mb-2">
                      {pkg.name}
                    </h4>
                    <p className="text-sm font-lato text-gray-400 mb-4">
                      {pkg.description}
                    </p>
                    <div className="text-3xl font-bebas text-[#5ce1e6]">
                      {pkg.price}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
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
                      pkg.popular
                        ? "bg-[#5ce1e6] text-black hover:bg-[#4dd4d9] shadow-lg shadow-[#5ce1e6]/50"
                        : "bg-[#1a1a1a] text-white hover:bg-[#5ce1e6] hover:text-black border border-[#5ce1e6]/40"
                    }`}
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg font-lato text-gray-300 mb-4">
              Need a custom solution? We offer flexible payment plans and
              financing options
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#1a1a1a] text-white border-2 border-[#5ce1e6] hover:bg-[#5ce1e6] hover:text-black font-montserrat font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#5ce1e6]/50"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Setup Process Timeline */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Our Setup Process
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300">
              From consultation to completion - a proven 12-week process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {setupProcess.map((phase, index) => (
              <div key={index} className="relative">
                <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 border border-[#5ce1e6]/30 hover:border-[#5ce1e6]/60 transition-all shadow-lg hover:shadow-[#5ce1e6]/20">
                  <div className="text-5xl mb-4 text-center">{phase.icon}</div>
                  <div className="text-[#5ce1e6] font-montserrat font-bold text-sm mb-2">
                    {phase.phase}
                  </div>
                  <h3 className="text-xl font-bebas text-white mb-2">
                    {phase.title}
                  </h3>
                  <div className="text-sm text-gray-400 font-lato mb-4">
                    {phase.duration}
                  </div>
                  <ul className="space-y-2">
                    {phase.activities.map((activity, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs text-gray-300"
                      >
                        <span className="text-[#5ce1e6] mr-2">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
                {index < setupProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[#5ce1e6]/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Success Stories
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-300">
              Real results from schools across Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-8 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20"
              >
                <div className="text-5xl mb-4">{story.icon}</div>
                <h3 className="text-xl font-bebas text-white mb-3">
                  {story.school}
                </h3>
                <p className="font-lato text-gray-300 text-sm mb-4 italic">
                  &quot;{story.testimonial}&quot;
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-[#5ce1e6] font-montserrat font-semibold">
                    {story.setup}
                  </div>
                  <div className="bg-[#5ce1e6]/20 text-[#5ce1e6] px-3 py-1 rounded-full font-montserrat border border-[#5ce1e6]/40">
                    {story.results}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-white mb-4">
              Why Choose Our Lab Setup?
            </h2>
            <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🏗️</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Turnkey Solution
              </h3>
              <p className="text-sm font-lato text-gray-400">
                From design to installation, we handle everything. No stress, no
                hassle.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                CBC Aligned
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Equipment matches Kenya curriculum requirements perfectly.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Teacher Training
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Comprehensive training ensures teacher confidence and success.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Ongoing Support
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Not just setup - we're your long-term STEM education partner.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Cost-Effective
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Bulk purchasing power = better prices for quality equipment.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Safety First
              </h3>
              <p className="text-sm font-lato text-gray-400">
                All equipment meets international safety standards.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bebas text-white mb-3">Scalable</h3>
              <p className="text-sm font-lato text-gray-400">
                Start small, expand as budget allows. Flexible solutions.
              </p>
            </div>

            <div className="bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20 hover:shadow-xl transition-all border border-[#5ce1e6]/20 hover:border-[#5ce1e6]/60">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bebas text-white mb-3">
                Local Support
              </h3>
              <p className="text-sm font-lato text-gray-400">
                Kenya-based team for quick response and maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
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
                <span className="mr-2">📏</span> Space Requirements
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Minimum: 40 sq meters (10 students)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Standard: 80 sq meters (20 students)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Optimal: 120+ sq meters (30+ students)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Ceiling height: Minimum 3 meters
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Storage space: 10-20 sq meters
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20">
              <h3 className="text-xl font-bebas text-white mb-4 flex items-center">
                <span className="mr-2">⚡</span> Electrical Requirements
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  3-phase power supply (recommended)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  20+ power outlets (strategically placed)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Surge protection systems
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Emergency cutoff switches
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Backup power (UPS/generator)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-[#5ce1e6]/40 hover:border-[#5ce1e6]/80 transition-all shadow-lg shadow-black/50 hover:shadow-[#5ce1e6]/20">
              <h3 className="text-xl font-bebas text-white mb-4 flex items-center">
                <span className="mr-2">🛡️</span> Safety Features
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Fire extinguishers (multiple locations)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  First aid station (fully equipped)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Emergency exits (clearly marked)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Safety signage & procedures
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Proper ventilation systems
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] rounded-xl p-6 border-2 border-gray-400/40 hover:border-gray-400/80 transition-all shadow-lg shadow-black/50">
              <h3 className="text-xl font-bebas text-white mb-4 flex items-center">
                <span className="mr-2">🌐</span> Network & Infrastructure
              </h3>
              <ul className="space-y-2 text-sm font-lato text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  High-speed internet (50+ Mbps)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  WiFi coverage (enterprise grade)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Network switches & cabling
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Server room/cabinet (optional)
                </li>
                <li className="flex items-start">
                  <span className="text-[#5ce1e6] mr-2">•</span>
                  Backup & cloud storage
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#5ce1e6]/10 border-l-4 border-[#5ce1e6] p-6 rounded-r-xl backdrop-blur-sm">
            <p className="font-lato text-sm text-gray-300">
              <span className="font-bold text-[#5ce1e6]">💡 Good News:</span>{" "}
              Don't have all these requirements? No problem! We can help with
              renovations, electrical upgrades, and infrastructure setup as part
              of our complete lab solution.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(92,225,230,0.2),transparent_70%)]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Ready to Build Your STEM Lab?
          </h2>
          <div className="w-24 h-1 bg-[#5ce1e6] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join 50+ schools across Kenya who have transformed their STEM
            education with our complete lab solutions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#5ce1e6] to-[#4dd4d9] hover:from-[#4dd4d9] hover:to-[#5ce1e6] text-black font-montserrat font-bold text-lg px-10 py-4 rounded-xl shadow-2xl shadow-[#5ce1e6]/50 hover:shadow-[#5ce1e6]/80 transition-all duration-300 hover:scale-105"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-[#1a1a1a] text-white border-2 border-[#5ce1e6] hover:bg-[#5ce1e6] hover:text-black font-montserrat font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300"
            >
              Request Quote
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#5ce1e6] font-lato">
            🎁 Special Offer: First 10 schools get 15% discount on complete lab
            packages
          </p>
        </div>
      </section>
    </div>
  );
}
