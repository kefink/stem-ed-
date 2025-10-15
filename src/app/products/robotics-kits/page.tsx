"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Type definitions
interface ProductFeature {
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  features: ProductFeature[];
  specifications: { [key: string]: string };
  price: string;
  imageUrl: string;
  ageRange: string[];
  educationLevel: string[];
  functionality?: string[];
}

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories?: SubcategoryData[];
}

interface SubcategoryData {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Main Categories
const productCategories: CategoryData[] = [
  {
    id: "educational",
    name: "Educational Robotics Kits",
    icon: "🎓",
    color: "from-blue-500 to-blue-700",
    description:
      "Complete robotics learning kits designed for classroom and home education. Includes curriculum-aligned projects, sensors, actuators, and programming interfaces. Perfect for STEM education from elementary to university level.",
  },
  {
    id: "competition",
    name: "Competition Robotics Kits",
    icon: "🏆",
    color: "from-orange-500 to-red-600",
    description:
      "Professional-grade robotics kits for FLL (First Lego League), WRO (World Robot Olympiad), and national competitions. High-performance components, advanced sensors, and competition-ready structures.",
  },
  {
    id: "electronics",
    name: "Electronics Components",
    icon: "⚡",
    color: "from-purple-500 to-purple-700",
    description:
      "Individual electronic components and modules for custom robotics projects. Includes robot control units, sensors, actuators, cables, and mechanical structures.",
    subcategories: [
      {
        id: "rcu",
        name: "Robot Control Units (RCU)",
        description:
          "Microcontrollers and control boards: Arduino, Raspberry Pi, ESP32, custom RCUs",
        icon: "🔌",
      },
      {
        id: "handle",
        name: "Handles & Controllers",
        description:
          "Remote controls, joysticks, PS4 controllers, smartphone apps",
        icon: "🎮",
      },
      {
        id: "actuator",
        name: "Actuators & Motors",
        description:
          "Servo motors, DC motors, stepper motors, linear actuators, motor drivers",
        icon: "⚙️",
      },
      {
        id: "sensor",
        name: "Sensors & Modules",
        description:
          "Ultrasonic, infrared, line followers, gyroscopes, accelerometers, cameras",
        icon: "📡",
      },
      {
        id: "cable",
        name: "Cables & Connectors",
        description:
          "Jumper wires, servo cables, power cables, USB cables, connectors",
        icon: "🔗",
      },
      {
        id: "mechanical",
        name: "Mechanical Structures",
        description:
          "Chassis, wheels, gears, brackets, mounting hardware, structural components",
        icon: "🏗️",
      },
    ],
  },
];

// Educational Robotics Kits Data (Placeholder - will be populated with real products)
const educationalKits: Product[] = [
  {
    id: "edu-starter-basic",
    name: "STEM-ED Basic Robotics Kit",
    category: "educational",
    subcategory: "basic",
    description:
      "Perfect introduction to robotics for young learners. Includes easy-to-assemble components, visual programming interface, and 10+ guided projects. No prior experience needed.",
    features: [
      {
        name: "Visual Block Programming",
        description: "Drag-and-drop coding with Scratch-based interface",
      },
      {
        name: "10+ Projects Included",
        description: "Line follower, obstacle avoider, light seeker, and more",
      },
      {
        name: "Durable Components",
        description: "Child-safe, robust materials for classroom use",
      },
      {
        name: "Teacher Resources",
        description: "Lesson plans, worksheets, and assessment tools",
      },
    ],
    specifications: {
      "Control Unit": "Arduino Uno compatible",
      Sensors: "2x Ultrasonic, 2x Line sensor, 1x Light sensor",
      Actuators: "2x DC motors, 1x Servo motor",
      Power: "6AA Battery holder or USB",
      Programming: "Scratch, mBlock, Arduino IDE",
      "Age Range": "8-12 years",
    },
    price: "KES 12,000",
    imageUrl: "/products/robotics/basic-kit-placeholder.jpg",
    ageRange: ["8-12"],
    educationLevel: ["elementary", "middle"],
    functionality: ["basic-sensors", "visual-programming"],
  },
  {
    id: "edu-advanced-ai",
    name: "STEM-ED AI Robotics Kit",
    category: "educational",
    subcategory: "advanced",
    description:
      "Advanced robotics kit with AI integration. Features computer vision, machine learning capabilities, and autonomous navigation. Ideal for high school and university STEM programs.",
    features: [
      {
        name: "AI & Machine Learning",
        description: "TensorFlow Lite integration for object recognition",
      },
      {
        name: "Computer Vision",
        description: "Camera module with OpenCV support",
      },
      {
        name: "Autonomous Navigation",
        description: "SLAM algorithms and path planning",
      },
      {
        name: "Python Programming",
        description: "Professional coding with Jupyter notebooks",
      },
    ],
    specifications: {
      "Control Unit": "Raspberry Pi 4 (4GB RAM)",
      Camera: "8MP wide-angle camera module",
      Sensors: "IMU, Ultrasonic array, LIDAR (optional)",
      Actuators: "4x Brushless motors, 4x Servo motors",
      Power: "LiPo battery with charger",
      Programming: "Python, ROS, TensorFlow",
      "Age Range": "16+ years",
    },
    price: "KES 85,000",
    imageUrl: "/products/robotics/ai-kit-placeholder.jpg",
    ageRange: ["16+"],
    educationLevel: ["high", "college"],
    functionality: [
      "ai-integration",
      "computer-vision",
      "autonomous-navigation",
    ],
  },
];

// Competition Robotics Kits Data (Placeholder)
const competitionKits: Product[] = [
  {
    id: "comp-fll-starter",
    name: "FLL Competition Starter Kit",
    category: "competition",
    subcategory: "fll",
    description:
      "Official FLL-compatible robotics kit. Includes all components needed to build competitive robots for First Lego League challenges. High-precision sensors and robust construction.",
    features: [
      {
        name: "FLL Compatible",
        description: "Meets all FLL competition requirements",
      },
      {
        name: "Precision Sensors",
        description: "Color, ultrasonic, gyro, and touch sensors",
      },
      {
        name: "Powerful Motors",
        description: "Large and medium servo motors for reliable performance",
      },
      {
        name: "Expansion Ready",
        description: "Compatible with additional sensors and accessories",
      },
    ],
    specifications: {
      "Control Unit": "EV3 Intelligent Brick or Spike Prime",
      Sensors: "Color x2, Ultrasonic, Gyro, Touch x2",
      Actuators: "Large motor x2, Medium motor x2",
      "Building Elements": "500+ pieces including gears, axles, beams",
      Power: "Rechargeable battery pack",
      Programming: "EV3 Software, Spike App, Python",
      "Age Range": "9-16 years",
    },
    price: "KES 65,000",
    imageUrl: "/products/robotics/fll-kit-placeholder.jpg",
    ageRange: ["9-16"],
    educationLevel: ["elementary", "middle", "high"],
    functionality: [],
  },
  {
    id: "comp-wro-advanced",
    name: "WRO Advanced Competition Kit",
    category: "competition",
    subcategory: "wro",
    description:
      "Professional World Robot Olympiad competition kit. Advanced sensors, high-torque motors, and custom mechanical components. For serious competitors aiming for international competition.",
    features: [
      { name: "WRO Certified", description: "Approved for WRO competitions" },
      {
        name: "Advanced Sensors",
        description: "Vision camera, LIDAR, IMU, and more",
      },
      {
        name: "High Performance",
        description: "Brushless motors and precision control",
      },
      { name: "Custom Chassis", description: "Aluminum frame for durability" },
    ],
    specifications: {
      "Control Unit": "Arduino Mega + Raspberry Pi combo",
      Camera: "HD camera with AI processing",
      Sensors: "LIDAR, IMU, Color array, Ultrasonic array",
      Actuators: "Brushless motors x4, Servo motors x6",
      "Build Quality": "Aluminum chassis, precision parts",
      Power: "High-capacity LiPo battery",
      Programming: "Arduino IDE, Python, C++",
      "Age Range": "13-19 years",
    },
    price: "KES 125,000",
    imageUrl: "/products/robotics/wro-kit-placeholder.jpg",
    ageRange: ["13-19"],
    educationLevel: ["middle", "high", "college"],
    functionality: [],
  },
];

// Electronics Components Data (Placeholder - more will be added)
const electronicsComponents: Product[] = [
  {
    id: "rcu-arduino-uno",
    name: "Arduino Uno R3 - Official",
    category: "electronics",
    subcategory: "rcu",
    description:
      "The most popular microcontroller board for robotics projects. Easy to program, vast community support, compatible with thousands of sensors and shields.",
    features: [
      { name: "ATmega328P", description: "Powerful 8-bit microcontroller" },
      { name: "14 Digital I/O", description: "6 can be used as PWM outputs" },
      { name: "6 Analog Inputs", description: "10-bit resolution ADC" },
      { name: "USB Programming", description: "Easy upload via USB cable" },
    ],
    specifications: {
      Microcontroller: "ATmega328P",
      "Operating Voltage": "5V",
      "Input Voltage": "7-12V (recommended)",
      "Digital I/O Pins": "14 (6 PWM)",
      "Analog Input Pins": "6",
      "DC Current per I/O": "20 mA",
      "Flash Memory": "32 KB",
      SRAM: "2 KB",
      "Clock Speed": "16 MHz",
    },
    price: "KES 2,500",
    imageUrl: "/products/electronics/arduino-uno-placeholder.jpg",
    ageRange: ["12+"],
    educationLevel: ["middle", "high", "college"],
    functionality: [],
  },
  {
    id: "sensor-ultrasonic-hcsr04",
    name: "HC-SR04 Ultrasonic Sensor",
    category: "electronics",
    subcategory: "sensor",
    description:
      "Accurate ultrasonic distance sensor for obstacle detection and ranging. Range 2cm to 400cm, perfect for autonomous robots.",
    features: [
      { name: "Wide Range", description: "Detects objects from 2cm to 4m" },
      { name: "High Accuracy", description: "±3mm precision" },
      { name: "Easy Interface", description: "Simple trigger and echo pins" },
      { name: "Low Power", description: "Only 15mA operating current" },
    ],
    specifications: {
      "Working Voltage": "DC 5V",
      "Working Current": "15mA",
      "Working Frequency": "40Hz",
      "Max Range": "4m",
      "Min Range": "2cm",
      "Measuring Angle": "15 degrees",
      "Trigger Input": "10µS TTL pulse",
      Dimension: "45mm x 20mm x 15mm",
    },
    price: "KES 350",
    imageUrl: "/products/electronics/ultrasonic-placeholder.jpg",
    ageRange: ["10+"],
    educationLevel: ["elementary", "middle", "high", "college"],
    functionality: [],
  },
];

// Filter options
const educationLevels = [
  { id: "elementary", name: "Elementary (K-5)", ages: "5-11 years" },
  { id: "middle", name: "Middle School (6-8)", ages: "11-14 years" },
  { id: "high", name: "High School (9-12)", ages: "14-18 years" },
  { id: "college", name: "College/University", ages: "18+ years" },
];

const ageRanges = [
  { id: "5-8", name: "5-8 years" },
  { id: "8-12", name: "8-12 years" },
  { id: "12-16", name: "12-16 years" },
  { id: "16+", name: "16+ years" },
];

const functionalityOptions = [
  { id: "basic-sensors", name: "Basic Sensors" },
  { id: "visual-programming", name: "Visual Programming" },
  { id: "ai-integration", name: "AI Integration" },
  { id: "computer-vision", name: "Computer Vision" },
  { id: "autonomous-navigation", name: "Autonomous Navigation" },
];

export default function RoboticsKitsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [selectedEducation, setSelectedEducation] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedFunctionality, setSelectedFunctionality] =
    useState<string>("all");

  // Get products based on selected category
  const getProducts = (): Product[] => {
    if (!selectedCategory) return [];

    let products: Product[] = [];
    if (selectedCategory === "educational") {
      products = educationalKits;
    } else if (selectedCategory === "competition") {
      products = competitionKits;
    } else if (selectedCategory === "electronics") {
      products = electronicsComponents;
      if (selectedSubcategory) {
        products = products.filter(
          (p) => p.subcategory === selectedSubcategory
        );
      }
    }

    // Apply filters
    if (selectedEducation !== "all") {
      products = products.filter((p) =>
        p.educationLevel.includes(selectedEducation)
      );
    }
    if (selectedAge !== "all") {
      products = products.filter((p) =>
        p.ageRange.some((age) => age.includes(selectedAge))
      );
    }
    if (selectedFunctionality !== "all" && selectedCategory === "educational") {
      products = products.filter((p) =>
        p.functionality?.includes(selectedFunctionality)
      );
    }

    return products;
  };

  const products = getProducts();
  const selectedCategoryData = selectedCategory
    ? productCategories.find((c) => c.id === selectedCategory)
    : null;

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

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide animate-fade-in">
            Robotics Kits & Components
          </h1>
          <div className="w-24 h-1 bg-orange mb-6"></div>
          <p className="text-xl md:text-2xl lg:text-3xl font-lato max-w-4xl text-white/95 leading-relaxed mb-8">
            Professional robotics kits, competition-grade equipment, and
            individual electronic components for every level of robotics
            education and development.
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              ✓ Educational Kits
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              ✓ Competition Ready
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              ✓ Individual Components
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              ✓ AI Integration Available
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Category Selection */}
          {!selectedCategory && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
                  Choose Your Category
                </h2>
                <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
                <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
                  Select from educational kits, competition equipment, or
                  individual electronic components
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {productCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="group text-left bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-transparent hover:border-orange/30"
                  >
                    <div
                      className={`bg-gradient-to-br ${category.color} text-white p-8 text-center`}
                    >
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bebas tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="font-lato text-gray-700 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="text-orange font-montserrat font-semibold flex items-center">
                        Browse Products{" "}
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

          {/* Category Details View */}
          {selectedCategory && selectedCategoryData && (
            <div className="animate-fade-in">
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className="mb-8 flex items-center text-orange hover:text-orange-dark font-montserrat font-semibold transition-colors"
              >
                <span className="mr-2">←</span> Back to Categories
              </button>

              {/* Category Header */}
              <div
                className={`bg-gradient-to-br ${selectedCategoryData.color} text-white rounded-3xl p-8 md:p-12 mb-8 shadow-2xl`}
              >
                <div className="flex items-start gap-6">
                  <div className="text-7xl md:text-8xl">
                    {selectedCategoryData.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-6xl font-bebas mb-4 tracking-wide">
                      {selectedCategoryData.name}
                    </h2>
                    <p className="text-lg md:text-xl font-lato leading-relaxed text-white/95">
                      {selectedCategoryData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subcategories for Electronics */}
              {selectedCategory === "electronics" &&
                selectedCategoryData.subcategories && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bebas text-navy mb-4">
                      Select Component Type:
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedCategoryData.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubcategory(sub.id)}
                          className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                            selectedSubcategory === sub.id
                              ? "border-orange bg-orange/5 shadow-lg"
                              : "border-gray-200 bg-white hover:border-orange/50 hover:shadow-md"
                          }`}
                        >
                          <div className="text-4xl mb-3">{sub.icon}</div>
                          <h4 className="text-lg font-bebas text-navy mb-2">
                            {sub.name}
                          </h4>
                          <p className="font-lato text-gray-600 text-sm">
                            {sub.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Filters Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                <h3 className="text-3xl font-bebas text-navy mb-6">
                  Filter Products
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

                  {/* Age Range Filter */}
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
                      {ageRanges.map((age) => (
                        <option key={age.id} value={age.id}>
                          {age.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Functionality Filter (for Educational Kits) */}
                  {selectedCategory === "educational" && (
                    <div>
                      <label className="block font-montserrat font-semibold text-navy mb-3">
                        Functionality
                      </label>
                      <select
                        value={selectedFunctionality}
                        onChange={(e) =>
                          setSelectedFunctionality(e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg font-lato focus:outline-none focus:border-orange transition-colors"
                      >
                        <option value="all">All Features</option>
                        {functionalityOptions.map((func) => (
                          <option key={func.id} value={func.id}>
                            {func.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Active Filters Display */}
                {(selectedEducation !== "all" ||
                  selectedAge !== "all" ||
                  selectedFunctionality !== "all") && (
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
                      {selectedAge !== "all" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-montserrat">
                          {ageRanges.find((a) => a.id === selectedAge)?.name}
                        </span>
                      )}
                      {selectedFunctionality !== "all" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-montserrat">
                          {
                            functionalityOptions.find(
                              (f) => f.id === selectedFunctionality
                            )?.name
                          }
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedEducation("all");
                          setSelectedAge("all");
                          setSelectedFunctionality("all");
                        }}
                        className="text-sm text-gray-500 hover:text-orange transition-colors underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div>
                <h3 className="text-3xl font-bebas text-navy mb-6">
                  Available Products ({products.length})
                </h3>

                {products.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <p className="text-xl font-lato text-gray-500">
                      No products match your filters. Try adjusting your
                      selections.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-orange/30"
                      >
                        {/* Product Image */}
                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <div className="text-center">
                              <div className="text-6xl mb-2">📦</div>
                              <p className="text-sm text-gray-500 font-lato">
                                Image Coming Soon
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-xl font-bebas text-navy flex-1">
                              {product.name}
                            </h4>
                            <span className="text-2xl font-bebas text-orange ml-2">
                              {product.price}
                            </span>
                          </div>

                          <p className="font-lato text-gray-600 text-sm mb-4 line-clamp-3">
                            {product.description}
                          </p>

                          {/* Key Specifications */}
                          <div className="mb-4">
                            <h5 className="font-montserrat font-semibold text-navy text-sm mb-2">
                              Key Specifications:
                            </h5>
                            <div className="space-y-1">
                              {Object.entries(product.specifications)
                                .slice(0, 3)
                                .map(([key, value]) => (
                                  <div key={key} className="flex text-xs">
                                    <span className="font-montserrat text-gray-500 w-32">
                                      {key}:
                                    </span>
                                    <span className="font-lato text-gray-700">
                                      {value}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.ageRange.slice(0, 1).map((age) => (
                              <span
                                key={age}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                              >
                                {age} years
                              </span>
                            ))}
                            {product.educationLevel.slice(0, 2).map((level) => (
                              <span
                                key={level}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                              >
                                {
                                  educationLevels
                                    .find((l) => l.id === level)
                                    ?.name.split(" ")[0]
                                }
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <Link
                            href="/contact"
                            className="block w-full bg-orange hover:bg-orange-dark text-white text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Note Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-xl">
            <h3 className="text-2xl font-bebas text-navy mb-3">
              📸 Product Images Coming Soon
            </h3>
            <p className="font-lato text-gray-700 leading-relaxed mb-4">
              We're currently preparing high-quality product images and detailed
              specifications for all our robotics kits and components. Each
              product will include:
            </p>
            <ul className="font-lato text-gray-700 space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-orange mr-2">✓</span>
                <span>
                  Professional product photography from multiple angles
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-orange mr-2">✓</span>
                <span>Detailed specification sheets and datasheets</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange mr-2">✓</span>
                <span>Usage examples and project demonstrations</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange mr-2">✓</span>
                <span>Compatibility charts and accessory listings</span>
              </li>
            </ul>
            <p className="font-lato text-gray-700 mt-4">
              Contact us for current product availability, detailed
              specifications, and bulk pricing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.15),transparent_70%)]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Need Help Choosing the Right Kit?
          </h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
            Our robotics experts can help you select the perfect equipment for
            your educational needs and budget
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block btn-primary bg-orange hover:bg-orange-dark text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-orange/50 transition-all duration-300"
            >
              Contact Our Team
            </Link>
            <Link
              href="/products"
              className="inline-block bg-white text-navy hover:bg-gray-100 font-montserrat font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
