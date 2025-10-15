"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Type definitions
interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  targetUsers: string[];
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  targetUser: string;
  popular?: boolean;
}

// AI Learning Platform Features
const platformFeatures: Feature[] = [
  {
    id: "personalized-learning",
    name: "Personalized Learning Paths",
    description: "AI-driven adaptive learning that customizes content, pace, and difficulty based on individual student performance, learning style, and progress.",
    icon: "🎯",
    benefits: [
      "Adaptive curriculum that adjusts to student pace",
      "Learning style detection (visual, auditory, kinesthetic)",
      "Skill gap identification and targeted remediation",
      "Personalized content recommendations",
      "Dynamic difficulty adjustment",
      "Individual learning goals and milestones"
    ],
    targetUsers: ["students", "teachers"]
  },
  {
    id: "ai-tutor",
    name: "24/7 AI Tutor Assistant",
    description: "Intelligent virtual tutor powered by advanced AI that provides instant help, explanations, and guidance across all STEM subjects at any time.",
    icon: "🤖",
    benefits: [
      "Instant answers to student questions",
      "Step-by-step problem-solving guidance",
      "Multi-language support",
      "Voice and text interaction",
      "Context-aware explanations",
      "Learning style adaptation",
      "Homework help and practice problems"
    ],
    targetUsers: ["students"]
  },
  {
    id: "progress-tracking",
    name: "Real-Time Progress Analytics",
    description: "Comprehensive dashboard with AI-powered insights tracking student performance, engagement, and learning outcomes across all subjects and activities.",
    icon: "📊",
    benefits: [
      "Live performance dashboards",
      "Predictive analytics for at-risk students",
      "Skill mastery tracking",
      "Time-on-task analysis",
      "Engagement metrics",
      "Parent/guardian notifications",
      "Customizable reports"
    ],
    targetUsers: ["teachers", "admins", "schools"]
  },
  {
    id: "interactive-simulations",
    name: "Interactive STEM Simulations",
    description: "Physics, chemistry, biology, and mathematics simulations powered by AI to create safe, engaging virtual lab experiences.",
    icon: "🔬",
    benefits: [
      "Virtual lab experiments",
      "3D interactive models",
      "Real-time feedback on experiments",
      "Safe exploration of dangerous scenarios",
      "Unlimited trial and error learning",
      "Multi-sensory learning experiences"
    ],
    targetUsers: ["students", "teachers"]
  },
  {
    id: "assessment-generation",
    name: "AI-Powered Assessment Tools",
    description: "Automatically generate quizzes, tests, and assignments tailored to curriculum standards and student learning levels.",
    icon: "📝",
    benefits: [
      "Auto-generated assessments",
      "Curriculum-aligned questions",
      "Multiple question formats",
      "Instant grading and feedback",
      "Plagiarism detection",
      "Performance analytics",
      "Custom rubrics"
    ],
    targetUsers: ["teachers"]
  },
  {
    id: "collaborative-learning",
    name: "Collaborative Learning Spaces",
    description: "AI-facilitated group work environments that promote peer learning, project collaboration, and knowledge sharing.",
    icon: "👥",
    benefits: [
      "Virtual study groups",
      "Real-time collaboration tools",
      "Peer tutoring matching",
      "Group project management",
      "Discussion forums with AI moderation",
      "Shared workspaces"
    ],
    targetUsers: ["students", "teachers"]
  },
  {
    id: "teacher-dashboard",
    name: "Comprehensive Teacher Dashboard",
    description: "Centralized control center for managing classes, assignments, grading, and student communication with AI-powered insights.",
    icon: "👨‍🏫",
    benefits: [
      "Class management tools",
      "Assignment creation and distribution",
      "Automated grading",
      "Student performance insights",
      "Lesson planning assistance",
      "Parent communication portal",
      "Resource library"
    ],
    targetUsers: ["teachers"]
  },
  {
    id: "admin-portal",
    name: "School Admin Portal",
    description: "Enterprise-level management system for school administrators to oversee multiple classes, teachers, and school-wide performance metrics.",
    icon: "🏫",
    benefits: [
      "Multi-class/school management",
      "Teacher performance analytics",
      "School-wide progress reports",
      "Curriculum compliance tracking",
      "Budget and resource allocation",
      "Staff management",
      "Parent engagement metrics"
    ],
    targetUsers: ["admins", "schools"]
  },
  {
    id: "gamification",
    name: "Gamification & Rewards",
    description: "AI-powered game mechanics including points, badges, leaderboards, and challenges to increase student engagement and motivation.",
    icon: "🎮",
    benefits: [
      "Achievement badges and trophies",
      "Student leaderboards",
      "Daily challenges",
      "Progress streaks",
      "Virtual rewards system",
      "Competitive learning modes"
    ],
    targetUsers: ["students"]
  },
  {
    id: "content-library",
    name: "AI-Curated Content Library",
    description: "Vast repository of STEM resources, videos, articles, and interactive content curated and recommended by AI based on curriculum and student needs.",
    icon: "📚",
    benefits: [
      "10,000+ learning resources",
      "AI-recommended content",
      "Curriculum-aligned materials",
      "Multi-format content (video, text, interactive)",
      "Regular content updates",
      "Custom resource upload"
    ],
    targetUsers: ["teachers", "students"]
  },
  {
    id: "accessibility",
    name: "Accessibility & Inclusion",
    description: "Built-in accessibility features ensuring all students can learn effectively, including those with special needs or learning differences.",
    icon: "♿",
    benefits: [
      "Text-to-speech functionality",
      "Speech-to-text input",
      "High contrast modes",
      "Screen reader compatibility",
      "Dyslexia-friendly fonts",
      "Multi-language support",
      "Closed captioning"
    ],
    targetUsers: ["students", "teachers", "schools"]
  },
  {
    id: "mobile-app",
    name: "Mobile Learning App",
    description: "Full-featured mobile application for iOS and Android enabling learning anywhere, anytime with offline capabilities.",
    icon: "📱",
    benefits: [
      "iOS and Android apps",
      "Offline learning mode",
      "Push notifications",
      "Mobile-optimized content",
      "Cross-device sync",
      "Touch-optimized interface"
    ],
    targetUsers: ["students", "teachers"]
  }
];

