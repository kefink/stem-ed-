"use client";

import { useState } from "react";

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "National Robotics Curriculum - Kenya",
      category: "curriculum",
      description:
        "Designed and deployed CBC-aligned robotics curriculum for 50+ schools",
      impact: "10,000+ students trained",
      image: "🇰🇪",
    },
    {
      id: 2,
      title: "Teacher Certification Program",
      category: "training",
      description:
        "Certified 200+ educators in robotics pedagogy and AI integration",
      impact: "200+ certified teachers",
      image: "👨‍🏫",
    },
    {
      id: 3,
      title: "FLL Competition Preparation",
      category: "competition",
      description: "Coached 15 teams to regional and international FLL finals",
      impact: "3 national champions",
      image: "🏆",
    },
    {
      id: 4,
      title: "STEM Lab Infrastructure Design",
      category: "consulting",
      description: "Designed and equipped robotics labs for 30+ institutions",
      impact: "30+ labs operational",
      image: "🏗️",
    },
    {
      id: 5,
      title: "AI-Powered Learning Platform",
      category: "edtech",
      description: "Built custom LMS with AI-driven student progress tracking",
      impact: "5,000+ active users",
      image: "💻",
    },
    {
      id: 6,
      title: "VR Science Experiences",
      category: "edtech",
      description:
        "Developed immersive VR modules for chemistry and physics education",
      impact: "12 schools adopted",
      image: "🥽",
    },
    {
      id: 7,
      title: "Government STEM Strategy",
      category: "consulting",
      description: "Advised county government on 5-year STEM education roadmap",
      impact: "County-wide adoption",
      image: "🏛️",
    },
    {
      id: 8,
      title: "Student Innovation Hub",
      category: "programs",
      description:
        "Established maker space with 3D printing and IoT capabilities",
      impact: "500+ student projects",
      image: "🎓",
    },
  ];

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "curriculum", name: "Curriculum Design" },
    { id: "training", name: "Teacher Training" },
    { id: "competition", name: "Competitions" },
    { id: "consulting", name: "Consulting" },
    { id: "edtech", name: "EdTech" },
    { id: "programs", name: "Student Programs" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Proven track record of transforming STEM education across Africa
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-orange text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bebas mb-2">50+</div>
            <p className="font-lato">Schools Served</p>
          </div>
          <div>
            <div className="text-5xl font-bebas mb-2">10,000+</div>
            <p className="font-lato">Students Impacted</p>
          </div>
          <div>
            <div className="text-5xl font-bebas mb-2">200+</div>
            <p className="font-lato">Teachers Certified</p>
          </div>
          <div>
            <div className="text-5xl font-bebas mb-2">30+</div>
            <p className="font-lato">Labs Designed</p>
          </div>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-3 rounded-lg font-montserrat font-semibold transition-all duration-300 ${
                  activeFilter === cat.id
                    ? "bg-orange text-white shadow-lg scale-105"
                    : "bg-gray-100 text-navy hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-navy to-navy-light text-white p-8 text-center">
                  <div className="text-7xl mb-4">{project.image}</div>
                  <h3 className="text-2xl font-bebas">{project.title}</h3>
                </div>
                <div className="p-6">
                  <p className="font-lato text-gray-700 mb-4">
                    {project.description}
                  </p>
                  <div className="bg-orange/10 border-l-4 border-orange p-4 rounded-r-lg">
                    <p className="font-montserrat font-semibold text-navy">
                      Impact:
                    </p>
                    <p className="font-lato text-gray-800">{project.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Ready to Create Impact?
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Let's build your success story together
          </p>
          <a
            href="/contact"
            className="btn-primary bg-orange hover:bg-orange-dark"
          >
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  );
}