// Pricing Plans
const pricingPlans: PricingPlan[] = [
  {
    id: "student",
    name: "Student Plan",
    description: "Perfect for individual students and homeschooling",
    price: "KES 1,500/month",
    features: [
      "Personalized learning paths",
      "24/7 AI tutor access",
      "Interactive STEM simulations",
      "Progress tracking dashboard",
      "Gamification & rewards",
      "Mobile app access",
      "Homework help",
      "Offline learning mode"
    ],
    targetUser: "students"
  },
  {
    id: "teacher",
    name: "Teacher Plan",
    description: "Comprehensive tools for individual teachers",
    price: "KES 5,000/month",
    features: [
      "Up to 50 students",
      "Teacher dashboard",
      "AI assessment generation",
      "Automated grading",
      "Class management",
      "Progress analytics",
      "Parent communication",
      "Resource library",
      "All student plan features"
    ],
    targetUser: "teachers",
    popular: true
  },
  {
    id: "school",
    name: "School Plan",
    description: "Complete solution for entire schools",
    price: "From KES 50,000/month",
    features: [
      "Unlimited teachers & students",
      "School admin portal",
      "Multi-class management",
      "School-wide analytics",
      "Custom branding",
      "Priority support",
      "Training & onboarding",
      "API access",
      "All teacher plan features"
    ],
    targetUser: "schools"
  },
  {
    id: "admin",
    name: "Admin/District Plan",
    description: "Enterprise solution for multiple schools",
    price: "Custom pricing",
    features: [
      "Multiple schools management",
      "District-wide analytics",
      "Custom integrations",
      "Dedicated support team",
      "On-premise deployment option",
      "Advanced security",
      "Custom development",
      "SLA guarantees",
      "All school plan features"
    ],
    targetUser: "admins"
  }
];

// User type options
const userTypes = [
  { id: "all", name: "All Users", icon: "👥" },
  { id: "students", name: "Students", icon: "🎓" },
  { id: "teachers", name: "Teachers", icon: "👨‍🏫" },
  { id: "schools", name: "Schools", icon: "🏫" },
  { id: "admins", name: "School Admins", icon: "👔" }
];

export default function AILearningPlatformPage() {
  const [selectedUserType, setSelectedUserType] = useState<string>("all");

  // Filter features based on selected user type
  const filteredFeatures = selectedUserType === "all" 
    ? platformFeatures 
    : platformFeatures.filter(feature => 
        feature.targetUsers.includes(selectedUserType)
      );

  // Filter pricing plans based on selected user type
  const filteredPlans = selectedUserType === "all"
    ? pricingPlans
    : pricingPlans.filter(plan => 
        plan.targetUser === selectedUserType || selectedUserType === "schools" || selectedUserType === "admins"
      );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white py-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.08),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/products" className="inline-flex items-center text-orange hover:text-orange-light mb-6 transition-colors">
            <span className="mr-2">←</span> Back to Products
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas mb-6 tracking-wide animate-fade-in">
                AI Learning Platform
              </h1>
              <div className="w-24 h-1 bg-orange mb-6"></div>
              <p className="text-xl md:text-2xl font-lato text-white/95 leading-relaxed mb-8">
                Revolutionary AI-powered learning management system with personalized education, intelligent tutoring, and comprehensive analytics for students, teachers, and schools.
              </p>
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  ✓ AI Tutor 24/7
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  ✓ Personalized Learning
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  ✓ Real-Time Analytics
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  ✓ Mobile & Web
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">💻</div>
                  <h3 className="text-2xl font-bebas">Powered by Advanced AI</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm font-lato">Adaptive Learning</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🤖</div>
                    <p className="text-sm font-lato">AI Tutor</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-sm font-lato">Analytics</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🔬</div>
                    <p className="text-sm font-lato">Simulations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Filter */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bebas text-navy mb-6 text-center">
            Select Your User Type
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedUserType(type.id)}
                className={`px-6 py-3 rounded-xl font-montserrat font-semibold transition-all duration-300 ${
                  selectedUserType === type.id
                    ? "bg-orange text-white shadow-lg scale-105"
                    : "bg-gray-100 text-navy hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
              {selectedUserType === "all" ? "All Platform Features" : `Features for ${userTypes.find(t => t.id === selectedUserType)?.name}`}
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Showing {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''} available for your selection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-orange/30"
              >
                <div className="bg-gradient-to-br from-orange to-orange-dark text-white p-6 text-center">
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bebas tracking-wide">
                    {feature.name}
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="font-lato text-gray-700 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <h4 className="font-montserrat font-semibold text-navy text-sm mb-3">
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {feature.benefits.slice(0, 4).map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-xs">
                        <span className="text-orange mr-2 flex-shrink-0">✓</span>
                        <span className="font-lato text-gray-600">{benefit}</span>
                      </li>
                    ))}
                    {feature.benefits.length > 4 && (
                      <li className="text-xs text-gray-500 italic">
                        +{feature.benefits.length - 4} more benefits
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-montserrat">
                      For: {feature.targetUsers.map(u => 
                        userTypes.find(t => t.id === u)?.name
                      ).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
              Flexible Pricing Plans
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto mb-6"></div>
            <p className="text-xl font-lato text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your needs - from individual students to entire school districts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                  plan.popular 
                    ? "border-orange scale-105" 
                    : "border-gray-200 hover:border-orange/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-orange text-white px-4 py-1 text-xs font-montserrat font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bebas text-navy mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm font-lato text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    <div className="text-3xl font-bebas text-orange">
                      {plan.price}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="text-orange mr-2 flex-shrink-0">✓</span>
                        <span className="font-lato text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/contact"
                    className={`block w-full text-center font-montserrat font-semibold py-3 rounded-lg transition-all duration-300 ${
                      plan.popular
                        ? "bg-orange text-white hover:bg-orange-dark shadow-lg"
                        : "bg-navy text-white hover:bg-navy-light"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-lato text-gray-600 mb-4">
              Need a custom solution? Contact us for enterprise pricing and custom integrations.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white font-montserrat font-bold px-8 py-3 rounded-lg transition-all duration-300"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎥</div>
              <h2 className="text-4xl font-bebas text-navy mb-4">
                See It In Action
              </h2>
              <p className="text-xl font-lato text-gray-700">
                Schedule a personalized demo and discover how our AI Learning Platform can transform your educational experience
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="font-bebas text-lg text-navy mb-2">Live Demo</h4>
                <p className="text-sm font-lato text-gray-600">
                  Interactive walkthrough of all features
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="text-4xl mb-3">💬</div>
                <h4 className="font-bebas text-lg text-navy mb-2">Q&A Session</h4>
                <p className="text-sm font-lato text-gray-600">
                  Get answers to all your questions
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="text-4xl mb-3">🎁</div>
                <h4 className="font-bebas text-lg text-navy mb-2">Free Trial</h4>
                <p className="text-sm font-lato text-gray-600">
                  30-day free trial included
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-orange to-orange-dark text-white font-montserrat font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Schedule Free Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-navy via-navy-dark to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.15),transparent_70%)]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas mb-6 tracking-wide">
            Ready to Transform Education with AI?
          </h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-lato mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students, teachers, and schools already using our AI Learning Platform to achieve better educational outcomes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block btn-primary bg-orange hover:bg-orange-dark text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-orange/50 transition-all duration-300"
            >
              Start Free Trial
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
